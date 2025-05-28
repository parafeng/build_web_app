// Example: Cách sử dụng icons đã tối ưu hóa trong React Native
// File: src/navigation/MainNavigator.tsx

import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View, Image } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useDispatch, useSelector } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';

// Import optimized icons
import { TabIcons, getTabIcon } from '../assets/icons/icons.config';

// ... other imports ...

const MainTabNavigator: React.FC = () => {
  return (
    <MainTab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, size }) => {
          let iconSource;

          // Sử dụng helper function
          if (route.name === 'Home') {
            iconSource = getTabIcon('home', focused);
          } else if (route.name === 'Gameplay') {
            iconSource = getTabIcon('game', focused);
          } else if (route.name === 'Profile') {
            iconSource = getTabIcon('profile', focused);
          }

          return (
            <Image 
              source={iconSource} 
              style={{ 
                width: size || 24, 
                height: size || 24,
                resizeMode: 'contain'
              }} 
            />
          );
        },
        tabBarActiveTintColor: '#6366f1',
        tabBarInactiveTintColor: '#8e8e93',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#e5e5e7',
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        headerShown: false,
      })}
    >
      <MainTab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          tabBarLabel: 'Trang Chủ',
        }}
      />
      <MainTab.Screen 
        name="Gameplay" 
        component={GameplayScreen}
        options={{
          tabBarLabel: 'Chơi Game',
        }}
      />
      <MainTab.Screen 
        name="Profile" 
        component={ProfileNavigator}
        options={{
          tabBarLabel: 'Hồ Sơ',
        }}
      />
    </MainTab.Navigator>
  );
};

// Example: Sử dụng button icons trong components
// File: src/screens/profile/ProfileScreen.tsx

import { ButtonIcons, getButtonIcon } from '../assets/icons/icons.config';

const ProfileScreen: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      {/* ... existing code ... */}
      
      <TouchableOpacity style={styles.button} onPress={handleEditProfile}>
        <Image 
          source={getButtonIcon('edit')} 
          style={styles.buttonIcon}
        />
        <Text style={styles.buttonText}>Edit Profile</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
        <Image 
          source={getButtonIcon('logout')} 
          style={styles.buttonIcon}
        />
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  // ... existing styles ...
  buttonIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
    resizeMode: 'contain',
  },
});

// Example: Back button trong EditProfileScreen
// File: src/screens/profile/EditProfileScreen.tsx

const EditProfileScreen: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Image 
            source={getButtonIcon('back')} 
            style={styles.backIcon}
          />
          <Text style={styles.backText}>Quay lại</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Chỉnh sửa Profile</Text>
      </View>
      {/* ... rest of component ... */}
    </ScrollView>
  );
};

// Example: Settings button (có thể thêm trong tương lai)
const SettingsButton: React.FC = () => {
  return (
    <TouchableOpacity style={styles.settingsButton}>
      <Image 
        source={getButtonIcon('settings')} 
        style={styles.settingsIcon}
      />
    </TouchableOpacity>
  );
};

export default {
  MainTabNavigator,
  ProfileScreen,
  EditProfileScreen,
  SettingsButton
}; 