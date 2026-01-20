import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import {
  getCategories,
  createCategory,
  deleteCategory
} from '../services/api';

import { useNavigate } from 'react-router-dom';


function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState('');
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await getCategories();
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    try {
      setCreating(true);
      await createCategory(newCategory.trim());
      setNewCategory('');
      fetchCategories();
    } catch (error) {
      console.error('Failed to create category:', error);
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this category?'
    );
    if (!confirmed) return;

    try {
      await deleteCategory(id);
      setCategories(prev => prev.filter(c => c.id !== id));
    } catch (error) {
      console.error('Failed to delete category:', error);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00FF84] mx-auto mb-4 shadow-[0_0_10px_rgba(0,255,132,0.2)]"></div>
            <p className="text-[#71717A] font-mono text-xs uppercase tracking-widest">Mapping data clusters...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* Header */}
          <div>
            <h1 className="text-4xl font-bold text-[#EDEDED] mb-2 font-mono uppercase tracking-tighter">Collection_Nodes</h1>
            <p className="text-[#71717A] font-mono text-xs uppercase tracking-widest">
              Organize software assets into custom data partitions
            </p>
          </div>

          {/* Create Category */}
          <form
            onSubmit={handleCreateCategory}
            className="bg-[#0b0f14] rounded-lg p-4 border border-white/5 flex gap-4"
          >
            <input
              type="text"
              placeholder="Assign new partition label..."
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="flex-1 px-4 py-2 bg-black text-[#EDEDED] rounded border border-white/10 font-mono text-sm focus:border-[#00FF84]/50 focus:outline-none placeholder:text-[#3F3F46]"
            />
            <button
              type="submit"
              disabled={creating}
              className="px-6 py-2 bg-[#00FF84] hover:bg-[#00FF84]/80 disabled:opacity-30 text-black rounded font-mono font-bold text-xs uppercase tracking-widest transition-all"
            >
              {creating ? 'PROCESSING...' : 'INITIALIZE'}
            </button>
          </form>

          {/* Categories Grid */}
          {categories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map(category => (
                            <div
                            key={category.id}
                            onClick={() => navigate(`/categories/${category.id}`)}
                            className="bg-[#0b0f14] rounded-lg p-6 cursor-pointer hover:border-[#00FF84]/40 transition-all border border-white/5 group relative overflow-hidden"
                          >

                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-sm font-bold text-[#EDEDED] font-mono uppercase tracking-tight group-hover:text-[#00FF84] transition-colors">
                      {category.name}
                    </h2>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCategory(category.id);
                      }}
                      className="text-[#71717A] hover:text-[#FF4D4D] transition-colors font-mono text-xs"
                    >
                      [PURGE]
                    </button>
                  </div>

                  <p className="text-[#71717A] font-mono text-[10px] uppercase tracking-tighter">
                    Linked_Assets: {category.games?.length || 0}
                  </p>
                  
                  {/* Decorative background accent */}
                  <div className="absolute bottom-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition-opacity">
                    <span className="text-4xl font-mono">#0{category.id % 9}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-[#060606] rounded-lg p-12 text-center border border-dashed border-white/10">
              <p className="text-[#71717A] font-mono text-xs uppercase tracking-widest mb-2">
                Partition list empty
              </p>
              <p className="text-[#3F3F46] font-mono text-[10px] uppercase">
                Initialize your first collection to enable file sorting
              </p>
            </div>
          )}

        </div>
      </div>
    </Layout>
  );
}

export default Categories;