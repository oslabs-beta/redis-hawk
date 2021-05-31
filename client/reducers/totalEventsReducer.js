import * as types from "../actions/actionTypes.js";

const initialState = {
  currInstance: 1,
  currDatabase: 0,
  totalEvents: {
    eventTally: 0,
    eventTotals: [],
  },
};
const totalEventsReducer = (state = initialState, action) => {
  let totalEvents;
  switch (action.type) {
    case types.GET_EVENT_TOTALS: {
      const events = action.payload.totalEvents;
      totalEvents = state.totalEvents.slice();
      totalEvents.eventTotals.push(...events.eventTotals);
      totalEvents.eventTally = events.evenTotal;
      console.log('event tally in Events Reducer', totalEvents.eventTally)
      console.log('totalEvents.eventTotals in EventReducer', totalEvents.eventTotal)
      return {
        ...state,
        totalEvents,
      };
    }
    default: {
      return state;
    }
  }
};
export default totalEventsReducer;
