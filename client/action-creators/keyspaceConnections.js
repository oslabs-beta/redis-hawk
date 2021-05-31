import * as types from '../actions/actionTypes';

//called on initial load of app in App.jsx
// no requirements in for the deployment of this action creator
//response :
// {
//   data: [ (array of instances)
//     {
//       instanceId: 1,
//       keyspaces: [ (array of databases)
//         {
//           keyTotal: 6347,
//           pageSize: 50,
//           pageNum: 4,
//           data: [
//             {
//               key: '',
//               value: any,
//               type: any,
//             },
//           ],
//         },
//       ],
//     },
//   ];
// }
export const loadKeyspaceActionCreator = () => (dispatch) => {
  fetch('/api/v2/keyspaces')
    .then((res) => res.json())
    .then((response) => {
      console.log('response in loadKeyspaceActionCreator', response);
      let fullKeyspace = response.data;
      dispatch({
        type: types.LOAD_KEYSPACE,
        payload: {
          keyspace: fullKeyspace,
        },
      });
    });
};

//for refreshing the keyspace of a certain database at a certain instance - need to know if there are filters or not for dispatch
// arguments: database, instance, page size, page num = 1, refreshScan = 1,
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
export const refreshKeyspaceActionCreator =
  (instanceId, dbIndex, pageSize, pageNum, refreshScan) => (dispatch) => {
    fetch(
      `api/v2/keyspaces/${instanceId}/${dbIndex}/?pageSize=${pageSize}&pageNum=${pageNum}&refreshScan=${refreshScan}`
    )
      .then((res) => res.json())
      .then((response) => {
        console.log('response in refreshKeyspaceActionCreator', response);
        let refreshKeyspace = response;
        dispatch({
          type: types.REFRESH_KEYSPACE,
          payload: {
            keyspace: refreshKeyspace,
            currInstance: instanceId,
            currDatabase: dbIndex,
          },
        });
      });
  };
//change the page and handle the filters for keyspace
//requirements: instanceId, dbIndex, page Size, page num, keyname filter, keytype filter, refreshScan = 0 - need to know whether there is a
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
export const changeKeyspacePageActionCreator =
  (instanceId, dbIndex, queryOptions) => (dispatch) => {
    let URI = `api/v2/keyspaces/${instanceId}/${dbIndex}/?`;
    //this may have an issue in here - be aware of queryOptions
    if (queryOptions.pageSize) URI += `pageSize=${queryOptions.pageSize}`;
    if (queryOptions.pageNum) URI += `&pageNum=${queryOptions.pageNum}`;
    if (queryOptions.keyNameFilter)
      URI += `&keyNameFilter=${queryOptions.keyNameFilter}`;
    if (queryOptions.keyTypeFilter)
      URI += `&keyTypeFilter=${queryOptions.keyTypeFilter}`;
    if (queryOptions.refreshScan)
      URI += `&refreshScan=${queryOptions.refreshScan}`;

    fetch(URI)
      .then((res) => res.json)
      .then((response) => {
        console.log('response in changeKeyspaceActionCreator', response);
        let nextPageKeyspace = response;
        dispatch({
          type: types.CHANGE_KEYSPACE_PAGE,
          payload: {
            keyspace: nextPageKeyspace,
            currInstance: instanceId,
            currDatabase: dbIndex,
          },
        });
      });
  };
