/*
Imports functionality that mocks Redis commands and executes them at a specified interval.
*/

const mock = require('./utils/mockCommands.js');
const mockSettings = require('./utils/mockCommandSettings.js');
const createClients = require('./redis-config/clientConfig.js');

const startDemoApp = async () => {

  redisClients = await createClients();

  redisClients.forEach(client => {
    setInterval(mock.setString, mockSettings.STRING_SET_FREQUENCY, client);
    setInterval(mock.getString, mockSettings.STRING_GET_FREQUENCY, client);
    setInterval(mock.delString, mockSettings.STRING_DELETE_FREQUENCY, client);

    setInterval(mock.lpushList, mockSettings.LIST_LPUSH_FREQUENCY, client);
    setInterval(mock.lrangeList, mockSettings.LIST_LRANGE_FREQUENCY, client);
    setInterval(mock.lpopList, mockSettings.LIST_LPOP_FREQUENCY, client);

    setInterval(mock.saddSet, mockSettings.SET_SADD_FREQUENCY, client);
    setInterval(mock.smembersSet, mockSettings.SET_SMEMBERS_FREQUENCY, client);
    setInterval(mock.spopSet, mockSettings.SET_SPOP_FREQUENCY, client);

    setInterval(mock.zaddSortedSet, mockSettings.SORTEDSET_ZADD_FREQUENCY, client);
    setInterval(mock.zrangeSortedSet, mockSettings.SORTEDSET_ZRANGE_FREQUENCY, client);
    setInterval(mock.zpopminSortedSet, mockSettings.SORTEDSET_ZPOPMIN_FREQUENCY, client);

    setInterval(mock.hmsetHash, mockSettings.HASH_HMSET_FREQUENCY, client);
    setInterval(mock.hgetallHash, mockSettings.HASH_HGETALL_FREQUENCY, client);
    // setInterval(mock.hdelHash, mockSettings.HASH_HDEL_FREQUENCY, client);

  
  })
};

startDemoApp();
