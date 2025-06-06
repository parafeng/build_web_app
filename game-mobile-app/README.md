# Game Mobile App

Ứng dụng di động để chơi game trực tuyến, sử dụng các API hiện có từ website game.

## Yêu cầu hệ thống (Windows)

- Windows 10 hoặc mới hơn (khuyến nghị Windows 10 64-bit)
- Tối thiểu 8GB RAM (khuyến nghị 16GB)
- Ít nhất 10GB dung lượng ổ đĩa trống
- Kết nối internet ổn định

## Hướng dẫn cài đặt môi trường (Windows)

### 1. Cài đặt Node.js và npm

1. Truy cập [https://nodejs.org/](https://nodejs.org/)
2. Tải xuống phiên bản LTS mới nhất (khuyến nghị Node.js 18.x hoặc mới hơn)
3. Chạy file cài đặt và làm theo các bước hướng dẫn
4. Kiểm tra cài đặt bằng cách mở Command Prompt hoặc PowerShell và chạy:
   ```
   node --version
   npm --version
   ```

### 2. Cài đặt Git (nếu chưa có)

1. Truy cập [https://git-scm.com/download/win](https://git-scm.com/download/win)
2. Tải xuống và cài đặt Git cho Windows
3. Kiểm tra cài đặt:
   ```
   git --version
   ```

### 3. Cài đặt Android Studio (để chạy máy ảo Android)

1. Truy cập [https://developer.android.com/studio](https://developer.android.com/studio)
2. Tải xuống và cài đặt Android Studio
3. Trong quá trình cài đặt, đảm bảo chọn các thành phần:
   - Android SDK
   - Android SDK Platform
   - Android Virtual Device
4. Sau khi cài đặt, mở Android Studio và hoàn tất cài đặt SDK bằng SDK Manager
5. Tạo biến môi trường ANDROID_HOME trỏ đến thư mục Android SDK:
   - Mở "Edit the system environment variables" từ Control Panel
   - Chọn "Environment Variables"
   - Trong "System variables", chọn "New" và thêm:
     - Variable name: ANDROID_HOME
     - Variable value: C:\Users\YOUR_USERNAME\AppData\Local\Android\Sdk (thay YOUR_USERNAME bằng tên người dùng của bạn)
   - Thêm vào biến PATH:
     - %ANDROID_HOME%\platform-tools
     - %ANDROID_HOME%\emulator

### 4. Cài đặt Expo CLI

Mở Command Prompt hoặc PowerShell với quyền Administrator và chạy:

```
npm install -g expo-cli
```

## Hướng dẫn chạy ứng dụng

### 1. Clone dự án (nếu chưa có)

```
git clone <repository-url>
cd build_web_app/game-mobile-app
```

### 2. Cài đặt các dependencies

```
npm install
```

### 3. Khởi động ứng dụng

```
npx expo start
```

Sau khi chạy lệnh này, một cửa sổ trình duyệt sẽ mở ra với Metro Bundler.

### 4. Chạy ứng dụng trên thiết bị

#### Chạy trên máy ảo Android:
1. Mở Android Studio
2. Mở AVD Manager (Android Virtual Device Manager)
3. Tạo một thiết bị ảo nếu chưa có
4. Khởi động máy ảo
5. Trong cửa sổ Metro Bundler, nhấn phím 'a' để chạy ứng dụng trên máy ảo Android

#### Chạy trên thiết bị Android thật:
1. Cài đặt ứng dụng Expo Go từ Google Play Store trên thiết bị Android
2. Kết nối thiết bị và máy tính của bạn vào cùng một mạng Wi-Fi
3. Quét mã QR hiển thị trong Metro Bundler bằng ứng dụng Expo Go

#### Chạy trên trình duyệt web:
1. Trong cửa sổ Metro Bundler, nhấn phím 'w' để chạy ứng dụng trên trình duyệt web

## Xử lý sự cố thường gặp

### 1. Lỗi "Unable to find expo in this project"
- Chạy lệnh: `npm install expo`

### 2. Lỗi kết nối với máy ảo Android
- Kiểm tra xem máy ảo đã được khởi động chưa
- Đảm bảo ADB được cài đặt và thêm vào PATH
- Thử khởi động lại Metro Bundler: nhấn Ctrl+C để dừng và chạy lại `npx expo start`

### 3. Lỗi "Cannot connect to Metro Bundler"
- Kiểm tra tường lửa và phần mềm bảo mật
- Thử chạy với cổng khác: `npx expo start --port 19001`
- Đảm bảo không có tiến trình Metro Bundler nào đang chạy

### 4. Lỗi liên quan đến Node.js
- Thử xóa thư mục node_modules và file package-lock.json
- Chạy lại `npm install`
- Đảm bảo sử dụng phiên bản Node.js được hỗ trợ

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
│   │   ├── reducers/       # Reducers
│   │   ├── types/          # Action types
│   │   └── store.js        # Redux store
│   │
│   ├── screens/            # Các màn hình ứng dụng
│   │   ├── auth/           # Màn hình xác thực
│   │   ├── game/           # Màn hình game
│   │   └── profile/        # Màn hình hồ sơ
│   │
│   └── utils/              # Helper functions
│       ├── i18n/           # Đa ngôn ngữ
│       ├── constants.js    # Hằng số
│       └── helpers.js      # Các hàm helper khác
│
├── App.js                  # Entry point
├── app.json                # Cấu hình Expo
└── package.json            # Dependencies
```

## Tính năng chính

- Đăng nhập/đăng ký tài khoản
- Xem danh sách trò chơi
- Tìm kiếm và lọc trò chơi theo danh mục
- Chơi game trực tiếp trên thiết bị di động
- Bình luận và đánh giá trò chơi
- Hồ sơ người dùng
- Hỗ trợ đa ngôn ngữ

## Liên hệ hỗ trợ

Nếu bạn gặp bất kỳ vấn đề nào khi cài đặt hoặc chạy ứng dụng, vui lòng liên hệ:

- Email: support@gamemobileapp.com
- Discord: GameMobileApp Community
- GitHub Issues: [repository-issues-url] 