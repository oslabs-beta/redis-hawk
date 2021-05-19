const { Router } = require('express');
const connectionsRouter = Router();

const connectionsMonitors = require('../redis-monitors/redis-monitors');


connectionsRouter.get('/', (req, res, next) => {
  //******LOOK AT OUTPUTTING INTO LOG FILE**********
  res.locals.connections = [];
  try {
    //iterate through monitors
    connectionsMonitors.forEach((redisMonitor, idx) => {
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

module.exports = connectionsRouter;