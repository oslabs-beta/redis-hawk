"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var redis_monitors_1 = __importDefault(require("../redis-monitors/redis-monitors"));
var router = express_1.default();
router.get('/', function (req, res, next) {
    res.locals.connections = [];
    try {
        redis_monitors_1.default.forEach(function (redisMonitor, idx) {
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
exports.default = router;
