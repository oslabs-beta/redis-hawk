"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.promisifyClientMethods = void 0;
var util_1 = require("util");
var promisifyClientMethods = function (client) {
    var promisified = {};
    client.config = util_1.promisify(client.config).bind(client);
    client.flushdb = util_1.promisify(client.flushdb).bind(client);
    client.flushall = util_1.promisify(client.flushall).bind(client);
    client.select = util_1.promisify(client.select).bind(client);
    client.scan = util_1.promisify(client.set).bind(client);
    client.type = util_1.promisify(client.type).bind(client);
    client.set = util_1.promisify(client.set).bind(client);
    client.get = util_1.promisify(client.get).bind(client);
    client.mget = util_1.promisify(client.get).bind(client);
    return client;
};
exports.promisifyClientMethods = promisifyClientMethods;
