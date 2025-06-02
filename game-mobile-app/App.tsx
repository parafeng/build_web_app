import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import MainNavigator from './src/navigation/MainNavigator';
import store from './src/redux/store';
import { setupLanguage } from './src/utils/i18n';
import { ThemeProvider, useTheme } from './src/utils/ThemeContext';

// Wrapper component để sử dụng theme cho StatusBar
const Main: React.FC = () => {
  const { theme, isDark } = useTheme();
  
  // Thiết lập ngôn ngữ khi ứng dụng khởi động
  useEffect(() => {
    const initLanguage = async () => {
      await setupLanguage();
    };
    
    initLanguage();
  }, []);

  return (
    <>
      <StatusBar
        translucent={true}
        backgroundColor="transparent"
        barStyle={isDark ? "light-content" : "dark-content"}
      />
      <NavigationContainer>
        <MainNavigator />
      </NavigationContainer>
    </>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <ThemeProvider>
          <Main />
        </ThemeProvider>
      </SafeAreaProvider>
    </Provider>
  );
};

export default App; 