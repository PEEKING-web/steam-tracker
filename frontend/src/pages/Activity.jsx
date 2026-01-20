import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { getRecentGames, getWeeklyPlaytime, getAchievements } from '../services/api';
import { getSessions } from '../services/api';

function Activity() {
  const [recentGames, setRecentGames] = useState(null);
  const [weeklyStats, setWeeklyStats] = useState(null);
  const [achievements, setAchievements] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState([]);


  useEffect(() => {
    fetchActivityData();
  }, []);

  useEffect(() => {
  fetchSessions();
}, []);

const fetchSessions = async () => {
  try {
    setLoading(true);
    const data = await getSessions();
    setSessions(data.sessions || []);
  } catch (error) {
    console.error('Failed to fetch sessions:', error);
  } finally {
    setLoading(false);
  }
};

  const fetchActivityData = async () => {
    try {
      setLoading(true);

      const [recentData, weeklyData, achievementsData] = await Promise.all([
        getRecentGames(),
        getWeeklyPlaytime(),
        getAchievements()
      ]);

      setRecentGames(recentData);
      setWeeklyStats(weeklyData);
      setAchievements(achievementsData);
    } catch (error) {
      console.error('Failed to fetch activity data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown';
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00FF84] mx-auto mb-4"></div>
            <p className="text-[#71717A] font-mono text-xs uppercase tracking-widest">Accessing activity logs...</p>
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
          <div className="mb-6">
            <h1 className="text-4xl font-bold text-[#EDEDED] mb-2 font-mono tracking-tighter uppercase">Recent_Activity</h1>
            <p className="text-[#71717A] font-mono text-xs uppercase tracking-widest">Bi-weekly telemetry reports</p>
          </div>

          {/* Weekly Stats Summary */}
          {weeklyStats && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#0b0f14] rounded-lg p-6 border border-white/5">
                <div className="text-[#71717A] text-[10px] font-mono mb-2 uppercase tracking-widest">Weekly_Playtime</div>
                <div className="text-4xl font-bold text-[#EDEDED] mb-1 font-mono tracking-tighter">
                  {weeklyStats.weeklyPlaytimeHours || 0}
                </div>
                <div className="text-[#00FF84] text-[9px] font-mono uppercase tracking-tight opacity-70">Hours_Logged</div>
              </div>

              <div className="bg-[#0b0f14] rounded-lg p-6 border border-white/5">
                <div className="text-[#71717A] text-[10px] font-mono mb-2 uppercase tracking-widest">Games_Played</div>
                <div className="text-4xl font-bold text-[#EDEDED] mb-1 font-mono tracking-tighter">
                  {weeklyStats.gamesPlayedCount || 0}
                </div>
                <div className="text-[#00FF84] text-[9px] font-mono uppercase tracking-tight opacity-70">Active_Sectors</div>
              </div>

              <div className="bg-[#0b0f14] rounded-lg p-6 border border-white/5">
                <div className="text-[#71717A] text-[10px] font-mono mb-2 uppercase tracking-widest">Daily_Average</div>
                <div className="text-4xl font-bold text-[#EDEDED] mb-1 font-mono tracking-tighter">
                  {((weeklyStats.weeklyPlaytimeHours || 0) / 14).toFixed(1)}
                </div>
                <div className="text-[#00FF84] text-[9px] font-mono uppercase tracking-tight opacity-70">Cycle_Intensity</div>
              </div>
            </div>
          )}

          {/* Recent Games */}
          {recentGames && recentGames.games && recentGames.games.length > 0 ? (
            <div className="bg-[#060606] rounded-lg p-6 border border-white/10">
              <h2 className="text-xs font-mono font-bold text-[#EDEDED] mb-6 uppercase tracking-[0.3em]">🎮 Recent_Uplinks</h2>
              
              <div className="space-y-4">
                {recentGames.games.map((game) => (
                  <div
                    key={game.appid}
                    className="bg-[#0b0f14] rounded-lg p-4 border border-white/5 hover:border-[#00FF84]/30 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      
                      {/* Game Image */}
                      <div className="w-32 h-16 rounded overflow-hidden flex-shrink-0 border border-white/5 bg-black">
                        <img
                          src={`https://cdn.cloudflare.steamstatic.com/steam/apps/${game.appid}/header.jpg`}
                          alt={game.name}
                          className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/120x60/000000/00FF84?text=NULL';
                          }}
                        />
                      </div>

                      {/* Game Info */}
                      <div className="flex-1 min-w-0 font-mono">
                        <h3 className="text-[#EDEDED] font-bold text-sm uppercase tracking-tight group-hover:text-[#00FF84] transition-colors">{game.name}</h3>
                        <div className="flex flex-wrap gap-4 text-[10px] uppercase mt-1">
                          <div>
                            <span className="text-[#71717A]">2_Week_Log: </span>
                            <span className="text-[#00FF84]">
                              {game.playtime_2weeks || 0}m
                              <span className="opacity-50 ml-1">[{((game.playtime_2weeks || 0) / 60).toFixed(1)}h]</span>
                            </span>
                          </div>
                          <div>
                            <span className="text-[#71717A]">Lifetime: </span>
                            <span className="text-[#EDEDED]">
                              {Math.floor(game.playtime_forever / 60).toLocaleString()}h
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-[#060606] rounded-lg p-8 text-center border border-dashed border-white/10">
              <p className="text-[#71717A] font-mono text-[10px] uppercase tracking-widest">No activity detected in current cycle</p>
            </div>
          )}

          {/* Weekly Playtime Breakdown */}
          {weeklyStats && weeklyStats.gamesPlayed && weeklyStats.gamesPlayed.length > 0 && (
            <div className="bg-[#060606] rounded-lg p-6 border border-white/10">
              <h2 className="text-xs font-mono font-bold text-[#EDEDED] mb-6 uppercase tracking-[0.3em]">📊 Resource_Allocation</h2>
              
              <div className="space-y-4">
                {weeklyStats.gamesPlayed.map((game, index) => {
                  const percentage = weeklyStats.weeklyPlaytimeHours > 0 
                    ? (game.playtimeHours / weeklyStats.weeklyPlaytimeHours * 100).toFixed(1)
                    : 0;

                  return (
                    <div key={index} className="bg-[#0b0f14] rounded-lg p-4 border border-white/5">
                      <div className="flex justify-between items-center mb-2 font-mono text-[11px] uppercase tracking-tighter">
                        <span className="text-[#EDEDED] font-bold">{game.name}</span>
                        <span className="text-[#00FF84]">{game.playtimeHours}h</span>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="h-1 bg-black rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#00FF84] transition-all duration-1000 shadow-[0_0_8px_rgba(0,255,132,0.4)]"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      
                      <div className="flex justify-between items-center mt-2 text-[9px] font-mono text-[#71717A] uppercase">
                        <span>Concentration: {percentage}%</span>
                        <span>Archive_Total: {game.totalPlaytimeHours}h</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Recent Achievements */}
          {achievements && achievements.achievements && achievements.achievements.length > 0 ? (
            <div className="bg-[#060606] rounded-lg p-6 border border-white/10">
              <h2 className="text-xs font-mono font-bold text-[#EDEDED] mb-6 uppercase tracking-[0.3em]">🏆 Decrypted_Milestones</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.achievements.slice(0, 10).map((achievement, index) => (
                  <div 
                    key={index}
                    className="bg-[#0b0f14] p-4 rounded-lg border border-white/5 hover:border-[#00FF84]/20 transition-all group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-black border border-white/5 rounded flex items-center justify-center flex-shrink-0 grayscale group-hover:grayscale-0 transition-all">
                        <span className="text-xl">🏅</span>
                      </div>
                      <div className="flex-1 min-w-0 font-mono">
                        <h4 className="font-bold text-[#EDEDED] text-[11px] uppercase truncate mb-1 group-hover:text-[#00FF84] transition-colors">{achievement.name}</h4>
                        <p className="text-[#71717A] text-[10px] mb-2 line-clamp-2 italic">{achievement.description}</p>
                        <div className="flex items-center justify-between text-[9px] uppercase tracking-tighter font-bold">
                          <p className="text-[#00FF84]/70">{achievement.gameName}</p>
                          <p className="text-[#71717A]">{formatDate(achievement.unlockTime)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-[#060606] rounded-lg p-10 text-center border border-dashed border-white/10">
              <p className="text-[#71717A] font-mono text-[10px] uppercase">Null achievements detected</p>
            </div>
          )}
            <div className="mt-8">
  <h2 className="text-xs font-mono font-bold text-[#EDEDED] mb-6 uppercase tracking-[0.3em]">
    🎮 Session_Logs
  </h2>

  {loading ? (
    <div className="text-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#00FF84] mx-auto mb-4"></div>
      <p className="text-[#71717A] font-mono text-[10px] uppercase">Retrieving buffers...</p>
    </div>
  ) : sessions.length > 0 ? (
    <div className="space-y-4">
      {sessions
        .slice()
        .reverse()
        .map(session => (
          <div
            key={session.id}
            className="bg-[#0b0f14] rounded-lg p-5 border border-white/5 hover:border-[#00FF84]/20 transition-all group"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="font-mono">
                <h3 className="text-sm font-bold text-[#EDEDED] uppercase tracking-tight group-hover:text-[#00FF84] transition-colors">
                  {session.gameName}
                </h3>
                <p className="text-[#71717A] text-[10px] uppercase mt-1">
                  Neural_State: <span className="text-[#EDEDED]">{session.mood}</span>
                </p>
              </div>

              <div className="text-[10px] font-mono text-[#00FF84] bg-[#00FF84]/5 px-3 py-1 rounded border border-[#00FF84]/20 uppercase">
                {session.durationMinutes
                  ? `${session.durationMinutes} MIN_LOGGED`
                  : 'ACTIVE_PROCESS'}
              </div>
            </div>

            {session.notes && (
              <p className="mt-4 text-[#71717A] text-[11px] font-mono bg-black/40 p-3 rounded border border-white/5 italic">
                &gt; {session.notes}
              </p>
            )}

            <p className="mt-3 text-[9px] font-mono text-[#71717A] uppercase tracking-tighter">
              Timestamp: {new Date(session.startTime).toLocaleString()}
            </p>
          </div>
        ))}
    </div>
  ) : (
    <div className="bg-[#060606] rounded-lg p-10 text-center border border-dashed border-white/10 font-mono">
      <p className="text-[#71717A] text-[10px] uppercase tracking-widest">
        Zero session logs found in primary partition
      </p>
      <p className="text-[#00FF84]/50 text-[9px] mt-2 uppercase">
        Initialize session from node to record data
      </p>
    </div>
  )}
</div>

        </div>
      </div>
    </Layout>
  );
}

export default Activity;