import { RequestHandler } from 'express';
import redisMonitors from '../redis-monitors/redis-monitors';
import { ConnectionsResponseBody } from './interfaces';

interface ConnectionsController {
  getAllConnections: RequestHandler;
}

const connectionsController: ConnectionsController = {

  getAllConnections: (req, res, next) => {
    //******LOOK AT OUTPUTTING INTO LOG FILE**********
    const connections: ConnectionsResponseBody = {
      instances: []
    };
    try {
      //iterate through monitors
      redisMonitors.forEach((redisMonitor, idx) => {
        const instance = {
          instanceId: idx + 1,
          host: redisMonitor.host,
          port: redisMonitor.port,
          databases: redisMonitor.databases,
          recordKeyspaceHistoryFrequency: redisMonitor.recordKeyspaceHistoryFrequency
        }
        connections.instances.push(instance);
      })
    } catch (err) {
      return next({ log: 'Could not read connections from RedisMonitor' });
    }

    res.locals.connections = connections;
    return next();
  }

};

export default connectionsController;