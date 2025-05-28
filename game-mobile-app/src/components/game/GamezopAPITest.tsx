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
          'API Test Success!',
          `Found ${result.gamesCount} games with real images from Gamezop API`,
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert(
          'API Test Failed',
          result.message,
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      Alert.alert('Error', `Test failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const toggleDemoMode = () => {
    const newMode = !currentMode;
    gamezopService.setDemoMode(newMode);
    setCurrentMode(newMode);
    
    Alert.alert(
      'Demo Mode Changed',
      `Demo mode is now ${newMode ? 'ENABLED' : 'DISABLED'}`,
      [{ text: 'OK' }]
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
        'Real Games Loaded',
        `Loaded ${games.length} games with real Gamezop images`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Error', `Failed to load real games: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Gamezop API Test</Text>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Ionicons name="close" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Current Status */}
        <View style={styles.statusCard}>
          <Text style={styles.cardTitle}>Current Status</Text>
          <Text style={styles.statusText}>
            Demo Mode: {currentMode ? '🟡 ENABLED' : '🟢 DISABLED'}
          </Text>
          <Text style={styles.statusText}>
            Partner ID: {gamezopService['config']?.partnerId || 'zv1y2i8p'}
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
                <Text style={styles.buttonText}>Test API Connection</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.toggleButton]} 
            onPress={toggleDemoMode}
          >
            <Ionicons name="swap-horizontal" size={20} color="#ffffff" />
            <Text style={styles.buttonText}>Toggle Demo Mode</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.loadButton]} 
            onPress={loadRealGames}
            disabled={loading}
          >
            <Ionicons name="download" size={20} color="#ffffff" />
            <Text style={styles.buttonText}>Load Real Games</Text>
          </TouchableOpacity>
        </View>

        {/* API Result */}
        {apiResult && (
          <View style={styles.resultCard}>
            <Text style={styles.cardTitle}>API Test Result</Text>
            <Text style={[
              styles.resultText,
              { color: apiResult.success ? '#10b981' : '#ef4444' }
            ]}>
              {apiResult.message}
            </Text>
            {apiResult.success && (
              <Text style={styles.resultDetail}>
                Games Available: {apiResult.gamesCount}
              </Text>
            )}
          </View>
        )}

        {/* Real Games Preview */}
        {realGames.length > 0 && (
          <View style={styles.gamesCard}>
            <Text style={styles.cardTitle}>Real Games from API</Text>
            <Text style={styles.gamesSubtitle}>
              {realGames.length} games loaded with real images
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
                      📸 {game.screenshots.length} screenshots
                    </Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Instructions */}
        <View style={styles.instructionsCard}>
          <Text style={styles.cardTitle}>Instructions</Text>
          <Text style={styles.instructionText}>
            1. <Text style={styles.bold}>Test API Connection</Text>: Check if Gamezop API is accessible
          </Text>
          <Text style={styles.instructionText}>
            2. <Text style={styles.bold}>Toggle Demo Mode</Text>: Switch between demo data and real API
          </Text>
          <Text style={styles.instructionText}>
            3. <Text style={styles.bold}>Load Real Games</Text>: Fetch games with real images from Gamezop
          </Text>
          <Text style={styles.instructionText}>
            4. If API works, you can disable demo mode to use real images!
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