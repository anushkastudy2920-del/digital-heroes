'use client';

import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  Trophy, 
  Heart, 
  Calendar, 
  ShieldCheck, 
  Users, 
  Sparkles,
  CheckCircle2,
  Bell,
  X
} from 'lucide-react';
import { sound } from '@/lib/sound';

interface LiveEvent {
  id: string;
  icon: 'golf' | 'trophy' | 'charity' | 'syndicate' | 'crypto';
  text: string;
  subtext: string;
  timeAgo: string;
  amount?: string;
}

const DEFAULT_FEED: LiveEvent[] = [
  {
    id: 'ev-1',
    icon: 'golf',
    text: 'Marcus Brody (Kingston Heath GC)',
    subtext: 'Submitted official round: 38 Stableford pts',
    timeAgo: '12s ago',
  },
  {
    id: 'ev-2',
    icon: 'charity',
    text: 'Australian Junior Golf Foundation',
    subtext: 'Direct endowment received from Melbourne member',
    timeAgo: '45s ago',
    amount: '+$19.00',
  },
  {
    id: 'ev-3',
    icon: 'syndicate',
    text: 'Cycle XIV Pool Accumulator',
    subtext: 'Active verified prize pool increased',
    timeAgo: '1m ago',
    amount: '$34,250.00',
  },
  {
    id: 'ev-4',
    icon: 'golf',
    text: 'Sarah Jenkins (Metropolitan GC)',
    subtext: 'FIFO rolling window updated: [29, 34, 36, 38, 41]',
    timeAgo: '2m ago',
  },
  {
    id: 'ev-5',
    icon: 'trophy',
    text: 'Verified Draw Settlement #13',
    subtext: 'Marcus Brody claimed $2,263.33 (4-Match Tier 2)',
    timeAgo: '3m ago',
    amount: '+$2,263.33',
  },
  {
    id: 'ev-6',
    icon: 'crypto',
    text: 'Deterministic SHA-256 Seed Audit',
    subtext: 'Verified tamper-proof commit: 0x94A7...B481',
    timeAgo: '5m ago',
  },
  {
    id: 'ev-7',
    icon: 'charity',
    text: 'Royal Children’s Hospital Foundation',
    subtext: 'Endowment disburse queued for March cycle',
    timeAgo: '8m ago',
    amount: '+$226.33',
  },
];

// Custom event dispatcher for components to trigger real-time broadcasts
export function emitLiveSyndicateEvent(title: string, detail: string, amount?: string) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('dh:live_event', {
        detail: { title, detail, amount },
      })
    );
  }
}

export default function RealtimeClubhousePulse() {
  const [feed, setFeed] = useState<LiveEvent[]>(DEFAULT_FEED);
  const [activeToast, setActiveToast] = useState<{ title: string; detail: string; amount?: string } | null>(null);
  const [golfersOnline, setGolfersOnline] = useState<number>(1428);
  const [paused, setPaused] = useState<boolean>(false);

  // Listen for simulated or user-triggered real-time events
  useEffect(() => {
    const handleCustomEvent = (e: any) => {
      const { title, detail, amount } = e.detail;
      const newEv: LiveEvent = {
        id: `ev-${Date.now()}`,
        icon: 'golf',
        text: title,
        subtext: detail,
        timeAgo: 'Just now',
        amount: amount,
      };

      setFeed(prev => [newEv, ...prev.slice(0, 15)]);
      setActiveToast({ title, detail, amount });
      sound.playChime();

      setTimeout(() => {
        setActiveToast(null);
      }, 5500);
    };

    window.addEventListener('dh:live_event', handleCustomEvent);
    return () => window.removeEventListener('dh:live_event', handleCustomEvent);
  }, []);

  // Slight real-time fluctuation in golfers count to feel organically alive
  useEffect(() => {
    const timer = setInterval(() => {
      setGolfersOnline(prev => prev + (Math.random() > 0.45 ? 1 : -1));
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {/* 1. TOP LIVE REAL-TIME FEED BANNER */}
      <div 
        className="bg-[#141210] border-b border-[#2d2926] text-stone-300 py-2.5 px-4 overflow-hidden relative"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Live Beacon Tag */}
          <div className="flex items-center gap-2 shrink-0 bg-[#24201c] px-3 py-1 rounded-full border border-stone-800 text-[11px] font-mono-code">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
            <span className="font-bold text-white uppercase tracking-wider">LIVE SYNDICATE FEED</span>
            <span className="text-stone-500">|</span>
            <span className="text-emerald-400 font-bold">{golfersOnline.toLocaleString()} Golfers Active</span>
          </div>

          {/* Marquee Stream of Incoming Events */}
          <div className="overflow-hidden relative w-full flex items-center">
            <div className={`flex items-center gap-8 whitespace-nowrap text-xs font-mono-code ${paused ? '' : 'animate-marquee'}`}>
              {[...feed, ...feed].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2.5 shrink-0 text-stone-300 hover:text-white transition-colors cursor-default">
                  {item.icon === 'golf' && <Flame className="w-3.5 h-3.5 text-amber-400" />}
                  {item.icon === 'trophy' && <Trophy className="w-3.5 h-3.5 text-amber-300" />}
                  {item.icon === 'charity' && <Heart className="w-3.5 h-3.5 text-rose-400" />}
                  {item.icon === 'crypto' && <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />}
                  {item.icon === 'syndicate' && <Calendar className="w-3.5 h-3.5 text-emerald-400" />}

                  <span className="font-bold text-white text-[11px]">{item.text}</span>
                  <span className="text-stone-400 text-[11px]">{item.subtext}</span>
                  {item.amount && (
                    <span className="bg-emerald-950/80 text-emerald-300 px-1.5 py-0.2 rounded border border-emerald-500/40 font-bold text-[10px]">
                      {item.amount}
                    </span>
                  )}
                  <span className="text-stone-500 text-[10px]">({item.timeAgo})</span>
                  <span className="text-stone-700">·</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* 2. REAL-TIME FLOATING BROADCAST TOAST */}
      {activeToast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-[#141210] text-white p-4 rounded-2xl border border-amber-500/40 shadow-2xl animate-in slide-in-from-bottom duration-300 flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center shrink-0 text-amber-400">
              <Sparkles className="w-4 h-4 animate-spin" style={{ animationDuration: '4s' }} />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono-code uppercase font-bold text-amber-400">
                  REAL-TIME BROADCAST
                </span>
                {activeToast.amount && (
                  <span className="text-[10px] font-mono-code font-bold bg-emerald-950 text-emerald-300 px-1.5 rounded border border-emerald-500/30">
                    {activeToast.amount}
                  </span>
                )}
              </div>
              <h5 className="text-xs font-bold text-white">{activeToast.title}</h5>
              <p className="text-[11px] text-stone-300 leading-snug">{activeToast.detail}</p>
            </div>
          </div>

          <button
            onClick={() => setActiveToast(null)}
            className="text-stone-500 hover:text-stone-300 p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </>
  );
}
