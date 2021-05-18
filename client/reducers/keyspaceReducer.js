import * as types from '../actions/actionTypes.js';

const initialState = {
  currDatabase: 0,
  keyspace: [],
};

const keyspaceReducer = (state = initialState, action) => {
  let keyspace;

  switch (action.type) {
    case types.UPDATE_KEYSPACE:
      //we want to update the kesypace at index database
      const dbIndex = state.currDatabase;

      const newKeyspace = action.payload;

      keyspace = state.keyspace.slice();
      keyspace[dbIndex].push(...newKeyspace);
      return {
        ...state,
        keyspace,
      };
  }
};

module.exports = keyspaceReducer;

// export default keyspaceReducer;
