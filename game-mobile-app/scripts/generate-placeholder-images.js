const fs = require('fs');
const path = require('path');

// Game data for generating placeholders
const games = [
  { id: '1', key: 'valley_of_terror', name: 'Valley of Terror', color: '#FF6B6B' },
  { id: '2', key: 'boulder_blast', name: 'Boulder Blast', color: '#4ECDC4' },
  { id: '3', key: 'punch_heroes', name: 'Punch Heroes', color: '#45B7D1' },
  { id: '4', key: 'blazing_blades', name: 'Blazing Blades', color: '#FFA726' },
  { id: '5', key: 'bottle_shoot', name: 'Bottle Shoot', color: '#66BB6A' },
  { id: '6', key: 'puzzle_master', name: 'Puzzle Master', color: '#AB47BC' },
  { id: '7', key: 'speed_racer', name: 'Speed Racer', color: '#EF5350' },
  { id: '8', key: 'castle_defense', name: 'Castle Defense', color: '#8D6E63' },
  { id: 'HJXei0j', key: 'mystery_adventure', name: 'Mystery Adventure', color: '#5C6BC0' },
  { id: 'HkTQJhTXqRS', key: 'epic_quest', name: 'Epic Quest', color: '#26A69A' }
];

// Placeholder image URLs (using placeholder.com service)
const generatePlaceholderUrls = () => {
  const baseDir = 'src/assets/images/games';
  const instructions = [];

  console.log('🎨 Tạo Placeholder Images Guide\n');
  console.log('Vì React Native cần static images, bạn có thể:');
  console.log('1. Download placeholder images từ URLs dưới đây');
  console.log('2. Hoặc sử dụng tools như Canva/Figma để tạo ảnh');
  console.log('3. Hoặc tạm thời copy ảnh có sẵn và rename\n');

  // Thumbnails (150x100)
  console.log('📱 THUMBNAILS (150x100px):');
  console.log('================================');
  games.forEach(game => {
    const url = `https://via.placeholder.com/150x100/${game.color.slice(1)}/ffffff?text=${encodeURIComponent(game.name)}`;
    console.log(`${game.key}.png: ${url}`);
    instructions.push({
      type: 'thumbnail',
      filename: `${game.key}.png`,
      path: `${baseDir}/thumbnails/${game.key}.png`,
      url: url,
      size: '150x100'
    });
  });

  // Default thumbnail
  const defaultThumbUrl = 'https://via.placeholder.com/150x100/6366f1/ffffff?text=Default+Game';
  console.log(`default_game.png: ${defaultThumbUrl}\n`);
  instructions.push({
    type: 'thumbnail',
    filename: 'default_game.png',
    path: `${baseDir}/thumbnails/default_game.png`,
    url: defaultThumbUrl,
    size: '150x100'
  });

  // Screenshots (800x600)
  console.log('🖼️ SCREENSHOTS (800x600px):');
  console.log('================================');
  games.forEach(game => {
    for (let i = 1; i <= 2; i++) {
      const url = `https://via.placeholder.com/800x600/${game.color.slice(1)}/ffffff?text=${encodeURIComponent(game.name + ' Screenshot ' + i)}`;
      console.log(`${game.key}_${i}.png: ${url}`);
      instructions.push({
        type: 'screenshot',
        filename: `${game.key}_${i}.png`,
        path: `${baseDir}/screenshots/${game.key}_${i}.png`,
        url: url,
        size: '800x600'
      });
    }
  });

  // Banners (1200x400)
  console.log('\n🎯 BANNERS (1200x400px):');
  console.log('================================');
  games.forEach(game => {
    const url = `https://via.placeholder.com/1200x400/${game.color.slice(1)}/ffffff?text=${encodeURIComponent(game.name + ' Banner')}`;
    console.log(`${game.key}_banner.png: ${url}`);
    instructions.push({
      type: 'banner',
      filename: `${game.key}_banner.png`,
      path: `${baseDir}/banners/${game.key}_banner.png`,
      url: url,
      size: '1200x400'
    });
  });

  // Default banner
  const defaultBannerUrl = 'https://via.placeholder.com/1200x400/6366f1/ffffff?text=Default+Game+Banner';
  console.log(`default_game_banner.png: ${defaultBannerUrl}\n`);
  instructions.push({
    type: 'banner',
    filename: 'default_game_banner.png',
    path: `${baseDir}/banners/default_game_banner.png`,
    url: defaultBannerUrl,
    size: '1200x400'
  });

  return instructions;
};

