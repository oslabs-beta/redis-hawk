/*
Module containing implementations of data stores for monitored Redis keyspaces. 

Data stores include:
* EventLogs
* KeyspaceHistories (TBD)

*/

function EventLog(): void {
/*
Represents a running log of events for a given monitored keyspace.
Implemented as a doubly-linked list.

* head and tail should be set to a KeyspaceEvent object.
* eventTotal represents the total number of events logged in EventLog.
  * eventTotal still accounts for any KeyspaceEvents that have been deleted
*/

  this.head = null;
  this.tail = null;
  this.eventTotal = 0
}

function KeyspaceEvent(key: string, event: string): void {
/*
Used to instantiate a new KeyspaceEvent. 
The event will be timestamped based on the time of instantiation.
*/
  this.key = key;
  this.event = event;
  this.timestamp = Date.now();
  this.next = null;
  this.previous = null;
}

EventLog.prototype.add = function(key: string, event: string): void {
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

EventLog.prototype.removeManyViaTimestamp = function(timestamp: Date): void {
/*
Removes all events from the EventLog who have a timestamp earlier than the input timestamp.
*/ 
}