import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
  SafeAreaView
} from 'react-native';
import gamezopService from '../../api/gamezopService';
import GamePlayer from './GamePlayer';

interface Game {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  category: string;
  averageSession: string;
  playCount: string;
  gameUrl: string;
  embedUrl: string;
}

const GameExample: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [showPlayer, setShowPlayer] = useState(false);

  useEffect(() => {
    loadGames();
  }, []);

  const loadGames = async () => {
    try {
      setLoading(true);
      const gamesList = await gamezopService.getGames();
      setGames(gamesList);
    } catch (error) {
      console.error('Error loading games:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayGame = (game: Game) => {
    setSelectedGame(game);
    setShowPlayer(true);
  };

  const handleClosePlayer = () => {
    setShowPlayer(false);
    setSelectedGame(null);
  };

  const renderGameItem = ({ item }: { item: Game }) => (
    <TouchableOpacity style={styles.gameCard} onPress={() => handlePlayGame(item)}>
      <Image source={item.thumbnail ? { uri: item.thumbnail } : require('../../assets/images/games/thumbnails/default_game.png')} style={styles.thumbnail} />
      <View style={styles.gameInfo}>
        <Text style={styles.gameName}>{item.name}</Text>
        <Text style={styles.gameDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.gameStats}>
          <Text style={styles.category}>{item.category}</Text>
          <Text style={styles.playCount}>{item.playCount} plays</Text>
        </View>
        <Text style={styles.duration}>Avg: {item.averageSession}</Text>
      </View>
    </TouchableOpacity>
  );

  // Ví dụ sử dụng các phương thức khác của gamezopService
  const showUsageExamples = () => {
    console.log('=== GAMEZOP SERVICE EXAMPLES ===');
    
    // 1. Lấy URL để embed iframe - Game đầu tiên
    const embedUrl1 = gamezopService.getEmbedUrl('HJXei0j');
    console.log('Embed URL 1 (Cyberfusion):', embedUrl1);
    // Output: https://zv1y2i8p.play.gamezop.com/g/HJXei0j

    // 2. Lấy URL để embed iframe - Game thứ hai
    const embedUrl2 = gamezopService.getEmbedUrl('HkTQJhTXqRS');
    console.log('Embed URL 2 (Boulder Blast):', embedUrl2);
    // Output: https://zv1y2i8p.play.gamezop.com/g/HkTQJhTXqRS

    // 3. Tạo HTML iframe cho game đầu tiên
    const iframeHtml1 = gamezopService.getGameIframe('HJXei0j', {
      style: 'width: 100%; height: 500px; border: none;'
    });
    console.log('Iframe HTML 1:', iframeHtml1);

    // 4. Tạo HTML iframe cho game thứ hai
    const iframeHtml2 = gamezopService.getGameIframe('HkTQJhTXqRS', {
      style: 'width: 100%; height: 600px; border: none;'
    });
    console.log('Iframe HTML 2:', iframeHtml2);

    // 5. Lấy URL để mở trong cửa sổ mới  
    const gameUrl1 = gamezopService.getGameUrl('HJXei0j');
    const gameUrl2 = gamezopService.getGameUrl('HkTQJhTXqRS');
    console.log('Game URL 1:', gameUrl1);
    console.log('Game URL 2:', gameUrl2);

    // 6. Tìm kiếm games
    gamezopService.searchGames('adventure').then(results => {
      console.log('Adventure games:', results);
    });

    // 7. Lấy featured games
    gamezopService.getFeaturedGames(5).then(featured => {
      console.log('Featured games:', featured);
    });

    console.log('=== END EXAMPLES ===');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Gamezop Games</Text>
        <TouchableOpacity onPress={showUsageExamples} style={styles.debugButton}>
          <Text style={styles.debugText}>Debug</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={games}
        renderItem={renderGameItem}
        keyExtractor={(item) => item.id}
        numColumns={1}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.gamesList}
      />

      {/* Game Player Modal */}
      <Modal
        visible={showPlayer}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={handleClosePlayer}
      >
        {selectedGame && (
          <GamePlayer
            gameId={selectedGame.id}
            gameName={selectedGame.name}
            onClose={handleClosePlayer}
          />
        )}
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
  },
  debugButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  debugText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  gamesList: {
    padding: 16,
  },
  gameCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  thumbnail: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  gameInfo: {
    padding: 16,
  },
  gameName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 8,
  },
  gameDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  gameStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  category: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6366f1',
    backgroundColor: '#eef2ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  playCount: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '500',
  },
  duration: {
    fontSize: 12,
    color: '#9ca3af',
    fontStyle: 'italic',
  },
});

export default GameExample; 