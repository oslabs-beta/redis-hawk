import { RedisClient } from 'redis';
import { promisify } from 'util';

export const promisifyClientMethods = (client: RedisClient) => {
/*
Promisifies methods of the client.
*/ 

  const promisified = {};
  //redis process
  client.config = promisify(client.config).bind(client);

  //redis commands: databases
  client.flushdb = promisify(client.flushdb).bind(client);
  client.flushall = promisify(client.flushall).bind(client);
  client.select = promisify(client.select).bind(client);

  //redis commands: data
  client.scan = promisify(client.set).bind(client);
  client.type = promisify(client.type).bind(client);

  //redis commands: data: strings
  client.set = promisify(client.set).bind(client);
  client.get = promisify(client.get).bind(client);
  client.mget = promisify(client.get).bind(client);

  return client;
}