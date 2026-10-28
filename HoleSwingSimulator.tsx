'use client';

import React, { useState } from 'react';
import { sound } from '@/lib/sound';
import { useApp } from '@/lib/store';
import confetti from 'canvas-confetti';
import { Sparkles, Flag, Wind, Trophy, CheckCircle2, RotateCcw } from 'lucide-react';

export default function HoleSwingSimulator() {
  const { addScore } = useApp();
  const [selectedClub, setSelectedClub] = useState<'Driver' | '7-Iron' | 'Wedge'>('Driver');
  const [shotState, setShotState] = useState<'idle' | 'swinging' | 'in_flight' | 'holed'>('idle');
  const [distance, setDistance] = useState(0);
  const [roundTotal, setRoundTotal] = useState(38);
  const [recordedNotice, setRecordedNotice] = useState(false);

  const handleSwing = () => {
    if (shotState === 'swinging' || shotState === 'in_flight') return;
    
    // 1. Strike ball
    sound.playGolfDrive();
    setShotState('swinging');
    setRecordedNotice(false);

    // 2. Flight
    setTimeout(() => {
      setShotState('in_flight');
      const shotDist = selectedClub === 'Driver' ? 282 : selectedClub === '7-Iron' ? 174 : 110;
      setDistance(shotDist);
    }, 400);

    // 3. Holed out
    setTimeout(() => {
      sound.playBallCup();
      setShotState('holed');
      const calculatedPoints = Math.floor(Math.random() * 6) + 36; // 36 - 41 points
      setRoundTotal(calculatedPoints);
      sound.playFanfare();
      confetti({ particleCount: 50, spread: 60 });
    }, 1800);
  };

  const handleRecordToDraw = () => {
    sound.playChime();
    const today = new Date().toISOString().split('T')[0];
    addScore(roundTotal, today, 'Royal Portrush (Dunluce Links)');
    setRecordedNotice(true);
  };

  const handleReset = () => {
    sound.playClick();
    setShotState('idle');
    setDistance(0);
    setRecordedNotice(false);
  };

  return (
    <div className="rounded-3xl overflow-hidden bg-gradient-to-br from-[#ffffff] via-[#faf6ee] to-[#f4ebe0] border border-[#d8cca8] shadow-xl p-6 sm:p-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e4d8b8] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-mono-code bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded font-bold border border-emerald-300">
              INTERACTIVE TEE BOX
            </span>
            <span className="text-xs text-[#847b73] font-mono-code">HOLE 18 · 410 YDS · PAR 4</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold font-editorial text-[#191614] mt-1">
            Royal Portrush Links Swing Simulator
          </h3>
          <p className="text-xs text-[#57524d]">
            Choose your club and take a swing. Listen to the compression and watch your shot tally official Stableford draw points.
          </p>
        </div>

        {/* Club Selector */}
        <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-[#d8cca8] shadow-xs text-xs font-semibold">
          {(['Driver', '7-Iron', 'Wedge'] as const).map(club => (
            <button
              key={club}
              onClick={() => {
                sound.playClick();
                setSelectedClub(club);
              }}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedClub === club
                  ? 'bg-purple-800 text-white shadow-xs'
                  : 'text-[#57524d] hover:text-[#191614]'
              }`}
            >
              {club}
            </button>
          ))}
        </div>
      </div>

      {/* Visual Fairway Canvas */}
      <div className="relative h-48 sm:h-56 rounded-2xl bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-950 border border-emerald-700/50 overflow-hidden flex items-center justify-between px-6 sm:px-12 shadow-inner">
        
        {/* Fairway Contours & Rolling Dunes */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-emerald-950/40 blur-md" />

        {/* Tee Box */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-4 h-4 rounded-full bg-white ring-4 ring-white/30 shadow-lg" />
          <span className="text-[10px] font-mono-code text-emerald-200 mt-2 font-bold">TEE #18</span>
        </div>

        {/* Animated Ball Arc */}
        <div className="relative flex-1 mx-4 sm:mx-8 h-24 flex items-center justify-center">
          {shotState === 'in_flight' && (
            <div className="w-4 h-4 rounded-full bg-white shadow-[0_0_15px_white] animate-ping" />
          )}
          {shotState === 'holed' && (
            <div className="text-center space-y-1 animate-in zoom-in-75 duration-300">
              <span className="text-xs font-mono-code font-bold text-amber-300 bg-black/60 px-3 py-1 rounded-full border border-amber-400/40 inline-block">
                HOLED OUT! {distance} YARDS · NET BIRDIE (3 PTS)
              </span>
            </div>
          )}
          {shotState === 'idle' && (
            <span className="text-xs font-mono-code text-emerald-300/60 uppercase tracking-widest">
              FAIRWAY CLEAR · WIND: 8 KTS GENTLE BREEZE
            </span>
          )}
        </div>

        {/* Flagstick & Green */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-emerald-600/40 border border-emerald-400 flex items-center justify-center">
            <Flag className={`w-5 h-5 text-amber-400 ${shotState === 'holed' ? 'animate-bounce' : ''}`} />
          </div>
          <span className="text-[10px] font-mono-code text-amber-300 mt-1 font-bold">CUP</span>
        </div>

      </div>

      {/* Simulator Controls & Result Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
        
        <div className="flex items-center gap-3">
          <button
            onClick={handleSwing}
            disabled={shotState === 'swinging' || shotState === 'in_flight'}
            className="px-6 py-3.5 rounded-xl bg-purple-700 hover:bg-purple-800 active:scale-98 text-white font-bold text-xs tracking-wider uppercase transition-all shadow-md shadow-purple-900/20 flex items-center gap-2 cursor-pointer disabled:opacity-60"
          >
            <Sparkles className="w-4 h-4" />
            <span>{shotState === 'holed' ? 'Take Another Swing' : `Tee Off With ${selectedClub}`}</span>
          </button>

          {shotState === 'holed' && (
            <button
              onClick={handleReset}
              className="p-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
              title="Reset Tee"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Points Display & Action */}
        {shotState === 'holed' && (
          <div className="flex flex-wrap items-center gap-4 bg-purple-50 p-3 rounded-2xl border border-purple-200">
            <div>
              <span className="text-[10px] font-mono-code text-purple-700 uppercase block">18-HOLE STABLEFORD</span>
              <span className="text-2xl font-bold font-mono-code text-purple-950">
                {roundTotal} <span className="text-xs font-normal text-purple-700">Pts</span>
              </span>
            </div>

            <button
              onClick={handleRecordToDraw}
              disabled={recordedNotice}
              className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 disabled:bg-emerald-700 text-white text-xs font-semibold font-mono-code transition-all shadow-xs flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{recordedNotice ? 'Added to 5-Score Queue ✓' : 'Add to My Active Draw Card'}</span>
            </button>
          </div>
        )}

      </div>

    </div>
  );
}
