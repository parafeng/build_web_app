import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Alert,
  SafeAreaView,
  Image,
  Dimensions,
  TextInput,
  FlatList,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as WebBrowser from 'expo-web-browser';
import { Ionicons } from '@expo/vector-icons';
import gamezopService from '../../api/gamezopService';
import GamezopEmbed from '../../components/game/GamezopEmbed';
import gameImagesConfig from '../../assets/images/games/gameImages.config';

const { width, height } = Dimensions.get('window');

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

interface RouteParams {
  game: Game;
}

interface Comment {
  id: string;
  user: string;
  text: string;
  rating: number;
  date: string;
  likes: number;
  userLiked: boolean;
}

const FILTERS = ['Tất cả', 'Mới nhất', '5 sao', '4 sao', '3 sao', '1-2 sao'];

const GameScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { game } = route.params as RouteParams;
  
  const [gameInfo, setGameInfo] = useState<Game>(game);
  const [showGameEmbed, setShowGameEmbed] = useState(false);
  const [similarGames, setSimilarGames] = useState<Game[]>([]);
  const [userRating, setUserRating] = useState(0);
  const [comments, setComments] = useState<Comment[]>([
    {id: '1', user: 'MinhGamer', text: 'Game hay quá! Đồ họa đẹp, gameplay hấp dẫn.', rating: 5, date: '05/06/2023', likes: 12, userLiked: false},
    {id: '2', user: 'HungPro', text: 'Khá thú vị nhưng hơi khó ở level 5.', rating: 4, date: '28/05/2023', likes: 5, userLiked: false},
    {id: '3', user: 'ThuThao123', text: 'Rất giải trí, tôi đã chơi hàng giờ liền.', rating: 5, date: '15/04/2023', likes: 8, userLiked: false},
    {id: '4', user: 'GameMaster', text: 'Hơi đơn giản nhưng phù hợp để giải trí khi rảnh.', rating: 3, date: '10/03/2023', likes: 2, userLiked: false},
    {id: '5', user: 'PixelPlayer', text: 'Điều khiển hơi khó, cần cải thiện thêm.', rating: 2, date: '28/02/2023', likes: 3, userLiked: false},
  ]);
  const [newComment, setNewComment] = useState('');
  const [showAllComments, setShowAllComments] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('Tất cả');
  const [isRatingModalVisible, setIsRatingModalVisible] = useState(false);
  const [tempRating, setTempRating] = useState(0);
  const [loadingRecommendations, setLoadingRecommendations] = useState(true);
  const [hasUserRated, setHasUserRated] = useState(false);

  useEffect(() => {
    // Tạo URLs cho game từ gamezopService
    const embedUrl = gamezopService.getEmbedUrl(game.id);
    const gameUrl = gamezopService.getGameUrl(game.id);
    
    setGameInfo({
      ...game,
      embedUrl,
      gameUrl
    });
  }, [game.id]);

  useEffect(() => {
    // Lấy các game tương tự dựa trên thể loại
    const loadSimilarGames = async () => {
      setLoadingRecommendations(true);
      try {
        const allGames = await gamezopService.getGames(game.category, 10);
        // Lọc bỏ game hiện tại và giới hạn còn 4 game
        const filtered = allGames.filter(g => g.id !== game.id).slice(0, 4);
        setSimilarGames(filtered);
      } catch (error) {
        console.error('Error loading similar games:', error);
      } finally {
        setLoadingRecommendations(false);
      }
    };
    
    loadSimilarGames();
    
    // Kiểm tra nếu người dùng đã đánh giá game này trước đó
    const checkUserRating = () => {
      // Giả lập lưu trữ cục bộ - trong ứng dụng thực tế sẽ sử dụng AsyncStorage
      const savedRating = Math.floor(Math.random() * 6); // Giả lập đánh giá từ 0-5 sao
      if (savedRating > 0) {
        setUserRating(savedRating);
        setHasUserRated(true);
      }
    };
    
    checkUserRating();
  }, [game.id, game.category]);

  const handlePlayGame = () => {
    // All games are now Gamezop games, so use WebView embed for all
    setShowGameEmbed(true);
  };

  const handlePlayGameExternal = async () => {
    try {
      await WebBrowser.openBrowserAsync(gameInfo.gameUrl);
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể mở game trong trình duyệt');
    }
  };

  const handleCloseGameEmbed = () => {
    setShowGameEmbed(false);
  };

  const handleBack = () => {
    navigation.goBack();
  };

  // Hàm lấy hình ảnh thumbnail từ local assets nếu có
  const getGameThumbnail = (gameId: string) => {
    // Thử lấy hình ảnh từ local assets
    const localImage = gameImagesConfig.getGameThumbnail(gameId);
    if (localImage) {
      return localImage;
    }
    
    // Nếu không có, sử dụng URL từ game object
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
    if (game?.thumbnail) {
      return { uri: game.thumbnail };
    }
    
    // Fallback cho default
    return gameImagesConfig.GameBanners.default;
  };

  const showGameInfo = () => {
    Alert.alert(
      'Thông tin Game',
      `Tên game: ${game.name}\nThể loại: ${game.category}\n\nThời gian chơi trung bình: ${game.averageSession}`,
      [
        { text: 'Đóng', style: 'cancel' }
      ]
    );
  };

  const handleAddComment = () => {
    if (newComment.trim() === '' || userRating === 0) {
      Alert.alert('Thông báo', 'Vui lòng nhập nội dung và đánh giá số sao trước khi gửi.');
      return;
    }
    
    const newCommentObj = {
      id: Date.now().toString(),
      user: 'Người dùng',
      text: newComment,
      rating: userRating,
      date: new Date().toLocaleDateString('vi-VN'),
      likes: 0,
      userLiked: false
    };
    
    setComments([newCommentObj, ...comments]);
    setNewComment('');
    // Không reset userRating ở đây vì đã đánh giá rồi
  };

  const handleLikeComment = (commentId: string) => {
    setComments(comments.map(comment => {
      if (comment.id === commentId) {
        const userLiked = !comment.userLiked;
        return {
          ...comment,
          likes: userLiked ? comment.likes + 1 : comment.likes - 1,
          userLiked
        };
      }
      return comment;
    }));
  };

  const navigateToGame = (selectedGame: Game) => {
    // @ts-ignore
    navigation.push('GameScreen', { game: selectedGame });
  };
  
  const handleRateGame = () => {
    setTempRating(userRating || 0);
    setIsRatingModalVisible(true);
  };
  
  const submitRating = () => {
    setUserRating(tempRating);
    setHasUserRated(true);
    setIsRatingModalVisible(false);
    
    // Giả lập lưu đánh giá vào API hoặc bộ nhớ cục bộ
    Alert.alert('Cảm ơn bạn!', 'Đánh giá của bạn đã được ghi nhận.');
  };
  
  const getFilteredComments = () => {
    if (selectedFilter === 'Tất cả') return comments;
    if (selectedFilter === 'Mới nhất') {
      return [...comments].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
    
    if (selectedFilter === '5 sao') return comments.filter(c => c.rating === 5);
    if (selectedFilter === '4 sao') return comments.filter(c => c.rating === 4);
    if (selectedFilter === '3 sao') return comments.filter(c => c.rating === 3);
    if (selectedFilter === '1-2 sao') return comments.filter(c => c.rating <= 2);
    
    return comments;
  };
  
  const renderCommentItem = ({ item }: { item: Comment }) => (
    <View style={styles.commentItem}>
      <View style={styles.commentHeader}>
        <View style={styles.userInfo}>
          <View style={styles.userAvatar}>
            <Text style={styles.userInitial}>{item.user.charAt(0)}</Text>
          </View>
          <Text style={styles.userName}>{item.user}</Text>
        </View>
        <View style={styles.commentRating}>
          {[1, 2, 3, 4, 5].map(star => (
            <Ionicons 
              key={star} 
              name={star <= item.rating ? "star" : "star-outline"} 
              size={14} 
              color="#FFD700" 
            />
          ))}
        </View>
      </View>
      <Text style={styles.commentText}>{item.text}</Text>
      <View style={styles.commentFooter}>
        <Text style={styles.commentDate}>{item.date}</Text>
        <TouchableOpacity 
          style={styles.likeButton}
          onPress={() => handleLikeComment(item.id)}
        >
          <Ionicons 
            name={item.userLiked ? "heart" : "heart-outline"} 
            size={16} 
            color={item.userLiked ? "#ef4444" : "#6b7280"} 
          />
          <Text style={[styles.likeCount, item.userLiked && styles.likedText]}>
            {item.likes}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  
  const renderSimilarGameItem = ({ item }: { item: Game }) => (
    <TouchableOpacity 
      style={styles.similarGameItem} 
      onPress={() => navigateToGame(item)}
    >
      <Image 
        source={getGameThumbnail(item.id)} 
        style={styles.similarGameImage}
      />
      <Text style={styles.similarGameName} numberOfLines={2}>{item.name}</Text>
      <View style={styles.similarGameFooter}>
        <Text style={styles.similarGameCategory}>{item.category}</Text>
        <View style={styles.miniRating}>
          <Ionicons name="star" size={12} color="#FFD700" />
          <Text style={styles.miniRatingText}>4.{Math.floor(Math.random() * 10)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
  
  const renderFilterItem = (filter: string) => (
    <TouchableOpacity
      key={filter}
      style={[
        styles.filterItem,
        selectedFilter === filter && styles.activeFilterItem
      ]}
      onPress={() => setSelectedFilter(filter)}
    >
      <Text
        style={[
          styles.filterText,
          selectedFilter === filter && styles.activeFilterText
        ]}
      >
        {filter}
      </Text>
    </TouchableOpacity>
  );
  
  const renderRatingModal = () => (
    <Modal
      visible={isRatingModalVisible}
      transparent
      animationType="fade"
      onRequestClose={() => setIsRatingModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.ratingModalContainer}>
          <Text style={styles.ratingModalTitle}>Đánh giá game</Text>
          <Text style={styles.ratingModalSubtitle}>Hãy chia sẻ đánh giá của bạn về {game.name}</Text>
          
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map(star => (
              <TouchableOpacity 
                key={star}
                onPress={() => setTempRating(star)}
              >
                <Ionicons 
                  name={star <= tempRating ? "star" : "star-outline"} 
                  size={40} 
                  color="#FFD700" 
                  style={styles.starIcon}
                />
              </TouchableOpacity>
            ))}
          </View>
          
          <Text style={styles.ratingModalDesc}>
            {tempRating === 1 && 'Rất tệ'}
            {tempRating === 2 && 'Không tốt'}
            {tempRating === 3 && 'Bình thường'}
            {tempRating === 4 && 'Tốt'}
            {tempRating === 5 && 'Tuyệt vời!'}
          </Text>
          
          <View style={styles.ratingModalButtons}>
            <TouchableOpacity 
              style={[styles.ratingModalButton, styles.ratingModalCancelButton]} 
              onPress={() => setIsRatingModalVisible(false)}
            >
              <Text style={styles.ratingModalCancelText}>Hủy</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.ratingModalButton, styles.ratingModalSubmitButton]} 
              onPress={submitRating}
              disabled={tempRating === 0}
            >
              <Text style={styles.ratingModalSubmitText}>Gửi đánh giá</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  // Hiển thị game fullscreen nếu là Gamezop game
  if (showGameEmbed && gameInfo.embedUrl) {
    return (
      <GamezopEmbed
        gameUrl={gameInfo.embedUrl}
        gameName={game.name}
        onClose={handleCloseGameEmbed}
      />
    );
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <StatusBar backgroundColor="#1f2937" barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        
        <View style={styles.headerInfo}>
          <Text style={styles.gameTitle}>{game.name}</Text>
          <Text style={styles.gameCategory}>{game.category}</Text>
        </View>
        
        <TouchableOpacity style={styles.infoButton} onPress={showGameInfo}>
          <Ionicons name="information-circle-outline" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Game Preview */}
        <View style={styles.gamePreview}>
          <Image 
            source={getGameBanner(game.id)} 
            style={styles.gameImage} 
          />
          <View style={styles.gameOverlay}>
            <Ionicons name="game-controller-outline" size={80} color="#ffffff" />
          </View>
        </View>

        {/* Game Details */}
        <View style={styles.gameDetails}>
          <View style={styles.gameHeader}>
            <Image 
              source={getGameThumbnail(game.id)}
              style={styles.gameThumbnail}
            />
            <View style={styles.gameTitleContainer}>
              <Text style={styles.gameName}>{game.name}</Text>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryBadgeText}>{game.category}</Text>
              </View>
              
              <TouchableOpacity 
                style={styles.ratingButtonContainer} 
                onPress={handleRateGame}
              >
                <View style={styles.ratingContainer}>
                  <Ionicons name="star" size={16} color="#FFD700" />
                  <Ionicons name="star" size={16} color="#FFD700" />
                  <Ionicons name="star" size={16} color="#FFD700" />
                  <Ionicons name="star" size={16} color="#FFD700" />
                  <Ionicons name="star-half" size={16} color="#FFD700" />
                  <Text style={styles.ratingText}>4.5</Text>
                </View>
                
                {hasUserRated ? (
                  <View style={styles.userRatingContainer}>
                    <Text style={styles.userRatingLabel}>Đánh giá của bạn: </Text>
                    <View style={styles.userRatingStars}>
                      {[1, 2, 3, 4, 5].map(star => (
                        <Ionicons 
                          key={star}
                          name={star <= userRating ? "star" : "star-outline"} 
                          size={14} 
                          color="#FFD700" 
                        />
                      ))}
                    </View>
                  </View>
                ) : (
                  <Text style={styles.tapToRateText}>Nhấn để đánh giá</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
          
          <Text style={styles.gameDescription}>{game.description}</Text>
          
          <View style={styles.gameStats}>
            <View style={styles.gameInfoItem}>
              <Ionicons name="time-outline" size={20} color="#1e90ff" />
              <Text style={styles.gameInfoText}>{game.averageSession}</Text>
            </View>
            <View style={styles.gameInfoItem}>
              <Ionicons name="people-outline" size={20} color="#1e90ff" />
              <Text style={styles.gameInfoText}>{game.playCount} người chơi</Text>
            </View>
          </View>
          
          {/* Similar Games Section */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Các game tương tự</Text>
              <TouchableOpacity 
                onPress={() => navigation.navigate('GameCatalog' as never)}
                style={styles.seeAllButton}
              >
                <Text style={styles.seeAllText}>Xem tất cả</Text>
                <Ionicons name="chevron-forward" size={16} color="#1e90ff" />
              </TouchableOpacity>
            </View>
            
            {loadingRecommendations ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#1e90ff" />
                <Text style={styles.loadingText}>Đang tải...</Text>
              </View>
            ) : similarGames.length > 0 ? (
              <FlatList
                data={similarGames}
                renderItem={renderSimilarGameItem}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.similarGamesContainer}
              />
            ) : (
              <Text style={styles.noItemsText}>Không tìm thấy game tương tự.</Text>
            )}
          </View>
          
          {/* Comments Section */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Đánh giá & Bình luận</Text>
              <Text style={styles.commentCount}>{comments.length} đánh giá</Text>
            </View>
            
            {/* Filter Comments */}
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filtersContainer}
            >
              {FILTERS.map(renderFilterItem)}
            </ScrollView>
            
            {/* Add Comment */}
            <View style={styles.addCommentContainer}>
              <TextInput
                style={styles.commentInput}
                placeholder="Chia sẻ ý kiến của bạn..."
                value={newComment}
                onChangeText={setNewComment}
                multiline
              />
              <TouchableOpacity 
                style={[
                  styles.addCommentButton,
                  (newComment.trim() === '' || userRating === 0) && styles.disabledButton
                ]} 
                onPress={handleAddComment}
                disabled={newComment.trim() === '' || userRating === 0}
              >
                <Ionicons name="send" size={20} color="#ffffff" />
              </TouchableOpacity>
            </View>
            
            {!hasUserRated && (
              <Text style={styles.ratingReminder}>
                Hãy đánh giá game trước khi bình luận
              </Text>
            )}
            
            {/* Comments List */}
            {getFilteredComments().length > 0 ? (
              <>
                {(showAllComments ? getFilteredComments() : getFilteredComments().slice(0, 2)).map((comment) => (
                  <View key={comment.id}>
                    {renderCommentItem({ item: comment })}
                  </View>
                ))}
                
                {getFilteredComments().length > 2 && (
                  <TouchableOpacity 
                    style={styles.showMoreButton}
                    onPress={() => setShowAllComments(!showAllComments)}
                  >
                    <Text style={styles.showMoreText}>
                      {showAllComments ? 'Ẩn bớt' : `Xem thêm ${getFilteredComments().length - 2} bình luận`}
                    </Text>
                  </TouchableOpacity>
                )}
              </>
            ) : (
              <Text style={styles.noCommentsText}>
                Không có bình luận nào phù hợp với bộ lọc đã chọn.
              </Text>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.playButton} onPress={handlePlayGame}>
          <Ionicons name="play" size={24} color="#ffffff" />
          <Text style={styles.playButtonText}>Chơi Ngay</Text>
        </TouchableOpacity>
      </View>

      {/* Rating Modal */}
      {renderRatingModal()}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 50,
    backgroundColor: '#1f2937',
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#374151',
  },
  headerInfo: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 16,
  },
  gameTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
  },
  gameCategory: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 2,
  },
  infoButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#374151',
  },
  gamePreview: {
    height: height * 0.3,
    position: 'relative',
  },
  gameImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#e5e7eb',
  },
  gameOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameDetails: {
    flex: 1,
    padding: 20,
  },
  gameHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  gameThumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  gameTitleContainer: {
    flex: 1,
  },
  gameName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 8,
  },
  gameDescription: {
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 22,
    marginBottom: 20,
  },
  categoryBadge: {
    backgroundColor: '#EBF4FF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  categoryBadgeText: {
    color: '#3B82F6',
    fontSize: 12,
    fontWeight: '600',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 4,
  },
  gameStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  gameInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gameInfoText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '600',
    marginLeft: 8,
  },
  actionButtons: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  playButton: {
    backgroundColor: '#1e90ff',
    padding: 15,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1e90ff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    marginTop: 20,
  },
  playButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 8,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 16,
  },
  similarGamesContainer: {
    paddingRight: 16,
  },
  similarGameItem: {
    width: 120,
    marginRight: 12,
  },
  similarGameImage: {
    width: 120,
    height: 80,
    borderRadius: 8,
    marginBottom: 8,
  },
  similarGameName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  similarGameCategory: {
    fontSize: 12,
    color: '#6b7280',
  },
  similarGameFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  miniRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  miniRatingText: {
    fontSize: 10,
    color: '#6b7280',
    marginLeft: 2,
  },
  filtersContainer: {
    paddingBottom: 16,
  },
  filterItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
    marginRight: 8,
  },
  activeFilterItem: {
    backgroundColor: '#1e90ff',
  },
  filterText: {
    color: '#6b7280',
    fontSize: 14,
    fontWeight: '500',
  },
  activeFilterText: {
    color: '#ffffff',
  },
  commentItem: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1e90ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  userInitial: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 16,
  },
  userName: {
    fontWeight: '600',
    fontSize: 14,
    color: '#1f2937',
  },
  commentRating: {
    flexDirection: 'row',
  },
  commentText: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
    marginBottom: 8,
  },
  commentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  commentDate: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'right',
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeCount: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 4,
  },
  likedText: {
    color: '#ef4444',
  },
  showMoreButton: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  showMoreText: {
    color: '#1e90ff',
    fontWeight: '600',
    fontSize: 14,
  },
  noCommentsText: {
    textAlign: 'center',
    color: '#6b7280',
    fontSize: 14,
    fontStyle: 'italic',
    padding: 16,
  },
  ratingButtonContainer: {
    marginTop: 4,
  },
  userRatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  userRatingLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  userRatingStars: {
    flexDirection: 'row',
  },
  tapToRateText: {
    fontSize: 12,
    color: '#1e90ff',
    marginTop: 4,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    color: '#1e90ff',
    fontWeight: '500',
    fontSize: 14,
  },
  commentCount: {
    color: '#6b7280',
    fontSize: 14,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    color: '#6b7280',
    fontSize: 14,
  },
  noItemsText: {
    textAlign: 'center',
    color: '#6b7280',
    fontStyle: 'italic',
    padding: 20,
  },
  ratingReminder: {
    fontSize: 12,
    color: '#ef4444',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 16,
  },
  disabledButton: {
    backgroundColor: '#d1d5db',
  },
  addCommentContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    paddingTop: 12,
    fontSize: 14,
    color: '#1f2937',
    backgroundColor: '#ffffff',
    minHeight: 80,
  },
  addCommentButton: {
    backgroundColor: '#1e90ff',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  ratingModalContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  ratingModalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 8,
  },
  ratingModalSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 20,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  starIcon: {
    marginHorizontal: 5,
  },
  ratingModalDesc: {
    fontSize: 16,
    color: '#1f2937',
    fontWeight: '600',
    marginBottom: 24,
    height: 20,
  },
  ratingModalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  ratingModalButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  ratingModalCancelButton: {
    backgroundColor: '#f3f4f6',
  },
  ratingModalSubmitButton: {
    backgroundColor: '#1e90ff',
  },
  ratingModalCancelText: {
    color: '#6b7280',
    fontWeight: '600',
    fontSize: 16,
  },
  ratingModalSubmitText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
  relatedGameCategory: {
    backgroundColor: '#1e90ff',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    marginBottom: 5,
  },
  categoryButton: {
    backgroundColor: '#1e90ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 10,
  },
  recommendedGameTag: {
    backgroundColor: '#1e90ff',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
});

export default GameScreen; 