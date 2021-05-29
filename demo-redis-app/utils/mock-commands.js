/*
Mocks some common Redis commands. Used by index.js
All mock command functions should be passed a node-redis client.
*/

const mockData = require('./mock-command-data.js');
const mockSettings = require('./mock-command-settings');

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
    if (!err) console.log(`Key set: ${key}`);
    //Randomly select every other successful added key to be expired
    if (!err & Math.floor(Math.random() * 2) % 2 === 0) {
      client.expire(key, mockSettings.STRING_TIME_TO_LIVE, (err, res) => {
        if (!err) console.log(`String key expired: ${key}`);
      });
    }
  });
}

mockCommands.getString = async (client) => {

  await selectRandomDatabase(client);

  const key = mockData.strings.createKey();
  client.get(key, (err, res) => {
    if (!err) console.log(`Retrieved string data for key ${key}: ${res}`);
  });
}

mockCommands.delString = async (client) => {

  await selectRandomDatabase(client);

  const key = mockData.strings.createKey();
  client.del(key, (err, res) => {
    if (!err) console.log(`Deleted string key ${key}`);
  });
}

/* <<<<< Lists >>>>> */
mockCommands.pushList = (client) => {
  const key = mockData.lists.createKey();
  client.lpush(key, mockData.lists.createValue(), (err, res) => {
    if (!err) console.log(`Key lpush: ${key}`);
    //Randomly expire every other successfully generated key
    if (!err & Math.floor(Math.random() * 2) % 2 === 0) {
      client.expire(key, mockSettings.LIST_TIME_TO_LIVE, (err, res) => {
        if (!err) console.log(`List key expired: ${key}`);
      });
    }
  });
}

mockCommands.smembersList = (client) => {
  const key = mockData.lists.createKey();
  client.smembers(key, (err, res) => {
    if (!err) console.log(`Retrieved list data for key ${key}: ${res}`);
  });
}

mockCommands.rpopList = (client) => {
  const key = mockData.lists.createKey();
  client.rpop(key, (err, res) => {
    if (!err) console.log(`Deleted list key ${key}`)
  });
}

/* <<<<< Sets >>>>> */

/* <<<<< Sorted Sets >>>>> */

/* <<<<< Hashes >>>>> */
mockCommands.hmsetHash = (client) => {
  const key = mockData.hashes.createKey();
  client.hmset(key, mockData.hashes.createValue(), (err, res) => {
    if (!err) console.log(`Key hmset ${key}`);
    //Randomly expire every other successfully generated key
    if (!err & Math.floor(Math.random() * 2) % 2 === 0) {
      client.expire(key, mockSettings.HASH_TIME_TO_LIVE, (err, res) => {
        if (!err) console.log(`Hash key expried: ${key}`);
      });
    }
  });
}

mockCommands.hgetallHash = (client) => {
  const key = mockData.hashes.createKey();
  client.hgetall(key, (err, res) => {
    if (!err) console.log(`Retrieved hash data for key ${key}:  ${res}`)
  });
}

mockCommands.hdelHash = (client) => {
  const key = mockData.hashes.createKey();
  client.hdel(key, user, pass, age, occupation, (err, res) => {
    if (!err) console.log(`Deleted hash key ${key}`)
  });
}

module.exports = mockCommands;