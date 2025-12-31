
import React from 'react';
import { ICONS } from '../constants';

interface LandingPageProps {
  onStart: () => void;
  onHowItWorks: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart, onHowItWorks }) => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center max-w-4xl mx-auto py-20">
      <div className="mb-8 px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20 flex items-center gap-2 text-xs font-black tracking-[0.2em] uppercase">
        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
        Kenyan Referral Network
      </div>
      
      <h1 className="text-5xl md:text-8xl font-black mb-8 tracking-tighter leading-[0.9] text-white">
        Turn Your <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-br from-emerald-400 via-emerald-200 to-white">
          Network Into Cash.
        </span>
      </h1>
      
      <p className="text-lg md:text-xl text-emerald-100/60 mb-12 max-w-xl leading-relaxed">
        The most transparent referral ecosystem in Kenya. 
        Instant M-Pesa payouts, multi-level rewards, and a growing community.
      </p>

      <div className="flex flex-col sm:flex-row gap-5">
        <button 
          onClick={onStart}
          className="px-10 py-5 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black rounded-2xl shadow-2xl shadow-emerald-500/20 transition-all active:scale-95 flex items-center justify-center gap-3 group text-lg"
        >
          Start Earning
          <span className="group-hover:translate-x-1 transition-transform">{ICONS.ArrowRight}</span>
        </button>
        <button 
          onClick={onHowItWorks}
          className="px-10 py-5 glass-card hover:bg-white/10 text-white font-black rounded-2xl transition-all border border-white/10 text-lg"
        >
          How it Works
        </button>
      </div>

      <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-12 w-full">
        {[
          { label: 'Users', value: '12,400+' },
          { label: 'Paid Out', value: 'KES 4.2M' },
          { label: 'Referrals', value: '45,000+' },
          { label: 'Uptime', value: '99.9%' },
        ].map(stat => (
          <div key={stat.label} className="text-center">
            <div className="text-3xl font-black text-white mb-1">{stat.value}</div>
            <div className="text-[10px] text-emerald-400/50 uppercase font-black tracking-widest">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LandingPage;
