import { RedisClient } from 'redis';
import { Keyspace, KeyDetails } from './interfaces';
import { promisify } from 'util';

const getValue = async (key: string, type: string, redisClient: RedisClient): Promise<any> => {

  let value;
  switch (type) {

    case 'string': {
      //@ts-ignore - incorrect type errors for promisified method's return value
      value = await redisClient.get(key);
      // console.log(value);
    }; break;

    case 'list': {
      //@ts-ignore - incorrect type errors for promisified method's return value
      value = await redisClient.lrange(key, 0, -1);
    }; break;

    case 'set': {
      //@ts-ignore - incorrect type errors for promisified method's return value
      value = await redisClient.smembers(key);
    }; break;

    case 'zset': {
      //@ts-ignore - incorrect type errors for promisified method's return value
      //note:  will need to include a range with the key to return all values in 
      //the sorted set
      value = await redisClient.zrange(key, 0, - 1);
    }; break;

    case 'hash': {
      //@ts-ignore - incorrect type errors for promisified method's return value
      value = await redisClient.hgetall(key);
    }; break;


  };


  return value;

}

export const getKeyspace = async (redisClient: RedisClient, dbIdx: number): Promise<Keyspace> => {

  const res: KeyDetails[] = [];

  await redisClient.select(dbIdx);

  //@ts-ignore - incorrect type errors for promisified method's return value
  let scanResults: [string, string[]] = await redisClient.scan('0', 'COUNT', '100');
  let cursor: string = scanResults[0];
  let keys: string[] = scanResults[1];

  do {

    for (let key of keys) {
      //@ts-ignore - incorrect type errors for promisified method's return value
      const type: string = await redisClient.type(key);
      const value = await getValue(key, type, redisClient);

      res.push({
        key: key,
        type: type,
        value: value
      })
    }
    //@ts-ignore - incorrect type errors for promisified method's return value
    scanResults = await redisClient.scan(cursor, 'COUNT', '100');
    cursor = scanResults[0];
    keys = scanResults[1];

  } while (cursor !== '0');

  return res;
};