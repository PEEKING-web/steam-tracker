import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import {
  getCategories,
  removeGameFromCategory
} from '../services/api';

function CategoryDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategory();
  }, [id]);

  const fetchCategory = async () => {
    try {
      setLoading(true);
      const data = await getCategories();
      const found = data.categories?.find(c => c.id === id);
      setCategory(found || null);
    } catch (error) {
      console.error('Failed to load category:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveGame = async (appid) => {
    try {
      await removeGameFromCategory(category.id, appid);
      setCategory(prev => ({
        ...prev,
        games: prev.games.filter(g => g.appid !== appid)
      }));
    } catch (error) {
      console.error('Failed to remove game:', error);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00FF84] shadow-[0_0_15px_rgba(0,255,132,0.3)]"></div>
        </div>
      </Layout>
    );
  }

  if (!category) {
    return (
      <Layout>
        <div className="p-8 text-center font-mono">
          <p className="text-[#71717A] text-xs uppercase tracking-[0.2em] mb-4">404: Directory_Not_Found</p>
          <button
            onClick={() => navigate('/categories')}
            className="px-6 py-2 border border-[#00FF84] text-[#00FF84] hover:bg-[#00FF84]/10 rounded font-bold text-[10px] uppercase tracking-widest transition-all"
          >
            Return to Root
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* Header */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate('/categories')}
              className="text-[#71717A] hover:text-[#00FF84] font-mono text-xs uppercase transition-colors"
            >
              &lt; [BACK]
            </button>
            <div className="font-mono">
              <h1 className="text-4xl font-bold text-[#EDEDED] uppercase tracking-tighter">
                {category.name}
              </h1>
              <p className="text-[#71717A] text-[10px] uppercase tracking-widest mt-1">
                Detected_Assets: {category.games.length}
              </p>
            </div>
          </div>

          {/* Games Grid */}
          {category.games.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {category.games.map(game => (
                <div
                  key={game.appid}
                  className="bg-[#0b0f14] rounded overflow-hidden border border-white/5 hover:border-[#00FF84]/30 transition-all group"
                >
                  <div className="aspect-[460/215] overflow-hidden bg-black">
                    <img
                      src={`https://cdn.cloudflare.steamstatic.com/steam/apps/${game.appid}/header.jpg`}
                      alt={game.name}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                    />
                  </div>

                  <div className="p-3 space-y-3 font-mono">
                    <h3 className="text-[#EDEDED] text-[11px] font-bold uppercase tracking-tight line-clamp-2 min-h-[32px]">
                      {game.name}
                    </h3>

                    <button
                      onClick={() => handleRemoveGame(game.appid)}
                      className="w-full py-1.5 border border-red-500/20 bg-red-500/5 hover:bg-red-500/20 text-red-400 text-[9px] uppercase font-bold tracking-tighter transition-all"
                    >
                      [DISCONNECT_ASSET]
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-[#060606] rounded-lg p-12 text-center border border-dashed border-white/10 font-mono">
              <p className="text-[#71717A] text-[10px] uppercase tracking-widest">
                Directory is currently null
              </p>
            </div>
          )}

        </div>
      </div>
    </Layout>
  );
}

export default CategoryDetails;