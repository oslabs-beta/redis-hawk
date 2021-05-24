import redisMonitors from '../redis-monitors/redis-monitors';
import { RequestHandler } from 'express';

//type definition for response body data
import { RedisInstance, Keyspace, KeyData } from './interfaces';
import { getKeyspace } from './utils';

interface KeyspacesController {
  getAllInstancesKeyspaces: RequestHandler;
  getAllKeyspacesForInstance: RequestHandler;
  getKeyspaceForInstance: RequestHandler;
}

const keyspacesController: KeyspacesController = {

  getAllInstancesKeyspaces: async (req, res, next) => {
  /*
  Retrieves all keyspace data for every keyspace of every monitored instance.
  */

    const data: RedisInstance[] = [];
    for (let monitor of redisMonitors) {
      
      const keyspaces: Keyspace[] = [];
      let idx = 0;

      for (const keyspace of monitor.keyspaces) {
        const keyspaceData = await getKeyspace(monitor.redisClient, idx);
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
  },

  getAllKeyspacesForInstance: async (req, res, next) => {

    const data: RedisInstance[] = [];
    for (let monitor of redisMonitors) {

      if (monitor.instanceId = +req.params.instanceId) {
      
        const keyspaces: Keyspace[] = [];
        let idx = 0;

        for (const keyspace of monitor.keyspaces) {
          const keyspaceData = await getKeyspace(monitor.redisClient, idx)
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
  },

  getKeyspaceForInstance: async (req, res, next) => {

    const data: RedisInstance[] = [];
    for (let monitor of redisMonitors) {

      if (monitor.instanceId = +req.params.instanceId) {
      
        const keyspaces: Keyspace[] = [];
        let idx = 0;

        const keyspaceData = await getKeyspace(monitor.redisClient, +req.params.dbIndex);
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

};

export default keyspacesController;