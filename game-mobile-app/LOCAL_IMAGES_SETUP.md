# 🎮 Hướng dẫn Setup Ảnh Local cho Games

## 🚀 Tổng quan

Vì bạn chưa có tài khoản Gamezop, hệ thống đã được cấu hình để sử dụng ảnh local thay vì API. Bạn có thể thêm ảnh thật của games vào thư mục assets.

## 📁 Cấu trúc thư mục đã tạo

```
src/assets/images/games/
├── thumbnails/          ✅ Đã tạo
├── screenshots/         ✅ Đã tạo  
├── banners/            ✅ Đã tạo
├── gameImages.config.js ✅ Đã cấu hình
└── README.md           ✅ Đã có hướng dẫn chi tiết
```

## 🎯 3 Cách thêm ảnh

### 1. 🔄 Sử dụng Placeholder Images (Nhanh nhất)

**Bước 1**: Mở file HTML preview
```bash
# File đã được tạo tại:
game-mobile-app/game-images-preview.html
```

**Bước 2**: Mở file trong browser và right-click để download từng ảnh

**Bước 3**: Lưu ảnh vào đúng thư mục với tên file chính xác

### 2. 📥 Sử dụng Download Scripts (Tự động)

#### Windows PowerShell:
```powershell
# Tạo thư mục (đã có)
New-Item -ItemType Directory -Force -Path "src\assets\images\games\thumbnails"
New-Item -ItemType Directory -Force -Path "src\assets\images\games\screenshots"  
New-Item -ItemType Directory -Force -Path "src\assets\images\games\banners"

# Download thumbnails (ít nhất cần có)
Invoke-WebRequest -Uri "https://via.placeholder.com/150x100/FF6B6B/ffffff?text=Valley%20of%20Terror" -OutFile "src\assets\images\games\thumbnails\valley_of_terror.png"
Invoke-WebRequest -Uri "https://via.placeholder.com/150x100/4ECDC4/ffffff?text=Boulder%20Blast" -OutFile "src\assets\images\games\thumbnails\boulder_blast.png"
# ... (copy toàn bộ script từ placeholder-output.txt)
```

#### macOS/Linux:
```bash
# Tạo thư mục
mkdir -p src/assets/images/games/thumbnails
mkdir -p src/assets/images/games/screenshots
mkdir -p src/assets/images/games/banners

# Download thumbnails
curl "https://via.placeholder.com/150x100/FF6B6B/ffffff?text=Valley%20of%20Terror" -o "src/assets/images/games/thumbnails/valley_of_terror.png"
# ... (copy toàn bộ script từ placeholder-output.txt)
```

### 3. 🎨 Sử dụng Ảnh Thật (Chất lượng tốt nhất)

**Bước 1**: Tìm hoặc tạo ảnh cho từng game
- **Thumbnails**: 150x100px (bắt buộc)
- **Screenshots**: 800x600px (optional)
- **Banners**: 1200x400px (optional)

**Bước 2**: Đặt tên file đúng quy tắc:
```
# Thumbnails
valley_of_terror.png
boulder_blast.png
punch_heroes.png
blazing_blades.png
bottle_shoot.png
puzzle_master.png
speed_racer.png
castle_defense.png
mystery_adventure.png
epic_quest.png
default_game.png

# Screenshots
valley_of_terror_1.png
valley_of_terror_2.png
# ... (tương tự cho các game khác)

# Banners
valley_of_terror_banner.png
boulder_blast_banner.png
# ... (tương tự cho các game khác)
```

## 🔧 Hệ thống đã cấu hình

### ✅ gamezopService.ts
- Demo mode được bật mặc định
- Sử dụng local images thay vì API
- Fallback graceful khi ảnh không tồn tại

### ✅ gameImages.config.js
- Safe require function để tránh crash
- Mapping từ game ID sang image files
- Helper functions để lấy ảnh theo game

### ✅ Error Handling
- App không crash khi thiếu ảnh
- Tự động fallback về placeholder URLs
- Console warnings khi ảnh không tìm thấy

