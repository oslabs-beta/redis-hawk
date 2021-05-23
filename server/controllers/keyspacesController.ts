import redisMonitors from '../redis-monitors/redis-monitors';

//type definition for response body data
import { RedisInstance, Keyspace, KeyData } from './interfaces';
import { getKeyspace } from './utils';
import { createClient } from 'redis';

interface KeyspacesController {
  getAllInstancesKeyspaces?: (req, res, next) => void;
  getAllKeyspacesForInstance?: (req, res, next) => void;
  getKeyspaceForInstance?: (req, res, next) => void;
}

const keyspacesController: KeyspacesController = {};

keyspacesController.getAllInstancesKeyspaces = async (req, res, next) => {
/*
Retrieves all keyspace data for every keyspace of every monitored instance.
*/

  const data: RedisInstance[] = [];
  for (let monitor of redisMonitors) {
    
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

keyspacesController.getAllKeyspacesForInstance = async (req, res, next) => {

  const data: RedisInstance[] = [];
  for (let monitor of redisMonitors) {

    if (monitor.instanceId = req.params.instanceId) {
    
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
  }
  res.locals.data = data;
  return next();
}

keyspacesController.getKeyspaceForInstance = async (req, res, next) => {

  const data: RedisInstance[] = [];
  for (let monitor of redisMonitors) {

    if (monitor.instanceId = req.params.instanceId) {
    
      const keyspaces: Keyspace[] = [];
      let idx = 0;

      const client = createClient({host: monitor.host, port: monitor.port});
      const keyspaceData = await getKeyspace(client, req.params.dbIndex);
      keyspaces.push(keyspaceData);

      data.push({
        instanceId: monitor.instanceId,
        keyspaces: keyspaces
      });

    }
  }
  res.locals.data = data;
  return next();
}

export default keyspacesController;