/*
Configures the RedisMonitors, which provide an interface for:
* Working with a Redis client for a specific Redis instance
* Reading monitored/logged data for Redis instances

Each RedisMonitor will also create a keyspace notification subscriber
for each keyspace and write them to an event log.
*/

import * as fs from 'fs';
import * as path from 'path';
import * as redis from 'redis';

import { RedisInstance, RedisMonitor, Keyspace } from './models/interfaces';
import { EventLog } from './models/data-stores';
import { promisifyClientMethods } from './utils';

const instances: RedisInstance[] = process.env.IS_TEST ?
  JSON.parse(fs.readFileSync(path.resolve(__dirname, '../configs/tests-config.json')).toString())
  : JSON.parse(fs.readFileSync(path.resolve(__dirname, '../configs/config.json')).toString());

const redisMonitors: RedisMonitor[] = [];

instances.forEach((instance: RedisInstance, idx: number): void => {

  // const redisClient: redis.RedisClient = promisifyClientMethods(
  //   redis.createClient({ host: instance.host, port: instance.port })
  // );

  const client: redis.RedisClient = redis.createClient({host: instance.host, port: instance.port});
  const subscriber: redis.RedisClient = redis.createClient({host: instance.host, port: instance.port});

  const monitor: RedisMonitor = {
    instanceId: idx + 1,
    redisClient: client,
    keyspaceSubscriber: subscriber,
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
      monitor.keyspaceSubscriber.on('pmessage', (channel: string, message: string, event: string): void => {
        if (+message.match(/[0-9*]/)[0] === dbIndex) {
          const key = message.replace(/__keyspace@[0-9]*__:/, '');
          monitor.keyspaces[dbIndex].eventLog.add(key, event);
        }
      })
    }

    monitor.keyspaceSubscriber.psubscribe('__keyspace@*__:*')
  });

  redisMonitors.push(monitor);
})

export default redisMonitors;