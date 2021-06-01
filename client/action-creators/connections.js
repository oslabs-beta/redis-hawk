import * as types from '../actions/actionTypes';

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
        console.log('error in keyspaceUpdateActionCreator: ', err);
      });
  };

//SWITCH DATABASE
export const switchDatabaseActionCreator = (dbIndex) => (
  console.log('switched to database', dbIndex),
  {
    type: types.SWITCH_DATABASE,
    payload: dbIndex,
  }
);

//SWITCH INSTANCE action creator

export const switchInstanceActionCreator = (instanceId) => (
  console.log('switched to instance', instanceId),
  {
    type: types.SWITCH_INSTANCE,
    payload: instanceId,
  }
);

//payload:
// databases: 16
// host: "127.0.0.1"
// instanceId: 1
// port: 6379

export const updateInstanceInfoActionCreator = () => (dispatch) => {
  fetch('/api/connections')
    .then((res) => res.json())
    .then((data) => {
      //for stretch features, there may be multiple instances here
      dispatch({
        type: types.UPDATE_INSTANCEINFO,
        payload: data.instances,
      });
    })
    .catch((err) => {
      console.log(
        'error fetching instanceinfo in updateDBInfoActionCreator:',
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

export const updatePageNumActionCreator = (pageNum) => ({
  type: types.UPDATE_PAGENUM,
  payload: pageNum,
});

export const updatePageSizeActionCreator = (pageSize) => ({
  type: types.UPDATE_PAGESIZE,
  payload: pageSize,
});
