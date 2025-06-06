import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ENDPOINTS, DEFAULT_HEADERS, REQUEST_TIMEOUT, AUTH_ENDPOINTS, STORAGE_KEYS } from './config';

// Tạo instance axios với cấu hình từ config file
const api = axios.create({
  baseURL: API_ENDPOINTS.AUTH_URL,
  headers: DEFAULT_HEADERS,
  timeout: REQUEST_TIMEOUT,
});

// Instance thay thế sử dụng địa chỉ IP thay thế
const altApi = API_ENDPOINTS.ALT_AUTH_URL ? axios.create({
  baseURL: API_ENDPOINTS.ALT_AUTH_URL,
  headers: DEFAULT_HEADERS,
  timeout: REQUEST_TIMEOUT,
}) : null;

// Cờ để theo dõi xem nên sử dụng API thay thế hay không
let useAltApi = false;

// Hàm kiểm tra kết nối và chuyển đổi API nếu cần
const checkApiConnection = async () => {
  if (useAltApi && altApi) {
    console.log('Đang sử dụng API thay thế:', API_ENDPOINTS.ALT_AUTH_URL);
    return altApi;
  }
  
  try {
    // Thử ping API chính - sử dụng timeout ngắn hơn để kiểm tra nhanh
    const response = await axios({
      method: 'get',
      url: API_ENDPOINTS.AUTH_URL,
      timeout: 3000,
    });
    console.log('Kết nối thành công với API chính:', API_ENDPOINTS.AUTH_URL, response.status);
    return api;
  } catch (error) {
    console.warn('Không thể kết nối đến API chính:', error.message);
    
    // Nếu API chính không hoạt động và có API thay thế
    if (altApi) {
      try {
        // Thử ping API thay thế
        const altResponse = await axios({
          method: 'get',
          url: API_ENDPOINTS.ALT_AUTH_URL,
          timeout: 3000,
        });
        console.log('Chuyển sang sử dụng API thay thế:', API_ENDPOINTS.ALT_AUTH_URL, altResponse.status);
        useAltApi = true;
        return altApi;
      } catch (altError) {
        console.error('Cả API chính và API thay thế đều không kết nối được:', altError.message);
      }
    }
    
    // In thông tin chi tiết về lỗi kết nối để debug
    console.error('Chi tiết lỗi kết nối API:', {
      code: error.code,
      message: error.message,
      response: error.response,
    });
    
    // Vẫn trả về API chính nếu không có lựa chọn nào khác
    return api;
  }
};

// Interceptor để log request (chỉ trong development)
if (__DEV__) {
  api.interceptors.request.use(
    (config) => {
      console.log('API Request:', config.method?.toUpperCase(), config.url, config.data);
      return config;
    },
    (error) => {
      console.error('API Request Error:', error);
      return Promise.reject(error);
    }
  );

  api.interceptors.response.use(
    (response) => {
      console.log('API Response:', response.status, response.data);
      return response;
    },
    (error) => {
      console.error('API Response Error:', error.response?.status, error.response?.data);
      return Promise.reject(error);
    }
  );
  
  // Cũng áp dụng interceptors cho API thay thế nếu có
  if (altApi) {
    altApi.interceptors.request.use(
      (config) => {
        console.log('Alt API Request:', config.method?.toUpperCase(), config.url, config.data);
        return config;
      },
      (error) => {
        console.error('Alt API Request Error:', error);
        return Promise.reject(error);
      }
    );

    altApi.interceptors.response.use(
      (response) => {
        console.log('Alt API Response:', response.status, response.data);
        return response;
      },
      (error) => {
        console.error('Alt API Response Error:', error.response?.status, error.response?.data);
        return Promise.reject(error);
      }
    );
  }
}

