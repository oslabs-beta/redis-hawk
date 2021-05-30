import * as types from '../actions/actionTypes';

//called on initial load of app in App.jsx
// no requirements in for the deployment of this action creator
//response :
// {
//   data: [
//     {
//       instanceId: 1,
//       keyspaces: [
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
loadKeyspaceActionCreator = () => (dispatch) => {
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
refreshKeyspaceActionCreator =
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
          },
        });
      });
  };

changeKeyspacePageActionCreator = () => (dispatch) => {};
