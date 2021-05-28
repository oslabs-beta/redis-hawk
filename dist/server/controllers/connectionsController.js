"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var redis_monitors_1 = __importDefault(require("../redis-monitors/redis-monitors"));
var connectionsController = {
    getAllConnections: function (req, res, next) {
        var connections = {
            instances: []
        };
        try {
            redis_monitors_1.default.forEach(function (redisMonitor, idx) {
                var instance = {
                    instanceId: idx + 1,
                    host: redisMonitor.host,
                    port: redisMonitor.port,
                    databases: redisMonitor.databases,
                    recordKeyspaceHistoryFrequency: redisMonitor.recordKeyspaceHistoryFrequency
                };
                connections.instances.push(instance);
            });
        }
        catch (err) {
            return next({ log: 'Could not read connections from RedisMonitor' });
        }
        res.locals.connections = connections;
        return next();
    }
};
exports.default = connectionsController;
