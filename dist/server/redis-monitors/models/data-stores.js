"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyspaceHistory = exports.KeyspaceHistoriesLog = exports.KeyspaceEvent = exports.EventLog = void 0;
var EventLog = (function () {
    function EventLog() {
        this.head = null;
        this.tail = null;
        this.eventTotal = 0;
    }
    EventLog.prototype.add = function (key, event) {
        var newEvent = new KeyspaceEvent(key, event);
        this.eventTotal += 1;
        if (!this.head) {
            this.head = newEvent;
            this.tail = newEvent;
        }
        else {
            this.tail.next = newEvent;
            newEvent.previous = this.tail;
            this.tail = newEvent;
        }
    };
    EventLog.prototype.removeManyViaTimestamp = function (timestamp) {
    };
    EventLog.prototype.returnLogAsArray = function (eventTotal) {
        if (eventTotal === void 0) { eventTotal = 0; }
        if (eventTotal < 0 || eventTotal >= this.eventTotal)
            return [];
        var logAsArray = [];
        var count = this.eventTotal - eventTotal;
        var current = this.tail;
        while (count > 0) {
            var event_1 = {
                key: current.key,
                event: current.event,
                timestamp: current.timestamp
            };
            logAsArray.push(event_1);
            current = current.previous;
            count -= 1;
        }
        return logAsArray;
    };
    return EventLog;
}());
exports.EventLog = EventLog;
var KeyspaceEvent = (function () {
    function KeyspaceEvent(key, event) {
        if (typeof (key) !== 'string' || typeof (event) !== 'string') {
            throw new TypeError('KeyspaceEvent must be constructed with string args');
        }
        this.key = key;
        this.event = event;
        this.timestamp = Date.now();
        this.next = null;
        this.previous = null;
    }
    return KeyspaceEvent;
}());
exports.KeyspaceEvent = KeyspaceEvent;
var KeyspaceHistoriesLog = (function () {
    function KeyspaceHistoriesLog() {
        this.head = null;
        this.tail = null;
        this.historiesCount = 0;
    }
    KeyspaceHistoriesLog.prototype.add = function (keyDetails) {
        var newHistory = new KeyspaceHistory(keyDetails);
        this.historiesCount += 1;
        if (!this.head) {
            this.head = newHistory;
            this.tail = newHistory;
        }
        else {
            this.tail.next = newHistory;
            newHistory.previous = this.tail;
            this.tail = newHistory;
        }
    };
    KeyspaceHistoriesLog.prototype.returnLogAsArray = function (historiesCount) {
        if (historiesCount === void 0) { historiesCount = 0; }
        if (historiesCount < 0 || historiesCount >= this.historiesCount)
            return [];
        var logAsArray = [];
        var count = this.historiesCount - historiesCount;
        var current = this.tail;
        while (count > 0) {
            var history_1 = {
                keys: current.keys,
                timestamp: current.timestamp
            };
            logAsArray.push(history_1);
            current = current.previous;
            count -= 1;
        }
        return logAsArray;
    };
    return KeyspaceHistoriesLog;
}());
exports.KeyspaceHistoriesLog = KeyspaceHistoriesLog;
;
var KeyspaceHistory = (function () {
    function KeyspaceHistory(keys) {
        if (!Array.isArray(keys)) {
            throw new TypeError('KeyspaceHistory must be constructed with an array of KeyDetails');
        }
        this.keys = keys;
        this.timestamp = Date.now();
        this.next = null;
        this.previous = null;
    }
    return KeyspaceHistory;
}());
exports.KeyspaceHistory = KeyspaceHistory;
;
