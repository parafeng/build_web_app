import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getButtonIcon } from '../../assets/icons/icons.config';
import { checkApiStatus } from '../../api/authApi';

const GuestProfileScreen: React.FC = () => {
  const navigation = useNavigation();
  const [checkingApi, setCheckingApi] = useState(false);

  const handleLogin = () => {
    // @ts-ignore
    navigation.navigate('Auth', { screen: 'Login' });
  };

  const handleRegister = () => {
    // @ts-ignore
    navigation.navigate('Auth', { screen: 'Register' });
  };

  const handleCheckApi = async () => {
    setCheckingApi(true);
    try {
      const result = await checkApiStatus();
      Alert.alert(
        'Kết quả kiểm tra API',
        `Trạng thái: ${result.apiChecked ? 'Hoàn tất' : 'Lỗi'}\n${result.message || result.error || ''}`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert(
        'Lỗi kiểm tra API',
        `Đã xảy ra lỗi: ${error.message}`,
        [{ text: 'OK' }]
      );
    } finally {
      setCheckingApi(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.headerSection}>
        <View style={styles.headerBackground} />
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Hồ Sơ Cá Nhân</Text>

          {/* Guest Avatar */}
          <View style={styles.avatarContainer}>
            <View style={styles.avatarShadow}>
              <Image 
                source={require('../../assets/icons/tabs/profile_active.png')} 
                style={styles.avatar}
              />
            </View>
          </View>

          {/* Guest Info */}
          <View style={styles.userInfoContainer}>
            <Text style={styles.guestTitle}>Chào mừng!</Text>
            <Text style={styles.guestSubtitle}>Đăng nhập để truy cập đầy đủ tính năng</Text>
          </View>
        </View>
      </View>

      {/* Actions Section */}
      <View style={styles.actionsSection}>
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <View style={styles.buttonIconContainer}>
            <Image 
              source={getButtonIcon('login')} 
              style={styles.buttonIcon}
            />
          </View>
          <View style={styles.buttonTextContainer}>
            <Text style={styles.buttonTitle}>Đăng nhập</Text>
            <Text style={styles.buttonSubtitle}>Truy cập vào tài khoản của bạn</Text>
          </View>
          <Text style={styles.buttonArrow}>→</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
          <View style={[styles.buttonIconContainer, styles.registerIconContainer]}>
            <Image 
              source={getButtonIcon('signup')} 
              style={styles.buttonIcon}
            />
          </View>
          <View style={styles.buttonTextContainer}>
            <Text style={styles.buttonTitle}>Đăng ký</Text>
            <Text style={styles.buttonSubtitle}>Tạo tài khoản mới</Text>
          </View>
          <Text style={styles.buttonArrow}>→</Text>
        </TouchableOpacity>

        {/* Nút kiểm tra API */}
        <TouchableOpacity 
          style={[styles.debugButton, checkingApi && styles.debugButtonDisabled]} 
          onPress={handleCheckApi}
          disabled={checkingApi}
        >
          <View style={[styles.buttonIconContainer, styles.debugIconContainer]}>
            {checkingApi ? (
              <ActivityIndicator size="small" color="#4b5563" />
            ) : (
              <Text style={styles.debugIcon}>🔍</Text>
            )}
          </View>
          <View style={styles.buttonTextContainer}>
            <Text style={styles.buttonTitle}>Kiểm tra kết nối API</Text>
            <Text style={styles.buttonSubtitle}>Debug kết nối đến server</Text>
          </View>
          <Text style={styles.buttonArrow}>→</Text>
        </TouchableOpacity>
      </View>

      {/* Guest Benefits Section */}
      <View style={styles.benefitsSection}>
        <Text style={styles.benefitsTitle}>Lợi ích khi đăng nhập</Text>
        
        <View style={styles.benefitItem}>
          <Text style={styles.benefitIcon}>🏆</Text>
          <Text style={styles.benefitText}>Lưu tiến trình và điểm số</Text>
        </View>
        
        <View style={styles.benefitItem}>
          <Text style={styles.benefitIcon}>💰</Text>
          <Text style={styles.benefitText}>Nhận coins hàng ngày</Text>
        </View>
        
        <View style={styles.benefitItem}>
          <Text style={styles.benefitIcon}>🎮</Text>
          <Text style={styles.benefitText}>Mở khóa các game đặc biệt</Text>
        </View>
      </View>
    </View>
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
    backgroundColor: '#efefef',
    tintColor: '#007BFF'
  },
  
  // User Info
  userInfoContainer: {
    alignItems: 'center',
  },
  guestTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  guestSubtitle: {
    fontSize: 16,
    color: '#e0e7ff',
    opacity: 0.9,
    textAlign: 'center',
  },
  
  // Actions Section
  actionsSection: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  registerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f0f9ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  registerIconContainer: {
    backgroundColor: '#f0fff4',
  },
  buttonIcon: {
    width: 24,
    height: 24,
  },
  buttonTextContainer: {
    flex: 1,
  },
  buttonTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  buttonSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  buttonArrow: {
    fontSize: 18,
    color: '#9ca3af',
    fontWeight: 'bold',
  },

  // Benefits Section
  benefitsSection: {
    marginTop: 20,
    marginHorizontal: 20,
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  benefitsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 15,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  benefitIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  benefitText: {
    fontSize: 15,
    color: '#4b5563',
  },

  // Debug Section
  debugButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  debugButtonDisabled: {
    backgroundColor: '#e5e7eb',
  },
  debugIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f0f9ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  debugIcon: {
    fontSize: 18,
    color: '#4b5563',
  },
});

export default GuestProfileScreen; 