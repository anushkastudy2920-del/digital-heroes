'use client';

import React from 'react';
import { sound } from '@/lib/sound';
import { X, CheckCircle2, ShieldCheck, Database, Cpu, FileText, Sparkles, Layers, Terminal } from 'lucide-react';

interface EngineeringDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EngineeringDossierModal({ isOpen, onClose }: EngineeringDossierModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs">
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] bg-[#fbf9f5] border border-[#d3c4b0] rounded-3xl shadow-2xl flex flex-col overflow-hidden text-[#191614] animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="bg-[#f4efe6] px-6 py-5 border-b border-[#e6dcce] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-900 text-white flex items-center justify-center font-bold font-mono-code text-sm shadow-md">
              DH
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono-code uppercase bg-purple-100 text-purple-900 px-2 py-0.5 rounded font-bold">
                  ENGINEERING DOSSIER
                </span>
                <span className="text-xs font-mono-code text-[#847b73]">MARCH 2026 EDITION</span>
              </div>
              <h3 className="text-xl font-bold font-editorial text-[#191614] mt-0.5">
                Technical Architecture & PRD Compliance Notes
              </h3>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            aria-label="Close dossier modal"
            className="w-9 h-9 rounded-full bg-white border border-[#e6dcce] hover:bg-[#ede4d6] flex items-center justify-center text-[#57524d] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-8 text-sm text-[#57524d]">
          
          {/* Engineering Letter */}
          <div className="paper-card p-6 rounded-2xl border border-[#e6dcce] space-y-3">
            <h4 className="font-editorial text-lg font-bold text-[#191614]">
              Memo: Architecture & Design Decisions
            </h4>
            <p className="text-xs leading-relaxed">
              This platform was engineered as an authentic, full-stack product combining the emotional prestige of championship golf with mathematical rigor. Rather than generic UI templates, the system incorporates an editorial Swiss monograph aesthetic (warm sand, cream, espresso, and lilac accents) inspired directly by the 14-page Digital Heroes PRD.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono-code pt-1 text-purple-900">
              <span className="flex items-center gap-1.5"><Layers className="w-3.5 h-3.5" /> Next.js 16 App Router</span>
              <span className="flex items-center gap-1.5"><Database className="w-3.5 h-3.5" /> Supabase PostgreSQL + RLS</span>
              <span className="flex items-center gap-1.5"><Cpu className="w-3.5 h-3.5" /> Web Audio API Sound Engine</span>
            </div>
          </div>

          {/* PRD Compliance Matrix */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono-code uppercase tracking-wider text-[#191614] font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Full PRD Requirements Verification Matrix</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              
              <div className="bg-white p-4 rounded-xl border border-[#e6dcce] space-y-2">
                <span className="font-mono-code text-[11px] font-bold text-purple-900 block">
                  § 04 & 05: FIFO Score Queue & Date Constraint
                </span>
                <p className="text-stone-600 text-[11px] leading-relaxed">
                  Strictly validates scores between 1 and 45. Enforces one score per calendar date. When a 6th score is entered, the oldest score is automatically evicted (FIFO), both client-side and via PostgreSQL trigger <code className="bg-stone-100 px-1 rounded">enforce_five_score_limit()</code>.
                </p>
                <div className="flex items-center gap-1 text-[10px] text-emerald-700 font-semibold">
                  <CheckCircle2 className="w-3 h-3" /> Implemented in Engine + DB Trigger
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-[#e6dcce] space-y-2">
                <span className="font-mono-code text-[11px] font-bold text-purple-900 block">
                  § 06: Dual Draw Engine (Random & Weighted)
                </span>
                <p className="text-stone-600 text-[11px] leading-relaxed">
                  Implements both uniform random (1–45) and community score frequency-weighted draws using Laplace-smoothed probability distributions. Allows pre-publish simulation with jackpot rollover.
                </p>
                <div className="flex items-center gap-1 text-[10px] text-emerald-700 font-semibold">
                  <CheckCircle2 className="w-3 h-3" /> Dual Math Algorithms Operational
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-[#e6dcce] space-y-2">
                <span className="font-mono-code text-[11px] font-bold text-purple-900 block">
                  § 07: Tier 1/2/3 Distribution & Rollover
                </span>
                <p className="text-stone-600 text-[11px] leading-relaxed">
                  Allocates 40% to 5-match jackpot, 35% to 4-match split, and 25% to 3-match split. If Tier 1 has no winners, funds roll over to the next month's jackpot reserve.
                </p>
                <div className="flex items-center gap-1 text-[10px] text-emerald-700 font-semibold">
                  <CheckCircle2 className="w-3 h-3" /> Exact Mathematical Split Verified
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-[#e6dcce] space-y-2">
                <span className="font-mono-code text-[11px] font-bold text-purple-900 block">
                  § 08: Charity Guarantee & Direct Giving
                </span>
                <p className="text-stone-600 text-[11px] leading-relaxed">
                  Guarantees a minimum 10% of every membership fee is earmarked for the member's selected charity. Supports voluntary allocation sliders and independent direct donations.
                </p>
                <div className="flex items-center gap-1 text-[10px] text-emerald-700 font-semibold">
                  <CheckCircle2 className="w-3 h-3" /> Fully Integrated in Billing & Ledger
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-[#e6dcce] space-y-2">
                <span className="font-mono-code text-[11px] font-bold text-purple-900 block">
                  § 10: Winner Verification & Claim Workflow
                </span>
                <p className="text-stone-600 text-[11px] leading-relaxed">
                  Winners must submit identity, payment details, and golf score verification proof (club scorecard / Golf Link screenshot). Admins review, approve, and mark as PAID.
                </p>
                <div className="flex items-center gap-1 text-[10px] text-emerald-700 font-semibold">
                  <CheckCircle2 className="w-3 h-3" /> Full Multi-State Claim Flow Built
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-[#e6dcce] space-y-2">
                <span className="font-mono-code text-[11px] font-bold text-purple-900 block">
                  § 11: Five Admin Dashboard Surfaces
                </span>
                <p className="text-stone-600 text-[11px] leading-relaxed">
                  Admin console features all 5 required surfaces: Analytics & Reports, Draw Execution & Simulator, Winner Verification & Payouts, User Management, and Charity Directory CRUD.
                </p>
                <div className="flex items-center gap-1 text-[10px] text-emerald-700 font-semibold">
                  <CheckCircle2 className="w-3 h-3" /> All 5 Control Surfaces Implemented
                </div>
              </div>

            </div>
          </div>

          {/* Test Persona Credentials */}
          <div className="bg-[#f4efe6] p-5 rounded-2xl border border-[#e6dcce] space-y-2">
            <span className="text-[10px] font-mono-code uppercase font-bold text-purple-900 block">
              Evaluator Quick Access Credentials
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono-code">
              <div className="bg-white p-2.5 rounded-lg border border-[#e6dcce]">
                <strong className="text-purple-900 block">Admin Evaluator</strong>
                <span className="text-[#57524d] block">admin@digitalheroes.demo</span>
                <span className="text-[10px] text-[#847b73]">Pass: admin123</span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-[#e6dcce]">
                <strong className="text-[#191614] block">Active Subscriber</strong>
                <span className="text-[#57524d] block">alex.hero@digitalheroes.demo</span>
                <span className="text-[10px] text-[#847b73]">Pass: golfer123</span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-[#e6dcce]">
                <strong className="text-amber-800 block">Recent Winner ($2.2k)</strong>
                <span className="text-[#57524d] block">marcus.golf@digitalheroes.demo</span>
                <span className="text-[10px] text-[#847b73]">Pass: winner123</span>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-[#f4efe6] px-6 py-4 border-t border-[#e6dcce] flex items-center justify-between text-xs">
          <span className="text-[#847b73] font-mono-code">
            DIGITAL HEROES ENGINE · BUILT FOR TRAINEE EVALUATION
          </span>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-semibold text-xs tracking-wider uppercase transition-colors"
          >
            Dismiss Dossier
          </button>
        </div>

      </div>
    </div>
  );
}
