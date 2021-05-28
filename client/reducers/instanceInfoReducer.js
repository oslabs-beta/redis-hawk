//leave these separate for future developers in case they want to add functionality
import * as types from '../actions/actionTypes.js';

const initialState = {
  instanceInfo: []
};

const instanceInfo = (state = initialState, action) => {
  switch (action.type) {
    case types.UPDATE_INSTANCEINFO: {
      const instances = action.payload;
      return {
        ...state,
        instanceInfo: instances,
      };
    }

    default: {
      return state;
    }
  }
};

export default instanceInfo;

// instanceId: 1,
//     host: '',
//     port: 0,
//     numberOfDBs: 0,