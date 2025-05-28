# 🎮 Game Images Directory

## 📁 Cấu trúc thư mục

```
games/
├── thumbnails/          # Ảnh thumbnail game (150x100px)
├── screenshots/         # Ảnh screenshot game (800x600px)  
├── banners/            # Ảnh banner game (1200x400px)
├── gameImages.config.js # File cấu hình quản lý ảnh
└── README.md           # Hướng dẫn này
```

## 🖼️ Quy cách ảnh

### **Thumbnails** (150x100px)
- **Mục đích**: Hiển thị trong danh sách game catalog
- **Kích thước**: 150x100 pixels (tỷ lệ 3:2)
- **Format**: PNG hoặc JPG
- **Tên file**: `{game_key}.png`

**Ví dụ:**
- `valley_of_terror.png`
- `mystery_adventure.png`
- `epic_quest.png`

### **Screenshots** (800x600px)
- **Mục đích**: Hiển thị trong chi tiết game
- **Kích thước**: 800x600 pixels (tỷ lệ 4:3)
- **Format**: PNG hoặc JPG
- **Tên file**: `{game_key}_{số}.png`

**Ví dụ:**
- `valley_of_terror_1.png`
- `valley_of_terror_2.png`
- `mystery_adventure_1.png`

### **Banners** (1200x400px)
- **Mục đích**: Hiển thị banner quảng cáo game
- **Kích thước**: 1200x400 pixels (tỷ lệ 3:1)
- **Format**: PNG hoặc JPG
- **Tên file**: `{game_key}_banner.png`

**Ví dụ:**
- `valley_of_terror_banner.png`
- `mystery_adventure_banner.png`

## 🎯 Danh sách Game cần ảnh

### **Action Games:**
1. `valley_of_terror` - Valley of Terror
2. `boulder_blast` - Boulder Blast
3. `punch_heroes` - Punch Heroes
4. `blazing_blades` - Blazing Blades
5. `bottle_shoot` - Bottle Shoot

### **Puzzle & Logic Games:**
6. `puzzle_master` - Puzzle Master

### **Sports & Racing Games:**
7. `speed_racer` - Speed Racer

### **Strategy Games:**
8. `castle_defense` - Castle Defense

### **Adventure Games (Gamezop):**
9. `mystery_adventure` - Mystery Adventure (HJXei0j)
10. `epic_quest` - Epic Quest (HkTQJhTXqRS)

### **Default:**
11. `default_game` - Default fallback image

## 📝 Cách sử dụng

### **1. Import trong component:**
```javascript
import gameImages from '../assets/images/games/gameImages.config';
```

### **2. Lấy thumbnail:**
```javascript
const thumbnail = gameImages.getGameThumbnail('HJXei0j');
// hoặc
const thumbnail = gameImages.GameThumbnails.mystery_adventure;
```

### **3. Lấy screenshots:**
```javascript
const screenshots = gameImages.getGameScreenshots('HJXei0j');
// Trả về array: [screenshot1, screenshot2]
```

### **4. Lấy banner:**
```javascript
const banner = gameImages.getGameBanner('HJXei0j');
```

### **5. Sử dụng trong Image component:**
```jsx
<Image 
  source={gameImages.getGameThumbnail(game.id)} 
  style={styles.gameImage} 
/>
```

## 🔧 Cập nhật gamezopService

File `gamezopService.ts` đã được cập nhật để sử dụng ảnh local thay vì placeholder:

```typescript
import gameImages from '../assets/images/games/gameImages.config';

// Trong createDemoGame method:
thumbnail: gameImages.getGameThumbnail(id),
```

## 📋 Checklist ảnh cần thêm

### **Thumbnails (150x100px):**
- [ ] `valley_of_terror.png`
- [ ] `boulder_blast.png`
- [ ] `punch_heroes.png`
- [ ] `blazing_blades.png`
- [ ] `bottle_shoot.png`
- [ ] `puzzle_master.png`
- [ ] `speed_racer.png`
- [ ] `castle_defense.png`
- [ ] `mystery_adventure.png`
- [ ] `epic_quest.png`
- [ ] `default_game.png`

