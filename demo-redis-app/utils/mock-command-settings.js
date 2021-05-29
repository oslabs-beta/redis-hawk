/*
Set user-defined frequency for specified Redis commmands to be mocked.
All frequency times are in milliseconds, except for TTL (TIME_TO_LIVE) times which are in seconds.

Used by index.js and /utils/mock-commands.js
*/

module.exports = {
  STRING_SET_FREQUENCY: 100,
  STRING_GET_FREQUENCY: 100,
  STRING_DELETE_FREQUENCY: 500,
  STRING_TIME_TO_LIVE: 120,
  LIST_LPUSH_FREQUENCY: 1000,
  LIST_LRANGE_FREQUENCY: 1000,
  LIST_RPOP_FREQUENCY: 5000,
  LIST_TIME_TO_LIVE: 120,
  SET_SADD_FREQUENCY: 1000,
  SET_SMEMBERS_FREQUENCY: 1000,
  SET_SPOP_FREQUENCY: 5000,
  SET_TIME_TO_LIVE: 120
}