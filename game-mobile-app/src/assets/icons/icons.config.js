// Icon Configuration for Game Mobile App
// Auto-generated by optimize-icons.js

// Tab Icons
export const TabIcons = {
  home: {
    default: require('./tabs/home_optimized.png'),
    active: require('./tabs/home_active_optimized.png'),
  },
  game: {
    default: require('./tabs/game_optimized.png'),
    active: require('./tabs/game_active_optimized.png'),
  },
  profile: {
    default: require('./tabs/profile_optimized.png'),
    active: require('./tabs/profile_active_optimized.png'),
  },
};

// Button Icons
export const ButtonIcons = {
  edit: require('./buttons/edit_optimized.png'),
  logout: require('./buttons/logout_optimized.png'),
  settings: require('./buttons/settings_optimized.png'),
  back: require('./buttons/back_optimized.png'),
};

// Helper function to get tab icon
export const getTabIcon = (tabName, isActive = false) => {
  const tab = TabIcons[tabName];
  if (!tab) return null;
  return isActive ? tab.active : tab.default;
};

// Helper function to get button icon
export const getButtonIcon = (buttonName) => {
  return ButtonIcons[buttonName] || null;
};

export default {
  TabIcons,
  ButtonIcons,
  getTabIcon,
  getButtonIcon,
};