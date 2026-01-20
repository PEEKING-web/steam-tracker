import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function Landing() {
  const { authenticated, login, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (authenticated) {
      navigate('/profile');
    }
  }, [authenticated, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#000000]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00FF84] shadow-[0_0_15px_rgba(0,255,132,0.3)]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#000000] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        {/* Logo/Title */}
        <div className="mb-12">
          <h1 className="text-6xl font-bold text-[#EDEDED] mb-4 tracking-tighter font-mono">
            STEAM<span className="text-[#00FF84] drop-shadow-[0_0_10px_rgba(0,255,132,0.5)]">TRACKER</span>
          </h1>
          <p className="text-[#A1A1AA] text-lg font-mono">
            [ SYSTEM ONLINE ] Track your gaming journey. Analyze stats.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-[#060606] p-6 rounded-lg border border-white/10 hover:border-[#00FF84]/30 transition-colors group">
            <div className="text-3xl mb-3 grayscale group-hover:grayscale-0 transition-all">🎮</div>
            <h3 className="font-bold text-[#EDEDED] mb-2 font-mono text-sm uppercase tracking-wider">Library</h3>
            <p className="text-[#71717A] text-xs leading-relaxed">View all your games and playtime stats via secure uplink.</p>
          </div>
          <div className="bg-[#060606] p-6 rounded-lg border border-white/10 hover:border-[#00FF84]/30 transition-colors group">
            <div className="text-3xl mb-3 grayscale group-hover:grayscale-0 transition-all">👥</div>
            <h3 className="font-bold text-[#EDEDED] mb-2 font-mono text-sm uppercase tracking-wider">Network</h3>
            <p className="text-[#71717A] text-xs leading-relaxed">Monitor real-time status of your peer connections.</p>
          </div>
          <div className="bg-[#060606] p-6 rounded-lg border border-white/10 hover:border-[#00FF84]/30 transition-colors group">
            <div className="text-3xl mb-3 grayscale group-hover:grayscale-0 transition-all">🏆</div>
            <h3 className="font-bold text-[#EDEDED] mb-2 font-mono text-sm uppercase tracking-wider">Nodes</h3>
            <p className="text-[#71717A] text-xs leading-relaxed">Extract and track gaming milestones across sectors.</p>
          </div>
        </div>

        {/* Login Button */}
        <button
          onClick={login}
          className="group relative inline-flex items-center gap-3 bg-transparent border border-[#00FF84] text-[#00FF84] font-bold py-4 px-10 rounded-lg transition-all hover:bg-[#00FF84]/10 shadow-[0_0_15px_rgba(0,255,132,0.1)] hover:shadow-[0_0_25px_rgba(0,255,132,0.2)] font-mono uppercase tracking-widest text-sm"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
          </svg>
          Establish Connection
        </button>

        <p className="text-[#71717A] text-[10px] mt-8 font-mono uppercase tracking-[0.2em]">
          Auth_Protocol: Steam OpenID v2.0
        </p>
      </div>
    </div>
  );
}

export default Landing;