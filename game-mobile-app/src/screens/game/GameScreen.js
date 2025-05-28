import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, SafeAreaView, StatusBar, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';

const GAME_DATA = [
  {
    id: '1',
    title: 'Cyberfusion',
    description: 'Futuristic cyberpunk adventure in a digital realm',
    duration: '7.2 mins',
    plays: '9.8M',
    image: require('../../assets/images/games/thumbnails/cyberfusion.png'),
    category: 'Adventure'
  },
  {
    id: '2',
    title: 'Boulder Blast',
    description: 'Challenging physics based puzzle with boulders',
    duration: '10.5 mins',
    plays: '15.3M',
    image: require('../../assets/images/games/thumbnails/boulder_blast.png'),
    category: 'Puzzle & Logic'
  },
  {
    id: '3',
    title: 'Kingdom Fight 2.0',
    description: 'Epic strategy battle for kingdom dominance',
    duration: '12.3 mins',
    plays: '7.5M',
    image: require('../../assets/images/games/thumbnails/kingdom_fight_2.png'),
    category: 'Strategy'
  },
  {
    id: '4',
    title: 'Blazing Blades',
    description: 'Một trò chơi hành động đầy kịch tính',
    duration: '8.7 mins',
    plays: '11.2M',
    image: require('../../assets/images/games/thumbnails/blazing_blades.png'),
    category: 'Action'
  }
];

const CATEGORIES = [
  { id: 'all', title: 'All' },
  { id: 'action', title: 'Action' },
  { id: 'adventure', title: 'Adventure' },
  { id: 'arcade', title: 'Arcade' },
  { id: 'puzzle', title: 'Puzzle' },
];

