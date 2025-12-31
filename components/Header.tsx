
import React from 'react';
import { User } from '../types';
import { ICONS } from '../constants';
import AnimatedNumber from './AnimatedNumber';

interface HeaderProps {
  user: User | null;
  currentView: string;
  setView: (view: any) => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, currentView, setView, onLogout }) => {
  return (
    <header className="sticky top-0 z-[100] w-full border-b border-white/5 bg-emerald-950/60 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <button 
            onClick={() => setView(user ? 'dashboard' : 'landing')}
            className="flex items-center gap-2 group transition-transform active:scale-95"
          >
            <div className="bg-emerald-500 p-1.5 rounded-lg text-emerald-950 shadow-lg shadow-emerald-500/20 group-hover:rotate-12 transition-transform">
              {ICONS.Wallet}
            </div>
            <span className="font-black text-lg tracking-tighter text-white hidden sm:block">
              EARNLINK <span className="text-emerald-500">KE</span>
            </span>
          </button>

          {/* Navigation */}
          <nav className="flex items-center gap-1 sm:gap-4">
            {!user ? (
              <>
                <button 
                  onClick={() => setView('how-it-works')}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${currentView === 'how-it-works' ? 'text-emerald-400 bg-emerald-400/10' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
                >
                  How it Works
                </button>
                <button 
                  onClick={() => setView('auth')}
                  className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold rounded-xl text-sm shadow-lg shadow-emerald-500/10 active:scale-95 transition-all"
                >
                  Join
                </button>
              </>
            ) : (
              <div className="flex items-center gap-3 sm:gap-6">
                {/* Dashboard Link (Mobile icon) */}
                <button 
                  onClick={() => setView('dashboard')}
                  className={`p-2 rounded-xl transition-all ${currentView === 'dashboard' ? 'text-emerald-400 bg-emerald-400/10' : 'text-white/40 hover:text-white'}`}
                  title="Dashboard"
                >
                  {ICONS.Stats}
                </button>

                {/* Animated Balance in Header */}
                <div className="hidden md:flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10">
                  <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Balance</span>
                  <span className="text-sm font-bold text-white">
                    KES <AnimatedNumber value={user.balance} />
                  </span>
                </div>

                {/* Profile/Logout */}
                <div className="flex items-center gap-2 pl-2 border-l border-white/10">
                  <div className="hidden lg:block text-right">
                    <p className="text-xs font-bold text-white leading-none">{user.username}</p>
                    <p className="text-[10px] text-emerald-400/60 font-mono">#{user.id.slice(0, 4)}</p>
                  </div>
                  <button 
                    onClick={onLogout}
                    className="p-2 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                    title="Logout"
                  >
                    {ICONS.LogOut}
                  </button>
                </div>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