## 🎮 10 Games hiện có

| ID | Game Name | Category | File Key |
|---|---|---|---|
| 1 | Valley of Terror | Action | `valley_of_terror` |
| 2 | Boulder Blast | Action | `boulder_blast` |
| 3 | Punch Heroes | Action | `punch_heroes` |
| 4 | Blazing Blades | Action | `blazing_blades` |
| 5 | Bottle Shoot | Action | `bottle_shoot` |
| 6 | Puzzle Master | Puzzle & Logic | `puzzle_master` |
| 7 | Speed Racer | Sports & Racing | `speed_racer` |
| 8 | Castle Defense | Strategy | `castle_defense` |
| HJXei0j | Mystery Adventure | Adventure | `mystery_adventure` |
| HkTQJhTXqRS | Epic Quest | Adventure | `epic_quest` |

## 🚀 Quick Start (Chỉ cần thumbnails)

**Bước 1**: Download ít nhất 11 thumbnails (10 games + 1 default)
```bash
# Mở game-images-preview.html trong browser
# Right-click download 11 thumbnails từ section đầu tiên
```

**Bước 2**: Lưu vào `src/assets/images/games/thumbnails/`

**Bước 3**: Restart app
```bash
npm start
# hoặc
expo start
```

**Bước 4**: Test trong app
- Mở GamezopDemo từ main menu
- Xem các games có ảnh thumbnail
- Nhấn Analytics để test integration

## 📋 Checklist

### ✅ Minimum Setup (Thumbnails only)
- [ ] Download 11 thumbnail images
- [ ] Lưu vào đúng thư mục `thumbnails/`
- [ ] Đặt tên file chính xác
- [ ] Restart app
- [ ] Test hiển thị trong GamezopDemo

### ✅ Complete Setup (All images)
- [ ] Download 11 thumbnails
- [ ] Download 20 screenshots (2 per game)
- [ ] Download 11 banners
- [ ] Test app hiển thị đầy đủ
- [ ] Verify responsive trên nhiều screen sizes

## 🛠️ Troubleshooting

### Ảnh không hiển thị
1. **Kiểm tra tên file**: Phải chính xác theo quy tắc
2. **Kiểm tra đường dẫn**: Đúng thư mục `thumbnails/`, `screenshots/`, `banners/`
3. **Restart app**: Metro bundler cần refresh để load ảnh mới
4. **Check console**: Xem warnings về missing images

### App crash khi load ảnh
1. **Kích thước file**: Giữ dưới 5MB per image
2. **Format**: Sử dụng PNG hoặc JPG
3. **Resolution**: Đúng kích thước khuyến nghị

### Ảnh bị blur
1. **Resolution**: Tải ảnh có độ phân giải đủ cao
2. **Device pixel ratio**: Test trên nhiều devices

## 🎯 Kết quả mong đợi

Sau khi setup:
- ✅ 10 games hiển thị với ảnh thumbnail đẹp
- ✅ Gamezop integration hoạt động với local images
- ✅ Trải nghiệm consistent giữa demo và real games
- ✅ App không crash khi thiếu ảnh
- ✅ Ready để thêm ảnh thật khi có

## 💡 Tips

1. **Ưu tiên thumbnails**: Chỉ cần thumbnails để app hoạt động tốt
2. **Batch download**: Sử dụng scripts để download nhanh nhiều ảnh
3. **Quality vs Size**: Balance giữa chất lượng và file size
4. **Consistent style**: Giữ style consistent cho tất cả thumbnails
5. **Backup**: Lưu original images ở nơi khác để dùng lại

## 🔄 Update sau này

Khi có tài khoản Gamezop:
1. Cập nhật partner ID trong `gamezopService.ts`
2. Set `demoMode = false`
3. Hệ thống sẽ tự động chuyển sang sử dụng API images
4. Local images sẽ làm fallback khi API fail

---

**🎯 Mục tiêu**: Tạo trải nghiệm visual tốt với ảnh local, sẵn sàng upgrade lên API sau này! 