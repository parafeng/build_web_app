import { combineReducers } from 'redux';
import authReducer from './authReducer';
import gameReducer from './gameReducer';
import profileReducer from './profileReducer';
import achievementReducer from './achievementReducer';
import { RootState } from '../types';

const rootReducer = combineReducers({
  auth: authReducer,
  game: gameReducer,
  profile: profileReducer,
  achievements: achievementReducer
});

export default rootReducer; 