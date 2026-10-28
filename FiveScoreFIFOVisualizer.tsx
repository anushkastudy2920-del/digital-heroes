'use client';

import React, { useState } from 'react';
import { sound } from '@/lib/sound';
import { 
  ArrowRight, 
  RotateCcw, 
  Sparkles, 
  HelpCircle, 
  CheckCircle2, 
  Plus, 
  Calendar, 
  MapPin, 
  Trophy 
} from 'lucide-react';
import { emitLiveSyndicateEvent } from '@/components/layout/RealtimeClubhousePulse';

interface ScoreCard {
  id: string;
  roundNumber: number;
  date: string;
  course: string;
  score: number;
  isNew?: boolean;
}

const INITIAL_SCORES: ScoreCard[] = [
  { id: 'sc-1', roundNumber: 1, date: 'Feb 15, 2026', course: 'Kingston Heath', score: 34 },
  { id: 'sc-2', roundNumber: 2, date: 'Feb 22, 2026', course: 'Royal Melbourne', score: 38 },
  { id: 'sc-3', roundNumber: 3, date: 'Mar 01, 2026', course: 'Victoria GC', score: 29 },
  { id: 'sc-4', roundNumber: 4, date: 'Mar 08, 2026', course: 'Metropolitan GC', score: 41 },
  { id: 'sc-5', roundNumber: 5, date: 'Mar 15, 2026', course: 'Commonwealth GC', score: 36 },
];

