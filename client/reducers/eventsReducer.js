//leave these separate for future developers in case they want to add functionality
import * as types from '../actions/actionTypes.js';

const initialState = {
  currDatabase: 0,
  events: [
    [
      {
        name: 'Arthur',
        event: 'SET',
        time: 'Sat May 15 2021 15:18:35 GMT-0400 (Eastern Daylight Time)',
      },
    ],
  ],
};

const eventsReducer = (state = initialState, action) => {
  let events;

  switch (action.type) {
    case types.UPDATE_EVENTS: {
      const dbIndex = state.currDatabase;

      const newEvents = action.payload;

      events = state.event.slice();

      //the events come in from new to old
      for (let i = newEvents.length - 1; i >= 0; i -= 1) {
        events[dbIndex].push(newEvents[i]);
      }

      return {
        ...state,
        events,
      };
    }

    default: {
      return state;
    }
  }
};

// module.exports = eventsReducer;
export default eventsReducer;
