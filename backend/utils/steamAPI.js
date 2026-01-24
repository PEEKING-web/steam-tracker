import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const STEAM_API_KEY = process.env.STEAM_API_KEY;
const STEAM_API_BASE = 'https://api.steampowered.com';

// Helper function to make Steam API requests
const steamRequest = async (url) => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Steam API Error:', error.response?.data || error.message);
    throw new Error('Failed to fetch data from Steam API');
  }
};

// Get player summary (profile info)
export const getPlayerSummary = async (steamId) => {
  const url = `${STEAM_API_BASE}/ISteamUser/GetPlayerSummaries/v0002/?key=${STEAM_API_KEY}&steamids=${steamId}`;
  const data = await steamRequest(url);

  if (data?.response?.players?.length > 0) {
    return data.response.players[0];
  }

  throw new Error('Player not found');
};

// Get owned games
export const getOwnedGames = async (steamId) => {
  const url = `${STEAM_API_BASE}/IPlayerService/GetOwnedGames/v0001/?key=${STEAM_API_KEY}&steamid=${steamId}&format=json&include_appinfo=1&include_played_free_games=1`;
  const data = await steamRequest(url);

  return data?.response || { game_count: 0, games: [] };
};

// Get recently played games
export const getRecentlyPlayedGames = async (steamId) => {
  const url = `${STEAM_API_BASE}/IPlayerService/GetRecentlyPlayedGames/v0001/?key=${STEAM_API_KEY}&steamid=${steamId}&format=json`;
  const data = await steamRequest(url);

  return data?.response || { total_count: 0, games: [] };
};

// Get friends list
export const getFriendsList = async (steamId) => {
  const url = `${STEAM_API_BASE}/ISteamUser/GetFriendList/v0001/?key=${STEAM_API_KEY}&steamid=${steamId}&relationship=friend`;
  const data = await steamRequest(url);

  return data?.friendslist?.friends || [];
};

//Get player achievements
export const getPlayerAchievements = async (steamId, appId) => {
  const url = `${STEAM_API_BASE}/ISteamUserStats/GetPlayerAchievements/v0001/?appid=${appId}&key=${STEAM_API_KEY}&steamid=${steamId}&l=english`;

  try {
    const data = await steamRequest(url);
    return data?.playerstats?.achievements || [];
  } catch {
    return [];
  }
};

// Get user stats for a game
export const getUserStatsForGame = async (steamId, appId) => {
  const url = `${STEAM_API_BASE}/ISteamUserStats/GetUserStatsForGame/v0002/?appid=${appId}&key=${STEAM_API_KEY}&steamid=${steamId}`;

  try {
    const data = await steamRequest(url);
    return data?.playerstats || {};
  } catch {
    return {};
  }
};

// Get player level
export const getPlayerLevel = async (steamId) => {
  const url = `${STEAM_API_BASE}/IPlayerService/GetSteamLevel/v1/?key=${STEAM_API_KEY}&steamid=${steamId}`;
  const data = await steamRequest(url);

  return data?.response?.player_level ?? 0;
};

// Get multiple player summaries
export const getMultiplePlayerSummaries = async (steamIds) => {
  const idsString = steamIds.join(',');
  const url = `${STEAM_API_BASE}/ISteamUser/GetPlayerSummaries/v0002/?key=${STEAM_API_KEY}&steamids=${idsString}`;
  const data = await steamRequest(url);

  return data?.response?.players || [];
};

//Get game achievement schema (USES AXIOS)
export const getGameSchema = async (appid) => {
  const url = `${STEAM_API_BASE}/ISteamUserStats/GetSchemaForGame/v2/?key=${STEAM_API_KEY}&appid=${appid}`;

  try {
    const data = await steamRequest(url);
    return data?.game?.availableGameStats?.achievements || [];
  } catch {
    return [];
  }
};
