export type UserRole = 'subscriber' | 'admin' | 'public';

export type SubscriptionPlan = 'monthly' | 'yearly';

export type SubscriptionStatus = 'active' | 'inactive' | 'lapsed' | 'cancelled';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  avatarUrl?: string;
  handicap?: number;
  homeClub?: string;
  createdAt: string;
}

export interface Subscription {
  id: string;
  userId: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  amount: number; // e.g., $19/mo, $190/yr
  charityPercentage: number; // minimum 10%
  charityId: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  stripeSubscriptionId?: string;
}

export interface GolfScore {
  id: string;
  userId: string;
  score: number; // Stableford format 1 - 45
  playedAt: string; // YYYY-MM-DD, unique per user
  courseName?: string;
  createdAt: string;
}

export interface CharityEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
}

export interface Charity {
  id: string;
  name: string;
  slug: string;
  category: 'Youth & Sports' | 'Health & Oncology' | 'Environment & Oceans' | 'Veteran Welfare' | 'Community & Education';
  tagline: string;
  description: string;
  mission: string;
  logoUrl: string;
  bannerUrl: string;
  totalRaised: number;
  targetGoal: number;
  websiteUrl: string;
  events: CharityEvent[];
  featured?: boolean;
}

export type DrawType = 'random' | 'algorithmic';
export type DrawStatus = 'draft' | 'simulated' | 'published';

export interface Draw {
  id: string;
  drawNumber: number;
  monthYear: string; // e.g. "March 2026"
  drawType: DrawType;
  winningNumbers: number[]; // 5 unique numbers (1-45)
  totalPool: number;
  pool5Match: number; // 40% + rollover
  pool4Match: number; // 35%
  pool3Match: number; // 25%
  rolloverIn: number; // brought from previous unclaimed 5-match jackpot
  rolloverOut: number; // if 5-match has 0 winners, carried to next
  status: DrawStatus;
  simulatedAt?: string;
  publishedAt?: string;
  createdAt: string;
}

export type MatchTier = 3 | 4 | 5;
export type VerificationStatus = 'none' | 'pending' | 'approved' | 'rejected';
export type PayoutStatus = 'pending' | 'paid';

export interface DrawWinner {
  id: string;
  drawId: string;
  userId: string;
  userName: string;
  userEmail: string;
  matchedNumbers: number[];
  matchTier: MatchTier;
  prizeAmount: number;
  proofImageUrl?: string;
  proofSubmittedAt?: string;
  verificationStatus: VerificationStatus;
  payoutStatus: PayoutStatus;
  verifiedAt?: string;
  paidAt?: string;
  adminNotes?: string;
}

export interface Donation {
  id: string;
  userId?: string;
  charityId: string;
  charityName: string;
  donorName: string;
  donorEmail: string;
  amount: number;
  isIndependent: boolean;
  createdAt: string;
}

export interface DrawSimulationResult {
  drawId: string;
  drawNumber: number;
  monthYear: string;
  drawType: DrawType;
  winningNumbers: number[];
  totalPool: number;
  rolloverIn: number;
  pool5Match: number;
  pool4Match: number;
  pool3Match: number;
  tier5Winners: DrawWinner[];
  tier4Winners: DrawWinner[];
  tier3Winners: DrawWinner[];
  tier5PerWinner: number;
  tier4PerWinner: number;
  tier3PerWinner: number;
  rolloverOut: number;
  totalWinnersCount: number;
}
