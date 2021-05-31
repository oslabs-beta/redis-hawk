//leave these separate for future developers in case they want to add functionality
import * as types from "../actions/actionTypes.js";

const initialState = {
  currInstance: 1,
  currDatabase: 0,
  keyspace: [
    {
      instanceId: 1,
      keyspaces: [
        [
          {
            key: "abigail",
            type: "set",
            value: "hello Arthur",
          },
        ],
      ],
    },
  ],
};

const keyspaceReducer = (state = initialState, action) => {
  let keyspace;

  switch (action.type) {
    case types.UPDATE_KEYSPACE: {
      //we want to update the kesypace at index database
      console.log("action payload in keyspace reducer", action.payload);
      if (!action.payload.dbIndex && !action.payload.instanceId) {
        const allKeyspaces = action.payload.keyspace;
        keyspace = state.keyspace.slice();
        keyspace = allKeyspaces;
      } else {
        const dbIndex = action.payload.dbIndex;
        const newKeyspace = action.payload.keyspace;
        console.log("action payload on refresh", action.payload.keyspace);
        const instanceId = action.payload.instanceId;
        keyspace = state.keyspace.slice();

        keyspace[instanceId - 1].keyspaces[dbIndex].push(...newKeyspace);
      }

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
