import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import { 
  getTotalPlaytime, 
  getSteamLevel, 
  getOwnedGames,
  getAchievements 
} from '../services/api';

function Profile() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [level, setLevel] = useState(null);
  const [games, setGames] = useState(null);
  const [achievements, setAchievements] = useState(null);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);

      const [playtimeData, levelData, gamesData, achievementsData] = await Promise.all([
        getTotalPlaytime(),
        getSteamLevel(),
        getOwnedGames(),
        getAchievements()
      ]);

      setStats(playtimeData);
      setLevel(levelData);
      setGames(gamesData);
      setAchievements(achievementsData);
    } catch (error) {
      console.error('Failed to fetch profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#00FF84] mx-auto mb-4 shadow-[0_0_15px_rgba(0,255,132,0.2)]"></div>
            <p className="text-[#A1A1AA] font-mono text-lg tracking-widest uppercase">Initializing Sync...</p>
          </div>
        </div>
      </Layout>
    );
  }

  const onlineStatus = user.personaState === 1 ? 'Online' : 'Offline';
  const statusColor = user.personaState === 1 ? 'bg-[#00FF84]' : 'bg-[#71717A]';

  return (
    <Layout>
      <div className="p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Profile Header */}
          <div className="bg-[#060606] rounded-lg p-6 md:p-8 border border-white/10 shadow-xl relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10">
              {/* Avatar */}
              <div className="relative">
                <img
                  src={user.avatar}
                  alt={user.displayName}
                  className="w-32 h-32 rounded-lg border border-white/20 shadow-[0_0_20px_rgba(0,0,0,0.5)]"
                />
                <div className={`absolute -bottom-2 -right-2 w-6 h-6 ${statusColor} rounded-full border-4 border-[#060606] shadow-[0_0_10px_rgba(0,255,132,0.3)]`}></div>
              </div>

              {/* User Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-4xl font-bold text-[#EDEDED] mb-2 font-mono tracking-tighter uppercase">{user.displayName}</h1>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-[#A1A1AA] mb-4 font-mono text-sm">
                  <span className="flex items-center gap-2">
                    <div className={`w-2 h-2 ${statusColor} rounded-full`}></div>
                    {onlineStatus}
                  </span>
                  <span className="opacity-20">•</span>
                  <span>Level {level?.level || 0}</span>
                  <span className="opacity-20">•</span>
                  <span className="text-[#71717A] text-xs">ID: {user.steamId}</span>
                </div>

                {user.profileUrl && (
                  <a
                    href={user.profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[#00FF84] hover:text-[#00FF84]/80 transition-all font-mono text-xs uppercase border border-[#00FF84]/20 px-3 py-1 rounded"
                  >
                    View Steam Profile →
                  </a>
                )}

              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Games */}
            <div className="bg-[#0b0f14] rounded-lg p-6 border border-white/5 hover:border-[#00FF84]/20 transition-colors group">
              <div className="text-[#71717A] text-xs font-mono font-medium mb-2 uppercase tracking-widest">Total Games</div>
              <div className="text-4xl font-bold text-[#EDEDED] mb-1 font-mono tracking-tighter group-hover:text-[#00FF84] transition-colors">
                {stats?.totalGames || 0}
              </div>
              <div className="text-[#00FF84] text-[10px] font-mono opacity-60 uppercase">In your library</div>
            </div>

            {/* Total Playtime */}
            <div className="bg-[#0b0f14] rounded-lg p-6 border border-white/5 hover:border-[#00FF84]/20 transition-colors group">
              <div className="text-[#71717A] text-xs font-mono font-medium mb-2 uppercase tracking-widest">Total Playtime</div>
              <div className="text-4xl font-bold text-[#EDEDED] mb-1 font-mono tracking-tighter group-hover:text-[#00FF84] transition-colors">
                {stats?.totalPlaytimeHours?.toLocaleString() || 0}
              </div>
              <div className="text-[#00FF84] text-[10px] font-mono opacity-60 uppercase">Hours played</div>
            </div>

            {/* Account Level */}
            <div className="bg-[#0b0f14] rounded-lg p-6 border border-white/5 hover:border-[#00FF84]/20 transition-colors group">
              <div className="text-[#71717A] text-xs font-mono font-medium mb-2 uppercase tracking-widest">Steam Level</div>
              <div className="text-4xl font-bold text-[#EDEDED] mb-1 font-mono tracking-tighter group-hover:text-[#00FF84] transition-colors">
                {level?.level || 0}
              </div>
              <div className="text-[#00FF84] text-[10px] font-mono opacity-60 uppercase">Account level</div>
            </div>

            {/* Days Played */}
            <div className="bg-[#0b0f14] rounded-lg p-6 border border-white/5 hover:border-[#00FF84]/20 transition-colors group">
              <div className="text-[#71717A] text-xs font-mono font-medium mb-2 uppercase tracking-widest">Days Played</div>
              <div className="text-4xl font-bold text-[#EDEDED] mb-1 font-mono tracking-tighter group-hover:text-[#00FF84] transition-colors">
                {stats?.totalPlaytimeDays || 0}
              </div>
              <div className="text-[#00FF84] text-[10px] font-mono opacity-60 uppercase">Total days gaming</div>
            </div>
          </div>

          {/* Most Played Game */}
          {stats?.mostPlayedGame && (
            <div className="bg-[#060606] rounded-lg p-6 border border-white/10 border-l-4 border-l-[#00FF84]">
              <h2 className="text-xs font-mono font-bold text-[#EDEDED] mb-4 uppercase tracking-[0.3em]">🏆 Most Played Game</h2>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-[#EDEDED] font-mono">{stats.mostPlayedGame.name}</h3>
                  <p className="text-[#A1A1AA] font-mono text-sm mt-1">
                    <span className="text-[#00FF84]">{stats.mostPlayedGame.playtimeHours.toLocaleString()}</span> hours played
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Recent Achievements */}
          {achievements && achievements.achievements && achievements.achievements.length > 0 && (
            <div className="bg-[#060606] rounded-lg p-6 border border-white/10">
              <h2 className="text-xs font-mono font-bold text-[#EDEDED] mb-6 uppercase tracking-[0.3em]">🎯 Recent Achievements</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.achievements.slice(0, 6).map((achievement, index) => (
                  <div 
                    key={index}
                    className="bg-[#0b0f14] p-4 rounded-lg border border-white/5 hover:border-[#00FF84]/30 transition-all group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-[#00FF84]/5 rounded-lg border border-[#00FF84]/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl grayscale group-hover:grayscale-0 transition-all">🏅</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-[#EDEDED] truncate font-mono uppercase text-sm">{achievement.name}</h4>
                        <p className="text-[#71717A] text-xs mb-1 line-clamp-2 italic">{achievement.description}</p>
                        <p className="text-[#00FF84] text-[10px] font-mono uppercase tracking-tight opacity-70">{achievement.gameName}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No achievements message */}
          {achievements && achievements.achievements && achievements.achievements.length === 0 && (
            <div className="bg-[#060606] rounded-lg p-6 border border-white/10 text-center border-dashed">
              <p className="text-[#71717A] font-mono text-sm uppercase tracking-widest">No recent achievements found in database.</p>
            </div>
          )}

        </div>
      </div>
    </Layout>
  );
}

export default Profile;