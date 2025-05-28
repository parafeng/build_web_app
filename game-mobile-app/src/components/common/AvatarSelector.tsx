import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
  Dimensions,
  ScrollView,
  Animated
} from 'react-native';
import { 
  ALL_AVATARS, 
  AVATAR_CATEGORIES, 
  getAvatarsByCategory,
  isAvatarUnlocked 
} from '../../assets/avatars/avatars.config';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface AvatarSelectorProps {
  visible: boolean;
  onClose: () => void;
  onSelectAvatar: (avatarId: string) => void;
  currentAvatarId?: string;
  userLevel?: number;
  userCoins?: number;
}

const AvatarSelector: React.FC<AvatarSelectorProps> = ({
  visible,
  onClose,
  onSelectAvatar,
  currentAvatarId,
  userLevel = 1,
  userCoins = 0
}) => {
  const [selectedCategory, setSelectedCategory] = useState(AVATAR_CATEGORIES.DEFAULT);
  const [selectedAvatarId, setSelectedAvatarId] = useState<string | undefined>(currentAvatarId);
  const [animation] = useState(new Animated.Value(0));
  
  // Update selected avatar when props change
  useEffect(() => {
    setSelectedAvatarId(currentAvatarId);
  }, [currentAvatarId]);
  
  // Tự động chọn category Animals khi component mở
  useEffect(() => {
    if (visible) {
      console.log("AvatarSelector is now visible");
      setSelectedCategory(AVATAR_CATEGORIES.ANIMALS);
      console.log("Automatically selected ANIMALS category");
    }
  }, [visible]);
  
  // Animation when modal is shown
  useEffect(() => {
    if (visible) {
      Animated.spring(animation, {
        toValue: 1,
        friction: 8,
        tension: 45,
        useNativeDriver: true
      }).start();
    } else {
      animation.setValue(0);
    }
  }, [visible, animation]);
  
  const categories = [
    { key: AVATAR_CATEGORIES.DEFAULT, label: 'Mặc Định', icon: 'happy-outline' },
    { key: AVATAR_CATEGORIES.CHARACTERS, label: 'Nhân Vật', icon: 'people-outline' },
    { key: AVATAR_CATEGORIES.ANIMALS, label: 'Động Vật', icon: 'paw-outline' },
  ];

  const handleSelectAvatar = (avatarId: string) => {
    console.log("Selected avatar:", avatarId);
    setSelectedAvatarId(avatarId);
  };
  
  const handleConfirmSelection = () => {
    console.log("Confirming selection:", selectedAvatarId);
    if (selectedAvatarId) {
      onSelectAvatar(selectedAvatarId);
    }
  };

  const handleSelectCategory = (category: string) => {
    console.log("Selecting category:", category);
    setSelectedCategory(category);
  };

  const renderCategoryTab = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[
        styles.categoryTab,
        selectedCategory === item.key && styles.activeCategoryTab
      ]}
      onPress={() => handleSelectCategory(item.key)}
      activeOpacity={0.8}
    >
      <Ionicons 
        name={item.icon} 
        size={18} 
        color={selectedCategory === item.key ? '#ffffff' : '#1e90ff'} 
        style={styles.categoryIcon} 
      />
      <Text style={[
        styles.categoryLabel,
        selectedCategory === item.key && styles.activeCategoryLabel
      ]}>
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  const renderAvatarItem = ({ item }: { item: any }) => {
    const unlocked = isAvatarUnlocked(item.id, userLevel, userCoins);
    const isSelected = selectedAvatarId === item.id;

    console.log("Rendering avatar:", item.id, item.name, item.category);

    return (
      <TouchableOpacity
        style={[
          styles.avatarItem,
          isSelected && styles.selectedAvatarItem
        ]}
        onPress={() => unlocked && handleSelectAvatar(item.id)}
        disabled={!unlocked}
        activeOpacity={0.7}
      >
        <View style={styles.avatarImageContainer}>
          <Image 
            source={item.path} 
            style={[
              styles.avatarImage,
              !unlocked && styles.lockedAvatarImage
            ]} 
          />
          {!unlocked && (
            <View style={styles.lockOverlay}>
              <Ionicons name="lock-closed" size={20} color="#ffffff" />
              {item.unlockLevel && (
                <Text style={styles.unlockText}>Lv.{item.unlockLevel}</Text>
              )}
              {item.unlockCoins && (
                <Text style={styles.unlockText}>{item.unlockCoins} 💰</Text>
              )}
            </View>
          )}
          {isSelected && (
            <View style={styles.selectedOverlay}>
              <Ionicons name="checkmark-circle" size={24} color="#10b981" />
            </View>
          )}
        </View>
        <Text style={[
          styles.avatarName,
          !unlocked && styles.lockedAvatarName,
          isSelected && styles.selectedAvatarName
        ]}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  // Get avatars for the selected category
  const avatarsInCategory = getAvatarsByCategory(selectedCategory);
  console.log("AvatarSelector - Selected category:", selectedCategory);
  console.log("AvatarSelector - Avatars in category:", avatarsInCategory.length);
  
  // Current selected avatar details
  const currentAvatar = ALL_AVATARS.find(avatar => avatar.id === selectedAvatarId);

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.modalContainer}>
        <Animated.View 
          style={[
            styles.modalContent,
            {
              transform: [
                { scale: animation.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1] }) },
                { translateY: animation.interpolate({ inputRange: [0, 1], outputRange: [50, 0] }) }
              ],
              opacity: animation
            }
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Chọn Avatar</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={20} color="#6b7280" />
            </TouchableOpacity>
          </View>

          {/* User Stats */}
          <View style={styles.userStats}>
            <View style={styles.statsItem}>
              <Ionicons name="star" size={16} color="#f59e0b" />
              <Text style={styles.statsText}>Level: {userLevel}</Text>
            </View>
            <View style={styles.statsItem}>
              <Ionicons name="wallet" size={16} color="#f59e0b" />
              <Text style={styles.statsText}>Coins: {userCoins} 💰</Text>
            </View>
          </View>
          
          {/* Selected Avatar Preview */}
          {currentAvatar && (
            <View style={styles.selectedPreview}>
              <Image source={currentAvatar.path} style={styles.previewImage} />
              <Text style={styles.previewName}>{currentAvatar.name}</Text>
            </View>
          )}

          {/* Category Tabs */}
          <FlatList
            data={categories}
            renderItem={renderCategoryTab}
            keyExtractor={(item) => item.key}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoryList}
          />

          {/* Avatar Grid */}
          <View style={styles.avatarGridContainer}>
            <FlatList
              data={avatarsInCategory}
              renderItem={renderAvatarItem}
              keyExtractor={(item) => item.id}
              numColumns={3}
              showsVerticalScrollIndicator={true}
              contentContainerStyle={styles.avatarGridContent}
            />
          </View>
          
          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={onClose}
              activeOpacity={0.8}
            >
              <Text style={styles.cancelButtonText}>Hủy</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.confirmButton}
              onPress={handleConfirmSelection}
              activeOpacity={0.8}
              disabled={!selectedAvatarId}
            >
              <Text style={styles.confirmButtonText}>Xác nhận</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 20,
    width: width * 0.9,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  closeButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 18,
  },
  userStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 12,
    marginBottom: 15,
  },
  statsItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4b5563',
    marginLeft: 4,
  },
  selectedPreview: {
    alignItems: 'center',
    marginBottom: 15,
    paddingVertical: 10,
    backgroundColor: '#eef2ff',
    borderRadius: 16,
  },
  previewImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#ffffff',
    marginBottom: 8,
  },
  previewName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4338ca',
  },
  categoryList: {
    marginBottom: 15,
  },
  categoryTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 10,
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
  },
  activeCategoryTab: {
    backgroundColor: '#1e90ff',
  },
  categoryIcon: {
    marginRight: 6,
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e90ff',
  },
  activeCategoryLabel: {
    color: 'white',
  },
  avatarGridContainer: {
    flex: 1,
    maxHeight: 300,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 5,
  },
  avatarGridContent: {
    paddingBottom: 20,
  },
  avatarItem: {
    flex: 1,
    alignItems: 'center',
    margin: 5,
    padding: 8,
    borderRadius: 15,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  selectedAvatarItem: {
    backgroundColor: '#eef2ff',
    borderWidth: 2,
    borderColor: '#1e90ff',
  },
  lockedAvatarItem: {
    opacity: 0.6,
  },
  avatarImageContainer: {
    position: 'relative',
    width: 70,
    height: 70,
    marginBottom: 8,
    borderRadius: 35,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#f3f4f6',
  },
  avatarImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  lockedAvatarImage: {
    opacity: 0.3,
  },
  lockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 35,
  },
  unlockText: {
    fontSize: 10,
    color: 'white',
    fontWeight: 'bold',
    marginTop: 4,
  },
  selectedOverlay: {
    position: 'absolute',
    top: -5,
    right: -5,
  },
  avatarName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4b5563',
    textAlign: 'center',
  },
  selectedAvatarName: {
    color: '#4338ca',
    fontWeight: '700',
  },
  lockedAvatarName: {
    color: '#9ca3af',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginRight: 8,
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#1e90ff',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginLeft: 8,
  },
  cancelButtonText: {
    color: '#4b5563',
    fontWeight: '600',
    fontSize: 16,
  },
  confirmButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
  selectedTab: {
    backgroundColor: '#1e90ff',
    borderRadius: 20,
  },
  tabText: {
    fontWeight: '600',
    fontSize: 14,
    color: '#1e90ff',
  },
  tabDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#fff',
    position: 'absolute',
    top: 8,
    right: 8,
    borderWidth: 1,
    borderColor: '#1e90ff',
  },
});

export default AvatarSelector; 