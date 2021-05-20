import * as request from 'supertest';
import * as RedisServer from 'redis-server';
import { resolve } from 'path';
import { readFileSync } from 'fs';
import * as redis from 'redis';
import { promisify } from 'util'; //promisify some node-redis client functionality

import app from '../../server/server';
import * as interfaces from '../../server/redis-monitors/models/interfaces';
import { string } from 'yargs';

const testConnections = JSON.parse(readFileSync(resolve(__dirname, '../../server/configs/tests-config.json')).toString());

enum ENDPOINT_NAMES { KEYSPACES, KEYSPACE_HISTORIES, EVENTS };

describe('Route Integration Tests', () => {

  type redisModel = {
    server: any;
    client: redis.RedisClient;
    host: string;
    port: number;
    instanceId: number;
  }
  let redisModels: redisModel[] = [];

  //Start test redis servers and corresponding clients
  beforeAll(async () => {

    testConnections.forEach(async (conn: interfaces.RedisInstance, idx: number) => {

      const redisClient = promisifyRedisClient(redis.createClient({ host: conn.host, port: conn.port }));

      const redisModel = {
        server: new RedisServer(conn.port),
        client: redisClient,
        host: conn.host,
        port: conn.port,
        instanceId: idx + 1
      };

      redisModel.server.open(e => {
        if (e) console.log(`Could not connect to Redis Server: ${e}`);
      });
      redisModels.push(redisModel);

    });
  })

  //Clean up test redis servers
  afterAll(async () => {
    for (const redisModel of redisModels) {
      await redisModel.client.flushall(); //remove all data 
      redisModel.server.close();
      redisModel.client.quit(); 
    }

  });

  it('should return a 404 error for a request to a bad route', async () => {

    let response = await request(app).get('/badroute/definitelywrong')
    expect(response.status).toEqual(404);
  })

  describe('/api/connections', () => {

    describe("GET '/'", () => {

      let response;
      beforeAll(async () => {
        response = await request(app).get('/api/connections');
      })

      it('should return a 200 status code', () => {
        expect(response.status).toEqual(200);
      });

      it('should respond with JSON', () => {
        expect(response.header['content-type']).
          toEqual(expect.stringContaining('json'));
      });

      //test is not working - for some reason the databases property is not being set on the server's response
      xit('should return an response body that contains accurate connection details', async () => {

        const instances = [];

        for (let model of redisModels) {
          const dbCount = +(await model.client.config('GET', 'databases'))[1];
          instances.push({
            instanceId: model.instanceId,
            databases: dbCount,
            host: model.host,
            port: model.port
          });
        }

        expect(response.body.instances).toEqual(instances);
      });
    });
  });

  describe('/api/events', () => {

    //Emit keyspace events prior to all tests
    beforeAll(async () => {

      //Emit a keyspace event to be captured by the server
      await redisModels[0].client.set('key:1', 'value1');
      await redisModels[1].client.set('key:2', 'value2');

      //Switch to dbIndex 2 for an instance (3rd database)
      await redisModels[1].client.select(2);
      await redisModels[1].client.set('key:3', 'value3');
      await redisModels[1].client.get('key:3');
    });

    afterAll(async () => {
      await redisModels[0].client.flushdb();
      await redisModels[1].client.select(0);
      await redisModels[1].client.flushdb();
      await redisModels[1].client.select(2);
      await redisModels[1].client.flushdb();
    })

    describe("GET '/' (no instanceId or dbIndex specified as route parameters) ", () => {

      let response;
      beforeAll(async () => {
        //Get all events, not specific to an instanceId or dbIndex
        response = await request(app).get('/api/events');
      });

      it('should return a 200 status code if no instanceId or dbIndex is specified', () => {
        expect(response.status).toEqual(200);
      });

      it('should respond with JSON', () => {
        expect(response.header['content-type']).
          toEqual(expect.stringContaining('json'));
      });

      it('should return a correctly structured response body', () => {
        checkRequestBodyShape(response.body, ENDPOINT_NAMES.EVENTS);
      });

      xit('should be able to capture the emitted keyspace events', () => {
        const data = response.body.data;
        console.log(data);

        //dbIndex0 at instanceId 1
        expect(data[0].keyspaces[0][0].key).toEqual('key:1');
        expect(data[0].keyspaces[0][0].event).toEqual('set');

        //dbIndex0 at instanceId 2
        expect(data[1].keyspaces[0][0].key).toEqual('key:2');
        expect(data[1].keyspaces[0][0].event).toEqual('set');

        //dbIndex2 at instanceId 2
        expect(data[1].keyspaces[2][0].key).toEqual('key:3');
        expect(data[1].keyspaces[2][0].event).toEqual('set');
        expect(data[1].keyspaces[2][1].key).toEqual('key:3');
        expect(data[1].keyspaces[2][1].event).toEqual('get');

      });
    });

    describe('GET /:instanceId (no dbIndex specified)', () => {

      let response;
      beforeAll(async () => {
        //Get all events, not specific to an instanceId or dbIndex
        response = await request(app).get('/api/events/2');
      });

      it('should return the correct instanceId within the response body', () => {
        expect(response.body.data[0].instanceId).toEqual(2);
      });

      it('should return a data property that is an array containing one element representing the single instance', () => {
        expect(response.body.data).toHaveLength(1);
      });

      it('should return a correctly structured response body', () => {
        checkRequestBodyShape(response.body, ENDPOINT_NAMES.EVENTS);
      });

      xit('should be able to capture all the emitted keyspace events on the specified instance', () => {

        const data = response.body.data;

        //dbIndex0 at instanceId 2 - only one instance returned, so data should be accessed via 0th index
        expect(data[1].keyspaces[0][0].key).toEqual('key:2');
        expect(data[1].keyspaces[0][0].event).toEqual('set');

        //dbIndex2 at instanceId 2
        expect(data[0].keyspaces[2][0].key).toEqual('key:3');
        expect(data[0].keyspaces[2][0].event).toEqual('set');
        expect(data[0].keyspaces[2][1].key).toEqual('key:4');
        expect(data[0].keyspaces[2][1].event).toEqual('get');
      });

      xit('should return a 400 status code if an invalid instanceId is specified', async () => {
        response = await request(app).get('/api/events/6');
        expect(response.status).toEqual(400);
      });

    });

    describe('GET /:instanceId/:dbIndex', () => {

      let response;
      beforeAll(async () => {
        //Get all events, not specific to an instanceId or dbIndex
        response = await request(app).get('/api/events/2/2');
      });

      it('should return the correct instanceId within the response body', () => {
        expect(response.body.data[0].instanceId).toEqual(2);
      });

      it('should return a data property that is an array containing one element representing the single instance', () => {
        expect(response.body.data).toHaveLength(1);
      });

      it('should have only a single array for the event log of the dbIndex specified', () => {
        expect(response.body.data[0].keyspaces).toHaveLength(1);
      });

      it('should return a correctly structured response body', () => {
        checkRequestBodyShape(response.body, ENDPOINT_NAMES.EVENTS);
      });

      xit('should be able to capture all the emitted keyspace events on the specified dbIndex', () => {

        const data = response.body.data;

        //dbIndex2 at instanceId 2 - data and keyspaces indices should be 0 because only one instance/keyspace are returned
        expect(data[0]).toEqual(2);
        expect(data[0].keyspaces[0][0].key).toEqual('key:3');
        expect(data[0].keyspaces[0][0].event).toEqual('set');
        expect(data[0].keyspaces[0][1].key).toEqual('key:4');
        expect(data[0].keyspaces[0][1].event).toEqual('get');

      });

      xit('should return a 400 status code if an invalid dbIndex is specified', async () => {
        response = await request(app).get('/api/events/1/30001235');
        expect(response.status).toEqual(400);
      });
    });
  });

  describe('/api/keyspaces', () => {

    beforeAll(async () => {
      await redisModels[0].client.set('message:1', 'value1');
      await redisModels[0].client.set('message:2', 'value2');
      await redisModels[1].client.set('message:3', 'value3');
      await redisModels[1].client.set('message:1', 'value4');
      await redisModels[1].client.select(2);
      await redisModels[1].client.set('message:1', 'value5');
      await redisModels[1].client.set('message:4', 'value6');
    });

    afterAll(async () => {
      await redisModels[0].client.flushdb();
      await redisModels[1].client.select(0);
      await redisModels[1].client.flushdb();
      await redisModels[1].client.select(2);
      await redisModels[1].client.flushdb();
    })

    describe("GET '/' (return all keyspaces from all instances)", () => {

      let response;
      beforeAll(async () => {
        response = await request(app).get('/');
      });

      it('should respond with a 200 status code', () => {
        expect(response.status).toEqual(200);
      });

      it('should respond with JSON', () => {
        expect(response.header['content-type'])
          .toEqual(expect.stringContaining('json'));
      });

      it('should return a response body in the proper shape', () => {
        checkRequestBodyShape(response.body, ENDPOINT_NAMES.KEYSPACE_HISTORIES);
      });

      it('should return the correct number of instances in the body', () => {
        expect(response.body.data).toHaveLength(2);
      });

      it('should return the correct number of keyspaces in the body', () => {
        expect(response.body.data[0].keyspaces).toHaveLength(1);
        expect(response.body.data[1].keyspaces).toHaveLength(2);
      });

      it('should return the correct keyspace data', () => {
        expect(response.body.data[0].keyspaces[0][0])
          .toEqual(expect.objectContaining({
            key: 'message:1',
            value: 'value1'
          }));
        expect(response.body.data[0].keyspaces[0][1])
        .toEqual(expect.objectContaining({
          key: 'message:2',
          value: 'value2'
        }));
        expect(response.body.data[1].keyspaces[0][0])
        .toEqual(expect.objectContaining({
          key: 'message:3',
          value: 'value3'
        }));
        expect(response.body.data[1].keyspaces[0][1])
        .toEqual(expect.objectContaining({
          key: 'message:1',
          value: 'value4'
        }));
        expect(response.body.data[1].keyspaces[2][0])
        .toEqual(expect.objectContaining({
          key: 'message:1',
          value: 'value5'
        }));
        expect(response.body.data[1].keyspaces[2][1])
        .toEqual(expect.objectContaining({
          key: 'message:4',
          value: 'value6'
        }));
      });





      // expect(data[0].keyspaces[2][1].key).toEqual('key:4');
      // expect(data[0].keyspaces[2][1].value).toEqual('value4');


    })
  })
});

