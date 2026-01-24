import express from 'express';
import { isAuthenticated } from '../middleware/auth.js';
import {
  getUserCategories,
  createCategory,
  addGameToCategory,
  removeGameFromCategory,
  deleteCategory,
  renameCategory
} from '../utils/categoriesDB_mongo.js';

const router = express.Router();

// Get all categories for logged-in user
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const steamId = req.user.steamId;
    const categories = await getUserCategories(steamId);
    
    res.json({
      success: true,
      categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Create new category
router.post('/', isAuthenticated, async (req, res) => {
  try {
    const steamId = req.user.steamId;
    const { name } = req.body;
    
    if (!name || name.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Category name is required'
      });
    }
    
    const category = await createCategory(steamId, name.trim());
    
    res.json({
      success: true,
      category
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Add game to category
router.post('/:categoryId/games', isAuthenticated, async (req, res) => {
  try {
    const steamId = req.user.steamId;
    const { categoryId } = req.params;
    const gameData = req.body;
    
    const category = await addGameToCategory(steamId, categoryId, gameData);
    
    res.json({
      success: true,
      category
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Remove game from category
router.delete('/:categoryId/games/:appid', isAuthenticated, async (req, res) => {
  try {
    const steamId = req.user.steamId;
    const { categoryId, appid } = req.params;
    
    const category = await removeGameFromCategory(steamId, categoryId, parseInt(appid));
    
    res.json({
      success: true,
      category
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Rename category
router.patch('/:categoryId', isAuthenticated, async (req, res) => {
  try {
    const steamId = req.user.steamId;
    const { categoryId } = req.params;
    const { name } = req.body;
    
    if (!name || name.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Category name is required'
      });
    }
    
    const category = await renameCategory(steamId, categoryId, name.trim());
    
    res.json({
      success: true,
      category
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Delete category
router.delete('/:categoryId', isAuthenticated, async (req, res) => {
  try {
    const steamId = req.user.steamId;
    const { categoryId } = req.params;
    
    await deleteCategory(steamId, categoryId);
    
    res.json({
      success: true
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;