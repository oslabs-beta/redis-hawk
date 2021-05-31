import keyspaceSubject from "../../../client/reducers/keyspaceReducer";
import databaseSubject from "../../../client/reducers/databaseReducer";
import eventSubject from "../../../client/reducers/eventsReducer";
import keygraphSubject from "../../../client/reducers/graphsReducer";
import instanceInfoSubject from "../../../client/reducers/instanceInfoReducer";
import currDisplaySubject from "../../../client/reducers/currentDisplayReducer";
import pageSubject from "../../../client/reducers/pageReducer";
import dataPageSubject from "../../../client/reducers/dataPageReducer";
import instanceSubject from "../../../client/reducers/instanceReducer";
// const keyspaceSubject = require('../../../client/reducers/keyspaceReducer.js');

// const databaseSubject = require('../../../client/reducers/databaseReducer.js');

// const eventSubject = require('../../../client/reducers/eventsReducer.js');

// const keygraphSubject = require('../../../client/reducers/graphsReducer.js');

describe("database reducer", () => {
  let state;
  beforeEach(() => {
    state = {
      currDatabase: 0,
    };
  });

  describe("default state for databases", () => {
    it("should return a default state when given an undefined input", () => {
      expect(databaseSubject(undefined, { type: undefined })).toEqual(state);
    });
  });

  describe("unrecognized action types", () => {
    it("should return the original without any duplication", () => {
      const action = {
        type: "ao;wiehf;aoie",
      };
      expect(databaseSubject(state, action)).toBe(state);
    });
  });

  describe("SWITCH_DATABASE", () => {
    const action = {
      type: "SWITCH_DATABASE",
      payload: 2,
    };

    it("switches database to #2", () => {
      const { currDatabase } = databaseSubject(state, action);
      expect(currDatabase).toEqual(2);
    });

    it("returns a state object not strictly equal to the original", () => {
      const resultState = databaseSubject(state, action);
      expect(resultState).not.toBe(state);
    });

    it("includes a database not equal to the original", () => {
      const { currDatabase } = databaseSubject(state, action);
      expect(currDatabase).not.toBe(state.currDatabase);
    });
  });
});

describe("instance reducer", () => {
  let state;
  beforeEach(() => {
    state = {
      currInstance: 1,
    };
  });

  describe("default state for instances", () => {
    it("should return a default state when given an undefined input", () => {
      expect(instanceSubject(undefined, { type: undefined })).toEqual(state);
    });
  });

  describe("unrecognized action types", () => {
    it("should return the original without any duplication", () => {
      const action = {
        type: "ao;wiehf;aoie",
      };
      expect(instanceSubject(state, action)).toBe(state);
    });
  });

  describe("SWITCH_INSTANCE", () => {
    const action = {
      type: "SWITCH_INSTANCE",
      payload: 2,
    };

    it("switches instance to #2", () => {
      const { currInstance } = instanceSubject(state, action);
      expect(currInstance).toEqual(2);
    });

    it("returns a state object not strictly equal to the original", () => {
      const resultState = instanceSubject(state, action);
      expect(resultState).not.toBe(state);
    });

    it("includes a instance not equal to the original", () => {
      const { currInstance } = instanceSubject(state, action);
      expect(currInstance).not.toBe(state.currInstance);
    });
  });
});

//keyspace reducer testing actions UPDATE_KEYSPACE and UPDATE_TOTALKEYS

describe("keyspace reducer", () => {
  let state;
  beforeEach(() => {
    state = {
      currDatabase: 0,
      keyspace: [[]],
    };
  });

  describe("default state for keyspace", () => {
    it("should return a default state when given an undefined input", () => {
      expect(keyspaceSubject(undefined, { type: undefined })).toEqual(state);
    });
  });
  describe("unrecognized action types", () => {
    it("should return the original state without any duplication", () => {
      const action = { type: "whaaaaat?" };
      expect(keyspaceSubject(state, action)).toBe(state);
    });
  });

  describe("UPDATE_KEYSPACE", () => {
    const action = {
      type: "UPDATE_KEYSPACE",
      payload: {
        keyspace: [{ key: "Abigail", value: "isAwesome", type: "hash" }],
        dbIndex: 0,
      },
    };

    it("updates the keyspace", () => {
      const { keyspace } = keyspaceSubject(state, action);
      expect(keyspace[state.currDatabase][0]).toEqual({
        key: "Abigail",
        value: "isAwesome",
        type: "hash",
      });
    });

    it("returns a state object not strictly equal to the original", () => {
      const resultState = keyspaceSubject(state, action);
      expect(resultState).not.toBe(state);
    });

    it("includes a keyspace not equal to the original", () => {
      const { keyspace } = keyspaceSubject(state, action);
      expect(keyspace[state.currDatabase][0]).not.toBe(state.keyspace);
    });
  });
});

