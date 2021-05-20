"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require('fs');
var path = require('path');
var redis = require("redis");
var data_stores_1 = require("./models/data-stores");
var instances = process.env.IS_TEST ?
    JSON.parse(fs.readFileSync(path.resolve(__dirname, '../configs/tests-config.json')))
    : JSON.parse(fs.readFileSync(path.resolve(__dirname, '../configs/config.json')));
var redisMonitors = [];
instances.forEach(function (instance, idx) {
    var redisClient = redis.createClient({ host: instance.host, port: instance.port });
    var monitor = {
        instanceId: idx + 1,
        redisClient: redisClient,
        host: instance.host,
        port: instance.port,
        keyspaces: []
    };
    monitor.redisClient.config('GET', 'databases', function (err, res) {
        monitor.databases = +res[1];
        var _loop_1 = function (dbIndex) {
            var keyspace = {
                eventLog: new data_stores_1.EventLog(),
                keySnapshots: []
            };
            monitor.keyspaces.push(keyspace);
            monitor.redisClient.on('pmessage', function (channel, message, event) {
                if (+message.match(/[0-9*]/)[0] === dbIndex) {
                    var key = message.replace(/__keyspace@[0-9]*__/, '');
                    monitor.keyspaces[dbIndex].eventLog.add(key, event);
                }
            });
        };
        for (var dbIndex = 0; dbIndex < monitor.databases; dbIndex++) {
            _loop_1(dbIndex);
        }
        monitor.redisClient.psubscribe('__keyspace@*__:*');
    });
    redisMonitors.push(monitor);
});
module.exports = redisMonitors;
