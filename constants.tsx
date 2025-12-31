
import React from 'react';
import { 
  Wallet, 
  Users, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Share2, 
  TrendingUp, 
  History, 
  Settings, 
  LogOut,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const COLORS = {
  mpesaGreen: '#00B050',
  deepGreen: '#064e3b',
  lightGreen: '#10b981',
  errorRed: '#ef4444',
};

export const PRICING = {
  SIGN_UP_FEE: 250,
  NEW_USER_BONUS: 50,
  DIRECT_REFERRAL: 100,
  INDIRECT_REFERRAL: 50,
  MIN_WITHDRAWAL: 200,
};

export const ICONS = {
  Wallet: <Wallet className="w-5 h-5" />,
  Users: <Users className="w-5 h-5" />,
  Withdraw: <ArrowUpRight className="w-5 h-5" />,
  Deposit: <ArrowDownLeft className="w-5 h-5" />,
  Share: <Share2 className="w-5 h-5" />,
  Stats: <TrendingUp className="w-5 h-5" />,
  History: <History className="w-5 h-5" />,
  Settings: <Settings className="w-5 h-5" />,
  LogOut: <LogOut className="w-5 h-5" />,
  ArrowRight: <ChevronRight className="w-5 h-5" />,
  Admin: <ShieldCheck className="w-5 h-5" />,
  Success: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
  Error: <AlertCircle className="w-5 h-5 text-red-400" />,
};