const GameCard = ({ game, onPress }) => {
  return (
    <TouchableOpacity style={styles.gameCard} onPress={() => onPress(game)}>
      <Image source={game.image} style={styles.gameImage} />
      <View style={styles.gameInfo}>
        <Text style={styles.gameTitle}>{game.title}</Text>
        <Text style={styles.gameDescription} numberOfLines={2}>{game.description}</Text>
        <View style={styles.gameStats}>
          <View style={styles.statItem}>
            <Ionicons name="time-outline" size={14} color="#666" />
            <Text style={styles.statText}>{game.duration}</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="person-outline" size={14} color="#666" />
            <Text style={styles.statText}>{game.plays}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const CategoryButton = ({ category, selected, onPress }) => {
  return (
    <TouchableOpacity 
      style={[styles.categoryButton, selected && styles.selectedCategoryButton]}
      onPress={() => onPress(category.id)}
    >
      <Text style={[styles.categoryText, selected && styles.selectedCategoryText]}>
        {category.title}
      </Text>
    </TouchableOpacity>
  );
};

const GameScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [gameInfo, setGameInfo] = useState(null);
  
  useEffect(() => {
    // Nhận thông tin game từ route.params nếu có
    if (route.params) {
      const { gameId, gameTitle, gameImage, gameCategory, gameDescription } = route.params;
      if (gameId) {
        setGameInfo({
          id: gameId,
          title: gameTitle,
          image: gameImage,
          category: gameCategory,
          description: gameDescription,
        });
        
        // Cập nhật thể loại được chọn dựa trên game
        if (gameCategory) {
          setSelectedCategory(gameCategory.toLowerCase());
        }
      }
    }
  }, [route.params]);

  const filteredGames = React.useMemo(() => {
    if (!GAME_DATA || GAME_DATA.length === 0) return [];
    
    return selectedCategory === 'all' 
      ? GAME_DATA 
      : GAME_DATA.filter(game => 
          game && game.category && game.category.toLowerCase().includes(selectedCategory.toLowerCase())
        );
  }, [selectedCategory]);
  
  const handlePlayGame = (game) => {
    Alert.alert(
      'Chơi Game',
      `Bạn đã chọn game ${game.title}. Bạn có muốn bắt đầu chơi không?`,
      [
        {
          text: 'Hủy',
          style: 'cancel'
        },
        { 
          text: 'Chơi', 
          onPress: () => console.log('Play game:', game.title)
        }
      ]
    );
  };
  
  const handleBackToHome = () => {
    navigation.navigate('HomeScreen');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E88E5" />
      
      {/* Header - Thu gọn */}
      <View style={styles.compactHeader}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackToHome}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Game Catalog</Text>
          <Text style={styles.headerSubtitle}>{GAME_DATA.length} games có sẵn</Text>
        </View>
        <TouchableOpacity style={styles.playAllButton}>
          <Text style={styles.playAllButtonText}>Chơi ngay</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content}>
        {/* Game được chọn */}
        {gameInfo && (
          <View style={styles.selectedGameSection}>
            <Text style={styles.sectionTitle}>Game đã chọn</Text>
            <View style={styles.selectedGameCard}>
              <Image source={gameInfo.image} style={styles.selectedGameImage} />
              <View style={styles.selectedGameInfo}>
                <Text style={styles.selectedGameTitle}>{gameInfo.title}</Text>
                <Text style={styles.selectedGameCategory}>{gameInfo.category}</Text>
                <Text style={styles.selectedGameDescription} numberOfLines={2}>
                  {gameInfo.description}
                </Text>
                <TouchableOpacity 
                  style={styles.playButton}
                  onPress={() => handlePlayGame(gameInfo)}
                >
                  <Ionicons name="play" size={16} color="#fff" />
                  <Text style={styles.playButtonText}>Chơi ngay</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      
        {/* Categories */}
        <View style={styles.categoriesContainer}>
          <Text style={styles.sectionTitle}>Thể loại</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
            {CATEGORIES.map(category => (
              <CategoryButton 
                key={category.id}
                category={category}
                selected={selectedCategory === category.id}
                onPress={setSelectedCategory}
              />
            ))}
          </ScrollView>
        </View>
        
        {/* Games list */}
        <View style={styles.gamesContainer}>
          <Text style={styles.sectionTitle}>
            {selectedCategory === 'all' ? 'Tất cả game' : `Game ${selectedCategory}`}
          </Text>
          {filteredGames.map(game => (
            <GameCard 
              key={game.id}
              game={game}
              onPress={handlePlayGame}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  compactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2196F3',
    paddingTop: 10,
    paddingBottom: 15,
    paddingHorizontal: 15,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  backButton: {
    padding: 5,
  },
  headerLeft: {
    flex: 1,
    marginLeft: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  playAllButton: {
    backgroundColor: '#FFC107',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  playAllButtonText: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 14,
  },
  content: {
    flex: 1,
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  categoriesContainer: {
    marginBottom: 20,
  },
  categoriesScroll: {
    flexDirection: 'row',
  },
  categoryButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#f0f0f0',
    marginRight: 10,
    borderRadius: 20,
  },
  selectedCategoryButton: {
    backgroundColor: '#2196F3',
  },
  categoryText: {
    color: '#666',
  },
  selectedCategoryText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  gamesContainer: {
    marginBottom: 20,
  },
  gameCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  gameImage: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
  },
  gameInfo: {
    flex: 1,
    padding: 12,
  },
  gameTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  gameDescription: {
    fontSize: 13,
    color: '#666',
    marginBottom: 10,
  },
  gameStats: {
    flexDirection: 'row',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  statText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  selectedGameSection: {
    marginBottom: 20,
  },
  selectedGameCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  selectedGameImage: {
    width: 120,
    height: 150,
    resizeMode: 'cover',
  },
  selectedGameInfo: {
    flex: 1,
    padding: 15,
    justifyContent: 'space-between',
  },
  selectedGameTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  selectedGameCategory: {
    fontSize: 14,
    color: '#2196F3',
    marginBottom: 8,
    fontWeight: '500',
  },
  selectedGameDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 25,
  },
  playButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 5,
  },
});

export default GameScreen; 