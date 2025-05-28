import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { RootState } from '../../redux/types';
import { getAvatarSource } from '../../assets/avatars/avatars.config';
import { logout } from '../../redux/actions/authActions';
import { getButtonIcon } from '../../assets/icons/icons.config';

const ProfileScreen: React.FC = () => {
  const dispatch = useDispatch<ThunkDispatch<RootState, any, AnyAction>>();
  const navigation = useNavigation();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleEditProfile = () => {
    // @ts-ignore
    navigation.navigate('EditProfile');
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Section */}
      <View style={styles.headerSection}>
        <View style={styles.headerBackground} />
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Hồ Sơ Cá Nhân</Text>
          
          {/* Avatar */}
          <View style={styles.avatarContainer}>
            <View style={styles.avatarShadow}>
              <Image 
                source={getAvatarSource(user?.selectedAvatar || 1)} 
                style={styles.avatar}
              />
            </View>
          </View>

          {/* User Info */}
          <View style={styles.userInfoContainer}>
            <Text style={styles.username}>{user?.username}</Text>
            <Text style={styles.email}>{user?.email}</Text>
          </View>
        </View>
      </View>

      {/* Stats Section */}
      <View style={styles.statsSection}>
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>Thống Kê</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <View style={styles.statIconContainer}>
                <Text style={styles.statIcon}>💰</Text>
              </View>
              <Text style={styles.statNumber}>{user?.coins || 0}</Text>
              <Text style={styles.statLabel}>Coins</Text>
            </View>
            
            <View style={styles.statDivider} />
            
            <View style={styles.statItem}>
              <View style={styles.statIconContainer}>
                <Text style={styles.statIcon}>🏆</Text>
              </View>
              <Text style={styles.statNumber}>{user?.score || 0}</Text>
              <Text style={styles.statLabel}>Điểm</Text>
            </View>
            
            <View style={styles.statDivider} />
            
            <View style={styles.statItem}>
              <View style={styles.statIconContainer}>
                <Text style={styles.statIcon}>⭐</Text>
              </View>
              <Text style={styles.statNumber}>{user?.level || 1}</Text>
              <Text style={styles.statLabel}>Cấp độ</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Actions Section */}
      <View style={styles.actionsSection}>
        <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
          <View style={styles.buttonIconContainer}>
            <Image 
              source={getButtonIcon('edit')} 
              style={styles.buttonIcon}
            />
          </View>
          <View style={styles.buttonTextContainer}>
            <Text style={styles.buttonTitle}>Chỉnh sửa Profile</Text>
            <Text style={styles.buttonSubtitle}>Cập nhật thông tin cá nhân</Text>
          </View>
          <Text style={styles.buttonArrow}>→</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <View style={[styles.buttonIconContainer, styles.logoutIconContainer]}>
            <Image 
              source={getButtonIcon('logout')} 
              style={[styles.buttonIcon, styles.logoutIcon]}
            />
          </View>
          <View style={styles.buttonTextContainer}>
            <Text style={styles.logoutButtonTitle}>Đăng xuất</Text>
            <Text style={styles.logoutButtonSubtitle}>Thoát khỏi tài khoản</Text>
          </View>
          <Text style={styles.logoutButtonArrow}>→</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Spacing */}
      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  
  // Header Section
  headerSection: {
    position: 'relative',
    paddingBottom: 30,
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 200,
    backgroundColor: '#1e90ff',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 30,
  },
  
  // Avatar
  avatarContainer: {
    marginBottom: 20,
  },
  avatarShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#ffffff',
  },
  
  // User Info
  userInfoContainer: {
    alignItems: 'center',
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: '#e0e7ff',
    opacity: 0.9,
  },
  
  // Stats Section
  statsSection: {
    paddingHorizontal: 20,
    marginTop: -15,
  },
  statsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 20,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  statIcon: {
    fontSize: 24,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e90ff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#e5e7eb',
    marginHorizontal: 10,
  },
  
  // Actions Section
  actionsSection: {
    paddingHorizontal: 20,
    paddingTop: 25,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#fecaca',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  logoutIconContainer: {
    backgroundColor: '#fef2f2',
  },
  buttonIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    tintColor: '#ffffff',
  },
  logoutIcon: {
    tintColor: '#dc2626',
  },
  buttonTextContainer: {
    flex: 1,
  },
  buttonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  buttonSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  logoutButtonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#dc2626',
    marginBottom: 2,
  },
  logoutButtonSubtitle: {
    fontSize: 14,
    color: '#dc2626',
    opacity: 0.7,
  },
  buttonArrow: {
    fontSize: 18,
    color: '#6b7280',
    fontWeight: 'bold',
  },
  logoutButtonArrow: {
    fontSize: 18,
    color: '#dc2626',
    fontWeight: 'bold',
  },
  
  // Bottom Spacing
  bottomSpacing: {
    height: 30,
  },
});

export default ProfileScreen; 