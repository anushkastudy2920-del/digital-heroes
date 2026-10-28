'use client';

import React, { useState, useEffect } from 'react';
import { sound } from '@/lib/sound';
import { useApp } from '@/lib/store';
import confetti from 'canvas-confetti';
import { Sparkles, RotateCw, Trophy, ShieldCheck, ChevronRight, CheckCircle2, Flame } from 'lucide-react';

interface DrawnBall {
  number: number;
  revealed: boolean;
}

export default function LotteryDrumSimulator() {
  const { scores } = useApp();
  const [isSpinning, setIsSpinning] = useState(false);
  const [drawMode, setDrawMode] = useState<'algorithmic' | 'random'>('algorithmic');
  const [drawnBalls, setDrawnBalls] = useState<number[]>([14, 22, 36, 38, 41]);
  const [currentSlotIndex, setCurrentSlotIndex] = useState(5);
  const [matchResult, setMatchResult] = useState<{ matches: number[]; tier: string; payout: string } | null>(null);

  const userScores = scores.map(s => s.score);
  const activeUserScores = userScores.length > 0 ? userScores : [34, 36, 38, 40, 42];

  // Community-weighted frequencies (authentic Stableford distribution 1-45 peaking around 34-39)
  const generateDrawNumbers = (mode: 'algorithmic' | 'random'): number[] => {
    const results: number[] = [];
    if (mode === 'random') {
      while (results.length < 5) {
        const n = Math.floor(Math.random() * 45) + 1;
        if (!results.includes(n)) results.push(n);
      }
    } else {
      // Weighted towards realistic golf scores 30-40
      const weights = Array.from({ length: 45 }, (_, i) => {
        const score = i + 1;
        const diff = Math.abs(score - 36);
        return Math.max(1, 20 - diff);
      });
      const totalWeight = weights.reduce((a, b) => a + b, 0);

      while (results.length < 5) {
        let r = Math.random() * totalWeight;
        let chosen = 36;
        for (let i = 0; i < 45; i++) {
          r -= weights[i];
          if (r <= 0) {
            chosen = i + 1;
            break;
          }
        }
        if (!results.includes(chosen)) results.push(chosen);
      }
    }
    return results.sort((a, b) => a - b);
  };

  const handlePullLever = () => {
    if (isSpinning) return;
    sound.playLeverCrank();
    setIsSpinning(true);
    setMatchResult(null);
    setCurrentSlotIndex(0);

    const newNumbers = generateDrawNumbers(drawMode);

    // Ball-by-ball drop sequence
    newNumbers.forEach((num, idx) => {
      setTimeout(() => {
        sound.playBallDrop();
        setCurrentSlotIndex(idx + 1);
        if (idx === 4) {
          setIsSpinning(false);
          setDrawnBalls(newNumbers);

          // Calculate matches against activeUserScores
          const matches = activeUserScores.filter(s => newNumbers.includes(s));
          let tier = 'No Tier Match';
          let payout = '$0.00';

          if (matches.length === 5) {
            tier = 'Tier 1 (5-Match Jackpot)';
            payout = '$13,700.00';
            sound.playFanfare();
            confetti({ particleCount: 120, spread: 90 });
          } else if (matches.length === 4) {
            tier = 'Tier 2 (4-Match Share)';
            payout = '$2,263.33';
            sound.playFanfare();
            confetti({ particleCount: 80, spread: 70 });
          } else if (matches.length === 3) {
            tier = 'Tier 3 (3-Match Share)';
            payout = '$485.50';
            sound.playChime();
          } else {
            sound.playChime();
          }

          setMatchResult({ matches, tier, payout });
        }
      }, (idx + 1) * 750);
    });
  };

  return (
    <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#0c261c] via-[#091f16] to-[#040e0b] border-2 border-amber-500/40 shadow-2xl p-6 sm:p-8 text-white space-y-6">
      
      {/* Subtle Brass Rivets & Monogram Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-amber-500/20 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-600 to-amber-700 text-stone-950 flex items-center justify-center font-bold font-editorial text-lg shadow-lg shadow-amber-500/20 border border-amber-200">
            DH
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono-code uppercase tracking-widest text-amber-400 font-bold bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
                MECHANICAL REWARD CAGE
              </span>
              <span className="text-xs font-mono-code text-emerald-400/80">CYCLE #14 ENGINE</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-editorial text-amber-100">
              The Golden Sphere Lottery Drum
            </h3>
          </div>
        </div>

        {/* Algorithm Mode Toggle */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-stone-900/80 border border-amber-500/30 text-xs font-mono-code">
          <button
            onClick={() => {
              sound.playClick();
              setDrawMode('algorithmic');
            }}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              drawMode === 'algorithmic'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold shadow-md'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            Algorithmic Weighted (§ 06)
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setDrawMode('random');
            }}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              drawMode === 'random'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold shadow-md'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            Pure Random (1–45)
          </button>
        </div>
      </div>

      {/* Main Glass Sphere & Chute Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-2">
        
        {/* Animated 3D Drum Simulation */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center">
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full border-4 border-amber-500/60 bg-radial from-emerald-950/40 via-stone-950/90 to-black p-4 flex items-center justify-center shadow-[inset_0_0_50px_rgba(217,119,6,0.3)]">
            
            {/* Brass Outer Orbit Ring */}
            <div className={`absolute inset-0 rounded-full border-2 border-dashed border-amber-400/30 ${isSpinning ? 'animate-spin' : ''}`} style={{ animationDuration: '3s' }} />
            
            {/* Shimmer Glass Reflection */}
            <div className="absolute top-3 left-10 w-28 h-12 bg-white/10 rounded-full blur-xs rotate-[-30deg] pointer-events-none" />

            {/* Floating Enamel Spheres Inside */}
            <div className="relative w-48 h-48 flex flex-wrap items-center justify-center gap-2 overflow-hidden rounded-full">
              {Array.from({ length: 18 }).map((_, i) => {
                const sampleNum = (i * 3 + 1) % 45 + 1;
                return (
                  <div
                    key={i}
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-b from-amber-200 via-amber-400 to-amber-600 text-stone-950 font-mono-code font-bold text-[10px] sm:text-xs flex items-center justify-center shadow-md transform transition-transform duration-300 ${
                      isSpinning ? 'animate-bounce' : 'hover:scale-110'
                    }`}
                    style={{
                      animationDelay: `${(i * 0.1).toFixed(2)}s`,
                      animationDuration: isSpinning ? '0.4s' : '2s'
                    }}
                  >
                    {sampleNum}
                  </div>
                );
              })}
            </div>

            {/* Center Golden Crest */}
            <div className="absolute w-14 h-14 rounded-full bg-amber-500/20 backdrop-blur-xs border border-amber-400/50 flex items-center justify-center pointer-events-none">
              <Flame className={`w-7 h-7 text-amber-400 ${isSpinning ? 'animate-pulse' : ''}`} />
            </div>
          </div>

          <div className="text-center mt-3 text-xs font-mono-code text-amber-400/80">
            {isSpinning ? 'SPINNING CHAMBER · EXTRACTING BALLS...' : 'STANDBY · READY TO CRANK LEVER'}
          </div>
        </div>

        {/* Chute & Drawn Inspection Slots */}
        <div className="lg:col-span-5 space-y-5">
          <div className="space-y-2">
            <span className="text-[10px] font-mono-code uppercase tracking-wider text-amber-400 font-bold block">
              OFFICIAL INSPECTION TRAY (5 WINNING BALLS)
            </span>
            <div className="flex items-center justify-between gap-2 bg-stone-950/80 p-3.5 rounded-2xl border border-amber-500/30">
              {drawnBalls.map((num, idx) => {
                const isRevealed = idx < currentSlotIndex;
                return (
                  <div key={idx} className="flex flex-col items-center gap-1.5">
                    <div
                      className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-mono-code text-sm sm:text-base font-bold shadow-lg transition-all duration-500 ${
                        isRevealed
                          ? 'bg-gradient-to-b from-amber-200 via-amber-400 to-amber-600 text-stone-950 ring-2 ring-amber-300 scale-105'
                          : 'bg-stone-900 border border-stone-800 text-stone-600'
                      }`}
                    >
                      {isRevealed ? num : '?'}
                    </div>
                    <span className="text-[9px] font-mono-code text-stone-400">
                      BALL #{idx + 1}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mechanical Pull Lever Button */}
          <button
            onClick={handlePullLever}
            disabled={isSpinning}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 active:scale-98 text-stone-950 font-black text-sm tracking-wider uppercase shadow-xl shadow-amber-500/20 border-2 border-amber-200 flex items-center justify-center gap-3 transition-all disabled:opacity-60 cursor-pointer"
          >
            <RotateCw className={`w-5 h-5 ${isSpinning ? 'animate-spin' : ''}`} />
            <span>{isSpinning ? 'Tumbling Balls...' : 'PULL BRASS LEVER (CRANK DRAW)'}</span>
          </button>

          {/* Compare Against User's 5 Scores */}
          <div className="p-3.5 rounded-xl bg-stone-900/60 border border-stone-800 text-xs font-mono-code space-y-1.5">
            <div className="flex justify-between text-stone-400">
              <span>Your Active Retained Scores:</span>
              <span className="text-amber-400">[{activeUserScores.join(', ')}]</span>
            </div>

            {matchResult && (
              <div className="pt-2 border-t border-stone-800 flex items-center justify-between text-sm font-bold">
                <span className="text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{matchResult.tier}</span>
                </span>
                <span className="text-amber-300 font-mono-code text-base">
                  {matchResult.payout}
                </span>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Footer Specs Bar */}
      <div className="p-3.5 bg-stone-950/60 rounded-xl border border-amber-500/20 flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono-code text-stone-400">
        <div className="flex items-center gap-2 text-amber-400">
          <ShieldCheck className="w-4 h-4" />
          <span>CRYPTOGRAPHIC SEED: 0x8F9C...41E2 · TAMPER PROOF</span>
        </div>
        <div>
          <span>40% Tier 1 (Jackpot) · 35% Tier 2 · 25% Tier 3</span>
        </div>
      </div>

    </div>
  );
}
