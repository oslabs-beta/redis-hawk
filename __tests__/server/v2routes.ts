import request from 'supertest';
import { resolve } from 'path';
import { readFileSync } from 'fs';
import * as redis from 'redis';
import { promisify } from 'util'; //promisify some node-redis client functionality

import app from '../../server/server';
import redisMonitors from '../../server/redis-monitors/redis-monitors'
import { recordKeyspaceHistory } from '../../server/redis-monitors/utils';

const testConnections = JSON.parse(readFileSync(resolve(__dirname, '../../server/configs/tests-config.json')).toString());

enum ENDPOINT_NAMES { KEYSPACES, KEYSPACE_HISTORIES, EVENTS, EVENT_TOTALS };

describe('Route Integration Tests', () => {

  type RedisModel = {
    client: redis.RedisClient;
    host: string;
    port: number;
    instanceId: number;
    recordKeyspaceHistoryFrequency: number;
  }
  let redisModels: RedisModel[] = [];

  //Start test redis servers and corresponding clients
  beforeAll(async () => {

    let instanceId = 1;
    for (let conn of testConnections) {

      const redisClient = promisifyRedisClient(redis.createClient({ host: conn.host, port: conn.port }));
      await redisClient.config('SET', 'notify-keyspace-events', 'KEA');
      
      const redisModel = {
        client: redisClient,
        host: conn.host,
        port: conn.port,
        instanceId: instanceId,
        recordKeyspaceHistoryFrequency: conn.recordKeyspaceHistoryFrequency
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

      //clear out any logs in the monitors
      for (const monitor of redisMonitors) {
        for (const keyspace of monitor.keyspaces) {
          keyspace.eventLog.reset();
          keyspace.keyspaceHistories.reset()
        }
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


  describe('/api/v2/keyspaces/histories', () => {

    afterAll(() => {
      for (const monitor of redisMonitors) {
        for (const keyspace of monitor.keyspaces) {
          keyspace.eventLog.reset();
          keyspace.keyspaceHistories.reset();
        }
      }
    });

    describe('GET /:instanceId/:dbIndex', () => {

      describe('Without query parameters', () => {
      
        let response;
        beforeAll(async () => {
          /*
            Utilizes mock timers to periodically use Redis commands and record them at different time intervals
            After commands are performed, sends request to grab keyspace history.
          */

          //Clear out any existing keyspace histories
          for (const monitor of redisMonitors) {
            for (const keyspace of monitor.keyspaces) {
              keyspace.keyspaceHistories.reset();
            }
          }

          let monitor;
          redisMonitors.forEach((redisMonitor) => {
            if (redisMonitor.instanceId === redisModels[0].instanceId) {
              monitor = redisMonitor;
            }
          })

          const client = redisModels[0].client;
          await client.select(0);
          await client.set('key1', 'val');
          await client.set('key2', 'val2');
          await client.lpush('key3', 'el3', 'el2', 'el1');
    
          await recordKeyspaceHistory(monitor, 0);

          
          await client.set('key4', 'val');
          await client.set('key5', 'val2');
          await client.lpush('key6', 'el3', 'el2', 'el1');
          await recordKeyspaceHistory(monitor, 0);

          await client.del('key6');      
          await recordKeyspaceHistory(monitor, 0);

          response = await request(app).get('/api/v2/keyspaces/histories/1/0');
        });

        afterAll(async () => {
          for (const monitor of redisMonitors) {
            for (const keyspace of monitor.keyspaces) {
              keyspace.keyspaceHistories.reset();
            }
          }

          for (const model of redisModels) {
            await model.client.flushall();
          }
        });

        it('should respond with a 200 status code and JSON', async () => {
          expect(response.status).toEqual(200);
          expect(response.headers['content-type']).toEqual(
            expect.stringContaining('json')
          );
        });

        //Mocks passage of time in order to test the correct historyCount
        it('should have return the correct number of histories recorded', () => {
          expect(response.body.historyCount).toEqual(3);
          expect(response.body.histories).toHaveLength(3);
        });

        it('should return the correct data in the histories property', () => {

          const histories = response.body.histories;
          expect(histories[2].keyCount).toEqual(3);
          expect(histories[1].keyCount).toEqual(6);
          expect(histories[0].keyCount).toEqual(5);

          histories.forEach(history => {
            expect(history.timestamp).toBeLessThanOrEqual(Date.now());
            expect(history.timestamp).toBeGreaterThanOrEqual(
              Date.now() - redisModels[0].recordKeyspaceHistoryFrequency * 4
            );
            expect(history.memoryUsage).toBeGreaterThan(0);
          });
        });

        it('should order the histories from newest to oldest', () => {

          const histories = response.body.histories;
          expect(histories[0].timestamp).toBeGreaterThanOrEqual(histories[1].timestamp);
          expect(histories[1].timestamp).toBeGreaterThanOrEqual(histories[2].timestamp);
        });

      });

      describe('Handling query parameters', () => {

        let response;
        beforeAll(async () => {

          //Clear out any existing keyspace histories
          for (const monitor of redisMonitors) {
            for (const keyspace of monitor.keyspaces) {
              keyspace.keyspaceHistories.reset();
            }
          }

          let monitor;
          redisMonitors.forEach((redisMonitor) => {
            if (redisMonitor.instanceId === redisModels[0].instanceId) {
              monitor = redisMonitor;
            }
          })

          const client = redisModels[0].client;
          await client.select(3);
          await client.set('key1', 'val');
          await client.set('key2', 'val');
    
          await recordKeyspaceHistory(monitor, 3);

          await client.set('beep3', 'val');
          await recordKeyspaceHistory(monitor, 3);

          await client.set('beep4', 'val');
          await recordKeyspaceHistory(monitor, 3);

          response = await request(app).get(`/api/v2/keyspaces/histories/${redisModels[0].instanceId}/3?historiesCount=1&keynameFilter=beep`);
        });

        afterAll(async () => {

          for (const monitor of redisMonitors) {
            for (const keyspace of monitor.keyspaces) {
              keyspace.keyspaceHistories.reset();
            }
          }
          for (const model of redisModels) {
            await model.client.flushall();
          }
        });

        it('should give the right number of histories based on the historiesCount parameter', () => {
          expect(response.body.histories).toHaveLength(2);
        });

        it('should return the new historyCount from the redisMonitor process', () => {
          expect(response.body.historyCount).toEqual(3);
        })

        it('the keycounts should reflect the keynameFilter specified', () => {
          expect(response.body.histories[0].keyCount).toEqual(2);
          expect(response.body.histories[1].keyCount).toEqual(1);
        });
      });
    });

  })

  describe('/api/v2/events', () => {

    describe('GET "/"', () => {

      let response: request.Response;
      beforeAll(async () => {

        //Emit 4 keyspace events for first 3 databases of each instance
        for (const model of redisModels) {
          for (let i = 0; i < 3; i++) {
            await model.client.select(i);
            await model.client.set('key1', 'wow');
            await model.client.set('key3', 'wow3');
            await model.client.lpush('key2', 'el1');
            await model.client.del('key1');

            const res = await model.client.get('key3');
          }
        }

        response = await request(app).get('/api/v2/events');
      });

      afterAll(async () => {
        for (const model of redisModels) {
          await model.client.flushall();
        }

        for (const monitor of redisMonitors) {
          for (const keyspace of monitor.keyspaces) {
            keyspace.eventLog.reset();
          }
        }
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

          for (let i = 0; i < 3; i++) {
            const keyspaceDetail = instanceDetail.keyspaces[i];
            expect(keyspaceDetail).toEqual(expect.objectContaining({
              eventTotal: 4,
              pageSize: 5, //default, as this was not specified in the request
              pageNum: 1, //default, as this was not specified in the request
              data: expect.any(Array)
            }));

            expect(keyspaceDetail.data).toHaveLength(4);
          }
        });
      });

      it('should return events in the correct order, of most to least recent', () => {
        response.body.data.forEach(instanceDetail => {

          for (let i = 0; i < 3; i++) {
            const keyspaceDetail = instanceDetail.keyspaces[i];

            expect(keyspaceDetail.data[0].key).toEqual('key1');
            expect(keyspaceDetail.data[0].event).toEqual('del');

            expect(keyspaceDetail.data[1].key).toEqual('key2');
            expect(keyspaceDetail.data[1].event).toEqual('lpush');

            expect(keyspaceDetail.data[2].key).toEqual('key3');
            expect(keyspaceDetail.data[2].event).toEqual('set');

            expect(keyspaceDetail.data[3].key).toEqual('key1');
            expect(keyspaceDetail.data[3].event).toEqual('set');

            for (let i = 0; i < keyspaceDetail.data.length - 1; i++) {
              expect(keyspaceDetail.data[i].timestamp).toBeGreaterThanOrEqual(
                keyspaceDetail.data[i + 1].timestamp);
            }
          }
        });
      });

      it('should properly filter for keynames', async () => {

        const res = await request(app).get('/api/v2/events?refreshData=0&keynameFilter=2');
        res.body.data.forEach(instanceDetail => {
          for (let i = 0; i < 3; i++) {

            const keyspace = instanceDetail.keyspaces[i];
            expect(keyspace).toEqual(expect.objectContaining({
              eventTotal: 1,
              data: expect.any(Array)
            }));

            expect(keyspace.data).toHaveLength(1);
          }
        });
      });
      
      it('should properly filter for event types', async () => {

        const res = await request(app).get('/api/v2/events?refreshData=0&eventTypeFilter=del');

        res.body.data.forEach(instanceDetail => {

          for (let i = 0; i < 3; i++) {
            const keyspace = instanceDetail.keyspaces[i];

            expect(keyspace).toEqual(expect.objectContaining({
              eventTotal: 1,
              data: expect.any(Array)
            }));

            expect(keyspace.data).toHaveLength(1);

          }
        });
      });

      it('should grab the proper event subset based on pagination parameters', async () => {

        const res = await request(app).get('/api/v2/events?refreshData=0&pageSize=3&pageNum=1');

        res.body.data.forEach(instanceDetail => {
          for (let i = 0; i < 3; i++) {
            const keyspace = instanceDetail.keyspaces[i];
            expect(keyspace.data).toHaveLength(3);
          }
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

      afterAll(async () => {
        for (const model of redisModels) {
          await model.client.flushall();
        }

        for (const monitor of redisMonitors) {
          for (const keyspace of monitor.keyspaces) {
            keyspace.eventLog.reset();
          }
        }
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

        expect(response.body.data[1].key).toEqual('key4');
        expect(response.body.data[1].event).toEqual('lpush');

        expect(response.body.data[2].key).toEqual('key3');
        expect(response.body.data[2].event).toEqual('set');
      });

      it('should respond with the correct page', async () => {
    
        const response = await request(app).get('/api/v2/events/1/4?pageSize=2&pageNum=2');
        expect(response.body.data).toHaveLength(2);
        expect(response.body.data[0].event).toEqual('set');
        expect(response.body.data[1].event).toEqual('set');

      });

      it('should filter the response properly', async () => {

        const response = await request(app).get('/api/v2/events/1/4?pageSize=3&pageNum=1&keynameFilter=1&eventTypeFilter=set');
        
        expect(response.body).toEqual(expect.objectContaining({
          eventTotal: 1,
          pageNum: 1,
          pageSize: 3,
          data: expect.any(Array)
        }));

        expect(response.body.data).toHaveLength(1);
        expect(response.body.data[0]).toEqual(expect.objectContaining({
          key: 'key1',
          event: 'set'
        }));
      });

      it('should handle event log data refreshing properly', async () => {

        await redisModels[0].client.select(4);
        await redisModels[0].client.set('newkey', 'doge');

        let response = await request(app).get('/api/v2/events/1/4?refreshData=0&keynameFilter=newk')
        expect(response.body).toEqual(expect.objectContaining({
          eventTotal: 0,
          data: []
        }));

        response = await request(app).get('/api/v2/events/1/4?refreshData=1&keynameFilter=newk')
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

  describe('/api/v2/events/totals', () => {

   describe('GET "/:instanceId/:dbIndex"', () => {

      it('should return a 400 status code if no timeInterval or eventTotal parameter is specified', async () => {
        const client = redisModels[0].client;
        await client.select(0);
        await client.set('oops', 'i did it again')
        const response = await request(app).get(`/api/v2/events/totals/${redisModels[0].instanceId}/0`);
        expect(response.status).toEqual(400);
      })

      describe('with timeInterval parameter', () => {

        let response;
        beforeAll(async () => {

          const timeInterval = 200;

          const client = redisModels[0].client;
          await client.select(4);

          //Emit some events immediately to be captured and manually pass time to allow events to occur
          await client.set('key1', 'val');
          await client.lpush('key2', 'el2', 'el1');
          await client.del('key1');
          await delay(timeInterval);

          //emit a second set events
          await client.set('key1', 'newval');
          await client.rpush('key3', 'el1', 'el2');
          await delay(timeInterval);

          //Emit a third set of events
          await client.del('key1');
          await client.del('key3');
          await client.set('key4', 'hellowurld');
          await client.set('wow', 'money');
          await delay(timeInterval);

          //Send a response to capture events
          response = await request(app).get(`/api/v2/events/totals/${redisModels[0].instanceId}/4?timeInterval=${timeInterval * 1.1}`);
        });

        afterAll(async () => {
          await redisModels[0].client.flushall();

          for (const monitor of redisMonitors) {
            monitor.keyspaces[4].eventLog.reset();
          }
        });

        it('should respond with a 200 status code and JSON', () => {
          expect(response.status).toEqual(200);
          expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
        });

        it('should respond with the correct eventTotal', () => {
          expect(response.body.eventTotal).toEqual(9);
        });

        it('should respond with the correct number of eventTotals intervals', () => {
          expect(response.body.eventTotals).toHaveLength(3);
        })

        it('should order each eventTotal from most recent to least recent', () => {
          const totals = response.body.eventTotals;
          for (let i = 0; i < 2; i++) {
            expect(totals[i].start_time).toBeGreaterThanOrEqual(totals[i + 1].start_time);
            expect(totals[i].end_time).toBeGreaterThanOrEqual(totals[i + 1].end_time);
          }
        })

        it('should capture the correct eventCount for each interval', () => {
          const totals = response.body.eventTotals;

          expect(totals[0].eventCount).toEqual(4);
          expect(totals[1].eventCount).toEqual(2);
          expect(totals[2].eventCount).toEqual(3);
        });
      });

      describe('with eventTotal parameter', () => {


        let response;
        beforeAll(async () => {

          const client = redisModels[0].client;
          await client.select(2);
          for (let i = 0; i < 320; i++) {
            await client.set(`key-${i}`, `val-${i}`);
          }

          response = await request(app).get(`/api/v2/events/totals/${redisModels[0].instanceId}/2?eventTotal=113`);
        });

        afterAll(async () => {
          await redisModels[0].client.flushall();

          for (const monitor of redisMonitors) {
            monitor.keyspaces[2].eventLog.reset();
          }
        })

        it('should provide the correct eventTotal metadata', () => {
          expect(response.body.eventTotal).toEqual(320);
        });

        it('should provide a single element in the eventTotals array', () => {
          expect(response.body.eventTotals).toHaveLength(1);
        });

        it('should provide the correct eventCount in the eventTotals array element', () => {
          expect(response.body.eventTotals[0].eventCount).toEqual(320 - 113);
        });
      });

      describe('handling filtering query parameters', () => {
        
        beforeAll(async () => {
          const client = redisModels[0].client;
          await client.select(6);

          for (let i = 0; i < 30; i++) {
            await client.set(`wow1-${i}`, 'coolbean');
            await client.lpush(`wow-${i}`, 'el2', 'el1')
            await client.lpush(`erm-${i + 30}`, 'el2', 'el1');
            await client.del(`wow1-${i}`);
          }
        });

        afterAll(async () => {
          await redisModels[0].client.flushall();

          for (const monitor of redisMonitors) {
            monitor.keyspaces[6].eventLog.reset();
          }
        })

        it('should not affect the eventTotal metadata', async () => {
          const response = await request(app).get(`/api/v2/events/totals/${redisModels[0].instanceId}/6?timeInterval=10000&eventTypes=set`);
          expect(response.body.eventTotal).toEqual(120);
        });

        it('should filter for event types properly', async () => {
          const response = await request(app).get(`/api/v2/events/totals/${redisModels[0].instanceId}/6?eventTotal=0&eventTypes=lpush,del`);
          expect(response.body.eventTotals[0].eventCount).toEqual(90);
        });

        it('should filter for keynameFilters properly', async () => {
          const response = await request(app).get(`/api/v2/events/totals/${redisModels[0].instanceId}/6?eventTotal=4&keynameFilter=erm`);
          expect(response.body.eventTotals[0].eventCount).toEqual(29);
        });

        it('should filter for both event types and keynames simultaneously, properly', async () => {
          const response = await request(app).get(`/api/v2/events/totals/${redisModels[0].instanceId}/6?timeInterval=10000&keynameFilter=wow&eventTypes=lpush,del`);
          expect(response.body.eventTotals[0].eventCount).toEqual(60);
        });

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
  redisClient.del = promisify(redisClient.del).bind(redisClient);
  redisClient.lpush = promisify(redisClient.lpush).bind(redisClient);
  redisClient.rpush = promisify(redisClient.rpush).bind(redisClient);
  redisClient.lrange = promisify(redisClient.lrange).bind(redisClient);

  return redisClient;
}

const delay = (ms) => {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}
