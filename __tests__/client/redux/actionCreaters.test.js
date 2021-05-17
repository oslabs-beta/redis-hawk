import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as actions from '../../actions/TodoActions'
import * as types from '../../constants/ActionTypes'
import fetchMock from 'fetch-mock'
import expect from 'expect' // You can use any testing library

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('async actions', () => {
  afterEach(() => {
    fetchMock.restore()
  })

  it('creates FETCH_TODOS_SUCCESS when fetching todos has been done', () => {
    fetchMock.getOnce('/todos', {
      body: { todos: ['do something'] },
      headers: { 'content-type': 'application/json' }
    })

    const expectedActions = [
      { type: types.FETCH_TODOS_REQUEST },
      { type: types.FETCH_TODOS_SUCCESS, body: { todos: ['do something'] } }
    ]
    const store = mockStore({ todos: [] })

    return store.dispatch(actions.fetchTodos()).then(() => {
      // return of async actions
      expect(store.getActions()).toEqual(expectedActions)
    })
  })
})



// const { updateKeyspace, updateKeyGraph, switchDatabase, updateTotalKeys, updateEvents } = require('../../../client/action-creators/connections.js');

// describe('UPDATE_KEYSPACE', () => {
//     beforeEach(() => {
//         action = {
//             type: '',
//             payload: [],
//         }
//     })
//     it('should send an object with type and payload fields updated to the corresponding reducer', () => {
//         const testAction = {
//             type: 'UPDATE_KEYSPACE',
//             payload: [{message: 'hello friend'}],
//         }
//         expect(testAction.type).toEqual('UPDATE_KEYSPACE');
//         expect(testAction.payload[0]).toEqual({message: 'hello friend'})
//     })
// })



// describe('update keygraph actionCreator', () => {
//   beforeEach(() => {
//     action = {
//       type: '',
//       payload: ''
//     }
//   });
//   it('should send an object with type and payload fields updated to the corresponding reducer', () => {
//     const action = {
//       type: 'UPDATE_KEYGRAPH',
//       payload: {
//         name: 'keynamne',
//         time: '8:30',
//         memory: '1kb'
//       }
//     }
//   })
// })