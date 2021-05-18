import * as types from '../actions/actionTypes.js';

const initialState = {
  currDatabase: 0,
  keyGraph: [],
};

const keygraphReducer = (state = initialState, action) => {
  let keyGraph;
  switch (action.type) {
    case types.UPDATE_KEYGRAPH: {
      const dbIndex = state.currDatabase;

      const newKeyGraph = action.payload;

      keyGraph = state.keyGraph.slice();
      keyGraph[dbIndex].push(newKeyGraph);

      return {
        ...state,
        keyGraph,
      };
    }

    default: {
      return state;
    }
  }
};

// module.exports = keygraphReducer;

export default keygraphReducer;
