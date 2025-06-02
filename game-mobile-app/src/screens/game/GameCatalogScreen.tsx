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
  StatusBar,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import gamezopService from '../../api/gamezopService';
import gameImagesConfig from '../../assets/images/games/gameImages.config';
import { t } from '../../utils/i18n';

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
    'Sports',
    'Strategy'
  ];

  const categoryLabels = {
    'All': 'All',
    'Action': 'Action',
    'Adventure': 'Adventure',
    'Arcade': 'Arcade',
    'Puzzle & Logic': 'Puzzle & Logic',
    'Sports': 'Sports',
    'Strategy': 'Strategy'
  };

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

  const renderCategoryButton = (category: string) => {
    return (
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
          {categoryLabels[category]}
        </Text>
      </TouchableOpacity>
    );
  };

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
            <Ionicons name="people-outline" size={12} color="#6b7280" />
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
        <Text style={styles.loadingText}>{t('loading_games')}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar 
        backgroundColor="#1e90ff" 
        barStyle="light-content"
        translucent={Platform.OS === 'android'}
      />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{t('game_catalog')}</Text>
          <Text style={styles.gameCount}>{games.length} {t('games_available')}</Text>
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
            <Text style={styles.emptyText}>{t('no_games')}</Text>
            <Text style={styles.emptySubtext}>{t('try_another_category')}</Text>
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
    padding: 15,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 15) + 10 : 40,
    backgroundColor: '#1e90ff',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerContent: {
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
    marginTop: 0,
  },
  headerSubtitle: {
    display: 'none',
  },
  gameCount: {
    fontSize: 14,
    color: '#e0e7ff',
    opacity: 0.9,
    marginTop: 0,
  },
  categoriesSection: {
    paddingTop: 15,
    backgroundColor: '#ffffff',
    borderBottomWidth: 0,
    borderBottomColor: 'transparent',
  },
  categoriesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 10,
    paddingHorizontal: 15,
  },
  categoriesContainer: {
    marginBottom: 10,
  },
  categoriesContent: {
    paddingHorizontal: 15,
    paddingRight: 30,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 25,
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
    fontWeight: '500',
    color: '#6b7280',
  },
  selectedCategoryText: {
    color: '#ffffff',
  },
  gamesContainer: {
    padding: 15,
    paddingBottom: 80,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 0,
  },
  gameCard: {
    width: (width - 40) / 2,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  gameImage: {
    width: '100%',
    height: 110,
    backgroundColor: '#f3f4f6',
  },
  gameInfo: {
    padding: 10,
  },
  gameName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 3,
  },
  gameDescription: {
    fontSize: 11,
    color: '#6b7280',
    marginBottom: 8,
    lineHeight: 14,
  },
  gameStats: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
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
    paddingVertical: 3,
    borderRadius: 5,
    marginBottom: 8,
  },
  categoryBadgeText: {
    fontSize: 10,
    color: '#1e90ff',
    fontWeight: '500',
  },
  playButton: {
    backgroundColor: '#1e90ff',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 2,
  },
  playButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '500',
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