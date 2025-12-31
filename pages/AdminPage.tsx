
import React, { useState, useEffect } from 'react';
import { api } from '../services/mockService';
import { User, Transaction, TransactionStatus, TransactionType } from '../types';
import { ICONS } from '../constants';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

interface AdminPageProps {
  onLogout: () => void;
}

const AdminPage: React.FC<AdminPageProps> = ({ onLogout }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'withdrawals' | 'users'>('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = () => {
      setUsers(api.getAllUsers());
      setTransactions(api.getAllTransactions());
      setLoading(false);
    };
    fetchData();

    // Simulate Realtime Subscriptions
    const interval = setInterval(() => {
      setUsers(api.getAllUsers());
      setTransactions(api.getAllTransactions());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const pendingWithdrawals = transactions.filter(t => t.type === TransactionType.WITHDRAW && t.status === TransactionStatus.PENDING);
  const totalPool = transactions
    .filter(t => t.type === TransactionType.TOP_UP && t.status === TransactionStatus.SUCCESS)
    .reduce((acc, curr) => acc + curr.amount, 0);
  const totalPaidOut = transactions
    .filter(t => t.type === TransactionType.WITHDRAW && t.status === TransactionStatus.SUCCESS)
    .reduce((acc, curr) => acc + curr.amount, 0);

  const chartData = [
    { name: 'Income', amount: totalPool, color: '#10b981' },
    { name: 'Paid Out', amount: totalPaidOut, color: '#ef4444' },
    { name: 'Balance', amount: totalPool - totalPaidOut, color: '#3b82f6' },
  ];

  const handleApprove = async (id: string) => {
    await api.approveWithdrawal(id);
    setTransactions(api.getAllTransactions());
  };

  const handleDeny = async (id: string) => {
    await api.denyWithdrawal(id);
    setTransactions(api.getAllTransactions());
  };

  return (
    <div className="p-6 md:p-12">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-white mb-2">Admin Dashboard</h1>
          <p className="text-emerald-500 font-mono text-sm">SYSTEM LIVE STATUS: OPERATIONAL</p>
        </div>
        <button onClick={onLogout} className="px-6 py-3 glass-card rounded-xl font-bold flex items-center gap-2 text-white/60 hover:text-red-400 transition-colors">
          {ICONS.LogOut} Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="glass-card p-8 rounded-3xl border border-emerald-500/20 shadow-xl shadow-emerald-500/5">
          <p className="text-xs uppercase tracking-[0.2em] font-bold text-emerald-400/60 mb-2">Total Users</p>
          <h2 className="text-4xl font-black">{users.length}</h2>
        </div>
        <div className="glass-card p-8 rounded-3xl border border-emerald-500/20 shadow-xl shadow-emerald-500/5">
          <p className="text-xs uppercase tracking-[0.2em] font-bold text-emerald-400/60 mb-2">Total Pool</p>
          <h2 className="text-4xl font-black">KES {totalPool.toLocaleString()}</h2>
        </div>
        <div className="glass-card p-8 rounded-3xl border border-emerald-500/20 shadow-xl shadow-emerald-500/5">
          <p className="text-xs uppercase tracking-[0.2em] font-bold text-emerald-400/60 mb-2">System Revenue</p>
          <h2 className="text-4xl font-black text-blue-400">KES {(totalPool * 0.4).toLocaleString()}</h2>
        </div>
        <div className="glass-card p-8 rounded-3xl border border-emerald-500/20 shadow-xl shadow-emerald-500/5">
          <p className="text-xs uppercase tracking-[0.2em] font-bold text-emerald-400/60 mb-2">Pending Cash-out</p>
          <h2 className="text-4xl font-black text-yellow-400">{pendingWithdrawals.length}</h2>
        </div>
      </div>

      <div className="flex gap-4 mb-8">
        {['overview', 'withdrawals', 'users'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-6 py-3 rounded-xl font-bold capitalize transition-all ${activeTab === tab ? 'bg-emerald-500 text-emerald-950 shadow-lg' : 'glass-card text-white/60 hover:text-white'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 glass-card p-8 rounded-3xl">
            <h3 className="text-xl font-bold mb-8">Cashflow Summary</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" />
                  <YAxis stroke="rgba(255,255,255,0.3)" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#064e3b', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Bar dataKey="amount">
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-card p-8 rounded-3xl flex flex-col">
            <h3 className="text-xl font-bold mb-6">Recent Sign-ups</h3>
            <div className="space-y-4 flex-1 overflow-y-auto max-h-[400px] custom-scrollbar">
              {users.slice(-10).reverse().map(u => (
                <div key={u.id} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl">
                  <div className="w-10 h-10 bg-emerald-500 text-emerald-950 rounded-full flex items-center justify-center font-black">
                    {u.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-sm">{u.username}</p>
                    <p className="text-xs text-white/40">{u.phone}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'withdrawals' && (
        <div className="glass-card rounded-3xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-emerald-400">User</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-emerald-400">Amount</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-emerald-400">Phone</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-emerald-400">Status</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-emerald-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {transactions.filter(t => t.type === TransactionType.WITHDRAW).reverse().map(tx => (
                <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-bold">
                    {users.find(u => u.id === tx.userId)?.username || 'Unknown'}
                  </td>
                  <td className="px-6 py-4 text-red-400 font-bold">KES {tx.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 text-white/60 font-mono">{tx.phone}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      tx.status === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 
                      tx.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400 animate-pulse' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {tx.status === TransactionStatus.PENDING && (
                      <div className="flex gap-2 justify-end">
                        <button 
                          onClick={() => handleApprove(tx.id)}
                          className="px-4 py-2 bg-emerald-500 text-emerald-950 rounded-lg text-xs font-bold hover:bg-emerald-400 transition-all active:scale-95"
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => handleDeny(tx.id)}
                          className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg text-xs font-bold hover:bg-red-500 transition-all active:scale-95 border border-red-500/20"
                        >
                          Deny
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {transactions.filter(t => t.type === TransactionType.WITHDRAW).length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-white/20 italic">No withdrawal requests found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="glass-card rounded-3xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-emerald-400">Username</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-emerald-400">Phone</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-emerald-400">Balance</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-emerald-400">Total Earned</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-emerald-400">Code</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-bold">{u.username}</td>
                  <td className="px-6 py-4 text-white/60 font-mono">{u.phone}</td>
                  <td className="px-6 py-4 font-bold text-emerald-400">KES {u.balance.toLocaleString()}</td>
                  <td className="px-6 py-4 font-bold">KES {u.totalEarned.toLocaleString()}</td>
                  <td className="px-6 py-4 text-xs font-mono text-white/40">{u.referralCode}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
