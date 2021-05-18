import * as types from "../actions/actionTypes";

export const updateKeyspaceActionCreator = (instanceId, dbIndex) =>  (dispatch) => {  
  
  fetch(`http://localhost:3000/api/keyspace/${instanceId}/${dbIndex}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
  .then((res) => res.json())
  .then((data) => {
    //the response be the deleted object, and we will grab the id off of that and we then go and fileter that out of state.

    console.log("keyspace", data.keyspaces);
    const keyspace = data.keyspaces;
    dispatch({
      type: actions.UPDATE_KEYSPACE,
      //is this the proper syntax to grab dbIndex too????
      payload: [keyspace, dbIndex]
    }).catch((err) => {
      console.log(
        "error deleting user from the DB in keyspaceUpdateActionCreator: ",
        err
      );
    });
  });
};

export const updateEventsActionCreator =
  (instanceId, dbIndex) => (dispatch) => {
    
    fetch(`http://localhost:3000/api/events/${instanceId}/${dbIndex}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((res) => res.json())
    .then((data) => {
      //the response be the deleted object, and we will grab the id off of that and we then go and fileter that out of state.

      console.log("events", data.events);
      const events = data.events;
      dispatch({
        type: actions.UPDATE_EVENTS,
        //is this the proper syntax to add dbIndex???
        payload: [events, dbIndex]
      }).catch((err) => {
        console.log(
          "error deleting user from the DB in keyspaceUpdateActionCreator: ",
          err
        );
      });
    });
  };

  //NEEDS COMPLETION ONCE WE GET WHAT THE DATA WILL LOOK LIKE FROM BACKEND
  export const updateKeyGraphActionCreator =
    (instanceId, dbIndex) => (dispatch) => {
      fetch(`http://localhost:3000/api/keyspaceHistory/${instanceId}/${dbIndex}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          //the response be the deleted object, and we will grab the id off of that and we then go and fileter that out of state.

          console.log("events", data.keyspaceHistory);
          const eventsHistory = data.keyspaceHistory;
          dispatch({
            type: actions.UPDATE_KEYGRAPH,
            payload: events,
          }).catch((err) => {
            console.log(
              "error deleting user from the DB in keyspaceUpdateActionCreator: ",
              err
            );
          });
        });
    };

    //SWITCH DATABASE
    export const switchDatabaseActionCreator = (dbIndex) => ({
      type: types.UPDATE_DATABASE,
      payload: dbIndex
    })