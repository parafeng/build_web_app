# Gamezop Integration Guide

Hệ thống tích hợp Gamezop cho phép ứng dụng game mobile hiển thị và chơi hàng trăm games từ Gamezop platform thông qua WebView embed.

## Tính năng chính

### 🎮 Dual Mode System
- **Demo Mode**: 10 games với placeholder images để test
- **Live Mode**: Hàng trăm games thật từ Gamezop API với ảnh CDN

### 🔗 API Integration
- Tích hợp với Gamezop All Games API
- Automatic fallback khi API không khả dụng
- Real-time API status monitoring

### 📱 Seamless Gaming Experience
- WebView fullscreen cho games Gamezop
- External browser cho games khác
- Smart game type detection

## Cấu trúc Files

```
src/
├── api/
│   └── gamezopService.ts          # Core Gamezop API service
├── components/game/
│   ├── GamezopEmbed.tsx           # WebView embed component
│   ├── GamezopAPITest.tsx         # API testing component
│   ├── GamezopIntegrationTest.tsx # Comprehensive test component
│   └── GamezopStats.tsx           # Stats & status component
├── screens/game/
│   ├── GameScreen.tsx             # Smart game handling
│   └── GamezopDemo.tsx            # Demo & testing screen
└── assets/images/games/
    ├── gameImages.config.js       # Image management config
    ├── thumbnails/                # 150x100 game thumbnails
    ├── screenshots/               # 800x600 game screenshots
    └── banners/                   # 1200x400 game banners
```

## Demo Games

Hệ thống có 10 demo games được cấu hình sẵn:

| Game ID | Name | Category |
|---------|------|----------|
| 1 | Valley of Terror | Action |
| 2 | Boulder Blast | Action |
| 3 | Punch Heroes | Action |
| 4 | Blazing Blades | Action |
| 5 | Bottle Shoot | Action |
| 6 | Puzzle Master | Puzzle & Logic |
| 7 | Speed Racer | Sports & Racing |
| 8 | Castle Defense | Strategy |
| HJXei0j | Mystery Adventure | Adventure |
| HkTQJhTXqRS | Epic Quest | Adventure |

## Testing

### 1. Demo Mode Testing
```bash
# Trong GamezopDemo screen
1. Mở GamezopDemo
2. Tap vào settings icon (⚙️)
3. Test API connection
4. Toggle demo mode
5. Load real games
```

### 2. Integration Testing
```bash
# Trong GamezopDemo screen
1. Mở GamezopDemo
2. Tap vào analytics icon (📊)
3. Xem comprehensive test interface
4. Test API, toggle modes, filter categories
5. Play games để test WebView
```

## Configuration

### Environment Variables
```env
GAMEZOP_PARTNER_ID=zv1y2i8p
GAMEZOP_API_KEY=your-api-key
```

### API Endpoints
- **All Games API**: `https://pub.gamezop.com/v3/games?id={partnerId}&lang=en`
- **Game Embed**: `https://{partnerId}.play.gamezop.com/g/{gameId}`

---

**Lưu ý**: Hệ thống đã được test và hoạt động ổn định với cả demo mode và live API mode.
