import * as types from "../actions/actionTypes";

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
  fetch("/api/v2/keyspaces/?pageSize=25&refreshScan=0")
    .then((res) => res.json())
    .then((response) => {
      // console.log('response in loadKeyspaceActionCreator', response);
      let fullKeyspace = response.data;
      dispatch({
        type: types.LOAD_KEYSPACE,
        payload: {
          keyspace: fullKeyspace,
        },
      });
    })
    .catch((err) => {
      console.log("error in loadKeyspaceActionCreator: ", err);
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
        console.log("response in refreshKeyspaceActionCreator", response);
        let refreshKeyspace = response;
        dispatch({
          type: types.REFRESH_KEYSPACE,
          payload: {
            keyspace: refreshKeyspace,
            currInstance: instanceId,
            currDatabase: dbIndex,
          },
        });
      })
      .catch((err) => {
        console.log("error in refreshKeyspaceActionCreator: ", err);
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
    let URI = `api/v2/keyspaces/${instanceId}/${dbIndex}/?pageSize=${queryOptions.pageSize}&pageNum=${queryOptions.pageNum}`;
    //this may have an issue in here - be aware of queryOptions
    // if (queryOptions.pageSize) URI += `pageSize=${queryOptions.pageSize}`;
    // if (queryOptions.pageNum) URI += `&pageNum=${queryOptions.pageNum}`;
    if (queryOptions.keyNameFilter.length !== 0 || queryOptions.keyNameFilter)
      URI += `&keynameFilter=${queryOptions.keyNameFilter}`;
    if (queryOptions.keyTypeFilter.length !== 0 || queryOptions.keyTypeFilter)
      URI += `&keytypeFilter=${queryOptions.keyTypeFilter}`;
    if (queryOptions.refreshScan !== undefined)
      URI += `&refreshScan=${queryOptions.refreshScan}`;

    console.log("MY CHANGE KEYSPACE PAGE URI", URI);

    fetch(URI)
      .then((res) => res.json())
      .then((response) => {
        console.log("response in changeKeyspaceActionCreator", response);
        let nextPageKeyspace = response;
        dispatch({
          type: types.CHANGE_KEYSPACE_PAGE,
          payload: {
            keyspace: nextPageKeyspace,
            currInstance: instanceId,
            currDatabase: dbIndex,
          },
        });
      })
      .catch((err) => {
        console.log("error in changeKeyspacePageActionCreator: ", err);
      });
  };
