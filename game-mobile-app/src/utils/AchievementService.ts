import store from '../redux/store';
import { updateAchievements } from '../redux/actions/achievementActions';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string; // Emoji hoặc icon name
  completed: boolean;
  progress?: number; // Tiến độ hoàn thành (0-100)
  requirement: number; // Số lượng cần để hoàn thành
  rewardCoins?: number; // Số coins thưởng khi hoàn thành
  category: 'gameplay' | 'social' | 'progression' | 'collection';
  dateCompleted?: string; // Ngày hoàn thành
}

class AchievementService {
  private static instance: AchievementService;

  // Danh sách các thành tích
  private achievements: Achievement[] = [
    {
      id: 'first_victory',
      title: 'First Victory',
      description: 'Win your first game',
      icon: '🏆',
      completed: false,
      requirement: 1,
      rewardCoins: 50,
      category: 'gameplay',
      progress: 0
    },
    {
      id: 'game_master',
      title: 'Game Master',
      description: 'Play 10 different games',
      icon: '🎮',
      completed: false,
      requirement: 10,
      rewardCoins: 100,
      category: 'collection',
      progress: 0
    },
    {
      id: 'dedicated_player',
      title: 'Dedicated Player',
      description: 'Play for more than 5 hours',
      icon: '⏱️',
      completed: false,
      requirement: 300, // 300 phút = 5 giờ
      rewardCoins: 150,
      category: 'progression',
      progress: 0
    },
    {
      id: 'high_scorer',
      title: 'High Scorer',
      description: 'Reach 1000 points in any game',
      icon: '🌟',
      completed: false,
      requirement: 1000,
      rewardCoins: 100,
      category: 'gameplay',
      progress: 0
    },
    {
      id: 'daily_login',
      title: 'Daily Login',
      description: 'Login for 7 consecutive days',
      icon: '📅',
      completed: false,
      requirement: 7,
      rewardCoins: 200,
      category: 'progression',
      progress: 0
    }
  ];

  private constructor() {
    // Singleton
  }

  public static getInstance(): AchievementService {
    if (!AchievementService.instance) {
      AchievementService.instance = new AchievementService();
    }
    return AchievementService.instance;
  }

  // Lấy tất cả thành tích
  public getAchievements(): Achievement[] {
    return this.achievements;
  }

  // Cập nhật tiến độ thành tích theo ID
  public updateAchievementProgress(id: string, progressValue: number): void {
    const achievementIndex = this.achievements.findIndex(a => a.id === id);
    if (achievementIndex === -1) return;

    const achievement = this.achievements[achievementIndex];
    const newProgress = Math.min(progressValue, achievement.requirement);
    
    this.achievements[achievementIndex] = {
      ...achievement,
      progress: newProgress,
      completed: newProgress >= achievement.requirement
    };

    // Nếu vừa hoàn thành thành tích, cập nhật ngày hoàn thành
    if (newProgress >= achievement.requirement && !achievement.completed) {
      this.achievements[achievementIndex].dateCompleted = new Date().toISOString();
    }

    // Cập nhật redux store
    store.dispatch(updateAchievements(this.achievements));
  }

  // Tăng tiến độ thành tích theo ID
  public incrementAchievementProgress(id: string, increment: number = 1): void {
    const achievementIndex = this.achievements.findIndex(a => a.id === id);
    if (achievementIndex === -1) return;

    const achievement = this.achievements[achievementIndex];
    const currentProgress = achievement.progress || 0;
    this.updateAchievementProgress(id, currentProgress + increment);
  }

  // Kiểm tra thành tích khi thắng game
  public checkGameVictory(): void {
    this.incrementAchievementProgress('first_victory', 1);
  }

  // Kiểm tra thành tích khi chơi game mới
  public checkNewGamePlayed(gameId: string): void {
    // Logic để đếm số lượng game đã chơi và cập nhật Game Master
    const totalGamesPlayed = this.countUniquePlayed();
    this.updateAchievementProgress('game_master', totalGamesPlayed);
  }

  // Kiểm tra thành tích khi thời gian chơi tăng
  public updatePlayTime(minutesPlayed: number): void {
    const achievement = this.achievements.find(a => a.id === 'dedicated_player');
    if (!achievement) return;
    
    const currentProgress = achievement.progress || 0;
    this.updateAchievementProgress('dedicated_player', currentProgress + minutesPlayed);
  }

  // Kiểm tra thành tích khi đạt điểm cao
  public checkHighScore(score: number): void {
    const achievement = this.achievements.find(a => a.id === 'high_scorer');
    if (!achievement) return;
    
    const currentProgress = achievement.progress || 0;
    this.updateAchievementProgress('high_scorer', Math.max(currentProgress, score));
  }

  // Kiểm tra thành tích đăng nhập hàng ngày
  public checkDailyLogin(consecutiveDays: number): void {
    this.updateAchievementProgress('daily_login', consecutiveDays);
  }

  // Phương thức phụ trợ để đếm số lượng game khác nhau đã chơi
  private countUniquePlayed(): number {
    // Đây là nơi bạn sẽ lấy dữ liệu từ redux store hoặc local storage
    // Giả sử chúng ta có một hàm giả để lấy số lượng game đã chơi
    return 2; // Giả sử người dùng đã chơi 2 game khác nhau
  }
}

export default AchievementService.getInstance(); 