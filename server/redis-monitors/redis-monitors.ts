/*
Configures the RedisMonitors, which provide an interface for:
* Working with a Redis client for a specific Redis instance
* Reading monitored/logged data for Redis instances

Each RedisMonitor will also create a keyspace notification subscriber
for each keyspace and write them to an event log.
*/

const fs = require('fs');
const path = require('path');
import * as redis from 'redis';

import { RedisInstance, RedisMonitor, Keyspace } from './models/interfaces';
import { EventLog } from './models/data-stores';
import { promisifyClientMethods } from './utils';

const instances: RedisInstance[] = process.env.IS_TEST ?
  JSON.parse(fs.readFileSync(path.resolve(__dirname, '../configs/tests-config.json')))
  : JSON.parse(fs.readFileSync(path.resolve(__dirname, '../configs/config.json')));

const redisMonitors: RedisMonitor[] = [];

instances.forEach((instance: RedisInstance, idx: number): void => {

  // const redisClient: redis.RedisClient = promisifyClientMethods(
  //   redis.createClient({ host: instance.host, port: instance.port })
  // );

  const redisClient: redis.RedisClient = redis.createClient({host: instance.host, port: instance.port})

  const monitor: RedisMonitor = {
    instanceId: idx + 1,
    redisClient: redisClient,
    host: instance.host,
    port: instance.port,
    keyspaces: []
  }


  monitor.redisClient.config('GET', 'databases', (err, res): void => {
    
    //Sets the number of databases present in this monitored Redis instance
    monitor.databases = +res[1];

    //Configures each keyspace with a event subscriber and event log
    //This should be futher modularized for readability and maintanability
    for (let dbIndex = 0; dbIndex < monitor.databases; dbIndex++) {

      const keyspace: Keyspace = {
        eventLog: new EventLog(),
        keySnapshots: []
      }
      monitor.keyspaces.push(keyspace);

      //Sets up a listener to log any received events for this specific keyspace
      monitor.redisClient.on('pmessage', (channel: string, message: string, event: string): void => {
        if (+message.match(/[0-9*]/)[0] === dbIndex) {
          const key = message.replace(/__keyspace@[0-9]*__/, '');
          monitor.keyspaces[dbIndex].eventLog.add(key, event);
        }
      })
    }

    monitor.redisClient.psubscribe('__keyspace@*__:*')
  });

  redisMonitors.push(monitor);
})

module.exports = redisMonitors;