// Generate download script
const generateDownloadScript = (instructions) => {
  console.log('📥 DOWNLOAD SCRIPT (Windows PowerShell):');
  console.log('=========================================');
  console.log('# Copy và chạy script dưới đây trong PowerShell:\n');
  
  console.log('# Tạo thư mục');
  console.log('New-Item -ItemType Directory -Force -Path "src\\assets\\images\\games\\thumbnails"');
  console.log('New-Item -ItemType Directory -Force -Path "src\\assets\\images\\games\\screenshots"');
  console.log('New-Item -ItemType Directory -Force -Path "src\\assets\\images\\games\\banners"');
  console.log('');

  console.log('# Download images');
  instructions.forEach(item => {
    console.log(`Invoke-WebRequest -Uri "${item.url}" -OutFile "${item.path.replace(/\//g, '\\\\')}"`);
  });

  console.log('\n📥 DOWNLOAD SCRIPT (macOS/Linux):');
  console.log('==================================');
  console.log('# Copy và chạy script dưới đây trong Terminal:\n');
  
  console.log('# Tạo thư mục');
  console.log('mkdir -p src/assets/images/games/thumbnails');
  console.log('mkdir -p src/assets/images/games/screenshots');
  console.log('mkdir -p src/assets/images/games/banners');
  console.log('');

  console.log('# Download images');
  instructions.forEach(item => {
    console.log(`curl "${item.url}" -o "${item.path}"`);
  });
};

// Generate HTML preview
const generateHtmlPreview = (instructions) => {
  const html = `
<!DOCTYPE html>
<html>
<head>
    <title>Game Images Preview</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f0f0f0; }
        .section { margin: 30px 0; padding: 20px; background: white; border-radius: 8px; }
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px; }
        .item { text-align: center; padding: 10px; border: 1px solid #ddd; border-radius: 8px; }
        .item img { max-width: 100%; height: auto; border-radius: 4px; }
        .filename { font-weight: bold; margin: 10px 0; color: #333; }
        .size { color: #666; font-size: 12px; }
        h1 { color: #6366f1; }
        h2 { color: #333; border-bottom: 2px solid #6366f1; padding-bottom: 10px; }
    </style>
</head>
<body>
    <h1>🎮 Game Images Preview</h1>
    <p>Preview tất cả placeholder images cho games. Bạn có thể right-click và "Save Image As" để download từng ảnh.</p>
    
    <div class="section">
        <h2>📱 Thumbnails (150x100px)</h2>
        <div class="grid">
            ${instructions.filter(i => i.type === 'thumbnail').map(item => `
                <div class="item">
                    <img src="${item.url}" alt="${item.filename}">
                    <div class="filename">${item.filename}</div>
                    <div class="size">${item.size}px</div>
                </div>
            `).join('')}
        </div>
    </div>

    <div class="section">
        <h2>🖼️ Screenshots (800x600px)</h2>
        <div class="grid">
            ${instructions.filter(i => i.type === 'screenshot').map(item => `
                <div class="item">
                    <img src="${item.url}" alt="${item.filename}">
                    <div class="filename">${item.filename}</div>
                    <div class="size">${item.size}px</div>
                </div>
            `).join('')}
        </div>
    </div>

    <div class="section">
        <h2>🎯 Banners (1200x400px)</h2>
        <div class="grid">
            ${instructions.filter(i => i.type === 'banner').map(item => `
                <div class="item">
                    <img src="${item.url}" alt="${item.filename}">
                    <div class="filename">${item.filename}</div>
                    <div class="size">${item.size}px</div>
                </div>
            `).join('')}
        </div>
    </div>

    <div class="section">
        <h2>📥 Download Instructions</h2>
        <p>1. Right-click trên ảnh và chọn "Save Image As"</p>
        <p>2. Lưu vào đúng thư mục: <code>src/assets/images/games/[thumbnails|screenshots|banners]/</code></p>
        <p>3. Đặt tên file chính xác như hiển thị</p>
        <p>4. Restart app sau khi thêm ảnh</p>
    </div>
</body>
</html>
  `;

  // Save HTML file
  const htmlPath = path.join(__dirname, '..', 'game-images-preview.html');
  fs.writeFileSync(htmlPath, html);
  console.log(`\n📄 HTML Preview đã được tạo: ${htmlPath}`);
  console.log('Mở file này trong browser để preview và download images.');
};

// Save instructions to JSON
const saveInstructionsJson = (instructions) => {
  const jsonPath = path.join(__dirname, '..', 'game-images-instructions.json');
  fs.writeFileSync(jsonPath, JSON.stringify(instructions, null, 2));
  console.log(`\n📋 Instructions đã được lưu: ${jsonPath}`);
};

// Main function
const main = () => {
  console.log('🚀 Game Images Placeholder Generator');
  console.log('=====================================\n');
  
  const instructions = generatePlaceholderUrls();
  generateDownloadScript(instructions);
  generateHtmlPreview(instructions);
  saveInstructionsJson(instructions);
  
  console.log('\n✅ Hoàn thành! Bạn có thể:');
  console.log('1. Sử dụng download scripts ở trên');
  console.log('2. Mở game-images-preview.html để preview và download');
  console.log('3. Hoặc thay thế bằng ảnh thật của bạn');
  console.log('\n💡 Tip: Sau khi thêm ảnh, restart app để load ảnh mới!');
};

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { generatePlaceholderUrls, games }; 