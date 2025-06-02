import { combineReducers } from 'redux';
import authReducer from './authReducer.ts';
import gameReducer from './gameReducer.ts';
import profileReducer from './profileReducer.ts';
import achievementReducer from './achievementReducer.ts';
import { RootState } from '../types';

const rootReducer = combineReducers({
  auth: authReducer,
  game: gameReducer,
  profile: profileReducer,
  achievements: achievementReducer
});

export default rootReducer; 