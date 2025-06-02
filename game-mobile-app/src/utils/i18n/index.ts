import AsyncStorage from '@react-native-async-storage/async-storage';

// Tiếng Việt (mặc định)
const viTranslations = {
  // Chung
  app_name: 'Game Mobile App',
  loading: 'Đang tải...',
  save: 'Lưu',
  cancel: 'Hủy',
  confirm: 'Xác nhận',
  yes: 'Có',
  no: 'Không',
  ok: 'OK',
  error: 'Lỗi',
  success: 'Thành công',
  notification: 'Thông báo',
  
  // Profile
  profile: 'Hồ sơ',
  edit_profile: 'Chỉnh sửa hồ sơ',
  achievements: 'Thành tích',
  help_support: 'Trợ giúp & Hỗ trợ',
  app_settings: 'Cài đặt ứng dụng',
  
  // App Settings
  language: 'Ngôn ngữ',
  dark_mode: 'Chế độ tối',
  dark_mode_desc: 'Sử dụng chế độ tối cho ứng dụng',
  notification_settings: 'Cài đặt thông báo',
  general_notifications: 'Thông báo chung',
  general_notifications_desc: 'Nhận thông báo về cập nhật ứng dụng và tính năng mới',
  promo_notifications: 'Khuyến mãi',
  promo_notifications_desc: 'Nhận thông báo về các khuyến mãi và ưu đãi',
  update_notifications: 'Cập nhật ứng dụng',
  update_notifications_desc: 'Nhận thông báo khi có phiên bản mới',
  sound: 'Âm thanh',
  sound_desc: 'Bật âm thanh khi chơi game và tương tác',
  vibration: 'Rung',
  vibration_desc: 'Bật rung khi có thông báo và tương tác',
  auto_save: 'Tự động lưu',
  auto_save_desc: 'Tự động lưu tiến trình chơi game',
  data_usage: 'Sử dụng dữ liệu',
  data_usage_desc: 'Điều chỉnh mức sử dụng dữ liệu khi kết nối mạng',
  low: 'Thấp',
  low_desc: 'Tiết kiệm dữ liệu, chất lượng hình ảnh thấp hơn',
  balanced: 'Cân bằng',
  balanced_desc: 'Cân bằng giữa sử dụng dữ liệu và chất lượng',
  high: 'Cao',
  high_desc: 'Chất lượng cao nhất, sử dụng nhiều dữ liệu hơn',
  reset_settings: 'Khôi phục cài đặt mặc định',
  save_settings: 'Lưu cài đặt',
  settings_saved: 'Đã lưu cài đặt của bạn',
  reset_settings_confirm: 'Bạn có chắc chắn muốn khôi phục tất cả cài đặt về mặc định?',
  
  // Help & Support
  faq: 'Câu hỏi thường gặp',
  contact_us: 'Liên hệ với chúng tôi',
  send_feedback: 'Gửi phản hồi',
  feedback_type: 'Loại phản hồi',
  feedback_message: 'Tin nhắn phản hồi',
  feedback_success_message: 'Cảm ơn bạn đã gửi phản hồi.',
  please_select_category: 'Vui lòng chọn danh mục phản hồi',
  please_enter_feedback: 'Vui lòng nhập nội dung phản hồi',
  feedback_placeholder: 'Mô tả chi tiết vấn đề hoặc góp ý của bạn...',

  // Game Screen
  game_catalog: 'Danh mục Game',
  games_available: 'game có sẵn',
  play_now: 'Chơi ngay',
  selected_game: 'Game đã chọn',
  categories: 'Thể loại',
  all_games: 'Tất cả game',
  game_category: 'Game',
  loading_game: 'Đang tải game...',
  loading_games: 'Đang tải games...',
  loading_tip: 'Hãy chờ một chút để tận hưởng trải nghiệm game tốt nhất',
  game_load_error: 'Không thể tải game',
  check_connection: 'Vui lòng kiểm tra kết nối internet và thử lại',
  retry: 'Thử lại',
  close: 'Đóng',
  open_link: 'Mở liên kết bên ngoài',
  open_link_question: 'Bạn có muốn mở liên kết này trong trình duyệt?',
  open: 'Mở',
  play_game_question: 'Bạn đã chọn game {gameName}. Bạn có muốn bắt đầu chơi không?',
  select_favorite_game: 'Chọn game yêu thích để chơi',
  no_games: 'Không có game nào',
  try_another_category: 'Thử chọn thể loại khác',
  similar_games: 'Game tương tự',
  name: 'Tên game',
  category: 'Thể loại',
  average_session: 'Thời gian chơi trung bình',
  ratings_reviews: 'Đánh giá & Bình luận',
  rate_game: 'Đánh giá game',
  edit_rating: 'Sửa đánh giá',
  write_comment: 'Chia sẻ ý kiến của bạn...',
  show_more_comments: 'Xem thêm bình luận',
  show_less: 'Ẩn bớt',
  user: 'Người dùng',
  comment_rating_required: 'Vui lòng nhập nội dung và đánh giá số sao trước khi gửi.',
  thank_you: 'Cảm ơn bạn!',
  rating_received: 'Đánh giá của bạn đã được ghi nhận.',
  all: 'Tất cả',
  newest: 'Mới nhất',
  '5_star': '5 sao',
  '4_star': '4 sao',
  '3_star': '3 sao',
  '1_2_star': '1-2 sao',

  // GamezopAPITest
  gamezop_api_test: 'Kiểm tra API Gamezop',
  current_status: 'Trạng thái hiện tại',
  demo_mode: 'Chế độ demo',
  enabled: 'BẬT',
  disabled: 'TẮT',
  partner_id: 'ID đối tác',
  test_api_connection: 'Kiểm tra kết nối API',
  toggle_demo_mode: 'Chuyển đổi chế độ demo',
  load_real_games: 'Tải game thật',
  api_test_result: 'Kết quả kiểm tra API',
  real_games_from_api: 'Game thật từ API',
  games_loaded_with_images: 'game đã tải với hình ảnh thật',
  screenshots: 'ảnh chụp màn hình',
  instructions: 'Hướng dẫn',
  check_api_accessible: 'Kiểm tra xem API Gamezop có thể truy cập được không',
  switch_demo_real: 'Chuyển đổi giữa dữ liệu demo và API thật',
  fetch_games_real_images: 'Tải game với hình ảnh thật từ Gamezop',
  api_works_disable_demo: 'Nếu API hoạt động, bạn có thể tắt chế độ demo để sử dụng hình ảnh thật!',
  api_test_success: 'Kiểm tra API thành công!',
  found_games_with_images: 'Tìm thấy {count} game với hình ảnh thật từ API Gamezop',
  api_test_failed: 'Kiểm tra API thất bại',
  test_failed: 'Kiểm tra thất bại: {error}',
  demo_mode_changed: 'Chế độ demo đã thay đổi',
  demo_mode_status: 'Chế độ demo hiện tại là {status}',
  real_games_loaded: 'Đã tải game thật',
  loaded_games_with_images: 'Đã tải {count} game với hình ảnh thật từ Gamezop',
  failed_load_real_games: 'Không thể tải game thật: {error}',
};

