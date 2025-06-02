import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Achievement } from '../../redux/types';

interface AchievementItemProps {
  achievement: Achievement;
  onPress?: (id: string) => void;
}

const AchievementItem: React.FC<AchievementItemProps> = ({ achievement, onPress }) => {
  const [animation] = useState(new Animated.Value(0));
  const [showDetails, setShowDetails] = useState(false);
  
  // Tính phần trăm hoàn thành
  const progressPercent = achievement.progress 
    ? Math.min(100, (achievement.progress / achievement.requirement) * 100) 
    : 0;
  
  // Hiệu ứng animation khi component xuất hiện
  useEffect(() => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true
    }).start();
  }, []);
  
  // Xử lý khi nhấn vào thành tích
  const handlePress = () => {
    setShowDetails(!showDetails);
    if (onPress) {
      onPress(achievement.id);
    }
  };
  
  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: animation,
          transform: [{ translateY: animation.interpolate({
            inputRange: [0, 1],
            outputRange: [20, 0]
          })}]
        }
      ]}
    >
      <TouchableOpacity 
        style={[styles.achievementCard, achievement.completed && styles.completedCard]} 
        onPress={handlePress}
        activeOpacity={0.8}
      >
        {/* Icon Container */}
        <View style={[
          styles.iconContainer, 
          achievement.completed ? styles.completedIconContainer : styles.lockedIconContainer
        ]}>
          <Text style={styles.achievementIcon}>{achievement.icon}</Text>
        </View>
        
        {/* Info Container */}
        <View style={styles.infoContainer}>
          <Text style={styles.title}>{achievement.title}</Text>
          <Text style={styles.description}>{achievement.description}</Text>
          
          {/* Progress Bar */}
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: `${progressPercent}%` }]} />
          </View>
          
          {/* Progress Text */}
          <Text style={styles.progressText}>
            {achievement.progress || 0}/{achievement.requirement} ({Math.round(progressPercent)}%)
          </Text>
        </View>
        
        {/* Status Icon */}
        <View style={styles.statusContainer}>
          {achievement.completed ? (
            <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
          ) : (
            <Ionicons name="lock-closed" size={20} color="#9E9E9E" />
          )}
        </View>
      </TouchableOpacity>
      
      {/* Details Section (shows when expanded) */}
      {showDetails && (
        <View style={styles.detailsContainer}>
          {achievement.rewardCoins && (
            <View style={styles.rewardContainer}>
              <Text style={styles.rewardTitle}>Phần thưởng:</Text>
              <Text style={styles.rewardValue}>{achievement.rewardCoins} coins</Text>
            </View>
          )}
          
          {achievement.dateCompleted && (
            <View style={styles.dateContainer}>
              <Text style={styles.dateTitle}>Hoàn thành:</Text>
              <Text style={styles.dateValue}>
                {new Date(achievement.dateCompleted).toLocaleDateString()}
              </Text>
            </View>
          )}
          
          <Text style={styles.categoryTag}>
            {getCategoryName(achievement.category)}
          </Text>
        </View>
      )}
    </Animated.View>
  );
};

// Helper function to get friendly category names
const getCategoryName = (category: string): string => {
  switch(category) {
    case 'gameplay':
      return 'Gameplay';
    case 'social':
      return 'Social';
    case 'progression':
      return 'Progression';
    case 'collection':
      return 'Collection';
    default:
      return category;
  }
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  completedCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  completedIconContainer: {
    backgroundColor: '#E8F5E9',
  },
  lockedIconContainer: {
    backgroundColor: '#F5F5F5',
  },
  achievementIcon: {
    fontSize: 22,
  },
  infoContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#263238',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#78909C',
    marginBottom: 6,
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: '#ECEFF1',
    borderRadius: 2,
    marginBottom: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: '#90A4AE',
  },
  statusContainer: {
    marginLeft: 8,
  },
  detailsContainer: {
    backgroundColor: '#F8F9FA',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    padding: 12,
    marginTop: -4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  rewardContainer: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  rewardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#455A64',
    marginRight: 8,
  },
  rewardValue: {
    fontSize: 14,
    color: '#FF9800',
    fontWeight: 'bold',
  },
  dateContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  dateTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#455A64',
    marginRight: 8,
  },
  dateValue: {
    fontSize: 14,
    color: '#455A64',
  },
  categoryTag: {
    alignSelf: 'flex-start',
    backgroundColor: '#E0E0E0',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    fontSize: 12,
    color: '#616161',
  },
});

export default AchievementItem; 