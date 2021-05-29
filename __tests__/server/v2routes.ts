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
    
  })

  describe('/api/v2/keyspaces', () => {

    //GET request for all keyspaces across all instances
    describe('GET "/"', () => {

      let response;
      beforeAll(async () => {
        response = await request(app).get('/api/v2/keyspaces/');
      });

      it('should return a 200 status code', () => {
        expect(response.status).toEqual(200);
      })
    })


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
