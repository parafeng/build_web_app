import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Platform,
  StatusBar,
  KeyboardAvoidingView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { t } from '../../utils/i18n';

// Danh sách câu hỏi thường gặp
const FAQ_ITEMS = [
  {
    questionKey: 'Làm thế nào để đổi avatar?',
    answerKey: 'Bạn có thể đổi avatar bằng cách vào mục "Chỉnh sửa hồ sơ" trong trang Profile và chọn avatar mới từ thư viện.'
  },
  {
    questionKey: 'Tôi quên mật khẩu thì phải làm sao?',
    answerKey: 'Bạn có thể sử dụng chức năng "Quên mật khẩu" ở trang đăng nhập. Hệ thống sẽ gửi email đặt lại mật khẩu cho bạn.'
  },
  {
    questionKey: 'Làm thế nào để kiếm thêm coins?',
    answerKey: 'Bạn có thể kiếm thêm coins bằng cách chơi game hàng ngày, hoàn thành thành tích, hoặc tham gia các sự kiện đặc biệt.'
  },
  {
    questionKey: 'Tôi gặp lỗi khi chơi game phải làm sao?',
    answerKey: 'Bạn có thể thử làm mới trang, kiểm tra kết nối internet, hoặc gửi báo cáo lỗi qua mẫu gửi phản hồi bên dưới.'
  }
];

// Danh mục hỗ trợ
const SUPPORT_CATEGORIES = [
  { id: 'account', nameKey: 'Tài khoản', icon: 'person-circle-outline' },
  { id: 'technical', nameKey: 'Kỹ thuật', icon: 'build-outline' },
  { id: 'payment', nameKey: 'Thanh toán', icon: 'card-outline' },
  { id: 'feedback', nameKey: 'Góp ý', icon: 'chatbubble-ellipses-outline' },
  { id: 'bug', nameKey: 'Báo lỗi', icon: 'bug-outline' }
];

