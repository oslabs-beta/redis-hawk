/*** KEYSPACE EVENTS ***/
/*
Module containing implementations of data stores for monitored Redis keyspaces. 

Data stores include:
* EventLogs
* KeyspaceHistories 

*/

import type { KeyspaceEvent as KeyspaceEventElement } from './interfaces';

export function EventLog(): void {
  /*
  Represents a running log of events for a given monitored keyspace.
  Implemented as a doubly-linked list.
  
  * head and tail should be set to a KeyspaceEvent object.
  * eventTotal represents the total number of events logged in EventLog.
    * eventTotal still accounts for any KeyspaceEvents that have been deleted
  */
/*** ------------------ ***/
export class EventLog {
  constructor() {
    this.head = null;
    this.tail = null;
    this.eventTotal = 0;
  }

  add(key: string, event: string): void {
    /*
    Adds a new keyspace event to the EventLog.
    */
    const newEvent = new KeyspaceEvent(key, event);
    this.eventTotal += 1;
    if (!this.head) {
      this.head = newEvent;
      this.tail = newEvent;
    } else {
      this.tail.next = newEvent;
      newEvent.previous = this.tail;
      this.tail = newEvent;
    }
  }

  removeManyViaTimestamp(timestamp: Date): void {
    /*
    Removes all events from the EventLog who have a timestamp earlier than the input timestamp.
    */
  }

  returnLogAsArray(eventTotal = 0) {
    //this should probably return some sort of error
    if (eventTotal < 0 || eventTotal >= this.eventTotal) return [];

    const logAsArray = [];
    let count = this.eventTotal - eventTotal;
    let current = this.tail;

    while (count > 0) {
      const event = {
        key: current.key,
        event: current.event,
        timestamp: current.timestamp
      };

      logAsArray.push(event);
      current = current.previous;
      count -= 1;
    }
    return logAsArray;
  }
}

export class KeyspaceEvent {
  /*
  Used to instantiate a new KeyspaceEvent. 
  The event will be timestamped based on the time of instantiation.
  */
  constructor(key: string, event: string): void {
    if (typeof (key) !== 'string' || typeof (event) !== 'string') {
      throw new TypeError('KeyspaceEvent must be constructed with string args');
    }
    this.key = key;
    this.event = event;
    this.timestamp = Date.now();
    this.next = null;
    this.previous = null;
  }
}

/*** KEYSPACE HISTORIES ***/
/*** ------------------ ***/
/*
At a set, preconfigured interval, each RedisMonitor will automatically SCAN for all keys in its keyspaces, also pulling the memory usage for each key/value pair.

The scan results will be timestamped and placed into the keyspace history.

Similar to the event log, the keyspace histories will be implemented as a doubly linked list, except only a head and tail property will be present.

//need method to convert DLL into object -- returnLogAsArray
EventLog.prototype.returnLogAsArray = function(eventTotal: number = 0): KeyspaceEventElement[] {
  //this should probably return some sort of error
  if (eventTotal < 0 || eventTotal >= this.eventTotal) return [];

  const logAsArray: KeyspaceEventElement[] = [];
  let count = this.eventTotal - eventTotal;
  let current = this.tail;

An auto-cleanup process would also be recommended.
*/

export class KeyspaceHistoriesLog {
  constructor() {
    this.head = null;
    this.tail = null;
    this.historiesCount = 0;
  }
  
  add(keys: array): void {
    //ads new events to keyspace histories
    const newHistory = new KeyspaceHistory(key);
    this.historiesCount += 1;
    if (!this.head) {
      this.head = newHistory;
      this.tail = newHistory
    } else {
      this.tail.next = newHistory;
      newHistory.previous = this.tail;
      this.tail = newHistory;
    }
  }

  returnLogAsArray(historiesCount = 0) {
    //need error handling
    if (historiesCount < 0 || historiesCount >= this.historiesCount) return [];

    const logAsArray = [];
    let count = this.historiesCount - historiesCount;
    let current = this.tail;

    while (count > 0) {
      const history = {
        keys: current.keys,
        history: current.history,
        timestamp: current.timestamp
      };

      logAsArray.push(history);
      current = current.previous;
      count -= 1;
    }
    return logAsArray;
  }
};

export class KeyspaceHistory {
  //instantiates a new keyspace history 
  constructor(keys: string[]): void {
    if (typeof (keys) !== 'string' || typeof (history) !== 'string') {
      throw new TypeError('KeyspaceHistory must be constructed with string arguments')
    }
    this.keys = keys;
    this.timestamp = Date.now();
    this.next = null;
    this.previous = null;
  }
};
