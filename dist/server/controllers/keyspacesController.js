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
var keyspacesController = {
    findAllMonitors: function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            res.locals.monitors = redis_monitors_1.default;
            return [2, next()];
        });
    }); },
    findSingleMonitor: function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
        var _i, redisMonitors_1, monitor;
        return __generator(this, function (_a) {
            for (_i = 0, redisMonitors_1 = redis_monitors_1.default; _i < redisMonitors_1.length; _i++) {
                monitor = redisMonitors_1[_i];
                if (monitor.instanceId === +req.params.instanceId) {
                    res.locals.monitors = [monitor];
                }
            }
            if (!res.locals.monitors) {
                return [2, next({ log: 'User provided invalid instanceId', status: 400, message: { err: 'Please provide a valid instanceId' } })];
            }
            return [2, next()];
        });
    }); },
    getKeyspacesForInstance: function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
        var keyspacesResponse, dbIndex, keyspaceData, _i, _a, monitor, keyspaces, idx, _b, _c, keyspace, keyspaceData;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    keyspacesResponse = { data: [] };
                    dbIndex = req.params.dbIndex;
                    if (!dbIndex) return [3, 2];
                    return [4, utils_1.getKeyspace(res.locals.monitors[0].redisClient, +dbIndex)];
                case 1:
                    keyspaceData = _d.sent();
                    keyspacesResponse.data = [{
                            instanceId: res.locals.monitors[0].instanceId,
                            keyspaces: [keyspaceData]
                        }];
                    return [3, 9];
                case 2:
                    _i = 0, _a = res.locals.monitors;
                    _d.label = 3;
                case 3:
                    if (!(_i < _a.length)) return [3, 9];
                    monitor = _a[_i];
                    keyspaces = [];
                    idx = 0;
                    _b = 0, _c = monitor.keyspaces;
                    _d.label = 4;
                case 4:
                    if (!(_b < _c.length)) return [3, 7];
                    keyspace = _c[_b];
                    return [4, utils_1.getKeyspace(monitor.redisClient, idx)];
                case 5:
                    keyspaceData = _d.sent();
                    keyspaces.push(keyspaceData);
                    idx += 1;
                    _d.label = 6;
                case 6:
                    _b++;
                    return [3, 4];
                case 7:
                    keyspacesResponse.data.push({
                        instanceId: monitor.instanceId,
                        keyspaces: keyspaces
                    });
                    _d.label = 8;
                case 8:
                    _i++;
                    return [3, 3];
                case 9:
                    res.locals.keyspaces = keyspacesResponse;
                    return [2, next()];
            }
        });
    }); }
};
exports.default = keyspacesController;
