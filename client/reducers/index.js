// combine reducers
import { combineReducers } from 'redux';
import databaseReducer from './databaseReducer';
import eventsReducer from './eventsReducer';
import graphsReducer from './graphsReducer';
import keyspaceReducer from './keyspaceReducer';
import dbInfoReducer from './dbInfoReducer';

export default combineReducers({
  keyspaceStore: keyspaceReducer,
  eventsStore: eventsReducer,
  keyGraphStore: graphsReducer,
  currDatabaseStore: databaseReducer,
  databaseInfoStore: dbInfoReducer,
});
