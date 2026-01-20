import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CATEGORIES_FILE = path.join(__dirname, '../data/categories.json');

// Initialize file if doesn't exist
async function initFile() {
  try {
    await fs.access(CATEGORIES_FILE);
  } catch {
    await fs.writeFile(CATEGORIES_FILE, '{}');
  }
}

// Get all categories for a user
export async function getUserCategories(steamId) {
  await initFile();
  const data = await fs.readFile(CATEGORIES_FILE, 'utf8');
  const allCategories = JSON.parse(data);
  return allCategories[steamId] || [];
}

// Create a new category
export async function createCategory(steamId, categoryName) {
  await initFile();
  const data = await fs.readFile(CATEGORIES_FILE, 'utf8');
  const allCategories = JSON.parse(data);
  
  if (!allCategories[steamId]) {
    allCategories[steamId] = [];
  }
  
  const newCategory = {
    id: Date.now().toString(),
    name: categoryName,
    games: [],
    createdAt: new Date().toISOString()
  };
  
  allCategories[steamId].push(newCategory);
  await fs.writeFile(CATEGORIES_FILE, JSON.stringify(allCategories, null, 2));
  
  return newCategory;
}

// Add game to category
export async function addGameToCategory(steamId, categoryId, gameData) {
  await initFile();
  const data = await fs.readFile(CATEGORIES_FILE, 'utf8');
  const allCategories = JSON.parse(data);
  
  const userCategories = allCategories[steamId] || [];
  const category = userCategories.find(c => c.id === categoryId);
  
  if (!category) {
    throw new Error('Category not found');
  }
  
  // Check if game already in category
  if (!category.games.find(g => g.appid === gameData.appid)) {
    category.games.push(gameData);
    await fs.writeFile(CATEGORIES_FILE, JSON.stringify(allCategories, null, 2));
  }
  
  return category;
}

// Remove game from category
export async function removeGameFromCategory(steamId, categoryId, appid) {
  await initFile();
  const data = await fs.readFile(CATEGORIES_FILE, 'utf8');
  const allCategories = JSON.parse(data);
  
  const userCategories = allCategories[steamId] || [];
  const category = userCategories.find(c => c.id === categoryId);
  
  if (!category) {
    throw new Error('Category not found');
  }
  
  category.games = category.games.filter(g => g.appid !== appid);
  await fs.writeFile(CATEGORIES_FILE, JSON.stringify(allCategories, null, 2));
  
  return category;
}

// Delete category
export async function deleteCategory(steamId, categoryId) {
  await initFile();
  const data = await fs.readFile(CATEGORIES_FILE, 'utf8');
  const allCategories = JSON.parse(data);
  
  if (allCategories[steamId]) {
    allCategories[steamId] = allCategories[steamId].filter(c => c.id !== categoryId);
    await fs.writeFile(CATEGORIES_FILE, JSON.stringify(allCategories, null, 2));
  }
  
  return { success: true };
}

// Rename category
export async function renameCategory(steamId, categoryId, newName) {
  await initFile();
  const data = await fs.readFile(CATEGORIES_FILE, 'utf8');
  const allCategories = JSON.parse(data);
  
  const userCategories = allCategories[steamId] || [];
  const category = userCategories.find(c => c.id === categoryId);
  
  if (!category) {
    throw new Error('Category not found');
  }
  
  category.name = newName;
  await fs.writeFile(CATEGORIES_FILE, JSON.stringify(allCategories, null, 2));
  
  return category;
}