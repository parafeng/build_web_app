import {
  AchievementState,
  AchievementActionTypes,
  FETCH_ACHIEVEMENTS,
  UPDATE_ACHIEVEMENTS,
  UNLOCK_ACHIEVEMENT,
  RESET_ACHIEVEMENTS
} from '../types';

const initialState: AchievementState = {
  achievements: [],
  loading: false,
  error: null
};

const achievementReducer = (
  state = initialState,
  action: AchievementActionTypes
): AchievementState => {
  switch (action.type) {
    case FETCH_ACHIEVEMENTS:
      return {
        ...state,
        achievements: action.payload,
        loading: false
      };
    case UPDATE_ACHIEVEMENTS:
      return {
        ...state,
        achievements: action.payload,
        loading: false
      };
    case UNLOCK_ACHIEVEMENT:
      return {
        ...state,
        achievements: state.achievements.map(achievement => 
          achievement.id === action.payload
            ? { ...achievement, completed: true, progress: achievement.requirement }
            : achievement
        )
      };
    case RESET_ACHIEVEMENTS:
      return {
        ...state,
        achievements: [],
        loading: false
      };
    default:
      return state;
  }
};

export default achievementReducer; 