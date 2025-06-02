import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert, ActivityIndicator, ScrollView } from 'react-native';
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

      {/* Scrollable Content */}
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
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
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  
  scrollContainer: {
    flex: 1,
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
    backgroundColor: '#007bff',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 30,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
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
    color: '#000000',
    marginBottom: 8,
    textShadowColor: 'rgba(255, 255, 255, 0.6)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  guestSubtitle: {
    fontSize: 16,
    color: '#000000',
    textAlign: 'center',
    textShadowColor: 'rgba(255, 255, 255, 0.6)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    fontWeight: '500',
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
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 3,
  },
  registerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 3,
  },
  buttonIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e6f2ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  registerIconContainer: {
    backgroundColor: '#e8fff0',
  },
  buttonIcon: {
    width: 26,
    height: 26,
  },
  buttonTextContainer: {
    flex: 1,
  },
  buttonTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#121212',
    marginBottom: 4,
  },
  buttonSubtitle: {
    fontSize: 14,
    color: '#4a4a4a',
  },
  buttonArrow: {
    fontSize: 20,
    color: '#666',
    fontWeight: 'bold',
  },

  // Benefits Section
  benefitsSection: {
    marginTop: 20,
    marginHorizontal: 20,
    marginBottom: 30,
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 3,
  },
  benefitsTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#121212',
    marginBottom: 18,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  benefitIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  benefitText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },

  // Debug Section
  debugButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 3,
  },
  debugButtonDisabled: {
    backgroundColor: '#f0f0f0',
  },
  debugIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f9ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  debugIcon: {
    fontSize: 20,
    color: '#333',
  },
});

export default GuestProfileScreen; 