'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store';
import { sound } from '@/lib/sound';
import InteractiveScorecard from '@/components/golf/InteractiveScorecard';
import FiveScoreFIFOVisualizer from '@/components/golf/FiveScoreFIFOVisualizer';
import InteractivePrizeEstimator from '@/components/golf/InteractivePrizeEstimator';
import LiveDrawCountdown from '@/components/draw/LiveDrawCountdown';
import PhysicalPerforatedTicket from '@/components/draw/PhysicalPerforatedTicket';
import LotteryDrumSimulator from '@/components/interactive/LotteryDrumSimulator';
import QuickExplainerModal from '@/components/layout/QuickExplainerModal';
import { 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Heart, 
  Coins, 
  Users, 
  Lock,
  ChevronRight,
  ExternalLink,
  Sparkles,
  HelpCircle,
  Trophy,
  Calendar,
  Clock,
  Flame,
  Award
} from 'lucide-react';

export default function HomePage() {
  const { charities, draws, allSubscriptions } = useApp();
  const [explainerOpen, setExplainerOpen] = useState(false);

  const totalSubscribers = allSubscriptions.filter(s => s.status === 'active').length;
  const totalCharityRaised = charities.reduce((sum, c) => sum + c.totalRaised, 0);
  const latestDraw = draws[0] || null;
  const activePoolAmount = latestDraw ? latestDraw.totalPool : 34250;
  const featuredCharities = charities.filter(c => c.featured);

  return (
    <>
      <QuickExplainerModal isOpen={explainerOpen} onClose={() => setExplainerOpen(false)} />

      <div className="space-y-28 pb-32">
        
        {/* 1. HERO SECTION: Quiet Luxury Masthead & Cinematic Photography */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-16 space-y-12">
          
          {/* Top Minimalist Ledger Marker */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e8e3da] pb-4 text-xs font-mono-code text-[#8c857b]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
              <span className="text-[#141210] font-bold tracking-wider uppercase">CYCLE XIV LIVE</span>
              <span>·</span>
              <span>SETTLEMENT: MARCH 27, 2026 · 20:00 AEST</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-emerald-800 font-bold font-mono-code bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                ${activePoolAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
              <span>ACTIVE POOL</span>
            </div>
          </div>

          {/* Main Editorial Masthead */}
          <div className="max-w-4xl space-y-6">
            
            {/* Quick 30-Sec Visual Walkthrough Pill */}
            <div>
              <button
                onClick={() => {
                  sound.playClick();
                  setExplainerOpen(true);
                }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-900 text-xs font-mono-code transition-all shadow-2xs cursor-pointer group"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-700" />
                <span className="font-semibold">New Visitor? View 30-Second Visual Walkthrough</span>
                <ChevronRight className="w-3.5 h-3.5 text-purple-700 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#141210] leading-[1.08]">
              Turn your weekend 18 holes into a verified <span className="font-editorial italic font-normal text-purple-900">$34,250 prize draw</span> — while funding grassroots charity.
            </h1>
            
            <p className="text-base sm:text-lg text-[#57534e] leading-relaxed max-w-2xl font-normal">
              Digital Heroes is a private philanthropic syndicate for amateur golfers across Australia. Submit your official Stableford scores (1–45 pts). Your rolling five cards automatically form your monthly entry, with ten percent of every membership guaranteed to partner charities.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-3">
              <Link
                href="/subscribe"
                onClick={() => sound.playChime()}
                className="px-8 py-4 rounded-full bg-[#141210] hover:bg-[#282522] text-white font-medium text-xs tracking-wider uppercase transition-all shadow-sm flex items-center gap-2.5 cursor-pointer"
              >
                <span>Join Syndicate — $19/mo</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/how-it-works"
                onClick={() => sound.playClick()}
                className="px-7 py-4 rounded-full bg-white hover:bg-[#f4efe6] text-[#141210] font-medium text-xs tracking-wider uppercase border border-[#d6cfc2] transition-colors shadow-2xs"
              >
                How It Works
              </Link>

              <button
                onClick={() => {
                  sound.playClick();
                  setExplainerOpen(true);
                }}
                className="px-6 py-4 rounded-full bg-[#faf8f5] hover:bg-[#f3efe6] text-[#57534e] hover:text-[#141210] text-xs font-mono-code transition-colors border border-[#e8e3da] cursor-pointer flex items-center gap-2"
              >
                <HelpCircle className="w-3.5 h-3.5 text-stone-500" />
                <span>Explain in Plain English</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-4 text-xs font-mono-code text-[#8c857b]">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" /> WHS Stableford Standard</span>
              <span className="flex items-center gap-1.5"><Heart className="w-3.5 h-3.5 text-purple-700" /> 10% Minimum Guaranteed Charity</span>
              <span className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5 text-stone-700" /> Deterministic SHA-256 Draw Audit</span>
            </div>
          </div>

          {/* Cinematic Photography: Championship Coastal Links */}
          <div className="relative rounded-3xl overflow-hidden shadow-sm border border-[#e8e3da]">
            <img
              src="/images/hero-links.jpg"
              alt="Championship Coastal Links Golf Course at Sunrise"
              className="w-full h-[440px] sm:h-[500px] object-cover"
            />
            
            {/* Subtle Bottom Caption Bar */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 text-white flex flex-wrap items-end justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono-code uppercase tracking-wider text-stone-300 block">
                  AFFILIATED TOURNAMENT LINKS
                </span>
                <p className="text-sm font-editorial italic font-normal text-white">
                  Muirfield & Portrush — where every official stroke index is recognized under WHS rules.
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono-code uppercase tracking-wider text-amber-300 block">
                  MONTHLY REWARD POOL
                </span>
                <span className="text-xl sm:text-2xl font-bold font-mono-code">
                  ${activePoolAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

        </section>

        {/* 2. LIVE SETTLEMENT ENGINE & REAL-TIME PRECISION COUNTDOWN */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <LiveDrawCountdown />
        </section>

        {/* 3. CRYSTAL CLEAR: HOW DIGITAL HEROES WORKS IN 3 SIMPLE STEPS */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-mono-code uppercase tracking-widest text-purple-900 font-bold block">
              EFFORTLESS & INTUITIVE FOR EVERY GOLFER
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-editorial text-[#141210]">
              How It Works In 3 Simple Steps
            </h2>
            <p className="text-xs sm:text-sm text-[#57534e]">
              No complicated lottery forms or picking lucky numbers. Your game does all the work:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Step 1 */}
            <div className="luxury-card p-8 rounded-3xl border border-[#e8e3da] bg-white space-y-4 relative overflow-hidden">
              <span className="text-4xl font-bold font-mono-code text-[#e8e3da] absolute top-5 right-6 select-none">
                01
              </span>
              <div className="w-10 h-10 rounded-2xl bg-stone-100 border border-stone-200 flex items-center justify-center text-[#141210]">
                <Calendar className="w-5 h-5 text-[#141210]" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-[#141210]">
                  Play Your Normal Weekend 18
                </h3>
                <p className="text-xs sm:text-sm text-[#57534e] leading-relaxed">
                  Head out to your local club or any Australian golf course. At the end of your round, enter your official Stableford score (1–45 points).
                </p>
              </div>
              <div className="pt-2 border-t border-[#e8e3da] text-[11px] font-mono-code text-[#8c857b]">
                ✓ Validated against official WHS rules
              </div>
            </div>

            {/* Step 2 */}
            <div className="luxury-card p-8 rounded-3xl border border-[#e8e3da] bg-white space-y-4 relative overflow-hidden">
              <span className="text-4xl font-bold font-mono-code text-[#e8e3da] absolute top-5 right-6 select-none">
                02
              </span>
              <div className="w-10 h-10 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-900">
                <Trophy className="w-5 h-5 text-purple-900" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-[#141210]">
                  Your Last 5 Scores = Your Entry
                </h3>
                <p className="text-xs sm:text-sm text-[#57534e] leading-relaxed">
                  Your most recent five scores automatically form your active monthly lottery ticket. When you play a 6th round, the oldest score rolls off.
                </p>
              </div>
              <div className="pt-2 border-t border-[#e8e3da] text-[11px] font-mono-code text-purple-900 font-semibold">
                ✓ Never pick numbers manually
              </div>
            </div>

            {/* Step 3 */}
            <div className="luxury-card p-8 rounded-3xl border border-[#e8e3da] bg-white space-y-4 relative overflow-hidden">
              <span className="text-4xl font-bold font-mono-code text-[#e8e3da] absolute top-5 right-6 select-none">
                03
              </span>
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800">
                <Heart className="w-5 h-5 text-emerald-800" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-[#141210]">
                  Win Cash & Give to Charity
                </h3>
                <p className="text-xs sm:text-sm text-[#57534e] leading-relaxed">
                  Monthly draws match 3, 4, or 5 numbers for prizes up to $34,250. Ten percent of every membership goes directly to children’s hospitals and youth golf.
                </p>
              </div>
              <div className="pt-2 border-t border-[#e8e3da] text-[11px] font-mono-code text-emerald-800 font-semibold">
                ✓ Guaranteed 10% charity minimum
              </div>
            </div>

          </div>
        </section>

        {/* 4. SKEUOMORPHIC HANDCRAFTED TICKET STUB SHOWCASE */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="border-b border-[#e8e3da] pb-3 flex items-center justify-between">
            <h2 className="text-xs font-mono-code uppercase tracking-widest text-[#8c857b] font-semibold">
              AUTHENTIC PHYSICAL SPECIFICATION · SKEUOMORPHIC TICKET STUB
            </h2>
            <span className="text-xs font-mono-code text-purple-900 font-semibold">PERFORATED EDITION</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <PhysicalPerforatedTicket 
                serialNumber="#DH-2026-03-88219"
                memberName="Marcus Brody (Melbourne)"
                charityName="Australian Junior Golf Foundation"
                scores={[29, 34, 36, 38, 41]}
                drawDate="March 27, 2026"
                poolAmount={activePoolAmount}
              />
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="luxury-card p-6 rounded-2xl space-y-3">
                <span className="text-[11px] font-mono-code text-purple-900 font-bold block uppercase">
                  WHY PHYSICAL STUB ARCHITECTURE?
                </span>
                <h4 className="text-lg font-bold font-editorial text-[#141210]">
                  No Random Computer Digits
                </h4>
                <p className="text-xs text-[#57524e] leading-relaxed">
                  Unlike conventional lottery tickets printed with algorithmic pseudo-random numbers, your Digital Heroes stub represents your authentic 18-hole scorecards carded at affiliated clubs.
                </p>
                <div className="pt-3 border-t border-[#e8e3da] space-y-2 text-xs font-mono-code text-[#57524e]">
                  <div className="flex justify-between">
                    <span>Authentic Serial:</span>
                    <span className="font-bold text-[#141210]">#DH-2026-03-88219</span>
                  </div>
                  <div className="flex justify-between">
                    <span>WHS Handicap Index:</span>
                    <span className="font-bold text-[#141210]">12.4 (Kingston Heath)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Charity Endowed:</span>
                    <span className="font-bold text-emerald-800">10% Irrevocable</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. INTERACTIVE 5-SCORE FIFO QUEUE DEMONSTRATOR */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <FiveScoreFIFOVisualizer />
        </section>

        {/* 6. MECHANICAL GOLDEN SPHERE LOTTERY DRUM CEREMONY (PRD § 06) */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="border-b border-[#e8e3da] pb-3 flex items-center justify-between">
            <h2 className="text-xs font-mono-code uppercase tracking-widest text-[#8c857b] font-semibold">
              THE AUDITED DRAW CEREMONY · MECHANICAL GOLDEN SPHERE CAGE
            </h2>
            <span className="text-xs font-mono-code text-amber-600 font-semibold">PRD LEVEL 1 § 06</span>
          </div>

          <LotteryDrumSimulator />
        </section>

        {/* 7. INTERACTIVE PRIZE SIMULATOR & CHARITY CALCULATOR */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <InteractivePrizeEstimator />
        </section>

        {/* 8. THE SYNDICATE SPECIFICATION (Quiet, Authoritative 4-Pillar Grid) */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="border-b border-[#e8e3da] pb-3 flex items-center justify-between">
            <h2 className="text-xs font-mono-code uppercase tracking-widest text-[#8c857b] font-semibold">
              THE PLATFORM ARCHITECTURE · FOUR CORE RULES
            </h2>
            <span className="text-xs font-mono-code text-[#8c857b]">PRD LEVEL 1 COMPLIANT</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="luxury-card p-6 sm:p-7 rounded-2xl space-y-3">
              <span className="text-xs font-mono-code text-purple-900 font-bold block">§ 01 · SCORING</span>
              <h3 className="text-base font-bold text-[#141210]">1–45 Stableford Points</h3>
              <p className="text-xs text-[#57524e] leading-relaxed">
                Standard World Handicap System format. Points award net excellence relative to your handicap index. Single score permitted per calendar date.
              </p>
            </div>

            <div className="luxury-card p-6 sm:p-7 rounded-2xl space-y-3">
              <span className="text-xs font-mono-code text-purple-900 font-bold block">§ 02 · ROLLING TICKET</span>
              <h3 className="text-base font-bold text-[#141210]">5-Score FIFO Queue</h3>
              <p className="text-xs text-[#57524e] leading-relaxed">
                Your latest five rounds automatically form your active monthly lottery ticket. Submitting a new card drops the oldest score automatically.
              </p>
            </div>

            <div className="luxury-card p-6 sm:p-7 rounded-2xl space-y-3">
              <span className="text-xs font-mono-code text-purple-900 font-bold block">§ 03 · CHARITY ENDOWMENT</span>
              <h3 className="text-base font-bold text-[#141210]">10% Guaranteed Minimum</h3>
              <p className="text-xs text-[#57524e] leading-relaxed">
                A minimum 10% of every membership fee is irrevocably directed to your chosen beneficiary on day one. Members can boost this to 50% anytime.
              </p>
            </div>

            <div className="luxury-card p-6 sm:p-7 rounded-2xl space-y-3">
              <span className="text-xs font-mono-code text-purple-900 font-bold block">§ 04 · PRIZE DRAW</span>
              <h3 className="text-base font-bold text-[#141210]">40% / 35% / 25% Split</h3>
              <p className="text-xs text-[#57524e] leading-relaxed">
                Verified monthly draws reward 3, 4, and 5-number matches. If the 5-match jackpot is unclaimed, it carries forward to next month’s pool.
              </p>
            </div>

          </div>
        </section>

        {/* 9. OFFICIAL TOURNAMENT SCORECARD BUILDER (§ 05) */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="border-b border-[#e8e3da] pb-3 flex items-center justify-between">
            <h2 className="text-xs font-mono-code uppercase tracking-widest text-[#8c857b] font-semibold">
              TOURNAMENT STABLEFORD SCORECARD SIMULATOR
            </h2>
            <span className="text-xs font-mono-code text-purple-900 font-semibold">WORLD HANDICAP SYSTEM</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8">
              <InteractiveScorecard />
            </div>

            <div className="lg:col-span-4 space-y-4">
              <div className="rounded-2xl overflow-hidden border border-[#e8e3da] shadow-xs">
                <img
                  src="/images/scorecard.jpg"
                  alt="Tournament Paper Scorecard with Pencil and Srixon Ball"
                  className="w-full h-64 object-cover"
                />
              </div>

              <div className="luxury-card p-6 rounded-2xl space-y-3">
                <h4 className="font-editorial text-base font-bold text-[#141210]">
                  Handicap Allowance Standard
                </h4>
                <p className="text-xs text-[#57524e] leading-relaxed">
                  Stableford levels the playing field between scratch golfers and higher handicappers. Each hole receives strokes according to Course Stroke Index (SI 1–18).
                </p>
                <div className="pt-2 border-t border-[#e8e3da] text-xs font-mono-code text-[#8c857b]">
                  Valid score entries: 1 to 45 points inclusive.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 10. VERIFIED MEMBER WINNER SPOTLIGHT: Marcus Brody */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="border-b border-[#e8e3da] pb-3 flex items-center justify-between">
            <h2 className="text-xs font-mono-code uppercase tracking-widest text-[#8c857b] font-semibold">
              VERIFIED MEMBER SETTLEMENT ARCHIVE
            </h2>
            <span className="text-xs font-mono-code text-emerald-800 font-semibold">AUDITED & PAID</span>
          </div>

          <div className="luxury-card rounded-3xl overflow-hidden border border-[#e8e3da] grid grid-cols-1 lg:grid-cols-12">
            
            <div className="lg:col-span-5 relative bg-[#f4efe6]">
              <img
                src="/images/winner-marcus.jpg"
                alt="Marcus Brody, Draw #13 Winner at Clubhouse Veranda"
                className="w-full h-full object-cover min-h-[340px]"
              />
              <div className="absolute top-4 left-4 bg-[#141210]/90 text-white px-3 py-1 rounded-full text-[11px] font-mono-code">
                Draw #13 Tier 2 Winner
              </div>
            </div>

            <div className="lg:col-span-7 p-8 sm:p-12 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold font-mono-code text-[#141210]">
                    $2,263.33
                  </span>
                  <span className="text-xs font-mono-code text-[#8c857b]">AWARDED & PAID</span>
                </div>

                <blockquote className="font-editorial text-lg sm:text-xl text-[#141210] italic leading-relaxed">
                  “I’ve played off a 12 handicap at Kingston Heath for ten years. When I carded 38 points on Saturday, I never imagined 4 numbers would hit Tier 2. Two weeks later, $2,263 was in my bank account — and $226 went straight to the Royal Children’s Hospital.”
                </blockquote>

                <div className="text-xs font-mono-code text-[#57524d]">
                  <strong className="text-[#141210] font-sans font-bold text-sm block">Marcus Brody</strong>
                  <span>Member since Oct 2025 · Kingston Heath GC (Melbourne)</span>
                </div>
              </div>

              <div className="bg-[#faf8f5] p-4 rounded-xl border border-[#e8e3da] grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono-code">
                <div>
                  <span className="text-[#8c857b] text-[10px] block">MATCHED</span>
                  <span className="font-bold text-[#141210]">4 of 5 Numbers</span>
                </div>
                <div>
                  <span className="text-[#8c857b] text-[10px] block">WINNING CARD</span>
                  <span className="font-bold text-purple-900">38 Pts (March 14)</span>
                </div>
                <div>
                  <span className="text-[#8c857b] text-[10px] block">CHARITY GIFT</span>
                  <span className="font-bold text-emerald-800">$226.33 (10%)</span>
                </div>
                <div>
                  <span className="text-[#8c857b] text-[10px] block">PAYOUT ID</span>
                  <span className="font-bold text-[#8c857b]">#PO-9821-V</span>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* 11. CHARITY DIRECTORY SPOTLIGHT */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="border-b border-[#e8e3da] pb-3 flex items-center justify-between">
            <h2 className="text-xs font-mono-code uppercase tracking-widest text-[#8c857b] font-semibold">
              VERIFIED CHARITABLE CAUSES
            </h2>
            <Link
              href="/charities"
              onClick={() => sound.playClick()}
              className="text-xs font-mono-code text-[#141210] hover:text-purple-900 font-semibold"
            >
              EXPLORE FULL DIRECTORY ({charities.length}) →
            </Link>
          </div>

          {/* Featured Beneficiary */}
          <div className="luxury-card rounded-3xl overflow-hidden border border-[#e8e3da] grid grid-cols-1 lg:grid-cols-12 mb-8">
            <div className="lg:col-span-7 relative">
              <img
                src="/images/charity-kids.jpg"
                alt="Young children learning golf at Australian Junior Golf Foundation clinic"
                className="w-full h-full object-cover min-h-[320px]"
              />
            </div>
            <div className="lg:col-span-5 p-8 sm:p-10 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <span className="text-[10px] font-mono-code uppercase tracking-wider text-purple-900 font-bold bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200 inline-block">
                  FEATURED BENEFICIARY
                </span>
                <h3 className="text-2xl font-bold font-editorial text-[#141210]">
                  Australian Junior Golf Foundation
                </h3>
                <p className="text-xs text-[#57524d] leading-relaxed">
                  Funding equipment, coaching, and subsidised green fees for over 1,200 underprivileged youth across regional golf clubs. Over $14,200 donated by Digital Heroes members to date.
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-[#e8e3da]">
                <div className="flex justify-between text-xs font-mono-code">
                  <span className="font-bold text-[#141210]">$14,200 Raised</span>
                  <span className="text-[#8c857b]">Target: $25,000</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#f4efe6] overflow-hidden">
                  <div className="h-full bg-[#141210] rounded-full w-[57%]" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 12. MEMBERSHIP SUBSCRIPTION CALL TO ACTION */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#141210] text-white p-10 sm:p-16 rounded-3xl space-y-8 text-center shadow-xl">
            <div className="max-w-2xl mx-auto space-y-3">
              <span className="text-xs font-mono-code uppercase tracking-widest text-[#8c857b] font-semibold">
                MEMBERSHIP REGISTRATION
              </span>
              <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
                Join the private golf syndicate.
              </h2>
              <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
                $19 per month or $190 per year. Direct ten percent to your chosen cause on day one, and enter your 18-hole Stableford scores for verified monthly prize pools.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link
                href="/subscribe"
                onClick={() => sound.playChime()}
                className="px-8 py-4 rounded-full bg-white hover:bg-stone-100 text-[#141210] font-semibold text-xs tracking-wider uppercase transition-all shadow-md"
              >
                Select Membership Tier
              </Link>
              <Link
                href="/login"
                onClick={() => sound.playClick()}
                className="px-7 py-4 rounded-full bg-stone-900 hover:bg-stone-800 text-stone-200 text-xs font-mono-code border border-stone-800 transition-colors"
              >
                Evaluator Test Personas
              </Link>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
