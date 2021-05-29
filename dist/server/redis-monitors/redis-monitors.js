"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = __importStar(require("fs"));
var path = __importStar(require("path"));
var redis = __importStar(require("redis"));
var data_stores_1 = require("./models/data-stores");
var utils_1 = require("./utils");
var instances = process.env.IS_TEST ?
    JSON.parse(fs.readFileSync(path.resolve(__dirname, '../configs/tests-config.json')).toString())
    : JSON.parse(fs.readFileSync(path.resolve(__dirname, '../configs/config.json')).toString());
var redisMonitors = [];
instances.forEach(function (instance, idx) {
    console.log(idx);
    var client = utils_1.promisifyClientMethods(redis.createClient({ host: instance.host, port: instance.port }));
    var subscriber = redis.createClient({ host: instance.host, port: instance.port });
    var monitor = {
        instanceId: idx + 1,
        redisClient: client,
        keyspaceSubscriber: subscriber,
        host: instance.host,
        port: instance.port,
        keyspaces: [],
        recordKeyspaceHistoryFrequency: instance.recordKeyspaceHistoryFrequency
    };
    monitor.redisClient.config('GET', 'databases', function (err, res) {
        monitor.databases = +res[1];
        var _loop_1 = function (dbIndex) {
            var keyspace = {
                eventLog: new data_stores_1.EventLog(),
                keyspaceHistories: new data_stores_1.KeyspaceHistoriesLog()
            };
            monitor.keyspaces.push(keyspace);
            monitor.keyspaceSubscriber.on('pmessage', function (channel, message, event) {
                if (+message.match(/[0-9*]/)[0] === dbIndex) {
                    var key = message.replace(/__keyspace@[0-9]*__:/, '');
                    monitor.keyspaces[dbIndex].eventLog.add(key, event);
                }
            });
            setInterval(utils_1.recordKeyspaceHistory, monitor.recordKeyspaceHistoryFrequency, monitor, dbIndex);
        };
        for (var dbIndex = 0; dbIndex < monitor.databases; dbIndex++) {
            _loop_1(dbIndex);
        }
        monitor.keyspaceSubscriber.psubscribe('__keyspace@*__:*');
    });
    redisMonitors.push(monitor);
});
exports.default = redisMonitors;
