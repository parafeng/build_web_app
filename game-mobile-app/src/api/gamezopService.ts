// Gamezop API Service
// Tích hợp với Gamezop để lấy danh sách games và URLs

import gameImages, { getGameThumbnail, getGameScreenshots, getGameBanner } from '../assets/images/games/gameImages.config';

interface GamezopConfig {
  partnerId: string;
  apiKey: string;
  baseUrl: string;
  language: string;
}

interface GamezopGame {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  category: string;
  averageSession: string;
  playCount: string;
  gameUrl: string;
  embedUrl: string;
  // Thêm fields cho ảnh từ Gamezop API
  screenshots?: string[];
  banner?: string;
  assets?: {
    cover?: string;
    brick?: string;
    wall?: string;
    thumb?: string;
    square?: string;
    screens?: string[];
    coverTiny?: string;
    brickTiny?: string;
  };
}

class GamezopService {
  private config: GamezopConfig;
  private demoMode: boolean = false; // Tắt demo mode mặc định

  constructor() {
    this.config = {
      partnerId: process.env.GAMEZOP_PARTNER_ID || 'zv1y2i8p',
      apiKey: process.env.GAMEZOP_API_KEY || 'your-api-key',
      baseUrl: 'https://api.gamezop.com/v2',
      language: 'en' // English for more games
    };
    
    // Không sử dụng demo mode mặc định
    this.demoMode = false;
    console.log('🎮 Gamezop Service: Using real API by default');
  }

  // Lấy danh sách games từ Gamezop API
  async getGames(category?: string, limit: number = 20): Promise<GamezopGame[]> {
    // Demo mode - return demo data immediately
    if (this.demoMode) {
      console.log('🎮 Gamezop Demo Mode: Using demo games data');
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return this.getDemoGames(category);
    }

    try {
      console.log('Fetching games from Gamezop API...');
      // Try multiple API endpoints
      const apiUrls = [
        `https://pub.gamezop.com/v3/games?id=${this.config.partnerId}&lang=${this.config.language}`,
        `https://pub.gamezop.com/v2/games?id=${this.config.partnerId}&lang=${this.config.language}`,
        `https://api.gamezop.com/v3/games?id=${this.config.partnerId}&lang=${this.config.language}`
      ];

      let lastError = null;
      
      for (const apiUrl of apiUrls) {
        try {
          console.log(`Trying API: ${apiUrl}`);

          const response = await fetch(apiUrl, {
            method: 'GET',
        headers: {
              'Accept': 'application/json',
          'Content-Type': 'application/json',
              'User-Agent': 'GamezopReactNativeApp/1.0'
            },
            credentials: 'omit' // Không gửi credentials
      });

          if (response.ok) {
            const data = await response.json();
            console.log('✅ Gamezop API Success:', data.games?.length, 'games loaded');
            
            let games = this.formatGamesFromAPI(data.games || []);
            
            // Filter by category if specified
            if (category && category !== 'All') {
              games = games.filter(game => game.category === category);
            }
            
            // Limit results
            games = games.slice(0, limit);
            
            return games;
          } else {
            console.warn(`API ${apiUrl} failed with status:`, response.status);
            lastError = new Error(`API Error: ${response.status}`);
          }
        } catch (err) {
          console.warn(`API ${apiUrl} failed:`, err.message);
          lastError = err;
        }
      }

      throw lastError || new Error('All API endpoints failed');
      
    } catch (error) {
      console.error('Error fetching games from Gamezop:', error);
      console.log('🔄 Falling back to demo data...');
      // Return demo data as fallback
      return this.getDemoGames(category);
    }
  }

  // Tạo URL để chơi game với Gamezop (mở trong cửa sổ mới)
  getGameUrl(gameId: string, customParams?: Record<string, string>): string {
    const params = new URLSearchParams({
      partnerId: this.config.partnerId,
      language: this.config.language,
      gameId,
      theme: '#1e90ff',
      ...customParams
    });

    return `https://games.gamezop.com/v2/play?${params}`;
  }

