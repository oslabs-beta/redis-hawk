//leave these separate for future developers in case they want to add functionality
import * as types from '../actions/actionTypes.js';

const initialState = {
  databaseInfo: {
    host: 'localhost',
    port: 3000,
    dataNum: 16,
  },
};

const dbInfoReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.UPDATE_DBINFO: {
      const newDatabase = action.payload;

      return {
        ...state,
        databaseInfo: newDatabase,
      };
    }

    default: {
      return state;
    }
  }
};

export default dbInfoReducer;
