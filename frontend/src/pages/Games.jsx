import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { getOwnedGames } from '../services/api';
import GameDetailsModal from '../components/GameDetailsModal';

function Games() {
  const [games, setGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('playtime'); // playtime, name, recent
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGame, setSelectedGame] = useState(null);

  useEffect(() => {
    fetchGames();
  }, []);

  useEffect(() => {
    filterAndSortGames();
  }, [games, sortBy, searchQuery]);

  const fetchGames = async () => {
    try {
      setLoading(true);
      const data = await getOwnedGames();
      setGames(data.games || []);
    } catch (error) {
      console.error('Failed to fetch games:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortGames = () => {
    let result = [...games];

    // Filter by search query
    if (searchQuery) {
      result = result.filter(game =>
        game.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort games
    result.sort((a, b) => {
      switch (sortBy) {
        case 'playtime':
          return (b.playtime_forever || 0) - (a.playtime_forever || 0);
        case 'name':
          return a.name.localeCompare(b.name);
        case 'recent':
          return (b.rtime_last_played || 0) - (a.rtime_last_played || 0);
        default:
          return 0;
      }
    });

    setFilteredGames(result);
  };

  const formatPlaytime = (minutes) => {
    if (!minutes) return '0h';
    const hours = Math.floor(minutes / 60);
    if (hours < 1) return '<1h';
    return `${hours.toLocaleString()}h`;
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00FF84] mx-auto mb-4 shadow-[0_0_15px_rgba(0,255,132,0.2)]"></div>
            <p className="text-[#A1A1AA] font-mono text-sm tracking-widest uppercase">Fetching Library Nodes...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-[#EDEDED] mb-2 font-mono tracking-tighter uppercase">Games_Library</h1>
            <p className="text-[#71717A] font-mono text-xs uppercase tracking-widest">
              {games.length} nodes detected in local database
            </p>
          </div>

          {/* Controls */}
          <div className="bg-[#060606] rounded-lg p-4 mb-8 border border-white/10">
            <div className="flex flex-col md:flex-row gap-4">
              
              {/* Search */}
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="SEARCH_FOR_UID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 bg-[#0b0f14] text-[#EDEDED] rounded-lg border border-white/5 font-mono text-sm focus:border-[#00FF84]/50 focus:outline-none focus:ring-1 focus:ring-[#00FF84]/20 transition-all placeholder:text-[#71717A]"
                />
              </div>

              {/* Sort */}
              <div className="flex items-center gap-3">
                <span className="text-[#71717A] text-[10px] font-mono uppercase tracking-widest whitespace-nowrap">Sort_by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 bg-[#0b0f14] text-[#EDEDED] rounded-lg border border-white/5 font-mono text-sm focus:border-[#00FF84]/50 focus:outline-none cursor-pointer"
                >
                  <option value="playtime">Playtime_Desc</option>
                  <option value="name">Alpha_Numeric</option>
                  <option value="recent">Recent_Uplink</option>
                </select>
              </div>
            </div>

            {/* Results count */}
            {searchQuery && (
              <div className="mt-3 text-[#00FF84] text-[10px] font-mono uppercase tracking-tighter opacity-80">
                &gt; Found {filteredGames.length} matching {filteredGames.length === 1 ? 'node' : 'nodes'}
              </div>
            )}
          </div>

          {/* Games Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredGames.map((game) => (
              <div
                key={game.appid}
                onClick={() => setSelectedGame(game)}
                className="bg-[#0b0f14] rounded-lg overflow-hidden border border-white/5 hover:border-[#00FF84]/40 transition-all duration-300 group cursor-pointer"
              >
                {/* Game Image */}
                <div className="aspect-[460/215] relative overflow-hidden bg-black">
                  <img
                    src={`https://cdn.cloudflare.steamstatic.com/steam/apps/${game.appid}/header.jpg`}
                    alt={game.name}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                    onError={(e) => {
                     e.target.onerror = null;
                        e.target.src = `https://cdn.cloudflare.steamstatic.com/steam/apps/${game.appid}/header.jpg`;
                    }}
                  />
                  
                  {/* Playtime Overlay */}
                  {game.playtime_forever > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/40 to-transparent p-2">
                      <div className="text-[#00FF84] text-[10px] font-mono font-bold tracking-tight">
                        {formatPlaytime(game.playtime_forever)}
                      </div>
                    </div>
                  )}
                </div>

                {/* Game Info */}
                <div className="p-4">
                  <h3 className="text-[#EDEDED] font-mono text-xs font-bold line-clamp-1 mb-1 group-hover:text-[#00FF84] transition-colors uppercase tracking-tight">
                    {game.name}
                  </h3>
                  {game.playtime_forever > 0 ? (
                    <p className="text-[#71717A] font-mono text-[9px] uppercase tracking-tighter">
                      LOGGED: {formatPlaytime(game.playtime_forever)}
                    </p>
                  ) : (
                    <p className="text-[#71717A] font-mono text-[9px] uppercase tracking-tighter italic">No_Data_Logged</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* No Results */}
          {filteredGames.length === 0 && (
            <div className="text-center py-20 border border-dashed border-white/10 rounded-lg">
              <p className="text-[#71717A] font-mono text-sm uppercase tracking-widest mb-2">Query_Returned_Null</p>
              {searchQuery && (
                <p className="text-[#00FF84] font-mono text-[10px] uppercase opacity-50 tracking-tighter">
                  [!] Adjust filter parameters and retry
                </p>
              )}
            </div>
          )}

        </div>
      </div>
      {selectedGame && (
        <GameDetailsModal 
          game={selectedGame} 
          onClose={() => setSelectedGame(null)} 
        />
      )}
    </Layout>
  );
}

export default Games;