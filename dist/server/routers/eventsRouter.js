"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var redis_monitors_1 = __importDefault(require("../redis-monitors/redis-monitors"));
var router = express_1.default();
router.get('/', function (req, res, next) {
    var body = { data: [] };
    redis_monitors_1.default.forEach(function (monitor) {
        var instance = {
            instanceId: monitor.instanceId,
            keyspaces: []
        };
        monitor.keyspaces.forEach(function (keyspace) {
            var eventTotal = req.query.eventTotal;
            instance.keyspaces.push(keyspace.eventLog.returnLogAsArray((+eventTotal) ? +eventTotal : 0));
        });
        body.data.push(instance);
    });
    res.status(200).json(body);
});
router.get('/:instanceId/', function (req, res, next) {
    var body = { data: [] };
    var instanceId = req.params.instanceId;
    var monitor = redis_monitors_1.default.find(function (m) {
        return m.instanceId === +instanceId;
    });
    var instance = {
        instanceId: monitor.instanceId,
        keyspaces: []
    };
    monitor.keyspaces.forEach(function (keyspace) {
        var eventTotal = req.query.eventTotal;
        instance.keyspaces.push(keyspace.eventLog.returnLogAsArray((+eventTotal) ? +eventTotal : 0));
    });
    body.data.push(instance);
    res.status(200).json(body);
});
router.get('/:instanceId/:dbIndex', function (req, res, next) {
    var body = { data: [] };
    var _a = req.params, instanceId = _a.instanceId, dbIndex = _a.dbIndex;
    var monitor = redis_monitors_1.default.find(function (m) {
        return m.instanceId === +instanceId;
    });
    var instance = {
        instanceId: monitor.instanceId,
        keyspaces: []
    };
    var eventTotal = req.query.eventTotal;
    instance.keyspaces.push(monitor.keyspaces[dbIndex].eventLog.returnLogAsArray((eventTotal) ? eventTotal : 0));
    body.data.push(instance);
    res.status(200).json(body);
});
exports.default = router;
