//leave these separate for future developers in case they want to add functionality
import * as types from '../actions/actionTypes.js';

const initialState = {
  currInstance: 1,
  currDatabase: 0,
  keyspace: [
    {
      instanceId: 1,
      keyspaces: [
        {
          keyTotal: 1,
          pageSize: 50,
          pageNum: 4,
          data: [
            {
              key: 'loading',
              type: 'loading',
              value: 'loading',
            },
          ],
        },
      ],
    },
  ],
};

const keyspaceReducer = (state = initialState, action) => {
  let keyspace;

  switch (action.type) {
    case types.LOAD_KEYSPACE: {
      console.log(
        'action payload in LOAD_KEYSPACE keyspace reducer',
        action.payload
      );

      const fullKeyspace = action.payload.keyspace;
      keyspace = state.keyspace.slice();
      keyspace = fullKeyspace;

      return {
        ...state,
        keyspace,
      };
    }
    case types.REFRESH_KEYSPACE: {
      //this is for a particular database in a particular instance
      console.log(
        'action payload in REFRESH_KEYSPACE keyspace reducer',
        action.payload
      );
      const specificKeyspace = action.payload.keyspace;
      const currInstance = action.payload.currInstance;
      const currDatabase = action.payload.currDatabase;

      keyspace = state.keyspace.slice();
      keyspace[currInstance - 1].keyspaces[currDatabase] = specificKeyspace;
      //do I need to update the database and isntance?
      return {
        ...state,
        keyspace,
      };
    }
    case types.CHANGE_KEYSPACE_PAGE: {
      console.log(
        'action payload in CHANGE_KEYSPACE_PAGE keyspace reducer',
        action.payload
      );

      const specificKeyspace = action.payload.keyspace;
      const currInstance = action.payload.currInstance;
      const currDatabase = action.payload.currDatabase;

      keyspace = state.keyspace.slice();
      keyspace[currInstance - 1].keyspaces[currDatabase] = specificKeyspace;
      //do I need to update the database and instance?
      return {
        ...state,
        keyspace,
      };
    }

    default: {
      return state;
    }
  }
};

export default keyspaceReducer;
