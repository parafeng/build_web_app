# Icons Folder - Game Mobile App 🎨

## 📁 Cấu trúc thư mục

```
src/assets/icons/
├── tabs/              # Icons cho bottom tabs (Home, Game, Profile)
├── buttons/           # Icons cho các nút trong app
└── README.md          # File hướng dẫn này
```

## 🎯 Hướng dẫn thêm icon

### 1. **Tab Icons (Bottom Navigation):**
Thêm các file icon vào folder `tabs/`:
- `home.png` và `home_active.png` - Icon trang chủ
- `game.png` và `game_active.png` - Icon chơi game  
- `profile.png` và `profile_active.png` - Icon hồ sơ

### 2. **Button Icons:**
Thêm các file icon vào folder `buttons/`:
- `edit.png` - Icon chỉnh sửa
- `logout.png` - Icon đăng xuất
- `settings.png` - Icon cài đặt
- `back.png` - Icon quay lại
- v.v...

## 📐 Quy cách thiết kế

### **Kích thước khuyến nghị:**
- **Tab icons:** 24x24px hoặc 32x32px
- **Button icons:** 20x20px hoặc 24x24px
- **Format:** PNG với background trong suốt
- **Resolution:** @2x và @3x cho Retina display

### **Màu sắc:**
- **Active tabs:** Màu chủ đạo (#6366f1)
- **Inactive tabs:** Màu xám (#8e8e93)
- **Buttons:** Tùy theo context (primary, secondary, danger)

## 🚀 Cách sử dụng trong code

### **Import icon:**
```tsx
import HomeIcon from '../assets/icons/tabs/home.png';
import HomeActiveIcon from '../assets/icons/tabs/home_active.png';
```

### **Sử dụng trong component:**
```tsx
<Image 
  source={isActive ? HomeActiveIcon : HomeIcon} 
  style={{ width: 24, height: 24 }}
/>
```

### **Trong Tab Navigator:**
```tsx
tabBarIcon: ({ focused }) => (
  <Image 
    source={focused ? HomeActiveIcon : HomeIcon}
    style={{ width: 24, height: 24 }}
  />
)
```

## 📝 Ghi chú

- Đặt tên file rõ ràng và nhất quán
- Sử dụng snake_case: `home_active.png`
- Tối ưu kích thước file cho mobile
- Test trên cả iOS và Android
- Backup icons quan trọng

**🎨 Sẵn sàng để bạn thêm icons tùy chỉnh!** 