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

refreshKeyspaceActionCreator = () => (dispatch) => {};

changeKeyspacePageActionCreator = () => (dispatch) => {};
