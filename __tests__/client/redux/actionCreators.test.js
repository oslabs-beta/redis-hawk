import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import updateKeyspaceActionCreator from '../../../client/action-creators/connections';
import * as actions from '../../../client/actions/actionTypes';
import fetchMock from 'fetch-mock';
import expect from 'expect'; // You can use any testing library

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('updateKeyspaceActionCreator', () => {
  afterEach(() => {
    fetchMock.restore();
  });

  it('creates UPDATE_KEYSPACE when fetching keyspace has been done', () => {
    fetchMock.getOnce('/api/keyspaces/0/1', {
      headers: { 'content-type': 'application/json' },
    });

    const expectedActions = [
      {
        type: actions.UPDATE_KEYSPACE,
        payload: {
          keyspace: [{ key: 'abigail', value: 'yes', type: 'string' }],
          dbIndex: 0,
        },
      },
    ];
    const store = mockStore({ keyspace: [[]] });

    return (
      store
        // .dispatch(connections.keyspaceUpdateActionCreator())
        .dispatch(updateKeyspaceActionCreator(0, 1))
        .then(() => {
          // return of async actions
          expect(store.getActions()).toEqual(expectedActions);
        })
    );
  });
});

describe('updateEventActionCreator', () => {
  afterEach(() => {
    fetchMock.restore();
  });

  it('creates UPDATE_EVENTS when fetching is done', () => {
    fetchMock.getOnce('/api/events/0/1', {
      headers: { 'content-type': 'application/json' },
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
describe('updateEventGraphActionCreator', () => {
  afterEach(() => {
    fetchMock.restore();
  });

  it('creates UPDATE_KEYGRAPH when fetching is done', () => {
    fetchMock.getOnce('/api/graphs/0/1/events', {
      headers: { 'content-type': 'application/json' },
    });

    const expectedActions = [{ type: types.UPDATE_KEYGRAPH }];
    const store = mockStore({ events: [] });

    return store.dispatch(connections.updateEventsActionCreator()).then(() => {
      // return of async actions
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});

describe('updateDBInfoActionCreator', () => {
  afterEach(() => {
    fetchMock.restore();
  });

  it('dispatches an event to update the current DB', () => {
    fetchMock.getOnce('/api/connections');

    const expectedActions = [{ type: types.UPDATE_DBINFO }];
    const store = mockStore({
      databaseInfo: {
        host: '',
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

describe('switchDatabaseActionCreator', () => {
  afterEach(() => {
    fetchMock.restore();
  });

  it('creates SWITCH_DATABASE when fetching is done', () => {
    const expectedActions = [{ type: types.UPDATE_DATABASE }];
    const store = mockStore({ currDatabase: 0 });
    expect(store.getActions().toEqual(expectedActions));
  });
});

describe('updatePageActionCreator', () => {
  afterEach(() => {
    fetchMock.restore();
  });

  it('updates the current page', () => {
    const expectedActions = [{ type: types.UPDATE_PAGE }];
    const store = mockStore({ newPage: '' });
    expect(store.getActions().toEqual(expectedActions));
  });
});

describe('updateCurrDisplayActionCreator', () => {
  afterEach(() => {
    fetchMock.restore();
  });

  it('updates the current display', () => {
    const expectedActions = [{ type: types.UPDATE_CURRDISPLAY }];
    const store = mockStore({ filter: '', category: '' });
    expect(store.getActions().toEqual(expectedActions));
  });
});
