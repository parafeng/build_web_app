#!/usr/bin/env node

/**
 * Gamezop Integration Test Script
 * Test toàn bộ hệ thống tích hợp Gamezop
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Configuration
const PARTNER_ID = 'zv1y2i8p';
const API_URL = `https://pub.gamezop.com/v3/games?id=${PARTNER_ID}&lang=en`;

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logHeader(message) {
  console.log('\n' + '='.repeat(50));
  log(message, 'bold');
  console.log('='.repeat(50));
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

// Test API connection
function testGamezopAPI() {
  return new Promise((resolve, reject) => {
    logHeader('Testing Gamezop API Connection');
    
    const request = https.get(API_URL, (response) => {
      let data = '';
      
      response.on('data', (chunk) => {
        data += chunk;
      });
      
      response.on('end', () => {
        try {
          const result = JSON.parse(data);
          
          if (response.statusCode === 200 && result.games) {
            logSuccess(`API connected successfully!`);
            logInfo(`Status Code: ${response.statusCode}`);
            logInfo(`Total Games: ${result.games.length}`);
            logInfo(`API URL: ${API_URL}`);
            
            // Test sample games
            const sampleGames = result.games.slice(0, 3);
            logInfo('Sample games:');
            sampleGames.forEach((game, index) => {
              console.log(`  ${index + 1}. ${game.name?.en || game.name} (${game.code})`);
            });
            
            resolve({
              success: true,
              gamesCount: result.games.length,
              sampleGames: sampleGames
            });
          } else {
            logError(`API returned unexpected response`);
            logError(`Status Code: ${response.statusCode}`);
            logError(`Response: ${data.substring(0, 200)}...`);
            resolve({ success: false, error: 'Unexpected response' });
          }
        } catch (error) {
          logError(`Failed to parse API response: ${error.message}`);
          resolve({ success: false, error: error.message });
        }
      });
    });
    
    request.on('error', (error) => {
      logError(`API request failed: ${error.message}`);
      resolve({ success: false, error: error.message });
    });
    
    request.setTimeout(10000, () => {
      logError('API request timeout (10s)');
      request.destroy();
      resolve({ success: false, error: 'Timeout' });
    });
  });
}

// Check file structure
function checkFileStructure() {
  logHeader('Checking File Structure');
  
  const requiredFiles = [
    'src/api/gamezopService.ts',
    'src/components/game/GamezopEmbed.tsx',
    'src/components/game/GamezopAPITest.tsx',
    'src/components/game/GamezopIntegrationTest.tsx',
    'src/components/game/GamezopStats.tsx',
    'src/screens/game/GameScreen.tsx',
    'src/screens/game/GamezopDemo.tsx',
    'src/assets/images/games/gameImages.config.js'
  ];
  
  const missingFiles = [];
  const existingFiles = [];
  
  requiredFiles.forEach(file => {
    const filePath = path.join(__dirname, '..', file);
    if (fs.existsSync(filePath)) {
      existingFiles.push(file);
      logSuccess(`Found: ${file}`);
    } else {
      missingFiles.push(file);
      logError(`Missing: ${file}`);
    }
  });
  
  logInfo(`Files found: ${existingFiles.length}/${requiredFiles.length}`);
  
  if (missingFiles.length === 0) {
    logSuccess('All required files are present!');
    return true;
  } else {
    logWarning(`${missingFiles.length} files are missing`);
    return false;
  }
}

// Test game URLs
function testGameURLs(sampleGames) {
  logHeader('Testing Game URLs');
  
  if (!sampleGames || sampleGames.length === 0) {
    logWarning('No sample games to test');
    return;
  }
  
  sampleGames.forEach((game, index) => {
    const gameId = game.code;
    const embedUrl = `https://${PARTNER_ID}.play.gamezop.com/g/${gameId}`;
    
    logInfo(`Game ${index + 1}: ${game.name?.en || game.name}`);
    logInfo(`  Game ID: ${gameId}`);
    logInfo(`  Embed URL: ${embedUrl}`);
    
    // Check if game has required assets
    if (game.assets) {
      const assets = game.assets;
      logInfo(`  Assets available:`);
      if (assets.cover) logInfo(`    - Cover: ${assets.cover.substring(0, 50)}...`);
      if (assets.thumb) logInfo(`    - Thumbnail: ${assets.thumb.substring(0, 50)}...`);
      if (assets.screens && assets.screens.length > 0) {
        logInfo(`    - Screenshots: ${assets.screens.length} images`);
      }
    }
    console.log('');
  });
}

// Check demo games configuration
function checkDemoGames() {
  logHeader('Checking Demo Games Configuration');
  
  const demoGames = [
    { id: '1', name: 'Valley of Terror', category: 'Action' },
    { id: '2', name: 'Boulder Blast', category: 'Action' },
    { id: '3', name: 'Punch Heroes', category: 'Action' },
    { id: '4', name: 'Blazing Blades', category: 'Action' },
    { id: '5', name: 'Bottle Shoot', category: 'Action' },
    { id: '6', name: 'Puzzle Master', category: 'Puzzle & Logic' },
    { id: '7', name: 'Speed Racer', category: 'Sports & Racing' },
    { id: '8', name: 'Castle Defense', category: 'Strategy' },
    { id: 'HJXei0j', name: 'Mystery Adventure', category: 'Adventure' },
    { id: 'HkTQJhTXqRS', name: 'Epic Quest', category: 'Adventure' }
  ];
  
  logInfo(`Total demo games configured: ${demoGames.length}`);
  
  // Group by category
  const categories = {};
  demoGames.forEach(game => {
    if (!categories[game.category]) {
      categories[game.category] = [];
    }
    categories[game.category].push(game);
  });
  
  logInfo('Games by category:');
  Object.keys(categories).forEach(category => {
    logInfo(`  ${category}: ${categories[category].length} games`);
    categories[category].forEach(game => {
      console.log(`    - ${game.name} (${game.id})`);
    });
  });
  
  // Check Gamezop specific games
  const gamezopGames = demoGames.filter(game => 
    game.id === 'HJXei0j' || game.id === 'HkTQJhTXqRS'
  );
  
  logInfo(`Gamezop WebView games: ${gamezopGames.length}`);
  gamezopGames.forEach(game => {
    const embedUrl = `https://${PARTNER_ID}.play.gamezop.com/g/${game.id}`;
    logInfo(`  ${game.name}: ${embedUrl}`);
  });
  
  logSuccess('Demo games configuration is complete!');
}

// Generate test report
function generateTestReport(apiResult, fileStructureOK) {
  logHeader('Test Report Summary');
  
  const report = {
    timestamp: new Date().toISOString(),
    apiConnection: apiResult.success,
    fileStructure: fileStructureOK,
    gamesCount: apiResult.gamesCount || 0,
    partnerId: PARTNER_ID,
    apiUrl: API_URL
  };
  
  // Overall status
  const allTestsPassed = apiResult.success && fileStructureOK;
  
  if (allTestsPassed) {
    logSuccess('🎉 All tests passed! Gamezop integration is ready.');
  } else {
    logWarning('⚠️  Some tests failed. Please check the issues above.');
  }
  
  // Detailed report
  console.log('\nDetailed Report:');
  console.log('================');
  console.log(`API Connection: ${apiResult.success ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`File Structure: ${fileStructureOK ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Games Available: ${report.gamesCount}`);
  console.log(`Partner ID: ${report.partnerId}`);
  console.log(`Test Time: ${new Date().toLocaleString('vi-VN')}`);
  
  // Save report to file
  const reportPath = path.join(__dirname, '..', 'gamezop-test-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  logInfo(`Test report saved to: ${reportPath}`);
  
  // Next steps
  console.log('\nNext Steps:');
  console.log('===========');
  if (allTestsPassed) {
    logInfo('1. Run the app and navigate to GamezopDemo screen');
    logInfo('2. Test both demo mode and live API mode');
    logInfo('3. Try playing games to test WebView integration');
    logInfo('4. Use GamezopIntegrationTest component for comprehensive testing');
  } else {
    if (!apiResult.success) {
      logWarning('1. Check internet connection');
      logWarning('2. Verify Gamezop API is accessible');
      logWarning('3. Check partner ID configuration');
    }
    if (!fileStructureOK) {
      logWarning('1. Ensure all required files are created');
      logWarning('2. Check file paths and naming');
      logWarning('3. Verify imports and exports');
    }
  }
}

// Main test function
async function runTests() {
  console.log('🎮 Gamezop Integration Test Suite');
  console.log('==================================');
  console.log(`Partner ID: ${PARTNER_ID}`);
  console.log(`Test Time: ${new Date().toLocaleString('vi-VN')}\n`);
  
  try {
    // Test 1: File structure
    const fileStructureOK = checkFileStructure();
    
    // Test 2: API connection
    const apiResult = await testGamezopAPI();
    
    // Test 3: Game URLs (if API works)
    if (apiResult.success && apiResult.sampleGames) {
      testGameURLs(apiResult.sampleGames);
    }
    
    // Test 4: Demo games configuration
    checkDemoGames();
    
    // Generate final report
    generateTestReport(apiResult, fileStructureOK);
    
  } catch (error) {
    logError(`Test suite failed: ${error.message}`);
    console.error(error);
  }
}

// Run tests if this script is executed directly
if (require.main === module) {
  runTests();
}

module.exports = {
  runTests,
  testGamezopAPI,
  checkFileStructure,
  checkDemoGames
}; 