/*
Mocks some common Redis commands. Used by index.js
All mock command functions should be passed a node-redis client.
*/

const mockData = require('./mockCommandData.js');
const mockSettings = require('./mockCommandSettings');

const selectRandomDatabase = async (client) => {
  //Choose a random database (based on the Redis default of 16 databases for an instance) to perform commands against
  await client.select(Math.floor(Math.random() * 16));
};

const mockCommands = {};
/* <<<<< Strings >>>>> */
mockCommands.setString = async (client) => {

  await selectRandomDatabase(client);

  const key = mockData.strings.createKey();
  client.set(key, mockData.strings.createValue(), (err, res) => {
    if (!err) console.log(`Key SET: ${key}`);
    if (err) console.log(`Failed to SET key ${key}: ${err}`)
    //Randomly select every other successful added key to be expired
    if (!err & Math.floor(Math.random() * 2) % 2 === 0) {
      client.expire(key, mockSettings.STRING_TIME_TO_LIVE, (err, res) => {
        if (!err) console.log(`Key EXPIRE: ${key}`);
        if (err) console.log(`Failed to EXPIRE ${key}: ${err}`);
      });
    }
  });
}

mockCommands.getString = async (client) => {

  await selectRandomDatabase(client);

  const key = mockData.strings.createKey();
  client.get(key, (err, res) => {
    if (!err) console.log(`Key GET: ${key}: ${res}`);
    if (err) console.log(`Failed to GET ${key}: ${err}`);
  });
}

mockCommands.delString = async (client) => {

  await selectRandomDatabase(client);

  const key = mockData.strings.createKey();
  client.del(key, (err, res) => {
    if (!err) console.log(`Key DEL: ${key}`);
    if (err) console.log(`Failed to DELETE ${key}: ${err}`);
  });
}

/* <<<<< Lists >>>>> */
mockCommands.lpushList = async (client) => {

  await selectRandomDatabase(client);

  const key = mockData.lists.createKey();
  client.lpush(key, mockData.lists.createValue(), (err, res) => {
    if (!err) console.log(`Key LPUSH: ${key}`);
    if (err) console.log(`Failed to LPUSH key ${key}: ${err}`);
    //Randomly expire every other successfully generated key
    if (!err & Math.floor(Math.random() * 2) % 2 === 0) {
      client.expire(key, mockSettings.LIST_TIME_TO_LIVE, (err, res) => {
        if (!err) console.log(`Key EXPIRE: ${key}`);
        if (err) console.log(`Failed to EXPIRE ${key}: ${err}`);
      });
    }
  });
}

mockCommands.lrangeList = async (client) => {

  await selectRandomDatabase(client);

  const key = mockData.lists.createKey();
  client.lrange(key, 0, -1, (err, res) => {
    if (!err) console.log(`Key LRANGE ${key}: ${res}`);
    if (err) console.log(`Failed to LRANGE key ${key}: ${err}`);
  });
}

mockCommands.lpopList = async (client) => {

  await selectRandomDatabase(client);

  const key = mockData.lists.createKey();
  client.lpop(key, (err, res) => {
    if (!err) console.log(`Key LPOP: ${key}, ${res}`);
    if (err) console.log(`Failed to LPOP key ${key}: ${err}`);
  });
}

/* <<<<< Sets >>>>> */
mockCommands.saddSet = async (client) => {

  await selectRandomDatabase(client);

  const key = mockData.sets.createKey();
  client.sadd(key, mockData.sets.createValue(), (err, res) => {
    if (!err) console.log(`Key SADD: ${key}`);
    if (err) console.log(`Failed to SADD key ${key}: ${err}`);
    //Randomly expire every other successfully generated key
    if (!err & Math.floor(Math.random() * 2) % 2 === 0) {
      client.expire(key, mockSettings.SET_TIME_TO_LIVE, (err, res) => {
        if (!err) console.log(`Key EXPIRE: ${key}`);
        if (err) console.log(`Failed to EXPIRE ${key}: ${err}`);
      });
    }
  });
}

mockCommands.smembersSet = async (client) => {

  await selectRandomDatabase(client);

  const key = mockData.sets.createKey();
  client.smembers(key, (err, res) => {
    if (!err) console.log(`Key SMEMBERS ${key}: ${res}`);
    if (err) console.log(`Failed to SMEMBERS key ${key}: ${err}`);
  });
}

mockCommands.spopSet = async (client) => {

  await selectRandomDatabase(client);

  const key = mockData.sets.createKey();
  client.spop(key, (err, res) => {
    if (!err) console.log(`Key SPOP: ${key} ${res}`);
    if (err) console.log(`Failed to SPOP key ${key}: ${err}`);
  });
}
/* <<<<< Sorted Sets >>>>> */
mockCommands.zaddSortedSet = async (client) => {
 
  await selectRandomDatabase(client);

  const key = mockData.sortedSets.createKey();
  client.zadd(key, mockData.sortedSets.createValue(), (err, res) => {
    if (!err) console.log(`Key ZADD: ${key}`);
    if (err) console.log(`Failed to ZADD key ${key}: ${err}`);
    //Randomly expire every other successfully generated key
    if (!err & Math.floor(Math.random() * 2) % 2 === 0) {
      client.expire(key, mockSettings.SET_TIME_TO_LIVE, (err, res) => {
        if (!err) console.log(`Key EXPIRE: ${key}`);
        if (err) console.log(`Failed to EXPIRE ${key}: ${err}`);
      });
    }
  });
}

mockCommands.zrangeSortedSet = async (client) => {
  
  await selectRandomDatabase(client);

  const key = mockData.sortedSets.createKey();
  client.zrange(key, 0, -1, (err, res) => {
    if (!err) console.log(`Key ZRANGE ${key}: ${res}`);
    if (err) console.log(`Failed to ZRANGE key ${key}: ${err}`);
  });
}

mockCommands.zpopminSortedSet = async (client) => {
  const key = mockData.sortedSets.createKey();
  client.zpopmin(key, (err, res) => {
    if (!err) console.log(`Key ZPOPMIN ${key}: ${res}`);
    if (err) console.log(`Failed to ZPOPMIN key ${key}: ${err}`);
  });
}

/* <<<<< Hashes >>>>> */
mockCommands.hmsetHash = async (client) => {

  await selectRandomDatabase(client);

  const key = mockData.hashes.createKey();
  client.hmset(key, mockData.hashes.createValue(), (err, res) => {
    if (!err) console.log(`Key HMSET ${key}`);
    if (err) console.log(`Failed to HMSET key ${key}: ${err}`);
    //Randomly expire every other successfully generated key
    if (!err & Math.floor(Math.random() * 2) % 2 === 0) {
      client.expire(key, mockSettings.HASH_TIME_TO_LIVE, (err, res) => {
        if (!err) console.log(`Hash key expried: ${key}`);
        if (err) console.log(`Failed to EXPIRE ${key}: ${err}`);
      });
    }
  });
}

mockCommands.hgetallHash = async (client) => {

  await selectRandomDatabase(client);

  const key = mockData.hashes.createKey();
  client.hgetall(key, (err, res) => {
    if (!err) console.log(`Key HGETALL ${key}:  ${res}`);
    if (err) console.log(`Failed to HGETALL key ${key}: ${err}`);
  });
}

mockCommands.delHash = async (client) => {

  await selectRandomDatabase(client);

  const key = mockData.hashes.createKey();
  client.del(key, (err, res) => {
    if (!err) console.log(`Key DEL: ${key}`);
    if (err) console.log(`Failed to DELETE ${key}: ${err}`);
  });
}

module.exports = mockCommands;