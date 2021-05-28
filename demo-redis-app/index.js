/*
Imports functionality that mocks Redis commands and executes them at a specified interval.
*/

const mock = require('./utils/mock-commands.js');
const mockSettings = require('./utils/mock-command-settings.js');
const redisClients = require('./redis-config/client-config.js');

redisClients.forEach(client => {
  setInterval(mock.setString, mockSettings.STRING_SET_FREQUENCY, client);
  setInterval(mock.getString, mockSettings.STRING_GET_FREQUENCY, client);
  setInterval(mock.delString, mockSettings.STRING_DELETE_FREQUENCY, client);
})

