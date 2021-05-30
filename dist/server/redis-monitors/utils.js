"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.recordKeyspaceHistory = exports.promisifyClientMethods = void 0;
var util_1 = require("util");
var promisifyClientMethods = function (client) {
    client.flushdb = util_1.promisify(client.flushdb).bind(client);
    client.flushall = util_1.promisify(client.flushall).bind(client);
    client.select = util_1.promisify(client.select).bind(client);
    client.scan = util_1.promisify(client.scan).bind(client);
    client.type = util_1.promisify(client.type).bind(client);
    client.set = util_1.promisify(client.set).bind(client);
    client.get = util_1.promisify(client.get).bind(client);
    client.mget = util_1.promisify(client.mget).bind(client);
    client.lrange = util_1.promisify(client.lrange).bind(client);
    client.smembers = util_1.promisify(client.smembers).bind(client);
    client.zrange = util_1.promisify(client.zrange).bind(client);
    client.hgetall = util_1.promisify(client.hgetall).bind(client);
    return client;
};
exports.promisifyClientMethods = promisifyClientMethods;
var recordKeyspaceHistory = function (monitor, dbIndex) { return __awaiter(void 0, void 0, void 0, function () {
    var keyDetails, cursor, keys;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                keyDetails = [];
                cursor = '0';
                keys = [];
                return [4, monitor.redisClient.scan(cursor)];
            case 1:
                _a = _c.sent(), cursor = _a[0], keys = _a[1];
                _c.label = 2;
            case 2:
                keys.forEach(function (key) {
                    keyDetails.push({
                        key: key,
                        memoryUsage: 0
                    });
                });
                return [4, monitor.redisClient.scan(cursor)];
            case 3:
                _b = _c.sent(), cursor = _b[0], keys = _b[1];
                _c.label = 4;
            case 4:
                if (cursor !== '0') return [3, 2];
                _c.label = 5;
            case 5:
                monitor.keyspaces[dbIndex].keyspaceHistories.add(keyDetails);
                return [2];
        }
    });
}); };
exports.recordKeyspaceHistory = recordKeyspaceHistory;
