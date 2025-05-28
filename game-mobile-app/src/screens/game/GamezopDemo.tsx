import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GamezopEmbed from '../../components/game/GamezopEmbed';
import GamezopAPITest from '../../components/game/GamezopAPITest';
import GamezopIntegrationTest from '../../components/game/GamezopIntegrationTest';

// Các game demo từ Gamezop
const DEMO_GAMES = [
  {
    id: 'HJXei0j',
    name: 'Gamezop Demo 1',
    url: 'https://zv1y2i8p.play.gamezop.com/g/HJXei0j'
  },
  {
    id: 'HkTQJhTXqRS',
    name: 'Gamezop Demo 2',
    url: 'https://zv1y2i8p.play.gamezop.com/g/HkTQJhTXqRS'
  }
];

const GamezopDemo: React.FC<any> = ({ navigation }) => {
  const [selectedGame, setSelectedGame] = useState<{id: string, name: string, url: string} | null>(null);
  const [showAPITest, setShowAPITest] = useState(false);
  const [showIntegrationTest, setShowIntegrationTest] = useState(false);

  const handlePlayGame = (game: {id: string, name: string, url: string}) => {
    setSelectedGame(game);
  };

  const handleCloseGame = () => {
    setSelectedGame(null);
  };

  // Hiển thị game fullscreen khi được chọn
  if (selectedGame) {
    return (
      <GamezopEmbed
        gameUrl={selectedGame.url}
        gameName={selectedGame.name}
        onClose={handleCloseGame}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#1f2937" barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Gamezop Demo</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity 
            style={styles.apiTestButton}
            onPress={() => setShowAPITest(true)}
          >
            <Ionicons name="settings" size={20} color="#ffffff" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.integrationTestButton}
            onPress={() => setShowIntegrationTest(true)}
          >
            <Ionicons name="analytics" size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Content */}
      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Chọn game để test iframe embed:</Text>
        
        {/* Game List */}
        <View style={styles.gameList}>
          {DEMO_GAMES.map((game) => (
            <TouchableOpacity
              key={game.id}
              style={styles.gameCard}
              onPress={() => handlePlayGame(game)}
            >
              <View style={styles.gameInfo}>
                <Text style={styles.gameName}>{game.name}</Text>
                <Text style={styles.gameId}>ID: {game.id}</Text>
                <Text style={styles.gameUrl} numberOfLines={1}>{game.url}</Text>
              </View>
              <View style={styles.playButton}>
                <Ionicons name="play-circle" size={32} color="#6366f1" />
              </View>
            </TouchableOpacity>
          ))}
        </View>
        
        {/* Hướng dẫn */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Về tích hợp Gamezop</Text>
          <Text style={styles.infoText}>
            Các game từ Gamezop được tích hợp qua iframe embed, sử dụng WebView
            trong React Native. Các game được tải trực tiếp trong ứng dụng mà không
            mở trình duyệt bên ngoài.
          </Text>
          <Text style={styles.infoText}>
            WebView được cấu hình để chặn các liên kết ngoài và xử lý các sự kiện
            click để đảm bảo người dùng không bị chuyển hướng ra khỏi ứng dụng.
          </Text>
        </View>
      </ScrollView>

      {/* API Test Modal */}
      <Modal
        visible={showAPITest}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <GamezopAPITest onClose={() => setShowAPITest(false)} />
      </Modal>

      {/* Integration Test Modal */}
      <Modal
        visible={showIntegrationTest}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <GamezopIntegrationTest onClose={() => setShowIntegrationTest(false)} />
      </Modal>
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
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  apiTestButton: {
    padding: 8,
    marginRight: 8,
  },
  integrationTestButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#e5e7eb',
    marginBottom: 16,
  },
  gameList: {
    marginBottom: 24,
  },
  gameCard: {
    flexDirection: 'row',
    backgroundColor: '#1f2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  gameInfo: {
    flex: 1,
    marginRight: 16,
  },
  gameName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  gameId: {
    fontSize: 14,
    color: '#9ca3af',
    marginBottom: 4,
  },
  gameUrl: {
    fontSize: 12,
    color: '#6b7280',
  },
  playButton: {
    backgroundColor: '#374151',
    borderRadius: 40,
    padding: 12,
  },
  infoCard: {
    backgroundColor: '#1f2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#d1d5db',
    lineHeight: 20,
    marginBottom: 12,
  },
});

export default GamezopDemo; 