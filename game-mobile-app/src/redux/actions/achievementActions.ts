import { 
  FETCH_ACHIEVEMENTS, 
  UPDATE_ACHIEVEMENTS, 
  UNLOCK_ACHIEVEMENT, 
  RESET_ACHIEVEMENTS,
  Achievement,
  AchievementActionTypes
} from '../types';

import { ThunkAction } from 'redux-thunk';
import { RootState } from '../types';
import { Action } from 'redux';

// Thunkable action to fetch achievements
export const fetchAchievements = (): ThunkAction<void, RootState, unknown, Action<string>> => {
  return async (dispatch) => {
    try {
      // Tạm thời chúng ta lấy từ localStorage, sau này có thể lấy từ API
      const achievementsData = localStorage.getItem('achievements');
      let achievements: Achievement[] = [];
      
      if (achievementsData) {
        achievements = JSON.parse(achievementsData);
      }
      
      dispatch({
        type: FETCH_ACHIEVEMENTS,
        payload: achievements
      });
    } catch (error) {
      console.error('Error fetching achievements:', error);
    }
  };
};

// Cập nhật toàn bộ danh sách thành tích
export const updateAchievements = (achievements: Achievement[]): AchievementActionTypes => {
  // Lưu vào localStorage để giữ dữ liệu
  localStorage.setItem('achievements', JSON.stringify(achievements));
  
  return {
    type: UPDATE_ACHIEVEMENTS,
    payload: achievements
  };
};

// Mở khóa một thành tích cụ thể
export const unlockAchievement = (achievementId: string): ThunkAction<void, RootState, unknown, Action<string>> => {
  return async (dispatch, getState) => {
    const { achievements } = getState().achievements;
    
    const updatedAchievements = achievements.map(achievement => {
      if (achievement.id === achievementId) {
        return {
          ...achievement,
          completed: true,
          progress: achievement.requirement,
          dateCompleted: new Date().toISOString()
        };
      }
      return achievement;
    });
    
    localStorage.setItem('achievements', JSON.stringify(updatedAchievements));
    
    dispatch({
      type: UPDATE_ACHIEVEMENTS,
      payload: updatedAchievements
    });
    
    // Sau khi mở khóa thành tích, có thể hiển thị thông báo hoặc cập nhật coins cho người dùng
    const unlockedAchievement = updatedAchievements.find(a => a.id === achievementId);
    if (unlockedAchievement && unlockedAchievement.rewardCoins) {
      // Đây sẽ là nơi để cập nhật coins của người dùng
      console.log(`Achievement unlocked: ${unlockedAchievement.title}! Awarded ${unlockedAchievement.rewardCoins} coins`);
    }
  };
};

// Reset tất cả thành tích
export const resetAchievements = (): AchievementActionTypes => {
  localStorage.removeItem('achievements');
  
  return {
    type: RESET_ACHIEVEMENTS
  };
}; 