# Tích hợp API Xác thực Website_Game_online vào Game Mobile App

## Tổng quan

Đã tích hợp thành công các API xác thực từ backend Website_Game_online vào ứng dụng di động Game Mobile App. Tích hợp này bao gồm các chức năng đăng nhập, đăng ký, quản lý profile và đổi mật khẩu.

## Các API Đã Tích Hợp

### 1. Đăng nhập (Login)
- **Endpoint**: `POST /api/auth/login`
- **Tham số**: `username`, `password`
- **Trả về**: JWT token và thông tin user

### 2. Đăng ký (Register)
- **Endpoint**: `POST /api/auth/register`
- **Tham số**: `username`, `email`, `password`
- **Trả về**: JWT token và thông tin user (nếu tự động đăng nhập sau đăng ký)

### 3. Lấy thông tin Profile
- **Endpoint**: `GET /api/auth/profile`
- **Headers**: `Authorization: Bearer <token>`
- **Trả về**: Thông tin chi tiết user

### 4. Kiểm tra trạng thái xác thực
- **Endpoint**: `GET /api/auth/check`
- **Headers**: `Authorization: Bearer <token>`
- **Trả về**: Thông tin user hiện tại

### 5. Đổi mật khẩu
- **Endpoint**: `POST /api/auth/change-password`
- **Headers**: `Authorization: Bearer <token>`
- **Tham số**: `currentPassword`, `newPassword`

### 6. Đăng ký Admin (Tùy chọn)
- **Endpoint**: `POST /api/auth/register-admin`
- **Tham số**: `username`, `email`, `password`, `adminKey`

## Cấu trúc File Đã Được Cập nhật

### 1. API Layer
```
src/api/
├── config.js           # Cấu hình API endpoints và constants
├── authApi.js          # Các hàm gọi API xác thực
└── gamesApi.js         # API games (để mở rộng)
```

### 2. Redux Layer
```
src/redux/
├── actions/
│   └── authActions.js  # Redux actions cho xác thực
├── reducers/           # Redux reducers
└── types/             # Action types
```

### 3. Screens
```
src/screens/auth/
├── LoginScreen.tsx          # Màn hình đăng nhập
├── RegisterScreen.tsx       # Màn hình đăng ký
└── ChangePasswordScreen.tsx # Màn hình đổi mật khẩu
```

## Cấu hình API

File `src/api/config.js` chứa tất cả cấu hình API:

```javascript
// Cấu hình môi trường
const API_CONFIG = {
  development: {
    BASE_URL: 'http://localhost:5000',
    AUTH_URL: 'http://localhost:5000/api/auth',
    // ...
  },
  production: {
    BASE_URL: 'https://your-production-server.com',
    AUTH_URL: 'https://your-production-server.com/api/auth',
    // ...
  }
};
```

## Cách sử dụng

### 1. Đăng nhập
```javascript
import { useDispatch } from 'react-redux';
import { login } from '../redux/actions/authActions';

const dispatch = useDispatch();

const handleLogin = async () => {
  try {
    await dispatch(login(username, password));
    // Đăng nhập thành công
  } catch (error) {
    // Xử lý lỗi
  }
};
```

### 2. Đăng ký
```javascript
import { register } from '../redux/actions/authActions';

const handleRegister = async () => {
  try {
    const userData = { username, email, password };
    await dispatch(register(userData));
    // Đăng ký thành công
  } catch (error) {
    // Xử lý lỗi
  }
};
```

### 3. Kiểm tra trạng thái đăng nhập
```javascript
import { checkAuthStatus } from '../redux/actions/authActions';

// Trong App.tsx hoặc component chính
useEffect(() => {
  dispatch(checkAuthStatus());
}, []);
```

## Lưu trữ dữ liệu

Ứng dụng sử dụng AsyncStorage để lưu trữ:
- JWT Token (`auth_token`)
- Thông tin user (`user_data`)
- Cài đặt game (`game_settings`)

## Xử lý lỗi

Tất cả API calls đều có xử lý lỗi thống nhất:
- Lỗi network
- Lỗi xác thực (401)
- Lỗi từ server (400, 500)
- Timeout

## Bảo mật

- JWT token được lưu trữ an toàn trong AsyncStorage
- Headers Authorization được tự động thêm vào các request cần xác thực
- Token được kiểm tra tự động khi khởi động app
- Tự động logout khi token hết hạn hoặc không hợp lệ

## Chạy ứng dụng

### Yêu cầu
1. Backend Website_Game_online phải đang chạy trên `http://localhost:5000`
2. Database đã được thiết lập và migrate
3. File `.env` có cấu hình JWT_SECRET

### Khởi động
```bash
# Cài đặt dependencies
npm install

# Chạy Metro bundler
npx expo start

# Chạy trên iOS simulator
npx expo run:ios

# Chạy trên Android emulator
npx expo run:android
```

## Môi trường Production

Để deploy lên production:
1. Cập nhật URL trong `src/api/config.js`
2. Thiết lập SSL certificates
3. Cấu hình domain và CORS trên backend
4. Build và deploy ứng dụng

## Debug và Logging

Trong môi trường development, tất cả API requests và responses được log ra console để dễ debug:

```javascript
// Chỉ hoạt động khi __DEV__ = true
console.log('API Request:', method, url, data);
console.log('API Response:', status, responseData);
```

## Mở rộng

Để thêm các API khác:
1. Thêm endpoints vào `config.js`
2. Tạo functions trong `authApi.js` hoặc file API mới
3. Tạo Redux actions tương ứng
4. Cập nhật UI components

## Troubleshooting

### Lỗi thường gặp:

1. **Network Error**: Kiểm tra backend có đang chạy không
2. **CORS Error**: Cấu hình CORS trên backend
3. **Token Expired**: App sẽ tự động logout và yêu cầu đăng nhập lại
4. **AsyncStorage Error**: Kiểm tra quyền truy cập storage

### Logs để debug:
```bash
# React Native logs
npx react-native log-android
npx react-native log-ios

# Metro bundler logs
npx expo start --clear
```

## Liên hệ

Nếu có vấn đề hoặc cần hỗ trợ, vui lòng tạo issue trong repository hoặc liên hệ team phát triển. 