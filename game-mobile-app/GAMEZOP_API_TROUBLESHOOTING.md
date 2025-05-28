# Gamezop API Troubleshooting Guide

## Lỗi phổ biến và cách khắc phục

### 🔴 Error 401: Unauthorized

**Nguyên nhân:**
- Partner ID không đúng hoặc không hợp lệ
- API key không được cấu hình đúng
- Tài khoản Gamezop chưa được kích hoạt

**Giải pháp:**
1. **Kiểm tra Partner ID:**
   ```typescript
   // Trong gamezopService.ts
   partnerId: 'zv1y2i8p' // Đảm bảo đúng partner ID
   ```

2. **Xác thực với Gamezop:**
   - Đăng nhập vào [Gamezop Partner Dashboard](https://partners.gamezop.com)
   - Xác minh partner ID và API credentials
   - Kiểm tra trạng thái tài khoản

3. **Sử dụng Demo Mode tạm thời:**
   ```typescript
   gamezopService.setDemoMode(true);
   ```

### 🔴 Network Connection Error

**Nguyên nhân:**
- Không có kết nối internet
- Firewall hoặc proxy chặn request
- VPN gây ảnh hưởng đến connection
- CORS issues trong development

**Giải pháp:**
1. **Kiểm tra kết nối:**
   - Thử truy cập https://pub.gamezop.com/v3/games trên browser
   - Kiểm tra internet connection

2. **Vô hiệu hóa VPN:**
   - Tắt VPN nếu đang sử dụng
   - Thử kết nối trực tiếp

3. **Kiểm tra Firewall:**
   - Cho phép app truy cập internet
   - Kiểm tra corporate firewall settings

### 🔴 API Service Unavailable

**Nguyên nhân:**
- Gamezop API servers đang maintenance
- Rate limiting đã được áp dụng
- Regional restrictions

**Giải pháp:**
1. **Đợi và thử lại:**
   - Chờ 5-10 phút rồi thử lại
   - Kiểm tra [Gamezop Status Page](https://status.gamezop.com)

2. **Sử dụng alternative endpoints:**
   - Service tự động thử multiple endpoints
   - v2 và v3 API endpoints

3. **Fallback to Demo Mode:**
   - Tự động chuyển sang demo mode
   - 10 games mẫu có sẵn

## Cách debug API issues

### 1. Enable Console Logging
```typescript
// App sẽ tự động log các API calls
// Xem Console trong React Native debugger
```

### 2. Test API Manual
```bash
# Test trực tiếp API endpoint
curl "https://pub.gamezop.com/v3/games?id=zv1y2i8p&lang=en"
```

### 3. Sử dụng GamezopIntegrationTest
```typescript
// Trong app, mở GamezopDemo → Analytics icon
// Component này có tools debug tổng hợp
```

## Error Handling trong Code

### Automatic Fallback
```typescript
// Service tự động fallback to demo mode khi API fail
try {
  const games = await gamezopService.getGames();
  // Real API success
} catch (error) {
  // Automatic fallback to demo games
  console.log('Using demo mode as fallback');
}
```

### Error Component
```typescript
// GamezopErrorHandler hiển thị lỗi user-friendly
<GamezopErrorHandler
  error={{
    message: 'API Error 401',
    code: 401,
    type: 'auth'
  }}
  onRetry={handleRetry}
  onFallback={useDemoMode}
/>
```

## Demo Mode

### Khi nào sử dụng Demo Mode
- Development và testing
- Khi API không khả dụng
- Muốn test UI mà không cần real data

### Cách bật Demo Mode
```typescript
// Programmatically
gamezopService.setDemoMode(true);

// Hoặc qua UI trong GamezopIntegrationTest
// Toggle switch trong app
```

### Demo Mode Features
- 10 games mẫu đa dạng categories
- Placeholder images
- Simulated API delay
- Đầy đủ functionality cho testing

## Production Checklist

### ✅ Trước khi deploy
- [ ] Test API connection thành công
- [ ] Partner ID được verify
- [ ] Error handling hoạt động đúng
- [ ] Fallback mechanism tested
- [ ] Demo mode có thể tắt được

### ✅ Monitoring
- [ ] Log API response times
- [ ] Track error rates
- [ ] Monitor fallback usage
- [ ] User experience metrics

## Support Contacts

### Gamezop Support
- **Documentation**: [https://www.gamezop.com/developer](https://www.gamezop.com/developer)
- **Partner Portal**: [https://partners.gamezop.com](https://partners.gamezop.com)
- **Status Page**: [https://status.gamezop.com](https://status.gamezop.com)

### Technical Support
- **Email**: support@gamezop.com
- **Response Time**: 24-48 hours
- **Include**: Partner ID, error logs, steps to reproduce

---

**💡 Tip**: Luôn giữ demo mode như một fallback option để đảm bảo app hoạt động ngay cả khi API có vấn đề. 