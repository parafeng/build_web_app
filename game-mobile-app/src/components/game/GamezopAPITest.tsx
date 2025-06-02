import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import gamezopService from '../../api/gamezopService';
import { t } from '../../utils/i18n';

interface GamezopAPITestProps {
  onClose: () => void;
}

const GamezopAPITest: React.FC<GamezopAPITestProps> = ({ onClose }) => {
  const [loading, setLoading] = useState(false);
  const [apiResult, setApiResult] = useState<any>(null);
  const [realGames, setRealGames] = useState<any[]>([]);
  const [currentMode, setCurrentMode] = useState(gamezopService.isDemoMode());

  const testAPI = async () => {
    setLoading(true);
    try {
      const result = await gamezopService.testGamezopAPI();
      setApiResult(result);
      
      if (result.success) {
        // Temporarily disable demo mode to get real data
        const wasDemo = gamezopService.isDemoMode();
        gamezopService.setDemoMode(false);
        
        const games = await gamezopService.getGames(undefined, 5);
        setRealGames(games);
        
        // Restore demo mode
        gamezopService.setDemoMode(wasDemo);
        
        Alert.alert(
          t('api_test_success'),
          t('found_games_with_images').replace('{count}', result.gamesCount.toString()),
          [{ text: t('ok') }]
        );
      } else {
        Alert.alert(
          t('api_test_failed'),
          result.message,
          [{ text: t('ok') }]
        );
      }
    } catch (error) {
      Alert.alert(t('error'), t('test_failed').replace('{error}', error.message));
    } finally {
      setLoading(false);
    }
  };

  const toggleDemoMode = () => {
    const newMode = !currentMode;
    gamezopService.setDemoMode(newMode);
    setCurrentMode(newMode);
    
    Alert.alert(
      t('demo_mode_changed'),
      t('demo_mode_status').replace('{status}', newMode ? t('enabled') : t('disabled')),
      [{ text: t('ok') }]
    );
  };

  const loadRealGames = async () => {
    setLoading(true);
    try {
      // Temporarily disable demo mode
      const wasDemo = gamezopService.isDemoMode();
      gamezopService.setDemoMode(false);
      
      const games = await gamezopService.getGames(undefined, 10);
      setRealGames(games);
      
      // Restore demo mode
      gamezopService.setDemoMode(wasDemo);
      
      Alert.alert(
        t('real_games_loaded'),
        t('loaded_games_with_images').replace('{count}', games.length.toString()),
        [{ text: t('ok') }]
      );
    } catch (error) {
      Alert.alert(t('error'), t('failed_load_real_games').replace('{error}', error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('gamezop_api_test')}</Text>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Ionicons name="close" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Current Status */}
        <View style={styles.statusCard}>
          <Text style={styles.cardTitle}>{t('current_status')}</Text>
          <Text style={styles.statusText}>
            {t('demo_mode')}: {currentMode ? '🟡 ' + t('enabled') : '🟢 ' + t('disabled')}
          </Text>
          <Text style={styles.statusText}>
            {t('partner_id')}: {gamezopService['config']?.partnerId || 'zv1y2i8p'}
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.testButton]} 
            onPress={testAPI}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <>
                <Ionicons name="wifi" size={20} color="#ffffff" />
                <Text style={styles.buttonText}>{t('test_api_connection')}</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.toggleButton]} 
            onPress={toggleDemoMode}
          >
            <Ionicons name="swap-horizontal" size={20} color="#ffffff" />
            <Text style={styles.buttonText}>{t('toggle_demo_mode')}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.loadButton]} 
            onPress={loadRealGames}
            disabled={loading}
          >
            <Ionicons name="download" size={20} color="#ffffff" />
            <Text style={styles.buttonText}>{t('load_real_games')}</Text>
          </TouchableOpacity>
        </View>

        {/* API Result */}
        {apiResult && (
          <View style={styles.resultCard}>
            <Text style={styles.cardTitle}>{t('api_test_result')}</Text>
            <Text style={[
              styles.resultText,
              { color: apiResult.success ? '#10b981' : '#ef4444' }
            ]}>
              {apiResult.message}
            </Text>
            {apiResult.success && (
              <Text style={styles.resultDetail}>
                {t('games_available')}: {apiResult.gamesCount}
              </Text>
            )}
          </View>
        )}

        {/* Real Games Preview */}
        {realGames.length > 0 && (
          <View style={styles.gamesCard}>
            <Text style={styles.cardTitle}>{t('real_games_from_api')}</Text>
            <Text style={styles.gamesSubtitle}>
              {realGames.length} {t('games_loaded_with_images')}
            </Text>
            
            {realGames.map((game, index) => (
              <View key={game.id} style={styles.gameItem}>
                <Image 
                  source={game.thumbnail ? { uri: game.thumbnail } : require('../../assets/images/games/thumbnails/default_game.png')}
                  style={styles.gameImage}
                  onError={() => console.log('Image load error for:', game.name)}
                />
                <View style={styles.gameInfo}>
                  <Text style={styles.gameName}>{game.name}</Text>
                  <Text style={styles.gameCategory}>{game.category}</Text>
                  <Text style={styles.gameId}>ID: {game.id}</Text>
                  {game.screenshots && game.screenshots.length > 0 && (
                    <Text style={styles.gameScreenshots}>
                      📸 {game.screenshots.length} {t('screenshots')}
                    </Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Instructions */}
        <View style={styles.instructionsCard}>
          <Text style={styles.cardTitle}>{t('instructions')}</Text>
          <Text style={styles.instructionText}>
            1. <Text style={styles.bold}>{t('test_api_connection')}</Text>: {t('check_api_accessible')}
          </Text>
          <Text style={styles.instructionText}>
            2. <Text style={styles.bold}>{t('toggle_demo_mode')}</Text>: {t('switch_demo_real')}
          </Text>
          <Text style={styles.instructionText}>
            3. <Text style={styles.bold}>{t('load_real_games')}</Text>: {t('fetch_games_real_images')}
          </Text>
          <Text style={styles.instructionText}>
            4. {t('api_works_disable_demo')}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#1f2937',
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  statusCard: {
    backgroundColor: '#1f2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 12,
  },
  statusText: {
    fontSize: 14,
    color: '#d1d5db',
    marginBottom: 4,
  },
  buttonContainer: {
    marginBottom: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  testButton: {
    backgroundColor: '#3b82f6',
  },
  toggleButton: {
    backgroundColor: '#8b5cf6',
  },
  loadButton: {
    backgroundColor: '#10b981',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  resultCard: {
    backgroundColor: '#1f2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  resultText: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  resultDetail: {
    fontSize: 12,
    color: '#9ca3af',
  },
  gamesCard: {
    backgroundColor: '#1f2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  gamesSubtitle: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 16,
  },
  gameItem: {
    flexDirection: 'row',
    backgroundColor: '#374151',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  gameImage: {
    width: 60,
    height: 40,
    borderRadius: 4,
    backgroundColor: '#4b5563',
  },
  gameInfo: {
    flex: 1,
    marginLeft: 12,
  },
  gameName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 2,
  },
  gameCategory: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 2,
  },
  gameId: {
    fontSize: 10,
    color: '#6b7280',
    marginBottom: 2,
  },
  gameScreenshots: {
    fontSize: 10,
    color: '#10b981',
  },
  instructionsCard: {
    backgroundColor: '#1f2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
  },
  instructionText: {
    fontSize: 14,
    color: '#d1d5db',
    marginBottom: 8,
    lineHeight: 20,
  },
  bold: {
    fontWeight: '600',
    color: '#ffffff',
  },
});

export default GamezopAPITest; 