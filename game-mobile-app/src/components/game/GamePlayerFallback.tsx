import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  SafeAreaView,
  StatusBar,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import gamezopService from '../../api/gamezopService';

interface GamePlayerProps {
  gameId: string;
  gameName: string;
  onClose: () => void;
}

const GamePlayer: React.FC<GamePlayerProps> = ({ gameId, gameName, onClose }) => {
  const [embedUrl, setEmbedUrl] = useState('');
  const [gameUrl, setGameUrl] = useState('');

  useEffect(() => {
    // Tạo embed URL và game URL
    const embed = gamezopService.getEmbedUrl(gameId);
    const game = gamezopService.getGameUrl(gameId);
    setEmbedUrl(embed);
    setGameUrl(game);
  }, [gameId]);

  const handleOpenInBrowser = async () => {
    try {
      await WebBrowser.openBrowserAsync(gameUrl);
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể mở game trong trình duyệt');
    }
  };

  const copyEmbedUrl = () => {
    // Hiển thị embed URL để copy
    Alert.alert(
      'Embed URL',
      embedUrl,
      [
        { text: 'Đóng', style: 'cancel' },
        { text: 'Mở Browser', onPress: handleOpenInBrowser }
      ]
    );
  };

  const showGameInfo = () => {
    const iframeHtml = gamezopService.getGameIframe(gameId);
    
    Alert.alert(
      'Thông tin Game',
      `Game ID: ${gameId}\nEmbed URL: ${embedUrl}\n\nIframe HTML đã được log ra console`,
      [
        { text: 'Copy Embed URL', onPress: copyEmbedUrl },
        { text: 'Mở Browser', onPress: handleOpenInBrowser },
        { text: 'Đóng', style: 'cancel' }
      ]
    );
    
    console.log('=== GAME INFO ===');
    console.log('Game ID:', gameId);
    console.log('Game Name:', gameName);
    console.log('Embed URL:', embedUrl);
    console.log('Game URL:', gameUrl);
    console.log('Iframe HTML:', iframeHtml);
    console.log('=== END INFO ===');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#1f2937" barStyle="light-content" />
      
      {/* Header với nút đóng */}
      <View style={styles.header}>
        <Text style={styles.gameTitle} numberOfLines={1}>
          {gameName}
        </Text>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Ionicons name="close" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Game Content */}
      <View style={styles.gameContainer}>
        <View style={styles.fallbackContainer}>
          <View style={styles.iconContainer}>
            <Ionicons name="game-controller-outline" size={80} color="#1e90ff" />
          </View>
          
          <Text style={styles.fallbackTitle}>Game Player</Text>
          <Text style={styles.fallbackSubtitle}>
            Sử dụng Expo WebBrowser để chơi game
          </Text>
          
          <View style={styles.gameInfo}>
            <Text style={styles.infoLabel}>Game ID:</Text>
            <Text style={styles.infoValue}>{gameId}</Text>
            
            <Text style={styles.infoLabel}>Embed URL:</Text>
            <Text style={styles.infoValue} numberOfLines={2}>
              {embedUrl}
            </Text>
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.browserButton} onPress={handleOpenInBrowser}>
              <Ionicons name="open-outline" size={20} color="#ffffff" />
              <Text style={styles.browserButtonText}>Mở trong Browser</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.infoButton} onPress={showGameInfo}>
              <Ionicons name="information-circle-outline" size={20} color="#1e90ff" />
              <Text style={styles.infoButtonText}>Thông tin Game</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.noteContainer}>
            <Text style={styles.noteText}>
              💡 Game sẽ mở trong browser external với Expo WebBrowser
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1f2937',
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
  gameTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginRight: 16,
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#374151',
  },
  gameContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  fallbackContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  fallbackTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginTop: 20,
    marginBottom: 8,
  },
  fallbackSubtitle: {
    fontSize: 16,
    color: '#9ca3af',
    textAlign: 'center',
    marginBottom: 32,
  },
  gameInfo: {
    backgroundColor: '#1f2937',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    marginBottom: 32,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9ca3af',
    marginBottom: 4,
    marginTop: 12,
  },
  infoValue: {
    fontSize: 14,
    color: '#ffffff',
    fontFamily: 'monospace',
  },
  actionButtons: {
    width: '100%',
    gap: 12,
  },
  browserButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1e90ff',
    paddingVertical: 16,
    borderRadius: 12,
  },
  browserButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  infoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#374151',
    paddingVertical: 16,
    borderRadius: 12,
  },
  infoButtonText: {
    color: '#1e90ff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  noteContainer: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#374151',
    borderRadius: 8,
    width: '100%',
  },
  noteText: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 16,
  },
  iconContainer: {
    marginBottom: 20,
  },
  tryAgainButton: {
    backgroundColor: '#1e90ff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  infoText: {
    fontSize: 14,
    color: '#1e90ff',
    marginLeft: 5,
  },
});

export default GamePlayer; 