### **Screenshots (800x600px):**
- [ ] Mỗi game cần 2 screenshots
- [ ] Total: 22 files (11 games × 2 screenshots)

### **Banners (1200x400px):**
- [ ] `valley_of_terror_banner.png`
- [ ] `boulder_blast_banner.png`
- [ ] `punch_heroes_banner.png`
- [ ] `blazing_blades_banner.png`
- [ ] `bottle_shoot_banner.png`
- [ ] `puzzle_master_banner.png`
- [ ] `speed_racer_banner.png`
- [ ] `castle_defense_banner.png`
- [ ] `mystery_adventure_banner.png`
- [ ] `epic_quest_banner.png`
- [ ] `default_game_banner.png`

## 🎨 Gợi ý thiết kế

### **Thumbnails:**
- Hiển thị character chính hoặc scene đặc trưng
- Màu sắc tươi sáng, thu hút
- Text overlay tên game (optional)
- Consistent style across all games

### **Screenshots:**
- Gameplay thực tế
- UI elements visible
- Action scenes
- Different game modes/levels

### **Banners:**
- Logo game prominent
- Key visual elements
- Call-to-action space
- Marketing-ready design

## 🚀 Sau khi thêm ảnh

1. **Test thumbnails**: Kiểm tra GameCatalogScreen
2. **Test screenshots**: Kiểm tra GameScreen details
3. **Test banners**: Kiểm tra promotional displays
4. **Fallback**: Đảm bảo default images hoạt động

## 💡 Tips

- **Optimize images**: Sử dụng tools như TinyPNG
- **Consistent quality**: Cùng style và chất lượng
- **File size**: Giữ file size nhỏ cho performance
- **Naming**: Tuân thủ naming convention
- **Backup**: Lưu source files ở nơi khác 

# Game Images Guide

## 📁 Cấu trúc thư mục

```
src/assets/images/games/
├── thumbnails/          # Ảnh thumbnail games (150x100px)
├── screenshots/         # Ảnh screenshots games (800x600px) 
├── banners/            # Ảnh banner games (1200x400px)
├── gameImages.config.js # File cấu hình
└── README.md           # File hướng dẫn này
```

## 🎮 Games hiện có

### Action Games (5 games)
1. **Valley of Terror** (ID: 1) - `valley_of_terror`
2. **Boulder Blast** (ID: 2) - `boulder_blast`
3. **Punch Heroes** (ID: 3) - `punch_heroes`
4. **Blazing Blades** (ID: 4) - `blazing_blades`
5. **Bottle Shoot** (ID: 5) - `bottle_shoot`

### Puzzle & Logic Games (1 game)
6. **Puzzle Master** (ID: 6) - `puzzle_master`

### Sports & Racing Games (1 game)
7. **Speed Racer** (ID: 7) - `speed_racer`

### Strategy Games (1 game)
8. **Castle Defense** (ID: 8) - `castle_defense`

### Adventure Games - Gamezop (2 games)
9. **Mystery Adventure** (ID: HJXei0j) - `mystery_adventure`
10. **Epic Quest** (ID: HkTQJhTXqRS) - `epic_quest`

## 📷 Cách thêm ảnh

### 1. Thumbnails (Required)
**Kích thước**: 150x100px  
**Format**: PNG, JPG  
**Đặt tên**: `{game_key}.png`

```
thumbnails/
├── valley_of_terror.png
├── boulder_blast.png
├── punch_heroes.png
├── blazing_blades.png
├── bottle_shoot.png
├── puzzle_master.png
├── speed_racer.png
├── castle_defense.png
├── mystery_adventure.png
├── epic_quest.png
└── default_game.png (fallback)
```

### 2. Screenshots (Optional)
**Kích thước**: 800x600px  
**Format**: PNG, JPG  
**Đặt tên**: `{game_key}_1.png`, `{game_key}_2.png`, etc.

```
screenshots/
├── valley_of_terror_1.png
├── valley_of_terror_2.png
├── boulder_blast_1.png
├── boulder_blast_2.png
└── ... (các game khác)
```

