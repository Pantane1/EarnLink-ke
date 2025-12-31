
import React, { useState, useEffect } from 'react';
import { User, Transaction, TransactionStatus } from '../types';
import { api, ReferralTreeNode } from '../services/mockService';
import { ICONS, PRICING } from '../constants';
import { ListSkeleton } from '../components/Skeleton';
import ReferralTree from '../components/ReferralTree';
import AnimatedNumber from '../components/AnimatedNumber';
import { X } from 'lucide-react';

interface DashboardProps {
  user: User;
  onNavigateWithdraw: () => void;
  onLogout: () => void;
  addToast: (msg: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onNavigateWithdraw, onLogout, addToast }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [referralTree, setReferralTree] = useState<ReferralTreeNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFullTree, setShowFullTree] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const txs = api.getTransactions(user.id);
      const tree = api.getReferralTree(user.id);
      setTransactions(txs);
      setReferralTree(tree);
      setLoading(false);
    };
    loadData();
  }, [user.id]);

  const copyReferralLink = () => {
    const url = `${window.location.origin}${window.location.pathname}?ref=${user.referralCode}`;
    navigator.clipboard.writeText(url);
    addToast("Referral link copied to clipboard!");
  };

  const totalDirectCount = referralTree.length;

  return (
    <div className="max-w-2xl mx-auto p-4 pt-8 md:pt-12 pb-24 space-y-6">
      {/* User Greeting (Minimal) */}
      <div className="mb-2">
        <h1 className="text-2xl font-black text-white">Dashboard</h1>
        <p className="text-xs text-emerald-500/60 uppercase tracking-widest font-black">Account Overview</p>
      </div>

      {/* Balance Card */}
      <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-[2.5rem] p-8 md:p-10 shadow-2xl shadow-emerald-500/20 text-emerald-950 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-20 transform group-hover:scale-110 transition-transform">
          <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4V6h16v12zm-3-1h2v-2h-2v2zm-4 0h2v-2h-2v2zm-4 0h2v-2H9v2z" />
          </svg>
        </div>
        <div className="relative z-10">
          <p className="text-sm font-black opacity-60 uppercase tracking-widest mb-1">Total Balance</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black">KES</span>
            <h2 className="text-6xl font-black">
              <AnimatedNumber value={user.balance} />
            </h2>
          </div>
          <div className="mt-10 flex gap-4">
            <button 
              onClick={onNavigateWithdraw}
              className={`flex-1 py-4 px-6 rounded-2xl font-black flex items-center justify-center gap-2 transition-all shadow-xl active:scale-95 ${user.balance >= PRICING.MIN_WITHDRAWAL ? 'bg-emerald-950 text-emerald-400 hover:bg-black' : 'bg-emerald-950/40 text-emerald-400/40 cursor-not-allowed'}`}
              disabled={user.balance < PRICING.MIN_WITHDRAWAL}
            >
              {ICONS.Withdraw} Withdraw
            </button>
            <button className="p-4 bg-emerald-950/10 text-emerald-950 rounded-2xl hover:bg-emerald-950/20 transition-all">
              {ICONS.Stats}
            </button>
          </div>
        </div>
      </div>

      {/* Referral Link */}
      <div className="glass-card p-6 rounded-[1.5rem] flex items-center justify-between gap-4 border border-emerald-500/10">
        <div className="flex-1 min-w-0">
          <p className="text-[10px] text-emerald-400/60 uppercase font-black mb-1 tracking-widest">Share & Earn</p>
          <p className="text-sm font-mono truncate bg-black/40 p-2 px-3 rounded-lg text-emerald-200">{user.referralCode}</p>
        </div>
        <button 
          onClick={copyReferralLink}
          className="bg-emerald-500 p-4 rounded-xl text-emerald-950 hover:bg-emerald-400 active:scale-95 transition-all shadow-lg shadow-emerald-500/10"
        >
          {ICONS.Share}
        </button>
      </div>

      {/* Referral Visual Tree */}
      <div className="glass-card rounded-[1.5rem] p-8 overflow-hidden border border-white/5">
        <div className="flex justify-between items-center mb-8">
          <h3 className="font-black flex items-center gap-2 text-white uppercase text-sm tracking-widest">
            {ICONS.Users} Network
          </h3>
          <span className="text-[10px] px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full font-black uppercase tracking-widest">
            {totalDirectCount} Directs
          </span>
        </div>
        
        {loading ? (
          <ListSkeleton />
        ) : referralTree.length > 0 ? (
          <div className="relative">
            <ReferralTree tree={referralTree} maxDirects={3} />
            
            {totalDirectCount > 3 && (
              <div className="mt-8 pt-8 border-t border-white/5">
                <button 
                  onClick={() => setShowFullTree(true)}
                  className="w-full py-4 glass-card hover:bg-white/10 text-emerald-400 font-black rounded-2xl transition-all flex items-center justify-center gap-2 border border-emerald-500/20 uppercase text-xs tracking-widest"
                >
                  View Full Network {ICONS.ArrowRight}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 px-4 rounded-[2rem] bg-white/5 border border-dashed border-white/10">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-white/20">
              {ICONS.Users}
            </div>
            <p className="text-sm text-emerald-100/40 mb-2 font-bold">Your network is empty</p>
            <p className="text-xs text-emerald-100/20 italic">The fastest way to grow is to share your link!</p>
          </div>
        )}
      </div>

      {/* Transaction History */}
      <div className="glass-card rounded-[1.5rem] p-8 border border-white/5">
        <h3 className="font-black mb-8 flex items-center gap-2 text-white uppercase text-sm tracking-widest">
          {ICONS.History} Activity
        </h3>
        
        {loading ? (
          <ListSkeleton />
        ) : transactions.length > 0 ? (
          <div className="space-y-8">
            {transactions.map(tx => (
              <div key={tx.id} className="flex items-start gap-4">
                <div className={`p-3 rounded-2xl ${
                  tx.type === 'withdraw' ? 'bg-red-500/10 text-red-400' : 
                  tx.type === 'referral' ? 'bg-emerald-500/10 text-emerald-400' :
                  'bg-blue-500/10 text-blue-400'
                }`}>
                  {tx.type === 'withdraw' ? ICONS.Withdraw : tx.type === 'referral' ? ICONS.Users : ICONS.Deposit}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-sm text-white">{tx.description}</p>
                      <p className="text-[10px] text-white/40 uppercase tracking-widest font-black">{new Date(tx.timestamp).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-black ${tx.type === 'withdraw' ? 'text-red-400' : 'text-emerald-400'}`}>
                        {tx.type === 'withdraw' ? '-' : '+'} {tx.amount}
                      </p>
                      <span className={`text-[10px] uppercase tracking-widest font-black ${
                        tx.status === 'success' ? 'text-emerald-500' : 
                        tx.status === 'pending' ? 'text-yellow-500 animate-pulse' : 'text-red-500'
                      }`}>
                        {tx.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-white/20 italic text-sm font-bold">
            No activity yet.
          </div>
        )}
      </div>

      {/* Full Tree Modal */}
      {showFullTree && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-emerald-950/90 backdrop-blur-xl" onClick={() => setShowFullTree(false)}></div>
          <div className="relative w-full max-w-2xl max-h-[85vh] overflow-hidden glass-card rounded-[3rem] flex flex-col shadow-2xl border border-white/10 animate-in zoom-in-95 duration-300">
            <div className="p-10 border-b border-white/10 flex justify-between items-center">
              <div>
                <h3 className="text-3xl font-black text-white">Network Tree</h3>
                <p className="text-xs text-emerald-400/60 uppercase tracking-[0.2em] font-black mt-1">Multi-Level Earnings</p>
              </div>
              <button 
                onClick={() => setShowFullTree(false)}
                className="p-4 hover:bg-white/10 rounded-full transition-all text-white/40 hover:text-white"
              >
                <X className="w-8 h-8" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
              <ReferralTree tree={referralTree} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