const HelpSupportScreen: React.FC = () => {
  const navigation = useNavigation();
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Xử lý khi nhấn vào FAQ
  const toggleFaq = (index: number) => {
    if (expandedFaq === index) {
      setExpandedFaq(null);
    } else {
      setExpandedFaq(index);
    }
  };

  // Xử lý khi chọn danh mục hỗ trợ
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  // Xử lý gửi phản hồi
  const handleSubmitFeedback = async () => {
    if (!selectedCategory) {
      Alert.alert(t('notification'), t('please_select_category'));
      return;
    }

    if (!feedbackMessage.trim()) {
      Alert.alert(t('notification'), t('please_enter_feedback'));
      return;
    }

    setIsSubmitting(true);

    // Giả lập API call
    setTimeout(() => {
      setIsSubmitting(false);
      Alert.alert(
        t('success'),
        t('feedback_success_message'),
        [
          {
            text: t('ok'),
            onPress: () => {
              setFeedbackMessage('');
              setSelectedCategory(null);
            }
          }
        ]
      );
    }, 1500);
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#2196F3" barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('help_support')}</Text>
        <View style={styles.headerRight} />
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardAvoidingContainer}
      >
        <ScrollView 
          style={styles.scrollContent}
          contentContainerStyle={styles.scrollContentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Câu hỏi thường gặp */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('faq')}</Text>
            
            {FAQ_ITEMS.map((faq, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.faqItem}
                onPress={() => toggleFaq(index)}
                activeOpacity={0.7}
              >
                <View style={styles.faqHeader}>
                  <Text style={styles.faqQuestion}>{faq.questionKey}</Text>
                  <Ionicons 
                    name={expandedFaq === index ? "chevron-up" : "chevron-down"} 
                    size={20} 
                    color="#78909C" 
                  />
                </View>
                
                {expandedFaq === index && (
                  <Text style={styles.faqAnswer}>{faq.answerKey}</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Gửi phản hồi */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('send_feedback')}</Text>
            
            <View style={styles.feedbackForm}>
              <Text style={styles.formLabel}>{t('feedback_type')}:</Text>
              
              <View style={styles.categoriesContainer}>
                {SUPPORT_CATEGORIES.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.categoryButton,
                      selectedCategory === category.id && styles.selectedCategoryButton
                    ]}
                    onPress={() => handleCategorySelect(category.id)}
                  >
                    <Ionicons 
                      name={category.icon as any} 
                      size={20} 
                      color={selectedCategory === category.id ? "#FFF" : "#616161"} 
                    />
                    <Text 
                      style={[
                        styles.categoryText,
                        selectedCategory === category.id && styles.selectedCategoryText
                      ]}
                    >
                      {category.nameKey}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.formLabel}>{t('feedback_message')}:</Text>
              <TextInput
                style={styles.feedbackInput}
                multiline
                numberOfLines={5}
                placeholder={t('feedback_placeholder')}
                placeholderTextColor="#9E9E9E"
                value={feedbackMessage}
                onChangeText={setFeedbackMessage}
                textAlignVertical="top"
              />

              <TouchableOpacity
                style={[
                  styles.submitButton,
                  (!selectedCategory || !feedbackMessage.trim() || isSubmitting) && styles.disabledButton
                ]}
                onPress={handleSubmitFeedback}
                disabled={!selectedCategory || !feedbackMessage.trim() || isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <>
                    <Ionicons name="paper-plane-outline" size={18} color="#FFF" style={styles.submitIcon} />
                    <Text style={styles.submitText}>{t('send_feedback')}</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Thông tin liên hệ */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('contact_us')}</Text>
            
            <View style={styles.contactItem}>
              <Ionicons name="mail-outline" size={22} color="#2196F3" style={styles.contactIcon} />
              <Text style={styles.contactText}>support@gamemobileapp.com</Text>
            </View>
            
            <View style={styles.contactItem}>
              <Ionicons name="call-outline" size={22} color="#2196F3" style={styles.contactIcon} />
              <Text style={styles.contactText}>1900 1234 567</Text>
            </View>
            
            <View style={styles.contactItem}>
              <Ionicons name="time-outline" size={22} color="#2196F3" style={styles.contactIcon} />
              <Text style={styles.contactText}>{t('contact_hours')}</Text>
            </View>
          </View>
          
          {/* Khoảng cách cuối trang */}
          <View style={styles.bottomPadding} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  keyboardAvoidingContainer: {
    flex: 1,
  },
  header: {
    backgroundColor: '#2196F3',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight ? StatusBar.currentHeight + 10 : 25 : 15,
    paddingBottom: 15,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  headerRight: {
    width: 40,
  },
  scrollContent: {
    flex: 1,
  },
  scrollContentContainer: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#263238',
    marginBottom: 16,
  },
  faqItem: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '600',
    color: '#263238',
    flex: 1,
    paddingRight: 10,
  },
  faqAnswer: {
    marginTop: 12,
    fontSize: 14,
    lineHeight: 20,
    color: '#546E7A',
    borderTopWidth: 1,
    borderTopColor: '#ECEFF1',
    paddingTop: 12,
  },
  feedbackForm: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#263238',
    marginBottom: 12,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedCategoryButton: {
    backgroundColor: '#2196F3',
  },
  categoryText: {
    fontSize: 14,
    color: '#616161',
    marginLeft: 4,
  },
  selectedCategoryText: {
    color: '#FFF',
    fontWeight: '500',
  },
  feedbackInput: {
    backgroundColor: '#F5F7FA',
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: '#263238',
    height: 120,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ECEFF1',
  },
  submitButton: {
    backgroundColor: '#2196F3',
    borderRadius: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#BDBDBD',
  },
  submitIcon: {
    marginRight: 8,
  },
  submitText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  contactIcon: {
    marginRight: 12,
  },
  contactText: {
    fontSize: 15,
    color: '#546E7A',
  },
  bottomPadding: {
    height: 30,
  },
});

export default HelpSupportScreen; 