// Hàm đăng nhập - sử dụng username thay vì email theo API backend
export const login = async (username, password) => {
  // Danh sách các URL để thử
  const apiUrls = [
    { baseUrl: API_ENDPOINTS.AUTH_URL, name: 'Chính' },
    API_ENDPOINTS.ALT_AUTH_URL ? { baseUrl: API_ENDPOINTS.ALT_AUTH_URL, name: 'Thay thế' } : null,
    API_ENDPOINTS.ANDROID_EMU_AUTH_URL ? { baseUrl: API_ENDPOINTS.ANDROID_EMU_AUTH_URL, name: 'Android Emulator' } : null
  ].filter(Boolean);
  
  let lastError = null;
  
  // Thử từng URL
  for (const apiConfig of apiUrls) {
    try {
      console.log(`Đang thử đăng nhập với API ${apiConfig.name}: ${apiConfig.baseUrl}/login`);
      
      const response = await axios({
        method: 'post',
        url: `${apiConfig.baseUrl}/login`,
        data: { username, password },
        headers: DEFAULT_HEADERS,
        timeout: REQUEST_TIMEOUT,
      });
      
      console.log(`Đăng nhập thành công với API ${apiConfig.name}:`, response.status);
      return response.data;
    } catch (error) {
      console.error(`Lỗi đăng nhập với API ${apiConfig.name}:`, {
        url: `${apiConfig.baseUrl}/login`,
        error: error.message,
        code: error.code,
        status: error.response?.status,
      });
      
      lastError = error;
      
      // Nếu lỗi là do xác thực (401) hoặc lỗi từ server (500), không cần thử URL khác
      if (error.response?.status === 401 || error.response?.status === 500) {
        break;
      }
    }
  }
  
  // Xử lý lỗi cuối cùng
  if (lastError) {
    console.error('Chi tiết lỗi đăng nhập:', lastError);
    
    // Xử lý lỗi kết nối mạng
    if (lastError.code === 'ECONNABORTED') {
      throw 'Kết nối đến server bị timeout. Vui lòng thử lại sau.';
    }
    
    if (lastError.code === 'ERR_NETWORK' || !lastError.response) {
      throw 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng và thử lại.';
    }
    
    // Xử lý lỗi từ server
    if (lastError.response?.status === 401) {
      throw 'Tên đăng nhập hoặc mật khẩu không chính xác.';
    }
    
    if (lastError.response?.status === 404) {
      throw 'API endpoint không tồn tại. Vui lòng kiểm tra cấu hình.';
    }
    
    // Lỗi khác từ server
    throw lastError.response?.data?.message || 'Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại sau.';
  }
  
  throw 'Không thể kết nối đến bất kỳ API nào.';
};

// Hàm đăng ký - theo đúng format API backend
export const register = async (userData) => {
  try {
    // Lấy instance API phù hợp
    const apiInstance = await checkApiConnection();
    
    const response = await apiInstance.post(AUTH_ENDPOINTS.REGISTER, userData);
    return response.data;
  } catch (error) {
    console.error('Chi tiết lỗi đăng ký:', error);
    
    // Xử lý lỗi kết nối mạng
    if (error.code === 'ECONNABORTED') {
      throw 'Kết nối đến server bị timeout. Vui lòng thử lại sau.';
    }
    
    if (error.code === 'ERR_NETWORK' || !error.response) {
      throw 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng và thử lại.';
    }
    
    throw error.response?.data?.message || 'Đã xảy ra lỗi khi đăng ký';
  }
};

