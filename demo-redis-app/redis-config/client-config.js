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

const clients = [];

for (let PORT = 6379; PORT < 6381; PORT++) {

  const client = redis.createClient({host: '127.0.0.1', port: PORT});
  client.config('SET', 'notify-keyspace-events', 'KEA');
  client.select = promisify(client.select).bind(client);
  client.on('error', (error) => {
    console.log(`Redis client error occured (port ${PORT}): ${error}
    Please ensure you have a redis server running on this port.
    bash: redis-server --port ${PORT}`);
  });

  clients.push(client);
}

module.exports = clients;