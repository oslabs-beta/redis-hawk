import * as types from "../actions/actionTypes";

export const updateKeyspaceActionCreator =
  (instanceId, dbIndex) => (dispatch) => {
    let url;
    if (instanceId && dbIndex) {
      url = `/api/keyspaces/${instanceId}/${dbIndex}`;
    } else {
      url = "/api/keyspaces";
    }

    fetch(url)
      .then((res) => res.json())
      .then((response) => {
        const keyspaces = response.data[0].keyspaces[0];
        if (keyspaces) {
          dispatch({
            type: types.UPDATE_KEYSPACE,
            //is this the proper syntax to add dbIndex??
            payload: { keyspaces: keyspaces, dbIndex: dbIndex },
          });
        }
      })
      .catch((err) => {
        console.log("error in updateKeyspaceActionCreator: ", err);
      });
  };

export const updateEventsActionCreator =
  (instanceId, dbIndex, currIndex) => (dispatch) => {
    let url;
    if (instanceId || dbIndex || currIndex) {
      url = `/api/events/${instanceId}/${dbIndex}?eventTotal=${currIndex}`;
    } else {
      url = "/api/events";
    }
    fetch(url)
      .then((res) => res.json())
      .then((res) => {
        const events = res.data[0].keyspaces[0];
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