  // Tạo URL để embed game trong iframe
  getEmbedUrl(gameId: string, customParams?: Record<string, string>): string {
    // Sử dụng định dạng URL như trong example: https://zv1y2i8p.play.gamezop.com/g/Rt5ytrd0m
    const baseEmbedUrl = `https://${this.config.partnerId}.play.gamezop.com/g/${gameId}`;
    
    if (customParams && Object.keys(customParams).length > 0) {
      const params = new URLSearchParams(customParams);
      return `${baseEmbedUrl}?${params}`;
    }
    
    return baseEmbedUrl;
  }

  // Tạo HTML iframe để embed game
  getGameIframe(gameId: string, options?: {
    width?: string;
    height?: string;
    style?: string;
    customParams?: Record<string, string>;
  }): string {
    const {
      width = '100%',
      height = '100%',
      style = 'width: 100%; height: 100%; border: 0px;',
      customParams
    } = options || {};

    const embedUrl = this.getEmbedUrl(gameId, customParams);

    return `<iframe 
      seamless="seamless" 
      allowtransparency="true" 
      allowfullscreen="true" 
      frameborder="0" 
      style="${style}" 
      src="${embedUrl}">
    </iframe>`;
  }

  // Format games từ Gamezop API response (Real API)
  private formatGamesFromAPI(gamezopGames: any[]): GamezopGame[] {
    return gamezopGames.map(game => {
      // Lấy thumbnail URL từ assets nếu có
      const thumbUrl = game.assets?.cover || game.assets?.brick || game.assets?.thumb || '';
      
      return {
        id: game.code, // Gamezop sử dụng 'code' làm ID
        name: game.name?.en || game.name || 'Unknown Game',
        description: game.description?.en || game.description || '',
        thumbnail: thumbUrl || '', // Đảm bảo luôn trả về chuỗi rỗng nếu không có thumbnail
        category: this.mapCategoryFromAPI(game.categories?.en?.[0] || 'Arcade'),
        averageSession: this.estimateSessionTime(game.width, game.height),
        playCount: this.formatPlayCount(game.gamePlays || 0),
        gameUrl: game.url || this.getGameUrl(game.code),
        embedUrl: game.url || this.getEmbedUrl(game.code),
        // Thêm thông tin ảnh từ Gamezop API
        screenshots: game.assets?.screens || [],
        banner: game.assets?.wall || game.assets?.cover || '',
        assets: game.assets || {}
      };
    });
  }

  // Format games từ demo data (fallback)
  private formatGames(gamezopGames: any[]): GamezopGame[] {
    return gamezopGames.map(game => {
      // Đảm bảo thumbnail là chuỗi hợp lệ
      const thumbUrl = game.thumbnail || game.icon || '';
      
      return {
      id: game.id.toString(),
      name: game.name,
      description: game.description || '',
        thumbnail: thumbUrl,
      category: this.mapCategory(game.category),
      averageSession: this.formatDuration(game.averageSessionLength),
      playCount: this.formatPlayCount(game.totalPlays),
      gameUrl: this.getGameUrl(game.id),
      embedUrl: this.getEmbedUrl(game.id)
      };
    });
  }

  // Map categories từ Gamezop API sang app categories
  private mapCategoryFromAPI(gamezopCategory: string): string {
    const categoryMap: Record<string, string> = {
      'Action': 'Action',
      'Adventure': 'Adventure', 
      'Arcade': 'Arcade',
      'Puzzle & Logic': 'Puzzle & Logic',
      'Sports & Racing': 'Sports & Racing',
      'Strategy': 'Strategy'
    };

    return categoryMap[gamezopCategory] || 'Arcade';
  }

  // Map categories từ demo data sang app categories
  private mapCategory(gamezopCategory: string): string {
    const categoryMap: Record<string, string> = {
      'action': 'Action',
      'adventure': 'Adventure',
      'arcade': 'Arcade',
      'puzzle': 'Puzzle & Logic',
      'sports': 'Sports & Racing',
      'racing': 'Sports & Racing',
      'strategy': 'Strategy',
      'casual': 'Arcade',
      'shooter': 'Action'
    };

    return categoryMap[gamezopCategory?.toLowerCase()] || 'Arcade';
  }

