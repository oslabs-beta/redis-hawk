import * as types from '../actions/actionTypes.js';

const initialState = {
  currDisplay: {
    keyNameFilter: '',
    keyTypeFilter: '',
    keyEventFilter: '',
    //add any subsequent filters
  },
};

const currentDisplayReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.UPDATE_CURRDISPLAY: {
      console.log('action payload in update curr display', action);
      //copy the state
      let currDisplay = state.currDisplay;

      //if payload at filtertype is name
      if (action.payload.filterType === 'keyName')
        currDisplay.keyNameFilter = action.payload.filterValue;
      //if payload at filtertype is type
      if (action.payload.filterType === 'keyType')
        currDisplay.keyTypeFilter = action.payload.filterValue;

      //if payload at filtertype is event
      if (action.payload.filterType === 'keyEvent')
        currDisplay.keyEventFilter = action.payload.filterValue;

      return {
        ...state,
        currDisplay: currDisplay,
      };
    }
    default:
      {
        return state;
      }
      x;
  }
};

export default currentDisplayReducer;
