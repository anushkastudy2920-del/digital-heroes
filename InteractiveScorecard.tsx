'use client';

import React, { useState } from 'react';
import { sound } from '@/lib/sound';
import { Sparkles } from 'lucide-react';
import Link from 'next/link';

interface HoleData {
  hole: number;
  par: number;
  si: number;
  gross: number;
}

const DEFAULT_HOLES: HoleData[] = [
  { hole: 1, par: 4, si: 7, gross: 4 },
  { hole: 2, par: 4, si: 3, gross: 5 },
  { hole: 3, par: 3, si: 15, gross: 3 },
  { hole: 4, par: 5, si: 1, gross: 6 },
  { hole: 5, par: 4, si: 11, gross: 4 },
  { hole: 6, par: 4, si: 9, gross: 5 },
  { hole: 7, par: 3, si: 17, gross: 3 },
  { hole: 8, par: 4, si: 5, gross: 4 },
  { hole: 9, par: 5, si: 13, gross: 5 },
  { hole: 10, par: 4, si: 8, gross: 4 },
  { hole: 11, par: 3, si: 16, gross: 3 },
  { hole: 12, par: 4, si: 2, gross: 5 },
  { hole: 13, par: 5, si: 10, gross: 5 },
  { hole: 14, par: 4, si: 6, gross: 4 },
  { hole: 15, par: 4, si: 12, gross: 5 },
  { hole: 16, par: 3, si: 18, gross: 3 },
  { hole: 17, par: 4, si: 4, gross: 4 },
  { hole: 18, par: 5, si: 14, gross: 5 },
];

const COURSES = [
  { name: 'Royal Portrush (Dunluce Links)', par: 72, rating: '74.2 / 138' },
  { name: 'Kingston Heath Golf Club', par: 72, rating: '73.8 / 135' },
  { name: 'St Andrews (Old Course)', par: 72, rating: '73.1 / 132' },
  { name: 'Royal Melbourne (West)', par: 72, rating: '74.5 / 140' },
];

