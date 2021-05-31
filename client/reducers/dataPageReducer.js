//leave these separate for future developers in case they want to add functionality
import * as types from '../actions/actionTypes.js';

const initialState = {
  pageSize: 5,
  pageNum: 1,
};

const dataPageReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.UPDATE_PAGESIZE: {
      const pageSize = action.payload;
      console.log('payload in update page size action', pageSize);
      return {
        ...state,
        pageSize: pageSize,
      };
    }
    case types.UPDATE_PAGENUM: {
      const pageNum = action.payload;
      console.log('payload in update page num action', pageNum);
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

export default dataPageReducer;
