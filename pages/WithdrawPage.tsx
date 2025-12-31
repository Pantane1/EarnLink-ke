
import React, { useState } from 'react';
import { User } from '../types';
import { api } from '../services/mockService';
import { ICONS, PRICING } from '../constants';

interface WithdrawPageProps {
  user: User;
  onBack: () => void;
  onSuccess: () => void;
  addToast: (msg: string, type?: 'success' | 'error') => void;
}

const WithdrawPage: React.FC<WithdrawPageProps> = ({ user, onBack, onSuccess, addToast }) => {
  const [amount, setAmount] = useState<string>('');
  const [phone, setPhone] = useState<string>(user.phone);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleRequest = async () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount < PRICING.MIN_WITHDRAWAL) {
      addToast(`Minimum withdrawal is KES ${PRICING.MIN_WITHDRAWAL}`, 'error');
      return;
    }
    if (numAmount > user.balance) {
      addToast("Insufficient balance", 'error');
      return;
    }
    setShowModal(true);
  };

  const confirmWithdrawal = async () => {
    setLoading(true);
    try {
      await api.requestWithdrawal(user.id, parseFloat(amount), phone);
      addToast(`Withdrawal of KES ${amount} initiated to ${phone}!`, 'success');
      onSuccess();
    } catch (err: any) {
      addToast(err.message || "Withdrawal failed", "error");
    } finally {
      setLoading(false);
      setShowModal(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 pt-12 min-h-screen flex flex-col">
      <button onClick={onBack} className="flex items-center gap-2 text-emerald-400 mb-8 font-bold hover:translate-x-[-4px] transition-transform">
        <span className="rotate-180">{ICONS.ArrowRight}</span>
        Back to Dashboard
      </button>

      <h1 className="text-4xl font-extrabold mb-2">Withdraw Cash</h1>
      <p className="text-emerald-400/60 mb-8">Fast, secure M-Pesa withdrawals</p>

      <div className="glass-card rounded-2xl p-8 space-y-6 flex-1">
        <div className="text-center p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
          <p className="text-xs text-emerald-400/60 uppercase font-bold mb-1 tracking-widest">Withdrawable Balance</p>
          <p className="text-3xl font-black">KES {user.balance.toLocaleString()}</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-emerald-200/70 ml-1">Amount to Withdraw (KES)</label>
            <input 
              type="number" 
              placeholder={`Min ${PRICING.MIN_WITHDRAWAL}`}
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-xl font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-emerald-400"
            />
          </div>

          <div className="flex gap-2">
            {[200, 500, 1000, 2000].map(val => (
              <button 
                key={val}
                onClick={() => setAmount(val.toString())}
                className="flex-1 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-bold border border-white/5 transition-colors"
              >
                {val}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-emerald-200/70 ml-1">M-Pesa Number</label>
            <input 
              type="tel" 
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            />
          </div>
        </div>

        <div className="pt-4">
          <button 
            onClick={handleRequest}
            disabled={!amount || parseFloat(amount) < PRICING.MIN_WITHDRAWAL || parseFloat(amount) > user.balance}
            className={`w-full py-4 rounded-xl font-black text-emerald-950 transition-all shadow-xl active:scale-95 ${
              !amount || parseFloat(amount) < PRICING.MIN_WITHDRAWAL || parseFloat(amount) > user.balance 
              ? 'bg-white/10 text-white/20 cursor-not-allowed' 
              : 'bg-emerald-500 hover:bg-emerald-400'
            }`}
          >
            Withdraw Now
          </button>
          <p className="text-[10px] text-center text-white/30 mt-4 uppercase tracking-[0.2em]">Transaction processed via Raja SDK</p>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-emerald-950/90 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="glass-card w-full max-w-sm rounded-3xl p-8 border border-white/20 shadow-2xl animate-in zoom-in-95 duration-300">
            <h3 className="text-2xl font-bold mb-4">Confirm Withdrawal</h3>
            <p className="text-emerald-100/70 mb-6 leading-relaxed">
              Are you sure you want to withdraw <span className="text-white font-bold">KES {amount}</span> to <span className="text-white font-bold">{phone}</span>?
            </p>
            
            <div className="space-y-3">
              <button 
                onClick={confirmWithdrawal}
                disabled={loading}
                className="w-full py-4 bg-emerald-500 text-emerald-950 font-bold rounded-xl active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                {loading && <div className="w-4 h-4 border-2 border-emerald-950 border-t-transparent rounded-full animate-spin"></div>}
                Confirm Send
              </button>
              <button 
                onClick={() => setShowModal(false)}
                disabled={loading}
                className="w-full py-4 glass-card text-white font-bold rounded-xl active:scale-95 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WithdrawPage;
