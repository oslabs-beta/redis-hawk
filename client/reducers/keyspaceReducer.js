//leave these separate for future developers in case they want to add functionality
import * as types from "../actions/actionTypes.js";

const initialState = {
  currDatabase: 0,
  keyspace: [[]],
};

const keyspaceReducer = (state = initialState, action) => {
  let keyspace;

  switch (action.type) {
    case types.UPDATE_KEYSPACE: {
      //we want to update the kesypace at index database
      const dbIndex = state.currDatabase;
      console.log("payload in Keyspacereducer", action.payload);
      const newKeyspace = action.payload.keyspaces;

      keyspace = state.keyspace.slice();
      console.log("keyspace before push", keyspace);
      keyspace[dbIndex].push(...newKeyspace);
      console.log("keyspace in reducer after push", keyspace);

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

// module.exports = keyspaceReducer;

export default keyspaceReducer;
