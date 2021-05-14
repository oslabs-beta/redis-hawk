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
        if (!err) console.log(`Key expired: ${key}`);
      });
    }
  });
}

mockCommands.getString = () => {
  const key = mockData.strings.createKey();
  client.get(key, (err, res) => {
    if (!err) console.log(`Retrieved data for key ${key}: ${res}`);
  });
}

mockCommands.delString = () => {
  const key = mockData.strings.createKey();
  client.del(key, (err, res) => {
    if (!err) console.log(`Deleted key ${key}`);
  });
}

module.exports = mockCommands;