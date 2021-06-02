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
      console.log("action payload in tEReducer", action.payload);
      return {
        ...state,
        totalEvents: action.payload.totalEvents,
        data: {
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
    case types.GET_NEXT_EVENTS: {
      const datasets = action.payload.datasets;
      const currInstance = state.currInstance;
      const currDatabase = state.currDatabase;
      const labels = action.payload.labels;
      const dataCopy = Object.assign({}, state.data);
      console.log("dataCopy", dataCopy);
      // dataCopy.datasets[0].data.push(...datasets);
      // dataCopy.labels.push(...labels);
      datasets.forEach((events) => dataCopy.datasets[0].data.push(events));
      labels.forEach((time) => {
        dataCopy.labels.push(time);
      });
      console.log("data in getnextevents reducer", dataCopy);
      return {
        ...state,
        currInstance,
        currDatabase,
        totalEvents: action.payload.totalEvents,
        dataCopy,
        // data: {
        //   totalEvents: action.payload.totalEvents,
        //   labels: labels,
        //   datasets: [
        //     {
        //       label: "Number of Events",
        //       data: datasets,
        //       backgroundColor: ["red"],
        //       borderColor: "white",
        //       borderWidth: "2",
        //       pointBorderColor: "red",
        //       pointHoverBackgroundColor: "#55bae7",
        //     },
        //   ],
        // },
      };
    }
    default: {
      return state;
    }
  }
};
export default totalEventsReducer;
