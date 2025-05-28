import React from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Image, SafeAreaView, StatusBar, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const GAME_DATA = {
  mostPlayed: [
    { 
      id: '1', 
      title: 'Boulder Blast', 
      image: require('../../assets/images/games/thumbnails/boulder_blast.png'),
      category: 'puzzle'
    },
    { 
      id: '2', 
      title: 'Cyberfusion', 
      image: require('../../assets/images/games/thumbnails/cyberfusion.png'),
      category: 'adventure'
    },
    { 
      id: '3', 
      title: 'Kingdom Fight', 
      image: require('../../assets/images/games/thumbnails/kingdom_fight_2.png'),
      category: 'strategy'
    },
    { 
      id: '4', 
      title: 'ZUNO', 
      image: require('../../assets/images/games/thumbnails/zuno.png'),
      category: 'arcade'
    },
    { 
      id: '5', 
      title: 'Blazing Blades', 
      image: require('../../assets/images/games/thumbnails/blazing_blades.png'),
      category: 'action'
    },
  ],
  trending: [
    { 
      id: '1', 
      title: 'Cyberfusion', 
      category: 'adventure',
      duration: '7.2 mins',
      rating: 4.5,
      image: require('../../assets/images/games/banners/cyberfusion_banner.png'),
      isTrending: true,
      description: 'Futuristic cyberpunk adventure in a digital realm'
    },
    { 
      id: '2', 
      title: 'Boulder Blast', 
      category: 'puzzle',
      duration: '10.5 mins',
      rating: 4.2,
      image: require('../../assets/images/games/banners/boulder_blast_banner.png'),
      isTrending: true,
      description: 'Challenging physics based puzzle with boulders'
    },
    { 
      id: '3', 
      title: 'Kingdom Fight 2.0', 
      category: 'strategy',
      duration: '12.3 mins',
      rating: 4.7,
      image: require('../../assets/images/games/banners/cyberfusion_banner.png'),
      isTrending: true,
      description: 'Epic strategy battle for kingdom dominance'
    },
    { 
      id: '4', 
      title: 'ZUNO', 
      category: 'arcade',
      duration: '5.8 mins',
      rating: 4.6,
      image: require('../../assets/images/games/banners/boulder_blast_banner.png'),
      isTrending: true,
      description: 'Fast-paced card matching arcade game with unique rules'
    },
  ],
  catalog: [
    { 
      id: '1', 
      title: 'Cyberfusion', 
      category: 'adventure',
      image: require('../../assets/images/games/thumbnails/cyberfusion.png'),
      isHot: true,
      description: 'Futuristic cyberpunk adventure in a digital realm'
    },
    { 
      id: '2', 
      title: 'Boulder Blast', 
      category: 'puzzle',
      image: require('../../assets/images/games/thumbnails/boulder_blast.png'),
      isNew: true,
      description: 'Challenging physics based puzzle with boulders'
    },
    { 
      id: '3', 
      title: 'Kingdom Fight 2.0', 
      category: 'strategy',
      image: require('../../assets/images/games/thumbnails/kingdom_fight_2.png'),
      isHot: true,
      description: 'Epic strategy battle for kingdom dominance'
    },
    { 
      id: '4', 
      title: 'Blazing Blades', 
      category: 'action',
      image: require('../../assets/images/games/thumbnails/blazing_blades.png'),
      isNew: true,
      description: 'Một trò chơi hành động đầy kịch tính'
    },
    { 
      id: '5', 
      title: 'ZUNO', 
      category: 'arcade',
      image: require('../../assets/images/games/thumbnails/zuno.png'),
      isHot: true,
      description: 'Fast-paced card matching arcade game with unique rules'
    },
  ]
};

const CATEGORIES = [
  { id: 'all', title: 'All', icon: 'grid-outline' },
  { id: 'action', title: 'Action', icon: 'flame-outline' },
  { id: 'adventure', title: 'Adventure', icon: 'compass-outline' },
  { id: 'arcade', title: 'Arcade', icon: 'game-controller-outline' },
  { id: 'puzzle', title: 'Puzzle', icon: 'apps-outline' },
  { id: 'strategy', title: 'Strategy', icon: 'trophy-outline' },
];

const GameCircle = ({ game, onPress }) => {
  if (!game) return null;
  
  return (
    <TouchableOpacity style={styles.gameCircle} onPress={onPress}>
      <Image source={game.image} style={styles.gameCircleImage} />
      <Text style={styles.gameCircleTitle} numberOfLines={1}>{game.title}</Text>
    </TouchableOpacity>
  );
};

