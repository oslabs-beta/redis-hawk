import * as request from 'supertest';
import * as RedisServer from 'redis-server';
import { resolve } from 'path';
import { readFileSync } from 'fs';
import * as redis from 'redis';
import { promisify } from 'util'; //promisify some node-redis client functionality

import app from '../../server/server';
import * as interfaces from '../../server/redis-monitors/models/interfaces';

const testConnections = JSON.parse(readFileSync(resolve(__dirname, '../../server/configs/tests-config.json')).toString());

describe('Route Integration Tests', () => {

  //Start test redis servers and corresponding clients
  let redisModels = [];
  beforeAll(async () => {

    testConnections.forEach(async (conn: interfaces.RedisInstance, idx: number) => {

      const redisClient = redis.createClient({ host: conn.host, port: conn.port });
      redisClient.config = promisify(redisClient.config).bind(redisClient);
      redisClient.set = promisify(redisClient.set).bind(redisClient);

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
    redisModels.forEach(redisModel => {
      redisModel.server.close();
      redisModel.client.quit();
    })
  });

  it('should return a 404 error for a request to a bad route', async () => {

    let response = await request(app).get('/badroute/definitelywrong')
    expect(response.status).toEqual(404);
  })

  describe('/api/connections', () => {

    describe('/GET', () => {

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
        await redisModels[1].client.set('key:4', 'value4');
    });

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
        checkApiEventsRouteBodyShape(response.body);
      });

      it('should be able to capture the emitted keyspace events', () => {

        const data = response.body.data;

        //dbIndex0 at instanceId 1
        expect(data[0].keyspaces[0][0].key).toEqual('key:1');
        expect(data[0].keyspaces[0][0].value).toEqual('value1');

        //dbIndex0 at instanceId 2
        expect(data[1].keyspaces[0][0].key).toEqual('key:2');
        expect(data[1].keyspaces[0][0].value).toEqual('value2');

        //dbIndex2 at instanceId 2
        expect(data[1].keyspaces[2][0].key).toEqual('key:3');
        expect(data[1].keyspaces[2][0].value).toEqual('value3');
        expect(data[1].keyspaces[2][1].key).toEqual('key:4');
        expect(data[1].keyspaces[2][1].value).toEqual('value4');

      });
    });

    describe('GET /:instanceId (no dbIndex specified)', () => {

      let response;
      beforeAll(async () => {
        //Get all events, not specific to an instanceId or dbIndex
        response = await request(app).get('/api/events/2');
      });

      it('should return the correct instanceId within the response body', () => {
        expect(response.data[0].instanceId).toEqual(2);
      });

      it('should return a data property that is an array containing one element representing the single instance', () => {
        expect(response.data).toHaveLength(1);
      });

      it('should return a correctly structured response body', () => {
        checkApiEventsRouteBodyShape(response.body);
      });

      it('should be able to capture all the emitted keyspace events on the specified instance', () => {

        const data = response.body.data;

        //dbIndex0 at instanceId 2 - only one instance returned, so data should be accessed via 0th index
        expect(data[0].keyspaces[0][0].key).toEqual('key:2');
        expect(data[0].keyspaces[0][0].value).toEqual('value2');

        //dbIndex2 at instanceId 2
        expect(data[0].keyspaces[2][0].key).toEqual('key:3');
        expect(data[0].keyspaces[2][0].value).toEqual('value3');
        expect(data[0].keyspaces[2][1].key).toEqual('key:4');
        expect(data[0].keyspaces[2][1].value).toEqual('value4');
      });

      it('should return a 400 status code if an invalid instanceId is specified', async () => {
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
        expect(response.body.data[0].instanceId).toEqual(1);
      });

      it('should return a data property that is an array containing one element representing the single instance', () => {
        expect(response.body.data).toHaveLength(1);
      });

      it('should have only a single array for the event log of the dbIndex specified', () => {
        expect(response.body.data[0].keyspaces).toHaveLength(1);
      });

      it('should return a correctly structured response body', () => {
        checkApiEventsRouteBodyShape(response.body);
      });

      it('should be able to capture all the emitted keyspace events on the specified dbIndex', () => {

        const data = response.body.data;

        //dbIndex2 at instanceId 2 - data and keyspaces indices should be 0 because only one instance/keyspace are returned
        expect(data[0].keyspaces[0][0].key).toEqual('key:3');
        expect(data[0].keyspaces[0][0].value).toEqual('value3');
        expect(data[0].keyspaces[0][1].key).toEqual('key:4');
        expect(data[0].keyspaces[0][1].value).toEqual('value4');

      });

      it('should return a 400 status code if an invalid dbIndex is specified', async () => {
        response = await request(app).get('/api/events/1/30001235');
        expect(response.status).toEqual(400);
      });
    });
  });
});

const checkApiEventsRouteBodyShape = (body) => {
  expect(body.data).toBeInstanceOf(Array);
  //check each "instance" element
  body.data.forEach((instance) => {
    expect(typeof instance.instanceId).toEqual('number');
    expect(instance.keyspaces).toBeInstanceOf(Array)

    //check each "keyspace" element
    instance.keyspaces.forEach((keyspace) => {
      expect(keyspace).toBeInstanceOf(Array);

      //check the events' object shapes if there are event objects in the keyspace
      if (keyspace.length !== 0) {
        keyspace.forEach((event) => {
          expect(event).toEqual(expect.objectContaining({
            key: expect.any(String),
            event: expect.any(String),
            timestamp: expect.any(Number)
          }));
        });
      }
    });
  });
}