### 3. Banners (Optional)
**Kích thước**: 1200x400px  
**Format**: PNG, JPG  
**Đặt tên**: `{game_key}_banner.png`

```
banners/
├── valley_of_terror_banner.png
├── boulder_blast_banner.png
├── punch_heroes_banner.png
└── ... (các game khác)
```

## 🔧 Cách thêm game mới

### Bước 1: Thêm ảnh vào thư mục
1. Thêm thumbnail vào `thumbnails/`
2. Thêm screenshots vào `screenshots/` (optional)
3. Thêm banner vào `banners/` (optional)

### Bước 2: Cập nhật gameImages.config.js
```javascript
// Thêm vào GameThumbnails
new_game: safeRequire('./thumbnails/new_game.png'),

// Thêm vào GameScreenshots (nếu có)
new_game: [
  safeRequire('./screenshots/new_game_1.png'),
  safeRequire('./screenshots/new_game_2.png'),
].filter(img => img !== null),

// Thêm vào GameBanners (nếu có)
new_game: safeRequire('./banners/new_game_banner.png'),

// Thêm mapping trong helper functions
'new_id': 'new_game',
```

### Bước 3: Cập nhật gamezopService.ts
```javascript
// Thêm game mới vào getDemoGames()
this.createDemoGame('new_id', 'New Game Name', 'Description', 'Category', 
                    '5 mins', '10K', 'fallback_url')
```

## 📋 Checklist khi thêm ảnh

### ✅ Trước khi thêm
- [ ] Đã có ảnh thumbnail (bắt buộc)
- [ ] Ảnh có đúng kích thước khuyến nghị
- [ ] Tên file đặt đúng quy tắc
- [ ] Ảnh có chất lượng tốt

### ✅ Sau khi thêm
- [ ] Test app để xem ảnh hiển thị đúng
- [ ] Kiểm tra console không có warning
- [ ] Verify fallback hoạt động (nếu ảnh lỗi)
- [ ] Test trên cả iOS và Android

## 🎨 Gợi ý thiết kế

### Thumbnails
- **Style**: Gaming style, colorful
- **Content**: Game logo hoặc screenshot đại diện
- **Text**: Tối thiểu, chỉ game title nếu cần
- **Background**: Có thể transparent hoặc solid

### Screenshots
- **Content**: Gameplay screenshots thực tế
- **Quality**: High resolution, clear
- **Variety**: Khác nhau để show game features
- **Format**: Landscape orientation preferred

### Banners
- **Style**: Marketing banner style
- **Content**: Game logo + key visuals + tagline
- **Text**: Game title + short description
- **Background**: Eye-catching, thể hiện game theme

## 🔍 Troubleshooting

### Ảnh không hiển thị
1. Kiểm tra tên file có đúng không
2. Kiểm tra đường dẫn trong config
3. Xem console có warning không
4. Restart app sau khi thêm ảnh

### App crash khi load ảnh
1. Kiểm tra kích thước file (< 5MB recommended)
2. Kiểm tra format file (PNG/JPG)
3. Thử với ảnh khác để test

### Ảnh bị blur/pixelated
1. Kiểm tra resolution gốc
2. Đảm bảo ảnh có kích thước đúng
3. Sử dụng format PNG cho ảnh có text

## 📱 Responsive Design

Ảnh sẽ tự động scale theo device:
- **Thumbnails**: Scale to fit card size
- **Screenshots**: Full width with aspect ratio maintained
- **Banners**: Full width, height adaptive

## 💡 Tips

1. **Batch processing**: Sử dụng tools như Photoshop batch để resize nhiều ảnh cùng lúc
2. **Naming convention**: Giữ consistent naming để dễ quản lý
3. **Backup**: Lưu ảnh gốc ở resolution cao trước khi resize
4. **Optimization**: Sử dụng tools như TinyPNG để optimize file size
5. **Testing**: Test trên nhiều devices với screen sizes khác nhau

---

**🎯 Mục tiêu**: Tạo trải nghiệm visual tốt nhất cho users với ảnh chất lượng cao và load nhanh! 