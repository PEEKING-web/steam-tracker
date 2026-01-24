import Category from '../models/Category.js';

export async function getUserCategories(steamId) {
  try {
    const categories = await Category.find({ steamId }).sort({ createdAt: -1 });
    
    return categories.map(cat => ({
      id: cat.categoryId,
      name: cat.name,
      games: cat.games,
      createdAt: cat.createdAt
    }));
  } catch (error) {
    console.error('Error getting categories:', error);
    throw error;
  }
}

export async function createCategory(steamId, categoryName) {
  try {
    const categoryId = Date.now().toString();
    
    const newCategory = new Category({
      steamId,
      categoryId,
      name: categoryName,
      games: []
    });
    
    await newCategory.save();
    
    return {
      id: newCategory.categoryId,
      name: newCategory.name,
      games: newCategory.games,
      createdAt: newCategory.createdAt
    };
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
}

export async function addGameToCategory(steamId, categoryId, gameData) {
  try {
    const category = await Category.findOne({ steamId, categoryId });
    
    if (!category) {
      throw new Error('Category not found');
    }
    
    const gameExists = category.games.find(g => g.appid === gameData.appid);
    if (!gameExists) {
      category.games.push(gameData);
      await category.save();
    }
    
    return {
      id: category.categoryId,
      name: category.name,
      games: category.games,
      createdAt: category.createdAt
    };
  } catch (error) {
    console.error('Error adding game to category:', error);
    throw error;
  }
}

export async function removeGameFromCategory(steamId, categoryId, appid) {
  try {
    const category = await Category.findOne({ steamId, categoryId });
    
    if (!category) {
      throw new Error('Category not found');
    }
    
    category.games = category.games.filter(g => g.appid !== appid);
    await category.save();
    
    return {
      id: category.categoryId,
      name: category.name,
      games: category.games,
      createdAt: category.createdAt
    };
  } catch (error) {
    console.error('Error removing game:', error);
    throw error;
  }
}

export async function deleteCategory(steamId, categoryId) {
  try {
    await Category.deleteOne({ steamId, categoryId });
    return { success: true };
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
}

export async function renameCategory(steamId, categoryId, newName) {
  try {
    const category = await Category.findOne({ steamId, categoryId });
    
    if (!category) {
      throw new Error('Category not found');
    }
    
    category.name = newName;
    await category.save();
    
    return {
      id: category.categoryId,
      name: category.name,
      games: category.games,
      createdAt: category.createdAt
    };
  } catch (error) {
    console.error('Error renaming category:', error);
    throw error;
  }
}