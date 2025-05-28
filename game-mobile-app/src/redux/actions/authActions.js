import AsyncStorage from '@react-native-async-storage/async-storage';
import * as authApi from '../../api/authApi';
import { STORAGE_KEYS } from '../../api/config';
import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT,
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_FAILURE,
  FETCH_PROFILE_REQUEST,
  FETCH_PROFILE_SUCCESS,
  FETCH_PROFILE_FAILURE
} from '../types';

// Demo mode - bypass authentication for testing
const DEMO_MODE = false; // Set to false when backend is ready

// Demo user data
const DEMO_USER = {
  id: 'demo-user-1',
  username: 'demo',
  email: 'demo@example.com',
  name: 'Demo User',
  avatar: null,
  createdAt: new Date().toISOString()
};

const DEMO_TOKEN = 'demo-token-12345';

// Lưu token vào AsyncStorage
const saveToken = async (token) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  } catch (error) {
    console.error('Error saving token:', error);
  }
};

// Lưu thông tin user vào AsyncStorage
const saveUserData = async (userData) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
  } catch (error) {
    console.error('Error saving user data:', error);
  }
};

// Xóa token khỏi AsyncStorage
const removeToken = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
  } catch (error) {
    console.error('Error removing token:', error);
  }
};

// Action đăng nhập - cập nhật để sử dụng username
export const login = (username, password) => async (dispatch) => {
  dispatch({ type: LOGIN_REQUEST });
  
  try {
    // Demo mode - bypass authentication
    if (DEMO_MODE) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Accept any username/password for demo
      if (username && password) {
        await saveToken(DEMO_TOKEN);
        await saveUserData(DEMO_USER);
        
        dispatch({
          type: LOGIN_SUCCESS,
          payload: DEMO_USER,
        });
        
        return { token: DEMO_TOKEN, user: DEMO_USER };
      } else {
        throw new Error('Vui lòng nhập tên đăng nhập và mật khẩu');
      }
    }
    
    // Real API call when not in demo mode
    const data = await authApi.login(username, password);
    
    // Lưu token và thông tin user
    if (data.token) {
      await saveToken(data.token);
      await saveUserData(data.user);
    }
    
    dispatch({
      type: LOGIN_SUCCESS,
      payload: data.user,
    });
    
    return data;
  } catch (error) {
    dispatch({
      type: LOGIN_FAILURE,
      payload: error.toString(),
    });
    throw error;
  }
};

// Action đăng ký
export const register = (userData) => async (dispatch) => {
  dispatch({ type: REGISTER_REQUEST });
  
  try {
    const data = await authApi.register(userData);
    
    // Nếu đăng ký thành công và có token, lưu token và cập nhật state
    if (data.token) {
      await saveToken(data.token);
      await saveUserData(data.user);
      dispatch({
        type: LOGIN_SUCCESS,
        payload: data.user,
      });
    } else {
      dispatch({ type: REGISTER_SUCCESS });
    }
    
    return data;
  } catch (error) {
    dispatch({
      type: REGISTER_FAILURE,
      payload: error.toString(),
    });
    throw error;
  }
};

// Action đăng xuất
export const logout = () => async (dispatch) => {
  await removeToken();
  dispatch({ type: LOGOUT });
};

// Action lấy thông tin người dùng
export const fetchUserProfile = () => async (dispatch) => {
  dispatch({ type: FETCH_PROFILE_REQUEST });
  
  try {
    const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    
    if (!token) {
      throw new Error('Không tìm thấy token xác thực');
    }
    
    const data = await authApi.getUserProfile(token);
    
    // Cập nhật thông tin user trong storage
    await saveUserData(data);
    
    dispatch({
      type: FETCH_PROFILE_SUCCESS,
      payload: data,
    });
    return data;
  } catch (error) {
    dispatch({
      type: FETCH_PROFILE_FAILURE,
      payload: error.toString(),
    });
    throw error;
  }
};

// Action kiểm tra trạng thái xác thực
export const checkAuthStatus = () => async (dispatch) => {
  dispatch({ type: LOGIN_REQUEST });
  
  try {
    const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    
    if (!token) {
      dispatch({ type: LOGOUT });
      return false;
    }
    
    // Demo mode - bypass auth check
    if (DEMO_MODE && token === DEMO_TOKEN) {
      const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
      const user = userData ? JSON.parse(userData) : DEMO_USER;
      
      dispatch({
        type: LOGIN_SUCCESS,
        payload: user,
      });
      return true;
    }
    
    // Real API call when not in demo mode
    const data = await authApi.checkAuthStatus(token);
    
    // Cập nhật thông tin user trong storage
    await saveUserData(data.user);
    
    dispatch({
      type: LOGIN_SUCCESS,
      payload: data.user,
    });
    return true;
  } catch (error) {
    await removeToken();
    dispatch({ type: LOGOUT });
    return false;
  }
};

// Action đổi mật khẩu
export const changePassword = (currentPassword, newPassword) => async (dispatch) => {
  try {
    const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    
    if (!token) {
      throw new Error('Không tìm thấy token xác thực');
    }
    
    const data = await authApi.changePassword(token, currentPassword, newPassword);
    return data;
  } catch (error) {
    throw error;
  }
};

// Action cập nhật profile
export const updateProfile = (profileData) => async (dispatch) => {
  try {
    const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    
    if (!token) {
      throw new Error('Không tìm thấy token xác thực');
    }
    
    const data = await authApi.updateProfile(token, profileData);
    
    // Cập nhật thông tin user trong storage và Redux state
    await saveUserData(data.user);
    
    dispatch({
      type: LOGIN_SUCCESS, // Sử dụng LOGIN_SUCCESS để cập nhật user state
      payload: data.user,
    });
    
    return data;
  } catch (error) {
    throw error;
  }
};

// Action đăng ký admin
export const registerAdmin = (userData) => async (dispatch) => {
  dispatch({ type: REGISTER_REQUEST });
  
  try {
    const data = await authApi.registerAdmin(userData);
    dispatch({ type: REGISTER_SUCCESS });
    return data;
  } catch (error) {
    dispatch({
      type: REGISTER_FAILURE,
      payload: error.toString(),
    });
    throw error;
  }
}; 