import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ExternalLink, 
  Lock, 
  Gamepad2, 
  Clock, 
  Trophy, 
  Loader2, 
  User,
  Calendar 
} from 'lucide-react';
import Layout from '../components/Layout';
import { getFriendProfile, getFriendGames } from '../services/api';


function FriendProfile() {
  const { steamId } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [games, setGames] = useState(null);
  const [loading, setLoading] = useState(true);
  const [gamesLoading, setGamesLoading] = useState(false);


  
  useEffect(() => {
    fetchFriendData();
  }, [steamId]);

  const fetchFriendData = async () => {
    try {
      setLoading(true);
      
      // Fetch profile
      const profileData = await getFriendProfile(steamId);
      setProfile(profileData.profile);

      // If profile is public, fetch games
      if (profileData.profile.isPublic) {
        setGamesLoading(true);
        try {
          const gamesData = await getFriendGames(steamId);
          if (!gamesData.isPrivate) {
            setGames(gamesData);
          }
        } catch (error) {
          console.error('Failed to fetch friend games:', error);
        } finally {
          setGamesLoading(false);
        }
      }

    } catch (error) {
      console.error('Failed to fetch friend profile:', error);
    } finally {
      setLoading(false);
    }
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
    return 'bg-zinc-500';
  };

  const formatPlaytime = (minutes) => {
    if (!minutes) return '0h';
    const hours = Math.floor(minutes / 60);
    if (hours < 1) return '<1h';
    return `${hours.toLocaleString()}h`;
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown';
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-8 bg-black">
          <div className="text-center font-mono">
            <Loader2 className="animate-spin h-16 w-16 text-[#00FF84] mx-auto mb-4" />
            <p className="text-[#00FF84] text-lg uppercase tracking-widest">Loading profile...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!profile) {
    return (
      <Layout>
        <div className="p-8 max-w-7xl mx-auto font-mono">
          <div className="bg-black border border-[#00FF84]/20 rounded-none p-8 text-center shadow-[0_0_15px_rgba(0,255,132,0.1)]">
            <p className="text-white text-xl mb-4 uppercase">Profile not found</p>
            <button
              onClick={() => navigate('/friends')}
              className="px-6 py-3 bg-black border border-[#00FF84] text-[#00FF84] hover:bg-[#00FF84] hover:text-black transition-colors uppercase font-bold"
            >
              Back to Friends
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const totalPlaytime = games?.games?.reduce((total, game) => total + (game.playtime_forever || 0), 0) || 0;
  const mostPlayedGame = games?.games?.reduce((max, game) => 
    (game.playtime_forever || 0) > (max.playtime_forever || 0) ? game : max
  , games?.games?.[0]);

  return (
    <Layout>
      <div className="p-4 md:p-8 bg-black min-h-screen font-mono">
        <div className="max-w-7xl mx-auto">
          
          {/* Back Button */}
          <button
            onClick={() => navigate('/friends')}
            className="mb-4 flex items-center gap-2 text-[#00FF84]/60 hover:text-white transition-colors uppercase text-xs tracking-widest"
          >
            <ArrowLeft size={16} /> ← Back to Friends
          </button>

          {/* Profile Header */}
          <div className="bg-black border border-[#00FF84]/20 rounded-none p-6 md:p-8 mb-6 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              
              {/* Avatar */}
              <div className="relative">
                <img
                  src={profile.avatar}
                  alt={profile.displayName}
                  className="w-32 h-32 rounded-none border-2 border-[#00FF84] shadow-[0_0_10px_rgba(0,255,132,0.2)] grayscale hover:grayscale-0 transition-all"
                />
                <div className={`absolute -bottom-2 -right-2 w-6 h-6 ${getStatusColor(profile.personaState)} rounded-none border-2 border-black`}></div>
              </div>

              {/* User Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-4xl font-black text-white mb-2 uppercase tracking-tighter italic">{profile.displayName}</h1>
                
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-zinc-500 text-xs mb-4 uppercase tracking-widest">
                  <span className="flex items-center gap-2">
                    <div className={`w-2 h-2 ${getStatusColor(profile.personaState)}`}></div>
                    {getStatusText(profile.personaState)}
                  </span>
                  
                  {profile.realName && (
                    <>
                      <span>•</span>
                      <span>{profile.realName}</span>
                    </>
                  )}
                  
                  {profile.timeCreated && (
                    <>
                      <span>•</span>
                      <span>Member since {formatDate(profile.timeCreated)}</span>
                    </>
                  )}
                </div>

                {profile.profileUrl && (
                  
                    <a href={profile.profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[#00FF84] hover:text-[#00FF84]/80 transition-colors uppercase font-bold text-xs"
                  >
                    View Steam Profile →
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Private Profile Message */}
          {!profile.isPublic && (
            <div className="bg-black border border-red-500/20 rounded-none p-8 text-center mb-6">
              <div className="text-6xl mb-4 grayscale opacity-50"><Lock size={48} className="mx-auto text-red-500" /></div>
              <h2 className="text-2xl font-bold text-white mb-2 uppercase">This Profile is Private</h2>
              <p className="text-zinc-500 text-sm">
                This user's game library and stats are not publicly visible.
              </p>
            </div>
          )}

          {/* Public Profile - Show Games */}
          {profile.isPublic && (
            <>
              {/* Stats Grid */}
              {games && games.games && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  
                  {/* Total Games */}
                  <div className="bg-black border border-[#00FF84]/20 rounded-none p-6 hover:border-[#00FF84]/50 transition-colors">
                    <div className="text-zinc-500 text-[10px] font-bold mb-2 uppercase tracking-[0.2em]">Total Games</div>
                    <div className="text-4xl font-black text-white mb-1">
                      {games.gameCount || 0}
                    </div>
                    <div className="text-[#00FF84] text-[10px] uppercase font-bold">In library</div>
                  </div>

                  {/* Total Playtime */}
                  <div className="bg-black border border-[#00FF84]/20 rounded-none p-6 hover:border-[#00FF84]/50 transition-colors">
                    <div className="text-zinc-500 text-[10px] font-bold mb-2 uppercase tracking-[0.2em]">Total Playtime</div>
                    <div className="text-4xl font-black text-white mb-1 italic">
                      {Math.floor(totalPlaytime / 60).toLocaleString()}
                    </div>
                    <div className="text-[#00FF84] text-[10px] uppercase font-bold">Hours played</div>
                  </div>

                  {/* Most Played */}
                  <div className="bg-black border border-[#00FF84]/20 rounded-none p-6 hover:border-[#00FF84]/50 transition-colors">
                    <div className="text-zinc-500 text-[10px] font-bold mb-2 uppercase tracking-[0.2em]">Most Played</div>
                    <div className="text-lg font-bold text-white mb-1 truncate uppercase">
                      {mostPlayedGame?.name || 'None'}
                    </div>
                    <div className="text-[#00FF84] text-[10px] uppercase font-bold">
                      {mostPlayedGame ? formatPlaytime(mostPlayedGame.playtime_forever) : '0h'}
                    </div>
                  </div>
                </div>
              )}

              {/* Games Library */}
              {gamesLoading ? (
                <div className="text-center py-12">
                  <Loader2 className="animate-spin h-12 w-12 text-[#00FF84] mx-auto mb-4" />
                  <p className="text-zinc-500 uppercase text-xs tracking-widest">Loading games...</p>
                </div>
              ) : games && games.games && games.games.length > 0 ? (
                <div className="bg-black border border-[#00FF84]/20 rounded-none p-6">
                  <h2 className="text-2xl font-bold text-white mb-4 uppercase italic flex items-center gap-2">
                    <Gamepad2 className="text-[#00FF84]" /> Game Library
                  </h2>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {games.games
                      .sort((a, b) => (b.playtime_forever || 0) - (a.playtime_forever || 0))
                      .slice(0, 20)
                      .map((game) => (
                        <div
                          key={game.appid}
                          className="bg-black rounded-none overflow-hidden border border-[#00FF84]/10 hover:border-[#00FF84]/50 transition-all group"
                        >
                          <div className="aspect-[460/215] relative overflow-hidden">
                            <img
                              src={`https://cdn.cloudflare.steamstatic.com/steam/apps/${game.appid}/header.jpg`}
                              alt={game.name}
                              className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500"
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/460x215/000000/00FF84?text=ERROR';
                              }}
                            />
                            {game.playtime_forever > 0 && (
                              <div className="absolute bottom-0 left-0 right-0 bg-black/80 p-2 border-t border-[#00FF84]/20">
                                <div className="text-[#00FF84] text-[10px] font-bold uppercase tracking-widest">
                                  {formatPlaytime(game.playtime_forever)}
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="p-2">
                            <h4 className="text-white text-[10px] font-bold line-clamp-2 uppercase">
                              {game.name}
                            </h4>
                          </div>
                        </div>
                      ))}
                  </div>

                  {games.games.length > 20 && (
                    <p className="text-zinc-500 text-[10px] mt-4 text-center uppercase tracking-[0.3em]">
                      Showing top 20 most played games
                    </p>
                  )}
                </div>
              ) : (
                <div className="bg-black border border-[#00FF84]/20 rounded-none p-8 text-center">
                  <p className="text-zinc-500 uppercase text-xs tracking-widest">No games found in library</p>
                </div>
              )}
            </>
          )}

        </div>
      </div>
    </Layout>
  );
}

export default FriendProfile;