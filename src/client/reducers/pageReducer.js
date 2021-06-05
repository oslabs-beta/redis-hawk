//leave these separate for future developers in case they want to add functionality
import * as types from "../actions/actionTypes.js";

const initialState = {
  currPage: "keyspace",
};

const pageReducer = (state = initialState, action) => {
  let currPage;

  switch (action.type) {
    case types.UPDATE_PAGE: {
      const page = action.payload;

      return {
        ...state,
        currPage: page,
      };
    }

    default: {
      return state;
    }
  }
};

export default pageReducer;