describe("events reducer", () => {
  let state;

  beforeEach(() => {
    state = {
      currInstance: 1,
      currDatabase: 0,
      events: [
        {
          instanceId: 1,
          keyspaces: [
            {
              eventTotal: 0,
              pageSize: 50,
              pageNum: 4,
              data: [
                {
                  key: "loading",
                  event: "loading",
                  timestamp: "loading",
                },
              ],
            },
          ],
        },
      ],
    };
  });
  describe("default state", () => {
    it("should return a default state when given an undefined input", () => {
      expect(eventSubject(undefined, { type: undefined })).toEqual(state);
    });
  });

  describe("unrecognized action types", () => {
    it("should return the original value without any duplication", () => {
      const action = { type: "wannabemyfriend?" };
      expect(eventSubject(state, action)).toBe(state);
    });
  });

  describe("LOAD_ALL_EVENTS", () => {
    const action = {
      type: "LOAD_ALL_EVENTS",
      payload: {
        events: [
          {
            instanceId: 1,
            keyspaces: [
              {
                eventTotal: 0,
                pageSize: 1,
                pageNum: 1,
                data: [
                  {
                    key: "Arthur",
                    event: "Set",
                    timestamp: "07:00",
                  },
                ],
              },
            ],
          },
        ],
        currDatabase: 0,
      },
    };
    it("loads all events from server", () => {
      const { events } = eventSubject(state, action);
      expect(
        events[state.currInstance - 1].keyspaces[state.currDatabase]
      ).toEqual({
        key: "Arthur",
        event: "Set",
        timestamp: "07:00",
      });
    });
    it("returns a state object not strictly equal to the original", () => {
      const eventState = eventSubject(state, action);
      // expect(eventState).toEqual(state)
      expect(eventState).not.toBe(state);
    });
    it("returns an events value not strictly equal to the original", () => {
      const { events } = eventSubject(state, action);
      expect(events).not.toBe(state.events);
    });
  });
  describe("REFRESH_EVENTS", () => {
    const action = {
      type: "REFRESH_EVENTS",
      payload: {
        events: [
          {
            instanceId: 1,
            keyspaces: [
              {
                eventTotal: 2,
                pageSize: 1,
                pageNum: 2,
                data: [
                  {
                    key: "Arthur",
                    event: "Set",
                    timestamp: "07:00",
                  },
                  {
                    key: "Abby",
                    event: "Set",
                    timestamp: "07:10",
                  },
                ],
              },
            ],
          },
        ],
        currDatabase: 0,
      },
    };
    it("returns specific page of events", () => {
      const { events } = eventSubject(state, action);
      expect(
        events[state.currInstance - 1].keyspaces[state.currDatabase]
      ).toEqual({
        key: "Arthur",
        event: "Set",
        timestamp: "07:00",
      });
    });
    it("returns a state object not strictly equal to the original", () => {
      const eventState = eventSubject(state, action);
      // expect(eventState).toEqual(state)
      expect(eventState).not.toBe(state);
    });
    it("returns an events value not strictly equal to the original", () => {
      const { events } = eventSubject(state, action);
      expect(events).not.toBe(state.events);
    });
  });
});

///we have to fix this later

// describe("update events graph", () => {
//   let state;
//   beforeEach(() => {
//     state = {
//       name: "",
//       time: "",
//       memory: "",
//     };
//   });

