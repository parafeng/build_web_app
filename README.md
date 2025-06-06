## 🛠 Hướng dẫn cài đặt và sử dụng

### **Yêu cầu hệ thống**
- **OS**: Windows 10+ / macOS 10.15+ / Ubuntu 18.04+
- **RAM**: Tối thiểu 8GB (khuyến nghị 16GB)
- **Storage**: Ít nhất 10GB dung lượng trống
- **Network**: Kết nối internet ổn định

### **Cài đặt môi trường phát triển**

#### 1. **Node.js và npm**
```bash
# Tải Node.js LTS từ https://nodejs.org/
# Kiểm tra cài đặt
node --version  # v18.x hoặc mới hơn
npm --version   # v9.x hoặc mới hơn
```

#### 2. **Git**
```bash
# Tải Git từ https://git-scm.com/
git --version
```

#### 3. **Expo CLI**
```bash
npm install -g @expo/cli
expo --version
```

#### 4. **Android Studio (cho Android development)**
```bash
# Tải từ https://developer.android.com/studio
# Cài đặt Android SDK
# Thiết lập biến môi trường ANDROID_HOME
```

### **Cài đặt dự án**

#### 1. **Clone repository**
```bash
git clone https://github.com/parafeng/build_web_app
cd game-mobile-app
```

#### 2. **Cài đặt dependencies**
```bash
npm install
```

#### 3. **Khởi động ứng dụng**
```bash
# Development mode
npm start
# hoặc
expo start

# Chạy trên Android
npm run android

# Chạy trên iOS (macOS only)
npm run ios

# Chạy trên web browser
npm run web
```

### **Sử dụng ứng dụng**

#### **Cho người dùng cuối:**
1. **Đăng ký/Đăng nhập**: Tạo tài khoản hoặc sử dụng chế độ khách
2. **Khám phá game**: Browse qua các category và trending games
3. **Tìm kiếm**: Sử dụng search bar để tìm game theo tên
4. **Chơi game**: Tap vào game để bắt đầu chơi trong WebView
5. **Quản lý profile**: Customize avatar và settings

#### **Cho developers:**
```bash
# TypeScript type checking
npm run tsc

# Code linting
npm run lint

# Build production
expo build:android
expo build:ios
```

### **Cấu trúc dự án**
```
src/
├── api/              # API calls và services
├── assets/           # Images, icons, fonts
├── components/       # Reusable components
├── navigation/       # Navigation configuration
├── redux/           # State management
├── screens/         # Screen components
└── utils/           # Helper functions, i18n
```

### **Troubleshooting thường gặp**

#### **Lỗi Metro Bundler**
```bash
# Clear cache
expo start --clear
npm start --reset-cache
```

#### **Lỗi Android emulator**
```bash
# Khởi động lại ADB
adb kill-server
adb start-server
```

#### **Lỗi dependencies**
```bash
# Reset node_modules
rm -rf node_modules package-lock.json
npm install
```

---


*Báo cáo được tạo vào: 6/6/2025*

