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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var redis_monitors_1 = __importDefault(require("../redis-monitors/redis-monitors"));
var utils_1 = require("./utils");
var redis_1 = require("redis");
var keyspacesController = {};
keyspacesController.getAllInstancesKeyspaces = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var data, _i, redisMonitors_1, monitor, keyspaces, idx, client, _a, _b, keyspace, keyspaceData;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                data = [];
                _i = 0, redisMonitors_1 = redis_monitors_1.default;
                _c.label = 1;
            case 1:
                if (!(_i < redisMonitors_1.length)) return [3, 7];
                monitor = redisMonitors_1[_i];
                keyspaces = [];
                idx = 0;
                client = redis_1.createClient({ host: monitor.host, port: monitor.port });
                _a = 0, _b = monitor.keyspaces;
                _c.label = 2;
            case 2:
                if (!(_a < _b.length)) return [3, 5];
                keyspace = _b[_a];
                return [4, utils_1.getKeyspace(client, idx)];
            case 3:
                keyspaceData = _c.sent();
                keyspaces.push(keyspaceData);
                idx += 1;
                _c.label = 4;
            case 4:
                _a++;
                return [3, 2];
            case 5:
                data.push({
                    instanceId: monitor.instanceId,
                    keyspaces: keyspaces
                });
                _c.label = 6;
            case 6:
                _i++;
                return [3, 1];
            case 7:
                res.locals.data = data;
                return [2, next()];
        }
    });
}); };
keyspacesController.getAllKeyspacesForInstance = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var data, _i, redisMonitors_2, monitor, keyspaces, idx, client, _a, _b, keyspace, keyspaceData;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                data = [];
                _i = 0, redisMonitors_2 = redis_monitors_1.default;
                _c.label = 1;
            case 1:
                if (!(_i < redisMonitors_2.length)) return [3, 7];
                monitor = redisMonitors_2[_i];
                if (!(monitor.instanceId = req.params.instanceId)) return [3, 6];
                keyspaces = [];
                idx = 0;
                client = redis_1.createClient({ host: monitor.host, port: monitor.port });
                _a = 0, _b = monitor.keyspaces;
                _c.label = 2;
            case 2:
                if (!(_a < _b.length)) return [3, 5];
                keyspace = _b[_a];
                return [4, utils_1.getKeyspace(client, idx)];
            case 3:
                keyspaceData = _c.sent();
                keyspaces.push(keyspaceData);
                idx += 1;
                _c.label = 4;
            case 4:
                _a++;
                return [3, 2];
            case 5:
                data.push({
                    instanceId: monitor.instanceId,
                    keyspaces: keyspaces
                });
                _c.label = 6;
            case 6:
                _i++;
                return [3, 1];
            case 7:
                res.locals.data = data;
                return [2, next()];
        }
    });
}); };
keyspacesController.getKeyspaceForInstance = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var data, _i, redisMonitors_3, monitor, keyspaces, idx, client, keyspaceData;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                data = [];
                _i = 0, redisMonitors_3 = redis_monitors_1.default;
                _a.label = 1;
            case 1:
                if (!(_i < redisMonitors_3.length)) return [3, 4];
                monitor = redisMonitors_3[_i];
                if (!(monitor.instanceId = req.params.instanceId)) return [3, 3];
                keyspaces = [];
                idx = 0;
                client = redis_1.createClient({ host: monitor.host, port: monitor.port });
                return [4, utils_1.getKeyspace(client, req.params.dbIndex)];
            case 2:
                keyspaceData = _a.sent();
                keyspaces.push(keyspaceData);
                data.push({
                    instanceId: monitor.instanceId,
                    keyspaces: keyspaces
                });
                _a.label = 3;
            case 3:
                _i++;
                return [3, 1];
            case 4:
                res.locals.data = data;
                return [2, next()];
        }
    });
}); };
exports.default = keyspacesController;
