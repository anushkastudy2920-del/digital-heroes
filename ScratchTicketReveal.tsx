'use client';

import React, { useState } from 'react';
import { sound } from '@/lib/sound';
import { Sparkles, Trophy, ShieldCheck, Heart, Wand2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ScratchTicketRevealProps {
  serialNumber?: string;
  numbers?: number[];
  charityName?: string;
}

export default function ScratchTicketReveal({
  serialNumber = '#DH-2026-03-88219',
  numbers = [34, 36, 38, 40, 42],
  charityName = 'Australian Junior Golf Foundation'
}: ScratchTicketRevealProps) {
  const [scratched, setScratched] = useState<boolean[]>([false, false, false, false, false]);

  const scratchIndex = (index: number) => {
    if (scratched[index]) return;
    sound.playScratch();
    sound.playChime();
    setScratched(prev => {
      const next = [...prev];
      next[index] = true;
      if (next.every(Boolean)) {
        sound.playFanfare();
        confetti({ particleCount: 70, spread: 60 });
      }
      return next;
    });
  };

  const scratchAll = () => {
    sound.playScratch();
    setScratched([true, true, true, true, true]);
    sound.playFanfare();
    confetti({ particleCount: 90, spread: 80 });
  };

  const allRevealed = scratched.every(Boolean);

  return (
    <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#1a1528] via-[#120d20] to-[#0a0713] border-2 border-purple-500/40 p-6 sm:p-8 text-white shadow-2xl space-y-6">
      
      {/* Ticket Header & Foil Crest */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-purple-500/20 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-500 via-indigo-600 to-purple-800 text-white flex items-center justify-center font-bold font-editorial text-lg shadow-lg shadow-purple-500/20 border border-purple-300">
            DH
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono-code uppercase tracking-widest text-purple-300 font-bold bg-purple-950/80 px-2 py-0.5 rounded border border-purple-500/30">
                HOLOGRAPHIC SCRATCH CARD
              </span>
              <span className="text-xs font-mono-code text-stone-400">SERIES 2026</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-editorial text-purple-100">
              Syndicate Scratch-to-Reveal
            </h3>
          </div>
        </div>

        <button
          onClick={scratchAll}
          className="px-3.5 py-1.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-400/30 text-xs font-mono-code font-bold transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Wand2 className="w-3.5 h-3.5" />
          <span>{allRevealed ? 'Foil Fully Scratched' : 'Scratch All 5 Balls'}</span>
        </button>
      </div>

      {/* 5 Scratch-Off Foil Panels */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-mono-code text-stone-400">
          <span>Tap or drag over gold foil boxes to scratch and reveal:</span>
          <span className="text-purple-300">{scratched.filter(Boolean).length}/5 REVEALED</span>
        </div>

        <div className="grid grid-cols-5 gap-2 sm:gap-4">
          {numbers.map((num, idx) => {
            const isScratched = scratched[idx];

            return (
              <div
                key={idx}
                onClick={() => scratchIndex(idx)}
                onMouseEnter={() => {
                  if (!isScratched) scratchIndex(idx);
                }}
                className={`relative h-20 sm:h-24 rounded-2xl flex flex-col items-center justify-center cursor-pointer select-none transition-all duration-300 overflow-hidden ${
                  isScratched
                    ? 'bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 text-stone-950 shadow-lg scale-102 ring-2 ring-amber-300'
                    : 'bg-gradient-to-br from-stone-700 via-stone-800 to-stone-900 border border-stone-600 hover:border-purple-400 shadow-md group'
                }`}
              >
                {isScratched ? (
                  <div className="text-center animate-in zoom-in-50 duration-200">
                    <span className="text-2xl sm:text-3xl font-black font-mono-code block">
                      {num}
                    </span>
                    <span className="text-[9px] uppercase font-bold text-stone-900/80">
                      BALL #{idx + 1}
                    </span>
                  </div>
                ) : (
                  <div className="text-center space-y-1">
                    <div className="w-7 h-7 mx-auto rounded-full bg-stone-700/80 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[9px] font-mono-code uppercase text-stone-400 block tracking-wider">
                      SCRATCH
                    </span>
                  </div>
                )}

                {/* Shimmer overlay */}
                {!isScratched && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Ticket Footer & Charity Seal */}
      <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/20 flex flex-wrap items-center justify-between gap-4 text-xs font-mono-code">
        <div className="flex items-center gap-2">
          <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
          <span className="text-purple-200">Earmarked Charity: <strong className="text-white">{charityName}</strong></span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-stone-400">SERIAL: {serialNumber}</span>
          <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 font-bold">
            VERIFIED ENTRY
          </span>
        </div>
      </div>

    </div>
  );
}
