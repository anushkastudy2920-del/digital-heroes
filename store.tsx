'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  User,
  Subscription,
  GolfScore,
  Charity,
  Draw,
  DrawWinner,
  Donation,
  DrawType,
  DrawSimulationResult
} from '@/types';
import {
  INITIAL_CHARITIES,
  INITIAL_USERS,
  INITIAL_SUBSCRIPTIONS,
  INITIAL_SCORES,
  INITIAL_DRAWS,
  INITIAL_WINNERS,
  INITIAL_DONATIONS
} from './mock-data';
import {
  validateGolfScore,
  applyRollingFiveScoreRule,
  generateRandomDrawNumbers,
  generateAlgorithmicDrawNumbers,
  simulateMonthlyDraw
} from './engine';

interface AppContextType {
  currentUser: User | null;
  subscription: Subscription | null;
  scores: GolfScore[];
  charities: Charity[];
  draws: Draw[];
  winners: DrawWinner[];
  donations: Donation[];
  allUsers: User[];
  allSubscriptions: Subscription[];
  allScores: GolfScore[];
  activeSimulation: DrawSimulationResult | null;
  // Auth & Roles
  login: (email: string, password?: string) => Promise<boolean>;
  signup: (params: { fullName: string; email: string; charityId: string; plan: 'monthly' | 'yearly'; charityPercentage?: number }) => Promise<boolean>;
  logout: () => void;
  switchUser: (userId: string) => void;
  // Score Management
  addScore: (score: number, playedAt: string, courseName?: string) => { success: boolean; error?: string };
  updateScore: (scoreId: string, score: number, playedAt: string, courseName?: string) => { success: boolean; error?: string };
  deleteScore: (scoreId: string) => boolean;
  // Subscription & Charity
  updateSubscription: (params: { plan?: 'monthly' | 'yearly'; charityPercentage?: number; charityId?: string }) => void;
  toggleSubscriptionStatus: (status: 'active' | 'inactive' | 'lapsed' | 'cancelled') => void;
  makeDonation: (params: { charityId: string; amount: number; donorName: string; donorEmail: string; isIndependent?: boolean }) => void;
  // Draw Engine (Admin)
  runDrawSimulation: (drawType: DrawType) => DrawSimulationResult;
  publishCurrentDraw: (simulation: DrawSimulationResult) => boolean;
  // Winner Verification & Payouts
  submitWinnerProof: (winnerId: string, proofImageUrl: string, notes?: string) => boolean;
  verifyWinner: (winnerId: string, status: 'approved' | 'rejected', adminNotes?: string) => boolean;
  markPayoutPaid: (winnerId: string) => boolean;
  // Charity Management (Admin)
  addCharity: (charity: Omit<Charity, 'id' | 'totalRaised'>) => void;
  updateCharity: (charity: Charity) => void;
  deleteCharity: (charityId: string) => void;
  // Reset demo data
  resetToDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY_PREFIX = 'digital_heroes_data_v1';

export function AppProvider({ children }: { children: ReactNode }) {
  // Master lists
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(INITIAL_SUBSCRIPTIONS);
  const [scores, setScores] = useState<GolfScore[]>(INITIAL_SCORES);
  const [charities, setCharities] = useState<Charity[]>(INITIAL_CHARITIES);
  const [draws, setDraws] = useState<Draw[]>(INITIAL_DRAWS);
  const [winners, setWinners] = useState<DrawWinner[]>(INITIAL_WINNERS);
  const [donations, setDonations] = useState<Donation[]>(INITIAL_DONATIONS);
  
  // Active session
  const [currentUserId, setCurrentUserId] = useState<string>('user-alex'); // Default logged in as Alex Sterling (Subscriber)
  const [activeSimulation, setActiveSimulation] = useState<DrawSimulationResult | null>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Initialize from LocalStorage if available
  useEffect(() => {
    try {
      const storedUsers = localStorage.getItem(`${STORAGE_KEY_PREFIX}_users`);
      const storedSubs = localStorage.getItem(`${STORAGE_KEY_PREFIX}_subs`);
      const storedScores = localStorage.getItem(`${STORAGE_KEY_PREFIX}_scores`);
      const storedCharities = localStorage.getItem(`${STORAGE_KEY_PREFIX}_charities`);
      const storedDraws = localStorage.getItem(`${STORAGE_KEY_PREFIX}_draws`);
      const storedWinners = localStorage.getItem(`${STORAGE_KEY_PREFIX}_winners`);
      const storedDonations = localStorage.getItem(`${STORAGE_KEY_PREFIX}_donations`);
      const storedSession = localStorage.getItem(`${STORAGE_KEY_PREFIX}_session`);

      if (storedUsers) setUsers(JSON.parse(storedUsers));
      if (storedSubs) setSubscriptions(JSON.parse(storedSubs));
      if (storedScores) setScores(JSON.parse(storedScores));
      if (storedCharities) setCharities(JSON.parse(storedCharities));
      if (storedDraws) setDraws(JSON.parse(storedDraws));
      if (storedWinners) setWinners(JSON.parse(storedWinners));
      if (storedDonations) setDonations(JSON.parse(storedDonations));
      if (storedSession) setCurrentUserId(storedSession);
    } catch (e) {
      console.warn('LocalStorage not available or failed to parse, using memory state:', e);
    }
    setIsLoaded(true);
  }, []);

  // Save to LocalStorage whenever state changes
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}_users`, JSON.stringify(users));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}_subs`, JSON.stringify(subscriptions));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}_scores`, JSON.stringify(scores));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}_charities`, JSON.stringify(charities));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}_draws`, JSON.stringify(draws));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}_winners`, JSON.stringify(winners));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}_donations`, JSON.stringify(donations));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}_session`, currentUserId);
    } catch (e) {
      console.warn('Failed to persist to LocalStorage:', e);
    }
  }, [users, subscriptions, scores, charities, draws, winners, donations, currentUserId, isLoaded]);

  // Derived current user & subscription
  const currentUser = users.find(u => u.id === currentUserId) || null;
  const userSubscription = currentUser ? subscriptions.find(s => s.userId === currentUser.id) || null : null;
  const userScores = currentUser ? scores.filter(s => s.userId === currentUser.id) : [];

  // --------------------------------------------------------------------------
  // AUTH & ROLES
  // --------------------------------------------------------------------------

  const login = async (email: string): Promise<boolean> => {
    const trimmed = email.trim().toLowerCase();
    const found = users.find(u => u.email.toLowerCase() === trimmed);
    if (found) {
      setCurrentUserId(found.id);
      return true;
    }
    return false;
  };

  const signup = async (params: {
    fullName: string;
    email: string;
    charityId: string;
    plan: 'monthly' | 'yearly';
    charityPercentage?: number;
  }): Promise<boolean> => {
    const trimmed = params.email.trim().toLowerCase();
    if (users.some(u => u.email.toLowerCase() === trimmed)) {
      return false; // Email already registered
    }

    const newUserId = `user-${Date.now()}`;
    const newUser: User = {
      id: newUserId,
      email: trimmed,
      fullName: params.fullName.trim(),
      role: 'subscriber',
      handicap: 18.0,
      homeClub: 'Metropolitan Golf Club',
      createdAt: new Date().toISOString()
    };

    const newSub: Subscription = {
      id: `sub-${Date.now()}`,
      userId: newUserId,
      plan: params.plan,
      status: 'active',
      amount: params.plan === 'yearly' ? 190.00 : 19.00,
      charityPercentage: Math.max(10, params.charityPercentage || 10),
      charityId: params.charityId,
      currentPeriodStart: new Date().toISOString(),
      currentPeriodEnd: new Date(Date.now() + (params.plan === 'yearly' ? 365 : 30) * 86400000).toISOString(),
      cancelAtPeriodEnd: false
    };

    setUsers(prev => [...prev, newUser]);
    setSubscriptions(prev => [...prev, newSub]);
    setCurrentUserId(newUserId);
    return true;
  };

  const logout = () => {
    setCurrentUserId('');
  };

  const switchUser = (userId: string) => {
    if (users.some(u => u.id === userId)) {
      setCurrentUserId(userId);
    }
  };

  // --------------------------------------------------------------------------
  // SCORE MANAGEMENT (§ 05: Rolling 5-score FIFO, 1 per date, 1-45 Stableford)
  // --------------------------------------------------------------------------

  const addScore = (score: number, playedAt: string, courseName?: string) => {
    if (!currentUser) return { success: false, error: 'User must be logged in to post scores.' };

    const validation = validateGolfScore(score, playedAt, userScores);
    if (!validation.isValid) {
      return { success: false, error: validation.error };
    }

    const newScore: GolfScore = {
      id: `score-${Date.now()}`,
      userId: currentUser.id,
      score,
      playedAt,
      courseName: courseName || 'Local Course',
      createdAt: new Date().toISOString()
    };

    // Apply the rolling 5-score FIFO rule:
    const updatedUserScores = applyRollingFiveScoreRule(userScores, newScore);

    // Update global score table: remove old user scores and replace with trimmed 5
    setScores(prev => [
      ...prev.filter(s => s.userId !== currentUser.id),
      ...updatedUserScores
    ]);

    return { success: true };
  };

  const updateScore = (scoreId: string, score: number, playedAt: string, courseName?: string) => {
    if (!currentUser) return { success: false, error: 'Not authenticated.' };

    const validation = validateGolfScore(score, playedAt, userScores, scoreId);
    if (!validation.isValid) {
      return { success: false, error: validation.error };
    }

    const existing = userScores.find(s => s.id === scoreId);
    if (!existing) return { success: false, error: 'Score not found.' };

    const updatedScore: GolfScore = {
      ...existing,
      score,
      playedAt,
      courseName: courseName || existing.courseName
    };

    const updatedUserScores = applyRollingFiveScoreRule(userScores, updatedScore);

    setScores(prev => [
      ...prev.filter(s => s.userId !== currentUser.id),
      ...updatedUserScores
    ]);

    return { success: true };
  };

  const deleteScore = (scoreId: string) => {
    if (!currentUser) return false;
    setScores(prev => prev.filter(s => s.id !== scoreId));
    return true;
  };

  // --------------------------------------------------------------------------
  // SUBSCRIPTION & CHARITY CONTRIBUTIONS
  // --------------------------------------------------------------------------

  const updateSubscription = (params: {
    plan?: 'monthly' | 'yearly';
    charityPercentage?: number;
    charityId?: string;
  }) => {
    if (!currentUser || !userSubscription) return;

    setSubscriptions(prev =>
      prev.map(sub => {
        if (sub.id !== userSubscription.id) return sub;

        return {
          ...sub,
          plan: params.plan !== undefined ? params.plan : sub.plan,
          amount: params.plan ? (params.plan === 'yearly' ? 190.00 : 19.00) : sub.amount,
          charityPercentage:
            params.charityPercentage !== undefined
              ? Math.max(10, Math.min(100, params.charityPercentage))
              : sub.charityPercentage,
          charityId: params.charityId !== undefined ? params.charityId : sub.charityId
        };
      })
    );
  };

  const toggleSubscriptionStatus = (status: 'active' | 'inactive' | 'lapsed' | 'cancelled') => {
    if (!currentUser || !userSubscription) return;

    setSubscriptions(prev =>
      prev.map(sub => (sub.id === userSubscription.id ? { ...sub, status } : sub))
    );
  };

  const makeDonation = (params: {
    charityId: string;
    amount: number;
    donorName: string;
    donorEmail: string;
    isIndependent?: boolean;
  }) => {
    const targetCharity = charities.find(c => c.id === params.charityId);
    if (!targetCharity || params.amount <= 0) return;

    const newDonation: Donation = {
      id: `don-${Date.now()}`,
      userId: currentUser?.id,
      charityId: params.charityId,
      charityName: targetCharity.name,
      donorName: params.donorName,
      donorEmail: params.donorEmail,
      amount: params.amount,
      isIndependent: params.isIndependent !== false,
      createdAt: new Date().toISOString()
    };

    setDonations(prev => [newDonation, ...prev]);

    // Update charity total raised
    setCharities(prev =>
      prev.map(c =>
        c.id === params.charityId ? { ...c, totalRaised: c.totalRaised + params.amount } : c
      )
    );
  };

  // --------------------------------------------------------------------------
  // DRAW ENGINE & SIMULATION (Admin Control)
  // --------------------------------------------------------------------------

  const runDrawSimulation = (drawType: DrawType): DrawSimulationResult => {
    // Generate 5 winning numbers based on draw type
    let winningNumbers: number[];
    if (drawType === 'random') {
      winningNumbers = generateRandomDrawNumbers();
    } else {
      // Algorithmic: collect all community scores across active golfers
      const activeScores = scores.map(s => s.score);
      winningNumbers = generateAlgorithmicDrawNumbers(activeScores);
    }

    // Active subscribers with valid scores
    const activeSubscribers = subscriptions.filter(s => s.status === 'active');
    const participants = activeSubscribers.map(sub => {
      const u = users.find(usr => usr.id === sub.userId);
      const userScrs = scores.filter(s => s.userId === sub.userId).map(s => s.score);
      return {
        userId: sub.userId,
        userName: u ? u.fullName : 'Player',
        userEmail: u ? u.email : 'player@digitalheroes.demo',
        scores: userScrs
      };
    });

    // Check last published draw for any rollover
    const lastPublished = [...draws]
      .filter(d => d.status === 'published')
      .sort((a, b) => b.drawNumber - a.drawNumber)[0];
    const rolloverIn = lastPublished ? lastPublished.rolloverOut : 0;

    const nextDrawNumber = draws.length > 0 ? Math.max(...draws.map(d => d.drawNumber)) + 1 : 14;

    const result = simulateMonthlyDraw({
      drawId: `draw-${nextDrawNumber}`,
      drawNumber: nextDrawNumber,
      monthYear: 'March 2026',
      drawType,
      winningNumbers,
      activeSubscriberCount: Math.max(activeSubscribers.length, 120), // baseline sample
      subscriptionContributionBase: 8.00,
      rolloverJackpotIn: rolloverIn,
      participants
    });

    setActiveSimulation(result);
    return result;
  };

  const publishCurrentDraw = (simulation: DrawSimulationResult): boolean => {
    const newDraw: Draw = {
      id: simulation.drawId,
      drawNumber: simulation.drawNumber,
      monthYear: simulation.monthYear,
      drawType: simulation.drawType,
      winningNumbers: simulation.winningNumbers,
      totalPool: simulation.totalPool,
      pool5Match: simulation.pool5Match,
      pool4Match: simulation.pool4Match,
      pool3Match: simulation.pool3Match,
      rolloverIn: simulation.rolloverIn,
      rolloverOut: simulation.rolloverOut,
      status: 'published',
      simulatedAt: new Date().toISOString(),
      publishedAt: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    const allNewWinners = [
      ...simulation.tier5Winners,
      ...simulation.tier4Winners,
      ...simulation.tier3Winners
    ];

    setDraws(prev => [newDraw, ...prev.filter(d => d.id !== newDraw.id)]);
    setWinners(prev => [...allNewWinners, ...prev]);
    setActiveSimulation(null);
    return true;
  };

  // --------------------------------------------------------------------------
  // WINNER VERIFICATION & PAYOUT SYSTEM (§ 09)
  // --------------------------------------------------------------------------

  const submitWinnerProof = (winnerId: string, proofImageUrl: string, notes?: string): boolean => {
    setWinners(prev =>
      prev.map(w => {
        if (w.id !== winnerId) return w;
        return {
          ...w,
          proofImageUrl,
          proofNotes: notes,
          proofSubmittedAt: new Date().toISOString(),
          verificationStatus: 'pending' // Moves to Admin review
        };
      })
    );
    return true;
  };

  const verifyWinner = (winnerId: string, status: 'approved' | 'rejected', adminNotes?: string): boolean => {
    setWinners(prev =>
      prev.map(w => {
        if (w.id !== winnerId) return w;
        return {
          ...w,
          verificationStatus: status,
          adminNotes: adminNotes || w.adminNotes,
          verifiedAt: new Date().toISOString()
        };
      })
    );
    return true;
  };

  const markPayoutPaid = (winnerId: string): boolean => {
    setWinners(prev =>
      prev.map(w => {
        if (w.id !== winnerId) return w;
        return {
          ...w,
          payoutStatus: 'paid',
          paidAt: new Date().toISOString()
        };
      })
    );
    return true;
  };

  // --------------------------------------------------------------------------
  // CHARITY MANAGEMENT (Admin)
  // --------------------------------------------------------------------------

  const addCharity = (charity: Omit<Charity, 'id' | 'totalRaised'>) => {
    const newCharity: Charity = {
      ...charity,
      id: `charity-${Date.now()}`,
      totalRaised: 0
    };
    setCharities(prev => [newCharity, ...prev]);
  };

  const updateCharity = (updated: Charity) => {
    setCharities(prev => prev.map(c => (c.id === updated.id ? updated : c)));
  };

  const deleteCharity = (charityId: string) => {
    setCharities(prev => prev.filter(c => c.id !== charityId));
  };

  // Reset helper
  const resetToDemoData = () => {
    try {
      localStorage.clear();
    } catch {}
    setUsers(INITIAL_USERS);
    setSubscriptions(INITIAL_SUBSCRIPTIONS);
    setScores(INITIAL_SCORES);
    setCharities(INITIAL_CHARITIES);
    setDraws(INITIAL_DRAWS);
    setWinners(INITIAL_WINNERS);
    setDonations(INITIAL_DONATIONS);
    setCurrentUserId('user-alex');
    setActiveSimulation(null);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        subscription: userSubscription,
        scores: userScores,
        charities,
        draws,
        winners,
        donations,
        allUsers: users,
        allSubscriptions: subscriptions,
        allScores: scores,
        activeSimulation,
        login,
        signup,
        logout,
        switchUser,
        addScore,
        updateScore,
        deleteScore,
        updateSubscription,
        toggleSubscriptionStatus,
        makeDonation,
        runDrawSimulation,
        publishCurrentDraw,
        submitWinnerProof,
        verifyWinner,
        markPayoutPaid,
        addCharity,
        updateCharity,
        deleteCharity,
        resetToDemoData
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
