import React, { useEffect, useState, useRef, useCallback } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator,
  Image,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Dimensions,
  TextInput,
  Animated,
  Platform,
  Keyboard
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import gamezopService from '../../api/gamezopService';
import gameImagesConfig from '../../assets/images/games/gameImages.config';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.85;
const CARD_HEIGHT = CARD_WIDTH * 0.5;

const CATEGORIES = [
  { id: 'all', name: 'All', icon: 'grid-outline', color: '#1e90ff' },
  { id: 'action', name: 'Action', icon: 'flame-outline', color: '#ef4444' },
  { id: 'adventure', name: 'Adventure', icon: 'compass-outline', color: '#f59e0b' },
  { id: 'arcade', name: 'Arcade', icon: 'game-controller-outline', color: '#10b981' },
  { id: 'puzzle', name: 'Puzzle', icon: 'apps-outline', color: '#3b82f6' },
];

interface Game {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  category: string;
  averageSession: string;
  playCount: string;
  gameUrl: string;
  embedUrl?: string;
}

const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const [mostPlayed, setMostPlayed] = useState<Game[]>([]);
  const [trendingGames, setTrendingGames] = useState<Game[]>([]);
  const [newGames, setNewGames] = useState<Game[]>([]);
  const [gamesByCategory, setGamesByCategory] = useState<Record<string, Game[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [pressedItemId, setPressedItemId] = useState<string | null>(null);
  const scaleAnims = useRef<{[key: string]: Animated.Value}>({}).current;
  
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerHeight = useRef(new Animated.Value(150)).current;
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Hiệu ứng opacity khi scroll
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.98],
    extrapolate: 'clamp',
  });
  
  // Điều chỉnh lại các animation để khi scroll, header vẫn giữ độ rộng phù hợp
  const headerWidthPercent = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [100, 100], // Luôn giữ chiều rộng 100%
    extrapolate: 'clamp',
  });

  // Hiệu ứng thu nhỏ theo chiều cao khi scroll
  const headerHeightPercent = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [100, 95], // Giảm độ co lại
    extrapolate: 'clamp',
  });
  
  // Cải thiện hiệu ứng bo tròn góc khi scroll
  const headerBorderRadius = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [25, 18], // Giảm độ bo tròn khi scroll để phù hợp hơn
    extrapolate: 'clamp',
  });
  
  // Hiệu ứng dịch chuyển lên trên khi scroll
  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -3],
    extrapolate: 'clamp',
  });
  
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchResults, setSearchResults] = useState<Game[]>([]);
  
  useEffect(() => {
    loadGames();
  }, []);
  
  const loadGames = async () => {
    setLoading(true);
    try {
      // Lấy top games cho Most Played
      const featuredGames = await gamezopService.getFeaturedGames(6);
      setMostPlayed(featuredGames);
      
      // Lấy games cho Trending
      const allGames = await gamezopService.getGames();
      
      // Lấy 3 game đầu tiên cho trending
      setTrendingGames(allGames.slice(0, 3));
      
      // Lấy các game khác cho mục New Games
      setNewGames(allGames.slice(3, 9));
      
      // Phân loại game theo category
      const categorized: Record<string, Game[]> = {};
      CATEGORIES.forEach(cat => {
        if (cat.id === 'all') {
          categorized[cat.id] = allGames;
        } else {
          categorized[cat.id] = allGames.filter(game => 
            game.category.toLowerCase().includes(cat.id)
          );
        }
      });
      setGamesByCategory(categorized);
      
      setError(null);
    } catch (err) {
      console.error('Error fetching games:', err);
      setError('Không thể tải danh sách game');
    } finally {
      setLoading(false);
    }
  };
  
  const handleGamePress = (game: Game) => {
    // @ts-ignore
    navigation.navigate('GamePlay', { game });
  };
  
  // Hàm lấy hình ảnh thumbnail từ local assets nếu có
  const getGameThumbnail = (gameId: string) => {
    // Thử lấy hình ảnh từ local assets
    const localImage = gameImagesConfig.getGameThumbnail(gameId);
    if (localImage) {
      return localImage;
    }
    
    // Nếu không có, sử dụng URL từ game object
    const game = [...mostPlayed, ...trendingGames, ...newGames].find(g => g.id === gameId);
    if (game?.thumbnail) {
      return { uri: game.thumbnail };
    }
    
    // Fallback cho default
    return gameImagesConfig.GameThumbnails.default;
  };
  
  // Hàm lấy hình ảnh banner từ local assets nếu có
  const getGameBanner = (gameId: string) => {
    // Thử lấy hình ảnh từ local assets
    const localImage = gameImagesConfig.getGameBanner(gameId);
    if (localImage) {
      return localImage;
    }
    
    // Nếu không có, sử dụng thumbnail từ game object
    const game = [...mostPlayed, ...trendingGames, ...newGames].find(g => g.id === gameId);
    if (game?.thumbnail) {
      return { uri: game.thumbnail };
    }
    
    // Fallback cho default
    return gameImagesConfig.GameBanners.default;
  };
  
  const getScaleAnim = (gameId: string) => {
    if (!scaleAnims[gameId]) {
      scaleAnims[gameId] = new Animated.Value(1);
    }
    return scaleAnims[gameId];
  };

  const handlePressIn = (gameId: string) => {
    setPressedItemId(gameId);
    Animated.spring(getScaleAnim(gameId), {
      toValue: 0.95,
      friction: 5,
      tension: 100,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = (gameId: string) => {
    setPressedItemId(null);
    Animated.spring(getScaleAnim(gameId), {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };
  
  const renderMostPlayedItem = ({ item }: { item: Game }) => {
    const scaleAnim = getScaleAnim(`mostPlayed-${item.id}`);
    
    return (
      <Animated.View style={{
        transform: [{ scale: scaleAnim }]
      }}>
        <TouchableOpacity 
          style={styles.mostPlayedItem}
          onPress={() => handleGamePress(item)}
          onPressIn={() => handlePressIn(`mostPlayed-${item.id}`)}
          onPressOut={() => handlePressOut(`mostPlayed-${item.id}`)}
          activeOpacity={0.9}
        >
          <View style={styles.mostPlayedImageContainer}>
            <Image 
              source={getGameThumbnail(item.id)}
              style={styles.mostPlayedImage}
            />
          </View>
          <Text style={styles.mostPlayedName} numberOfLines={1}>
            {item.name}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderTrendingItem = ({ item, index }: { item: Game; index: number }) => {
    const isActive = index === 1; // Center item is active
    const scaleAnim = getScaleAnim(`trending-${item.id}`);
    
    return (
      <Animated.View style={{
        transform: [{ scale: scaleAnim }]
      }}>
        <TouchableOpacity 
          style={[
            styles.trendingCard,
            isActive && styles.trendingCardActive
          ]}
          onPress={() => handleGamePress(item)}
          onPressIn={() => handlePressIn(`trending-${item.id}`)}
          onPressOut={() => handlePressOut(`trending-${item.id}`)}
          activeOpacity={0.9}
        >
          <View style={styles.trendingImageContainer}>
            <Image 
              source={getGameBanner(item.id)}
              style={styles.trendingImage}
            />
          </View>
          <View style={styles.trendingGradient} />
          <View style={styles.trendingContent}>
            <View style={styles.trendingBadge}>
              <Text style={styles.trendingBadgeText}>Trending</Text>
            </View>
            <Text style={styles.trendingName}>{item.name}</Text>
            <Text style={styles.trendingCategory}>{item.category}</Text>
            <View style={styles.trendingStats}>
              <View style={styles.trendingStat}>
                <Ionicons name="time-outline" size={12} color="#ffffff" />
                <Text style={styles.trendingStatText}>{item.averageSession}</Text>
              </View>
              <View style={styles.trendingStat}>
                <Ionicons name="star" size={12} color="#FFD700" />
                <Text style={styles.trendingStatText}>4.{Math.floor(Math.random() * 10)}</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderGameItem = ({ item, index }: { item: Game, index: number }) => (
    <Animated.View style={{
      transform: [{ scale: getScaleAnim(item.id) }]
    }}>
    <TouchableOpacity 
      style={styles.gameItem}
      onPress={() => handleGamePress(item)}
        onPressIn={() => handlePressIn(item.id)}
        onPressOut={() => handlePressOut(item.id)}
        activeOpacity={0.9}
    >
        <View style={styles.gameImageContainer}>
      <Image 
            source={getGameThumbnail(item.id)}
        style={styles.gameImage}
      />
        </View>
        <View style={styles.gameGradient} />
      <View style={styles.gameInfo}>
          <Text style={styles.gameName} numberOfLines={1}>{item.name}</Text>
          <View style={styles.gameCategory}>
            <Text style={styles.gameCategoryText} numberOfLines={1}>{item.category}</Text>
          </View>
        </View>
        <View style={styles.badgeContainer}>
          {index === 0 && <View style={styles.hotBadge}><Text style={styles.hotText}>Hot</Text></View>}
          {index === 1 && <View style={styles.newBadge}><Text style={styles.newText}>New</Text></View>}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
  
  const renderCategoryItem = ({ item }: { item: typeof CATEGORIES[0] }) => {
    const scaleAnim = getScaleAnim(`category-${item.id}`);
    
    return (
      <Animated.View style={{
        transform: [{ scale: scaleAnim }]
      }}>
        <TouchableOpacity 
          style={[
            styles.categoryItem,
            selectedCategory === item.id && { backgroundColor: item.color }
          ]}
          onPress={() => setSelectedCategory(item.id)}
          onPressIn={() => handlePressIn(`category-${item.id}`)}
          onPressOut={() => handlePressOut(`category-${item.id}`)}
          activeOpacity={0.9}
        >
          <Ionicons 
            name={item.icon as any} 
            size={22} 
            color={selectedCategory === item.id ? '#ffffff' : item.color} 
          />
          <Text 
            style={[
              styles.categoryName,
              selectedCategory === item.id && styles.categoryNameActive
            ]}
          >
            {item.name}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };
  
  const renderTabButton = (label: string, color: string) => (
    <TouchableOpacity 
      style={[
        styles.tabButton,
        selectedTab === label ? { backgroundColor: color } : styles.tabButtonInactive
      ]}
      onPress={() => setSelectedTab(label)}
    >
      <Text style={[
        styles.tabButtonText,
        selectedTab === label ? styles.tabButtonTextActive : {}
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
  
  // Thêm hàm tìm kiếm game
  const searchGames = (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    
    const normalizedQuery = query.toLowerCase().trim();
    
    // Kết hợp tất cả các game từ các mục khác nhau
    const allGames = [...mostPlayed, ...trendingGames, ...newGames];
    // Loại bỏ các game trùng lặp
    const uniqueGames = allGames.filter((game, index, self) => 
      index === self.findIndex((g) => g.id === game.id)
    );
    
    // Lọc game theo query
    const filtered = uniqueGames.filter(game => 
      game.name.toLowerCase().includes(normalizedQuery) || 
      game.description.toLowerCase().includes(normalizedQuery) ||
      game.category.toLowerCase().includes(normalizedQuery)
    );
    
    setSearchResults(filtered);
  };
  
  // Debounce search để tránh tìm kiếm quá nhiều lần khi người dùng đang nhập
  const debouncedSearch = useCallback((text: string) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      searchGames(text);
    }, 300); // Đợi 300ms sau khi người dùng ngừng nhập
  }, [mostPlayed, trendingGames, newGames]);
  
  // Xử lý khi người dùng thay đổi nội dung tìm kiếm
  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    // Không gọi searchGames ngay lập tức khi người dùng nhập
    if (text.length > 0) {
      setIsSearchActive(true);
      debouncedSearch(text);
    } else {
      // Nếu xóa hết text, reset kết quả tìm kiếm
      setSearchResults([]);
    }
  };

  // Xử lý khi người dùng focus vào ô tìm kiếm
  const handleSearchFocus = () => {
    setIsSearchActive(true);
    // Chỉ hiển thị giao diện tìm kiếm mà không thực hiện tìm kiếm ngay
  };
  
  // Xử lý khi người dùng huỷ tìm kiếm
  const handleCancelSearch = () => {
    // Xóa timeout nếu có
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = null;
    }
    setSearchQuery('');
    setIsSearchActive(false);
    setSearchResults([]);
    Keyboard.dismiss();
  };
  
  // Render một item trong kết quả tìm kiếm
  const renderSearchResultItem = ({ item }: { item: Game }) => {
    // Lấy rating (đánh giá) từ 3.5 đến 5.0 ngẫu nhiên
    const rating = (3.5 + Math.random() * 1.5).toFixed(1);
    
    return (
      <TouchableOpacity 
        style={styles.searchResultItem}
        onPress={() => handleGamePress(item)}
        activeOpacity={0.8}
      >
        <Image 
          source={getGameThumbnail(item.id)}
          style={styles.searchResultImage}
        />
        <View style={styles.searchResultInfo}>
          <Text style={styles.searchResultName} numberOfLines={1}>{item.name}</Text>
          <View style={styles.searchResultCategoryContainer}>
            <Text style={styles.searchResultCategoryText}>{item.category}</Text>
          </View>
          <View style={styles.searchResultStats}>
            <View style={styles.searchResultStat}>
              <Ionicons name="time-outline" size={12} color="#6b7280" />
              <Text style={styles.searchResultStatText}>{item.averageSession}</Text>
            </View>
            <View style={styles.searchResultStat}>
              <Ionicons name="star" size={12} color="#FFD700" />
              <Text style={styles.searchResultStatText}>{rating}</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity 
          style={styles.searchResultPlayButton}
          onPress={() => handleGamePress(item)}
        >
          <Ionicons name="play" size={16} color="#ffffff" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };
  
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6366f1" />
        <Text style={styles.loadingText}>Đang tải games...</Text>
      </View>
    );
  }
  
  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={loadGames}
        >
          <Text style={styles.retryText}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  const filteredGamesByCategory = gamesByCategory[selectedCategory] || [];
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar 
        backgroundColor="transparent" 
        barStyle="light-content"
        translucent={true}
      />
      
      {/* Header - Điều chỉnh header để sử dụng chiều cao StatusBar */}
      <Animated.View style={[
        styles.header, 
        { 
          opacity: headerOpacity,
          width: '100%', // Luôn giữ chiều rộng 100%
          borderBottomLeftRadius: headerBorderRadius,
          borderBottomRightRadius: headerBorderRadius,
          transform: [
            { translateY: headerTranslateY },
            { scaleY: headerHeightPercent.interpolate({
                inputRange: [0, 100],
                outputRange: [1, 0.95] // Giảm độ co lại
              })
            }
          ]
        }
      ]}>
        <Animated.Text style={[
          styles.headerTitle,
          {
            transform: [
              { translateY: headerTranslateY }
            ],
            marginTop: scrollY.interpolate({
              inputRange: [0, 100],
              outputRange: [5, 2], // Giảm marginTop khi scroll
              extrapolate: 'clamp',
            }),
            fontSize: scrollY.interpolate({
              inputRange: [0, 100],
              outputRange: [22, 20],
              extrapolate: 'clamp',
            }),
            // Ẩn tiêu đề khi đang tìm kiếm
            display: isSearchActive ? 'none' : 'flex'
          }
        ]}>
          Danh mục Game
        </Animated.Text>
        <Animated.Text style={[
          styles.headerSubtitle,
          {
            transform: [
              { translateY: headerTranslateY }
            ],
            opacity: scrollY.interpolate({
              inputRange: [0, 100],
              outputRange: [1, 0.9],
              extrapolate: 'clamp',
            }),
            // Ẩn dòng phụ đề khi đang tìm kiếm
            display: isSearchActive ? 'none' : 'flex'
          }
        ]}>
          Chọn game yêu thích để chơi
        </Animated.Text>
        
        {/* Search Bar */}
        <Animated.View style={[
          styles.searchContainer,
          {
            transform: [
              { translateY: headerTranslateY }
            ],
            width: isSearchActive 
              ? '100%' 
              : scrollY.interpolate({
                  inputRange: [0, 100],
                  outputRange: ['95%', '90%'],
                  extrapolate: 'clamp',
                }),
            marginTop: isSearchActive ? 10 : 0
          }
        ]}>
          {isSearchActive && (
            <TouchableOpacity onPress={handleCancelSearch} style={styles.backButton}>
              <Ionicons name="arrow-back" size={22} color="#6b7280" />
            </TouchableOpacity>
          )}
          <Ionicons name="search" size={18} color="#9ca3af" />
          <TextInput 
            style={styles.searchInput}
            placeholder="Tìm kiếm game..."
            value={searchQuery}
            onChangeText={handleSearchChange}
            onFocus={handleSearchFocus}
            returnKeyType="search"
            onSubmitEditing={() => {
              if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
                searchTimeoutRef.current = null;
              }
              searchGames(searchQuery);
            }}
            autoCorrect={false}
            autoCapitalize="none"
            maxLength={50}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={handleCancelSearch}>
              <Ionicons name="close-circle" size={18} color="#9ca3af" />
            </TouchableOpacity>
          )}
        </Animated.View>
      </Animated.View>
      
      {isSearchActive ? (
        /* Hiển thị kết quả tìm kiếm */
        <View style={styles.searchResultsContainer}>
          {searchResults.length > 0 ? (
            <FlatList
              data={searchResults}
              keyExtractor={(item) => item.id}
              renderItem={renderSearchResultItem}
              contentContainerStyle={styles.searchResultsList}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={styles.noResultsContainer}>
              {searchQuery.length > 0 ? (
                <>
                  <Ionicons name="search-outline" size={50} color="#d1d5db" />
                  <Text style={styles.noResultsText}>Không tìm thấy game nào</Text>
                  <Text style={styles.noResultsSubtext}>Thử tìm kiếm với từ khóa khác</Text>
                </>
              ) : (
                <>
                  <Ionicons name="search" size={50} color="#d1d5db" />
                  <Text style={styles.noResultsText}>Tìm kiếm game</Text>
                  <Text style={styles.noResultsSubtext}>Nhập tên game bạn muốn tìm</Text>
                </>
              )}
            </View>
          )}
        </View>
      ) : (
        /* Hiển thị nội dung thông thường */
        <Animated.ScrollView 
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
        >
          <View style={styles.contentContainer}>
            {/* Most Played Section */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Most Played</Text>
              <FlatList
                data={mostPlayed}
                keyExtractor={(item) => item.id}
                renderItem={renderMostPlayedItem}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.mostPlayedContainer}
              />
            </View>
            
            {/* Trending Section */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitleTrending}>TRENDING</Text>
              <FlatList
                data={trendingGames}
                keyExtractor={(item) => item.id}
                renderItem={renderTrendingItem}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.trendingContainer}
                snapToInterval={CARD_WIDTH}
                decelerationRate="fast"
                snapToAlignment="center"
                initialScrollIndex={1}
              />
            </View>
            
            {/* Categories */}
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTitle}>Thể loại</Text>
                <TouchableOpacity onPress={() => navigation.navigate('GameCatalog' as never)}>
                  <Text style={styles.viewAllText}>Xem tất cả</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                data={CATEGORIES}
                keyExtractor={(item) => item.id}
                renderItem={renderCategoryItem}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoriesContainer}
              />
            </View>
            
            {/* Games By Category */}
            <View style={styles.sectionContainer}>
              <View style={styles.gamesGridContainer}>
                <FlatList
                  data={filteredGamesByCategory.slice(0, 6)}
                  keyExtractor={(item) => item.id}
                  renderItem={renderGameItem}
                  numColumns={2}
                  scrollEnabled={false}
                  contentContainerStyle={styles.gamesGrid}
                  columnWrapperStyle={styles.gameColumnWrapper}
                />
              </View>
            </View>
          </View>
        </Animated.ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  contentContainer: {
    paddingTop: 10,
    paddingBottom: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    backgroundColor: '#1e90ff',
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 15) + 5 : 45,
    paddingHorizontal: 16,
    paddingBottom: 15,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 2,
    marginTop: 0,
  },
  headerSubtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#ffffff',
    marginBottom: 12,
    textAlign: 'left',
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 30,
    paddingHorizontal: 16,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: '#1f2937',
  },
  sectionContainer: {
    marginBottom: 24,
    marginTop: 8,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 16,
    marginBottom: 12,
    color: '#1f2937',
  },
  viewAllText: {
    color: '#1e90ff',
    fontWeight: '500',
  },
  sectionTitleTrending: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginBottom: 12,
    color: '#1e90ff',
    textTransform: 'uppercase',
  },
  mostPlayedContainer: {
    paddingHorizontal: 16,
  },
  mostPlayedItem: {
    alignItems: 'center',
    marginRight: 20,
    width: 70,
  },
  mostPlayedImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  mostPlayedImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  mostPlayedName: {
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
    width: 70,
    color: '#1f2937',
  },
  trendingContainer: {
    paddingHorizontal: 8,
    paddingVertical: 10,
  },
  trendingCard: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 16,
    overflow: 'hidden',
    marginHorizontal: 8,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    transform: [{ scale: 0.95 }],
  },
  trendingCardActive: {
    transform: [{ scale: 1 }],
    shadowOpacity: 0.2,
    elevation: 8,
  },
  trendingImageContainer: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  trendingImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  trendingGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '70%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    backgroundImage: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)',
  },
  trendingContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  trendingBadge: {
    backgroundColor: '#1e90ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  trendingBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  trendingName: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  trendingCategory: {
    color: '#e5e7eb',
    fontSize: 12,
    marginBottom: 8,
  },
  trendingStats: {
    flexDirection: 'row',
    marginTop: 4,
  },
  trendingStat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  trendingStatText: {
    color: '#e5e7eb',
    fontSize: 12,
    marginLeft: 4,
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 30,
    marginRight: 12,
    marginBottom: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
    color: '#1f2937',
  },
  categoryNameActive: {
    color: '#ffffff',
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  tabButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 10,
  },
  tabButtonInactive: {
    backgroundColor: '#f0f0f0',
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  tabButtonTextActive: {
    color: '#ffffff',
  },
  gamesGridContainer: {
    paddingHorizontal: 16,
    marginTop: 8,
  },
  gamesGrid: {
    justifyContent: 'space-between',
  },
  gameColumnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  gameItem: {
    width: (width - 32 - 12) / 2,
    height: 140,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  gameImageContainer: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  gameImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  gameGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  gameInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
  },
  gameName: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  gameCategory: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  gameCategoryText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '600',
  },
  badgeContainer: {
    position: 'absolute',
    top: 8,
    left: 8,
  },
  hotBadge: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  hotText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  newBadge: {
    backgroundColor: '#8b5cf6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  newText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginBottom: 16,
    textAlign: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#6366f1',
  },
  retryButton: {
    backgroundColor: '#1e90ff',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  // Thêm styles mới cho tìm kiếm
  backButton: {
    marginRight: 8,
  },
  searchResultsContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  searchResultsList: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 30,
  },
  searchResultItem: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    alignItems: 'center',
  },
  searchResultImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#f3f4f6',
  },
  searchResultInfo: {
    flex: 1,
  },
  searchResultName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  searchResultCategoryContainer: {
    backgroundColor: '#e0e7ff',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  searchResultCategoryText: {
    color: '#1e90ff',
    fontSize: 12,
    fontWeight: '600',
  },
  searchResultStats: {
    flexDirection: 'row',
  },
  searchResultStat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  searchResultStatText: {
    fontSize: 11,
    color: '#6b7280',
    marginLeft: 4,
  },
  searchResultPlayButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1e90ff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#9ca3af',
    marginTop: 16,
  },
  noResultsSubtext: {
    fontSize: 14,
    color: '#d1d5db',
    marginTop: 4,
    textAlign: 'center',
  },
});

export default HomeScreen; 