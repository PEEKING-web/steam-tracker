import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { getOwnedGames } from '../services/api';

function Achievements() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('completion');

  useEffect(() => {
    fetchGamesWithAchievements();
  }, []);

  const fetchGamesWithAchievements = async () => {
    try {
      setLoading(true);
      const data = await getOwnedGames();
      
      // Filter games with playtime (likely have achievements)
      const gamesWithPlaytime = (data.games || []).filter(g => g.playtime_forever > 0);
      
      setGames(gamesWithPlaytime);
    } catch (error) {
      console.error('Failed to fetch games:', error);
    } finally {
      setLoading(false);
    }
  };

  const sortedGames = [...games].sort((a, b) => {
    if (sortBy === 'playtime') {
      return (b.playtime_forever || 0) - (a.playtime_forever || 0);
    }
    return 0; // Default sort
  });

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00FF84] mx-auto mb-4 shadow-[0_0_15px_rgba(0,255,132,0.2)]"></div>
            <p className="text-[#A1A1AA] font-mono text-sm tracking-widest uppercase">Scanning Achievement Database...</p>
          </div>
        </div>
      </Layout>
    );
  }

  const totalGames = games.length;
  const totalPlaytime = games.reduce((sum, g) => sum + (g.playtime_forever || 0), 0);

  return (
    <Layout>
      <div className="p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-[#EDEDED] mb-2 font-mono tracking-tighter uppercase">Achievements_Overview</h1>
            <p className="text-[#71717A] font-mono text-xs uppercase tracking-widest">Track your gaming accomplishments and decrypted milestones</p>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-[#0b0f14] rounded-lg p-6 border border-white/5 hover:border-[#00FF84]/20 transition-all">
              <div className="text-[#71717A] text-[10px] font-mono mb-2 uppercase tracking-widest">Games_Played</div>
              <div className="text-4xl font-bold text-[#EDEDED] mb-1 font-mono tracking-tighter">{totalGames}</div>
              <div className="text-[#00FF84] text-[9px] font-mono opacity-70 uppercase tracking-tight">Active_Sectors</div>
            </div>

            <div className="bg-[#0b0f14] rounded-lg p-6 border border-white/5 hover:border-[#00FF84]/20 transition-all">
              <div className="text-[#71717A] text-[10px] font-mono mb-2 uppercase tracking-widest">Total_Playtime</div>
              <div className="text-4xl font-bold text-[#EDEDED] mb-1 font-mono tracking-tighter">
                {Math.floor(totalPlaytime / 60).toLocaleString()}
              </div>
              <div className="text-[#00FF84] text-[9px] font-mono opacity-70 uppercase tracking-tight">Hours_Logged</div>
            </div>

            <div className="bg-[#0b0f14] rounded-lg p-6 border border-white/5 hover:border-[#00FF84]/20 transition-all">
              <div className="text-[#71717A] text-[10px] font-mono mb-2 uppercase tracking-widest">Achievement_Hunter</div>
              <div className="text-3xl font-bold text-[#EDEDED] mb-1">🎯</div>
              <div className="text-[#00FF84] text-[9px] font-mono opacity-70 uppercase tracking-tight">Inquire_Nodes</div>
            </div>
          </div>

          {/* Info Message */}
          <div className="bg-[#060606] rounded-lg p-6 mb-8 border border-[#00FF84]/20 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-[#00FF84]"></div>
            <div className="flex items-start gap-5">
              <span className="text-3xl grayscale brightness-150">💡</span>
              <div>
                <h3 className="text-[#EDEDED] font-mono font-bold text-sm mb-3 uppercase tracking-wider">Protocol: Viewing Detailed Stats</h3>
                <p className="text-[#A1A1AA] text-xs font-mono mb-4">
                  To access encrypted achievement progress for specific nodes:
                </p>
                <ol className="text-[#71717A] text-xs font-mono space-y-2 ml-4 list-decimal marker:text-[#00FF84]">
                  <li>Navigate to the <span className="text-[#EDEDED] underline decoration-[#00FF84]/40 font-bold">Games_Library</span></li>
                  <li>Execute selection on any game card</li>
                  <li>Review unlocked/locked milestones via the overlay terminal</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Games List */}
          <div className="bg-[#060606] rounded-lg p-6 border border-white/10">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xs font-mono font-bold text-[#EDEDED] uppercase tracking-[0.3em]">Game_Database</h2>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-1.5 bg-[#0b0f14] text-[#EDEDED] rounded-lg border border-white/10 font-mono text-[10px] focus:border-[#00FF84]/50 focus:outline-none cursor-pointer uppercase tracking-tighter"
              >
                <option value="playtime">Sort: Playtime_Desc</option>
              </select>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {sortedGames.map((game) => (
                <div
                  key={game.appid}
                  className="bg-[#0b0f14] rounded-lg overflow-hidden border border-white/5 hover:border-[#00FF84]/30 transition-all duration-300 group"
                >
                  <div className="aspect-[460/215] relative overflow-hidden bg-black">
                    <img
                      src={`https://cdn.cloudflare.steamstatic.com/steam/apps/${game.appid}/header.jpg`}
                      alt={game.name}
                      className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/460x215/000000/00FF84?text=IMAGE_NOT_FOUND';
                      }}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-[#EDEDED] font-mono text-[11px] font-bold line-clamp-1 mb-1 group-hover:text-[#00FF84] transition-colors uppercase tracking-tight">
                      {game.name}
                    </h3>
                    <p className="text-[#71717A] font-mono text-[9px] uppercase tracking-tighter">
                      Logged: {Math.floor(game.playtime_forever / 60)}H
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}

export default Achievements;