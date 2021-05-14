/*
Set user-defined frequency for specified Redis commmands to be mocked.
All frequency times are in milliseconds, except for TTL (TIME_TO_LIVE) times which are in seconds.

Used by index.js and /utils/mock-commands.js
*/

module.exports = {
  STRING_SET_FREQUENCY: 1000,
  STRING_GET_FREQUENCY: 1000,
  STRING_DELETE_FREQUENCY: 5000,
  STRING_TIME_TO_LIVE: 120
}