// API Configuration for Game Mobile App
// Tích hợp với Website_Game_online backend

// Cấu hình môi trường phát triển và sản xuất
const API_CONFIG = {
  development: {
    // Cập nhật URL để sử dụng IP thay vì localhost cho các thiết bị mobile
    BASE_URL: 'http://192.168.1.3:5000',
    AUTH_URL: 'http://192.168.1.3:5000/api/auth',
    GAMES_URL: 'http://192.168.1.3:5000/api/games',
    
    // Địa chỉ IP thay thế nếu localhost không hoạt động
    ALT_BASE_URL: 'http://localhost:5000',
    ALT_AUTH_URL: 'http://localhost:5000/api/auth',
    ALT_GAMES_URL: 'http://localhost:5000/api/games',
    
    // Địa chỉ đặc biệt cho máy ảo Android (10.0.2.2 trỏ đến localhost của máy host)
    ANDROID_EMU_BASE_URL: 'http://10.0.2.2:5000',
    ANDROID_EMU_AUTH_URL: 'http://10.0.2.2:5000/api/auth',
    ANDROID_EMU_GAMES_URL: 'http://10.0.2.2:5000/api/games',
    
    // Các địa chỉ thay thế khác để thử nghiệm
    ALTERNATIVE_URLS: [
      'http://192.168.1.3:5000',
      'http://localhost:5000',
      'http://127.0.0.1:5000',
      'http://192.168.1.4:5000'
    ],
    
    // Tăng timeout để tránh lỗi timeout quá sớm
    TIMEOUT: 15000, // 15 seconds
  },
  production: {
    BASE_URL: 'https://your-production-server.com',
    AUTH_URL: 'https://your-production-server.com/api/auth',
    GAMES_URL: 'https://your-production-server.com/api/games',
    TIMEOUT: 15000, // 15 seconds
  }
};

// Kiểm tra môi trường hiện tại
const getCurrentEnvironment = () => {
  // Có thể sử dụng __DEV__ để phân biệt môi trường development và production
  // hoặc dùng biến môi trường khác
  return __DEV__ ? 'development' : 'production';
};

// Lấy cấu hình cho môi trường hiện tại
const currentEnv = getCurrentEnvironment();
export const API_ENDPOINTS = API_CONFIG[currentEnv];

// Headers mặc định cho các request
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

// Timeout mặc định cho request
export const REQUEST_TIMEOUT = API_ENDPOINTS.TIMEOUT;

// Auth endpoints cụ thể
export const AUTH_ENDPOINTS = {
  LOGIN: '/login',
  REGISTER: '/register',
  REGISTER_ADMIN: '/register-admin',
  PROFILE: '/profile',
  CHECK_AUTH: '/check',
  CHANGE_PASSWORD: '/change-password',
};

// Games endpoints (để mở rộng sau)
export const GAMES_ENDPOINTS = {
  GET_GAMES: '/games',
  GET_GAME_DETAIL: '/games/:id',
  ADD_COMMENT: '/games/:id/comments',
  GET_COMMENTS: '/games/:id/comments',
  DELETE_COMMENT: '/comments/:commentId',
  RATE_GAME: '/games/:id/rate'
};

// Storage keys cho AsyncStorage
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  GAME_SETTINGS: 'game_settings',
};

// Hàm tiện ích để thử nhiều URL cho đến khi tìm thấy URL hoạt động
export const findWorkingApiUrl = async () => {
  const urls = API_ENDPOINTS.ALTERNATIVE_URLS || [API_ENDPOINTS.BASE_URL];
  
  for (const baseUrl of urls) {
    try {
      console.log(`Đang kiểm tra URL: ${baseUrl}`);
      
      // Tạo AbortController để có thể timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      
      try {
        const response = await fetch(`${baseUrl}/api/check-connection`, {
          method: 'GET',
          headers: DEFAULT_HEADERS,
          signal: controller.signal
        });
        
        // Xóa timeout nếu request hoàn thành
        clearTimeout(timeoutId);
        
        if (response.ok) {
          console.log(`Tìm thấy URL hoạt động: ${baseUrl}`);
          return baseUrl;
        }
      } catch (fetchError) {
        // Xóa timeout nếu có lỗi
        clearTimeout(timeoutId);
        
        if (fetchError.name === 'AbortError') {
          console.log(`URL ${baseUrl} timeout`);
        } else {
          console.log(`URL ${baseUrl} lỗi:`, fetchError.message);
        }
      }
    } catch (error) {
      console.log(`URL ${baseUrl} không hoạt động:`, error.message);
    }
  }
  
  console.warn('Không tìm thấy URL nào hoạt động, sử dụng URL mặc định');
  return API_ENDPOINTS.BASE_URL;
};

export default {
  API_ENDPOINTS,
  DEFAULT_HEADERS,
  REQUEST_TIMEOUT,
  AUTH_ENDPOINTS,
  GAMES_ENDPOINTS,
  STORAGE_KEYS,
  findWorkingApiUrl
}; 