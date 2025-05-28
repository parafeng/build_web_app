// Avatar Configuration for Game Mobile App
// Quản lý tất cả avatar có sẵn trong ứng dụng

export const AVATAR_CATEGORIES = {
  DEFAULT: 'default',
  CHARACTERS: 'characters', 
  ANIMALS: 'animals',
  CUSTOM: 'custom'
};

export const DEFAULT_AVATARS = [
  {
    id: 'default_001',
    name: 'Avatar Mặc Định 1',
    path: require('./default/1.jpg'),
    category: AVATAR_CATEGORIES.DEFAULT,
    isDefault: true,
    unlocked: true,
    description: 'Avatar mặc định đầu tiên'
  },
  {
    id: 'default_002',
    name: 'Avatar Mặc Định 2',
    path: require('./default/2.jpg'),
    category: AVATAR_CATEGORIES.DEFAULT,
    isDefault: true,
    unlocked: true,
    description: 'Avatar mặc định thứ hai'
  },
  {
    id: 'default_003',
    name: 'Avatar Mặc Định 3',
    path: require('./default/3.jpg'),
    category: AVATAR_CATEGORIES.DEFAULT,
    isDefault: true,
    unlocked: true,
    description: 'Avatar mặc định thứ ba'
  },
  {
    id: 'default_004',
    name: 'Avatar Mặc Định 4',
    path: require('./default/4.jpg'),
    category: AVATAR_CATEGORIES.DEFAULT,
    isDefault: true,
    unlocked: true,
    description: 'Avatar mặc định thứ tư'
  },
  {
    id: 'default_005',
    name: 'Avatar Mặc Định 5',
    path: require('./default/5.jpg'),
    category: AVATAR_CATEGORIES.DEFAULT,
    isDefault: true,
    unlocked: true,
    description: 'Avatar mặc định thứ năm'
  }
];

export const CHARACTER_AVATARS = [
  {
    id: 'char_001',
    name: 'Nhân Vật 1',
    path: require('./characters/6.jpg'),
    category: AVATAR_CATEGORIES.CHARACTERS,
    unlocked: true,
    description: 'Avatar nhân vật game đẹp - Miễn phí!'
  },
  {
    id: 'char_002',
    name: 'Nhân Vật 2',
    path: require('./characters/7.jpg'),
    category: AVATAR_CATEGORIES.CHARACTERS,
    unlocked: true,
    description: 'Avatar nhân vật game đẹp - Miễn phí!'
  },
  {
    id: 'char_003',
    name: 'Nhân Vật 3',
    path: require('./characters/8.jpg'),
    category: AVATAR_CATEGORIES.CHARACTERS,
    unlocked: true,
    description: 'Avatar nhân vật game đẹp - Miễn phí!'
  },
  {
    id: 'char_004',
    name: 'Nhân Vật 4',
    path: require('./characters/9.jpg'),
    category: AVATAR_CATEGORIES.CHARACTERS,
    unlocked: true,
    description: 'Avatar nhân vật game đẹp - Miễn phí!'
  },
  {
    id: 'char_005',
    name: 'Nhân Vật 5',
    path: require('./characters/10.jpg'),
    category: AVATAR_CATEGORIES.CHARACTERS,
    unlocked: true,
    description: 'Avatar nhân vật game đẹp - Miễn phí!'
  },
  {
    id: 'char_006',
    name: 'Nhân Vật 6',
    path: require('./characters/11.jpg'),
    category: AVATAR_CATEGORIES.CHARACTERS,
    unlocked: true,
    description: 'Avatar nhân vật game đẹp - Miễn phí!'
  },
  {
    id: 'char_007',
    name: 'Nhân Vật 7',
    path: require('./characters/12.jpg'),
    category: AVATAR_CATEGORIES.CHARACTERS,
    unlocked: true,
    description: 'Avatar nhân vật game đẹp - Miễn phí!'
  },
  {
    id: 'char_008',
    name: 'Nhân Vật 8',
    path: require('./characters/13.jpg'),
    category: AVATAR_CATEGORIES.CHARACTERS,
    unlocked: true,
    description: 'Avatar nhân vật game đẹp - Miễn phí!'
  },
  {
    id: 'char_009',
    name: 'Nhân Vật 9',
    path: require('./characters/14.jpg'),
    category: AVATAR_CATEGORIES.CHARACTERS,
    unlocked: true,
    description: 'Avatar nhân vật game đẹp - Miễn phí!'
  },
  {
    id: 'char_010',
    name: 'Nhân Vật 10',
    path: require('./characters/15.jpg'),
    category: AVATAR_CATEGORIES.CHARACTERS,
    unlocked: true,
    description: 'Avatar nhân vật game đẹp - Miễn phí!'
  },
  {
    id: 'char_011',
    name: 'Nhân Vật 11',
    path: require('./characters/16.jpg'),
    category: AVATAR_CATEGORIES.CHARACTERS,
    unlocked: true,
    description: 'Avatar nhân vật game đẹp - Miễn phí!'
  }
];

