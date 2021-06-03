"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var eventsController = {
    refreshEventLog: function (req, res, next) {
        var refreshData = req.query.refreshData;
        if (refreshData === "0")
            return next();
        if (refreshData !== "1" && refreshData !== undefined)
            return next({
                log: "Request included invalid refreshData query parameter",
                status: 400,
                message: { err: "Please provide a valid refreshData value: 1 or 0" },
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
            var startIndex = (validatedPageNum - 1) * validatedPageSize;
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
                data: paginatedData,
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
                        data: paginatedData,
                    });
                    idx += 1;
                }
                eventsResponse.data.push({
                    instanceId: monitor.instanceId,
                    keyspaces: eventsData,
                });
            }
            res.locals.events = eventsResponse;
        }
        return next();
    },
    validateRequestType: function (req, res, next) {
        if ((req.query.timeInterval && req.query.eventTotal) ||
            (!req.query.timeInterval && !req.query.eventTotal)) {
            return next({
                log: "Request did not provide valid timeInterval or eventTotal query parameters",
                status: 400,
                message: {
                    err: "Please make sure to pass either the timeInterval or eventTotal query parameter, but not both",
                },
            });
        }
        return next();
    },
    getEventsByTimeInterval: function (req, res, next) {
        var dbIndex = +req.params.dbIndex;
        var eventLog = res.locals.monitors[0].keyspaces[dbIndex].eventLog;
        var timeInterval = +req.query.timeInterval;
        if (req.query.timeInterval && isNaN(timeInterval))
            return next({
                log: "Client provided an invalid timeInterval query parameter value",
                status: 400,
                message: {
                    err: "Please provide a valid timeInterval value - a positive integer",
                },
            });
        var responseData = {
            eventTotal: eventLog.eventTotal,
            eventTotals: [],
        };
        var intervalData = {
            start_time: Date.now() - timeInterval,
            end_time: Date.now(),
            eventCount: 0,
        };
        var current = eventLog.tail;
        var keynameFilter = req.query.keynameFilter
            ? req.query.keynameFilter.toString()
            : "";
        var eventTypeFilters = req.query.eventTypes
            ? req.query.eventTypes.toString().split(",")
            : [];
        while (current) {
            while (current.timestamp < intervalData.start_time) {
                responseData.eventTotals.push(intervalData);
                intervalData = {
                    start_time: intervalData.start_time - timeInterval,
                    end_time: intervalData.start_time,
                    eventCount: 0,
                };
            }
            if (eventTypeFilters.length === 0) {
                if (current.key.includes(keynameFilter))
                    intervalData.eventCount += 1;
            }
            else if (current.key.includes(keynameFilter) &&
                eventTypeFilters.includes(current.event)) {
                intervalData.eventCount += 1;
            }
            current = current.previous;
        }
        responseData.eventTotals.push(intervalData);
        res.locals.eventTotals = responseData;
        return next();
    },
    getSingleEventsTotal: function (req, res, next) {
        var dbIndex = +req.params.dbIndex;
        var eventLog = res.locals.monitors[0].keyspaces[dbIndex].eventLog;
        var eventTotalParam = +req.query.eventTotal;
        if (eventTotalParam > eventLog.eventTotal ||
            (eventTotalParam && isNaN(eventTotalParam))) {
            console.log("req.query", req.query);
            return next({
                log: "Client provided an invalid eventTotal query parameter value",
                status: 400,
                message: {
                    err: "Please provide an valid eventTotal query parameter; utilize a value obtained from a previous response",
                },
            });
        }
        var eventCountToTraverse = eventLog.eventTotal - eventTotalParam;
        var eventCount = 0;
        var current = eventLog.tail;
        var keynameFilter = req.query.keynameFilter
            ? req.query.keynameFilter.toString()
            : "";
        var eventTypeFilters = req.query.eventTypes
            ? req.query.eventTypes.toString().split(",")
            : [];
        while (eventCountToTraverse > 0) {
            if (eventTypeFilters.length === 0) {
                if (current.key.includes(keynameFilter))
                    eventCount += 1;
            }
            else if (current.key.includes(keynameFilter) &&
                eventTypeFilters.includes(current.event)) {
                eventCount += 1;
            }
            current = current.previous;
            eventCountToTraverse -= 1;
        }
        res.locals.eventTotals = {
            eventTotal: eventLog.eventTotal,
            eventTotals: [
                {
                    end_time: Date.now(),
                    eventCount: eventCount,
                },
            ],
        };
        return next();
    },
};
exports.default = eventsController;
