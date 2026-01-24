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

  // --- CUSTOM CSS FOR ANIMATIONS ---
  const customStyles = `
    @keyframes scanline {
      0% { transform: translateY(-100%); }
      100% { transform: translateY(100%); }
    }
    .bg-grid-perspective {
      background-size: 50px 50px;
      background-image: 
        linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
      mask-image: linear-gradient(to bottom, black 40%, transparent 100%);
      transform: perspective(500px) rotateX(60deg);
      transform-origin: top center;
    }
  `;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030303] flex flex-col items-center justify-center relative overflow-hidden">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-[#00FF84]/20 border-t-[#00FF84] rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-[#00FF84]/10 rounded-full animate-pulse"></div>
          </div>
        </div>
        <div className="mt-6 font-mono text-[#00FF84] text-xs tracking-[0.4em] uppercase animate-pulse">
          Establishing Uplink...
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{customStyles}</style>
      <div className="min-h-screen bg-[#030303] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden selection:bg-[#00FF84] selection:text-black">
        
        {/* --- BACKGROUND FX --- */}
        <div className="absolute inset-0 pointer-events-none z-20 opacity-[0.03] bg-gradient-to-b from-transparent via-white to-transparent h-full w-full" style={{ animation: 'scanline 8s linear infinite' }}></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,255,132,0.08),transparent_70%)] z-0 pointer-events-none"></div>
        <div className="absolute bottom-[-20%] left-[-50%] right-[-50%] h-[50vh] bg-grid-perspective z-0 pointer-events-none opacity-40"></div>

        {/* --- MAIN CONTENT CONTAINER --- */}
        <div className="max-w-4xl w-full relative z-10 flex flex-col items-center">
          
          {/* Header Section */}
          <div className="text-center mb-16 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#00FF84]/20 bg-[#00FF84]/5 text-[#00FF84] text-[10px] font-mono tracking-widest uppercase mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00FF84] animate-pulse"></span>
              System v2.0 Online
            </div>

            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter font-mono text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-200 to-gray-500 drop-shadow-2xl">
              STEAM<span className="text-transparent bg-clip-text bg-gradient-to-b from-[#00FF84] to-[#00aa55]">TRACKER</span>
            </h1>
            
            <p className="text-gray-400 font-mono text-sm tracking-[0.2em] max-w-lg mx-auto border-t border-b border-gray-800 py-3">
              YOUR GAMING JOURNEY // <span className="text-white">QUANTIFIED</span>
            </p>
          </div>

          {/* Holographic Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full mb-16 px-4 md:px-0">
            {[
              { icon: "server", title: "LIBRARY UPLINK", desc: "Sync your entire Steam catalog via encrypted API tunnels." },
              { icon: "activity", title: "LIVE TELEMETRY", desc: "Real-time peer status monitoring and playtime analytics." },
              { icon: "award", title: "ACHIEVEMENT NODES", desc: "Milestone extraction and global ranking visualization." }
            ].map((item, i) => (
              <div key={i} className="group relative bg-black/40 backdrop-blur-md border border-white/10 p-8 rounded-sm hover:border-[#00FF84]/50 transition-all duration-500 overflow-hidden hover:-translate-y-1">
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-[#00FF84]/10 rounded-full blur-3xl group-hover:bg-[#00FF84]/20 transition-all duration-500"></div>
                <div className="relative z-10">
                  <div className="text-[#00FF84] mb-4 opacity-80 group-hover:opacity-100 transition-opacity">
                    {/* SVG Icons */}
                    {item.icon === 'server' && <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" /></svg>}
                    {item.icon === 'activity' && <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
                    {item.icon === 'award' && <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>}
                  </div>
                  <h3 className="text-white font-mono font-bold text-xs tracking-widest mb-3 group-hover:text-[#00FF84] transition-colors">{item.title}</h3>
                  <p className="text-gray-500 font-mono text-[11px] leading-relaxed">{item.desc}</p>
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-[#00FF84]/30 group-hover:border-[#00FF84] transition-colors"></div>
              </div>
            ))}
          </div>

          {/* Action Area */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#00FF84] to-emerald-600 rounded blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
            <button
              onClick={login}
              className="relative px-12 py-5 bg-black rounded leading-none flex items-center gap-4 border border-[#00FF84]/30 hover:border-[#00FF84] transition-all duration-300"
            >
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#00FF84]/10 text-[#00FF84]">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                </svg>
              </span>
              <div className="text-left">
                <div className="text-[#00FF84] font-bold font-mono text-sm tracking-[0.2em] uppercase">Initialize Session</div>
                <div className="text-[#00FF84]/50 text-[10px] font-mono">Secure Steam Auth Protocol</div>
                <div className="text-[#00FF84]/50 text-[10px] font-mono">LOG IN USING STEAM</div>
              </div>
            </button>
          </div>

          {/* --- UPDATED WARNING SECTION --- */}
          <div className="mt-16 w-full max-w-xl px-4">
            <div className="bg-[#080808] border border-yellow-500/20 rounded-md p-6 font-mono relative group hover:border-yellow-500/50 transition-colors shadow-[0_0_30px_rgba(234,179,8,0.05)]">
              
              {/* Fake Window Controls */}
              <div className="flex gap-2 mb-4 border-b border-white/5 pb-3 items-center">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/70"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/70"></div>
                <span className="ml-auto text-xs text-yellow-500/70 tracking-widest uppercase font-bold">⚠️ SYSTEM ALERT</span>
              </div>
              
              {/* Content */}
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row md:gap-4 md:items-center text-sm">
                  <span className="text-yellow-400 font-bold tracking-wider shrink-0 uppercase mb-1 md:mb-0">
                    Warning:
                  </span>
                  <span className="text-gray-300">
                    Are you using <strong>Brave Browser</strong>?
                  </span>
                </div>
                
                <div className="p-3 bg-yellow-500/5 rounded border-l-2 border-yellow-500/50">
                  <p className="text-yellow-100/80 text-sm leading-relaxed">
                    Shields may block the login popup.
                  </p>
                  <p className="text-[#00FF84] mt-2 text-sm font-bold tracking-wide">
                     &gt; FIX: Turn Shields OFF for this site.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
        
        {/* Footer */}
        <div className="absolute bottom-4 text-center w-full">
            <p className="text-[10px] text-gray-800 font-mono">STEAMTRACKER CORP © 2026 // ALL RIGHTS RESERVED</p>
        </div>
      </div>
    </>
  );
}

export default Landing;