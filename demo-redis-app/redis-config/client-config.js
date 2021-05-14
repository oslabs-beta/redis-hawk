/*
Initializes and configures the node-redis client.

Imported by /utils/mock-commands.js

TO-DOS:
we need set standard configurations on the redis database (need to research):
  -set "maxmemory" - how much memory this database is allowed to use
  -set eviction policies if maxmemory is reached
  etc.

consider how a real redis deployment is configured - do we need sharding? clustering?

*/

const redis = require('redis');
const client = redis.createClient();
client.config('SET', 'notify-keyspace-events', 'KEA');

client.on('error', (error) => {
  console.log('Redis client error occured: ', error);
});

module.exports = client;



