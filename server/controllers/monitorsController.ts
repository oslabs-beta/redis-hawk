import redisMonitors from '../redis-monitors/redis-monitors';
import { RequestHandler } from 'express';

interface MonitorsController {
  findAllMonitors: RequestHandler;
  findSingleMonitor: RequestHandler;
}

const monitorsController: MonitorsController = {

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
}

export default monitorsController