export const ANIMAL_AVATARS = [
  {
    id: 'animal_cat',
    name: 'Mèo Dễ Thương',
    path: require('./animals/cat.jpg'),
    category: AVATAR_CATEGORIES.ANIMALS,
    unlocked: true,
    description: 'Avatar mèo con đáng yêu - Miễn phí!'
  },
  {
    id: 'animal_cat1',
    name: 'Mèo Thứ 2',
    path: require('./animals/cat1.jpg'),
    category: AVATAR_CATEGORIES.ANIMALS,
    unlocked: true,
    description: 'Avatar mèo dễ thương - Miễn phí!'
  },
  {
    id: 'animal_cat2',
    name: 'Mèo Thứ 3',
    path: require('./animals/cat2.jpg'),
    category: AVATAR_CATEGORIES.ANIMALS,
    unlocked: true,
    description: 'Avatar mèo xinh xắn - Miễn phí!'
  },
  {
    id: 'animal_cat3',
    name: 'Mèo Thứ 4',
    path: require('./animals/cat3.jpg'),
    category: AVATAR_CATEGORIES.ANIMALS,
    unlocked: true,
    description: 'Avatar mèo đáng yêu - Miễn phí!'
  },
  {
    id: 'animal_dog',
    name: 'Chó Loyal',
    path: require('./animals/dog.jpg'),
    category: AVATAR_CATEGORIES.ANIMALS,
    unlocked: true,
    description: 'Avatar chó trung thành - Miễn phí!'
  },
  {
    id: 'animal_monkey',
    name: 'Khỉ Tinh Nghịch',
    path: require('./animals/monkey.jpg'),
    category: AVATAR_CATEGORIES.ANIMALS,
    unlocked: true,
    description: 'Avatar khỉ tinh nghịch - Miễn phí!'
  },
  {
    id: 'animal_pig',
    name: 'Heo Con Dễ Thương',
    path: require('./animals/pig.jpg'),
    category: AVATAR_CATEGORIES.ANIMALS,
    unlocked: true,
    description: 'Avatar heo con đáng yêu - Miễn phí!'
  },
  {
    id: 'animal_bear',
    name: 'Gấu Bông',
    path: require('./animals/bear.jpg'),
    category: AVATAR_CATEGORIES.ANIMALS,
    unlocked: true,
    description: 'Avatar gấu bông dễ thương - Miễn phí!'
  },
  {
    id: 'animal_cat_png',
    name: 'Mèo Hoạt Hình',
    path: require('./animals/cat.png'),
    category: AVATAR_CATEGORIES.ANIMALS,
    unlocked: true,
    description: 'Avatar mèo hoạt hình - Miễn phí!'
  },
  {
    id: 'animal_dog_png',
    name: 'Chó Hoạt Hình',
    path: require('./animals/dog.png'),
    category: AVATAR_CATEGORIES.ANIMALS,
    unlocked: true,
    description: 'Avatar chó hoạt hình - Miễn phí!'
  },
  {
    id: 'animal_panda',
    name: 'Gấu Trúc',
    path: require('./animals/panda.png'),
    category: AVATAR_CATEGORIES.ANIMALS,
    unlocked: true,
    description: 'Avatar gấu trúc đáng yêu - Miễn phí!'
  },
  {
    id: 'animal_dragon',
    name: 'Rồng Dễ Thương',
    path: require('./animals/dragon.png'),
    category: AVATAR_CATEGORIES.ANIMALS,
    unlocked: true,
    description: 'Avatar rồng hoạt hình - Miễn phí!'
  }
];

// Tổng hợp tất cả avatars
export const ALL_AVATARS = [
  ...DEFAULT_AVATARS,
  ...CHARACTER_AVATARS,
  ...ANIMAL_AVATARS
];

// Hàm helper để lấy avatar theo category
export const getAvatarsByCategory = (category) => {
  console.log("getAvatarsByCategory called with:", category);
  console.log("ALL_AVATARS length:", ALL_AVATARS.length);
  
  const filteredAvatars = ALL_AVATARS.filter(avatar => avatar.category === category);
  console.log("Filtered avatars length:", filteredAvatars.length);
  
  return filteredAvatars;
};

// Hàm lấy avatar mặc định
export const getDefaultAvatar = () => {
  return DEFAULT_AVATARS[0];
};

// Hàm kiểm tra avatar đã unlock chưa - Tất cả đều miễn phí!
export const isAvatarUnlocked = (avatarId, userLevel = 1, userCoins = 0) => {
  const avatar = ALL_AVATARS.find(a => a.id === avatarId);
  if (!avatar) return false;
  
  // Tất cả avatar đều unlocked miễn phí
  return true;
};

// Hàm lấy danh sách avatar đã unlock - Tất cả đều miễn phí!
export const getUnlockedAvatars = (userLevel = 1, userCoins = 0) => {
  return ALL_AVATARS; // Trả về tất cả avatar
};

// Hàm lấy avatar source theo ID
export const getAvatarSource = (avatarId) => {
  // Nếu không có avatarId, trả về avatar mặc định
  if (!avatarId) {
    return getDefaultAvatar().path;
  }

  // Nếu avatarId là số, tìm theo số thứ tự (legacy support)
  if (typeof avatarId === 'number') {
    if (avatarId <= 5) {
      // Default avatars 1-5
      return DEFAULT_AVATARS[avatarId - 1]?.path || getDefaultAvatar().path;
    } else if (avatarId <= 16) {
      // Character avatars 6-16
      const charIndex = avatarId - 6;
      return CHARACTER_AVATARS[charIndex]?.path || getDefaultAvatar().path;
    } else {
      // Animal avatars (after 16)
      const animalIndex = avatarId - 17;
      return ANIMAL_AVATARS[animalIndex]?.path || getDefaultAvatar().path;
    }
  }
  
  // Nếu avatarId là string, tìm theo ID
  const avatar = ALL_AVATARS.find(a => a.id === avatarId);
  return avatar?.path || getDefaultAvatar().path;
};

export default {
  AVATAR_CATEGORIES,
  ALL_AVATARS,
  getAvatarsByCategory,
  getDefaultAvatar,
  isAvatarUnlocked,
  getUnlockedAvatars,
  getAvatarSource
}; 