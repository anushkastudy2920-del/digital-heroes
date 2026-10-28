'use client';

import React from 'react';
import { Flame, Trophy, Heart, Calendar, ShieldCheck } from 'lucide-react';

export default function ClubhouseTicker() {
  const items = [
    { icon: <Trophy className="w-3.5 h-3.5 text-amber-400" />, text: "ACTIVE MARCH POOL: $34,250.00 GUARANTEED" },
    { icon: <Flame className="w-3.5 h-3.5 text-rose-400" />, text: "JAMES M. CARDED 41 PTS AT ROYAL MELBOURNE" },
    { icon: <Heart className="w-3.5 h-3.5 text-purple-400" />, text: "$2,263.33 DISBURSED TO ROYAL CHILDREN'S HOSPITAL" },
    { icon: <Calendar className="w-3.5 h-3.5 text-emerald-400" />, text: "NEXT VERIFIED DRAW: FRIDAY, MARCH 27 · 20:00 AEST" },
    { icon: <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />, text: "TIER 1 JACKPOT ROLLOVER: 40% CARRIED FORWARD" },
    { icon: <Trophy className="w-3.5 h-3.5 text-amber-400" />, text: "MARCUS B. WON $2,263.33 IN DRAW #13 (TIER 2)" },
  ];

  return (
    <div className="bg-[#0b1b14] border-y border-amber-500/20 py-2.5 overflow-hidden text-xs font-mono-code text-stone-300">
      <div className="flex items-center gap-10 animate-marquee whitespace-nowrap">
        {/* Repeating twice for seamless marquee loop */}
        {[...items, ...items].map((item, idx) => (
          <div key={idx} className="flex items-center gap-2.5 shrink-0">
            {item.icon}
            <span className="font-semibold tracking-wider text-[11px]">{item.text}</span>
            <span className="text-amber-500/40">/</span>
          </div>
        ))}
      </div>
    </div>
  );
}
