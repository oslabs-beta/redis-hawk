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
      console.log('state', state);
      console.log('action payload in update curr display', action);
      //copy the state
      let currState = { ...state };
      console.log('beginning curr state', currState);
      //if payload at filtertype is name
      if (action.payload.filterType === 'keyName')
        currState.currDisplay.keyNameFilter = action.payload.filterValue;
      //if payload at filtertype is type
      if (action.payload.filterType === 'keyType')
        currState.currDisplay.keyTypeFilter = action.payload.filterValue;

      //if payload at filtertype is event
      if (action.payload.filterType === 'keyEvent')
        currState.currDisplay.keyEventFilter = action.payload.filterValue;
      console.log('updated state in update curr display', currState);

      return {
        ...state,
        currDisplay: currState,
      };
    }
    default: {
      return state;
    }
  }
};

export default currentDisplayReducer;
