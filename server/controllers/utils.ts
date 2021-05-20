import { RedisClient } from 'redis';
import { Keyspace, KeyData } from './interfaces';
import { promisify } from 'util';

const getValue = async (key: string, type: string, redisClient: RedisClient): Promise<any> => {

  const get = promisify(redisClient.get).bind(redisClient);

  let value: any;
  switch (type) {

    case 'string': {
      value = await get(key);
    }; break;

  };

  return value;

}

export const getKeyspace = async (redisClient: RedisClient, dbIdx: number): Promise<Keyspace> => {

  const res = [];
  const scan = promisify(redisClient.scan).bind(redisClient);
  const select = promisify(redisClient.select).bind(redisClient);
  const getType = promisify(redisClient.type).bind(redisClient);

  await select(dbIdx);

  let scanResults = await scan('0', 'COUNT', '100');
  let cursor = scanResults[0];
  let keys = scanResults[1];

  do {

    for (let key of keys) {
      const type = await getType(key);
      const value = await getValue(key, type, redisClient);

      res.push({
        key: key,
        type: type,
        value: value
      })
    }
    scanResults = await scan(cursor, 'COUNT', '100');
    cursor = scanResults[0];
    keys = scanResults[1];

  } while (cursor !== '0');

  return res;
};