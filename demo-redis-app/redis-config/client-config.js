/*
Initializes and configures the node-redis client.

Imported by /utils/mock-commands.js

TO-DOS:
we need set standard configurations on the redis database:
  -set "maxmemory" - how much memory this database is allowed to use
  -set eviction policies if maxmemory is reached
  etc.

*/

const redis = require('redis');
const { promisify } = require('util');
const client = redis.createClient();

client.config('SET', 'notify-keyspace-events', 'KEA');

client.select = promisify(client.select).bind(client);

client.on('error', (error) => {
  console.log('Redis client error occured: ', error);
});

module.exports = client;