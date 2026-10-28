import { GolfScore, DrawSimulationResult, DrawWinner, DrawType } from '@/types';

// ============================================================================
// 1. SCORE VALIDATION & ROLLING FIFO ENGINE (§ 05)
// ============================================================================

export const MIN_STABLEFORD_SCORE = 1;
export const MAX_STABLEFORD_SCORE = 45;
export const MAX_RETAINED_SCORES = 5;

export interface ScoreValidationResult {
  isValid: boolean;
  error?: string;
}

export function validateGolfScore(score: number, playedAt: string, existingScores: GolfScore[], editingScoreId?: string): ScoreValidationResult {
  if (!score || isNaN(score)) {
    return { isValid: false, error: 'Score is required and must be a number.' };
  }

  if (score < MIN_STABLEFORD_SCORE || score > MAX_STABLEFORD_SCORE) {
    return { 
      isValid: false, 
      error: `Stableford score must be between ${MIN_STABLEFORD_SCORE} and ${MAX_STABLEFORD_SCORE}.` 
    };
  }

  if (!playedAt || !/^\d{4}-\d{2}-\d{2}$/.test(playedAt)) {
    return { isValid: false, error: 'Please enter a valid date in YYYY-MM-DD format.' };
  }

  // Check future date
  const scoreDate = new Date(playedAt);
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  if (scoreDate > today) {
    return { isValid: false, error: 'Score date cannot be in the future.' };
  }

  // Duplicate date check (§ 05: "Only one score entry is permitted per date")
  const duplicate = existingScores.find(
    s => s.playedAt === playedAt && s.id !== editingScoreId
  );
  if (duplicate) {
    return {
      isValid: false,
      error: `A score for ${playedAt} already exists (${duplicate.score} pts). You can edit or delete that entry instead.`
    };
  }

  return { isValid: true };
}

/**
 * Enforces the 5-score rolling FIFO rule:
 * - New score is added
 * - Scores sorted descending by playedAt
 * - If length > 5, oldest scores are dropped automatically
 */
export function applyRollingFiveScoreRule(
  currentScores: GolfScore[],
  newOrUpdatedScore: GolfScore
): GolfScore[] {
  // If editing an existing score
  const isExisting = currentScores.some(s => s.id === newOrUpdatedScore.id);
  let updatedList: GolfScore[];

  if (isExisting) {
    updatedList = currentScores.map(s => (s.id === newOrUpdatedScore.id ? newOrUpdatedScore : s));
  } else {
    updatedList = [...currentScores, newOrUpdatedScore];
  }

  // Sort reverse chronological (most recent first)
  updatedList.sort((a, b) => new Date(b.playedAt).getTime() - new Date(a.playedAt).getTime());

  // Retain strictly up to the latest 5 scores
  return updatedList.slice(0, MAX_RETAINED_SCORES);
}

// ============================================================================
// 2. DUAL DRAW ENGINES (§ 06: Random vs Algorithmic)
// ============================================================================

/**
 * Pure Random Draw (Standard Lottery Style):
 * Selects 5 distinct numbers uniformly from 1 to 45.
 */
export function generateRandomDrawNumbers(): number[] {
  const numbers: number[] = [];
  while (numbers.length < 5) {
    const candidate = Math.floor(Math.random() * MAX_STABLEFORD_SCORE) + 1;
    if (!numbers.includes(candidate)) {
      numbers.push(candidate);
    }
  }
  return numbers.sort((a, b) => a - b);
}

/**
 * Algorithmic Draw (Score Frequency Weighted):
 * Analyzes the frequency of all active player scores across the platform.
 * Numbers that appear more often in player scorecards have a higher probability
 * of being drawn, creating a golf-performance-linked lottery experience.
 * Applies Laplace smoothing (weight + 1) so every number (1-45) retains a non-zero probability.
 */
export function generateAlgorithmicDrawNumbers(allScores: number[]): number[] {
  // Count frequency for each number from 1 to 45
  const frequencyMap = new Map<number, number>();
  for (let i = 1; i <= MAX_STABLEFORD_SCORE; i++) {
    frequencyMap.set(i, 1); // Laplace smoothing base = 1
  }

  for (const s of allScores) {
    if (s >= 1 && s <= MAX_STABLEFORD_SCORE) {
      frequencyMap.set(s, (frequencyMap.get(s) || 1) + 2); // Boost frequent scores
    }
  }

  // Draw 5 distinct numbers weighted without replacement
  const selected: number[] = [];
  const candidates = Array.from(frequencyMap.entries()).map(([num, weight]) => ({ num, weight }));

  while (selected.length < 5 && candidates.length > 0) {
    const totalWeight = candidates.reduce((sum, item) => sum + item.weight, 0);
    let randomThreshold = Math.random() * totalWeight;

    let pickedIndex = 0;
    for (let i = 0; i < candidates.length; i++) {
      randomThreshold -= candidates[i].weight;
      if (randomThreshold <= 0) {
        pickedIndex = i;
        break;
      }
    }

    selected.push(candidates[pickedIndex].num);
    // Remove picked to avoid duplicates
    candidates.splice(pickedIndex, 1);
  }

  return selected.sort((a, b) => a - b);
}

