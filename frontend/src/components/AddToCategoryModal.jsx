import { useEffect, useState } from 'react';
import {
  getCategories,
  addGameToCategory
} from '../services/api';

function AddToCategoryModal({ game, onClose }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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

  const handleAdd = async (categoryId) => {
    try {
      setSaving(true);
      await addGameToCategory(categoryId, {
        appid: game.appid,
        name: game.name,
        playtime_forever: game.playtime_forever,
        img_icon_url: game.img_icon_url
      });
      onClose();
    } catch (error) {
      console.error('Failed to add game to category:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-mono"
      onClick={onClose}
    >
      <div
        className="bg-[#0b0f14] w-full max-w-md border border-[#00FF84]/30 shadow-[0_0_30px_rgba(0,0,0,0.5)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <h2 className="text-xl font-bold text-[#EDEDED] uppercase tracking-tighter mb-6 flex items-center gap-2">
            <span className="text-[#00FF84]">[+]</span> Assign_Partition
          </h2>

          {loading ? (
            <p className="text-[#71717A] text-xs uppercase tracking-widest animate-pulse">Scanning_Directories...</p>
          ) : categories.length > 0 ? (
            <div className="space-y-2 max-h-60 overflow-y-auto pr-2 scrollbar-hide">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => handleAdd(category.id)}
                  disabled={saving}
                  className="w-full text-left px-4 py-3 bg-black/40 hover:bg-[#00FF84]/10 border border-white/5 hover:border-[#00FF84]/30 text-[#EDEDED] transition-all group disabled:opacity-50"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs uppercase font-bold tracking-tight group-hover:text-[#00FF84]">
                      {category.name}
                    </span>
                    <span className="text-[#3F3F46] text-[10px] group-hover:text-[#00FF84]/60">
                      ID:0{category.id % 9} // Assets:({category.games?.length || 0})
                    </span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-[#71717A] text-xs uppercase tracking-widest border border-dashed border-white/10 p-4 text-center">
              No active partitions detected. Initialize directory first.
            </p>
          )}

          <button
            onClick={onClose}
            className="mt-6 w-full py-2 bg-transparent hover:bg-red-500/10 border border-white/10 hover:border-red-500/50 text-[#71717A] hover:text-red-500 text-[10px] uppercase font-bold tracking-[0.2em] transition-all"
          >
            Abort_Action
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddToCategoryModal;