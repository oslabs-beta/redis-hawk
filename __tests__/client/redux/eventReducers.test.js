import eventSubject from "../../../client/reducers/eventsReducer";

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
        events[state.currInstance - 1].keyspaces[state.currDatabase].data
      ).toEqual([
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
      ]);
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

  describe("CHANGE_EVENTS_PAGE", () => {
    const action = {
      type: "CHANGE_EVENTS_PAGE",
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
    it("changes the  page of events", () => {
      const { events } = eventSubject(state, action);
      expect(
        events[state.currInstance - 1].keyspaces[state.currDatabase].data
      ).toEqual([
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
      ]);
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
