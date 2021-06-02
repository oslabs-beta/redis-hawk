import * as types from '../actions/actionTypes';

// sample response from get to '/'
//{
//  data: [ (array of Instances)
//   {
//    instanceId: number,
//    keyspaces: [ (array of Keyspaces)
//      {
//       eventTotal: 6347 (number),
//       pageSize: 50 (number),
//        pageNum: 4 (number),
//        data: [ (Array of Key Details)
//          {
//          key: string,
//          event: string,
//          timestamp: Date
//         }
//        ]
//       },
//      {eventTotal, pageSize, pageNum, data: [etc]}
//    ]
//   },
//   {
//     instanceId: number,
//     keyspaces: [..etc]
//    }
//  ]
// }

export const loadAllEventsActionCreator = () => (dispatch) => {
  fetch('api/v2/events/?pageSize=25')
    .then((res) => res.json())
    .then((response) => {
      console.log('response in loadAllEventsActionCreator', response);
      let allEvents = response.data;
      dispatch({
        type: types.LOAD_ALL_EVENTS,
        payload: {
          events: allEvents,
        },
      });
    });
};

// response for refresh: Object containing an event log subset, based on the page parameters and any filters. Event details are stored in the data property as an array of event objects, where each event object has the properties:

// * key: name of the key

// * event: type of the event

// * timestamp: time when the event occurred

export const refreshEventsActionCreator =
  (instanceId, dbIndex, pageSize, pageNum, refreshData) => (dispatch) => {
    fetch(
      `api/v2/events/${instanceId}/${dbIndex}/?pageSize=${pageSize}&pageNum=${pageNum}&refreshData=${refreshData}`
    )
      .then((res) => res.json())
      .then((response) => {
        // response should be
        console.log('response in refreshEventsActionCreator', response);
        if (response.data.length < 1) {
          console.log('no new events!');
          return;
        }
        let refreshEvents = response;

        dispatch({
          type: types.REFRESH_EVENTS,
          payload: {
            events: refreshEvents,
            currInstance: instanceId,
            currDatabase: dbIndex,
          },
        });
      });
  };
//change the page and handle the filters for EVENTS
//requirements: instanceId, dbIndex, page Size, page num, keyname filter, EVENTTYPE filter, refreshData = 0 - need to know whether there is a
//OPTIONS PARAMETER BEING USED HERE CALLED QUERYOPTIONS
//response:
// {
//     keyTotal: 6347,
//     pageSize: 50,
//     pageNum: 4,
//     data: [
//         {
//             key: '',
//             value: '',
//             type: any,
//         }
//     ]
// }

//FIX THIS!!
export const changeEventsPageActionCreator =
  (instanceId, dbIndex, queryParams) => (dispatch) => {
    let URI = `api/v2/events/${instanceId}/${dbIndex}/?`;
    console.log('queryParams', queryParams);
    //this may have an issue in here - be aware of queryParams
    if (queryParams.pageSize) URI += `pageSize=${queryParams.pageSize}`;
    if (queryParams.pageNum) URI += `&pageNum=${queryParams.pageNum}`;
    if (queryParams.keyNameFilter.length !== 0 || queryParams.keyNameFilter)
      URI += `&keynameFilter=${queryParams.keyNameFilter}`;
    if (queryParams.keyEventFilter.length !== 0 || queryParams.keyEventFilter)
      URI += `&eventTypeFilter=${queryParams.keyEventFilter}`;
    if (queryParams.refreshData !== undefined)
      URI += `&refreshData=${queryParams.refreshData}`;

    console.log('uri in change events page action creator', URI);

    fetch(URI)
      .then((res) => res.json())
      .then((response) => {
        console.log('response in changeEventsPageActionCreator', response);
        let nextPageEvents = response;
        dispatch({
          type: types.CHANGE_EVENTS_PAGE,
          payload: {
            events: nextPageEvents,
            currInstance: instanceId,
            currDatabase: dbIndex,
          },
        });
      });
  };

////////////////////////EVENT GRAPHS////////////////////////////////////

