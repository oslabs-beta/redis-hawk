/*
Mocks some common Redis commands. Used by index.js
*/

const mockData = require('./mock-command-data.js');
const mockSettings = require('./mock-command-settings');
const client = require('../redis-config/client-config.js');

const mockCommands = {};

mockCommands.setString = () => {
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

mockCommands.getString = () => {
  const key = mockData.strings.createKey();
  client.get(key, (err, res) => {
    if (!err) console.log(`Retrieved string data for key ${key}: ${res}`);
  });
}

mockCommands.delString = () => {
  const key = mockData.strings.createKey();
  client.del(key, (err, res) => {
    if (!err) console.log(`Deleted string key ${key}`);
  });
}

mockCommands.pushList = () => {
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

mockCommands.smembersList = () => {
  const key = mockData.lists.createKey();
  client.smembers(key, (err, res) => {
    if (!err) console.log(`Retrieved list data for key ${key}: ${res}`);
  });
}

mockCommands.ltrimList = () => {
  const key = mockData.lists.createKey();
  client.ltrim(key, 0, -1, (err, res) => {
    if (!err) console.log(`Deleted list key ${key}`)
  });
}

mockCommands.hmsetHash = () => {
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

mockCommands.hgetallHash = () => {
  const key = mockData.hashes.createKey();
  client.hgetall(key, (err, res) => {
    if (!err) console.log(`Retrieved hash data for key ${key}:  ${res}`)
  });
}

mockCommands.hdelHash = () => {
  const key = mockData.hashes.createKey();
  client.hdel(key, user, pass, age, occupation, (err, res) => {
    if (!err) console.log(`Deleted hash key ${key}`)
  });
}

module.exports = mockCommands;