const TrendingCard = ({ game, onPress }) => {
  if (!game) return null;
  
  return (
    <TouchableOpacity style={styles.trendingCard} onPress={onPress}>
      <Image source={game.image} style={styles.trendingImage} />
      {game.isTrending && (
        <View style={styles.trendingBadge}>
          <Text style={styles.trendingBadgeText}>TRENDING</Text>
        </View>
      )}
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.trendingGradient}
      />
      <View style={styles.trendingInfo}>
        <Text style={styles.trendingTitle}>{game.title}</Text>
        <Text style={styles.trendingCategory}>{game.category}</Text>
        <View style={styles.trendingMeta}>
          <Ionicons name="time-outline" size={14} color="#eee" />
          <Text style={styles.trendingMetaText}>{game.duration}</Text>
          <Ionicons name="star" size={14} color="#FFD700" style={{ marginLeft: 10 }} />
          <Text style={styles.trendingMetaText}>{game.rating}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const CatalogCard = ({ game, onPress }) => {
  if (!game) return null;
  
  return (
    <TouchableOpacity style={styles.catalogCard} onPress={onPress}>
      <Image source={game.image} style={styles.catalogImage} />
      {game.isHot && (
        <View style={[styles.catalogBadge, styles.hotBadge]}>
          <Text style={styles.catalogBadgeText}>Hot</Text>
        </View>
      )}
      {game.isNew && (
        <View style={[styles.catalogBadge, styles.newBadge]}>
          <Text style={styles.catalogBadgeText}>New</Text>
        </View>
      )}
      <View style={styles.catalogInfo}>
        <Text style={styles.catalogTitle}>{game.title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const CategoryButton = ({ category, isSelected, onPress }) => {
  if (!category) return null;
  
  return (
    <TouchableOpacity 
      style={[styles.categoryButton, isSelected && styles.categoryButtonSelected]} 
      onPress={onPress}
    >
      <Ionicons name={category.icon} size={16} color={isSelected ? "#fff" : "#666"} />
      <Text style={[styles.categoryButtonText, isSelected && styles.categoryButtonTextSelected]}>
        {category.title}
      </Text>
    </TouchableOpacity>
  );
};

const HomeScreen = () => {
  const [selectedCategory, setSelectedCategory] = React.useState('all');
  const navigation = useNavigation();

  const handleGamePress = (game) => {
    // Điều hướng đến màn hình GameScreen với thông tin game
    console.log('Navigating to game:', game.title);
    navigation.navigate('GameScreen', { 
      gameId: game.id, 
      gameTitle: game.title,
      gameImage: game.image,
      gameCategory: game.category,
      gameDescription: game.description
    });
  };

  // Lọc game theo thể loại đã chọn
  const filteredGames = React.useMemo(() => {
    if (selectedCategory === 'all') {
      return GAME_DATA.catalog;
    }
    return GAME_DATA.catalog.filter(game => 
      game.category.toLowerCase() === selectedCategory.toLowerCase()
    );
  }, [selectedCategory]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E88E5" />
      
      {/* Header - Thu gọn */}
      <View style={styles.compactHeader}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Game Hub</Text>
          <Text style={styles.headerSubtitle}>{GAME_DATA.catalog.length} games có sẵn</Text>
        </View>
        <TouchableOpacity style={styles.headerButton}>
          <Ionicons name="notifications-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm game..."
            placeholderTextColor="#999"
          />
        </View>

        {/* Most Played */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Most Played</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            {GAME_DATA.mostPlayed && GAME_DATA.mostPlayed.map(game => game && (
              <GameCircle 
                key={game.id} 
                game={game} 
                onPress={() => handleGamePress(game)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Trending */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>TRENDING</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            {GAME_DATA.trending && GAME_DATA.trending.map(game => game && (
              <TrendingCard 
                key={game.id} 
                game={game} 
                onPress={() => handleGamePress(game)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thể loại</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            {CATEGORIES && CATEGORIES.map(category => category && (
              <CategoryButton 
                key={category.id} 
                category={category} 
                isSelected={selectedCategory === category.id}
                onPress={() => setSelectedCategory(category.id)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Games by Category */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {selectedCategory === 'all' ? 'Tất cả game' : `Game ${CATEGORIES.find(cat => cat.id === selectedCategory)?.title || ''}`}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('GameScreen')}>
              <Text style={styles.seeAllButton}>Chơi game</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.catalogGrid}>
            {filteredGames.map(game => (
              <CatalogCard 
                key={game.id} 
                game={game} 
                onPress={() => handleGamePress(game)}
              />
            ))}
          </View>
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
    justifyContent: 'space-between',
    backgroundColor: '#2196F3',
    paddingTop: 10,
    paddingBottom: 15,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  headerButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    marginTop: 5,
  },
  scrollContent: {
    paddingBottom: 80,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 15,
    marginTop: 5,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  section: {
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  seeAllButton: {
    color: '#1E88E5',
    fontSize: 14,
    fontWeight: '600',
  },
  horizontalScroll: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  gameCircle: {
    alignItems: 'center',
    marginRight: 15,
    width: 70,
  },
  gameCircleImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#E3F2FD',
  },
  gameCircleTitle: {
    fontSize: 12,
    marginTop: 5,
    textAlign: 'center',
    width: '100%',
  },
  trendingCard: {
    width: width * 0.7,
    height: 180,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginRight: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  trendingImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  trendingGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '60%',
    borderRadius: 16,
  },
  trendingBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#2196F3',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  trendingBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  trendingInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 15,
  },
  trendingTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  trendingCategory: {
    fontSize: 14,
    color: '#eee',
    marginBottom: 6,
  },
  trendingMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendingMetaText: {
    fontSize: 12,
    color: '#eee',
    marginLeft: 4,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 10,
  },
  categoryButtonSelected: {
    backgroundColor: '#1E88E5',
  },
  categoryButtonText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#666',
  },
  categoryButtonTextSelected: {
    color: '#fff',
  },
  catalogGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  catalogCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  catalogImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  catalogBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  hotBadge: {
    backgroundColor: '#FF5252',
  },
  newBadge: {
    backgroundColor: '#651FFF',
  },
  catalogBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  catalogInfo: {
    padding: 10,
  },
  catalogTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default HomeScreen;