export const getTotalEventsActionCreator =
  (instanceId, dbIndex, queryParams) => (dispatch) => {
    let URI = `api/v2/events/totals/${instanceId}/${dbIndex}/`;
    if (queryParams) {
      console.log('queryParams', queryParams);
      // if (queryParams.eventTotal) {
      //   if (queryParams.eventTypes)
      //     URI += `?eventTotal=${queryParams.eventTotal}/&${queryParams.eventTypes}`;
      //   if (queryParams.keynameFilter)
      //     URI += `?eventTotal=${queryParams.eventTotal}/&keynameFilter=${queryParams.keynameFilter}`;
      //   else {
      //     URI += `?eventTotal=${queryParams.eventTotal}`;
      //   }
      // }
      if (queryParams.timeInterval) {
        if (queryParams.eventTypes)
          URI += `?timeInterval=${queryParams.timeInterval}/&${queryParams.eventTypes}`;
        if (queryParams.keynameFilter)
          URI += `?timeInterval=${queryParams.timeInterval}/&keynameFilter=${queryParams.keynameFilter}`;
        else {
          URI += `?timeInterval=${queryParams.timeInterval}`;
        }
      }
    }

    console.log('URI in eventTotalsActionCreator', URI);
    if (queryParams.timeInterval) {
      fetch(URI)
        .then((res) => res.json())
        .then((response) => {
          console.log('response in getTotalEventsActionCreator', response);
          const allEvents = response;
          const labels = [];
          const datasets = [];
          for (let i = response.eventTotals.length - 1; i >= 0; i--) {
            const time = new Date(response.eventTotals[i].end_time)
              .toString('MMddd')
              .slice(16, 24);
            labels.push(time);
            datasets.push(response.eventTotals[i].eventCount);
          }
          // console.log("labels", labels);
          // console.log("datasets", datasets);
          dispatch({
            type: types.GET_EVENT_TOTALS,
            payload: {
              labels: labels,
              datasets: datasets,
              totalEvents: allEvents,
              currInstance: instanceId,
              currDatabase: dbIndex,
            },
          });
        });
    }
    // else {
    //   fetch(URI)
    //     .then((res) => res.json())
    //     .then((response) => {
    //       console.log(
    //         "response in getTotalEventsActionCreator for eventTotalParameter",
    //         response
    //       );
    //       const allEvents = response;
    //       console.log("allEvents after fetch", allEvents);
    //       const labels = [];
    //       const datasets = [];
    //       const time = new Date(response.eventTotals[0].end_time);
    //       labels.push(time);
    //       datasets.push(response.eventTotals[0].eventCount);
    //       // for (let i = response.eventTotals.length - 1; i >= 0; i--) {
    //       //   // console.log(totalEvents[i]);
    //       //   const time = new Date(response.eventTotals[i].end_time)
    //       //     .toString("MMddd")
    //       //     .slice(16, 24);
    //       //   // console.log(time);
    //       //   labels.push(time);
    //       //   datasets.push(response.eventTotals[i].eventCount);
    //       // }
    //       console.log("labels", labels);
    //       console.log("datasets", datasets);
    //       dispatch({
    //         type: types.GET_EVENT_TOTALS,
    //         payload: {
    //           labels: labels,
    //           datasets: datasets,
    //           totalEvents: allEvents,
    //           currInstance: instanceId,
    //           currDatabase: dbIndex,
    //         },
    //       });
    //     });
    // }
  };

export const getNextEventsActionCreator =
  (instanceId, dbIndex, queryParams) => (dispatch) => {
    let URI = `api/v2/events/totals/${instanceId}/${dbIndex}/`;
    if (queryParams) {
      if (queryParams.eventTotal) {
        if (queryParams.eventTypes)
          URI += `?eventTotal=${queryParams.eventTotal}/&${queryParams.eventTypes}`;
        if (queryParams.keynameFilter)
          URI += `?eventTotal=${queryParams.eventTotal}/&keynameFilter=${queryParams.keynameFilter}`;
        else {
          URI += `?eventTotal=${queryParams.eventTotal}`;
        }
      }
    }
    console.log('URI in eventTotalsActionCreator', URI);
    fetch(URI)
      .then((res) => res.json())
      .then((response) => {
        console.log('response in getNextEventsActionCreators', response);
        const allEvents = response;
        console.log('allEvents after fetch', allEvents);
        const labels = [];
        const datasets = [];
        const time = new Date(response.eventTotals[0].end_time)
          .toString('MMddd')
          .slice(16, 24);
        labels.push(time);
        datasets.push(response.eventTotals[0].eventCount);

        console.log('labels', labels);
        console.log('datasets', datasets);
        dispatch({
          type: types.GET_NEXT_EVENTS,
          payload: {
            labels: labels,
            datasets: datasets,
            totalEvents: allEvents,
            currInstance: instanceId,
            currDatabase: dbIndex,
          },
        });
      });
  };
