import { combineReducers } from 'redux';
import authReducer from './authReducer.ts';
import gameReducer from './gameReducer.ts';
import profileReducer from './profileReducer.ts';
import { RootState } from '../types';

const rootReducer = combineReducers({
  auth: authReducer,
  game: gameReducer,
  profile: profileReducer,
});

export default rootReducer; 