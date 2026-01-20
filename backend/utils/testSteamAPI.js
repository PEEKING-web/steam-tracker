import { getPlayerSummary, getOwnedGames, getRecentlyPlayedGames, getPlayerLevel } from './steamAPI.js';

// Replace with your Steam ID (or use test ID: 76561197960435530)
const TEST_STEAM_ID = '76561197960435530';

async function testAPI() {
  console.log('🧪 Testing Steam API...\n');
  
  try {
    // Test 1: Player Summary
    console.log('1️⃣ Getting player summary...');
    const profile = await getPlayerSummary(TEST_STEAM_ID);
    console.log('✅ Profile:', profile.personaname);
    console.log('   Avatar:', profile.avatarfull);
    console.log('   Online Status:', profile.personastate);
    
 // Test 2: Owned Games
console.log('\n2️⃣ Getting owned games...');
const games = await getOwnedGames(TEST_STEAM_ID);
console.log('✅ Total Games:', games.game_count || 0);
if (games.games && games.games.length > 0) {
  console.log('   First Game:', games.games[0].name);
  console.log('   Total Playtime (first game):', games.games[0].playtime_forever, 'minutes');
} else {
  console.log('   (Profile may be private or no games)');
}

// Test 3: Recently Played
console.log('\n3️⃣ Getting recently played games...');
const recent = await getRecentlyPlayedGames(TEST_STEAM_ID);
console.log('✅ Recent Games Count:', recent.total_count || 0);
if (recent.games && recent.games.length > 0) {
  console.log('   Recent Game:', recent.games[0].name);
} else {
  console.log('   (No recent games or profile is private)');
}
    
    // Test 4: Player Level
    console.log('\n4️⃣ Getting player level...');
    const level = await getPlayerLevel(TEST_STEAM_ID);
    console.log('✅ Steam Level:', level);
    
    console.log('\n🎉 All tests passed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testAPI();