import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Theme colors
export const lightTheme = {
  background: '#FFFFFF',
  text: '#1F2937',
  secondaryText: '#6B7280',
  primary: '#1e90ff',
  secondary: '#4CAF50',
  card: '#FFFFFF',
  headerBackground: '#1e90ff',
  statusBar: 'light-content',
  tabBar: '#FFFFFF',
  tabBarInactive: '#8E8E93',
  border: '#E5E7EB',
  shadow: '#000000',
  error: '#EF4444',
  success: '#10B981',
  warning: '#F59E0B',
  info: '#3B82F6',
  searchBackground: '#FFFFFF',
  inputBackground: '#FFFFFF',
  cardBackground: '#FFFFFF',
  divider: '#E5E7EB',
};

export const darkTheme = {
  background: '#121212',
  text: '#FFFFFF',
  secondaryText: '#9CA3AF',
  primary: '#3B82F6',
  secondary: '#10B981',
  card: '#1F2937',
  headerBackground: '#1F2937',
  statusBar: 'light-content',
  tabBar: '#1F2937',
  tabBarInactive: '#6B7280',
  border: '#374151',
  shadow: '#000000',
  error: '#EF4444',
  success: '#10B981',
  warning: '#F59E0B',
  info: '#3B82F6',
  searchBackground: '#374151',
  inputBackground: '#374151',
  cardBackground: '#1F2937',
  divider: '#374151',
};

type ThemeType = typeof lightTheme;

interface ThemeContextType {
  theme: ThemeType;
  isDark: boolean;
  toggleTheme: () => void;
  setDarkMode: (isDark: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: lightTheme,
  isDark: false,
  toggleTheme: () => {},
  setDarkMode: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem('app_settings');
      if (savedSettings) {
        const { darkMode } = JSON.parse(savedSettings);
        setIsDark(darkMode);
      } else {
        // Nếu không có cài đặt, sử dụng theme hệ thống
        setIsDark(systemColorScheme === 'dark');
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
    }
  };

  const saveThemePreference = async (isDarkMode: boolean) => {
    try {
      const savedSettings = await AsyncStorage.getItem('app_settings');
      const settings = savedSettings ? JSON.parse(savedSettings) : {};
      settings.darkMode = isDarkMode;
      await AsyncStorage.setItem('app_settings', JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
    saveThemePreference(!isDark);
  };

  const setDarkMode = (isDarkMode: boolean) => {
    setIsDark(isDarkMode);
    saveThemePreference(isDarkMode);
  };

  return (
    <ThemeContext.Provider 
      value={{
        theme: isDark ? darkTheme : lightTheme,
        isDark,
        toggleTheme,
        setDarkMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

export default ThemeContext; 