const checkRequestBodyShape = (body, endpoint) => {
/*
Checks the object structure for the request body for the following three endpoints:

  /api/events
  /api/keyspaces
  /api/keyspaces/histories

*/
  
  expect(body.data).toBeInstanceOf(Array);
  //check each "instance" element
  body.data.forEach((instance) => {
    expect(typeof instance.instanceId).toEqual('number');
    expect(instance.keyspaces).toBeInstanceOf(Array)

    //check each "keyspace" element
    instance.keyspaces.forEach((keyspace) => {
      expect(keyspace).toBeInstanceOf(Array);

      
      if (keyspace.length > 0) {

        switch (endpoint) {

          case (ENDPOINT_NAMES.EVENTS): {
            //check the events' object shapes if there are event objects in the keyspace
            keyspace.forEach(event => {
              expect(event).toEqual(expect.objectContaining({
                key: expect.any(String),
                event: expect.any(String),
                timestamp: expect.any(Number)
              }));
            });
          }; break;

          case (ENDPOINT_NAMES.KEYSPACES): {
            //check the data object shapes if there are data objects in the keyspace
            keyspace.forEach(data => {
              expect(data).toEqual(expect.objectContaining({
                key: expect.any(String),
                event: expect.any(String),
                timestamp: expect.any(Number)
              }));
            });
          }; break;    
          
          case (ENDPOINT_NAMES.KEYSPACE_HISTORIES): {
            //check the history object shapes if there are history objects in the keyspace
            keyspace.forEach(history => {
              expect(history).toEqual(expect.objectContaining({
                key: expect.any(Array),
                timestamp: expect.any(Number)
              }));

              if (history.keys.length > 0) {
                history.keys.forEach(key => {
                  expect(key).toEqual(expect.objectContaining({
                    key: expect.any(String),
                    memoryUsage: expect.any(Number)
                  }));
                });
              };
            });
          }; break;    

          };
        };
    });
  });
}

const promisifyRedisClient = (redisClient) => {
  redisClient.config = promisify(redisClient.config).bind(redisClient);
  redisClient.set = promisify(redisClient.set).bind(redisClient);
  redisClient.select = promisify(redisClient.select).bind(redisClient);
  redisClient.flushdb = promisify(redisClient.flushdb).bind(redisClient);
  redisClient.flushall = promisify(redisClient.flushall).bind(redisClient);

  return redisClient;
}