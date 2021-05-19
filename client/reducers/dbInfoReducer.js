//leave these separate for future developers in case they want to add functionality
import * as types from "../actions/actionTypes.js";

const initialState = {
  databaseInfo: {
    host: "",
    port: 0,
    dataNum: 0,
  },
};

const dbInfoReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.UPDATE_DBINFO: {
      const newDatabase = {};
      newDatabase.host = action.payload.host;
      newDatabase.port = action.payload.port;
      newDatabase.dataNum = action.payload.databases;
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