export default function InteractiveScorecard() {
  const [selectedCourse, setSelectedCourse] = useState(COURSES[0].name);
  const [handicap, setHandicap] = useState<number>(14);
  const [holes, setHoles] = useState<HoleData[]>(DEFAULT_HOLES);
  const [activeHalf, setActiveHalf] = useState<'front' | 'back'>('front');

  const calculatePoints = (hole: HoleData): number => {
    let strokesReceived = Math.floor(handicap / 18);
    if (hole.si <= (handicap % 18)) {
      strokesReceived += 1;
    }
    const net = hole.gross - strokesReceived;
    const diff = hole.par - net;
    const points = diff + 2;
    return Math.max(0, points);
  };

  const totalPoints = holes.reduce((sum, h) => sum + calculatePoints(h), 0);
  const totalGross = holes.reduce((sum, h) => sum + h.gross, 0);

  const updateGross = (holeNum: number, delta: number) => {
    sound.playClick();
    setHoles(prev =>
      prev.map(h => {
        if (h.hole === holeNum) {
          const newGross = Math.max(1, Math.min(10, h.gross + delta));
          return { ...h, gross: newGross };
        }
        return h;
      })
    );
  };

  const displayedHoles = activeHalf === 'front' ? holes.slice(0, 9) : holes.slice(9, 18);

  return (
    <div className="paper-card rounded-2xl overflow-hidden border border-[#e6dcce] shadow-xl shadow-stone-900/5">
      
      {/* Scorecard Header */}
      <div className="bg-[#f4efe6] p-5 sm:p-6 border-b border-[#e6dcce] flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-mono-code bg-purple-100 text-purple-900 px-2 py-0.5 rounded font-bold">
              OFFICIAL WHS CARD SIMULATOR
            </span>
            <span className="text-xs text-[#847b73] font-mono-code">RULE § 05 COMPLIANT</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold font-editorial text-[#191614] mt-1">
            Tournament Stableford Scorecard
          </h3>
          <p className="text-xs text-[#57524d] mt-0.5">
            Tap +/- to change gross shots on each hole. Watch net handicap adjustments convert into your 1–45 point draw ticket.
          </p>
        </div>

        {/* Live Total Badge */}
        <div className="flex items-center gap-4 bg-white px-5 py-3 rounded-xl border border-[#e6dcce] shadow-xs">
          <div className="text-right">
            <span className="text-[10px] font-mono-code text-[#847b73] block uppercase tracking-wider">STABLEFORD TOTAL</span>
            <span className="text-3xl sm:text-4xl font-bold font-mono-code text-purple-900 leading-none">
              {totalPoints} <span className="text-xs text-[#847b73] font-normal">pts</span>
            </span>
          </div>
          <div className="h-9 w-px bg-[#e6dcce]" />
          <div className="text-right">
            <span className="text-[10px] font-mono-code text-[#847b73] block uppercase tracking-wider">GROSS / NET</span>
            <span className="text-sm font-bold font-mono-code text-[#191614]">
              {totalGross} / {totalGross - handicap}
            </span>
          </div>
        </div>
      </div>

      {/* Course & Handicap Controls */}
      <div className="p-4 bg-[#faf7f2] border-b border-[#e6dcce] flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <label className="font-semibold text-[#57524d]">Championship Course:</label>
          <select
            value={selectedCourse}
            onChange={(e) => {
              sound.playClick();
              setSelectedCourse(e.target.value);
            }}
            aria-label="Championship Course"
            className="px-3 py-1.5 rounded-lg bg-white border border-[#e6dcce] text-[#191614] font-medium text-xs focus:ring-2 focus:ring-purple-400 outline-none"
          >
            {COURSES.map(c => (
              <option key={c.name} value={c.name}>{c.name} (Par {c.par})</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3">
          <label className="font-semibold text-[#57524d]">Player Handicap Index:</label>
          <div className="flex items-center gap-1.5 bg-white border border-[#e6dcce] px-2 py-1 rounded-lg">
            <button
              onClick={() => {
                sound.playClick();
                setHandicap(Math.max(0, handicap - 1));
              }}
              className="w-5 h-5 rounded hover:bg-[#f4efe6] text-[#191614] font-bold"
              title="Decrease handicap"
            >
              -
            </button>
            <span className="w-8 text-center font-mono-code font-bold text-purple-900">{handicap}</span>
            <button
              onClick={() => {
                sound.playClick();
                setHandicap(Math.min(36, handicap + 1));
              }}
              className="w-5 h-5 rounded hover:bg-[#f4efe6] text-[#191614] font-bold"
              title="Increase handicap"
            >
              +
            </button>
          </div>
        </div>

        {/* Tab Toggle Front 9 / Back 9 */}
        <div className="flex items-center p-1 bg-[#ede4d6] rounded-lg">
          <button
            onClick={() => {
              sound.playClick();
              setActiveHalf('front');
            }}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
              activeHalf === 'front' ? 'bg-white text-purple-900 shadow-xs' : 'text-[#78716c] hover:text-[#191614]'
            }`}
          >
            Front Nine (1–9)
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setActiveHalf('back');
            }}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
              activeHalf === 'back' ? 'bg-white text-purple-900 shadow-xs' : 'text-[#78716c] hover:text-[#191614]'
            }`}
          >
            Back Nine (10–18)
          </button>
        </div>
      </div>

      {/* Hole-by-Hole Grid */}
      <div className="p-4 sm:p-6 overflow-x-auto">
        <table className="w-full text-center text-xs border-collapse">
          <thead>
            <tr className="border-b border-[#e6dcce] text-[#847b73] font-mono-code">
              <th className="py-2.5 px-2 text-left font-semibold">HOLE</th>
              {displayedHoles.map(h => (
                <th key={h.hole} className="py-2.5 px-2 font-semibold">#{h.hole}</th>
              ))}
              <th className="py-2.5 px-3 font-bold text-purple-900">HALF</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f0eae0] font-mono-code">
            {/* Par Row */}
            <tr className="text-[#57524d] bg-[#fdfbf7]">
              <td className="py-2 px-2 text-left font-semibold font-sans">Par</td>
              {displayedHoles.map(h => (
                <td key={h.hole} className="py-2 px-2 text-[#847b73]">{h.par}</td>
              ))}
              <td className="py-2 px-3 font-semibold text-[#57524d]">
                {displayedHoles.reduce((s, h) => s + h.par, 0)}
              </td>
            </tr>

            {/* Stroke Index Row */}
            <tr className="text-[#847b73] text-[11px]">
              <td className="py-1.5 px-2 text-left font-sans">Stroke Index</td>
              {displayedHoles.map(h => (
                <td key={h.hole} className="py-1.5 px-2">{h.si}</td>
              ))}
              <td className="py-1.5 px-3">—</td>
            </tr>

            {/* Gross Score Input Row */}
            <tr className="text-[#191614] bg-white">
              <td className="py-3 px-2 text-left font-semibold font-sans">Gross Score</td>
              {displayedHoles.map(h => (
                <td key={h.hole} className="py-3 px-1">
                  <div className="inline-flex items-center gap-1 bg-[#f4efe6] px-1.5 py-1 rounded-md border border-[#e6dcce]">
                    <button
                      onClick={() => updateGross(h.hole, -1)}
                      className="w-4 h-4 rounded text-xs hover:bg-stone-300 flex items-center justify-center font-bold"
                      title="Minus one stroke"
                    >
                      -
                    </button>
                    <span className="w-4 font-bold text-sm text-[#191614]">{h.gross}</span>
                    <button
                      onClick={() => updateGross(h.hole, 1)}
                      className="w-4 h-4 rounded text-xs hover:bg-stone-300 flex items-center justify-center font-bold"
                      title="Plus one stroke"
                    >
                      +
                    </button>
                  </div>
                </td>
              ))}
              <td className="py-3 px-3 font-bold text-[#191614]">
                {displayedHoles.reduce((s, h) => s + h.gross, 0)}
              </td>
            </tr>

            {/* Stableford Points Row */}
            <tr className="bg-purple-50/60 font-bold">
              <td className="py-3 px-2 text-left font-sans text-purple-950">Stableford Pts</td>
              {displayedHoles.map(h => {
                const pts = calculatePoints(h);
                let badgeColor = 'text-stone-700';
                if (pts === 3) badgeColor = 'text-purple-700 bg-purple-100 rounded px-1';
                if (pts >= 4) badgeColor = 'text-amber-700 bg-amber-100 rounded px-1';
                if (pts === 2) badgeColor = 'text-emerald-700';
                if (pts <= 1) badgeColor = 'text-rose-600';
                return (
                  <td key={h.hole} className="py-3 px-2 text-sm">
                    <span className={`inline-block py-0.5 ${badgeColor}`}>{pts}</span>
                  </td>
                );
              })}
              <td className="py-3 px-3 text-base text-purple-900">
                {displayedHoles.reduce((s, h) => s + calculatePoints(h), 0)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Footer Info & Conversion */}
      <div className="p-4 bg-[#fbf9f5] border-t border-[#e6dcce] flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3 text-[#78716c]">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-400" /> Eagle = 4+ pts
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-purple-600" /> Birdie = 3 pts
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-600" /> Par = 2 pts
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-500" /> Bogey = 1 pt
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            onClick={() => sound.playFanfare()}
            className="px-4 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-semibold text-xs tracking-wider uppercase transition-all shadow-md shadow-purple-900/15 flex items-center gap-2 hover:scale-102"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Submit Round ({totalPoints} Pts) to Draw</span>
          </Link>
        </div>
      </div>

    </div>
  );
}
