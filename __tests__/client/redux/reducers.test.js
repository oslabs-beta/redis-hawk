// import keyspaceSubject from '../../../client/reducers/keyspaceReducer.js';
// import databaseSubject from '../../../client/reducers/databaseReducer.js';
// import eventSubject from '../../../client/reducers/eventsReducer.js';
// import keygraphSubject from '../../../client/reducers/graphReducer.js';

const keyspaceSubject = require('../../../client/reducers/keyspaceReducer.js');

const databaseSubject = require('../../../client/reducers/databaseReducer.js')

const eventSubject = require('../../../client/reducers/eventsReducer.js');

const keygraphSubject = require('../../../client/reducers/graphsReducer.js');


describe('database reducer', () => {
  let state;
  beforeEach(() => {
    state = {
      host: '',
      port: 6739,
      currentDB: 0,
      totalDbs: 0,
    }
  });
  
  describe('default state for databases', () => {
    it('should return a default state hwne given an undefined input', () => {
      expect(databaseSubject(undefined, {type: undefined})).toEqual(state);
    });
  });
  
  describe('unrecognized action types', () => {
    it('should return the original without any duplication', () => {
      const action = {
        type: 'ao;wiehf;aoie'
      };
      expect(databaseSubject(state, action)).toBe(state);
    });
  });
  
  describe('SWITCH_DATABASE', () => {
    const action = {
      type: 'SWITCH_DATABASE',
      payload: 2
    };
    
    it('switches database to #2', () => {
      const { currentDB } = databaseSubject(state, action);
      expect(currentDB).toEqual(2);
    });

    it('returns a state object not strictly equal to the original', () => {
      const resultState = databaseSubject(state);
      expect(resultState).not.toBe(state);
    });
    
    it('includes a database not equal to the original', () => {
        const { currentDB } = databaseSubject(state, action);
        expect(currentDB).not.toBe(state.currentDB);
      });
  });
});

//keyspace reducer testing actions UPDATE_KEYSPACE and UPDATE_TOTALKEYS

describe('keyspace reducer', () => {
    let state;
    beforeEach(() => {
        state = {
            keyspaces: [],
            totalKeys: [],
        }
    })

    describe('default state for keyspace', () => {
        it('should return a default state when given an undefined input', () => {
            expect(keyspaceSubject(undefined, {type: undefined})).toEqual(state);
        })
    })
    describe('unrecognized action types', () => {
        it('should return the original state without any duplication', () => {
            const action = {type: 'whaaaaat?'};
            expect(keyspaceSubject(state, action)).toBe(state);
        })
    })
    
    describe('UPDATE_KEYSPACE', () => {
      const action = {
        type: 'UPDATE_KEYSPACE',
        payload: [{message123: null}],
      };

      it('updates the keyspace', () => {
        const { keyspaces } = keyspaceSubject(state, action);
        expect(keyspaces[0]).toEqual({
          message123: null
        });
      });

      it('returns a state object not strictly equal to the original', () => {
        const resultState = keyspaceSubject(state, action);
        // expect(resultState).toEqual(state);
        expect(resultState).not.toBe(state);
      });
      
      it('includes a keyspace not equal to the original', () => {
        const { keyspaces } = keyspaceSubject(state, action);
        expect(keyspaces).not.toBe(state.keyspaces);
      });
    });

  describe('UPDATE_TOTALKEYS', () => {
    const action = {
      type: 'UPDATE_TOTALKEYS',
      payload: [{totalKeys: 1987493}]
    }
    it('updates the totalKeys', () => {
      const { totalKeys } = keyspaceSubject(state, action);
      expect(totalKeys[0]).toEqual({totalKeys: 1987493});
    })
    it('returns a state object not strictly equal to the original', () => {
      const totalKeysState = keyspaceSubject(state, action);
      // expect(totalKeyState).toEqual(state)
      expect(totalKeysState).not.toBe(state);
    })
    it('includes a totalKey value not strictly equal to the original', () => {
      const { totalKeys } = keyspaceSubject(state, action);
      expect(totalKeys).not.toBe(state.totalKeys);
    })
  })
})

//events reducer testing UPDATE_EVENTS

describe('events reducer', () => {
  let state;
  
  beforeEach(() => { 
    state = {
      events: [],
    }
  })
  describe('default state', () => {
    it('should return a default state when given an undefined input', () => {
      expect(eventSubject(undefined, { type: undefined })).toEqual(state);
    })
  })
  
  describe('unrecognized action types', () => {
    it('should return the original value without any duplication', () => {
      const action = { type: 'wannabemyfriend?' };
      expect(eventSubject(state, action)).toBe(state);
    })
  })
  describe('UPDATE_EVENTS', () => {
    const action = {
      type: 'UPDATE_EVENTS',
      payload: [{name: 'abigail',
        event: 'set',
        time: '8:30'}]
      }
      it('updates the events', () => {
        const { events } = eventSubject(state, action)
        expect(events[0]).toEqual({
          name: 'abigail',
          event: 'set',
          time: '8:30',
        });
      })
      it('returns a state object not strictly equal to the original', () => {
        const eventState = eventSubject(state, action);
        // expect(eventState).toEqual(state)
        expect(eventState).not.toBe(state);
      })
      it('returns an events value not strictly equal to the original', () => {
        const { events } = eventSubject(state, action);
        expect(events).not.toBe(state.events);
      })

  })
})

describe('update keygraph', () => {
  let state;
  beforeEach(() => {
    state = {
      name: '',
      time: '',
      memory: '',
    }
  })

  describe('default state for keygraph', () => {
    it('should return a default state hwne given an undefined input', () => {
      expect(keygraphSubject(undefined, {type: undefined})).toEqual(state);
    });
  });

  describe('unrecognized action types', () => {
    it('should return the original without any duplication', () => {
      const action = {
        type: 'ao;wiehf;aoie'
      };
      expect(keygraphSubject(state, action)).toBe(state);
    });
  });

  describe('UPDATE_KEYGRAPH', () => {
    const action = {
      type: 'UPDATE_KEYGRAPH',
      payload: {
        name: 'message123',
        time: 'Sat May 15 2021 15:18:35 GMT-0400 (Eastern Daylight Time)',
        memory: '1kb'
      }
    };
    
  it('updates the name property', () => {
      const { name } = keygraphSubject(state, action);
      expect(name).toEqual('message123');
    });

    it('updates the time property', () => {
      const { time } = keygraphSubject(state, action);
      expect(time).toEqual('Sat May 15 2021 15:18:35 GMT-0400 (Eastern Daylight Time)');
    });

    it('updates the memory property', () => {
      const { memory } = keygraphSubject(state, action);
      expect(memory).toEqual('1kb');
    });

    it('returns a state object not strictly equal to the original', () => {
      const resultState = keygraphSubject(state, action);
      expect(resultState).not.toBe(state);
      // expect(resultState).toEqual(state);
    });

     it('includes a name prop not equal to the original', () => {
        const { name } = keygraphSubject(state, action);
        expect(name).not.toBe(state.name);
      });
    
    it('includes a time prop not equal to the original', () => {
        const { time } = keygraphSubject(state, action);
        expect(time).not.toBe(state.time);
      });

    it('includes a memory prop not equal to the original', () => {
        const { memory } = keygraphSubject(state, action);
        expect(memory).not.toBe(state.memory);
      });
  });
})