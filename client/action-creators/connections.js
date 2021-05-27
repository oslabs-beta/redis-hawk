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
        // console.log('full keyspace data', response.data[0]);
        let keyspace;
        if (!dbIndex) {
          //this will grab all of our databases on the initial
          keyspace = response.data[0].keyspaces;
          // } else {
        }
        //this we want if our url specifies a specific database
        else {
          keyspace = response.data[0].keyspaces[0];
        }

        if (keyspace) {
          dispatch({
            type: types.UPDATE_KEYSPACE,
            //is this the proper syntax to add dbIndex??
            payload: { keyspace: keyspace, dbIndex: dbIndex },
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
    console.log('url',url)
    fetch(url)
      .then((res) => res.json())
      .then((res) => {
        let events;
        console.log("res", res);
        console.log('dbIndex', dbIndex)
        if (!dbIndex){
          events = res.data[0].keyspaces;
        }else {
          events = res.data[0].keyspaces[0];
        }
        console.log("events in updateEventsActionCreator", events);
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

//SWITCH INSTANCE action creator

//payload:
// databases: 16
// host: "127.0.0.1"
// instanceId: 1
// port: 6379

export const updateDBInfoActionCreator = () => (dispatch) => {
  fetch("/api/connections")
    .then((res) => res.json())
    .then((data) => {
      //for stretch features, there may be multiple instances here
      console.log("dbinfo action creator data", data);
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
