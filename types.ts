
export enum TransactionType {
  TOP_UP = 'top-up',
  WITHDRAW = 'withdraw',
  REFERRAL = 'referral'
}

export enum TransactionStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILED = 'failed'
}

export interface User {
  id: string;
  username: string;
  phone: string;
  email?: string;
  avatar?: string;
  referralCode: string;
  referrerId?: string;
  balance: number;
  totalEarned: number;
  createdAt: number;
}

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  phone: string;
  status: TransactionStatus;
  timestamp: number;
  description: string;
}

export interface ReferralNode {
  username: string;
  level: number;
  joinedAt: number;
}

export interface AppState {
  currentUser: User | null;
  transactions: Transaction[];
  referrals: ReferralNode[];
  isAuthenticating: boolean;
  isAdmin: boolean;
}
