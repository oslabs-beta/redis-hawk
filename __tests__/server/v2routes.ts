import request from 'supertest';
import { resolve } from 'path';
import { readFileSync } from 'fs';
import * as redis from 'redis';
import { promisify } from 'util'; //promisify some node-redis client functionality

import app from '../../server/server';
import redisMonitors from '../../server/redis-monitors/redis-monitors'

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

    return request(app).get('/obviously/bad/route')
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
        await model.client.set('db0-key2', 'value2');
        await model.client.set('db0-key3', 'value3');
        await model.client.set('db0-key4', 'value4');
        await model.client.select(2);
        await model.client.set('db2-key2', 'value2');
        await model.client.lpush('db2-key3', 'el2', 'el1');
        await model.client.lpush('db2-key4', 'el2', 'el1');
        await model.client.set('db2-key5', 'value5');
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
        response = await request(app).get('/api/v2/keyspaces?pageNum=2&pageSize=3');
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
            keyTotal: 4,
            pageSize: 3,
            pageNum: 2,
            data: expect.arrayContaining([expect.objectContaining({
              key: expect.any(String),
              value: expect.any(String),
              type: expect.any(String)
            })])
          }));

          expect(instanceDetail.keyspaces[2]).toEqual(expect.objectContaining({
            keyTotal: 4,
            pageSize: 3,
            pageNum: 2,
            data: expect.arrayContaining([expect.objectContaining({
              key: expect.any(String),
              type: expect.any(String)
            })])
          }));
        });
      });


    });

    //GET request for a specific keyspace
    describe('GET "/:instanceId/:dbIndex"', () => {
      
      let response: request.Response;
      beforeAll(async () => {
        response = await request(app).get('/api/v2/keyspaces/1/2?pageSize=3&pageNum=1&refreshScan=1&keynameFilter=key3&keytypeFilter=list');

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
            value: ['el1', 'el2'],
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
  });

  describe('/api/v2/events', () => {

    beforeAll(() => {
      //clear out any preceding events logged in the monitors
      for (const monitor of redisMonitors) {
        for (const keyspace of monitor.keyspaces) {
          keyspace.eventLog.reset();
        }
      }
    });

    describe('GET "/"', () => {

      let response: request.Response;
      beforeAll(async () => {

        //Emit 4 keyspace events for first 3 databases of each instance
        for (const model of redisModels) {
          for (let i = 0; i < 3; i++) {
            await model.client.select(i);
            await model.client.set('key1', 'wow');
            await model.client.get('key1');
            await model.client.lpush('key2', 'el1');
            await model.client.del('key1');
          }
        }

        response = await request(app).get('/api/v2/events');
      });

      it('should return a 200 status code', () => {
        expect(response.status).toEqual(200);
      })

      it('should respond with JSON', () => {
        expect(response.headers['content-type']).toEqual(
          expect.stringContaining('json')
        );
      });

      it('should respond with a data property of the proper length', () => {
        expect(response.body.data).toHaveLength(2);
      });

      it('should return a data array where each element is an object containing instanceId and keyspaces properties', () => {
        response.body.data.forEach((instanceDetail) => {
          expect(instanceDetail).toEqual(expect.objectContaining({
            instanceId: expect.any(Number),
            keyspaces: expect.any(Array)
          }));
        });
      });

      it('should capture and return, in the response body, any events that occured', () => {
        response.body.data.forEach(instanceDetail => {
          instanceDetail.keyspaces.forEach(keyspaceDetail => {

            expect(keyspaceDetail).toEqual(expect.objectContaining({
              eventTotal: 4,
              pageSize: 1, //default, as this was not specified in the request
              pageNum: 5, //default, as this was not specified in the request
              data: expect.any(Array)
            }));

            expect(keyspaceDetail.data).toHaveLength(4);
          });
        });
      });

      it('should return events in the correct order, of most to least recent', () => {
        response.body.data.forEach(instanceDetail => {
          instanceDetail.keyspaces.forEach(keyspaceDetail => {

            expect(keyspaceDetail.data[0].key).toEqual('key1');
            expect(keyspaceDetail.data[0].event).toEqual('del');

            expect(keyspaceDetail.data[1].key).toEqual('key2');
            expect(keyspaceDetail.data[1].event).toEqual('lpush');

            expect(keyspaceDetail.data[2].key).toEqual('key1');
            expect(keyspaceDetail.data[2].event).toEqual('get');

            expect(keyspaceDetail.data[3].key).toEqual('key1');
            expect(keyspaceDetail.data[3].event).toEqual('set');

            for (let i = 0; i < keyspaceDetail.data.length - 1; i++) {
              expect(keyspaceDetail.data[i].timestamp).toBeGreaterThanOrEqual(
                keyspaceDetail.data[i + 1].timestamp);
            }
          });
        });
      });

      it('should properly filter for keynames', () => {

        return request(app).get('/api/v2/events?refreshData=0&keynameFilter=2')
          .expect(200)
          .then(res => {
            res.body.data.forEach(instanceDetail => {
              instanceDetail.keyspaces.forEach(keyspace => {
                expect(keyspace).toEqual(expect.objectContaining({
                  eventTotal: 1,
                  data: expect.any(Array)
                }));

                expect(keyspace.data).toHaveLength(1);
              });
            });
          });
      });

      it('should properly filter for event types', () => {

        return request(app).get('/api/v2/events?refreshData=0&eventTypeFilter=del')
          .expect(200)
          .then(res => {
            res.body.data.forEach(instanceDetail => {
              instanceDetail.keyspaces.forEach(keyspace => {
                expect(keyspace).toEqual(expect.objectContaining({
                  eventTotal: 1,
                  data: expect.any(Array)
                }));

              expect(keyspace.data).toHaveLength(1);
            });
            });
          });
      });

      it('should grab the proper event subset based on pagination parameters', () => {

        return request(app).get('/api/v2/events?refreshData=0&pageSize=3&pageNum=1')
          .expect(200)
          .then(res => {
            res.body.data.forEach(instanceDetail => {
              instanceDetail.keyspaces.forEach(keyspace => {
                expect(keyspace.data).toHaveLength(3);
              })
            })
          });
      });
    });

    describe('GET "/:instanceId/:dbIndex"', () => {

      let response;
      beforeAll(async () => {

        for (const monitor of redisMonitors) {
          monitor.keyspaces.forEach(keyspace => {
            keyspace.eventLog.reset();
          })
        }

        //Test for instanceId 1, dbIndex 4
        const client = redisModels[0].client
        await client.select(4);
        await client.set('key1', 'cool');
        await client.set('key2', 'neato');
        await client.set('key3', 'rick beato');
        await client.lpush('key4', 'el2', 'el1');
        await client.del('key1');

        response = await request(app).get('/api/v2/events/1/4?pageSize=3');
      });

      it('should respond with a 200 status code', () => {
        expect(response.status).toEqual(200);
      });

      it('should respond with JSON', () => {
        expect(response.headers['content-type']).toEqual(
          expect.stringContaining('json')
        );
      });

      it('should contain the correct response body shape', () => {
        expect(response.body).toEqual(expect.objectContaining({
          eventTotal: expect.any(Number),
          pageSize: expect.any(Number),
          pageNum: expect.any(Number),
          data: expect.any(Array)
        }));
      });

      it('should contain the correct metadata values', () => {
        expect(response.body).toEqual(expect.objectContaining({
          eventTotal: 5,
          pageSize: 3,
          pageNum: 1 //default since it was not specified in the request
        }));
      });

      it('should contain the correct data for the three most recent events', () => {

        expect(response.body.data).toHaveLength(3);

        expect(response.body.data[0].key).toEqual('key1');
        expect(response.body.data[0].event).toEqual('del');

        expect(response.body.data[1].key).toEqual('key2');
        expect(response.body.data[1].event).toEqual('lpush');

        expect(response.body.data[2].key).toEqual('key1');
        expect(response.body.data[2].event).toEqual('get');
      });

      it('should respond with the correct page', () => {
        
        return request(app).get('/api/v2/events/1/4?pageSize=2&pageNum=2')
          .expect(200)
          .then(res => {
            expect(response.body.data).toHaveLength(2);
            expect(response.body.data[0].event).toEqual('get');
            expect(response.body.data[1].event).toEqual('set');
          });
      });

      it('should filter the response properly', () => {

        return request(app).get('/api/v2/events/1/4?pageSize=3&pageNum=1&keynameFilter=1&eventTypeFilter=set')
          .expect(200)
          .then(res => {

            expect(response.body).toEqual(expect.objectContaining({
              eventTotal: 1,
              pageNum: 2,
              pageSize: 2,
              data: expect.any(Array)
            }))
            expect(response.body.data).toHaveLength(1);
            expect(response.body.data[0]).toEqual(expect.objectContaining({
              key: 'key1',
              event: 'set'
            }));
          });
      });

      it('should handle event log data refreshing properly', async () => {

        await redisModels[0].client.set('newkey', 'doge');

        let response = await request(app).get('/api/v2/events?refreshData=0&keynameFilter=newk')
        expect(response.body).toEqual(expect.objectContaining({
          eventTotal: 0,
          data: []
        }));

        response = await request(app).get('/api/v2/events?refreshData=1&keynameFilter=newk')
        expect(response.body).toEqual(expect.objectContaining({
          eventTotal: 1,
          data: expect.arrayContaining([expect.objectContaining({
            key: 'newkey',
            event: 'set'
          })])
        }));
      });
    });
  });

});

const promisifyRedisClient = (redisClient: redis.RedisClient): redis.RedisClient => {
  redisClient.config = promisify(redisClient.config).bind(redisClient);
  redisClient.select = promisify(redisClient.select).bind(redisClient);
  redisClient.flushdb = promisify(redisClient.flushdb).bind(redisClient);
  redisClient.flushall = promisify(redisClient.flushall).bind(redisClient);

  redisClient.set = promisify(redisClient.set).bind(redisClient);
  redisClient.get = promisify(redisClient.get).bind(redisClient);
  redisClient.lpush = promisify(redisClient.lpush).bind(redisClient);
  redisClient.lrange = promisify(redisClient.lrange).bind(redisClient);

  return redisClient;
}
