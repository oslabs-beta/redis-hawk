import { RedisClient } from 'redis';
import { promisify } from 'util';
import { RedisMonitor, KeyDetails } from './models/interfaces';

export const promisifyClientMethods = (client: RedisClient) => {
/*
Promisifies methods of the client.
*/ 

  //redis processes - currently excluded as this method is being used
  //in callback form - need to refactor existing code before utilizing this
  // client.config = promisify(client.config).bind(client);
  
  //redis commands: databases
  client.flushdb = promisify(client.flushdb).bind(client);
  client.flushall = promisify(client.flushall).bind(client);
  client.select = promisify(client.select).bind(client);

  //redis commands: data
  client.scan = promisify(client.scan).bind(client);
  client.type = promisify(client.type).bind(client);

  //redis commands: data: strings
  client.set = promisify(client.set).bind(client);
  client.get = promisify(client.get).bind(client);
  client.mget = promisify(client.mget).bind(client);

  return client;
}

// const getKeyMemoryUsage = async (key: string, client: RedisClient): Promise<number> => {
// /* 
// Returns the memory usage, in bytes, for the given key argument.
// */

// }
export const recordKeyspaceHistory = async (monitor: RedisMonitor, dbIndex: number): Promise<void> => {
/*
Scans the keyspace for the given database index utilizing a RedisMonitor instance.
Stores the scanned results in the corresponding monitored keyspace's KeyspaceHistoriesLog.
*/
  const keyDetails: KeyDetails[] = [];
  
  let cursor = '0';
  let keys: string[] = [];
  
  //@ts-ignore
  [ cursor, keys ] = await monitor.redisClient.scan(cursor)

  do {
    keys.forEach(key => {
      keyDetails.push({
        key: key,
        memoryUsage: 0
      });
    });

    //@ts-ignore - 
    [ cursor, keys ] = await monitor.redisClient.scan(cursor);
  }
  while (cursor !== '0')

  monitor.keyspaces[dbIndex].keyspaceHistories.add(keyDetails);

}