var Router = require('express').Router;
var router = Router();
var redisMonitors = require('../redis-monitors/redis-monitors');
router.get('/', function (req, res, next) {
    res.locals.connections = [];
    try {
        redisMonitors.forEach(function (redisMonitor, idx) {
            var instance = {
                instanceId: idx + 1,
                host: redisMonitor.host,
                port: redisMonitor.port,
                databases: redisMonitor.databases
            };
            res.locals.connections.push(instance);
        });
    }
    catch (_a) {
        return next({ log: 'Could not read connections from RedisMonitor' });
    }
    res.status(200).json({ instances: res.locals.connections });
});
module.exports = router;
