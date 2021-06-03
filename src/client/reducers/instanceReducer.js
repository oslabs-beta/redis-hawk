import * as types from '../actions/actionTypes.js';

const initialState = {
  currInstance: 1,
};

const instanceReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.SWITCH_INSTANCE: {
      const instanceId = action.payload;
      console.log('payload in Switch instance reducer', instanceId);
      return {
        ...state,
        currInstance: instanceId,
      };
    }
    default: {
      return state;
    }
  }
};

export default instanceReducer;