// ============================================================================
// 3. PRIZE POOL & SIMULATION LOGIC (§ 07 & § 11)
// ============================================================================

export const PRIZE_TIER_SPLIT = {
  MATCH_5: 0.40, // 40% + rollover jackpot
  MATCH_4: 0.35, // 35%
  MATCH_3: 0.25, // 25%
} as const;

export interface PlayerParticipant {
  userId: string;
  userName: string;
  userEmail: string;
  scores: number[]; // Player's latest retained scores
}

export function simulateMonthlyDraw(params: {
  drawId: string;
  drawNumber: number;
  monthYear: string;
  drawType: DrawType;
  winningNumbers: number[];
  activeSubscriberCount: number;
  subscriptionContributionBase?: number; // default $8.00 per subscriber
  rolloverJackpotIn?: number;
  participants: PlayerParticipant[];
}): DrawSimulationResult {
  const {
    drawId,
    drawNumber,
    monthYear,
    drawType,
    winningNumbers,
    activeSubscriberCount,
    subscriptionContributionBase = 8.00,
    rolloverJackpotIn = 0,
    participants
  } = params;

  // Total monthly draw pool generated from active subscriptions
  const basePool = Math.max(activeSubscriberCount * subscriptionContributionBase, 5000); // minimum $5,000 baseline
  const pool5Base = basePool * PRIZE_TIER_SPLIT.MATCH_5;
  const pool5Total = pool5Base + rolloverJackpotIn; // 40% share + rollover
  const pool4Total = basePool * PRIZE_TIER_SPLIT.MATCH_4; // 35% share
  const pool3Total = basePool * PRIZE_TIER_SPLIT.MATCH_3; // 25% share
  const totalPoolWithRollover = basePool + rolloverJackpotIn;

  const tier5Winners: DrawWinner[] = [];
  const tier4Winners: DrawWinner[] = [];
  const tier3Winners: DrawWinner[] = [];

  // Evaluate each participant
  for (const player of participants) {
    const matchedNumbers = player.scores.filter(score => winningNumbers.includes(score));
    const matchCount = matchedNumbers.length;

    if (matchCount >= 3) {
      const winnerRecord: DrawWinner = {
        id: `win-${player.userId}-${drawId}`,
        drawId,
        userId: player.userId,
        userName: player.userName,
        userEmail: player.userEmail,
        matchedNumbers: matchedNumbers.sort((a, b) => a - b),
        matchTier: matchCount >= 5 ? 5 : matchCount === 4 ? 4 : 3,
        prizeAmount: 0, // Calculated after all winners are counted
        verificationStatus: 'none',
        payoutStatus: 'pending'
      };

      if (matchCount >= 5) {
        tier5Winners.push(winnerRecord);
      } else if (matchCount === 4) {
        tier4Winners.push(winnerRecord);
      } else if (matchCount === 3) {
        tier3Winners.push(winnerRecord);
      }
    }
  }

  // Equal division of prize pools among winners in each tier
  const tier5PerWinner = tier5Winners.length > 0 ? Number((pool5Total / tier5Winners.length).toFixed(2)) : 0;
  const tier4PerWinner = tier4Winners.length > 0 ? Number((pool4Total / tier4Winners.length).toFixed(2)) : 0;
  const tier3PerWinner = tier3Winners.length > 0 ? Number((pool3Total / tier3Winners.length).toFixed(2)) : 0;

  tier5Winners.forEach(w => (w.prizeAmount = tier5PerWinner));
  tier4Winners.forEach(w => (w.prizeAmount = tier4PerWinner));
  tier3Winners.forEach(w => (w.prizeAmount = tier3PerWinner));

  // Rollover logic (§ 07: "5-match jackpot carries forward if unclaimed")
  const rolloverOut = tier5Winners.length === 0 ? pool5Total : 0;

  return {
    drawId,
    drawNumber,
    monthYear,
    drawType,
    winningNumbers,
    totalPool: totalPoolWithRollover,
    rolloverIn: rolloverJackpotIn,
    pool5Match: pool5Total,
    pool4Match: pool4Total,
    pool3Match: pool3Total,
    tier5Winners,
    tier4Winners,
    tier3Winners,
    tier5PerWinner,
    tier4PerWinner,
    tier3PerWinner,
    rolloverOut,
    totalWinnersCount: tier5Winners.length + tier4Winners.length + tier3Winners.length
  };
}

// ============================================================================
// 4. CHARITY CONTRIBUTION CALCULATOR (§ 08)
// ============================================================================

export function calculateCharityAllocation(
  subscriptionAmount: number,
  percentage: number
): { charityAmount: number; platformAmount: number } {
  // Enforce minimum 10%
  const effectivePercentage = Math.max(10, Math.min(100, percentage));
  const charityAmount = Number(((subscriptionAmount * effectivePercentage) / 100).toFixed(2));
  const platformAmount = Number((subscriptionAmount - charityAmount).toFixed(2));
  return { charityAmount, platformAmount };
}
