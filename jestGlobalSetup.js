/* 
Start Redis servers prior to tests. 

This is necessary because tests will initiate the RedisMonitors processes,
which need to instantiate node-redis clients for the instances defined in the tests-config.json
*/

import 'regenerator-runtime/runtime';
import RedisServer from 'redis-server';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const testConnections = JSON.parse(readFileSync(resolve(__dirname, './src/server/tests-config/tests-config.json')).toString());

module.exports = async () => {

  const servers = [];
  for (let conn of testConnections) {

    const server = new RedisServer(conn.port);
    try {
      await server.open();
    } catch (e) {
      console.log(`Error starting server on port ${conn.port}: ${e}`);
    }

    servers.push(server);
  }

  global.servers = servers
}