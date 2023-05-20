// third-party
import { combineReducers } from 'redux';

// project import
import events from './events';
import app from './app';

// ==============================|| COMBINE REDUCERS ||============================== //

const reducers = combineReducers({ app, events });

export default reducers;
