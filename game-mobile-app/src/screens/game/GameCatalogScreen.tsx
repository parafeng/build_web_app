import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList,
  ActivityIndicator,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import gamezopService from '../../api/gamezopService';
import gameImagesConfig from '../../assets/images/games/gameImages.config';

const { width } = Dimensions.get('window');

interface Game {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  category: string;
  averageSession: string;
  playCount: string;
  gameUrl: string;
}

const GameCatalogScreen: React.FC = () => {
  const navigation = useNavigation();
  const [games, setGames] = useState<Game[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  const categories = [
    'All',
    'Action',
    'Adventure', 
    'Arcade',
    'Puzzle & Logic',
    'Sports & Racing',
    'Strategy'
  ];

  // Hàm lấy hình ảnh thumbnail từ local assets nếu có
  const getGameThumbnail = (gameId: string) => {
    // Thử lấy hình ảnh từ local assets
    const localImage = gameImagesConfig.getGameThumbnail(gameId);
    if (localImage) {
      return localImage;
    }
    
    // Nếu không có, sử dụng URL từ game object
    return null;
  };

  useEffect(() => {
    loadGames();
  }, [selectedCategory]);

  const loadGames = async () => {
    setLoading(true);
    try {
      const categoryFilter = selectedCategory === 'All' ? undefined : selectedCategory;
      const gamesData = await gamezopService.getGames(categoryFilter, 20);
      setGames(gamesData);
    } catch (error) {
      console.error('Error loading games:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayGame = (game: Game) => {
    // @ts-ignore
    navigation.navigate('GamePlay', { game });
  };

  const renderCategoryButton = (category: string) => (
    <TouchableOpacity
      key={category}
      style={[
        styles.categoryButton,
        selectedCategory === category && styles.selectedCategoryButton
      ]}
      onPress={() => setSelectedCategory(category)}
    >
      <Text style={[
        styles.categoryText,
        selectedCategory === category && styles.selectedCategoryText
      ]}>
        {category}
      </Text>
    </TouchableOpacity>
  );

  const renderGameCard = ({ item }: { item: Game }) => (
    <TouchableOpacity 
      style={styles.gameCard}
      onPress={() => handlePlayGame(item)}
    >
      <Image 
        source={getGameThumbnail(item.id) || (item.thumbnail ? { uri: item.thumbnail } : require('../../assets/images/games/thumbnails/default_game.png'))} 
        style={styles.gameImage} 
      />
      <View style={styles.gameInfo}>
        <Text style={styles.gameName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.gameDescription} numberOfLines={2}>{item.description}</Text>
        <View style={styles.gameStats}>
          <View style={styles.statItem}>
            <Ionicons name="time-outline" size={12} color="#6b7280" />
            <Text style={styles.statText}>{item.averageSession}</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="game-controller-outline" size={12} color="#6b7280" />
            <Text style={styles.statText}>{item.playCount}</Text>
          </View>
        </View>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryBadgeText}>{item.category}</Text>
        </View>
        <TouchableOpacity 
          style={styles.playButton}
          onPress={() => handlePlayGame(item)}
        >
          <Text style={styles.playButtonText}>Chơi ngay</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1e90ff" />
        <Text style={styles.loadingText}>Đang tải games...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Game Catalog</Text>
          <Text style={styles.headerSubtitle}>Chọn game yêu thích để chơi</Text>
          <Text style={styles.gameCount}>{games.length} games có sẵn</Text>
        </View>
      </View>

      {/* Categories */}
      <View style={styles.categoriesSection}>
        <Text style={styles.categoriesTitle}>Thể loại</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
          contentContainerStyle={styles.categoriesContent}
        >
          {categories.map(renderCategoryButton)}
        </ScrollView>
      </View>

      {/* Games Grid */}
      <FlatList
        data={games}
        renderItem={renderGameCard}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.gamesContainer}
        showsVerticalScrollIndicator={false}
        refreshing={loading}
        onRefresh={loadGames}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="game-controller-outline" size={50} color="#d1d5db" />
            <Text style={styles.emptyText}>Không có game nào</Text>
            <Text style={styles.emptySubtext}>Thử chọn thể loại khác</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#6b7280',
  },
  header: {
    padding: 20,
    paddingTop: 20,
    backgroundColor: '#1e90ff',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerContent: {
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#e0e7ff',
    opacity: 0.9,
  },
  gameCount: {
    fontSize: 14,
    color: '#e0e7ff',
    opacity: 0.9,
    marginTop: 5,
  },
  categoriesSection: {
    paddingTop: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  categoriesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  categoriesContainer: {
    marginBottom: 15,
  },
  categoriesContent: {
    paddingHorizontal: 20,
    paddingRight: 40,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  selectedCategoryButton: {
    backgroundColor: '#1e90ff',
    borderColor: '#1e90ff',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  selectedCategoryText: {
    color: '#ffffff',
  },
  gamesContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  row: {
    justifyContent: 'space-between',
  },
  gameCard: {
    width: (width - 50) / 2,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  gameImage: {
    width: '100%',
    height: 120,
    backgroundColor: '#f3f4f6',
  },
  gameInfo: {
    padding: 15,
  },
  gameName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 5,
  },
  gameDescription: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 12,
    lineHeight: 16,
  },
  gameStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 10,
    color: '#6b7280',
    fontWeight: '500',
    marginLeft: 4,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#e0e7ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 12,
  },
  categoryBadgeText: {
    fontSize: 10,
    color: '#1e90ff',
    fontWeight: '600',
  },
  playButton: {
    backgroundColor: '#1e90ff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  playButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  gamezopButton: {
    display: 'none',
  },
  gamezopButtonText: {
    display: 'none',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#9ca3af',
    marginTop: 15,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#d1d5db',
    marginTop: 5,
  },
});

export default GameCatalogScreen; 