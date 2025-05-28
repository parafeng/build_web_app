# Game Mobile App

Ứng dụng di động để chơi game trực tuyến, sử dụng các API hiện có từ website game.

## Mục tiêu

Phát triển ứng dụng di động cho phép người dùng:
- Đăng nhập/đăng ký tài khoản
- Xem danh sách trò chơi
- Tìm kiếm và lọc trò chơi theo danh mục
- Chơi game trực tiếp trên thiết bị di động
- Tương tác (bình luận, đánh giá) với trò chơi

## Công nghệ sử dụng

- **React Native**: Framework xây dựng ứng dụng di động đa nền tảng
- **Expo**: Công cụ giúp phát triển React Native dễ dàng hơn
- **Redux**: Quản lý state ứng dụng
- **React Navigation**: Điều hướng trong ứng dụng
- **Axios**: Gọi API

## Cấu trúc thư mục

```
game-mobile-app/
├── src/
│   ├── api/                # Kết nối API
│   │   ├── apiClient.js    # Cấu hình Axios client
│   │   ├── authApi.js      # API xác thực
│   │   └── gamesApi.js     # API trò chơi
│   │   
│   ├── assets/             # Hình ảnh, tài nguyên
│   │   ├── images/         # Hình ảnh
│   │   ├── fonts/          # Font chữ
│   │   └── icons/          # Icon
│   │
│   ├── components/         # Các component tái sử dụng
│   │   ├── common/         # Components dùng chung
│   │   ├── game/           # Components liên quan đến game
│   │   └── ui/             # UI components
│   │
│   ├── navigation/         # Cấu hình điều hướng
│   │   ├── MainNavigator.js        # Navigator chính
│   │   ├── AuthNavigator.js        # Navigator xác thực
│   │   └── GameNavigator.js        # Navigator game
│   │
│   ├── redux/              # State management
│   │   ├── actions/        # Action creators
│   │   │   ├── authActions.js      # Authentication actions
│   │   │   └── gamesActions.js     # Game actions
│   │   │
│   │   ├── reducers/       # Reducers
│   │   │   ├── authReducer.js      # Authentication state
│   │   │   ├── gamesReducer.js     # Games state
│   │   │   └── index.js            # Root reducer
│   │   │
│   │   ├── types/          # Action types
│   │   │   ├── authTypes.js        # Authentication types
│   │   │   └── gamesTypes.js       # Game types
│   │   │
│   │   └── store.js        # Redux store
│   │
│   ├── screens/            # Các màn hình ứng dụng
│   │   ├── auth/           # Màn hình xác thực
│   │   │   ├── LoginScreen.js      # Đăng nhập
│   │   │   └── RegisterScreen.js   # Đăng ký
│   │   │
│   │   ├── game/           # Màn hình game
│   │   │   ├── HomeScreen.js       # Trang chủ
│   │   │   ├── GameDetailsScreen.js  # Chi tiết game
│   │   │   ├── GamePlayScreen.js   # Màn hình chơi game
│   │   │   └── SearchScreen.js     # Tìm kiếm game
│   │   │ 
│   │   └── profile/        # Màn hình hồ sơ
│   │       └── ProfileScreen.js    # Hồ sơ người dùng
│   │
│   └── utils/              # Helper functions
│       ├── constants.js    # Hằng số
│       ├── validation.js   # Validate input
│       └── helpers.js      # Các hàm helper khác
│
├── App.js                  # Entry point
├── app.json                # Cấu hình Expo
└── package.json            # Dependencies
```

## Tính năng chi tiết

### 1. Xác thực người dùng
- Đăng nhập bằng username và password
- Đăng ký tài khoản mới
- Lưu trữ token xác thực
- Tự động đăng nhập lại
- Đăng xuất

### 2. Danh sách trò chơi
- Hiển thị danh sách tất cả trò chơi
- Phân trang
- Lọc theo danh mục
- Hiển thị trò chơi nổi bật

### 3. Chi tiết trò chơi
- Thông tin chi tiết về trò chơi
- Hình ảnh, mô tả
- Danh sách bình luận
- Nút chơi game

### 4. Chơi game
- Tích hợp WebView để chơi game
- Hỗ trợ chơi game HTML5
- Chế độ toàn màn hình

### 5. Tìm kiếm và lọc
- Tìm kiếm game theo tên
- Lọc theo danh mục
- Sắp xếp theo độ phổ biến, thời gian

### 6. Hồ sơ người dùng
- Thông tin cá nhân
- Danh sách game đã chơi
- Thay đổi thông tin tài khoản

### 7. Bình luận và đánh giá
- Thêm bình luận vào game
- Đọc bình luận của người khác
- Đánh giá game

## Kết nối API

Ứng dụng sẽ kết nối với các API từ server backend hiện có:

- **Authentication API**:
  - POST `/api/auth/login` - Đăng nhập
  - POST `/api/auth/register` - Đăng ký
  - GET `/api/auth/profile` - Lấy thông tin profile
  - GET `/api/auth/check` - Kiểm tra trạng thái đăng nhập

- **Games API**:
  - GET `/api/games` - Lấy danh sách game
  - GET `/api/games/:id` - Lấy chi tiết game
  - GET `/api/games/category/:category` - Lọc game theo danh mục
  - GET `/api/games/search?q=query` - Tìm kiếm game

- **Comments API**:
  - GET `/api/comments/game/:gameId` - Lấy bình luận của game
  - POST `/api/comments` - Thêm bình luận

## Quy trình phát triển

1. **Thiết lập dự án cơ bản**:
   - Cài đặt Expo CLI
   - Khởi tạo dự án
   - Thiết lập cấu trúc thư mục

2. **Phát triển tính năng xác thực**:
   - Màn hình đăng nhập/đăng ký
   - Kết nối API xác thực
   - Lưu trữ token

3. **Phát triển tính năng danh sách trò chơi**:
   - Hiển thị danh sách
   - Lọc theo danh mục
   - Hiển thị chi tiết

4. **Phát triển tính năng chơi game**:
   - Tích hợp WebView
   - Chơi game HTML5

5. **Phát triển tính năng hồ sơ và tương tác**:
   - Hiển thị thông tin người dùng
   - Thêm bình luận, đánh giá

6. **Kiểm thử và tối ưu hóa**:
   - Kiểm thử trên nhiều thiết bị
   - Tối ưu hiệu suất

## API Base URL

- Development: `http://localhost:5000/api`
- Production: `https://your-game-api.com/api`

## Công cụ phát triển

- Visual Studio Code
- Expo Development Client
- Android Studio (cho máy ảo Android)
- Xcode (cho máy ảo iOS - chỉ trên macOS)

## Hướng dẫn thiết lập dự án

1. Cài đặt các công cụ cần thiết:
```bash
npm install -g expo-cli
```

2. Khởi tạo dự án:
```bash
npx create-expo-app game-mobile-app
cd game-mobile-app
```

3. Cài đặt các dependencies:
```bash
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
npm install react-redux redux redux-thunk
npm install axios
npm install react-native-gesture-handler react-native-reanimated
npm install @react-native-async-storage/async-storage
expo install expo-status-bar
```

4. Chạy ứng dụng:
```bash
npm start
``` 