//   describe("default state for keygraph", () => {
//     it("should return a default state hwne given an undefined input", () => {
//       expect(keygraphSubject(undefined, { type: undefined })).toEqual(state);
//     });
//   });

//   describe("unrecognized action types", () => {
//     it("should return the original without any duplication", () => {
//       const action = {
//         type: "ao;wiehf;aoie",
//       };
//       expect(keygraphSubject(state, action)).toBe(state);
//     });
//   });

//   describe("UPDATE_KEYGRAPH", () => {
//     const action = {
//       type: "UPDATE_KEYGRAPH",
//       payload: {
//         name: "message123",
//         time: "Sat May 15 2021 15:18:35 GMT-0400 (Eastern Daylight Time)",
//         memory: "1kb",
//       },
//     };

//     it("updates the name property", () => {
//       const { name } = keygraphSubject(state, action);
//       expect(name).toEqual("message123");
//     });

//     it("updates the time property", () => {
//       const { time } = keygraphSubject(state, action);
//       expect(time).toEqual(
//         "Sat May 15 2021 15:18:35 GMT-0400 (Eastern Daylight Time)"
//       );
//     });

//     it("updates the memory property", () => {
//       const { memory } = keygraphSubject(state, action);
//       expect(memory).toEqual("1kb");
//     });

//     it("returns a state object not strictly equal to the original", () => {
//       const resultState = keygraphSubject(state, action);
//       expect(resultState).not.toBe(state);
//       // expect(resultState).toEqual(state);
//     });

//     it("includes a name prop not equal to the original", () => {
//       const { name } = keygraphSubject(state, action);
//       expect(name).not.toBe(state.name);
//     });

//     it("includes a time prop not equal to the original", () => {
//       const { time } = keygraphSubject(state, action);
//       expect(time).not.toBe(state.time);
//     });

//     it("includes a memory prop not equal to the original", () => {
//       const { memory } = keygraphSubject(state, action);
//       expect(memory).not.toBe(state.memory);
//     });
//   });
// });

//payload:
// databases: 16
// host: "127.0.0.1"
// instanceId: 1
// port: 6379
describe("updateInstanceInfo", () => {
  let state;
  beforeEach(() => {
    state = {
      instanceInfo: [],
    };
  });

  describe("default state for instanceInfo", () => {
    it("should return a default state when given an undefined input", () => {
      expect(instanceInfoSubject(undefined, { type: undefined })).toEqual(
        state
      );
    });
  });
  describe("unrecognized action types", () => {
    it("should return the original state without any duplication", () => {
      const action = { type: "awefh;a" };
      expect(instanceInfoSubject(state, action)).toBe(state);
    });
  });

  describe("UPDATE_INSTANCEINFO", () => {
    const action = {
      type: "UPDATE_INSTANCEINFO",
      payload: [
        {
          instanceId: 3,
          databases: 16,
          host: "127.0.0.1",
          port: 6379,
          recordKeyspaceHistoryFrequency: 100,
        },
      ],
    };

    it("updates instance info", () => {
      const { instanceInfo } = instanceInfoSubject(state, action);
      expect(instanceInfo).toEqual([
        {
          instanceId: 3,
          databases: 16,
          host: "127.0.0.1",
          port: 6379,
          recordKeyspaceHistoryFrequency: 100,
        },
      ]);
    });

    it("returns a state object not strictly equal to the original", () => {
      const resultState = instanceInfoSubject(state, action);
      expect(resultState).not.toBe(state);
    });

    it("includes instanceInfo prop not equal to the original", () => {
      const { instanceInfo } = instanceInfoSubject(state, action);
      expect(instanceInfo).not.toBe(state.instanceInfo);
    });
  });
});

