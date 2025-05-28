import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, SafeAreaView, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const STATS = [
  { id: '1', title: 'Games Played', value: '27' },
  { id: '2', title: 'Achievements', value: '14' },
  { id: '3', title: 'Time Played', value: '8h 23m' },
];

const RECENT_GAMES = [
  {
    id: '1',
    title: 'Cyberfusion',
    lastPlayed: '2 hours ago',
    progress: 75,
    image: require('../../assets/images/games/thumbnails/cyberfusion.png'),
  },
  {
    id: '2',
    title: 'Boulder Blast',
    lastPlayed: 'Yesterday',
    progress: 45,
    image: require('../../assets/images/games/thumbnails/boulder_blast.png'),
  },
  {
    id: '3',
    title: 'Kingdom Fight 2.0',
    lastPlayed: '3 days ago',
    progress: 30,
    image: require('../../assets/images/games/thumbnails/kingdom_fight_2.png'),
  },
];

const ACHIEVEMENTS = [
  {
    id: '1',
    title: 'First Victory',
    description: 'Win your first game',
    completed: true,
    icon: 'trophy-outline',
  },
  {
    id: '2',
    title: 'Game Master',
    description: 'Play 10 different games',
    completed: true,
    icon: 'ribbon-outline',
  },
  {
    id: '3',
    title: 'Dedicated Player',
    description: 'Play for more than 5 hours',
    completed: false,
    icon: 'time-outline',
  },
];

const StatCard = ({ stat }) => {
  if (!stat) return null;
  
  const title = stat.title || 'Stat';
  const value = stat.value || '0';
  
  return (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
  );
};

const RecentGameCard = ({ game }) => {
  if (!game) return null;
  
  const title = game.title || 'Unknown Game';
  const lastPlayed = game.lastPlayed || 'Never played';
  const progress = game.progress || 0;
  const image = game.image || require('../../assets/images/games/thumbnails/cyberfusion.png');
  
  return (
    <TouchableOpacity style={styles.recentGameCard}>
      <Image source={image} style={styles.recentGameImage} />
      <View style={styles.recentGameInfo}>
        <Text style={styles.recentGameTitle}>{title}</Text>
        <Text style={styles.recentGameLastPlayed}>{lastPlayed}</Text>
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const AchievementCard = ({ achievement }) => {
  if (!achievement) return null;
  
  const title = achievement.title || 'Achievement';
  const description = achievement.description || 'Complete this achievement';
  const completed = achievement.completed || false;
  const icon = achievement.icon || 'star-outline';
  
  return (
    <View style={styles.achievementCard}>
      <View style={[
        styles.achievementIconContainer,
        completed ? styles.achievementCompleted : styles.achievementIncomplete
      ]}>
        <Ionicons 
          name={icon} 
          size={20} 
          color={completed ? '#fff' : '#999'} 
        />
      </View>
      <View style={styles.achievementInfo}>
        <Text style={styles.achievementTitle}>{title}</Text>
        <Text style={styles.achievementDescription}>{description}</Text>
      </View>
      {completed ? (
        <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
      ) : (
        <Ionicons name="lock-closed-outline" size={24} color="#999" />
      )}
    </View>
  );
};

const ProfileScreen = () => {
  const userStats = React.useMemo(() => STATS || [], []);
  const recentGames = React.useMemo(() => RECENT_GAMES || [], []);
  const achievements = React.useMemo(() => ACHIEVEMENTS || [], []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E88E5" />
      
      {/* Header - Thu gọn */}
      <View style={styles.compactHeader}>
        <View style={styles.headerContent}>
          <View style={styles.avatarContainer}>
            <Image 
              source={require('../../assets/avatars/default/avatar_001.png')} 
              style={styles.avatar}
            />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>Người chơi</Text>
            <Text style={styles.userLevel}>Cấp độ 5</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.editButton}>
          <Ionicons name="settings-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Stats */}
        <View style={styles.statsContainer}>
          {userStats && userStats.length > 0 ? (
            userStats.map(stat => stat && (
              <StatCard key={stat.id} stat={stat} />
            ))
          ) : (
            <Text style={styles.noContentText}>Chưa có thống kê</Text>
          )}
        </View>

        {/* Recent Games */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Game gần đây</Text>
          <View style={styles.recentGamesContainer}>
            {recentGames && recentGames.length > 0 ? (
              recentGames.map(game => game && (
                <RecentGameCard key={game.id} game={game} />
              ))
            ) : (
              <Text style={styles.noContentText}>Chưa có game nào gần đây</Text>
            )}
          </View>
        </View>

        {/* Achievements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thành tích</Text>
          <View style={styles.achievementsContainer}>
            {achievements && achievements.length > 0 ? (
              achievements.map(achievement => achievement && (
                <AchievementCard key={achievement.id} achievement={achievement} />
              ))
            ) : (
              <Text style={styles.noContentText}>Chưa có thành tích nào</Text>
            )}
          </View>
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cài đặt</Text>
          <View style={styles.settingsContainer}>
            <TouchableOpacity style={styles.settingItem}>
              <Ionicons name="person-outline" size={24} color="#333" />
              <Text style={styles.settingText}>Chỉnh sửa hồ sơ</Text>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingItem}>
              <Ionicons name="notifications-outline" size={24} color="#333" />
              <Text style={styles.settingText}>Thông báo</Text>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingItem}>
              <Ionicons name="settings-outline" size={24} color="#333" />
              <Text style={styles.settingText}>Cài đặt ứng dụng</Text>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingItem}>
              <Ionicons name="help-circle-outline" size={24} color="#333" />
              <Text style={styles.settingText}>Trợ giúp & Hỗ trợ</Text>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  // Thay đổi header
  compactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#2196F3',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    padding: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 25,
  },
  profileInfo: {
    marginLeft: 15,
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  userLevel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  editButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingTop: 15,
  },
  scrollContent: {
    paddingBottom: 80, // Thêm padding dưới để tránh bị che bởi tabBar từ MainNavigator
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statCard: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    minWidth: 100,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E88E5',
    marginBottom: 5,
  },
  statTitle: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  recentGamesContainer: {
    marginBottom: 10,
  },
  recentGameCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  recentGameImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  recentGameInfo: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },
  recentGameTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  recentGameLastPlayed: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  progressContainer: {
    height: 4,
    backgroundColor: '#f0f0f0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#1E88E5',
  },
  achievementsContainer: {
    marginBottom: 10,
  },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  achievementIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  achievementCompleted: {
    backgroundColor: '#1E88E5',
  },
  achievementIncomplete: {
    backgroundColor: '#f0f0f0',
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 14,
    color: '#666',
  },
  settingsContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 15,
  },
  noContentText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    padding: 20,
  },
});

export default ProfileScreen; 