import React from 'react';
import Link from 'next/link';
import { Heart, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-[#e8e3da] bg-[#faf8f5] pt-16 pb-12 text-[#57534e] text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full border border-[#141210] flex items-center justify-center font-editorial font-bold text-xs text-[#141210]">
                DH
              </div>
              <span className="font-serif-luxury tracking-[0.22em] uppercase text-sm font-semibold text-[#141210]">
                Digital Heroes
              </span>
            </div>
            <p className="text-[#8c857b] leading-relaxed">
              A private philanthropic golf syndicate. Directing verified portions of member subscriptions toward national health and junior sports foundations while competing for mathematically enforced prize pools.
            </p>
            <div className="flex items-center gap-2 text-stone-600 font-mono-code text-[11px]">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>PCI-Compliant · Deterministic Audit Trail</span>
            </div>
          </div>

          <div>
            <h4 className="text-[#141210] font-bold tracking-wider uppercase mb-4 font-mono-code text-[11px]">Syndicate</h4>
            <ul className="space-y-2.5">
              <li><Link href="/how-it-works" className="hover:text-[#141210] transition-colors">How It Works</Link></li>
              <li><Link href="/draws" className="hover:text-[#141210] transition-colors">Monthly Prize Pools</Link></li>
              <li><Link href="/charities" className="hover:text-[#141210] transition-colors">Charity Directory</Link></li>
              <li><Link href="/subscribe" className="hover:text-[#141210] transition-colors">Membership Registration</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[#141210] font-bold tracking-wider uppercase mb-4 font-mono-code text-[11px]">PRD Rule Engine</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-1.5 text-[#57534e]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span>1–45 Stableford Scoring (§ 05)</span>
              </li>
              <li className="flex items-center gap-1.5 text-[#57534e]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span>Rolling 5-Score FIFO Queue (§ 05)</span>
              </li>
              <li className="flex items-center gap-1.5 text-[#57534e]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span>40% / 35% / 25% Prize Tier Split (§ 07)</span>
              </li>
              <li className="flex items-center gap-1.5 text-[#57534e]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span>Min 10% Guaranteed Charity (§ 08)</span>
              </li>
              <li className="flex items-center gap-1.5 text-[#57534e]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span>5-Match Jackpot Rollover (§ 07)</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[#141210] font-bold tracking-wider uppercase mb-4 font-mono-code text-[11px]">Evaluation Package</h4>
            <div className="p-4 rounded-2xl bg-white border border-[#e8e3da] space-y-2 shadow-2xs">
              <p className="text-[#141210] font-semibold">Trainee Assignment Brief</p>
              <p className="text-[11px] text-[#8c857b] leading-relaxed">
                Engineered to PRD specifications (March 2026 Edition) with Supabase PostgreSQL backend, rolling score trigger, and admin verification console.
              </p>
              <div className="pt-1 text-[11px] text-[#141210] font-mono-code font-bold">
                Level 1 Full-Stack Trainee Assignment
              </div>
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-[#e8e3da] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#8c857b] font-mono-code">
          <p>© 2026 Digital Heroes Ltd. All rights reserved.</p>
          <div className="flex items-center gap-1.5">
            <span>Amateur Golf & Philanthropic Impact</span>
            <span>·</span>
            <span>Level 1 Selection Submission</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
