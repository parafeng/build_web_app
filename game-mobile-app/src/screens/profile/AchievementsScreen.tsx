import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  StatusBar, 
  TouchableOpacity, 
  ActivityIndicator,
  Platform
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { Ionicons } from '@expo/vector-icons';
import { RootState } from '../../redux/types';
import { fetchAchievements } from '../../redux/actions/achievementActions';
import AchievementItem from '../../components/ui/AchievementItem';
import AchievementService from '../../utils/AchievementService';
import { ScrollView } from 'react-native-gesture-handler';

type CategoryFilter = 'all' | 'completed' | 'inprogress' | 'gameplay' | 'progression' | 'social' | 'collection';

// Define valid Ionicons names for type safety
type IconName = 
  | 'grid' 
  | 'checkmark-circle' 
  | 'time' 
  | 'game-controller' 
  | 'trending-up' 
  | 'people' 
  | 'albums'
  | 'trophy';

const AchievementsScreen: React.FC = () => {
  const dispatch = useDispatch<ThunkDispatch<RootState, any, AnyAction>>();
  const { achievements, loading } = useSelector((state: RootState) => state.achievements);
  const [filter, setFilter] = useState<CategoryFilter>('all');
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    percentComplete: 0
  });

  // Lấy dữ liệu thành tích khi màn hình được tải
  useEffect(() => {
    dispatch(fetchAchievements());
  }, [dispatch]);

  // Tính toán thống kê thành tích
  useEffect(() => {
    if (achievements && achievements.length > 0) {
      const completedCount = achievements.filter(a => a.completed).length;
      const total = achievements.length;
      const percent = Math.round((completedCount / total) * 100);
      
      setStats({
        total,
        completed: completedCount,
        percentComplete: percent
      });
    }
  }, [achievements]);

  // Lọc thành tích dựa trên bộ lọc hiện tại
  const filteredAchievements = React.useMemo(() => {
    if (!achievements || achievements.length === 0) {
      return [];
    }

    switch (filter) {
      case 'completed':
        return achievements.filter(a => a.completed);
      case 'inprogress':
        return achievements.filter(a => !a.completed);
      case 'gameplay':
        return achievements.filter(a => a.category === 'gameplay');
      case 'progression':
        return achievements.filter(a => a.category === 'progression');
      case 'social':
        return achievements.filter(a => a.category === 'social');
      case 'collection':
        return achievements.filter(a => a.category === 'collection');
      case 'all':
      default:
        return achievements;
    }
  }, [achievements, filter]);

  // Xử lý khi nhấn vào thành tích
  const handleAchievementPress = (id: string) => {
    // Có thể thêm logic hiển thị chi tiết thành tích tại đây
    console.log(`Achievement pressed: ${id}`);
  };

  // Render từng filter tab
  const renderFilterTab = (type: CategoryFilter, label: string, iconName: IconName) => (
    <TouchableOpacity 
      style={[styles.filterTab, filter === type && styles.activeFilterTab]}
      onPress={() => setFilter(type)}
    >
      <Ionicons 
        name={`${iconName}-outline` as any} 
        size={16} 
        color={filter === type ? '#FFFFFF' : '#78909C'} 
      />
      <Text style={[
        styles.filterTabText, 
        filter === type && styles.activeFilterTabText
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#2196F3" barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Thành tích</Text>
      </View>
      
      {/* Stats Section */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.total}</Text>
          <Text style={styles.statLabel}>Tổng số</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.completed}</Text>
          <Text style={styles.statLabel}>Đã hoàn thành</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.percentComplete}%</Text>
          <Text style={styles.statLabel}>Hoàn thành</Text>
        </View>
      </View>
      
      {/* Filter Tabs */}
      <View style={styles.filtersContainer}>
        <ScrollView 
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersScrollContent}
        >
          {renderFilterTab('all', 'Tất cả', 'grid')}
          {renderFilterTab('completed', 'Đã hoàn thành', 'checkmark-circle')}
          {renderFilterTab('inprogress', 'Đang thực hiện', 'time')}
          {renderFilterTab('gameplay', 'Gameplay', 'game-controller')}
          {renderFilterTab('progression', 'Tiến trình', 'trending-up')}
          {renderFilterTab('social', 'Xã hội', 'people')}
          {renderFilterTab('collection', 'Bộ sưu tập', 'albums')}
        </ScrollView>
      </View>
      
      {/* Achievements List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2196F3" />
          <Text style={styles.loadingText}>Đang tải thành tích...</Text>
        </View>
      ) : (
        filteredAchievements.length > 0 ? (
          <FlatList
            data={filteredAchievements}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <AchievementItem 
                achievement={item} 
                onPress={handleAchievementPress}
              />
            )}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="trophy-outline" size={64} color="#CFD8DC" />
            <Text style={styles.emptyText}>
              {filter === 'all' 
                ? 'Chưa có thành tích nào.' 
                : `Không có thành tích nào trong mục "${filter}".`}
            </Text>
          </View>
        )
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    backgroundColor: '#2196F3',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 15 : 40,
    paddingBottom: 15,
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: -8,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#78909C',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#ECEFF1',
    marginVertical: 5,
  },
  filtersContainer: {
    marginBottom: 16,
  },
  filtersScrollContent: {
    paddingHorizontal: 16,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  activeFilterTab: {
    backgroundColor: '#2196F3',
  },
  filterTabText: {
    fontSize: 14,
    color: '#78909C',
    marginLeft: 6,
  },
  activeFilterTabText: {
    color: '#FFFFFF',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#78909C',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#78909C',
    textAlign: 'center',
    marginTop: 16,
  },
});

export default AchievementsScreen; 