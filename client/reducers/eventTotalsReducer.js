import * as types from "../actions/actionTypes.js";

const initialState = {
  currInstance: 1,
  currDatabase: 0,
  totalEvents: {
    eventTotal: 0,
    eventCount: 0,
    end_time: 0
}
};
const eventTotalsReducer = (state = initialState, action) => {
  let totalEvents;
  switch (action.type) {
    case types.GET_EVENT_TOTALS: {
      const allEvents = action.payload.totalEvents
      totalEvents = state.totalEvents.slice();
      totalEvents.push(...allEvents)

      return {
        ...state,
        totalEvents
      }
    }
  }
}
export default eventTotalsReducer;
