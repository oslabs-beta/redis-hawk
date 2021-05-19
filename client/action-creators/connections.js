import ReduxThunk from "redux-thunk";

import * as types from "../actions/actionTypes";

export const updateKeyspaceActionCreator =
  (instanceId, dbIndex) => (dispatch) => {
    //dont need the options object on GET requests for fetch - GET is assumed;
    //content-type headers is not needed bc you send no body
    fetch(`/api/keyspaces/${instanceId}/${dbIndex}`)
      .then((res) => res.json())
      .then((data) => {
        //the response be the deleted object, and we will grab the id off of that and we then go and fileter that out of state.

        //data[0].keyspaces[0] to get the specific keyspace for the individual
        console.log("keyspace", data[0].keyspaces[0]);
        const keyspace = data[0].keyspaces[0];
        dispatch({
          type: types.UPDATE_KEYSPACE,
          //is this the proper syntax to grab dbIndex too????
          payload: [keyspaces, dbIndex],
        });
      })
      .catch((err) => {
        console.log("error in keyspaceUpdateActionCreator: ", err);
      });
  };

export const updateEventsActionCreator =
  (instanceId, dbIndex) => (dispatch) => {
    fetch(`/api/events/${instanceId}/${dbIndex}`)
      .then((res) => res.json())
      .then((data) => {
        //the response be the deleted object, and we will grab the id off of that and we then go and fileter that out of state.

        //data[0].events[0] to get the events for a single dbindex
        console.log("events", data[0].events[0]);
        const events = data[0].events[0];
        dispatch({
          type: types.UPDATE_EVENTS,
          //is this the proper syntax to add dbIndex???
          payload: [events, dbIndex],
        });
      })
      .catch((err) => {
        console.log("error in keyspaceUpdateActionCreator: ", err);
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
        const eventsHistory = data.keyspaceHistory;
        dispatch({
          type: types.UPDATE_KEYGRAPH,
          payload: events,
        });
      })
      .catch((err) => {
        console.log("error in keyspaceUpdateActionCreator: ", err);
      });
  };

//SWITCH DATABASE
export const switchDatabaseActionCreator = (dbIndex) => ({
  type: types.SWITCH_DATABASE,
  payload: dbIndex,
});

export const updateDBInfoActionCreator = () => (dispatch) => {
  fetch("/api/connections")
    .then((res) => res.json())
    .then((data) => {
      //for stretch features, there may be multiple instances here
      console.log("first db data returned", data.instances[0]);
      const dbInfo = data;
      console.log("dbInfo", dbInfo);
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
