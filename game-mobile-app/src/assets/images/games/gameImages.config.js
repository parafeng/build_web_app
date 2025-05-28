// Game Images Configuration
// Quản lý tất cả ảnh mô tả game
// Using local image paths instead of placeholders

// Game Thumbnails (150x100 recommended)
export const GameThumbnails = {
  // Adventure Games (Gamezop) - Chỉ giữ lại 2 game
  mystery_adventure: require('./thumbnails/cyberfusion.png'), // Sử dụng ảnh riêng cho Cyberfusion
  epic_quest: require('./thumbnails/boulder_blast.png'), // Sử dụng ảnh riêng cho Boulder Blast (trước đây là Epic Quest)
  kingdom_fight: require('./thumbnails/kingdom_fight_2.png'), // Sử dụng ảnh riêng cho Kingdom Fight 2.0
  blazing_blades: require('./thumbnails/blazing_blades.png'), // Sử dụng ảnh mặc định cho Blazing Blades
  zuno: require('./thumbnails/zuno.png'), // Sử dụng ảnh riêng cho Zuno
  
  // Default fallback
  default: require('./thumbnails/default_game.png'),
};

// Game Screenshots (800x600 recommended)
export const GameScreenshots = {
  // Adventure Games (Gamezop) - Chỉ giữ lại 2 game
  mystery_adventure: [
    require('./screenshots/cyberfusion_screenshot.png'), // Sử dụng ảnh screenshot riêng cho Cyberfusion
  ],
  epic_quest: [
    require('./screenshots/boulder_blast_screenshot.png'), // Sử dụng ảnh screenshot riêng cho Boulder Blast
  ],
  kingdom_fight: [
    require('./screenshots/default_game_banner.png'), // Sử dụng ảnh mặc định cho Kingdom Fight 2.0
  ],
  blazing_blades: [
    require('./screenshots/default_game_banner.png'), // Sử dụng ảnh mặc định cho Blazing Blades
  ],
  zuno: [
    require('./screenshots/default_game_banner.png'), // Sử dụng ảnh mặc định cho Zuno
  ],
};

// Game Banners (1200x400 recommended)
export const GameBanners = {
  // Adventure Games (Gamezop) - Chỉ giữ lại 2 game
  mystery_adventure: require('./banners/cyberfusion_banner.png'), // Sử dụng ảnh riêng cho Cyberfusion
  epic_quest: require('./banners/boulder_blast_banner.png'), // Sử dụng ảnh riêng cho Boulder Blast
  kingdom_fight: require('./banners/kingdom_fight_2_banner.png'), // Sử dụng ảnh riêng cho Kingdom Fight 2.0
  blazing_blades: require('./banners/blazing_blades_banner.png'), // Sử dụng ảnh mặc định cho Blazing Blades
  zuno: require('./banners/default_game_banner.png'), // Sử dụng ảnh mặc định cho Zuno
  
  // Default fallback
  default: require('./banners/default_game_banner.png'),
};

// Helper function để lấy thumbnail theo game ID
export const getGameThumbnail = (gameId) => {
  const gameKeyMap = {
    // Chỉ giữ lại 2 game từ Gamezop
    'HJXei0j': 'mystery_adventure',
    'HkTQJhTXqRS': 'epic_quest',
    'Rt5ytrd0m': 'kingdom_fight',
    'UYiznUAya': 'blazing_blades',
    'ByQxJnp7qRB': 'zuno',
  };
  
  const gameKey = gameKeyMap[gameId];
  return gameKey ? GameThumbnails[gameKey] : GameThumbnails.default;
};

// Helper function để lấy screenshots theo game ID
export const getGameScreenshots = (gameId) => {
  const gameKeyMap = {
    // Chỉ giữ lại 2 game từ Gamezop
    'HJXei0j': 'mystery_adventure',
    'HkTQJhTXqRS': 'epic_quest',
    'Rt5ytrd0m': 'kingdom_fight',
    'UYiznUAya': 'blazing_blades',
    'ByQxJnp7qRB': 'zuno',
  };
  
  const gameKey = gameKeyMap[gameId];
  return gameKey ? GameScreenshots[gameKey] : [];
};

// Helper function để lấy banner theo game ID
export const getGameBanner = (gameId) => {
  const gameKeyMap = {
    // Chỉ giữ lại 2 game từ Gamezop
    'HJXei0j': 'mystery_adventure',
    'HkTQJhTXqRS': 'epic_quest',
    'Rt5ytrd0m': 'kingdom_fight',
    'UYiznUAya': 'blazing_blades',
    'ByQxJnp7qRB': 'zuno',
  };
  
  const gameKey = gameKeyMap[gameId];
  return gameKey ? GameBanners[gameKey] : GameBanners.default;
};

// Export default object với tất cả functions
export default {
  GameThumbnails,
  GameScreenshots,
  GameBanners,
  getGameThumbnail,
  getGameScreenshots,
  getGameBanner,
}; 