import redisMonitors from '../redis-monitors/redis-monitors';
import { RequestHandler } from 'express';

//type definition for response body data
// import { RedisInstance, Keyspace, KeyData } from './interfaces';
import { KeyspacesResponseBody, Keyspace } from './interfaces';
import { getKeyspace } from './utils';

interface KeyspacesController {
  findAllMonitors: RequestHandler;
  findSingleMonitor: RequestHandler;
  getKeyspacesForInstance: RequestHandler;
}

const keyspacesController: KeyspacesController = {

  findAllMonitors: async (req, res, next) => {
    res.locals.monitors = redisMonitors;
    return next();
  },

  findSingleMonitor: async (req, res, next) => {

    for (let monitor of redisMonitors) {
      if (monitor.instanceId === +req.params.instanceId) {
        res.locals.monitors = [monitor];
      }
    }

    if (!res.locals.monitors) {
      return next({ log: 'User provided invalid instanceId', status: 400, message: { err: 'Please provide a valid instanceId' } });
    }

    return next();
  },
  //Focus here
  getKeyspacesForInstance: async (req, res, next) => {

    const keyspacesResponse: KeyspacesResponseBody = { data: [] };
    const dbIndex = req.params.dbIndex;

    if (dbIndex) { //Grab specified keyspace for the instance
      const keyspaceData = await getKeyspace(res.locals.monitors[0].redisClient, +dbIndex);
      keyspacesResponse.data = [{
        instanceId: res.locals.monitors[0].instanceId,
        keyspaces: [keyspaceData]
      }];

    } else { //Grab all keyspaces for the instance

      for (let monitor of res.locals.monitors) {
        const keyspaces: Keyspace[] = [];

        let idx = 0;
        for (const keyspace of monitor.keyspaces) {
          const keyspaceData = await getKeyspace(monitor.redisClient, idx);
          keyspaces.push(keyspaceData);
          idx += 1;
        }

        keyspacesResponse.data.push({
          instanceId: monitor.instanceId,
          keyspaces: keyspaces
        });
      }
    }

    res.locals.keyspaces = keyspacesResponse;
    return next();
  }

};

export default keyspacesController;