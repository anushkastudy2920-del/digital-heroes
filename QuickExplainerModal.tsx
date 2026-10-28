'use client';

import React, { useState } from 'react';
import { sound } from '@/lib/sound';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  Trophy, 
  Heart, 
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import Link from 'next/link';

interface QuickExplainerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickExplainerModal({ isOpen, onClose }: QuickExplainerModalProps) {
  const [slide, setSlide] = useState<number>(0);

  if (!isOpen) return null;

  const slides = [
    {
      badge: 'Step 1 of 4 · The Foundation',
      title: 'What is Digital Heroes?',
      tagline: 'A private golf syndicate connecting your passion for the game with real charity impact.',
      description: 'Instead of buying ordinary lottery tickets with random computer numbers, you enter your genuine weekend 18-hole golf scores. Every month, verified draws reward golfers with up to $34,250 in cash prizes while ten percent goes directly to charity.',
      highlight: 'Play golf. Support causes. Win prizes.',
      icon: Trophy,
    },
    {
      badge: 'Step 2 of 4 · Standardized Scoring',
      title: 'How do you enter?',
      tagline: '18 holes, 1 to 45 Stableford points — exactly as you play under World Handicap System rules.',
      description: 'Whenever you play a weekend competition or friendly round at any registered Australian club, simply enter your final Stableford score. Stableford levels the playing field so high handicappers and scratch golfers compete fairly.',
      highlight: 'Accepts official scores between 1 and 45 points inclusive.',
      icon: Sparkles,
    },
    {
      badge: 'Step 3 of 4 · The Rolling Ticket',
      title: 'How does your ticket work?',
      tagline: 'Your last 5 golf rounds automatically create your active syndicate entry.',
      description: 'You never have to guess lucky numbers. As you play golf through the season, your 5 most recent cards form your 5-number lottery ticket. When you card round #6, your oldest round smoothly rolls off (FIFO queue).',
      highlight: 'Zero manual picking required. Your game is your entry.',
      icon: ShieldCheck,
    },
    {
      badge: 'Step 4 of 4 · Winning & Giving',
      title: 'How do you win and give?',
      tagline: 'Transparent monthly draws with 3 prize tiers and guaranteed charity endowment.',
      description: 'Match 5 numbers to win the 40% Jackpot ($13,700+). Match 4 numbers for the 35% Tier 2 pool. Match 3 numbers for the 25% Tier 3 pool. Plus, at least 10% of every membership fee is donated to your chosen charity from day one.',
      highlight: 'Audited with deterministic SHA-256 cryptographic verification.',
      icon: Heart,
    },
  ];

  const current = slides[slide];
  const IconComponent = current.icon;

  const nextSlide = () => {
    sound.playClick();
    if (slide < slides.length - 1) {
      setSlide(s => s + 1);
    } else {
      onClose();
    }
  };

  const prevSlide = () => {
    sound.playClick();
    if (slide > 0) {
      setSlide(s => s - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#141210]/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="w-full max-w-xl bg-white rounded-3xl border border-[#e8e3da] shadow-2xl p-6 sm:p-10 space-y-6 relative overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          onClick={() => { sound.playClick(); onClose(); }}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-[#faf8f5] text-[#8c857b] hover:text-[#141210] transition-colors cursor-pointer"
          aria-label="Close walkthrough"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Progress Bar */}
        <div className="flex items-center gap-1.5 pt-1">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full flex-1 transition-all duration-300 ${
                i === slide ? 'bg-[#141210]' : i < slide ? 'bg-[#8c857b]' : 'bg-[#e8e3da]'
              }`}
            />
          ))}
        </div>

        {/* Slide Content */}
        <div className="space-y-4 pt-2 min-h-[220px]">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono-code uppercase tracking-wider text-purple-900 font-bold bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
              {current.badge}
            </span>
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl sm:text-3xl font-bold font-editorial text-[#141210]">
              {current.title}
            </h3>
            <p className="text-sm font-editorial italic text-purple-900 font-normal">
              {current.tagline}
            </p>
          </div>

          <p className="text-xs sm:text-sm text-[#57534e] leading-relaxed">
            {current.description}
          </p>

          <div className="p-3.5 rounded-xl bg-[#faf8f5] border border-[#e8e3da] text-xs font-mono-code text-[#141210] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>{current.highlight}</span>
          </div>
        </div>

        {/* Modal Controls */}
        <div className="pt-4 border-t border-[#e8e3da] flex items-center justify-between">
          <button
            onClick={prevSlide}
            disabled={slide === 0}
            className="flex items-center gap-1.5 text-xs font-mono-code text-[#57534e] hover:text-[#141210] disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="flex items-center gap-3">
            {slide === slides.length - 1 ? (
              <Link
                href="/subscribe"
                onClick={() => { sound.playChime(); onClose(); }}
                className="px-6 py-2.5 rounded-full bg-[#141210] hover:bg-[#282522] text-white text-xs font-mono-code uppercase tracking-wider transition-colors flex items-center gap-2"
              >
                <span>Join Syndicate — $19/mo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <button
                onClick={nextSlide}
                className="px-6 py-2.5 rounded-full bg-[#141210] hover:bg-[#282522] text-white text-xs font-mono-code uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>Next Step</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
