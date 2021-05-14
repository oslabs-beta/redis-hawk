/*
Imports functionality that mocks Redis commands and executes them at a specified interval.
*/

const mock = require('./utils/mock-commands.js');
const mockSettings = require('./utils/mock-command-settings.js');

setInterval(mock.setString, mockSettings.STRING_SET_FREQUENCY);
setInterval(mock.getString, mockSettings.STRING_GET_FREQUENCY);
setInterval(mock.delString, mockSettings.STRING_DELETE_FREQUENCY);