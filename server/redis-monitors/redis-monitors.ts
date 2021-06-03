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
import { EventLog, KeyspaceHistoriesLog } from './models/data-stores';
import { promisifyClientMethods, recordKeyspaceHistory } from './utils';
import { getKeyspace } from '../controllers/utils';

const instances: RedisInstance[] = process.env.IS_TEST ?
  JSON.parse(fs.readFileSync(path.resolve(__dirname, '../tests-config/tests-config.json')).toString())
  : JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../../config.json')).toString());

const redisMonitors: RedisMonitor[] = [];

const initKeyspace = async (monitor: RedisMonitor, dbIndex: number): Promise<void> => {
/*
  For a given dbIndex of an initialized RedisMonitor, configures the monitoring behaviors for the keyspace.
*/

//Sets up a listener to log any received events for this specific keyspace
  const eventLog = new EventLog();
  monitor.keyspaceSubscriber.on('pmessage', (channel: string, message: string, event: string): void => {
    if (+message.match(/[0-9]+/)[0] === dbIndex) {
      const key = message.replace(/__keyspace@[0-9]*__:/, '');
      eventLog.add(key, event);
    }
  })

  const keyspaceSnapshot = await getKeyspace(monitor.redisClient, dbIndex);
  const keyspace: Keyspace = {
    eventLog: eventLog,
    keyspaceHistories: new KeyspaceHistoriesLog(),
    keyspaceSnapshot: keyspaceSnapshot,
    eventLogSnapshot: []
  }

  monitor.keyspaces.push(keyspace);

  // For every recordKeyspaceHistoryFrequency milliseconds, 
  // record a keyspace history for this given database
  setInterval(
    recordKeyspaceHistory, 
    monitor.recordKeyspaceHistoryFrequency,
    monitor, 
    dbIndex
  ); 
}

const initMonitor = async (monitor: RedisMonitor): Promise<void> => {
/*
  For a given initialized RedisMonitor, configures the monitoring behaviors for the monitored instance.
*/
  
  redisMonitors.push(monitor);
  //Subscribe to all keyspace events
  try {
    await monitor.redisClient.config('SET', 'notify-keyspace-events', 'KEA');
  } catch (e) {
    console.log(`Could not configure client to publish keyspace event noficiations`);
  }

  let res;
  try {
    res = await monitor.redisClient.config('GET', 'databases')
    //Sets the number of databases present in this monitored Redis instance
    monitor.databases = +res[1];

  } catch (e) {
    console.log(`Could not get database count from client`);
  }

  monitor.keyspaceSubscriber.psubscribe('__keyspace@*__:*');

  //Configures each keyspace with a event subscriber/event log
  //Additionally auto-saves keyspace histories with frequency in JSON config
  //This should be futher modularized for readability and maintanability
  for (let dbIndex = 0; dbIndex < monitor.databases; dbIndex++) {
    initKeyspace(monitor, dbIndex);
  }
}

instances.forEach((instance: RedisInstance, idx: number): void => {
/*
  For each instance in the config.json, set up a RedisMonitor object
  initialized with the instance details and a node-redis client for
  both the redisClient (used for performing general commands) and the keyspaceSubscriber
*/

  let client: redis.RedisClient;
  let subscriber: redis.RedisClient;
  if (instance.host && instance.port) {
    client = redis.createClient({host: instance.host, port: instance.port});
    subscriber = redis.createClient({host: instance.host, port: instance.port});
  } else if (instance.url) {
    client = redis.createClient({url: instance.url});
    subscriber = redis.createClient({url: instance.url});
  } else {
    console.log(`No valid connection host/port or URL provided - check your config. Instance details: ${instance}`);
    return
  }

  //Promisify methods for the redis client for async/await capability
  //Subscriber does not require any promisified method
  client = promisifyClientMethods(client);

  const monitor: RedisMonitor = {
    instanceId: idx + 1,
    redisClient: client,
    keyspaceSubscriber: subscriber,
    host: instance.host,
    port: instance.port,
    url: instance.url,
    keyspaces: [],
    recordKeyspaceHistoryFrequency: instance.recordKeyspaceHistoryFrequency
  }

  initMonitor(monitor);
})

export default redisMonitors;