//leave these separate for future developers in case they want to add functionality
import * as types from '../actions/actionTypes.js';

const initialState = {
  currDatabase: 0,
  keyspace: [
    [{ name: 'Abigail The Queen', value: 'know she is queen', type: 'hash' }],
  ],
};

const keyspaceReducer = (state = initialState, action) => {
  let keyspace;

  switch (action.type) {
    case types.UPDATE_KEYSPACE: {
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

    default: {
      return state;
    }
  }
};

// module.exports = keyspaceReducer;

export default keyspaceReducer;
