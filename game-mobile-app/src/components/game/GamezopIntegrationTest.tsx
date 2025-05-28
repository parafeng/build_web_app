import React, { useState, useEffect } from 'react';
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
  Switch,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import gamezopService from '../../api/gamezopService';
import GamezopEmbed from './GamezopEmbed';
import GamezopErrorHandler from './GamezopErrorHandler';

const { width } = Dimensions.get('window');

interface GamezopIntegrationTestProps {
  onClose: () => void;
}

const GamezopIntegrationTest: React.FC<GamezopIntegrationTestProps> = ({ onClose }) => {
  const [loading, setLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState<any>(null);
  const [demoMode, setDemoMode] = useState(gamezopService.isDemoMode());
  const [games, setGames] = useState<any[]>([]);
  const [selectedGame, setSelectedGame] = useState<any>(null);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Test API connection
      const status = await gamezopService.testGamezopAPI();
      setApiStatus(status);

      // Load games based on current mode
      await loadGames();
    } catch (error) {
      console.error('Error loading initial data:', error);
      setError({
        message: error.message,
        type: 'unknown'
      });
    } finally {
      setLoading(false);
    }
  };

  const loadGames = async () => {
    try {
      const gamesList = await gamezopService.getGames(
        selectedCategory === 'All' ? undefined : selectedCategory,
        20
      );
      setGames(gamesList);

      // Extract unique categories
      const uniqueCategories = ['All', ...new Set(gamesList.map(game => game.category))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error loading games:', error);
      Alert.alert('Lỗi', 'Không thể tải danh sách games');
    }
  };

  const toggleDemoMode = async () => {
    const newMode = !demoMode;
    gamezopService.setDemoMode(newMode);
    setDemoMode(newMode);
    setError(null); // Clear any previous errors
    
    // Reload games with new mode
    setLoading(true);
    await loadGames();
    setLoading(false);

    Alert.alert(
      'Demo Mode Changed',
      `Demo mode: ${newMode ? 'ENABLED (Placeholder images)' : 'DISABLED (Real Gamezop images)'}`,
      [{ text: 'OK' }]
    );
  };

  const testAPIConnection = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await gamezopService.testGamezopAPI();
      setApiStatus(result);
      
      if (!result.success) {
        // Determine error type based on message
        let errorType = 'unknown';
        if (result.message.includes('401') || result.message.includes('Authentication')) {
          errorType = 'auth';
        } else if (result.message.includes('Network') || result.message.includes('connection')) {
          errorType = 'network';
        } else if (result.message.includes('API') || result.message.includes('server')) {
          errorType = 'api';
        }
        
        setError({
          message: result.message,
          code: result.message.includes('401') ? 401 : undefined,
          type: errorType
        });
      }
      
      Alert.alert(
        result.success ? 'API Test Success!' : 'API Test Failed',
        result.message,
        [{ text: 'OK' }]
      );
    } catch (error) {
      setError({
        message: error.message,
        type: 'network'
      });
      Alert.alert('Error', `Test failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const playGame = (game: any) => {
    setSelectedGame(game);
  };

  const closeGame = () => {
    setSelectedGame(null);
  };

  const onCategoryChange = async (category: string) => {
    setSelectedCategory(category);
    setLoading(true);
    
    try {
      const gamesList = await gamezopService.getGames(
        category === 'All' ? undefined : category,
        20
      );
      setGames(gamesList);
    } catch (error) {
      console.error('Error filtering games:', error);
    } finally {
      setLoading(false);
    }
  };

  // Show game fullscreen
  if (selectedGame) {
    return (
      <GamezopEmbed
        gameUrl={selectedGame.embedUrl || selectedGame.gameUrl}
        gameName={selectedGame.name}
        onClose={closeGame}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Gamezop Integration Test</Text>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Ionicons name="close" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Error Handler */}
        {error && !loading && (
          <GamezopErrorHandler
            error={error}
            onRetry={testAPIConnection}
            onFallback={() => {
              gamezopService.setDemoMode(true);
              setDemoMode(true);
              setError(null);
              loadGames();
            }}
          />
        )}

        {/* API Status Card */}
        <View style={styles.statusCard}>
          <Text style={styles.cardTitle}>API Status</Text>
          {apiStatus ? (
            <View>
              <Text style={[
                styles.statusText,
                { color: apiStatus.success ? '#10b981' : '#ef4444' }
              ]}>
                {apiStatus.success ? '✅ Connected' : '❌ Failed'}
              </Text>
              <Text style={styles.statusDetail}>
                {apiStatus.message}
              </Text>
              {apiStatus.success && (
                <Text style={styles.statusDetail}>
                  Available games: {apiStatus.gamesCount}
                </Text>
              )}
            </View>
          ) : (
            <Text style={styles.statusText}>Testing...</Text>
          )}
          
          <TouchableOpacity 
            style={styles.testButton} 
            onPress={testAPIConnection}
            disabled={loading}
          >
            <Ionicons name="refresh" size={16} color="#ffffff" />
            <Text style={styles.testButtonText}>Test Again</Text>
          </TouchableOpacity>
        </View>

        {/* Demo Mode Toggle */}
        <View style={styles.toggleCard}>
          <View style={styles.toggleHeader}>
            <Text style={styles.cardTitle}>Demo Mode (Local Images)</Text>
            <Switch
              value={demoMode}
              onValueChange={toggleDemoMode}
              trackColor={{ false: '#374151', true: '#6366f1' }}
              thumbColor={demoMode ? '#ffffff' : '#9ca3af'}
            />
          </View>
          <Text style={styles.toggleDescription}>
            {demoMode 
              ? '🟡 Using local images from assets folder (10 demo games)'
              : '🔴 API mode disabled - No Gamezop account'
            }
          </Text>
          <Text style={styles.infoNote}>
            💡 Thêm ảnh vào src/assets/images/games/thumbnails/ để hiển thị ảnh thật
          </Text>
        </View>

        {/* Category Filter */}
        <View style={styles.categoryCard}>
          <Text style={styles.cardTitle}>Categories</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.categoryList}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryButton,
                    selectedCategory === category && styles.categoryButtonActive
                  ]}
                  onPress={() => onCategoryChange(category)}
                >
                  <Text style={[
                    styles.categoryButtonText,
                    selectedCategory === category && styles.categoryButtonTextActive
                  ]}>
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Games List */}
        <View style={styles.gamesCard}>
          <Text style={styles.cardTitle}>
            Games ({games.length})
          </Text>
          <Text style={styles.gamesSubtitle}>
            {demoMode ? 'Demo games with placeholder images' : 'Real games from Gamezop API'}
          </Text>
          
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#6366f1" />
              <Text style={styles.loadingText}>Loading games...</Text>
            </View>
          ) : (
            <View style={styles.gamesList}>
              {games.map((game, index) => (
                <TouchableOpacity
                  key={game.id}
                  style={styles.gameItem}
                  onPress={() => playGame(game)}
                >
                  <Image 
                    source={{ uri: game.thumbnail }} 
                    style={styles.gameImage}
                    onError={() => console.log('Image load error for:', game.name)}
                  />
                  <View style={styles.gameInfo}>
                    <Text style={styles.gameName} numberOfLines={1}>
                      {game.name}
                    </Text>
                    <Text style={styles.gameCategory}>{game.category}</Text>
                    <Text style={styles.gameStats}>
                      ⏱️ {game.averageSession} • 👥 {game.playCount}
                    </Text>
                    <Text style={styles.gameId}>ID: {game.id}</Text>
                  </View>
                  <View style={styles.playButtonContainer}>
                    <Ionicons name="play-circle" size={32} color="#6366f1" />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Integration Info */}
        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>Local Images Setup</Text>
          <Text style={styles.infoText}>
            • Hệ thống sử dụng ảnh local từ assets folder
          </Text>
          <Text style={styles.infoText}>
            • Thêm ảnh vào: src/assets/images/games/thumbnails/
          </Text>
          <Text style={styles.infoText}>
            • Mở game-images-preview.html để download placeholder images
          </Text>
          <Text style={styles.infoText}>
            • Games mở trong fullscreen WebView
          </Text>
          <Text style={styles.infoText}>
            • Safe fallback khi ảnh không tồn tại
          </Text>
          <Text style={styles.infoText}>
            • Sẵn sàng upgrade lên Gamezop API sau này
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
    marginBottom: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  statusDetail: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 2,
  },
  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6366f1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  testButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  toggleCard: {
    backgroundColor: '#1f2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  toggleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  toggleDescription: {
    fontSize: 12,
    color: '#9ca3af',
  },
  categoryCard: {
    backgroundColor: '#1f2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  categoryList: {
    flexDirection: 'row',
  },
  categoryButton: {
    backgroundColor: '#374151',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
  },
  categoryButtonActive: {
    backgroundColor: '#6366f1',
  },
  categoryButtonText: {
    color: '#9ca3af',
    fontSize: 12,
    fontWeight: '500',
  },
  categoryButtonTextActive: {
    color: '#ffffff',
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
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  loadingText: {
    color: '#9ca3af',
    marginTop: 8,
  },
  gamesList: {
    gap: 12,
  },
  gameItem: {
    flexDirection: 'row',
    backgroundColor: '#374151',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  gameImage: {
    width: 60,
    height: 40,
    borderRadius: 6,
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
    color: '#6366f1',
    marginBottom: 2,
  },
  gameStats: {
    fontSize: 10,
    color: '#9ca3af',
    marginBottom: 2,
  },
  gameId: {
    fontSize: 10,
    color: '#6b7280',
  },
  playButtonContainer: {
    marginLeft: 8,
  },
  infoCard: {
    backgroundColor: '#1f2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  infoText: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 4,
    lineHeight: 16,
  },
  infoNote: {
    fontSize: 11,
    color: '#6366f1',
    marginTop: 8,
    fontStyle: 'italic',
  },
});

export default GamezopIntegrationTest; 