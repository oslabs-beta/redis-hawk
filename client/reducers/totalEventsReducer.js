import * as types from "../actions/actionTypes.js";

const initialState = {
  currInstance: 1,
  currDatabase: 0,
  // totalEvents: {
  //   eventTally: 0,
  //   eventTotals: [],
  // },
  data: {
    labels: [],
    datasets: [
      {
        label: "Number of Events",
        data: [],
        backgroundColor: ["red"],
        borderColor: "white",
        borderWidth: "2",
        pointBorderColor: "red",
        pointHoverBackgroundColor: "#55bae7",
      },
    ],
  },
};
const totalEventsReducer = (state = initialState, action) => {
  let totalEvents;
  switch (action.type) {
    case types.GET_EVENT_TOTALS: {
      const datasets = action.payload.datasets;
      const labels = action.payload.labels;
      console.log('action payload in tEReducer', action.payload)
      return {
        ...state,
        data: {
          totalEvents: action.payload.totalEvents,
          labels: labels,
          datasets: [
            {
              label: "Number of Events",
              data: datasets,
              backgroundColor: ["red"],
              borderColor: "white",
              borderWidth: "2",
              pointBorderColor: "red",
              pointHoverBackgroundColor: "#55bae7",
            },
          ],
        },
      };
    }
    default: {
      return state;
    }
  }
};
export default totalEventsReducer;