export default function FiveScoreFIFOVisualizer() {
  const [scores, setScores] = useState<ScoreCard[]>(INITIAL_SCORES);
  const [inputScore, setInputScore] = useState<number>(42);
  const [evictedScore, setEvictedScore] = useState<ScoreCard | null>(null);
  const [roundCounter, setRoundCounter] = useState<number>(6);
  const [animating, setAnimating] = useState<boolean>(false);

  // The active syndicate ticket numbers are the 5 scores sorted ascending (PRD Level 1 §3.2)
  const ticketNumbers = [...scores.map(s => s.score)].sort((a, b) => a - b);

  const handleAddRound = (scoreToAdd: number) => {
    if (animating) return;
    setAnimating(true);
    sound.playScoreSubmit();

    // The oldest score is the first one in the FIFO queue
    const oldest = scores[0];
    setEvictedScore(oldest);

    const newRound: ScoreCard = {
      id: `sc-${Date.now()}`,
      roundNumber: roundCounter,
      date: 'Today · Saturday Round',
      course: 'Peninsula Kingswood',
      score: scoreToAdd,
      isNew: true,
    };

    setTimeout(() => {
      // FIFO eviction: drop first, append new at the end
      setScores(prev => [...prev.slice(1), newRound]);
      setRoundCounter(c => c + 1);
      setAnimating(false);
      sound.playChime();

      // Emit live syndicate event to real-time pulse ticker
      emitLiveSyndicateEvent(
        'New Round Registered!',
        `Logged ${scoreToAdd} pts at Peninsula Kingswood · FIFO evicted Round #${oldest.roundNumber}`,
        '+$19.00'
      );
    }, 450);
  };

  const handleReset = () => {
    sound.playClick();
    setScores(INITIAL_SCORES);
    setEvictedScore(null);
    setRoundCounter(6);
    setInputScore(42);
  };

  return (
    <div className="luxury-card rounded-3xl p-6 sm:p-10 border border-[#e8e3da] bg-white space-y-8">
      
      {/* 1. Header & Educational Explainer */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-[#e8e3da] pb-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono-code uppercase tracking-wider text-purple-900 font-bold bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
              Interactive Rule Visualizer · PRD § 3.2
            </span>
            <span className="text-xs text-[#8c857b] font-mono-code">FIFO Architecture</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold font-editorial text-[#141210]">
            How Your Last 5 Golf Scores Become Your Ticket
          </h3>
          <p className="text-xs sm:text-sm text-[#57534e] max-w-2xl leading-relaxed">
            In standard lotteries, you guess random numbers. In Digital Heroes, <strong className="text-[#141210]">your genuine golf rounds are your numbers</strong>. Submitting a 6th round smoothly drops your oldest score off the ticket. Try it below:
          </p>
        </div>

        <button
          onClick={handleReset}
          className="self-start flex items-center gap-1.5 text-xs font-mono-code text-[#8c857b] hover:text-[#141210] border border-[#e8e3da] px-3 py-1.5 rounded-full transition-colors cursor-pointer"
          title="Reset to default 5 cards"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Demo</span>
        </button>
      </div>

      {/* 2. Visual FIFO Card Carousel / Queue */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-mono-code text-[#8c857b]">
          <span>ROLLING 5-ROUND FIFO QUEUE (OLDEST → NEWEST)</span>
          <span className="text-purple-900 font-semibold">Strict 5-Card Capacity</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3.5">
          {scores.map((sc, index) => {
            const isOldest = index === 0;
            const isNewest = index === scores.length - 1;

            return (
              <div
                key={sc.id}
                className={`p-4 rounded-2xl border transition-all duration-300 relative flex flex-col justify-between ${
                  sc.isNew
                    ? 'bg-purple-50/70 border-purple-300 shadow-sm animate-pulse'
                    : isOldest
                    ? 'bg-[#faf8f5] border-[#d6cfc2]'
                    : 'bg-[#faf8f5] border-[#e8e3da]'
                }`}
              >
                {/* Status Badges */}
                <div className="flex items-center justify-between text-[10px] font-mono-code mb-2">
                  <span className="font-bold text-[#8c857b]">
                    #{sc.roundNumber}
                  </span>
                  {isOldest && (
                    <span className="text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                      Next to Evict
                    </span>
                  )}
                  {isNewest && sc.isNew && (
                    <span className="text-purple-800 bg-purple-100 px-1.5 py-0.5 rounded font-bold">
                      Just Added!
                    </span>
                  )}
                </div>

                {/* Score Number Display */}
                <div className="my-2 text-center">
                  <div className="text-3xl sm:text-4xl font-bold font-mono-code text-[#141210]">
                    {sc.score}
                  </div>
                  <span className="text-[10px] uppercase font-mono-code text-[#8c857b]">
                    Stableford Pts
                  </span>
                </div>

                {/* Round Details */}
                <div className="pt-2 border-t border-[#e8e3da]/70 text-[10px] font-mono-code text-[#57534e] space-y-0.5 truncate">
                  <div className="truncate font-semibold text-[#141210]">{sc.course}</div>
                  <div className="text-[#8c857b]">{sc.date}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Eviction Notice Banner */}
        {evictedScore && (
          <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-xs font-mono-code text-amber-900 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-600 animate-ping" />
              <span>FIFO Action: Round #{evictedScore.roundNumber} ({evictedScore.course} · {evictedScore.score} pts) was evicted from your active ticket.</span>
            </span>
            <span className="text-[11px] font-bold">PRD RULE ENFORCED</span>
          </div>
        )}
      </div>

      {/* 3. Generated Official Syndicate Ticket */}
      <div className="p-6 rounded-2xl bg-[#141210] text-white space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2 text-xs font-mono-code text-stone-400">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="uppercase tracking-widest text-white font-semibold">Your Active Syndicate Entry Ticket</span>
            <span>·</span>
            <span className="text-emerald-400">DRAW #14 ELIGIBLE</span>
          </div>
          <span className="text-[11px] font-mono-code text-stone-400">
            Auto-sorted ascending (1 to 45 pts)
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3 py-1">
          {ticketNumbers.map((num, i) => (
            <div
              key={i}
              className="w-13 h-13 rounded-2xl bg-white/10 border border-white/20 flex flex-col items-center justify-center backdrop-blur-md shadow-inner transition-transform hover:scale-105"
            >
              <span className="text-xl sm:text-2xl font-bold font-mono-code text-white">
                {num}
              </span>
              <span className="text-[8px] font-mono-code text-stone-400">
                NUM {i + 1}
              </span>
            </div>
          ))}
          <div className="ml-auto text-right text-xs font-mono-code">
            <span className="text-stone-400 block text-[10px]">VERIFIED DRAW POOL</span>
            <span className="text-amber-400 text-lg font-bold font-mono-code">$34,250.00</span>
          </div>
        </div>
      </div>

      {/* 4. Interactive Simulator Controls: Add a New Round */}
      <div className="p-5 rounded-2xl bg-[#faf8f5] border border-[#e8e3da] space-y-4">
        <div className="flex items-center justify-between text-xs font-mono-code text-[#141210]">
          <span className="font-bold flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-purple-700" />
            <span>SIMULATE SUBMITTING A NEW ROUND TODAY:</span>
          </span>
          <span className="text-[#8c857b]">Click any score to trigger FIFO</span>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { label: '35 pts (Solid Par)', val: 35 },
            { label: '39 pts (Great Round 🔥)', val: 39 },
            { label: '42 pts (Clubhouse Leader 🏆)', val: 42 },
            { label: '44 pts (Career Best)', val: 44 },
            { label: '31 pts (Tough Weather)', val: 31 },
          ].map((preset) => (
            <button
              key={preset.val}
              disabled={animating}
              onClick={() => handleAddRound(preset.val)}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-purple-900 hover:text-white border border-[#d6cfc2] text-[#141210] text-xs font-mono-code transition-all shadow-2xs hover:shadow cursor-pointer disabled:opacity-50"
            >
              + {preset.label}
            </button>
          ))}
        </div>

        {/* Custom Input */}
        <div className="flex items-center gap-3 pt-2">
          <label className="text-xs font-mono-code text-[#57534e]">
            Or enter custom score (1–45):
          </label>
          <input
            type="number"
            min={1}
            max={45}
            value={inputScore}
            onChange={(e) => setInputScore(Math.min(45, Math.max(1, parseInt(e.target.value) || 1)))}
            className="w-20 px-3 py-1.5 rounded-lg border border-[#d6cfc2] bg-white text-center font-mono-code text-sm font-bold text-[#141210]"
          />
          <button
            disabled={animating}
            onClick={() => handleAddRound(inputScore)}
            className="px-4 py-2 rounded-xl bg-[#141210] hover:bg-[#282522] text-white text-xs font-mono-code transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
          >
            <span>Submit {inputScore} Pts</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

    </div>
  );
}