describe("update current display", () => {
  let state;
  beforeEach(() => {
    state = {
      currDisplay: {
        filter: "",
        category: "",
      },
    };
  });

  describe("default state for currDisplay", () => {
    it("should return a default state when given an undefined input", () => {
      expect(currDisplaySubject(undefined, { type: undefined })).toEqual(state);
    });
  });
  describe("unrecognized action types", () => {
    it("should return the original state without any duplication", () => {
      const action = { type: "awefh;a" };
      expect(currDisplaySubject(state, action)).toBe(state);
    });
  });

  describe("UPDATE_CURRDISPLAY", () => {
    const action = {
      type: "UPDATE_CURRDISPLAY",
      payload: {
        filter: "type",
        category: "events",
      },
    };
    //payload: { filter: filter, category: category },
    it("updates the current display", () => {
      const { currDisplay } = currDisplaySubject(state, action);
      expect(currDisplay).toEqual({
        filter: "type",
        category: "events",
      });
    });

    it("returns a state object not strictly equal to the original", () => {
      const resultState = currDisplaySubject(state, action);
      expect(resultState).not.toBe(state);
    });

    it("includes dbInfo prop not equal to the original", () => {
      const { currDisplay } = currDisplaySubject(state, action);
      expect(currDisplay).not.toBe(state.currDisplay);
    });
  });
});

describe("update current page", () => {
  let state;
  beforeEach(() => {
    state = {
      currPage: "keyspace",
    };
  });

  describe("default state for current page", () => {
    it("should return a default state when given an undefined input", () => {
      expect(pageSubject(undefined, { type: undefined })).toEqual(state);
    });
  });
  describe("unrecognized action types", () => {
    it("should return the original state without any duplication", () => {
      const action = { type: "awefh;a" };
      expect(pageSubject(state, action)).toBe(state);
    });
  });

  describe("UPDATE_CURRPAGE", () => {
    const action = {
      type: "UPDATE_CURRPAGE",
      payload: "keyspace",
    };

    it("updates the current display", () => {
      const { currPage } = pageSubject(state, action);
      expect(currPage).toEqual("keyspace");
    });

    it("returns a state object not strictly equal to the original", () => {
      const resultState = pageSubject(state, action);
      expect(resultState).not.toBe(state.currPage);
    });
  });
});

describe("update page size and page num", () => {
  let state;
  beforeEach(() => {
    state = {
      pageSize: 50,
      pageNum: 1,
    };
  });

  describe("default state for page size and number of pages", () => {
    it("should return a default state when given an undefined input", () => {
      expect(dataPageSubject(undefined, { type: undefined })).toEqual(state);
    });
  });
  describe("unrecognized action types", () => {
    it("should return the original state without any duplication", () => {
      const action = { type: "awefh;a" };
      expect(dataPageSubject(state, action)).toBe(state);
    });
  });

  describe("UPDATE_PAGESIZE", () => {
    const action = {
      type: "UPDATE_PAGESIZE",
      payload: 10,
    };

    it("updates the current display", () => {
      const { pageSize } = dataPageSubject(state, action);
      expect(pageSize).toEqual(10);
    });

    it("returns a state object not strictly equal to the original", () => {
      const resultState = dataPageSubject(state, action);
      expect(resultState).not.toBe(state.pageSize);
    });
  });
  describe("UPDATE_PAGENUM", () => {
    const action = {
      type: "UPDATE_PAGENUM",
      payload: 2,
    };

    it("updates the current display", () => {
      const { pageNum } = dataPageSubject(state, action);
      expect(pageNum).toEqual(2);
    });

    it("returns a state object not strictly equal to the original", () => {
      const resultState = dataPageSubject(state, action);
      expect(resultState).not.toBe(state.pageSize);
    });
  });
});

//   describe("UPDATE_TOTALKEYS", () => {
//     const action = {
//       type: "UPDATE_TOTALKEYS",
//       payload: [{ totalKeys: 1987493 }],
//     };
//     it("updates the totalKeys", () => {
//       const { totalKeys } = keyspaceSubject(state, action);
//       expect(totalKeys[0]).toEqual({ totalKeys: 1987493 });
//     });
//     it("returns a state object not strictly equal to the original", () => {
//       const totalKeysState = keyspaceSubject(state, action);
//       // expect(totalKeyState).toEqual(state)
//       expect(totalKeysState).not.toBe(state);
//     });
//     it("includes a totalKey value not strictly equal to the original", () => {
//       const { totalKeys } = keyspaceSubject(state, action);
//       expect(totalKeys).not.toBe(state.totalKeys);
//     });
//   });
// });

//events reducer testing UPDATE_EVENTS