// Kiểm tra trạng thái xác thực - sử dụng endpoint /check từ backend
export const checkAuthStatus = async (token) => {
  try {
    // Lấy instance API phù hợp
    const apiInstance = await checkApiConnection();
    
    const response = await apiInstance.get(AUTH_ENDPOINTS.CHECK_AUTH, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Chi tiết lỗi kiểm tra xác thực:', error);
    
    if (error.code === 'ERR_NETWORK' || !error.response) {
      throw 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng và thử lại.';
    }
    
    throw error.response?.data?.message || 'Phiên đăng nhập không hợp lệ';
  }
};

// Hàm lấy thông tin người dùng - sử dụng endpoint /profile từ backend
export const getUserProfile = async (token) => {
  try {
    const response = await api.get(AUTH_ENDPOINTS.PROFILE, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Không thể lấy thông tin người dùng';
  }
};

// Hàm đổi mật khẩu - theo API backend
export const changePassword = async (token, currentPassword, newPassword) => {
  try {
    const response = await api.post(AUTH_ENDPOINTS.CHANGE_PASSWORD, {
      currentPassword,
      newPassword
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Không thể đổi mật khẩu';
  }
};

// Hàm cập nhật thông tin profile
export const updateProfile = async (token, profileData) => {
  try {
    const response = await api.put(AUTH_ENDPOINTS.PROFILE, profileData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Không thể cập nhật thông tin profile';
  }
};

// Hàm đăng ký admin (nếu cần thiết cho app)
export const registerAdmin = async (userData) => {
  try {
    const response = await api.post(AUTH_ENDPOINTS.REGISTER_ADMIN, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Đã xảy ra lỗi khi đăng ký admin';
  }
};

// Hàm để kiểm tra trạng thái API
export const checkApiStatus = async () => {
  try {
    // Kiểm tra API chính
    console.log('Đang kiểm tra API chính:', API_ENDPOINTS.AUTH_URL);
    try {
      const mainResponse = await axios({
        method: 'get',
        url: API_ENDPOINTS.AUTH_URL,
        timeout: 5000,
      });
      console.log('API chính hoạt động:', {
        url: API_ENDPOINTS.AUTH_URL,
        status: mainResponse.status,
        statusText: mainResponse.statusText,
        contentType: mainResponse.headers['content-type'],
      });
    } catch (mainError) {
      console.error('API chính không hoạt động:', {
        url: API_ENDPOINTS.AUTH_URL,
        error: mainError.message,
        code: mainError.code,
      });
    }
    
    // Kiểm tra API thay thế nếu có
    if (API_ENDPOINTS.ALT_AUTH_URL) {
      console.log('Đang kiểm tra API thay thế:', API_ENDPOINTS.ALT_AUTH_URL);
      try {
        const altResponse = await axios({
          method: 'get',
          url: API_ENDPOINTS.ALT_AUTH_URL,
          timeout: 5000,
        });
        console.log('API thay thế hoạt động:', {
          url: API_ENDPOINTS.ALT_AUTH_URL,
          status: altResponse.status,
          statusText: altResponse.statusText,
          contentType: altResponse.headers['content-type'],
        });
      } catch (altError) {
        console.error('API thay thế không hoạt động:', {
          url: API_ENDPOINTS.ALT_AUTH_URL,
          error: altError.message,
          code: altError.code,
        });
      }
    }
    
    // Kiểm tra API cho máy ảo Android nếu có
    if (API_ENDPOINTS.ANDROID_EMU_AUTH_URL) {
      console.log('Đang kiểm tra API cho máy ảo Android:', API_ENDPOINTS.ANDROID_EMU_AUTH_URL);
      try {
        const androidResponse = await axios({
          method: 'get',
          url: API_ENDPOINTS.ANDROID_EMU_AUTH_URL,
          timeout: 5000,
        });
        console.log('API cho máy ảo Android hoạt động:', {
          url: API_ENDPOINTS.ANDROID_EMU_AUTH_URL,
          status: androidResponse.status,
          statusText: androidResponse.statusText,
          contentType: androidResponse.headers['content-type'],
        });
      } catch (androidError) {
        console.error('API cho máy ảo Android không hoạt động:', {
          url: API_ENDPOINTS.ANDROID_EMU_AUTH_URL,
          error: androidError.message,
          code: androidError.code,
        });
      }
    }
    
    // Thử gọi API đăng nhập với dữ liệu giả
    console.log('Đang kiểm tra API đăng nhập');
    
    // Danh sách các URL để thử
    const loginUrls = [
      `${API_ENDPOINTS.AUTH_URL}/login`,
      API_ENDPOINTS.ALT_AUTH_URL ? `${API_ENDPOINTS.ALT_AUTH_URL}/login` : null,
      API_ENDPOINTS.ANDROID_EMU_AUTH_URL ? `${API_ENDPOINTS.ANDROID_EMU_AUTH_URL}/login` : null
    ].filter(Boolean);
    
    let loginSuccess = false;
    let loginResults = [];
    
    // Thử từng URL
    for (const url of loginUrls) {
      try {
        console.log(`Thử gọi API đăng nhập tại: ${url}`);
        const loginResponse = await axios({
          method: 'post',
          url: url,
          data: { username: 'test_api', password: 'test_api' },
          headers: DEFAULT_HEADERS,
          timeout: 5000,
        });
        
        loginResults.push({
          url,
          status: loginResponse.status,
          statusText: loginResponse.statusText,
          success: true,
          data: loginResponse.data,
        });
        
        loginSuccess = true;
        console.log(`API đăng nhập tại ${url} hoạt động:`, {
          status: loginResponse.status,
          statusText: loginResponse.statusText,
        });
        
        // Nếu thành công với một URL, có thể dừng lại
        break;
      } catch (loginError) {
        loginResults.push({
          url,
          success: false,
          error: loginError.message,
          code: loginError.code,
          status: loginError.response?.status,
          data: loginError.response?.data,
        });
        
        console.error(`Lỗi khi gọi API đăng nhập tại ${url}:`, {
          error: loginError.message,
          code: loginError.code,
          response: loginError.response?.data,
          status: loginError.response?.status,
        });
      }
    }
    
    return {
      apiChecked: true,
      message: loginSuccess 
        ? 'Kết nối API thành công! Xem log để biết chi tiết.' 
        : 'Không thể kết nối đến API đăng nhập. Xem log để biết chi tiết.',
      success: loginSuccess,
      results: loginResults,
    };
  } catch (error) {
    console.error('Lỗi khi kiểm tra API:', error);
    return {
      apiChecked: false,
      error: error.message,
    };
  }
};

// Hàm lấy token hiện tại từ bộ nhớ cục bộ
export const getToken = async () => {
  try {
    console.log('Đang lấy token xác thực từ AsyncStorage...');
    
    // Sử dụng AsyncStorage để lấy token
    const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    
    if (token) {
      console.log('Đã tìm thấy token xác thực');
      return token;
    } else {
      console.log('Không tìm thấy token xác thực');
      return null;
    }
  } catch (error) {
    console.error('Lỗi khi lấy token:', error);
    return null;
  }
}; 