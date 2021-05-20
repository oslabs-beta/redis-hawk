import ReduxThunk from "redux-thunk";

import * as types from "../actions/actionTypes";

export const updateKeyspaceActionCreator =
  (instanceId, dbIndex) => (dispatch) => {
    let url;
    //if parameters, url is
    if (instanceId && dbIndex) {
      url = `/api/keyspaces/${instanceId}/${dbIndex}`;
    } else {
      url = "/api/keyspaces";
    }
    //dont need the options object on GET requests for fetch - GET is assumed;
    //content-type headers is not needed bc you send no body
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        //the response be the deleted object, and we will grab the id off of that and we then go and fileter that out of state.

        // //data[0].keyspaces[0] to get the specific keyspace for the individual
        const keyspaces = data[0].keyspaces[0];
        if (keyspaces) {
          dispatch({
            type: types.UPDATE_KEYSPACE,
            //is this the proper syntax to grab dbIndex too????
            payload: [keyspaces, dbIndex],
          });
        }
      })
      .catch((err) => {
        console.log("error in updateKeyspaceActionCreator: ", err);
      });
  };

export const updateEventsActionCreator =
  (instanceId, dbIndex, currIndex) => (dispatch) => {
    console.log('currIndex',currIndex)
    let url;
    if (instanceId || dbIndex || currIndex) {
      url = `/api/events/${instanceId}/${dbIndex}?eventTotal=${currIndex}`;
    } else {
      url = "/api/events";
    }
    fetch(url)
      .then((res) => res.json())
      .then((res) => {
        //the response be the deleted object, and we will grab the id off of that and we then go and fileter that out of state.

        //data[0].events[0] to get the events for a single dbindex
        console.log("response", res);
        console.log("full events", res.data);
        console.log("events", res.data[0].keyspaces[0]);
        const events = res.data[0].keyspaces[0];
        console.log("events in reducer", events);
        // if (events) {
        dispatch({
          type: types.UPDATE_EVENTS,
          //is this the proper syntax to add dbIndex???
          payload: { events: events, currDatabase: dbIndex },
        });
        // }
      })
      .catch((err) => {
        console.log("error in updateEventsActionCreator: ", err);
      });
  };

//NEEDS COMPLETION ONCE WE GET WHAT THE DATA WILL LOOK LIKE FROM BACKEND
export const updateKeyGraphActionCreator =
  (instanceId, dbIndex) => (dispatch) => {
    fetch(`/api/keyspaceHistory/${instanceId}/${dbIndex}`)
      .then((res) => res.json())
      .then((data) => {
        //the response be the deleted object, and we will grab the id off of that and we then go and fileter that out of state.

        console.log("events", data.keyspaceHistory);
        const keyspaceHistory = data.keyspaceHistory;
        dispatch({
          type: types.UPDATE_KEYGRAPH,
          payload: keyspaceHistory,
        });
      })
      .catch((err) => {
        console.log("error in keyspaceUpdateActionCreator: ", err);
      });
  };

//SWITCH DATABASE
export const switchDatabaseActionCreator = (dbIndex) => (
  console.log("switched to database", dbIndex),
  {
    type: types.SWITCH_DATABASE,
    payload: dbIndex,
  }
);

export const updateDBInfoActionCreator = () => (dispatch) => {
  fetch("/api/connections")
    .then((res) => res.json())
    .then((data) => {
      //for stretch features, there may be multiple instances here
      const dbInfo = data;
      dispatch({
        type: types.UPDATE_DBINFO,
        payload: data.instances[0],
      });
    })
    .catch((err) => {
      console.log(
        "error fetching databaseInfo in updateDBInfoActionCreator:",
        err
      );
    });
};

export const updatePageActionCreator = (newPage) => ({
  type: types.UPDATE_PAGE,
  payload: newPage,
});

export const updateCurrDisplayActionCreator = (filter, category) => ({
  type: types.UPDATE_CURRDISPLAY,
  payload: { filter: filter, category: category },
});
