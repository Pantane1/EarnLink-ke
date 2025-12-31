
import React from 'react';
import { ICONS } from '../constants';
import { Twitter, Facebook, MessageCircle, Github, Linkedin } from 'lucide-react';

interface FooterProps {
  setView: (view: any) => void;
}

const Footer: React.FC<FooterProps> = ({ setView }) => {
  return (
    <footer className="relative mt-20 border-t border-white/5 bg-emerald-950/40 pt-16 pb-8 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[100px] pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-emerald-500 p-1 rounded-md text-emerald-950">
                {ICONS.Wallet}
              </div>
              <span className="font-black text-xl tracking-tighter text-white uppercase">EarnLink</span>
            </div>
            <p className="text-sm text-emerald-100/40 leading-relaxed mb-6">
              Empowering Kenyans through transparent referral systems and instant M-Pesa payouts.
            </p>
            <div className="flex gap-4">
              <a href="https://x.com/pantane4" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-emerald-400 transition-colors"><Twitter className="w-5 h-5" /></a>
              <a href="https://web.facebook.com/profile.php?id=100095346974516" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-emerald-400 transition-colors"><Facebook className="w-5 h-5" /></a>
              <a href="https://github.com/pantane1" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-emerald-400 transition-colors"><Github className="w-5 h-5" /></a>
              <a href="https://www.linkedin.com/in/pantane/" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-emerald-400 transition-colors"><Linkedin className="w-5 h-5" /></a>
            </div>
          </div>

          {/* Links Column */}
          <div>
            <h4 className="text-sm font-black text-white uppercase tracking-widest mb-6">Platform</h4>
            <ul className="space-y-4">
              <li><button onClick={() => setView('landing')} className="text-sm text-emerald-100/40 hover:text-emerald-400 transition-colors">Home</button></li>
              <li><button onClick={() => setView('how-it-works')} className="text-sm text-emerald-100/40 hover:text-emerald-400 transition-colors">How it Works</button></li>
              <li><button onClick={() => setView('auth')} className="text-sm text-emerald-100/40 hover:text-emerald-400 transition-colors">Get Started</button></li>
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h4 className="text-sm font-black text-white uppercase tracking-widest mb-6">Support</h4>
            <ul className="space-y-4">
              <li><button onClick={() => setView('privacy')} className="text-sm text-emerald-100/40 hover:text-emerald-400 transition-colors text-left">Privacy Policy</button></li>
              <li><button onClick={() => setView('terms')} className="text-sm text-emerald-100/40 hover:text-emerald-400 transition-colors text-left">Terms of Use</button></li>
              <li><button onClick={() => setView('contact')} className="text-sm text-emerald-100/40 hover:text-emerald-400 transition-colors text-left">Contact Us</button></li>
            </ul>
          </div>

          {/* Status Column */}
          <div>
            <h4 className="text-sm font-black text-white uppercase tracking-widest mb-6">Network</h4>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-bold text-emerald-400">System Live</span>
              </div>
              <p className="text-[10px] text-white/30 font-mono">Uptime: 99.98%</p>
              <p className="text-[10px] text-white/30 font-mono mt-1">API v2.5.0-native</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">
            &copy; 2025 EARNLINK KENYA. ALL RIGHTS RESERVED.
          </p>
          <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] flex items-center gap-1">
            Made with <span className="text-emerald-500">♥</span> for Nairobi
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
