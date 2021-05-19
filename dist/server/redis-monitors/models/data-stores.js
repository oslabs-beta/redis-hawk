"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyspaceEvent = exports.EventLog = void 0;
function EventLog() {
    this.head = null;
    this.tail = null;
    this.eventTotal = 0;
}
exports.EventLog = EventLog;
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
exports.KeyspaceEvent = KeyspaceEvent;
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
EventLog.prototype.removeManyViaTimestamp = function (timestamp) {
};
