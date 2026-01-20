import { useState, useEffect } from 'react';
import { getGameAchievements } from '../services/api';
import AddToCategoryModal from './AddToCategoryModal';
import { startSession, endSession } from '../services/api';


function GameDetailsModal({ game, onClose }) {
  const [achievements, setAchievements] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddToCategory, setShowAddToCategory] = useState(false);
  const [activeSession, setActiveSession] = useState(null);
  const [mood, setMood] = useState('Focused');
  const [notes, setNotes] = useState('');
  const [sessionLoading, setSessionLoading] = useState(false);


  useEffect(() => {
    fetchAchievements();
  }, [game.appid]);

  const handleStartSession = async () => {
  try {
    setSessionLoading(true);
    const res = await startSession({
      appid: game.appid,
      gameName: game.name,
      mood,
      notes
    });
    setActiveSession(res.session);
  } catch (error) {
    console.error('Failed to start session:', error);
  } finally {
    setSessionLoading(false);
  }
};

const handleEndSession = async () => {
  try {
    setSessionLoading(true);
    await endSession(activeSession.id);
    setActiveSession(null);
    setNotes('');
  } catch (error) {
    console.error('Failed to end session:', error);
  } finally {
    setSessionLoading(false);
  }
};



  const fetchAchievements = async () => {
    try {
      setLoading(true);
      const data = await getGameAchievements(game.appid);
      setAchievements(data.achievements || []);
    } catch (error) {
      console.error('Failed to fetch achievements:', error);
      setAchievements([]);
    } finally {
      setLoading(false);
    }
  };

  const formatPlaytime = (minutes) => {
    if (!minutes) return '0h 0m';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const unlockedAchievements = achievements?.filter(a => a.achieved === 1) || [];
  const lockedAchievements = achievements?.filter(a => a.achieved === 0) || [];
  const completionRate = achievements?.length > 0 
    ? ((unlockedAchievements.length / achievements.length) * 100).toFixed(1)
    : 0;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4 font-mono" onClick={onClose}>
      <div 
        className="bg-[#0b0f14] rounded-none max-w-4xl w-full max-h-[90vh] overflow-hidden border border-[#00FF84]/30 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header with Game Banner */}
        <div className="relative h-48 overflow-hidden border-b border-[#00FF84]/20">
          <img
            src={`https://cdn.cloudflare.steamstatic.com/steam/apps/${game.appid}/library_hero.jpg`}
            alt={game.name}
            className="w-full h-full object-cover opacity-50 grayscale hover:grayscale-0 transition-all duration-500"
            onError={(e) => {
              e.target.src = `https://cdn.cloudflare.steamstatic.com/steam/apps/${game.appid}/header.jpg`;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f14] to-transparent"></div>
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-black border border-[#00FF84]/20 text-[#00FF84] hover:bg-[#00FF84] hover:text-black transition-all flex items-center justify-center text-xl"
          >
            ×
          </button>

          {/* Game Title */}
          <div className="absolute bottom-4 left-6 right-6">
            <h2 className="text-3xl font-bold text-[#EDEDED] uppercase tracking-tighter mb-1">{game.name}</h2>
            <div className="flex items-center gap-4 text-[#71717A] text-[10px] uppercase tracking-widest">
              <span>Time_Logged: {formatPlaytime(game.playtime_forever)}</span>
              <span className="text-[#00FF84]/30">|</span>
              <span>ID: {game.appid}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-12rem)] scrollbar-hide">
          
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-8">
            <div className="bg-black/40 p-3 border border-white/5">
              <div className="text-[#71717A] text-[9px] uppercase tracking-widest mb-1">Total_Runtime</div>
              <div className="text-[#EDEDED] text-sm font-bold">{formatPlaytime(game.playtime_forever)}</div>
            </div>
            
            <div className="bg-black/40 p-3 border border-white/5">
              <div className="text-[#71717A] text-[9px] uppercase tracking-widest mb-1">Recent_Activity</div>
              <div className="text-[#EDEDED] text-sm font-bold">{formatPlaytime(game.playtime_2weeks || 0)}</div>
            </div>

            {achievements && achievements.length > 0 && (
              <>
                <div className="bg-black/40 p-3 border border-white/5">
                  <div className="text-[#71717A] text-[9px] uppercase tracking-widest mb-1">Objectives</div>
                  <div className="text-[#EDEDED] text-sm font-bold">{unlockedAchievements.length}/{achievements.length}</div>
                </div>

                <div className="bg-black/40 p-3 border border-white/5">
                  <div className="text-[#71717A] text-[9px] uppercase tracking-widest mb-1">Sync_Rate</div>
                  <div className="text-[#00FF84] text-sm font-bold">{completionRate}%</div>
                </div>
              </>
            )}
          </div>

          {/* Achievements Section */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin h-8 w-8 border-2 border-[#00FF84] border-t-transparent mx-auto mb-4"></div>
              <p className="text-[#71717A] text-xs uppercase tracking-[0.3em]">Downloading_Manifest...</p>
            </div>
          ) : achievements && achievements.length > 0 ? (
            <>
              {/* Completion Progress Bar */}
              <div className="mb-8 bg-black/20 p-4 border border-white/5">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[#EDEDED] text-[10px] uppercase tracking-widest font-bold">Progress_Vector</span>
                  <span className="text-[#00FF84] text-[10px] font-bold">{completionRate}%</span>
                </div>
                <div className="h-1 bg-white/5 overflow-hidden">
                  <div 
                    className="h-full bg-[#00FF84] shadow-[0_0_10px_#00FF84] transition-all duration-1000"
                    style={{ width: `${completionRate}%` }}
                  ></div>
                </div>
              </div>

              {/* Unlocked Achievements */}
              {unlockedAchievements.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-[11px] font-bold text-[#00FF84] uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                    <span>[+]</span> Decrypted_Objectives ({unlockedAchievements.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {unlockedAchievements.slice(0, 6).map((achievement, index) => (
                      <div 
                        key={index}
                        className="bg-black/40 p-3 border border-[#00FF84]/10 group hover:border-[#00FF84]/30 transition-colors"
                      >
                      <div className="flex items-start gap-3">
                          <div className="w-10 h-10 overflow-hidden flex-shrink-0 grayscale group-hover:grayscale-0 transition-all">
                                  <img
                                    src={achievement.icon}
                                    alt={achievement.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src = achievement.icongray;
                                    }}
                                  />
                                </div>

                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-[#EDEDED] text-[10px] uppercase truncate">
                              {achievement.name || achievement.apiname}
                            </h4>
                            <p className="text-[#71717A] text-[9px] uppercase leading-tight line-clamp-2 mt-1">
                              {achievement.description || 'Data encrypted by developer'}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {unlockedAchievements.length > 6 && (
                    <p className="text-[#3F3F46] text-[9px] uppercase mt-3 text-center tracking-widest">
                      -- {unlockedAchievements.length - 6} Additional records hidden --
                    </p>
                  )}
                </div>
              )}

              {/* Locked Achievements */}
              {lockedAchievements.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-[11px] font-bold text-[#71717A] uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                    <span>[-]</span> Encrypted_Objectives ({lockedAchievements.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {lockedAchievements.slice(0, 4).map((achievement, index) => (
                      <div 
                        key={index}
                        className="bg-black/20 p-3 border border-white/5 opacity-40"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-[#1a1a1a] flex items-center justify-center flex-shrink-0 text-[10px]">
                            [X]
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-[#71717A] text-[10px] uppercase truncate">
                              {achievement.name || achievement.apiname}
                            </h4>
                            <p className="text-[#3F3F46] text-[9px] uppercase line-clamp-1 mt-1">
                              Target_Locked
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12 border border-dashed border-white/5">
              <p className="text-[#3F3F46] text-[10px] uppercase tracking-widest">No achievement data present in node</p>
            </div>
          )}

          {/* Action Section */}
          <div className="mt-6 pt-6 border-t border-white/5">
            <div className="space-y-4">

              {!activeSession ? (
                <>
                  <button
                    onClick={() => setShowAddToCategory(true)}
                    className="w-full py-2 bg-transparent hover:bg-white/5 text-[#EDEDED] text-[10px] font-bold uppercase tracking-widest border border-white/10 transition-all"
                  >
                    [Link_To_Partition]
                  </button>

                  <div className="bg-black/60 p-4 border border-[#00FF84]/10 space-y-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-[#71717A] text-[9px] uppercase tracking-widest">Cognitive_State:</label>
                      <select
                        value={mood}
                        onChange={(e) => setMood(e.target.value)}
                        className="w-full bg-black text-[#00FF84] text-[10px] uppercase p-2 border border-white/10 focus:border-[#00FF84]/50 outline-none"
                      >
                        <option>Focused</option>
                        <option>Chill</option>
                        <option>Competitive</option>
                        <option>Tilted</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-[#71717A] text-[9px] uppercase tracking-widest">Log_Entry:</label>
                      <textarea
                        placeholder="Optional session telemetry..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full bg-black text-[#EDEDED] text-[10px] uppercase p-2 border border-white/10 focus:border-[#00FF84]/50 outline-none min-h-[60px] resize-none"
                      />
                    </div>

                    <button
                      onClick={handleStartSession}
                      disabled={sessionLoading}
                      className="w-full py-3 bg-[#00FF84] hover:bg-[#00FF84]/80 text-black font-bold text-[10px] uppercase tracking-[0.2em] transition-all disabled:opacity-30"
                    >
                      {sessionLoading ? 'Initializing...' : 'Initialize_Session'}
                    </button>
                  </div>
                </>
              ) : (
                <button
                  onClick={handleEndSession}
                  disabled={sessionLoading}
                  className="w-full py-3 bg-red-900/20 border border-red-500/50 hover:bg-red-900/40 text-red-500 font-bold text-[10px] uppercase tracking-[0.2em] transition-all"
                >
                  {sessionLoading ? 'Terminating...' : 'Terminate_Active_Session'}
                </button>
              )}

              <a
                href={`steam://run/${game.appid}`}
                className="block w-full py-3 bg-black border border-[#00FF84] text-[#00FF84] hover:bg-[#00FF84] hover:text-black text-center font-bold text-[10px] uppercase tracking-[0.3em] transition-all"
              >
                Execute_Application
              </a>
            </div>
          </div>

        </div>
        {showAddToCategory && (
          <AddToCategoryModal
            game={game}
            onClose={() => setShowAddToCategory(false)}
          />
        )}

      </div>
    </div>
    
  );
}



export default GameDetailsModal;