'use client';

import React, { useState } from 'react';
import { sound } from '@/lib/sound';
import { 
  Trophy, 
  Heart, 
  Coins, 
  Sparkles, 
  CheckCircle2, 
  Calculator, 
  ArrowRight, 
  Award,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { emitLiveSyndicateEvent } from '@/components/layout/RealtimeClubhousePulse';

export default function InteractivePrizeEstimator() {
  // Test your scores against Draw #13 (verified winning numbers: 14, 22, 36, 38, 41)
  const DRAW_13_NUMBERS = [14, 22, 36, 38, 41];
  
  const [userNumbers, setUserNumbers] = useState<number[]>([14, 22, 34, 38, 41]); // 4 matches (Marcus Brody card)
  const [membershipTier, setMembershipTier] = useState<'monthly' | 'annual'>('monthly');
  const [charityPercent, setCharityPercent] = useState<number>(10);
  const [selectedCharity, setSelectedCharity] = useState<string>('Australian Junior Golf Foundation');

  // Calculate matches
  const matchedNumbers = userNumbers.filter(num => DRAW_13_NUMBERS.includes(num));
  const matchCount = matchedNumbers.length;

  const totalPool = 34250;
  const tier1Amount = totalPool * 0.40; // 40% = $13,700
  const tier2Total = totalPool * 0.35; // 35% = $11,987.50
  const tier2PerWinner = 2263.33; // divided among 5 winners
  const tier3PerWinner = 485.50;

  // Monthly or annual cost
  const baseCost = membershipTier === 'monthly' ? 19 : 190;
  const monthlyImpact = (membershipTier === 'monthly' ? 19 : 190 / 12) * (charityPercent / 100);
  const annualImpact = monthlyImpact * 12;

  const handleScoreChange = (index: number, val: number) => {
    sound.playScoreInput();
    const clamped = Math.min(45, Math.max(1, val || 1));
    const updated = [...userNumbers];
    updated[index] = clamped;
    setUserNumbers(updated);
  };

  const loadPreset = (presetName: 'marcus' | 'perfect5' | 'tier3' | 'random') => {
    sound.playClick();
    if (presetName === 'marcus') {
      setUserNumbers([14, 22, 34, 38, 41]); // 4 matches
      emitLiveSyndicateEvent('Verified Winner Card Loaded', 'Marcus Brody hit 4 of 5 numbers for $2,263.33 Tier 2 payout', '+$2,263.33');
    } else if (presetName === 'perfect5') {
      setUserNumbers([14, 22, 36, 38, 41]); // 5 matches
      sound.playFanfare();
      emitLiveSyndicateEvent('Jackpot 5-Match Simulated!', 'Card matched all 5 numbers for $13,700.00 Jackpot', '+$13,700.00');
    } else if (presetName === 'tier3') {
      setUserNumbers([14, 22, 36, 19, 28]); // 3 matches
      emitLiveSyndicateEvent('Tier 3 Winner Simulated', 'Card matched 3 numbers for $485.50 cash payout', '+$485.50');
    } else {
      setUserNumbers([12, 27, 33, 39, 44]); // random
    }
  };

  return (
    <div className="luxury-card rounded-3xl p-6 sm:p-10 border border-[#e8e3da] bg-white space-y-10">
      
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-[#e8e3da] pb-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono-code uppercase tracking-wider text-emerald-800 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Interactive Prize Simulator
            </span>
            <span className="text-xs text-[#8c857b] font-mono-code">Draw #13 Verified Baseline</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold font-editorial text-[#141210]">
            Test Your Golf Scores & Estimate Your Prize Share
          </h3>
          <p className="text-xs sm:text-sm text-[#57534e] max-w-2xl leading-relaxed">
            See how matching 3, 4, or 5 of your Stableford scores converts into verified cash payouts and philanthropic impact. Try putting in scores you recently shot:
          </p>
        </div>

        <div className="text-right self-start">
          <span className="text-[10px] font-mono-code text-[#8c857b] uppercase block">ACTIVE CYCLE POOL</span>
          <span className="text-2xl sm:text-3xl font-bold font-mono-code text-[#141210]">$34,250.00</span>
        </div>
      </div>

      {/* 2. Test Your Numbers Widget */}
      <div className="p-6 rounded-2xl bg-[#faf8f5] border border-[#e8e3da] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-mono-code text-purple-900 font-bold block uppercase tracking-wider">
              STEP 1 · ENTER YOUR 5 STABLEFORD SCORES
            </span>
            <p className="text-xs text-[#57524e]">
              Enter points between 1 and 45. We will compare them against official Draw #13:
            </p>
          </div>

          {/* Quick Presets */}
          <div className="flex items-center gap-1.5 text-xs font-mono-code">
            <button
              onClick={() => loadPreset('marcus')}
              className="px-2.5 py-1 rounded-lg bg-white border border-[#d6cfc2] hover:bg-[#141210] hover:text-white transition-colors cursor-pointer"
            >
              Marcus Brody (4 Matches)
            </button>
            <button
              onClick={() => loadPreset('perfect5')}
              className="px-2.5 py-1 rounded-lg bg-white border border-[#d6cfc2] hover:bg-[#141210] hover:text-white transition-colors cursor-pointer"
            >
              Jackpot (5 Matches)
            </button>
            <button
              onClick={() => loadPreset('tier3')}
              className="px-2.5 py-1 rounded-lg bg-white border border-[#d6cfc2] hover:bg-[#141210] hover:text-white transition-colors cursor-pointer"
            >
              Tier 3 (3 Matches)
            </button>
          </div>
        </div>

        {/* 5 Input Boxes */}
        <div className="grid grid-cols-5 gap-3 max-w-xl mx-auto">
          {userNumbers.map((num, idx) => {
            const isMatch = DRAW_13_NUMBERS.includes(num);
            return (
              <div key={idx} className="space-y-1.5 text-center">
                <input
                  type="number"
                  min={1}
                  max={45}
                  value={num}
                  onChange={(e) => handleScoreChange(idx, parseInt(e.target.value))}
                  className={`w-full py-3 text-center text-xl sm:text-2xl font-bold font-mono-code rounded-xl border transition-all ${
                    isMatch
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-500/20'
                      : 'bg-white border-[#d6cfc2] text-[#141210]'
                  }`}
                />
                <span className="text-[10px] font-mono-code text-[#8c857b] block">
                  {isMatch ? '✓ MATCH' : `Round ${idx + 1}`}
                </span>
              </div>
            );
          })}
        </div>

        {/* Verified Draw Numbers Reference */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#e8e3da] text-xs font-mono-code">
          <div className="flex items-center gap-2">
            <span className="text-[#8c857b]">OFFICIAL DRAW #13 NUMBERS:</span>
            <div className="flex items-center gap-1.5">
              {DRAW_13_NUMBERS.map((n) => (
                <span
                  key={n}
                  className={`px-2 py-0.5 rounded font-bold font-mono-code ${
                    userNumbers.includes(n) ? 'bg-emerald-600 text-white' : 'bg-stone-200 text-[#141210]'
                  }`}
                >
                  {n}
                </span>
              ))}
            </div>
          </div>
          <div className="text-right">
            <span className="text-[#141210] font-bold">
              {matchCount} of 5 Numbers Matched
            </span>
          </div>
        </div>

        {/* Dynamic Payout Result Card */}
        <div className={`p-5 rounded-2xl border transition-all ${
          matchCount >= 5
            ? 'bg-amber-50 border-amber-300 text-amber-950'
            : matchCount === 4
            ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
            : matchCount === 3
            ? 'bg-purple-50 border-purple-300 text-purple-950'
            : 'bg-stone-100 border-stone-200 text-stone-700'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-current" />
                <span className="font-bold text-sm uppercase tracking-wider font-mono-code">
                  {matchCount >= 5 && 'JACKPOT TIER 1 WINNER! (5 MATCHES)'}
                  {matchCount === 4 && 'TIER 2 VERIFIED WINNER! (4 MATCHES)'}
                  {matchCount === 3 && 'TIER 3 WINNER! (3 MATCHES)'}
                  {matchCount < 3 && 'NO PRIZE THIS CYCLE (REQUIRES 3+ MATCHES)'}
                </span>
              </div>
              <p className="text-xs leading-relaxed opacity-90">
                {matchCount >= 5 && 'Outstanding! 40% of the entire syndicate pool is yours or shared among jackpot winners.'}
                {matchCount === 4 && 'Excellent card! 35% pool tier is divided equally among 4-match holders. Paid out via direct EFT.'}
                {matchCount === 3 && 'Great performance! 25% pool tier is shared among all 3-match holders.'}
                {matchCount < 3 && 'Your score remains in your 5-score FIFO queue for next month’s draw automatically.'}
              </p>
            </div>

            <div className="text-right self-start sm:self-center">
              <span className="text-[10px] uppercase font-mono-code block opacity-75">ESTIMATED PRIZE SHARE</span>
              <span className="text-2xl sm:text-3xl font-bold font-mono-code">
                {matchCount >= 5 && `$${tier1Amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                {matchCount === 4 && `$${tier2PerWinner.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                {matchCount === 3 && `$${tier3PerWinner.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                {matchCount < 3 && '$0.00'}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* 3. Interactive Charity Contribution & Membership Slider */}
      <div className="space-y-6 pt-2">
        <div className="space-y-1">
          <span className="text-xs font-mono-code text-purple-900 font-bold block uppercase tracking-wider">
            STEP 2 · MEMBERSHIP & PHILANTHROPIC IMPACT CALCULATOR
          </span>
          <p className="text-xs text-[#57524e]">
            Choose your membership tier and choose how much of your membership goes directly to charity (10% guaranteed minimum):
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Controls */}
          <div className="lg:col-span-7 space-y-5">
            {/* Tier Selector */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => { sound.playClick(); setMembershipTier('monthly'); }}
                className={`flex-1 p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  membershipTier === 'monthly'
                    ? 'bg-[#141210] text-white border-[#141210]'
                    : 'bg-white text-[#141210] border-[#d6cfc2] hover:bg-[#faf8f5]'
                }`}
              >
                <div className="font-bold text-sm">$19 / Month</div>
                <div className="text-[11px] opacity-75">Billed monthly · Cancel anytime</div>
              </button>

              <button
                onClick={() => { sound.playClick(); setMembershipTier('annual'); }}
                className={`flex-1 p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  membershipTier === 'annual'
                    ? 'bg-[#141210] text-white border-[#141210]'
                    : 'bg-white text-[#141210] border-[#d6cfc2] hover:bg-[#faf8f5]'
                }`}
              >
                <div className="font-bold text-sm">$190 / Year</div>
                <div className="text-[11px] opacity-75">Includes 2 months free savings</div>
              </button>
            </div>

            {/* Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-mono-code">
                <span className="text-[#141210] font-semibold">
                  Charity Allocation: {charityPercent}% of your fee
                </span>
                <span className="text-emerald-800 font-bold">
                  ${monthlyImpact.toFixed(2)} / month donated
                </span>
              </div>
              <input
                type="range"
                min={10}
                max={50}
                step={5}
                value={charityPercent}
                onChange={(e) => {
                  sound.playSliderTick();
                  setCharityPercent(parseInt(e.target.value));
                }}
                className="w-full h-2 bg-[#e8e3da] rounded-lg appearance-none cursor-pointer accent-[#141210]"
              />
              <div className="flex justify-between text-[10px] font-mono-code text-[#8c857b]">
                <span>10% (PRD Guaranteed Min)</span>
                <span>25% (Benefactor)</span>
                <span>50% (Philanthropist)</span>
              </div>
            </div>

            {/* Beneficiary Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono-code text-[#8c857b]">
                Designated Cause Beneficiary:
              </label>
              <select
                value={selectedCharity}
                onChange={(e) => { sound.playClick(); setSelectedCharity(e.target.value); }}
                className="w-full px-4 py-2.5 rounded-xl border border-[#d6cfc2] bg-white text-xs font-mono-code text-[#141210]"
              >
                <option value="Australian Junior Golf Foundation">Australian Junior Golf Foundation (Grassroots Youth)</option>
                <option value="Royal Children’s Hospital Foundation">Royal Children’s Hospital Foundation (Pediatric Care)</option>
                <option value="Australian Bushfire Wildlife Recovery">Australian Bushfire Wildlife Recovery (Habitat Care)</option>
                <option value="Guide Dogs Victoria">Guide Dogs Victoria (Assistance Animals)</option>
              </select>
            </div>
          </div>

          {/* Impact Ledger Output */}
          <div className="lg:col-span-5 p-6 rounded-2xl bg-[#faf8f5] border border-[#e8e3da] space-y-4">
            <span className="text-[10px] font-mono-code uppercase tracking-wider text-[#8c857b] font-bold block">
              ANNUAL PHILANTHROPIC IMPACT
            </span>
            
            <div className="space-y-3">
              <div>
                <span className="text-3xl font-bold font-mono-code text-emerald-800">
                  ${annualImpact.toFixed(2)}
                </span>
                <span className="text-xs text-[#57524e] block mt-0.5">
                  Direct donation to <strong className="text-[#141210]">{selectedCharity}</strong>
                </span>
              </div>

              <div className="pt-3 border-t border-[#e8e3da] space-y-2 text-xs font-mono-code text-[#57524e]">
                <div className="flex justify-between">
                  <span>Draw Entries:</span>
                  <span className="font-bold text-[#141210]">12 Monthly Cycles</span>
                </div>
                <div className="flex justify-between">
                  <span>Chances to Win:</span>
                  <span className="font-bold text-[#141210]">60 Number Match Checks</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax Deductible Receipt:</span>
                  <span className="font-bold text-emerald-800">Provided Annually</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
