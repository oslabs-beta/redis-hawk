import request from 'supertest';
import RedisServer from 'redis-server';
import { resolve } from 'path';
import { readFileSync } from 'fs';
import * as redis from 'redis';
import { promisify } from 'util'; //promisify some node-redis client functionality

import app from '../../server/server';
import * as interfaces from '../../server/redis-monitors/models/interfaces';

const testConnections = JSON.parse(readFileSync(resolve(__dirname, '../../server/configs/tests-config.json')).toString());

enum ENDPOINT_NAMES { KEYSPACES, KEYSPACE_HISTORIES, EVENTS, EVENT_TOTALS };


describe('Route Integration Tests', () => {

  type redisModel = {
    client: redis.RedisClient;
    host: string;
    port: number;
    instanceId: number;
  }
  let redisModels: redisModel[] = [];

  //Start test redis servers and corresponding clients
  beforeAll(async () => {

    let instanceId = 1;
    for (let conn of testConnections) {

      const redisClient = promisifyRedisClient(redis.createClient({ host: conn.host, port: conn.port }));
      
      const redisModel = {
        client: redisClient,
        host: conn.host,
        port: conn.port,
        instanceId: instanceId
      };

      redisModels.push(redisModel);

      instanceId += 1;
    }
  });

  afterAll(async () => {
    for (const redisModel of redisModels) {
      try {
        await redisModel.client.flushall();
      } catch (e) {
        console.log(`Error occured flushing databases: ${e}`);
      }
      redisModel.client.quit();
    }

    app.close();
  });

  it('should return a 404 status code for a request to a bad route', () => {

    return request(app).get('obviously/bad/route')
      .expect(404);
  })

  describe('/api/connections', () => {

    let response: request.Response;
    beforeAll(async () => {
      response = await request(app).get('/api/connections');
    });

    it('should respond with a 200 status code', () => {
      expect(response.status).toEqual(200);
    });

    it('should respond with JSON', () => {
      expect(response.headers['content-type']).toEqual(
        expect.stringContaining('json')
      );
    });

    it('should respond with a body with one instances property containing an array', () => {
      expect(response.body).toEqual(expect.objectContaining({
        instances: expect.any(Array)
      }));
    });

    it('should provide the correct connection details', () => {
      response.body.instances.forEach((instanceDetail, idx) => {

        //Each instance detail object in the response body
        //Should contain the corresponding instance object from the test connections JSON
        expect(instanceDetail).toEqual(expect.objectContaining(
          testConnections[idx]
        ));
        expect(instanceDetail.databases).toBeGreaterThanOrEqual(0);
      });
    });
  })

  describe('/api/v2/keyspaces', () => {

    //Perform Redis commands to be captured by the route
    beforeAll(async () => {
      for (const model of redisModels) {
        await model.client.set('db0-key1', 'value1');
        await model.client.select(2);
        await model.client.set('db2-key2', 'value2');
        await model.client.lpush('db2-key3', 'el1', 'el2');
        await model.client.lpush('db2-key4', 'el1', 'el2');
      }
    })

    afterAll(async () => {
      for (const model of redisModels) {
        await model.client.flushall();
      }
    });

    //GET request for all keyspaces across all instances
    describe('GET "/"', () => {

      let response: request.Response;
      beforeAll(async () => {
        response = await request(app).get('/api/v2/keyspaces?pageSize=12&pageNum=2');
      });

      it('should return a 200 status code', () => {
        expect(response.status).toEqual(200);
      });

      it('should respond with JSON', () => {
        expect(response.header['content-type']).toEqual(
          expect.stringContaining('json')
        );
      });

      it('should respond with a data object property of the proper length', () => {
        expect(response.body.data).toHaveLength(testConnections.length);
      });

      it('each object in the data array should have instanceId and keyspaces properties', () => {
        response.body.data.forEach((instanceDetail) => {
          expect(instanceDetail).toEqual(expect.objectContaining({
            instanceId: expect.any(Number),
            keyspaces: expect.any(Array)
          }));
        })
      })

      it('should provide the correct keyspace details', () => {

        //Technically, response body data also includes list data, but tests in a subsequent block will cover this
        response.body.data.forEach(instanceDetail => {
          expect(instanceDetail.keyspaces[0]).toEqual(expect.objectContaining({
            keyTotal: 1,
            pageSize: 12,
            pageNum: 2,
            data: [{key: 'db0-key1', value: 'value1', type: 'string'}]
          }));

          expect(instanceDetail.keyspaces[2]).toEqual(expect.objectContaining({
            keyTotal: 1,
            pageSize: 12,
            pageNum: 2,
            data: [{key: 'db2-key2', value: 'value2', type: 'string'}]
          }));
        });
      });


    });

    //GET request for a specific keyspace
    describe('GET "/:instanceId/:dbIndex"', () => {
      
      let response: request.Response;
      beforeAll(async () => {
        response = await request(app).get('/api/v2/keyspaces/1/2&pageSize=3&pageNum=1&refreshScan=1&keynameFilter=key3&keytypeFilter=list');

        //Add extra values to test assertions of the refreshScan query parameter
        await redisModels[0].client.select(1);
        await redisModels[0].client.set('newkey', 'val');
      });

      it('should contain the correct properties in the response', () => {
        expect(response.body).toEqual(expect.objectContaining({
          keyTotal: expect.any(Number),
          pageSize: expect.any(Number),
          pageNum: expect.any(Number),
          data: expect.any(Array)
        }))
      });

      it('should change the keyTotal property to reflect the number of keys in the keyspace based on the filters', () => {
        expect(response.body.keyTotal).toEqual(1);
      });

      it('should respond with the correct values', () => {
        expect(response.body).toEqual(expect.objectContaining({
          keyTotal: 1,
          pageSize: 3,
          pageNum: 1,
          data: [{
            key: 'db2-key3',
            value: ['el1, el2'],
            type: 'list'
          }]
        }));
      });

      it('should not reflect newly added values into Redis if refreshScan is 0', async () => {
        
        const response = await request(app).get('/api/v2/keyspaces/1/1?refreshScan=0&keynameFilter=newkey');

        expect(response.body).toEqual(expect.objectContaining({
          keyTotal: 0,
          data: []
        }));
      });

      it('should reflect newly added values into Redis if refreshScan is 1', async () => {

        const response = await request(app).get('/api/v2/keyspaces/1/1?refreshScan=1&keynameFilter=newkey');
        expect(response.body).toEqual(expect.objectContaining({
          keyTotal: 1,
          data: [{key: 'newkey', value: 'val', type: 'string'}]
        }));
      });
    });
  })

});

const promisifyRedisClient = (redisClient: redis.RedisClient): redis.RedisClient => {
  redisClient.config = promisify(redisClient.config).bind(redisClient);
  redisClient.select = promisify(redisClient.select).bind(redisClient);
  redisClient.flushdb = promisify(redisClient.flushdb).bind(redisClient);
  redisClient.flushall = promisify(redisClient.flushall).bind(redisClient);

  redisClient.set = promisify(redisClient.set).bind(redisClient);
  redisClient.get = promisify(redisClient.get).bind(redisClient);

  return redisClient;
}
