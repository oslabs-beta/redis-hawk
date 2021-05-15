// export const deleteMediaActionCreator = (mediaId, userId) =>  (dispatch) => {  
  
//   fetch(`http://localhost:3000/api/media/${userId}/${mediaId}`, {
//     method: 'DELETE',
//     headers: {
//       'Content-Type': 'application/json',
//     }})
//   .then(res => res.json())
//   .then(deletedDoc => { //the response be the deleted object, and we will grab the id off of that and we then go and fileter that out of state.
   
//     console.log('deletedDoc', deletedDoc);
//     const deleteId = deletedDoc._id
//     dispatch({
//       type: actions.DELETE_MEDIA,
//       payload: deleteId
//     })
//   .catch(err => {
//     console.log('error deleting user from the DB in delteMedieActionCreator: ', err)
//   })
// });


// export const addCardActionCreator = (marketId) => ({
//     type: types.ADD_CARD,
//     payload: marketId,
//   });
  
//   export const removeCardActionCreator = (marketId) => ({
//     type: types.DELETE_CARD,
//     payload: marketId,
//   });
  
//   export const addMarketActionCreator = () => ({
//     type: types.ADD_MARKET,
//   });
  
//   export const newLocationActionCreator = (location) => ({
//     type: types.SET_NEW_LOCATION,
//     payload: location,
//   });