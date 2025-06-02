import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image, SafeAreaView, StatusBar, Platform } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { Ionicons } from '@expo/vector-icons';
import { RootState } from '../../redux/types';
import { getAvatarSource } from '../../assets/avatars/avatars.config';
import { logout } from '../../redux/actions/authActions';

// Danh sách thành tích
const ACHIEVEMENTS = [
  {
    id: 'first_victory',
    title: 'First Victory',
    description: 'Win your first game',
    icon: '🏆',
    completed: true
  },
  {
    id: 'game_master',
    title: 'Game Master',
    description: 'Play 10 different games',
    icon: '🎮',
    completed: true
  },
  {
    id: 'dedicated_player',
    title: 'Dedicated Player',
    description: 'Play for more than 5 hours',
    icon: '⏱️',
    completed: false
  }
];

const ProfileScreen: React.FC = () => {
  const dispatch = useDispatch<ThunkDispatch<RootState, any, AnyAction>>();
  const navigation = useNavigation();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleEditProfile = () => {
    // @ts-ignore
    navigation.navigate('EditProfile');
  };

  const handleHelpSupport = () => {
    // @ts-ignore
    navigation.navigate('HelpSupport');
  };

  const handleAppSettings = () => {
    // @ts-ignore
    navigation.navigate('AppSettings');
  };
  
  const handleAchievements = () => {
    // @ts-ignore
    navigation.navigate('Achievements');
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#2196F3" barStyle="light-content" />
      
      {/* Header - Thu gọn và cố định */}
      <View style={styles.fixedHeader}>
        <View style={styles.headerContent}>
          <View style={styles.avatarContainer}>
            <Image 
              source={getAvatarSource(user?.selectedAvatar || 1)} 
              style={styles.avatar}
            />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>{user?.username || 'Người chơi'}</Text>
            <Text style={styles.userLevel}>Cấp độ {user?.level || 5}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.settingsButton} onPress={handleEditProfile}>
          <Ionicons name="settings-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Nội dung có thể cuộn */}
      <ScrollView 
        style={styles.scrollContent}
        contentContainerStyle={styles.scrollContentContainer}
        showsVerticalScrollIndicator={true}
        bounces={true}
      >
        {/* Phần thành tích */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thành tích</Text>
          
          {ACHIEVEMENTS.map(achievement => (
            <View key={achievement.id} style={styles.achievementItem}>
              <View style={[
                styles.achievementIconContainer, 
                achievement.completed ? styles.completedIconContainer : styles.lockedIconContainer
              ]}>
                <Text style={styles.achievementIcon}>{achievement.icon}</Text>
              </View>
              <View style={styles.achievementInfo}>
                <Text style={styles.achievementTitle}>{achievement.title}</Text>
                <Text style={styles.achievementDescription}>{achievement.description}</Text>
              </View>
              {achievement.completed ? (
                <View style={styles.completedBadge}>
                  <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                </View>
              ) : (
                <View style={styles.lockBadge}>
                  <Ionicons name="lock-closed" size={20} color="#9E9E9E" />
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Phần cài đặt */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cài đặt</Text>
          
          <View style={styles.settingsContainer}>
            <TouchableOpacity style={styles.settingItem} onPress={handleEditProfile}>
              <Ionicons name="person-outline" size={24} color="#616161" />
              <Text style={styles.settingText}>Chỉnh sửa hồ sơ</Text>
              <Ionicons name="chevron-forward" size={20} color="#9E9E9E" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.settingItem} onPress={handleAchievements}>
              <Ionicons name="trophy-outline" size={24} color="#616161" />
              <Text style={styles.settingText}>Thành tích</Text>
              <Ionicons name="chevron-forward" size={20} color="#9E9E9E" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.settingItem}>
              <Ionicons name="notifications-outline" size={24} color="#616161" />
              <Text style={styles.settingText}>Thông báo</Text>
              <Ionicons name="chevron-forward" size={20} color="#9E9E9E" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.settingItem} onPress={handleAppSettings}>
              <Ionicons name="settings-outline" size={24} color="#616161" />
              <Text style={styles.settingText}>Cài đặt ứng dụng</Text>
              <Ionicons name="chevron-forward" size={20} color="#9E9E9E" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.settingItem} onPress={handleHelpSupport}>
              <Ionicons name="help-circle-outline" size={24} color="#616161" />
              <Text style={styles.settingText}>Trợ giúp & Hỗ trợ</Text>
              <Ionicons name="chevron-forward" size={20} color="#9E9E9E" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.settingItem} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={24} color="#F44336" />
              <Text style={[styles.settingText, styles.logoutText]}>Đăng xuất</Text>
              <Ionicons name="chevron-forward" size={20} color="#9E9E9E" />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Thêm khoảng cách dưới cùng */}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  fixedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#2196F3',
    paddingHorizontal: 16,
    paddingBottom: 10,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 15 : 40,
    zIndex: 10,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  profileInfo: {
    justifyContent: 'center',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  userLevel: {
    fontSize: 14,
    color: '#E3F2FD',
  },
  settingsButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  scrollContentContainer: {
    padding: 16,
    paddingBottom: 30,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#263238',
    marginBottom: 12,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  achievementIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  completedIconContainer: {
    backgroundColor: '#E3F2FD',
  },
  lockedIconContainer: {
    backgroundColor: '#F5F5F5',
  },
  achievementIcon: {
    fontSize: 20,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#263238',
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 14,
    color: '#78909C',
  },
  completedBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#ECEFF1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsContainer: {
    backgroundColor: '#FFFFFF',
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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ECEFF1',
  },
  settingText: {
    flex: 1,
    fontSize: 16,
    color: '#263238',
    marginLeft: 15,
  },
  logoutText: {
    color: '#F44336',
  },
  bottomPadding: {
    height: 30,
  },
});

export default ProfileScreen; 