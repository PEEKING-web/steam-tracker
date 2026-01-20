import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: '/profile', label: 'PROFILE', icon: '[USR]' },
    { path: '/games', label: 'GAMES', icon: '[GAM]' },
    { path: '/friends', label: 'FRIENDS', icon: '[NET]' },
    { path: '/activity', label: 'ACTIVITY', icon: '[LOG]' },
    { path: '/categories', label: 'CATEGORIES', icon: '[CAT]' },
    { path: '/achievements', label: 'ACHIEVEMENTS', icon: '[ACH]' }
  ];

  return (
    <nav className="bg-[#060606] border-b border-white/10 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to="/profile" className="flex items-center gap-2 group">
            <span className="text-xl font-bold text-[#EDEDED] font-mono tracking-tighter">
              <span className="text-[#00FF84]">&gt;_</span>STEAM<span className="text-[#00FF84] drop-shadow-[0_0_5px_#00FF84]">TRACKER</span>
            </span>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg font-mono text-xs transition-all duration-200 ${
                  isActive(link.path)
                    ? 'bg-transparent text-[#00FF84] border border-[#00FF84] shadow-[0_0_10px_rgba(0,255,132,0.2)]'
                    : 'text-[#A1A1AA] hover:text-[#EDEDED] border border-transparent hover:border-white/20'
                }`}
              >
                <span className={`mr-1 ${isActive(link.path) ? 'text-[#00FF84]' : 'text-[#71717A]'}`}>
                  {link.icon}
                </span>
                {link.label}
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3">
              <img
                src={user.avatar}
                alt={user.displayName}
                className="w-9 h-9 rounded-lg border border-white/20"
              />
              <span className="text-[#EDEDED] font-mono text-xs font-medium tracking-tight">
                {user.displayName}
              </span>
            </div>
            <button
              onClick={logout}
              className="px-4 py-1.5 border border-white/20 hover:border-[#00FF84] hover:text-[#00FF84] text-[#A1A1AA] rounded-lg font-mono text-xs transition-all duration-200"
            >
              [LOGOUT]
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden pb-3 flex gap-2 overflow-x-auto no-scrollbar">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-3 py-1.5 rounded-lg font-mono whitespace-nowrap text-[10px] border transition-all ${
                isActive(link.path)
                  ? 'bg-transparent text-[#00FF84] border-[#00FF84] shadow-[0_0_8px_rgba(0,255,132,0.2)]'
                  : 'text-[#71717A] bg-[#0b0f14] border-white/5'
              }`}
            >
              <span className="mr-1">{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;