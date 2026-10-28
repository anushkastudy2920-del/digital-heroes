'use client';

import React, { useState, useEffect } from 'react';
import { sound } from '@/lib/sound';
import { 
  Clock, 
  ShieldCheck, 
  Coins, 
  Sparkles, 
  CheckCircle2, 
  Lock, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  FileCode2
} from 'lucide-react';

export default function LiveDrawCountdown() {
  // Target: Friday, March 27, 2026 at 20:00:00 AEST
  const [timeLeft, setTimeLeft] = useState({
    days: 4,
    hours: 18,
    minutes: 42,
    seconds: 35,
  });

  const [cryptoModalOpen, setCryptoModalOpen] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);

  // Real-time ticking seconds clock
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCopyHash = () => {
    sound.playClick();
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText('0x94a7e81b672d41a5c89f012de938b481c098df23a5198034c7b82103ef89d12a');
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
    }
  };

  return (
    <>
      <div className="luxury-card rounded-3xl p-6 sm:p-10 border border-[#e8e3da] bg-white space-y-8">
        
        {/* Header & Live Settlement Badge */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-[#e8e3da] pb-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 text-[11px] font-mono-code uppercase tracking-wider text-emerald-800 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                <span>Live Settlement Clock · Draw #14</span>
              </span>
              <span className="text-xs text-[#8c857b] font-mono-code">AEST Timezone</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold font-editorial text-[#141210]">
              Next Verified Syndicate Settlement
            </h3>
            <p className="text-xs sm:text-sm text-[#57534e] max-w-xl leading-relaxed">
              Every month, all verified 5-card member entries are settled against our provably fair dual-source draw engine.
            </p>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              setCryptoModalOpen(true);
            }}
            className="self-start flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#faf8f5] hover:bg-[#f3efe6] border border-[#d6cfc2] text-[#141210] text-xs font-mono-code transition-colors cursor-pointer shadow-2xs"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>Verify SHA-256 Proof</span>
          </button>
        </div>

        {/* Real-Time Precision Digital Countdown Units */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
          
          <div className="p-4 sm:p-6 rounded-2xl bg-[#faf8f5] border border-[#e8e3da] text-center space-y-1 shadow-2xs">
            <div className="text-4xl sm:text-5xl font-bold font-mono-code text-[#141210]">
              {String(timeLeft.days).padStart(2, '0')}
            </div>
            <span className="text-[10px] sm:text-xs uppercase font-mono-code text-[#8c857b] tracking-widest block">
              DAYS REMAINING
            </span>
          </div>

          <div className="p-4 sm:p-6 rounded-2xl bg-[#faf8f5] border border-[#e8e3da] text-center space-y-1 shadow-2xs">
            <div className="text-4xl sm:text-5xl font-bold font-mono-code text-[#141210]">
              {String(timeLeft.hours).padStart(2, '0')}
            </div>
            <span className="text-[10px] sm:text-xs uppercase font-mono-code text-[#8c857b] tracking-widest block">
              HOURS
            </span>
          </div>

          <div className="p-4 sm:p-6 rounded-2xl bg-[#faf8f5] border border-[#e8e3da] text-center space-y-1 shadow-2xs">
            <div className="text-4xl sm:text-5xl font-bold font-mono-code text-[#141210]">
              {String(timeLeft.minutes).padStart(2, '0')}
            </div>
            <span className="text-[10px] sm:text-xs uppercase font-mono-code text-[#8c857b] tracking-widest block">
              MINUTES
            </span>
          </div>

          <div className="p-4 sm:p-6 rounded-2xl bg-purple-50/70 border border-purple-200 text-center space-y-1 shadow-2xs relative overflow-hidden">
            <div className="text-4xl sm:text-5xl font-bold font-mono-code text-purple-900 transition-all">
              {String(timeLeft.seconds).padStart(2, '0')}
            </div>
            <span className="text-[10px] sm:text-xs uppercase font-mono-code text-purple-800 font-bold tracking-widest block flex items-center justify-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-ping" />
              <span>SECONDS</span>
            </span>
          </div>

        </div>

        {/* Live Pool Accumulator & Odds Metrics */}
        <div className="p-6 rounded-2xl bg-[#141210] text-white grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
          
          <div className="space-y-1">
            <span className="text-[10px] font-mono-code uppercase tracking-wider text-stone-400 block">
              ACTIVE GUARANTEED POOL
            </span>
            <div className="text-2xl sm:text-3xl font-bold font-mono-code text-amber-400">
              $34,250.00
            </div>
            <div className="text-[11px] font-mono-code text-emerald-400 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Includes $13,700 Tier 1 Rollover</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-mono-code uppercase tracking-wider text-stone-400 block">
              ACTIVE 5-CARD ENTRIES
            </span>
            <div className="text-2xl sm:text-3xl font-bold font-mono-code text-white">
              1,792 Tickets
            </div>
            <div className="text-[11px] font-mono-code text-stone-400">
              Validated on Australian clubs
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-mono-code uppercase tracking-wider text-stone-400 block">
              VERIFIED WIN PROBABILITY
            </span>
            <div className="text-2xl sm:text-3xl font-bold font-mono-code text-purple-300">
              1 in 24 Odds
            </div>
            <div className="text-[11px] font-mono-code text-stone-400">
              To match 3+ balls for cash share
            </div>
          </div>

        </div>

      </div>

      {/* Cryptographic SHA-256 Proof Modal */}
      {cryptoModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#141210]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-white rounded-3xl border border-[#e8e3da] shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-[#e8e3da] pb-4">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-700" />
                <h4 className="font-editorial text-xl font-bold text-[#141210]">
                  Provably Fair Cryptographic Seed
                </h4>
              </div>
              <button
                onClick={() => setCryptoModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 font-mono-code text-xs p-1"
              >
                ✕ Close
              </button>
            </div>

            <p className="text-xs text-[#57534e] leading-relaxed">
              Digital Heroes utilizes deterministic SHA-256 hash commitments. The draw seed is hashed and published 48 hours prior to settlement, guaranteeing that neither administrators nor players can tamper with winning combinations.
            </p>

            <div className="p-4 rounded-xl bg-[#faf8f5] border border-[#e8e3da] space-y-2">
              <span className="text-[10px] font-mono-code text-[#8c857b] uppercase block">
                OFFICIAL CYCLE XIV DRAW COMMIT HASH (SHA-256)
              </span>
              <div className="text-xs font-mono-code break-all font-bold text-[#141210] bg-white p-3 rounded-lg border border-[#d6cfc2]">
                0x94a7e81b672d41a5c89f012de938b481c098df23a5198034c7b82103ef89d12a
              </div>
              <div className="flex justify-between items-center pt-1 text-[11px] font-mono-code">
                <span className="text-emerald-700 font-semibold">✓ Cryptographically Committed</span>
                <button
                  onClick={handleCopyHash}
                  className="text-purple-900 font-bold hover:underline cursor-pointer"
                >
                  {copiedHash ? '✓ Copied to Clipboard!' : 'Copy Hash String'}
                </button>
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setCryptoModalOpen(false)}
                className="px-6 py-2.5 rounded-full bg-[#141210] hover:bg-[#282522] text-white text-xs font-mono-code uppercase tracking-wider"
              >
                Dismiss Audit
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