// Tiếng Anh
const enTranslations = {
  // Common
  app_name: 'Game Mobile App',
  loading: 'Loading...',
  save: 'Save',
  cancel: 'Cancel',
  confirm: 'Confirm',
  yes: 'Yes',
  no: 'No',
  ok: 'OK',
  error: 'Error',
  success: 'Success',
  notification: 'Notification',
  
  // Profile
  profile: 'Profile',
  edit_profile: 'Edit Profile',
  achievements: 'Achievements',
  help_support: 'Help & Support',
  app_settings: 'App Settings',
  
  // App Settings
  language: 'Language',
  dark_mode: 'Dark Mode',
  dark_mode_desc: 'Use dark mode for the app',
  notification_settings: 'Notification Settings',
  general_notifications: 'General Notifications',
  general_notifications_desc: 'Receive notifications about app updates and new features',
  promo_notifications: 'Promotions',
  promo_notifications_desc: 'Receive notifications about promotions and offers',
  update_notifications: 'App Updates',
  update_notifications_desc: 'Receive notifications when new versions are available',
  sound: 'Sound',
  sound_desc: 'Enable sound when playing games and interacting',
  vibration: 'Vibration',
  vibration_desc: 'Enable vibration for notifications and interactions',
  auto_save: 'Auto Save',
  auto_save_desc: 'Automatically save game progress',
  data_usage: 'Data Usage',
  data_usage_desc: 'Adjust data usage when connected to network',
  low: 'Low',
  low_desc: 'Save data, lower image quality',
  balanced: 'Balanced',
  balanced_desc: 'Balance between data usage and quality',
  high: 'High',
  high_desc: 'Highest quality, uses more data',
  reset_settings: 'Reset to Default Settings',
  save_settings: 'Save Settings',
  settings_saved: 'Your settings have been saved',
  reset_settings_confirm: 'Are you sure you want to reset all settings to default?',
  
  // Help & Support
  faq: 'Frequently Asked Questions',
  contact_us: 'Contact Us',
  send_feedback: 'Send Feedback',
  feedback_type: 'Feedback Type',
  feedback_message: 'Feedback Message',
  feedback_success_message: 'Thank you for your feedback.',
  please_select_category: 'Please select a feedback category',
  please_enter_feedback: 'Please enter your feedback message',
  feedback_placeholder: 'Describe your issue or suggestion in detail...',

  // Game Screen
  game_catalog: 'Game Catalog',
  games_available: 'games available',
  play_now: 'Play Now',
  selected_game: 'Selected Game',
  categories: 'Categories',
  all_games: 'All Games',
  game_category: 'Games',
  loading_game: 'Loading game...',
  loading_games: 'Loading games...',
  loading_tip: 'Please wait a moment for the best gaming experience',
  game_load_error: 'Could not load game',
  check_connection: 'Please check your internet connection and try again',
  retry: 'Retry',
  close: 'Close',
  open_link: 'Open External Link',
  open_link_question: 'Do you want to open this link in the browser?',
  open: 'Open',
  play_game_question: 'You selected {gameName}. Do you want to start playing?',
  select_favorite_game: 'Choose your favorite game to play',
  no_games: 'No games available',
  try_another_category: 'Try selecting a different category',
  similar_games: 'Similar Games',
  name: 'Game name',
  category: 'Category',
  average_session: 'Average play time',
  ratings_reviews: 'Ratings & Reviews',
  rate_game: 'Rate this game',
  edit_rating: 'Edit rating',
  write_comment: 'Share your opinion...',
  show_more_comments: 'Show more comments',
  show_less: 'Show less',
  user: 'User',
  comment_rating_required: 'Please enter a comment and rate the game before submitting.',
  thank_you: 'Thank you!',
  rating_received: 'Your rating has been recorded.',
  all: 'All',
  newest: 'Newest',
  '5_star': '5 stars',
  '4_star': '4 stars',
  '3_star': '3 stars',
  '1_2_star': '1-2 stars',

  // GamezopAPITest
  gamezop_api_test: 'Gamezop API Test',
  current_status: 'Current Status',
  demo_mode: 'Demo Mode',
  enabled: 'ENABLED',
  disabled: 'DISABLED',
  partner_id: 'Partner ID',
  test_api_connection: 'Test API Connection',
  toggle_demo_mode: 'Toggle Demo Mode',
  load_real_games: 'Load Real Games',
  api_test_result: 'API Test Result',
  real_games_from_api: 'Real Games from API',
  games_loaded_with_images: 'games loaded with real images',
  screenshots: 'screenshots',
  instructions: 'Instructions',
  check_api_accessible: 'Check if Gamezop API is accessible',
  switch_demo_real: 'Switch between demo data and real API',
  fetch_games_real_images: 'Fetch games with real images from Gamezop',
  api_works_disable_demo: 'If API works, you can disable demo mode to use real images!',
  api_test_success: 'API Test Success!',
  found_games_with_images: 'Found {count} games with real images from Gamezop API',
  api_test_failed: 'API Test Failed',
  test_failed: 'Test failed: {error}',
  demo_mode_changed: 'Demo Mode Changed',
  demo_mode_status: 'Demo mode is now {status}',
  real_games_loaded: 'Real Games Loaded',
  loaded_games_with_images: 'Loaded {count} games with real Gamezop images',
  failed_load_real_games: 'Failed to load real games: {error}',
};

// Thiết lập mặc định
const translations = { vi: viTranslations, en: enTranslations };
let currentLocale = 'vi';

// Lấy ngôn ngữ từ cài đặt
export const setupLanguage = async () => {
  try {
    const savedSettings = await AsyncStorage.getItem('app_settings');
    if (savedSettings) {
      const { language } = JSON.parse(savedSettings);
      if (language && translations[language]) {
        currentLocale = language;
      }
    }
  } catch (error) {
    console.error('Error setting up language:', error);
  }
};

// Thiết lập ngôn ngữ
export const setLanguage = (languageCode) => {
  if (translations[languageCode]) {
    currentLocale = languageCode;
  }
};

// Lấy ngôn ngữ hiện tại
export const getCurrentLanguage = () => {
  return currentLocale;
};

// Hàm dịch
export const t = (key) => {
  const localeTranslations = translations[currentLocale] || translations.vi;
  return localeTranslations[key] || key;
};

// Khởi tạo
setupLanguage();

export default {
  translations,
  t,
  setLanguage,
  getCurrentLanguage
}; 