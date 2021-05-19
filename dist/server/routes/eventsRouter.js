var express = require('express');
var eventsRouter = express.Router();
var eventsMonitors = require('../redis-monitors/redis-monitors');
eventsRouter.get('/:instanceId/:dbIndex', function (req, res, next) {
    var _a = req.params, instanceId = _a.instanceId, dbIndex = _a.dbIndex;
    var body = { data: [] };
    console.log('got in');
    if (instanceId === undefined) {
        eventsMonitors.forEach(function (monitor) {
            var instance = {
                instanceId: monitor.instanceId,
                keyspaces: []
            };
            monitor.keyspaces.forEach(function (keyspace) {
                var eventTotal = req.query.eventTotal;
                instance.keyspaces.push(eventsMonitors.eventLog.returnLogAsArray(eventTotal ? eventTotal : 0));
            });
            body.data.push(instance);
        });
    }
    ;
    if (instanceId !== undefined && dbIndex === undefined) {
        eventsMonitors[instanceId].forEach(function (monitor) {
            var instance = {
                instanceId: monitor.instanceId,
                keyspaces: []
            };
            monitor.keyspaces.forEach(function (keyspace) {
                instance.keyspaces.push(eventsMonitors.eventLog.returnLogAsArray(keyspace.eventLog));
            });
            body.data.push(instance);
        });
    }
    if (dbIndex !== undefined) {
        var monitor = eventsMonitors.find(function (m) {
            console.log(instanceId);
            console.log(m.instanceId);
            return m.instanceId === +instanceId;
        });
        console.log(monitor);
        var instance = {
            instanceId: monitor.instanceId,
            keyspaces: []
        };
        console.log("got into keyspaces loop");
        var eventTotal = req.query.eventTotal;
        console.log("eventTotal:  " + eventTotal);
        instance.keyspaces.push(monitor.keyspaces[dbIndex].eventLog.returnLogAsArray((eventTotal) ? eventTotal : 0));
        console.log("instance: " + instance);
        console.log("got to body.data.push");
        body.data.push(instance);
    }
    console.log('got to res statment');
    res.status(200).json(body);
});
module.exports = eventsRouter;
