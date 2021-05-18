import { string } from "yargs";

const { EventLog, KeyspaceEvent } = require('../../server/redis-monitors/models/data-stores');

describe('RedisMonitors Data Stores Unit Tests', () => {

  describe('Keyspace Event', () => {

    const key = 'message:1';
    const eventType = 'set';
    const event = new KeyspaceEvent(key, eventType);

    it('should have a next and previous property', () => {
      expect(event).toEqual(expect.objectContaining({
        previous: null,
        next: null
      }));
    });

    it('should set the key and event properties using the constructor arguments', () => {
      expect(event.key).toEqual(key);
      expect(event.event).toEqual(eventType);
    })

    it('should have a timestamp property for when the KeyspaceEvent was initialized', () => {
      expect(Date.now() - event.timestamp).toBeLessThan(1000); //less than 1000ms ago
    })

    it('should not allow non-string arguments', () => {
      expect(() => {
        new KeyspaceEvent(1, eventType)
      }).toThrow(TypeError);

      expect(() => {
        new KeyspaceEvent(key, [])
      }).toThrow(TypeError);
    });

  });

  describe('Event Log', () => {

    let eventLog = new EventLog();

    it('should have a head and a tail', () => {
      expect(eventLog).toEqual(expect.objectContaining({
        head: null,
        tail: null,
      }));
    });

    it('should have an eventTotal initialized to 0', () => {
      expect(eventLog.eventTotal).toEqual(0);
    });

    describe('Add Method', () => {

      let eventLog = new EventLog();

      it('should add the first Keyspace Event as the head and tail', () => {
        
        const event = new KeyspaceEvent('somekey', 'get');
        eventLog.add('somekey', 'get');
        expect(eventLog.head.key).toEqual(event.key);
        expect(eventLog.head.event).toEqual(event.event);
        expect(eventLog.tail.key).toEqual(event.key);
        expect(eventLog.tail.event).toEqual(event.event);
      });

      it('should change the tail when adding additional Keyspace Events', () => {
        eventLog.add('anotherkey', 'set');
        expect(eventLog.tail).not.toBe(eventLog.head);
      })

      it('should not change the head when adding additional Keyspace Events', () => {
        const currentHead = eventLog.head;
        eventLog.add('thirdkey', 'mget');
        expect(eventLog.head).toBe(currentHead);
      });

      it('should set the previous and next properties correctly on the newest Keyspace Event', () => {
        eventLog.add('fourthkey', 'set');
        expect(eventLog.tail.previous.key).toEqual('thirdkey');
        expect(eventLog.tail.next).toEqual(null);
      });

      it('should properly set the next property of the previous KeyspaceEvent when adding a new KeyspaceEvent', () => {
        expect(eventLog.tail.previous.next).toBe(eventLog.tail);
      });

    });

    describe('returnLogAsArray method', () => {

      const eventLog = new EventLog();

      const newEvents = [
        {key: 'message:1', event: 'set'},
        {key: 'message:2', event: 'set'},
        {key: 'message:3', event: 'set'},
        {key: 'message:3', event: 'get'},
        {key: 'message:4', event: 'set'},
        {key: 'message:1', event: 'get'},
      ];

      newEvents.forEach(event => {
        eventLog.add(event.key, event.event);
      })

      it('should return an array of KeyspaceEvent objects', () => {

        const arrayLog = eventLog.returnLogAsArray();
        expect(arrayLog).toBeInstanceOf(Array);
        arrayLog.forEach(event => {
          expect(event).toEqual(expect.objectContaining({
            key: expect.any(String),
            event: expect.any(String),
            timestamp: expect.any(Number)
          }));
        });
      });

      it('should return the KeyspaceEvent objects in the order of most recent to least recent', () => {

        const arrayLog = eventLog.returnLogAsArray();
        let previousTimestamp = arrayLog[0].timestamp;

        arrayLog.slice(1).forEach(event => {
          expect(previousTimestamp).toBeGreaterThanOrEqual(event.timestamp);
          previousTimestamp = event.timestamp;
        });
      });

      it('should return all of the KeyspaceEvents in the log if no eventTotal argument is provided', () => {

        const arrayLog = eventLog.returnLogAsArray();
        arrayLog.forEach((event, idx) => {
          expect(event.key).toEqual(newEvents[idx].key);
          expect(event.event).toEqual(newEvents[idx].event);
        });
      });

      it('should return the correct number of KeyspaceEvents if an eventTotal argument is provided', () => {        

        const arrayLog = eventLog.returnLogAsArray(2);
        expect(arrayLog).toHaveLength(newEvents.length - 2);
      });

      it('should return the correct number of KeyspaceEvents if an eventTotal argument is provided', () => {        

        const arrayLog = eventLog.returnLogAsArray(2);
        expect(arrayLog).toHaveLength(newEvents.length - 2);
      });

      it('should return the most recent KeyspaceEvents if an eventTotal argument is provided, in order of most to least recent', () => {

        const arrayLog = eventLog.returnLogAsArray(2);
        let previousTimestamp = arrayLog[0].timestamp;

        arrayLog.slice(1).forEach(event => {
          expect(previousTimestamp).toBeGreaterThanOrEqual(event.timestamp);
          previousTimestamp = event.timestamp;
        });
      });

    });

  });
});