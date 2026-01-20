import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Create axios instance with credentials
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Important: sends cookies with requests
  headers: {
    'Content-Type': 'application/json'
  }
});

// ==================== AUTH ====================

export const loginWithSteam = () => {
  window.location.href = `${API_URL}/auth/steam`;
};

export const logout = async () => {
  try {
    const response = await api.get('/auth/logout');
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Logout failed' };
  }
};

export const checkAuth = async () => {
  try {
    const response = await api.get('/auth/check');
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Auth check failed' };
  }
};

// ==================== USER ====================

export const getUserProfile = async () => {
  try {
    const response = await api.get('/api/user/profile');
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to fetch profile' };
  }
};

export const getUserSession = async () => {
  try {
    const response = await api.get('/api/user/session');
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to fetch session' };
  }
};

// ==================== GAMES ====================

export const getOwnedGames = async () => {
  try {
    const response = await api.get('/api/games/owned');
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to fetch games' };
  }
};

export const getRecentGames = async () => {
  try {
    const response = await api.get('/api/games/recent');
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to fetch recent games' };
  }
};

export const getGameAchievements = async (appId) => {
  try {
    const response = await api.get(`/api/games/${appId}/achievements`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to fetch achievements' };
  }
};

// ==================== FRIENDS ====================

export const getFriendsList = async () => {
  try {
    const response = await api.get('/api/friends/list');
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to fetch friends' };
  }
};

export const getFriendProfile = async (steamId) => {
  try {
    const response = await api.get(`/api/friends/${steamId}/profile`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to fetch friend profile' };
  }
};

export const getFriendGames = async (steamId) => {
  try {
    const response = await api.get(`/api/friends/${steamId}/games`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to fetch friend games' };
  }
};

// ==================== STATS ====================

export const getTotalPlaytime = async () => {
  try {
    const response = await api.get('/api/stats/total-playtime');
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to fetch total playtime' };
  }
};

export const getWeeklyPlaytime = async () => {
  try {
    const response = await api.get('/api/stats/weekly-playtime');
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to fetch weekly playtime' };
  }
};

export const getAchievements = async () => {
  try {
    const response = await api.get('/api/stats/achievements');
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to fetch achievements' };
  }
};

export const getSteamLevel = async () => {
  try {
    const response = await api.get('/api/stats/level');
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to fetch level' };
  }
};


// ==================== CATEGORIES ====================

// Get all categories for user
export const getCategories = async () => {
  try {
    const response = await api.get('/api/categories');
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to fetch categories' };
  }
};

// Create a new category
export const createCategory = async (name) => {
  try {
    const response = await api.post('/api/categories', { name });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to create category' };
  }
};

// Rename category
export const renameCategory = async (categoryId, name) => {
  try {
    const response = await api.patch(`/api/categories/${categoryId}`, { name });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to rename category' };
  }
};

// Delete category
export const deleteCategory = async (categoryId) => {
  try {
    const response = await api.delete(`/api/categories/${categoryId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to delete category' };
  }
};

// Add game to category
export const addGameToCategory = async (categoryId, game) => {
  try {
    const response = await api.post(
      `/api/categories/${categoryId}/games`,
      game
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to add game to category' };
  }
};

// Remove game from category
export const removeGameFromCategory = async (categoryId, appid) => {
  try {
    const response = await api.delete(
      `/api/categories/${categoryId}/games/${appid}`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to remove game from category' };
  }
};

//  SESSIONS 

// Start a gaming session
export const startSession = async ({ appid, gameName, mood, notes }) => {
  try {
    const response = await api.post('/api/sessions/start', {
      appid,
      gameName,
      mood,
      notes
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to start session' };
  }
};

// End a gaming session
export const endSession = async (sessionId) => {
  try {
    const response = await api.post(`/api/sessions/end/${sessionId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to end session' };
  }
};

// Get all sessions
export const getSessions = async () => {
  try {
    const response = await api.get('/api/sessions');
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to fetch sessions' };
  }
};

export default api;