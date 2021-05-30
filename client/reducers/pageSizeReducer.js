//leave these separate for future developers in case they want to add functionality
import * as types from '../actions/actionTypes.js';

const initialState = {
  pageSize: 50,
};

const pageSizeReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.UPDATE_PAGESIZE: {
      const pageSize = action.payload;
      console.log('payload in update page size reducer', pageSize);
      return {
        ...state,
        pageSize: pageSize,
      };
    }
    default: {
      return state;
    }
  }
};

export default pageSizeReducer;