  // Estimate session time based on game dimensions (heuristic)
  private estimateSessionTime(width: number, height: number): string {
    // Portrait games (mobile-first) tend to be shorter sessions
    const isPortrait = height > width;
    const baseTime = isPortrait ? 3 : 6; // minutes
    
    // Add some randomness for variety
    const variation = Math.random() * 4; // 0-4 minutes
    const totalMinutes = baseTime + variation;
    
    return `${Math.round(totalMinutes * 10) / 10} mins`;
  }

  // Format duration từ seconds sang readable format
  private formatDuration(seconds: number): string {
    if (seconds < 60) {
      return `${Math.round(seconds)} secs`;
    }
    const minutes = Math.round(seconds / 60 * 10) / 10;
    return `${minutes} mins`;
  }

  // Format play count sang readable format  
  private formatPlayCount(count: number): string {
    if (count >= 1000000) {
      return `${Math.round(count / 1000000 * 10) / 10}M`;
    }
    if (count >= 1000) {
      return `${Math.round(count / 1000 * 10) / 10}K`;
    }
    return count.toString();
  }

  // Helper method để tạo demo game với placeholder images
  private createDemoGame(id: string, name: string, description: string, category: string, 
                        averageSession: string, playCount: string, fallbackUrl: string): GamezopGame {
    // Lấy thumbnail từ local assets nếu có
    const localThumbnail = getGameThumbnail(id);
    const screenshots = getGameScreenshots(id);
    const banner = getGameBanner(id);
    
    // Tạo thumbnail URL nếu không có ảnh local
    const thumbnailUrl = localThumbnail ? null : `https://via.placeholder.com/150x100/6366f1/ffffff?text=${encodeURIComponent(name)}`;
    
    return {
      id,
      name,
      description,
      // Trả về URL dạng chuỗi - React Native sẽ chuyển đổi thành {uri: ...} khi cần
      thumbnail: thumbnailUrl || '', 
      category,
      averageSession,
      playCount,
      gameUrl: this.getGameUrl(id),
      embedUrl: this.getEmbedUrl(id),
      screenshots: screenshots || [],
      banner: banner || '',
      assets: {
        cover: thumbnailUrl,
        thumb: thumbnailUrl,
        screens: screenshots || [],
        wall: banner
      }
    };
  }

  // Demo games data (chỉ giữ lại 2 game từ Gamezop)
  private getDemoGames(category?: string): GamezopGame[] {
    const demoGames: GamezopGame[] = [
      // Chỉ giữ lại 2 game từ Gamezop
      this.createDemoGame('HJXei0j', 'Cyberfusion', 'Futuristic cyberpunk adventure in a digital realm', 'Adventure', '7.2 mins', '9.8M', 'https://zv1y2i8p.play.gamezop.com/g/HJXei0j'),
      this.createDemoGame('HkTQJhTXqRS', 'Boulder Blast', 'Challenging physics-based puzzle with boulders', 'Puzzle & Logic', '10.5 mins', '15.3M', 'https://zv1y2i8p.play.gamezop.com/g/HkTQJhTXqRS'),
      this.createDemoGame('Rt5ytrd0m', 'Kingdom Fight 2.0', 'Epic strategy battle for kingdom dominance', 'Strategy', '12.3 mins', '7.5M', 'https://zv1y2i8p.play.gamezop.com/g/Rt5ytrd0m'),
      this.createDemoGame('UYiznUAya', 'Blazing Blades', 'Một trò chơi hành động đầy kịch tính với những lưỡi kiếm rực cháy!', 'Action', '5.0 mins', '1.0M', 'https://zv1y2i8p.play.gamezop.com/g/UYiznUAya'),
      this.createDemoGame('ByQxJnp7qRB', 'ZUNO', 'Just Skip, Reverse, Draw and go Wild to get rid of your last card, And don\'t wait to jab ZUNO, or else your opponents will make your life hard!', 'Strategy', '5.0 mins', '5.1M', 'https://zv1y2i8p.play.gamezop.com/g/ByQxJnp7qRB')
    ];

    // Filter by category if specified
    if (category && category !== 'All') {
      return demoGames.filter(game => game.category === category);
    }

    return demoGames;
  }

