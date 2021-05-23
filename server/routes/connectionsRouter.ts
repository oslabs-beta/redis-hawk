import Router from 'express';
import redisMonitors from '../redis-monitors/redis-monitors';

const router = Router();

router.get('/', (req, res, next) => {
  //******LOOK AT OUTPUTTING INTO LOG FILE**********
  res.locals.connections = [];
  try {
    //iterate through monitors
    redisMonitors.forEach((redisMonitor, idx) => {
      const instance = {
        instanceId: idx + 1,
        host: redisMonitor.host,
        port: redisMonitor.port,
        databases: redisMonitor.databases
      }
      res.locals.connections.push(instance);
    })
  } catch {
    // next('Error in testconnectionsRouter: ' + JSON.stringify(err));

    return next({ log: 'Could not read connections from RedisMonitor' });
  }
  res.status(200).json({ instances: res.locals.connections })
});

export default router;