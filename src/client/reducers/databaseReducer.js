//leave these separate for future developers in case they want to add functionality
import * as types from '../actions/actionTypes.js';

const initialState = {
  currDatabase: 0,
};

const databaseReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.SWITCH_DATABASE: {
      const dbIndex = action.payload;
      console.log('payload in Switch database reducer', dbIndex);
      let numberDB = Number(dbIndex);
      console.log('number database', numberDB);
      return {
        ...state,
        currDatabase: numberDB,
      };
    }
    default: {
      return state;
    }
  }
};

export default databaseReducer;
