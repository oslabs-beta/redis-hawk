/*** KEYSPACE EVENTS ***/
/*
Module containing implementations of data stores for monitored Redis keyspaces. 

Data stores include:
* EventLogs
* KeyspaceHistories 

*/

import type { 
  KeyspaceEvent as KeyspaceEventElement, 
  KeyspaceEventNode,
  KeyspaceHistory as KeyspaceHistoryElement,
  KeyspaceHistoryNode,
  KeyDetails
} from './interfaces';

export class EventLog {

  /*
  Represents a running log of events for a given monitored keyspace.
  Implemented as a doubly-linked list.
  
    * head and tail should be set to a KeyspaceEvent object.
    * eventTotal represents the total number of events logged in EventLog.
      * eventTotal still accounts for any KeyspaceEvents that have been deleted
    * length represents the current length of the EventLog (the number of KeyspaceEvent objects within)
    * maxLength represents the maximum number of KeyspaceEvents objects allowed within.
      * When the maxLength is reached, the EventLog's add method will reset the head to its subsequent KeyspaceEvent.
  */

  head: null | KeyspaceEventNode;
  tail: null | KeyspaceEventNode;
  eventTotal: number;
  maxLength: number;
  length: number;

  constructor(maxLength) {

    if (!Number.isInteger(maxLength) || maxLength <= 0) throw new TypeError('maxLength must be positive integer!');
    this.head = null;
    this.tail = null;
    this.eventTotal = 0;
    this.length = 0;
    this.maxLength = maxLength;
  }

  add(key: string, event: string): void {
    /*
    Adds a new keyspace event to the EventLog.
    */

    //If the EventLog has reached its maximum configured length (specified via config.json)
    //Drop the head of the eventLog (the earliest event maintained in the log);
    if (this.length >= this.maxLength) {
      this.head = this.head.next;
      this.head.previous = null;
      this.length -= 1;
    }

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

  reset(): void {
  //Resets the EventLog to its initial state (clear out the log).
    this.head = null;
    this.tail = null;
    this.eventTotal = 0;
    this.length = 0;
  }

  returnLogAsArray(eventTotal = 0): KeyspaceEventElement[] {

    if (eventTotal < 0 || eventTotal >= this.eventTotal) return [];

    const logAsArray: KeyspaceEventElement[] = [];
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

export class KeyspaceEvent implements KeyspaceEventNode {
  /*
  Used to instantiate a new KeyspaceEvent. 
  The event will be timestamped based on the time of instantiation.
  */

  key: string;
  event: string;
  timestamp: number;
  next: null | KeyspaceEventNode;
  previous: null | KeyspaceEventNode;

  constructor(key: string, event: string) {
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

  head: null | KeyspaceHistoryNode;
  tail: null | KeyspaceHistoryNode;
  historiesCount: number;
  maxLength: number;
  length: number;

  constructor(maxLength) {

    if (!Number.isInteger(maxLength) || maxLength <= 0) throw new TypeError('maxLength must be positive integer!');

    this.head = null;
    this.tail = null;
    this.historiesCount = 0;
    this.maxLength = maxLength;
    this.length = 0;
  }
  
  add(keyDetails: KeyDetails[]): void {
    //adds new events to keyspace histories

    //If the EventLog has reached its maximum configured length (specified via config.json)
    //Drop the head of the eventLog (the earliest event maintained in the log);
    if (this.length >= this.maxLength) {
      this.head = this.head.next;
      this.head.previous = null;
      this.length -= 1;
    }

    const newHistory = new KeyspaceHistory(keyDetails);
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

  reset(): void {
    //resets the histories log to its initial state (clears out log)
    this.head = null;
    this.tail = null;
    this.historiesCount = 0;
    this.length = 0;
  }

  returnLogAsArray(historiesCount = 0): KeyspaceHistoryElement[] {
    //need error handling
    if (historiesCount < 0 || historiesCount >= this.historiesCount) return [];

    const logAsArray: KeyspaceHistoryElement[] = [];
    let count = this.historiesCount - historiesCount;
    let current = this.tail;

    while (count > 0) {
      const history = {
        keys: current.keys,
        timestamp: current.timestamp
      };

      logAsArray.push(history);
      current = current.previous;
      count -= 1;
    }
    return logAsArray;
  }
};

export class KeyspaceHistory implements KeyspaceHistoryNode {
  
  keys: KeyDetails[];
  timestamp: number;
  next: null | KeyspaceHistoryNode;
  previous: null | KeyspaceHistoryNode;

  constructor(keys: KeyDetails[]) {
    if (!Array.isArray(keys)) {
      throw new TypeError('KeyspaceHistory must be constructed with an array of KeyDetails')
    }
    this.keys = keys;
    this.timestamp = Date.now();
    this.next = null;
    this.previous = null;
  }
};

