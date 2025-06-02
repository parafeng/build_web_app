import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View, Image } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useDispatch, useSelector } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { useTheme } from '../utils/ThemeContext';

// Screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import HomeScreen from '../screens/game/HomeScreen';
import GameCatalogScreen from '../screens/game/GameCatalogScreen';
import GameScreen from '../screens/game/GameScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import GuestProfileScreen from '../screens/profile/GuestProfileScreen';
import EditProfileScreen from '../screens/profile/EditProfileScreen';
import HelpSupportScreen from '../screens/profile/HelpSupportScreen';
import AppSettingsScreen from '../screens/profile/AppSettingsScreen';
import AchievementsScreen from '../screens/profile/AchievementsScreen';

// Import optimized icons
import { getTabIcon } from '../assets/icons/icons.config';

// Actions
import { checkAuthStatus } from '../redux/actions/authActions';

// State type
import { RootState } from '../redux/types';

// Type definitions
type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

type ProfileStackParamList = {
  ProfileMain: undefined;
  EditProfile: undefined;
  GuestProfile: undefined;
  HelpSupport: undefined;
  AppSettings: undefined;
  Achievements: undefined;
};

type GameStackParamList = {
  GameCatalog: undefined;
  GamePlay: { game: any };
};

type MainTabParamList = {
  Home: undefined;
  Gameplay: undefined;
  Profile: undefined;
};

type RootStackParamList = {
  Auth: undefined;
  MainApp: undefined;
};

const AuthStack = createStackNavigator<AuthStackParamList>();
const ProfileStack = createStackNavigator<ProfileStackParamList>();
const GameStack = createStackNavigator<GameStackParamList>();
const MainTab = createBottomTabNavigator<MainTabParamList>();
const RootStack = createStackNavigator<RootStackParamList>();

const AuthNavigator: React.FC = () => {
  const { theme } = useTheme();
  
  return (
    <AuthStack.Navigator screenOptions={{ 
      headerShown: false,
      cardStyle: { backgroundColor: theme.background }
    }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
    </AuthStack.Navigator>
  );
};

const ProfileNavigator: React.FC = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { theme } = useTheme();

  return (
    <ProfileStack.Navigator screenOptions={{ 
      headerShown: false,
      cardStyle: { backgroundColor: theme.background }
    }}>
      {isAuthenticated ? (
        <>
          <ProfileStack.Screen name="ProfileMain" component={ProfileScreen} />
          <ProfileStack.Screen name="EditProfile" component={EditProfileScreen} />
          <ProfileStack.Screen name="HelpSupport" component={HelpSupportScreen} />
          <ProfileStack.Screen name="AppSettings" component={AppSettingsScreen} />
          <ProfileStack.Screen name="Achievements" component={AchievementsScreen} />
        </>
      ) : (
        <ProfileStack.Screen name="GuestProfile" component={GuestProfileScreen} />
      )}
    </ProfileStack.Navigator>
  );
};

const GameNavigator: React.FC = () => {
  const { theme } = useTheme();
  
  return (
    <GameStack.Navigator screenOptions={{ 
      headerShown: false,
      cardStyle: { backgroundColor: theme.background }
    }}>
      <GameStack.Screen name="GameCatalog" component={GameCatalogScreen} />
      <GameStack.Screen name="GamePlay" component={GameScreen} />
    </GameStack.Navigator>
  );
};

const MainTabNavigator: React.FC = () => {
  const { theme, isDark } = useTheme();
  
  return (
    <MainTab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, size }) => {
          let iconSource;

          // Sử dụng custom icons
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
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.tabBarInactive,
        tabBarStyle: {
          backgroundColor: theme.tabBar,
          borderTopWidth: 1,
          borderTopColor: theme.border,
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
        component={GameNavigator}
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

const MainNavigator: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch<ThunkDispatch<RootState, unknown, AnyAction>>();
  const { theme } = useTheme();

  useEffect(() => {
    // Kiểm tra trạng thái xác thực khi ứng dụng khởi động
    const checkAuth = async () => {
      try {
        await dispatch(checkAuthStatus());
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [dispatch]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background }}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <RootStack.Navigator screenOptions={{ 
      headerShown: false,
      cardStyle: { backgroundColor: theme.background }
    }}>
      <RootStack.Screen name="MainApp" component={MainTabNavigator} />
      <RootStack.Screen name="Auth" component={AuthNavigator} />
    </RootStack.Navigator>
  );
};

export default MainNavigator; 