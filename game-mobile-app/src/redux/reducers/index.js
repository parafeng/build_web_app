import { combineReducers } from 'redux';
import authReducer from './authReducer';
import gamesReducer from './gamesReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  games: gamesReducer
});

export default rootReducer;
