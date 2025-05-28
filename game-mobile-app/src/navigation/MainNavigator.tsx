import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View, Image } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useDispatch, useSelector } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';

// Screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import HomeScreen from '../screens/game/HomeScreen';
import GameCatalogScreen from '../screens/game/GameCatalogScreen';
import GameScreen from '../screens/game/GameScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import GuestProfileScreen from '../screens/profile/GuestProfileScreen';
import EditProfileScreen from '../screens/profile/EditProfileScreen';

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
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
    </AuthStack.Navigator>
  );
};

const ProfileNavigator: React.FC = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <>
          <ProfileStack.Screen name="ProfileMain" component={ProfileScreen} />
          <ProfileStack.Screen name="EditProfile" component={EditProfileScreen} />
        </>
      ) : (
        <ProfileStack.Screen name="GuestProfile" component={GuestProfileScreen} />
      )}
    </ProfileStack.Navigator>
  );
};

const GameNavigator: React.FC = () => {
  return (
    <GameStack.Navigator screenOptions={{ headerShown: false }}>
      <GameStack.Screen name="GameCatalog" component={GameCatalogScreen} />
      <GameStack.Screen name="GamePlay" component={GameScreen} />
    </GameStack.Navigator>
  );
};

const MainTabNavigator: React.FC = () => {
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
        tabBarActiveTintColor: '#1e90ff',
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
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      <RootStack.Screen name="MainApp" component={MainTabNavigator} />
      <RootStack.Screen name="Auth" component={AuthNavigator} />
    </RootStack.Navigator>
  );
};

export default MainNavigator; 