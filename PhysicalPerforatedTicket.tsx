'use client';

import React, { useState } from 'react';
import { sound } from '@/lib/sound';
import { Sparkles, CheckCircle2, ShieldCheck, QrCode, Heart } from 'lucide-react';

interface PhysicalTicketProps {
  serialNumber?: string;
  memberName?: string;
  charityName?: string;
  scores?: number[];
  drawDate?: string;
  poolAmount?: number;
}

export default function PhysicalPerforatedTicket({
  serialNumber = '#DH-2026-03-88219',
  memberName = 'Alex Mercer (Melbourne)',
  charityName = 'Australian Junior Golf Foundation',
  scores = [34, 36, 38, 40, 42],
  drawDate = 'March 27, 2026',
  poolAmount = 34250,
}: PhysicalTicketProps) {
  const [inspected, setInspected] = useState(false);

  const handleInspect = () => {
    sound.playChime();
    setInspected(!inspected);
  };

  return (
    <div className="relative max-w-xl mx-auto filter drop-shadow-xl transition-all duration-300 hover:scale-[1.01]">
      
      {/* Sawtooth Perforated Top Edge */}
      <div className="h-3 w-full bg-[#fbf9f5] flex items-end overflow-hidden">
        <div className="w-full flex justify-between">
          {Array.from({ length: 32 }).map((_, i) => (
            <div
              key={i}
              className="w-3 h-3 bg-white transform rotate-45 translate-y-1.5 border border-[#e6dcce]"
            />
          ))}
        </div>
      </div>

      {/* Main Ticket Body */}
      <div className="relative bg-gradient-to-br from-[#ffffff] via-[#fcfaf7] to-[#f7f2ea] border-x border-[#e6dcce] p-6 sm:p-8 space-y-6">
        
        {/* Subtle Watermark Monogram */}
        <div className="absolute right-6 top-8 text-7xl font-bold font-editorial text-purple-900/5 select-none pointer-events-none">
          DH
        </div>

        {/* Ticket Header & Verification Crest */}
        <div className="flex items-start justify-between border-b border-dashed border-[#d3c4b0] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-800 to-indigo-950 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-purple-900/20 border border-purple-400/30">
              DH
            </div>
            <div>
              <span className="text-[10px] font-mono-code uppercase tracking-widest text-purple-800 font-bold block">
                OFFICIAL MONTHLY DRAW ENTRY
              </span>
              <h4 className="text-xl font-bold text-[#191614] font-editorial">
                Digital Heroes Syndicate Stub
              </h4>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-mono-code text-[#847b73] block">TICKET SERIAL</span>
            <span className="text-xs font-mono-code font-bold text-purple-900 bg-purple-50 px-2.5 py-1 rounded border border-purple-200">
              {serialNumber}
            </span>
          </div>
        </div>

        {/* Member & Impact Metadata */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono-code">
          <div className="space-y-1">
            <span className="text-[#847b73] text-[10px] uppercase block">ENTRANT & HANDICAP</span>
            <div className="font-bold text-[#191614] flex items-center gap-1.5">
              <span>{memberName}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-stone-100 text-[#57524d]">WHS 14.2</span>
            </div>
          </div>

          <div className="space-y-1 sm:text-right">
            <span className="text-[#847b73] text-[10px] uppercase block">DIRECTED CHARITY (10%+)</span>
            <div className="font-bold text-purple-800 flex items-center sm:justify-end gap-1">
              <Heart className="w-3.5 h-3.5 fill-purple-600 text-purple-600" />
              <span>{charityName}</span>
            </div>
          </div>
        </div>

        {/* 5-Score Ball Numbers Display */}
        <div className="bg-[#f5efe6] p-4 sm:p-5 rounded-2xl border border-[#e6dcce] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#57524d] uppercase tracking-wider font-mono-code">
              5 Retained Stableford Scores (Draw Numbers):
            </span>
            <span className="text-[11px] text-purple-800 font-mono-code">
              FIFO QUEUE: 5/5 SLOTS FILLED
            </span>
          </div>

          <div className="flex items-center justify-center gap-2 sm:gap-4 py-2">
            {scores.map((score, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1.5 group">
                <div
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center font-mono-code text-base sm:text-lg font-bold shadow-md transition-all duration-300 ${
                    inspected
                      ? 'bg-gradient-to-b from-amber-300 via-amber-400 to-amber-600 text-[#191614] ring-4 ring-amber-200/80 scale-105'
                      : 'bg-white text-purple-900 border-2 border-purple-200 group-hover:border-purple-500'
                  }`}
                >
                  {score}
                </div>
                <span className="text-[9px] font-mono-code text-[#847b73]">
                  CARD #{idx + 1}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Draw Ledger Information */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-1 text-xs border-t border-dashed border-[#d3c4b0]">
          <div>
            <span className="text-[10px] font-mono-code text-[#847b73] block uppercase">ACTIVE PRIZE POOL</span>
            <span className="text-lg font-bold font-mono-code text-[#191614]">
              ${poolAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-mono-code text-[#847b73] block uppercase">DRAW SCHEDULE</span>
            <span className="text-xs font-semibold text-[#57524d]">
              {drawDate} · 20:00 AEST
            </span>
          </div>

          <button
            onClick={handleInspect}
            className="px-3.5 py-1.5 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-900 text-xs font-semibold font-mono-code transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-700" />
            <span>{inspected ? 'Golden Seal Active' : 'Inspect Ticket'}</span>
          </button>
        </div>

      </div>

      {/* Sawtooth Perforated Bottom Edge */}
      <div className="h-3 w-full bg-[#fbf9f5] flex items-start overflow-hidden">
        <div className="w-full flex justify-between">
          {Array.from({ length: 32 }).map((_, i) => (
            <div
              key={i}
              className="w-3 h-3 bg-white transform rotate-45 -translate-y-1.5 border border-[#e6dcce]"
            />
          ))}
        </div>
      </div>

    </div>
  );
}
