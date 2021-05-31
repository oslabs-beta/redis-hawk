// combine reducers
import { combineReducers } from 'redux';
import databaseReducer from './databaseReducer';
import eventsReducer from './eventsReducer';
import graphsReducer from './graphsReducer';
import keyspaceReducer from './keyspaceReducer';
import instanceInfoReducer from './instanceInfoReducer';
import pageReducer from './pageReducer';
import currDisplayReducer from './currentDisplayReducer';
import instanceReducer from './instanceReducer';
import dataPageReducer from './dataPageReducer';
import totalEventsReducer from './totalEventsReducer';


export default combineReducers({
  keyspaceStore: keyspaceReducer,
  eventsStore: eventsReducer,
  totalEventsStore: totalEventsReducer,
  keyGraphStore: graphsReducer,
  currDatabaseStore: databaseReducer,
  currInstanceStore: instanceReducer,
  instanceInfoStore: instanceInfoReducer,
  currPageStore: pageReducer,
  currDisplayStore: currDisplayReducer,
});
