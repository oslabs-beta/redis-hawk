/*
Module containing implementations of data stores for monitored Redis keyspaces. 

Data stores include:
* EventLogs
* KeyspaceHistories (TBD)

*/

export function EventLog(): void {
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

export function KeyspaceEvent(key: string, event: string): void {
<<<<<<< HEAD
  /*
  Used to instantiate a new KeyspaceEvent. 
  The event will be timestamped based on the time of instantiation.
  */
  if (typeof (key) !== 'string' || typeof (event) !== 'string') {
    throw new TypeError('KeyspaceEvent must be constructed with string args');
  }
=======
/*
Used to instantiate a new KeyspaceEvent. 
The event will be timestamped based on the time of instantiation.
*/
  if (typeof(key) !== 'string' || typeof(event) !== 'string') {
    throw new TypeError('KeyspaceEvent must be constructed with string args');
  }

>>>>>>> main
  this.key = key;
  this.event = event;
  this.timestamp = Date.now();
  this.next = null;
  this.previous = null;
}

EventLog.prototype.add = function (key: string, event: string): void {
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

//need method that generates response array based on event total passed in (default is 0)


//need method to convert DLL into object -- returnLogAsArray
EventLog.prototype.returnLogAsArray = function (eventTotalIdx = 0) {
  //this should probably return some sort of error
  if (eventTotalIdx < 0 || eventTotalIdx >= this.eventTotal) return;

  const logAsArray = [];
  let count = this.eventTotal - eventTotalIdx;
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





EventLog.prototype.removeManyViaTimestamp = function (timestamp: Date): void {
  /*
  Removes all events from the EventLog who have a timestamp earlier than the input timestamp.
  */
}