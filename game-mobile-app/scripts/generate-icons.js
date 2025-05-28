// Script để tạo các kích thước icon khác nhau từ SVG
// Cần cài đặt: npm install sharp

const sharp = require('sharp');
const fs = require('fs');

const iconSizes = [
  { name: 'icon.png', size: 1024 },
  { name: 'adaptive-icon.png', size: 1024 },
  { name: 'favicon.png', size: 48 },
];

const splashSize = { name: 'splash.png', width: 1284, height: 2778 };

async function generateIcons() {
  const svgBuffer = fs.readFileSync('./assets/logo.svg');
  
  // Tạo các icon với kích thước khác nhau
  for (const icon of iconSizes) {
    await sharp(svgBuffer)
      .resize(icon.size, icon.size)
      .png()
      .toFile(`./assets/${icon.name}`);
    
    console.log(`✅ Đã tạo ${icon.name} (${icon.size}x${icon.size})`);
  }
  
  // Tạo splash screen
  await sharp(svgBuffer)
    .resize(512, 512)
    .extend({
      top: Math.floor((splashSize.height - 512) / 2),
      bottom: Math.ceil((splashSize.height - 512) / 2),
      left: Math.floor((splashSize.width - 512) / 2),
      right: Math.ceil((splashSize.width - 512) / 2),
      background: { r: 99, g: 102, b: 241, alpha: 1 }
    })
    .png()
    .toFile(`./assets/${splashSize.name}`);
  
  console.log(`✅ Đã tạo ${splashSize.name} (${splashSize.width}x${splashSize.height})`);
}

if (require.main === module) {
  generateIcons()
    .then(() => console.log('🎉 Hoàn thành tạo tất cả icons!'))
    .catch(console.error);
}

module.exports = { generateIcons }; 