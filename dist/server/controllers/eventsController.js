"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
;
var eventsController = {
    refreshEventLog: function (req, res, next) {
        var refreshData = req.query.refreshData;
        if (refreshData === '0')
            return next();
        if (refreshData !== '1' && refreshData !== undefined)
            return next({
                log: 'Request included invalid refreshData query parameter',
                status: 400,
                message: { err: 'Please provide a valid refreshData value: 1 or 0' }
            });
        var dbIndex = +req.params.dbIndex;
        if (dbIndex >= 0) {
            var keyspace = res.locals.monitors[0].keyspaces[dbIndex];
            keyspace.eventLogSnapshot = keyspace.eventLog.returnLogAsArray();
        }
        else {
            for (var _i = 0, _a = res.locals.monitors; _i < _a.length; _i++) {
                var monitor = _a[_i];
                var idx = 0;
                for (var _b = 0, _c = monitor.keyspaces; _b < _c.length; _b++) {
                    var keyspace = _c[_b];
                    keyspace.eventLogSnapshot = keyspace.eventLog.returnLogAsArray();
                    idx += 1;
                }
            }
        }
        return next();
    },
    getEventsPages: function (req, res, next) {
        var _a = req.query, keynameFilter = _a.keynameFilter, eventTypeFilter = _a.eventTypeFilter, pageNum = _a.pageNum, pageSize = _a.pageSize;
        var validatedPageNum = pageNum ? +pageNum : 1;
        var validatedPageSize = pageSize ? +pageSize : 5;
        var getPaginatedEventsData = function (eventLogSnapshot) {
            if (keynameFilter) {
                eventLogSnapshot = eventLogSnapshot.filter(function (eventDetails) {
                    return eventDetails.key.includes(keynameFilter.toString());
                });
            }
            if (eventTypeFilter) {
                eventLogSnapshot = eventLogSnapshot.filter(function (eventDetails) {
                    return eventDetails.event === eventTypeFilter.toString();
                });
            }
            var eventTotal = eventLogSnapshot.length;
            var startIndex = ((validatedPageNum - 1) * validatedPageSize);
            var endIndex = validatedPageNum * validatedPageSize;
            return [eventTotal, eventLogSnapshot.slice(startIndex, endIndex)];
        };
        var dbIndex = +req.params.dbIndex;
        if (dbIndex >= 0) {
            var monitor = res.locals.monitors[0];
            var _b = getPaginatedEventsData(monitor.keyspaces[dbIndex].eventLogSnapshot), eventTotal = _b[0], paginatedData = _b[1];
            res.locals.events = {
                eventTotal: eventTotal,
                pageSize: validatedPageSize,
                pageNum: validatedPageNum,
                data: paginatedData
            };
        }
        else {
            var eventsResponse = { data: [] };
            for (var _i = 0, _c = res.locals.monitors; _i < _c.length; _i++) {
                var monitor = _c[_i];
                var eventsData = [];
                var idx = 0;
                for (var _d = 0, _e = monitor.keyspaces; _d < _e.length; _d++) {
                    var keyspace = _e[_d];
                    var _f = getPaginatedEventsData(keyspace.eventLogSnapshot), eventTotal = _f[0], paginatedData = _f[1];
                    eventsData.push({
                        eventTotal: eventTotal,
                        pageSize: validatedPageSize,
                        pageNum: validatedPageNum,
                        data: paginatedData
                    });
                    idx += 1;
                }
                eventsResponse.data.push({
                    instanceId: monitor.instanceId,
                    keyspaces: eventsData
                });
            }
            res.locals.events = eventsResponse;
        }
        return next();
    }
};
exports.default = eventsController;
