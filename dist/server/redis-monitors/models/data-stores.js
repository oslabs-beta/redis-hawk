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
EventLog.prototype.removeManyViaTimestamp = function (timestamp) {
};
