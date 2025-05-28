import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  StatusBar
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { RootState } from '../../redux/types';
import AvatarSelector from '../../components/common/AvatarSelector';
import { getDefaultAvatar, ALL_AVATARS } from '../../assets/avatars/avatars.config';
import { updateProfile, changePassword } from '../../redux/actions/authActions';
import { getButtonIcon } from '../../assets/icons/icons.config';
import { Ionicons } from '@expo/vector-icons';

const EditProfileScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  
  // Form state
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Avatar state
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  const [selectedAvatarId, setSelectedAvatarId] = useState<string>(
    typeof user?.selectedAvatar === 'string' 
      ? user.selectedAvatar 
      : getDefaultAvatar().id
  );
  
  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setEmail(user.email);
      if (user.selectedAvatar) {
        setSelectedAvatarId(
          typeof user.selectedAvatar === 'string' 
            ? user.selectedAvatar 
            : String(user.selectedAvatar)
        );
      }
    }
  }, [user]);
  
  // Function to get current avatar
  const getCurrentAvatar = () => {
    return ALL_AVATARS.find(avatar => avatar.id === selectedAvatarId) || getDefaultAvatar();
  };
  
  // Handle avatar selection
  const handleAvatarSelect = (avatarId: string) => {
    setSelectedAvatarId(avatarId);
    setShowAvatarSelector(false);
  };
  
  // Validate form
  const validateForm = () => {
    if (!username.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên người dùng');
      return false;
    }
    
    if (!email.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập email');
      return false;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      Alert.alert('Lỗi', 'Email không hợp lệ');
      return false;
    }
    
    if (newPassword && newPassword !== confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu xác nhận không khớp');
      return false;
    }
    
    if (newPassword && newPassword.length < 6) {
      Alert.alert('Lỗi', 'Mật khẩu mới phải có ít nhất 6 ký tự');
      return false;
    }
    
    if (newPassword && !currentPassword) {
      Alert.alert('Lỗi', 'Vui lòng nhập mật khẩu hiện tại để đổi mật khẩu');
      return false;
    }
    
    return true;
  };
  
  // Handle save profile
  const handleSaveProfile = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      // Cập nhật thông tin profile
      const profileData = {
        username: username.trim(),
        email: email.trim(),
        avatarId: selectedAvatarId
      };
      
      await dispatch(updateProfile(profileData) as any);
      
      // Nếu có đổi mật khẩu
      if (newPassword && currentPassword) {
        await dispatch(changePassword(currentPassword, newPassword) as any);
      }
      
      Alert.alert(
        'Thành công',
        'Cập nhật thông tin thành công!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          }
        ]
      );
      
    } catch (error) {
      Alert.alert('Lỗi', typeof error === 'string' ? error : 'Có lỗi xảy ra khi cập nhật thông tin');
      console.error('Update profile error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const currentAvatar = getCurrentAvatar();
  
  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <StatusBar backgroundColor="#1e90ff" barStyle="light-content" />
      
      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
          <Text style={styles.backText}>Quay lại</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Chỉnh sửa Profile</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <TouchableOpacity 
            onPress={() => setShowAvatarSelector(true)}
            style={styles.avatarTouchable}
          >
            <View style={styles.avatarContainer}>
              <Image source={currentAvatar.path} style={styles.avatar} />
              <View style={styles.editAvatarOverlay}>
                <Ionicons name="camera" size={16} color="#fff" />
              </View>
            </View>
          </TouchableOpacity>
          <Text style={styles.avatarHint}>Nhấn để thay đổi avatar</Text>
        </View>
        
        {/* Profile Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin cá nhân</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Tên người dùng</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color="#6b7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={username}
                onChangeText={setUsername}
                placeholder="Nhập tên người dùng"
                autoCapitalize="none"
              />
            </View>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color="#6b7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Nhập email"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>
        </View>
        
        {/* Password Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Đổi mật khẩu (tùy chọn)</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Mật khẩu hiện tại</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#6b7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                placeholder="Nhập mật khẩu hiện tại"
                secureTextEntry
              />
            </View>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Mật khẩu mới</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="key-outline" size={20} color="#6b7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Nhập mật khẩu mới"
                secureTextEntry
              />
            </View>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Xác nhận mật khẩu mới</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="checkmark-outline" size={20} color="#6b7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Nhập lại mật khẩu mới"
                secureTextEntry
              />
            </View>
          </View>
        </View>
        
        {/* Save Button */}
        <TouchableOpacity 
          style={[styles.saveButton, loading && styles.disabledButton]}
          onPress={handleSaveProfile}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="save-outline" size={20} color="#fff" style={styles.saveIcon} />
              <Text style={styles.saveButtonText}>Lưu thay đổi</Text>
            </>
          )}
        </TouchableOpacity>
        
        <View style={styles.bottomSpacing} />
      </ScrollView>
      
      {/* Avatar Selector Modal */}
      <AvatarSelector
        visible={showAvatarSelector}
        onClose={() => setShowAvatarSelector(false)}
        onSelectAvatar={handleAvatarSelect}
        currentAvatarId={selectedAvatarId}
        userLevel={user?.level || 7}
        userCoins={user?.coins || 250}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollContent: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 16,
    backgroundColor: '#1e90ff',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  placeholder: {
    width: 70, // Same width as back button to center title
  },
  avatarSection: {
    alignItems: 'center',
    padding: 24,
    marginTop: 16,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  avatarTouchable: {
    marginBottom: 12,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  editAvatarOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  avatarHint: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 4,
  },
  section: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4b5563',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    backgroundColor: '#f9fafb',
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1f2937',
    paddingVertical: 12,
  },
  saveButton: {
    backgroundColor: '#1e90ff',
    paddingVertical: 15,
    borderRadius: 10,
    marginHorizontal: 16,
    marginTop: 32,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#1e90ff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  saveIcon: {
    marginRight: 8,
  },
  disabledButton: {
    opacity: 0.7,
    backgroundColor: '#a5b4fc',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomSpacing: {
    height: 30,
  },
});

export default EditProfileScreen; 