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
var utils_1 = require("./utils");
var keyspacesController = {
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
    }); },
    refreshKeyspace: function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
        var refreshScan, dbIndex, monitor, _a, _i, _b, monitor, idx, _c, _d, keyspace, _e, e_1;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    refreshScan = req.query.refreshScan;
                    if (refreshScan === '0')
                        return [2, next()];
                    if (refreshScan !== '1' && refreshScan !== undefined)
                        return [2, next({
                                log: 'Request included invalid refreshScan query parameter',
                                status: 400,
                                message: { err: 'Please provide a valid refreshScan value: 1 or 0' }
                            })];
                    dbIndex = +req.params.dbIndex;
                    _f.label = 1;
                case 1:
                    _f.trys.push([1, 11, , 12]);
                    if (!(dbIndex >= 0)) return [3, 3];
                    monitor = res.locals.monitors[0];
                    _a = monitor.keyspaces[dbIndex];
                    return [4, utils_1.getKeyspace(monitor.redisClient, dbIndex)];
                case 2:
                    _a.keyspaceSnapshot = _f.sent();
                    return [3, 10];
                case 3:
                    _i = 0, _b = res.locals.monitors;
                    _f.label = 4;
                case 4:
                    if (!(_i < _b.length)) return [3, 9];
                    monitor = _b[_i];
                    idx = 0;
                    _c = 0, _d = monitor.keyspaces;
                    _f.label = 5;
                case 5:
                    if (!(_c < _d.length)) return [3, 8];
                    keyspace = _d[_c];
                    _e = monitor.keyspaces[idx];
                    return [4, utils_1.getKeyspace(monitor.redisClient, idx)];
                case 6:
                    _e.keyspaceSnapshot = _f.sent();
                    idx += 1;
                    _f.label = 7;
                case 7:
                    _c++;
                    return [3, 5];
                case 8:
                    _i++;
                    return [3, 4];
                case 9:
                    ;
                    _f.label = 10;
                case 10: return [3, 12];
                case 11:
                    e_1 = _f.sent();
                    return [2, next({
                            log: "Error encountered while rescanning keyspace: " + e_1,
                            message: { err: 'Server error occured while rescanning keyspace' }
                        })];
                case 12: return [2, next()];
            }
        });
    }); },
    getKeyspacePages: function (req, res, next) {
        var _a = req.query, keynameFilter = _a.keynameFilter, keytypeFilter = _a.keytypeFilter, pageNum = _a.pageNum, pageSize = _a.pageSize;
        var validatedPageNum = pageNum ? +pageNum : 1;
        var validatedPageSize = pageSize ? +pageSize : 5;
        var getPaginatedKeyspaceData = function (keyspaceSnapshot) {
            if (keynameFilter) {
                keyspaceSnapshot = keyspaceSnapshot.filter(function (keyDetails) {
                    return keyDetails.key.includes(keynameFilter.toString());
                });
            }
            if (keytypeFilter) {
                keyspaceSnapshot = keyspaceSnapshot.filter(function (keyDetails) {
                    return keyDetails.type === keytypeFilter.toString();
                });
            }
            var keyTotal = keyspaceSnapshot.length;
            var startIndex = ((validatedPageNum - 1) * validatedPageSize);
            var endIndex = validatedPageNum * validatedPageSize;
            return [keyTotal, keyspaceSnapshot.slice(startIndex, endIndex)];
        };
        var dbIndex = +req.params.dbIndex;
        if (dbIndex >= 0) {
            var monitor = res.locals.monitors[0];
            var _b = getPaginatedKeyspaceData(monitor.keyspaces[dbIndex].keyspaceSnapshot), keyTotal = _b[0], paginatedData = _b[1];
            res.locals.keyspaces = {
                keyTotal: keyTotal,
                pageSize: validatedPageSize,
                pageNum: validatedPageNum,
                data: paginatedData
            };
        }
        else {
            var keyspacesResponse = { data: [] };
            for (var _i = 0, _c = res.locals.monitors; _i < _c.length; _i++) {
                var monitor = _c[_i];
                var keyspaceData = [];
                var idx = 0;
                for (var _d = 0, _e = monitor.keyspaces; _d < _e.length; _d++) {
                    var keyspace = _e[_d];
                    var _f = getPaginatedKeyspaceData(monitor.keyspaces[idx].keyspaceSnapshot), keyTotal = _f[0], paginatedData = _f[1];
                    keyspaceData.push({
                        keyTotal: keyTotal,
                        pageSize: validatedPageSize,
                        pageNum: validatedPageNum,
                        data: paginatedData
                    });
                    idx += 1;
                }
                keyspacesResponse.data.push({
                    instanceId: monitor.instanceId,
                    keyspaces: keyspaceData
                });
            }
            res.locals.keyspaces = keyspacesResponse;
        }
        return next();
    },
    getKeyspaceHistories: function (req, res, next) {
        var dbIndex = +req.params.dbIndex;
        var historiesLog = res.locals.monitors[0].keyspaces[dbIndex].keyspaceHistories;
        var requestHistoryCount = +req.query.historiesCount;
        if (requestHistoryCount > historiesLog.historiesCount
            || (req.params.historyCount && isNaN(requestHistoryCount))) {
            return next({
                log: 'Request provided an incorrect historyCount parameter',
                status: 400,
                message: { err: 'historyCount is invalid - please ensure it is a number and a valid count received from a previous response' }
            });
        }
        var responseData = {
            historyCount: historiesLog.historiesCount,
            histories: []
        };
        var count = requestHistoryCount ? historiesLog.historiesCount - requestHistoryCount : historiesLog.historiesCount;
        count = count > historiesLog.length ? historiesLog.length : count;
        var current = historiesLog.tail;
        var keynameFilter = req.query.keynameFilter;
        while (count > 0) {
            var filteredKeys = keynameFilter ? current.keys.filter(function (el) {
                return el.key.includes(keynameFilter.toString());
            }) : current.keys;
            var totalMemoryUsage = filteredKeys.reduce(function (acc, el) {
                return acc + el.memoryUsage;
            }, 0);
            responseData.histories.push({
                timestamp: current.timestamp,
                keyCount: filteredKeys.length,
                memoryUsage: totalMemoryUsage
            });
            current = current.previous;
            count -= 1;
        }
        res.locals.histories = responseData;
        return next();
    }
};
exports.default = keyspacesController;
