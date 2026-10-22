export type TransactionType = 'TOPUP' | 'TRANSFER' | 'GAME_REWARD' | 'VOUCHER_REDEMPTION' | 'SCAN_PAY' | 'ADMIN_ADJUSTMENT' | 'COIN_WITHDRAW' | 'COIN_DEPOSIT';

export type TransactionStatus = 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'REFUNDED';

export interface LedgerEntry {
  id: string;
  userId: string;
  type: TransactionType;
  amountCents: number; // in integer sen (e.g. RM 50.00 = 5000)
  feeCents: number;
  status: TransactionStatus;
  timestamp: string;
  refNumber: string;
  title: string;
  description: string;
  recipient?: string;
  sender?: string;
  paymentProofUrl?: string;
  bankAccount?: string;
  rejectionReason?: string;
  adminAuditNote?: string;
}

export interface TopupRequest {
  id: string;
  userId: string;
  userName: string;
  amountMYR: number;
  bankName: 'CIMB Bank' | 'TNG DuitNow';
  accountNumber: string;
  refNumber: string;
  status: TransactionStatus;
  createdAt: string;
  proofImageUrl?: string;
  adminNote?: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface RewardCoinRecord {
  id: string;
  amount: number;
  type: 'EARNED' | 'SPENT' | 'EXPIRED';
  source: string;
  timestamp: string;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  rewardCoins: number;
  progress: number;
  target: number;
  completed: boolean;
  claimed: boolean;
  category: 'DAILY' | 'GAME' | 'WALLET' | 'SPECIAL';
}

export interface Voucher {
  id: string;
  title: string;
  brand: string;
  category: 'BILL' | 'FOOD' | 'TELCO' | 'GAME';
  discountText: string;
  coinCost: number;
  claimed: boolean;
  code?: string;
  expiryDate: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  verified: boolean;
  cashBalanceCents: number; // e.g. 15000 = RM 150.00
  rewardCoins: number;
  avatar: string;
  memberTier: 'Bronze' | 'Silver' | 'Gold' | 'VIP Diamond';
  joinedDate: string;
  dailyStreak: number;
  lastCheckIn?: string;
}

export interface AdminRole {
  role: 'Super Admin' | 'Finance Admin' | 'Game Manager' | 'Customer Support' | 'Auditor';
  permissions: string[];
}
