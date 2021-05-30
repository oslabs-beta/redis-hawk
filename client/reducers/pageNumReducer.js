//leave these separate for future developers in case they want to add functionality
import * as types from '../actions/actionTypes.js';

const initialState = {
  pageNum: 1,
};

const pageNumReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.UPDATE_PAGENUM: {
      const pageNum = action.payload;
      console.log('payload in update page num reducer', pageNum);
      return {
        ...state,
        pageNum: pageNum,
      };
    }
    default: {
      return state;
    }
  }
};

export default pageNumReducer;
