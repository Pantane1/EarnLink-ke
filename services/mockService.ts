
import { User, Transaction, TransactionType, TransactionStatus } from '../types.ts';
import { PRICING } from '../constants.tsx';
import { supabase, isSupabaseEnabled } from './supabase.ts';

const USERS_KEY = 'earnlink_users';
const TRANSACTIONS_KEY = 'earnlink_transactions';
const CURRENT_USER_KEY = 'earnlink_active_session';

export interface ReferralTreeNode extends User {
  children: ReferralTreeNode[];
}

class MockService {
  private users: User[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  private transactions: Transaction[] = JSON.parse(localStorage.getItem(TRANSACTIONS_KEY) || '[]');

  private persist() {
    localStorage.setItem(USERS_KEY, JSON.stringify(this.users));
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(this.transactions));
  }

  getCurrentUser(): User | null {
    const userId = localStorage.getItem(CURRENT_USER_KEY);
    return this.users.find(u => u.id === userId) || null;
  }

  getUserByEmail(email: string): User | null {
    return this.users.find(u => u.email === email) || null;
  }

  async loginAsAdmin(): Promise<boolean> {
    localStorage.setItem('earnlink_is_admin', 'true');
    return true;
  }

  /**
   * Syncs user to Supabase if configured.
   */
  private async syncToSupabase(user: User) {
    if (!isSupabaseEnabled() || !supabase) {
      return;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          username: user.username,
          phone: user.phone,
          email: user.email,
          avatar: user.avatar,
          referral_code: user.referralCode,
          balance: user.balance,
          total_earned: user.totalEarned,
          created_at: new Date(user.createdAt).toISOString()
        });
      if (error) console.error('Supabase Sync Error:', error.message);
    } catch (e) {
      console.warn('Supabase Sync: Network error. Local storage used.');
    }
  }

  async signUp(username: string, phone: string, email?: string, avatar?: string, refCode?: string): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 1500));

    const existingByPhone = this.users.find(u => u.phone === phone);
    if (existingByPhone) throw new Error("Phone number already registered.");

    const id = Math.random().toString(36).substr(2, 9);
    const referralCode = username.toLowerCase().replace(/\s+/g, '') + Math.floor(1000 + Math.random() * 9000);
    
    const referrer = refCode ? this.users.find(u => u.referralCode === refCode) : null;
    const grandReferrer = referrer?.referrerId ? this.users.find(u => u.id === referrer.referrerId) : null;

    const newUser: User = {
      id,
      username,
      phone,
      email,
      avatar,
      referralCode,
      referrerId: referrer?.id,
      balance: PRICING.NEW_USER_BONUS,
      totalEarned: PRICING.NEW_USER_BONUS,
      createdAt: Date.now()
    };

    this.users.push(newUser);

    this.addTransaction(id, TransactionType.TOP_UP, PRICING.NEW_USER_BONUS, phone, TransactionStatus.SUCCESS, "Welcome Bonus");

    if (referrer) {
      referrer.balance += PRICING.DIRECT_REFERRAL;
      referrer.totalEarned += PRICING.DIRECT_REFERRAL;
      this.addTransaction(referrer.id, TransactionType.REFERRAL, PRICING.DIRECT_REFERRAL, phone, TransactionStatus.SUCCESS, `Direct referral: ${username}`);
    }

    if (grandReferrer) {
      grandReferrer.balance += PRICING.INDIRECT_REFERRAL;
      grandReferrer.totalEarned += PRICING.INDIRECT_REFERRAL;
      this.addTransaction(grandReferrer.id, TransactionType.REFERRAL, PRICING.INDIRECT_REFERRAL, phone, TransactionStatus.SUCCESS, `Indirect referral from ${referrer?.username}`);
    }

    this.persist();
    this.syncToSupabase(newUser).catch(() => {});
    
    localStorage.setItem(CURRENT_USER_KEY, id);
    return newUser;
  }

  addTransaction(userId: string, type: TransactionType, amount: number, phone: string, status: TransactionStatus, description: string) {
    const tx: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      userId,
      type,
      amount,
      phone,
      status,
      timestamp: Date.now(),
      description
    };
    this.transactions.unshift(tx);
    this.persist();
    return tx;
  }

  getTransactions(userId: string): Transaction[] {
    return this.transactions.filter(t => t.userId === userId);
  }

  getAllTransactions(): Transaction[] {
    return this.transactions;
  }

  getAllUsers(): User[] {
    return this.users;
  }

  async requestWithdrawal(userId: string, amount: number, phone: string): Promise<Transaction> {
    const user = this.users.find(u => u.id === userId);
    if (!user) throw new Error("User not found");
    if (user.balance < amount) throw new Error("Insufficient balance");
    if (amount < PRICING.MIN_WITHDRAWAL) throw new Error(`Minimum withdrawal is KES ${PRICING.MIN_WITHDRAWAL}`);

    user.balance -= amount;
    const tx = this.addTransaction(userId, TransactionType.WITHDRAW, amount, phone, TransactionStatus.PENDING, "M-Pesa Withdrawal");
    this.persist();
    return tx;
  }

  async approveWithdrawal(txId: string): Promise<void> {
    const tx = this.transactions.find(t => t.id === txId);
    if (!tx) return;
    tx.status = TransactionStatus.SUCCESS;
    this.persist();
  }

  async denyWithdrawal(txId: string): Promise<void> {
    const tx = this.transactions.find(t => t.id === txId);
    if (!tx) return;
    tx.status = TransactionStatus.FAILED;
    
    const user = this.users.find(u => u.id === tx.userId);
    if (user) user.balance += tx.amount;
    
    this.persist();
  }

  getReferrals(userId: string): User[] {
    return this.users.filter(u => u.referrerId === userId);
  }

  getReferralTree(userId: string, depth = 2): ReferralTreeNode[] {
    const directs = this.users.filter(u => u.referrerId === userId);
    return directs.map(d => ({
      ...d,
      children: depth > 1 ? this.getReferralTree(d.id, depth - 1) : []
    }));
  }

  logout() {
    localStorage.removeItem(CURRENT_USER_KEY);
    localStorage.removeItem('earnlink_is_admin');
  }
  
  login(userId: string) {
    localStorage.setItem(CURRENT_USER_KEY, userId);
  }
}

export const api = new MockService();
