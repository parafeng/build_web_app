import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Platform,
  StatusBar,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { t, setLanguage } from '../../utils/i18n';
import { useTheme } from '../../utils/ThemeContext';

// Danh sách ngôn ngữ
const LANGUAGES = [
  { id: 'vi', name: 'Tiếng Việt' },
  { id: 'en', name: 'English' }
];

// Mặc định cài đặt
const DEFAULT_SETTINGS = {
  language: 'vi',
  notifications: {
    general: true,
    promo: true,
    updates: true,
  },
  darkMode: false,
  sound: true,
  vibration: true,
  autoSave: true,
  dataUsage: 'balanced' // 'low', 'balanced', 'high'
};

const AppSettingsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { theme, isDark, setDarkMode } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [selectedDataUsage, setSelectedDataUsage] = useState<string>(DEFAULT_SETTINGS.dataUsage);

  // Tải cài đặt từ AsyncStorage
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedSettings = await AsyncStorage.getItem('app_settings');
        if (savedSettings) {
          const parsedSettings = JSON.parse(savedSettings);
          setSettings(parsedSettings);
          setSelectedDataUsage(parsedSettings.dataUsage);
        }
      } catch (error) {
        console.error('Lỗi khi tải cài đặt:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  // Cập nhật UI khi dark mode thay đổi
  useEffect(() => {
    setSettings(prev => ({ ...prev, darkMode: isDark }));
  }, [isDark]);

  // Lưu cài đặt
  const saveSettings = async () => {
    setIsSaving(true);
    try {
      await AsyncStorage.setItem('app_settings', JSON.stringify(settings));
      // Cập nhật ngôn ngữ và theme của ứng dụng khi lưu cài đặt
      setLanguage(settings.language);
      
      setTimeout(() => {
        setIsSaving(false);
        Alert.alert(t('success'), t('settings_saved'));
      }, 800);
    } catch (error) {
      console.error('Lỗi khi lưu cài đặt:', error);
      setIsSaving(false);
      Alert.alert(t('error'), t('error_saving_settings'));
    }
  };

  // Cập nhật ngôn ngữ
  const handleLanguageChange = (languageId: string) => {
    setSettings(prev => ({
      ...prev,
      language: languageId
    }));
  };

  // Cập nhật cài đặt thông báo
  const handleNotificationToggle = (type: 'general' | 'promo' | 'updates') => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: !prev.notifications[type]
      }
    }));
  };

  // Cập nhật chế độ tối
  const handleDarkModeToggle = () => {
    const newDarkMode = !settings.darkMode;
    setSettings(prev => ({
      ...prev,
      darkMode: newDarkMode
    }));
    // Cập nhật theme context
    setDarkMode(newDarkMode);
  };

  // Cập nhật âm thanh
  const handleSoundToggle = () => {
    setSettings(prev => ({
      ...prev,
      sound: !prev.sound
    }));
  };

  // Cập nhật rung
  const handleVibrationToggle = () => {
    setSettings(prev => ({
      ...prev,
      vibration: !prev.vibration
    }));
  };

  // Cập nhật tự động lưu
  const handleAutoSaveToggle = () => {
    setSettings(prev => ({
      ...prev,
      autoSave: !prev.autoSave
    }));
  };

  // Cập nhật mức sử dụng dữ liệu
  const handleDataUsageChange = (level: string) => {
    setSelectedDataUsage(level);
    setSettings(prev => ({
      ...prev,
      dataUsage: level
    }));
  };

  // Khôi phục cài đặt mặc định
  const handleResetSettings = () => {
    Alert.alert(
      t('reset_settings'),
      t('reset_settings_confirm'),
      [
        {
          text: t('cancel'),
          style: 'cancel'
        },
        {
          text: t('yes'),
          onPress: () => {
            setSettings(DEFAULT_SETTINGS);
            setSelectedDataUsage(DEFAULT_SETTINGS.dataUsage);
            setDarkMode(DEFAULT_SETTINGS.darkMode);
          }
        }
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={[styles.loadingText, { color: theme.text }]}>{t('loading')}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar backgroundColor={theme.headerBackground} barStyle="light-content" />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.headerBackground }]}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('app_settings')}</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView 
        style={[styles.scrollContent, { backgroundColor: theme.background }]}
        contentContainerStyle={styles.scrollContentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Ngôn ngữ */}
        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('language')}</Text>
          <View style={styles.optionsContainer}>
            {LANGUAGES.map(language => (
              <TouchableOpacity
                key={language.id}
                style={[
                  styles.languageOption,
                  settings.language === language.id && styles.selectedLanguageOption,
                  { backgroundColor: settings.language === language.id ? theme.primary : theme.inputBackground }
                ]}
                onPress={() => handleLanguageChange(language.id)}
              >
                <Text
                  style={[
                    styles.languageText,
                    settings.language === language.id && styles.selectedLanguageText,
                    { color: settings.language === language.id ? '#FFFFFF' : theme.text }
                  ]}
                >
                  {language.name}
                </Text>
                {settings.language === language.id && (
                  <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Thông báo */}
        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('notification_settings')}</Text>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingTitle, { color: theme.text }]}>{t('general_notifications')}</Text>
              <Text style={[styles.settingDescription, { color: theme.secondaryText }]}>{t('general_notifications_desc')}</Text>
            </View>
            <Switch
              value={settings.notifications.general}
              onValueChange={() => handleNotificationToggle('general')}
              trackColor={{ false: '#D1D1D6', true: theme.secondary }}
              thumbColor={Platform.OS === 'ios' ? '#FFFFFF' : settings.notifications.general ? '#FFFFFF' : '#F4F3F4'}
              ios_backgroundColor="#D1D1D6"
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingTitle, { color: theme.text }]}>{t('promo_notifications')}</Text>
              <Text style={[styles.settingDescription, { color: theme.secondaryText }]}>{t('promo_notifications_desc')}</Text>
            </View>
            <Switch
              value={settings.notifications.promo}
              onValueChange={() => handleNotificationToggle('promo')}
              trackColor={{ false: '#D1D1D6', true: theme.secondary }}
              thumbColor={Platform.OS === 'ios' ? '#FFFFFF' : settings.notifications.promo ? '#FFFFFF' : '#F4F3F4'}
              ios_backgroundColor="#D1D1D6"
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingTitle, { color: theme.text }]}>{t('update_notifications')}</Text>
              <Text style={[styles.settingDescription, { color: theme.secondaryText }]}>{t('update_notifications_desc')}</Text>
            </View>
            <Switch
              value={settings.notifications.updates}
              onValueChange={() => handleNotificationToggle('updates')}
              trackColor={{ false: '#D1D1D6', true: theme.secondary }}
              thumbColor={Platform.OS === 'ios' ? '#FFFFFF' : settings.notifications.updates ? '#FFFFFF' : '#F4F3F4'}
              ios_backgroundColor="#D1D1D6"
            />
          </View>
        </View>

        {/* Giao diện */}
        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('dark_mode')}</Text>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingTitle, { color: theme.text }]}>{t('dark_mode')}</Text>
              <Text style={[styles.settingDescription, { color: theme.secondaryText }]}>{t('dark_mode_desc')}</Text>
            </View>
            <Switch
              value={settings.darkMode}
              onValueChange={handleDarkModeToggle}
              trackColor={{ false: '#D1D1D6', true: theme.primary }}
              thumbColor={Platform.OS === 'ios' ? '#FFFFFF' : settings.darkMode ? '#FFFFFF' : '#F4F3F4'}
              ios_backgroundColor="#D1D1D6"
            />
          </View>
        </View>

        {/* Âm thanh và phản hồi */}
        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('sound')}</Text>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingTitle, { color: theme.text }]}>{t('sound')}</Text>
              <Text style={[styles.settingDescription, { color: theme.secondaryText }]}>{t('sound_desc')}</Text>
            </View>
            <Switch
              value={settings.sound}
              onValueChange={handleSoundToggle}
              trackColor={{ false: '#D1D1D6', true: theme.primary }}
              thumbColor={Platform.OS === 'ios' ? '#FFFFFF' : settings.sound ? '#FFFFFF' : '#F4F3F4'}
              ios_backgroundColor="#D1D1D6"
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingTitle, { color: theme.text }]}>{t('vibration')}</Text>
              <Text style={[styles.settingDescription, { color: theme.secondaryText }]}>{t('vibration_desc')}</Text>
            </View>
            <Switch
              value={settings.vibration}
              onValueChange={handleVibrationToggle}
              trackColor={{ false: '#D1D1D6', true: theme.primary }}
              thumbColor={Platform.OS === 'ios' ? '#FFFFFF' : settings.vibration ? '#FFFFFF' : '#F4F3F4'}
              ios_backgroundColor="#D1D1D6"
            />
          </View>
        </View>

        {/* Dữ liệu */}
        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('data_usage')}</Text>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingTitle, { color: theme.text }]}>{t('auto_save')}</Text>
              <Text style={[styles.settingDescription, { color: theme.secondaryText }]}>{t('auto_save_desc')}</Text>
            </View>
            <Switch
              value={settings.autoSave}
              onValueChange={handleAutoSaveToggle}
              trackColor={{ false: '#D1D1D6', true: theme.primary }}
              thumbColor={Platform.OS === 'ios' ? '#FFFFFF' : settings.autoSave ? '#FFFFFF' : '#F4F3F4'}
              ios_backgroundColor="#D1D1D6"
            />
          </View>
          
          <View style={styles.dataUsageContainer}>
            <Text style={[styles.settingTitle, { color: theme.text }]}>{t('data_usage')}</Text>
            <Text style={[styles.settingDescription, { color: theme.secondaryText }]}>{t('data_usage_desc')}</Text>
            
            <View style={styles.dataUsageOptions}>
              <TouchableOpacity
                style={[
                  styles.dataOption,
                  selectedDataUsage === 'low' && styles.selectedDataOption,
                  { 
                    backgroundColor: selectedDataUsage === 'low' ? theme.primary : theme.inputBackground 
                  }
                ]}
                onPress={() => handleDataUsageChange('low')}
              >
                <Text style={[
                  styles.dataOptionText,
                  selectedDataUsage === 'low' && styles.selectedDataOptionText,
                  { color: selectedDataUsage === 'low' ? '#FFFFFF' : theme.text }
                ]}>
                  {t('low')}
                </Text>
                <Text style={[
                  styles.dataOptionDescription,
                  selectedDataUsage === 'low' && styles.selectedDataOptionText,
                  { color: selectedDataUsage === 'low' ? '#FFFFFF' : theme.secondaryText }
                ]}>
                  {t('low_desc')}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.dataOption,
                  selectedDataUsage === 'balanced' && styles.selectedDataOption,
                  { 
                    backgroundColor: selectedDataUsage === 'balanced' ? theme.primary : theme.inputBackground 
                  }
                ]}
                onPress={() => handleDataUsageChange('balanced')}
              >
                <Text style={[
                  styles.dataOptionText,
                  selectedDataUsage === 'balanced' && styles.selectedDataOptionText,
                  { color: selectedDataUsage === 'balanced' ? '#FFFFFF' : theme.text }
                ]}>
                  {t('balanced')}
                </Text>
                <Text style={[
                  styles.dataOptionDescription,
                  selectedDataUsage === 'balanced' && styles.selectedDataOptionText,
                  { color: selectedDataUsage === 'balanced' ? '#FFFFFF' : theme.secondaryText }
                ]}>
                  {t('balanced_desc')}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.dataOption,
                  selectedDataUsage === 'high' && styles.selectedDataOption,
                  { 
                    backgroundColor: selectedDataUsage === 'high' ? theme.primary : theme.inputBackground 
                  }
                ]}
                onPress={() => handleDataUsageChange('high')}
              >
                <Text style={[
                  styles.dataOptionText,
                  selectedDataUsage === 'high' && styles.selectedDataOptionText,
                  { color: selectedDataUsage === 'high' ? '#FFFFFF' : theme.text }
                ]}>
                  {t('high')}
                </Text>
                <Text style={[
                  styles.dataOptionDescription,
                  selectedDataUsage === 'high' && styles.selectedDataOptionText,
                  { color: selectedDataUsage === 'high' ? '#FFFFFF' : theme.secondaryText }
                ]}>
                  {t('high_desc')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Hành động */}
        <View style={[styles.actionSection, { backgroundColor: theme.background }]}>
          <TouchableOpacity
            style={[styles.resetButton, { borderColor: theme.border }]}
            onPress={handleResetSettings}
          >
            <Ionicons name="refresh-circle-outline" size={20} color={theme.error} />
            <Text style={[styles.resetButtonText, { color: theme.error }]}>{t('reset_settings')}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.saveButton, 
              isSaving && styles.disabledButton,
              { backgroundColor: theme.primary }
            ]}
            onPress={saveSettings}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <Ionicons name="save-outline" size={20} color="#FFFFFF" />
                <Text style={styles.saveButtonText}>{t('save_settings')}</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
        
        {/* Khoảng cách cuối trang */}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#2196F3',
  },
  header: {
    backgroundColor: '#2196F3',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight ? StatusBar.currentHeight + 10 : 25 : 15,
    paddingBottom: 15,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  headerRight: {
    width: 40,
  },
  scrollContent: {
    flex: 1,
  },
  scrollContentContainer: {
    padding: 16,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#263238',
    marginBottom: 16,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#F5F7FA',
    marginRight: 10,
    marginBottom: 10,
    minWidth: 120,
  },
  selectedLanguageOption: {
    backgroundColor: '#2196F3',
  },
  languageText: {
    fontSize: 16,
    color: '#263238',
  },
  selectedLanguageText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F7FA',
  },
  settingInfo: {
    flex: 1,
    paddingRight: 10,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#263238',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#78909C',
  },
  dataUsageContainer: {
    marginTop: 16,
  },
  dataUsageOptions: {
    flexDirection: 'row',
    marginTop: 12,
  },
  dataOption: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#F5F7FA',
    marginHorizontal: 4,
  },
  selectedDataOption: {
    backgroundColor: '#2196F3',
  },
  dataOptionText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#263238',
    marginBottom: 4,
  },
  dataOptionDescription: {
    fontSize: 12,
    color: '#78909C',
    textAlign: 'center',
  },
  selectedDataOptionText: {
    color: '#FFFFFF',
  },
  actionSection: {
    marginTop: 10,
    marginBottom: 10,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  resetButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#F44336',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2196F3',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#2196F3',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  disabledButton: {
    backgroundColor: '#90CAF9',
  },
  saveButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  bottomPadding: {
    height: 30,
  },
});

export default AppSettingsScreen; 