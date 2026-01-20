import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { getFriendsList } from '../services/api';

function Friends() {
  const navigate = useNavigate();
  const [friends, setFriends] = useState([]);
  const [filteredFriends, setFilteredFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchFriends();
  }, []);

  useEffect(() => {
    filterFriends();
  }, [friends, showOnlineOnly, searchQuery]);

  const fetchFriends = async () => {
    try {
      setLoading(true);
      const data = await getFriendsList();
      setFriends(data.friends || []);
    } catch (error) {
      console.error('Failed to fetch friends:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterFriends = () => {
    let result = [...friends];

    // Filter by online status
    if (showOnlineOnly) {
      result = result.filter(friend => friend.isOnline);
    }

    // Filter by search query
    if (searchQuery) {
      result = result.filter(friend =>
        friend.displayName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort: online first, then by name
    result.sort((a, b) => {
      if (a.isOnline === b.isOnline) {
        return a.displayName.localeCompare(b.displayName);
      }
      return a.isOnline ? -1 : 1;
    });

    setFilteredFriends(result);
  };

  const getStatusText = (personaState) => {
    const states = {
      0: 'Offline',
      1: 'Online',
      2: 'Busy',
      3: 'Away',
      4: 'Snooze',
      5: 'Looking to trade',
      6: 'Looking to play'
    };
    return states[personaState] || 'Unknown';
  };

  const getStatusColor = (personaState) => {
    if (personaState === 1) return 'bg-[#00FF84]';
    if (personaState === 2 || personaState === 3) return 'bg-yellow-500';
    return 'bg-[#3F3F46]';
  };

  const formatLastOnline = (timestamp) => {
    if (!timestamp) return 'Never';
    const now = Date.now() / 1000;
    const diff = now - timestamp;
    
    const minutes = Math.floor(diff / 60);
    const hours = Math.floor(diff / 3600);
    const days = Math.floor(diff / 86400);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const onlineFriendsCount = friends.filter(f => f.isOnline).length;

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-8">
          <div className="text-center font-mono">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#00FF84] mx-auto mb-4"></div>
            <p className="text-[#71717A] text-xs uppercase tracking-widest">Scanning network...</p>
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
          <div className="mb-6 font-mono">
            <h1 className="text-4xl font-bold text-[#EDEDED] uppercase tracking-tighter">Network_Contacts</h1>
            <p className="text-[#71717A] text-xs uppercase tracking-[0.2em] mt-1">
              {onlineFriendsCount} Active_Nodes • {friends.length} Total_Connections
            </p>
          </div>

          {/* Controls */}
          <div className="bg-[#0b0f14] rounded-lg p-4 mb-6 border border-white/5">
            <div className="flex flex-col md:flex-row gap-4">
              
              {/* Search */}
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Identify contact..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 bg-black text-[#EDEDED] rounded border border-white/10 font-mono text-sm focus:border-[#00FF84]/50 focus:outline-none placeholder:text-[#3F3F46]"
                />
              </div>

              {/* Online Filter */}
              <button
                onClick={() => setShowOnlineOnly(!showOnlineOnly)}
                className={`px-4 py-2 rounded font-mono text-xs uppercase tracking-widest transition-all ${
                  showOnlineOnly
                    ? 'bg-[#00FF84] text-black font-bold'
                    : 'bg-black text-[#71717A] border border-white/10'
                }`}
              >
                <span className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${showOnlineOnly ? 'bg-black' : 'bg-[#00FF84]'}`}></div>
                  Active_Only
                </span>
              </button>
            </div>

            {/* Results count */}
            {(searchQuery || showOnlineOnly) && (
              <div className="mt-3 text-[#71717A] font-mono text-[10px] uppercase tracking-tighter">
                Filtered_Results: {filteredFriends.length}
              </div>
            )}
          </div>

          {/* Friends Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFriends.map((friend) => (
              <div
                key={friend.steamId}
                onClick={() => navigate(`/friends/${friend.steamId}`)}
                className="bg-[#0b0f14] rounded-lg p-4 border border-white/5 hover:border-[#00FF84]/30 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-4">
                  
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <img
                      src={friend.avatar}
                      alt={friend.displayName}
                      className="w-16 h-16 rounded border border-white/10 grayscale group-hover:grayscale-0 transition-all"
                    />
                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 ${getStatusColor(friend.personaState)} rounded-full border-2 border-[#0b0f14]`}></div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 font-mono">
                    <h3 className="text-[#EDEDED] font-bold text-sm uppercase truncate group-hover:text-[#00FF84] transition-colors">
                      {friend.displayName}
                    </h3>
                    
                    {friend.isOnline ? (
                      <div className="flex items-center gap-2 text-[10px] mt-1 uppercase">
                        <span className="text-[#00FF84] font-bold tracking-widest">{getStatusText(friend.personaState)}</span>
                      </div>
                    ) : (
                      <p className="text-[#71717A] text-[10px] mt-1 uppercase tracking-tighter">
                        Last_Seen: {formatLastOnline(friend.lastLogoff)}
                      </p>
                    )}

                    {/* Privacy Badge */}
                    {!friend.isPublic && (
                      <div className="mt-1">
                        <span className="text-[8px] px-2 py-0.5 bg-black/50 text-[#71717A] border border-white/5 rounded uppercase">
                          Encrypted_Profile
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Arrow */}
                  <div className="text-[#3F3F46] group-hover:text-[#00FF84] transition-colors font-mono">
                    &gt;
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* No Results */}
          {filteredFriends.length === 0 && friends.length > 0 && (
            <div className="text-center py-12 font-mono border border-dashed border-white/10 rounded-lg">
              <p className="text-[#71717A] text-xs uppercase tracking-widest mb-2">Zero matching signatures</p>
              <p className="text-[#3F3F46] text-[10px] uppercase">Refine search parameters or filter status</p>
            </div>
          )}

          {/* No Friends at all */}
          {friends.length === 0 && (
            <div className="text-center py-12 bg-[#0b0f14] rounded-lg border border-white/5 font-mono">
              <p className="text-[#71717A] text-sm uppercase tracking-widest">No connections detected</p>
              <p className="text-[#3F3F46] text-[10px] mt-2 uppercase">Sync with primary Steam node to populate list</p>
            </div>
          )}

        </div>
      </div>
    </Layout>
  );
}

export default Friends;