  // Get featured games (top games)
  async getFeaturedGames(limit: number = 6): Promise<GamezopGame[]> {
    try {
      const allGames = await this.getGames(undefined, 50);
      // Sort by play count and return top games
      return allGames
        .sort((a, b) => parseInt(b.playCount) - parseInt(a.playCount))
        .slice(0, limit);
    } catch (error) {
      console.error('Error getting featured games:', error);
      return this.getDemoGames().slice(0, limit);
    }
  }

  // Search games by name
  async searchGames(query: string): Promise<GamezopGame[]> {
    try {
      const allGames = await this.getGames();
      return allGames.filter(game => 
        game.name.toLowerCase().includes(query.toLowerCase()) ||
        game.description.toLowerCase().includes(query.toLowerCase())
      );
    } catch (error) {
      console.error('Error searching games:', error);
      return [];
    }
  }

  // Test Gamezop API connection
  async testGamezopAPI(): Promise<{ success: boolean; gamesCount: number; message: string }> {
    const apiUrls = [
      `https://pub.gamezop.com/v3/games?id=${this.config.partnerId}&lang=${this.config.language}`,
      `https://pub.gamezop.com/v2/games?id=${this.config.partnerId}&lang=${this.config.language}`,
      `https://api.gamezop.com/v3/games?id=${this.config.partnerId}&lang=${this.config.language}`
    ];

    for (const apiUrl of apiUrls) {
      try {
        console.log(`Testing API: ${apiUrl}`);
        
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'User-Agent': 'GamezopReactNativeApp/1.0'
          },
          credentials: 'omit'
        });

        if (response.ok) {
          const data = await response.json();
          const gamesCount = data.games?.length || 0;
          
          return {
            success: true,
            gamesCount,
            message: `✅ API connected successfully! Found ${gamesCount} games with real images from ${apiUrl}`
          };
        } else {
          console.warn(`API ${apiUrl} returned status: ${response.status}`);
          
          // If it's the last URL, return the error
          if (apiUrl === apiUrls[apiUrls.length - 1]) {
            const errorText = await response.text().catch(() => 'Unknown error');
            return {
              success: false,
              gamesCount: 0,
              message: `❌ All API endpoints failed. Last error: ${response.status} - ${errorText.substring(0, 100)}`
            };
          }
        }
      } catch (error) {
        console.warn(`API ${apiUrl} failed:`, error.message);
        
        // If it's the last URL, return the error
        if (apiUrl === apiUrls[apiUrls.length - 1]) {
          return {
            success: false,
            gamesCount: 0,
            message: `❌ All API endpoints failed. Network error: ${error.message}`
          };
        }
      }
    }

    return {
      success: false,
      gamesCount: 0,
      message: `❌ All API endpoints failed. Check network connection and partner ID.`
    };
  }

  // Enable/disable demo mode
  setDemoMode(enabled: boolean): void {
    this.demoMode = enabled;
    console.log(`🎮 Gamezop Demo Mode: ${enabled ? 'ENABLED' : 'DISABLED'}`);
  }

  // Get current demo mode status
  isDemoMode(): boolean {
    return this.demoMode;
  }

  // Get game images from API (if available)
  getGameImages(gameId: string): {
    thumbnail: string | null;
    screenshots: string[];
    banner: string | null;
    assets: any;
  } {
    if (this.demoMode) {
      // Trong chế độ demo, trả về null để hệ thống sử dụng local images
      return {
        thumbnail: null,
        screenshots: [],
        banner: null,
        assets: {}
      };
    }
    
    // Tìm game từ cache hoặc gọi API để lấy thông tin
    // Đây là nơi để bạn triển khai lấy ảnh thật từ API
    return {
      thumbnail: null,
      screenshots: [],
      banner: null,
      assets: {}
    };
  }
}

export default new GamezopService(); 