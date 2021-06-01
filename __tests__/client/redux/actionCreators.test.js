import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import {
  loadKeyspaceActionCreator,
  refreshKeyspaceActionCreator,
  changeKeyspacePageActionCreator,
} from "../../../client/action-creators/keyspaceConnections";
import * as actions from "../../../client/actions/actionTypes";
import fetchMock from "fetch-mock";
import expect from "expect"; // You can use any testing library

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe("loadKeyspaceActionCreator", () => {
  afterEach(() => {
    fetchMock.restore();
  });

  it("creates UPDATE_KEYSPACE when fetching keyspace has been done", () => {
    fetchMock.getOnce("/api/v2/keyspaces", {
      headers: { "content-type": "application/json" },
    });

    const expectedActions = [
      {
        type: actions.LOAD_KEYSPACE,
        payload: {
          keyspace: [{ key: "abigail", value: "yes", type: "string" }],
        },
      },
    ];
    const store = mockStore({ keyspace: [[]] });

    return (
      store
        // .dispatch(connections.keyspaceUpdateActionCreator())
        .dispatch(loadKeyspaceActionCreator())
        .then(() => {
          // return of async actions
          expect(store.getActions()).toEqual(expectedActions);
        })
    );
  });
});

describe("refreshKeyspaceActionCreator", () => {
  afterEach(() => {
    fetchMock.restore();
  });

  it("creates REFRESH_KEYSPACE when fetching keyspace has been done", () => {
    const instanceId = 1;
    const dbIndex = 2;
    const pageNum = 50;
    const pageSize = 10;
    const refreshScan = 1;
    fetchMock.getOnce(
      `/api/v2/keyspaces/${instanceId}/${dbIndex}/?pageSize=${pageSize}&pageNum=${pageNum}&refreshScan=${refreshScan}`
    );

    const expectedActions = [
      {
        type: actions.REFRESH_KEYSPACE,
        payload: {
          keyspace: [{ key: "abigail", value: "yes", type: "string" }],
          currInstance: 2,
          currDatabase: 1,
        },
      },
    ];
    const store = mockStore({ keyspace: [[]] });

    return (
      store
        // .dispatch(connections.keyspaceUpdateActionCreator())
        .dispatch(refreshKeyspaceActionCreator(0, 1, 50, 10, 1))
        .then(() => {
          // return of async actions
          expect(store.getActions()).toEqual(expectedActions);
        })
    );
  });
});

describe("changeKeyspacePageActionCreator", () => {
  afterEach(() => {
    fetchMock.restore();
  });

  it("creates CHANGE_KEYSPACE_PAGE when fetching keyspace has been done", () => {
    const instanceId = 1;
    const dbIndex = 2;
    fetchMock.getOnce(`/api/v2/keyspaces/${instanceId}/${dbIndex}?`);

    const expectedActions = [
      {
        type: actions.CHANGE_KEYSPACE_PAGE,
        payload: {
          keyspace: [{ key: "abigail", value: "yes", type: "string" }],
          currInstance: 1,
          currDatabase: 2,
        },
      },
    ];
    const store = mockStore({ keyspace: [[]] });

    return (
      store
        // .dispatch(connections.keyspaceUpdateActionCreator())
        .dispatch(changeKeyspacePageActionCreator(1, 2))
        .then(() => {
          // return of async actions
          expect(store.getActions()).toEqual(expectedActions);
        })
    );
  });
  // NEED TO ADD FILTER TESTS
});

describe("updateEventActionCreator", () => {
  afterEach(() => {
    fetchMock.restore();
  });

  it("creates UPDATE_EVENTS when fetching is done", () => {
    fetchMock.getOnce("/api/events/0/1", {
      headers: { "content-type": "application/json" },
    });

    const expectedActions = [{ type: types.UPDATE_EVENTS }];
    const store = mockStore({ events: [] });

    return store.dispatch(connections.updateEventsActionCreator()).then(() => {
      // return of async actions
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});

//NEEDS TO TRANSITION TO KEYGRAPHACTIONCREATOR - ONCE WE GET THE LOOK AT DATA
describe("updateEventGraphActionCreator", () => {
  afterEach(() => {
    fetchMock.restore();
  });

  it("creates UPDATE_KEYGRAPH when fetching is done", () => {
    fetchMock.getOnce("/api/graphs/0/1/events", {
      headers: { "content-type": "application/json" },
    });

    const expectedActions = [{ type: types.UPDATE_KEYGRAPH }];
    const store = mockStore({ events: [] });

    return store.dispatch(connections.updateEventsActionCreator()).then(() => {
      // return of async actions
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});

describe("updateDBInfoActionCreator", () => {
  afterEach(() => {
    fetchMock.restore();
  });

  it("dispatches an event to update the current DB", () => {
    fetchMock.getOnce("/api/connections");

    const expectedActions = [{ type: types.UPDATE_DBINFO }];
    const store = mockStore({
      databaseInfo: {
        host: "",
        port: 0,
        numberOfDBs: 0,
      },
    });

    return store.dispatch(connections.updateDBInfoActionCreator).then(() => {
      // return of async actions
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});

//SWITCH DATABASE

describe("switchDatabaseActionCreator", () => {
  afterEach(() => {
    fetchMock.restore();
  });

  it("creates SWITCH_DATABASE when fetching is done", () => {
    const expectedActions = [{ type: types.UPDATE_DATABASE }];
    const store = mockStore({ currDatabase: 0 });
    expect(store.getActions().toEqual(expectedActions));
  });
});

describe("updatePageActionCreator", () => {
  afterEach(() => {
    fetchMock.restore();
  });

  it("updates the current page", () => {
    const expectedActions = [{ type: types.UPDATE_PAGE }];
    const store = mockStore({ newPage: "" });
    expect(store.getActions().toEqual(expectedActions));
  });
});

describe("updateCurrDisplayActionCreator", () => {
  afterEach(() => {
    fetchMock.restore();
  });

  it("updates the current display", () => {
    const expectedActions = [{ type: types.UPDATE_CURRDISPLAY }];
    const store = mockStore({ filter: "", category: "" });
    expect(store.getActions().toEqual(expectedActions));
  });
});

//SWITCH INSTANCE

describe("switchInstanceActionCreator", () => {
  afterEach(() => {
    fetchMock.restore();
  });

  it("creates SWITCH_INSTANCE when fetching is done", () => {
    const expectedActions = [{ type: types.SWITCH_INSTANCE }];
    const store = mockStore({ currInstance: 1 });
    expect(store.getActions().toEqual(expectedActions));
  });
});
