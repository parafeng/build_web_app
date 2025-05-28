// Script để tạo avatar placeholder cho game
const sharp = require('sharp');
const fs = require('fs');

// Màu sắc cho các avatar khác nhau
const colors = {
  default: ['#6366f1', '#8b5cf6', '#06b6d4'],
  characters: ['#ef4444', '#f59e0b', '#10b981', '#3b82f6'],
  animals: ['#f97316', '#ec4899', '#84cc16', '#6366f1']
};

// Template SVG cho avatar cơ bản
const createAvatarSVG = (color, type, symbol) => `
<svg width="128" height="128" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${color};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${adjustBrightness(color, -20)};stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background circle -->
  <circle cx="64" cy="64" r="60" fill="url(#grad)" stroke="white" stroke-width="4"/>
  
  <!-- Symbol/Icon -->
  ${symbol}
  
  <!-- Border decoration -->
  <circle cx="64" cy="64" r="60" fill="none" stroke="white" stroke-width="2" opacity="0.6"/>
</svg>`;

// Hàm điều chỉnh độ sáng màu
function adjustBrightness(hex, percent) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  
  const newR = Math.max(0, Math.min(255, r + (r * percent / 100)));
  const newG = Math.max(0, Math.min(255, g + (g * percent / 100)));
  const newB = Math.max(0, Math.min(255, b + (b * percent / 100)));
  
  return `#${Math.round(newR).toString(16).padStart(2, '0')}${Math.round(newG).toString(16).padStart(2, '0')}${Math.round(newB).toString(16).padStart(2, '0')}`;
}

// Symbols cho các loại avatar
const symbols = {
  default: [
    '<circle cx="50" cy="45" r="6" fill="white"/><circle cx="78" cy="45" r="6" fill="white"/><path d="M 45 70 Q 64 85 83 70" stroke="white" stroke-width="3" fill="none"/>',
    '<circle cx="50" cy="45" r="6" fill="white"/><circle cx="78" cy="45" r="6" fill="white"/><circle cx="64" cy="70" r="8" fill="white"/>',
    '<circle cx="50" cy="45" r="6" fill="white"/><circle cx="78" cy="45" r="6" fill="white"/><rect x="55" y="65" width="18" height="8" rx="4" fill="white"/>'
  ],
  characters: [
    '<polygon points="64,35 75,55 53,55" fill="white"/><rect x="58" y="55" width="12" height="20" fill="white"/><circle cx="64" cy="45" r="3" fill="currentColor"/>',
    '<circle cx="64" cy="45" r="12" fill="white"/><polygon points="64,58 70,70 58,70" fill="white"/><circle cx="64" cy="45" r="4" fill="currentColor"/>',
    '<path d="M 45 45 L 55 35 L 65 45 L 75 35 L 85 45" stroke="white" stroke-width="3" fill="none"/><circle cx="64" cy="60" r="8" fill="white"/>',
    '<rect x="58" y="40" width="12" height="8" fill="white"/><circle cx="64" cy="58" r="10" fill="white"/><rect x="60" y="52" width="8" height="4" fill="currentColor"/>'
  ],
  animals: [
    '<ellipse cx="55" cy="35" rx="8" ry="12" fill="white"/><ellipse cx="73" cy="35" rx="8" ry="12" fill="white"/><circle cx="64" cy="60" r="15" fill="white"/><circle cx="60" cy="55" r="2" fill="currentColor"/><circle cx="68" cy="55" r="2" fill="currentColor"/>',
    '<circle cx="64" cy="50" r="20" fill="white"/><ellipse cx="45" cy="40" rx="6" ry="10" fill="white"/><ellipse cx="83" cy="40" rx="6" ry="10" fill="white"/><circle cx="60" cy="45" r="2" fill="currentColor"/><circle cx="68" cy="45" r="2" fill="currentColor"/>',
    '<circle cx="64" cy="50" r="18" fill="white"/><circle cx="56" cy="45" r="3" fill="currentColor"/><circle cx="72" cy="45" r="3" fill="currentColor"/><ellipse cx="64" cy="55" rx="4" ry="2" fill="currentColor"/>',
    '<path d="M 40 60 Q 64 30 88 60 Q 64 80 40 60" fill="white"/><circle cx="58" cy="50" r="3" fill="currentColor"/><circle cx="70" cy="50" r="3" fill="currentColor"/><path d="M 64 58 L 60 65 L 68 65 Z" fill="currentColor"/>'
  ]
};

async function generateAvatars() {
  // Tạo default avatars
  for (let i = 0; i < 3; i++) {
    const svg = createAvatarSVG(colors.default[i], 'default', symbols.default[i]);
    await sharp(Buffer.from(svg))
      .resize(128, 128)
      .png()
      .toFile(`./src/assets/avatars/default/avatar_00${i + 1}.png`);
    console.log(`✅ Đã tạo avatar_00${i + 1}.png`);
  }

  // Tạo character avatars
  const characterNames = ['warrior', 'mage', 'archer', 'ninja'];
  for (let i = 0; i < 4; i++) {
    const svg = createAvatarSVG(colors.characters[i], 'characters', symbols.characters[i]);
    await sharp(Buffer.from(svg))
      .resize(128, 128)
      .png()
      .toFile(`./src/assets/avatars/characters/${characterNames[i]}.png`);
    console.log(`✅ Đã tạo ${characterNames[i]}.png`);
  }

  // Tạo animal avatars
  const animalNames = ['cat', 'dog', 'panda', 'dragon'];
  for (let i = 0; i < 4; i++) {
    const svg = createAvatarSVG(colors.animals[i], 'animals', symbols.animals[i]);
    await sharp(Buffer.from(svg))
      .resize(128, 128)
      .png()
      .toFile(`./src/assets/avatars/animals/${animalNames[i]}.png`);
    console.log(`✅ Đã tạo ${animalNames[i]}.png`);
  }
}

if (require.main === module) {
  generateAvatars()
    .then(() => console.log('🎉 Hoàn thành tạo tất cả avatars!'))
    .catch(console.error);
}

module.exports = { generateAvatars }; 