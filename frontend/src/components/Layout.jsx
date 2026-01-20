import Navbar from './Navbar';
import GameChatbot from './GameChatbot';

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-[#000000] text-[#EDEDED] relative">
      {/* Refined Minimal Hacker Grid Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-[0.03]">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `linear-gradient(rgba(0, 255, 132, 0.1) 1px, transparent 1px), 
                              linear-gradient(90deg, rgba(0, 255, 132, 0.1) 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        ></div>
      </div>
      
      <Navbar />
      
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </main>
      
      <GameChatbot />
    </div>
  );
}

export default Layout;