const keyspacesRedisMonitors = require('../redis-monitors/redis-monitors');

//type definition for response body data
import { RedisInstance, Keyspace, KeyData } from './interfaces';
import { getKeyspace } from './utils';
import { createClient } from 'redis';

interface keyspacesController {
  getKeyspace?: (req, res, next) => void;
}

const keyspacesController: keyspacesController = {};

keyspacesController.getKeyspace = async (req, res, next) => {

  const data: RedisInstance[] = [];

  for (let monitor of keyspacesRedisMonitors) {
    
    const keyspaces: Keyspace[] = [];
    let idx = 0;

    const client = createClient({host: monitor.host, port: monitor.port});
    for (const keyspace of monitor.keyspaces) {
      const keyspaceData = await getKeyspace(client, idx)
      keyspaces.push(keyspaceData);
      idx += 1;
    }

    data.push({
      instanceId: monitor.instanceId,
      keyspaces: keyspaces
    });
  }

  res.locals.data = data;

  return next();
}



module.exports = keyspacesController;