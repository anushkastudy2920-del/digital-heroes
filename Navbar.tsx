'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/lib/store';
import { sound } from '@/lib/sound';
import { 
  User as UserIcon, 
  LogOut, 
  Menu, 
  X, 
  ChevronDown,
  Volume2,
  VolumeX,
  FileCode2,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import EngineeringDossierModal from './EngineeringDossierModal';
import QuickExplainerModal from './QuickExplainerModal';
import RealtimeClubhousePulse from './RealtimeClubhousePulse';
import { Headphones } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { currentUser, subscription, logout, switchUser, allUsers } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(false);
  const [dossierOpen, setDossierOpen] = useState(false);
  const [explainerOpen, setExplainerOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [ambienceOn, setAmbienceOn] = useState(false);

  const isActive = (path: string) => pathname === path;

  const toggleAudio = () => {
    const newState = sound.toggle();
    setSoundOn(newState);
  };

  const toggleAmbienceAudio = () => {
    const active = sound.toggleAmbience();
    setAmbienceOn(active);
  };

  const handleRoleSwitch = (userId: string) => {
    sound.playSwitch();
    switchUser(userId);
    setRoleSwitcherOpen(false);
  };

  return (
    <>
      <EngineeringDossierModal isOpen={dossierOpen} onClose={() => setDossierOpen(false)} />
      <QuickExplainerModal isOpen={explainerOpen} onClose={() => setExplainerOpen(false)} />

      {/* 1. DISCREET REVIEWER & AUDIT TOP BAR */}
      <aside aria-label="Reviewer mode notice" className="bg-[#f3efe6] border-b border-[#e8e3da] text-[11px] px-4 sm:px-8 py-1.5 flex flex-wrap items-center justify-between gap-2 z-50 text-[#57534e] font-mono-code">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
          <span className="uppercase tracking-wider font-semibold text-[#141210]">EVALUATOR MODE:</span>
          <span>{currentUser?.fullName || 'Public Visitor'} ({currentUser?.role || 'Guest'})</span>
        </div>

        <div className="flex items-center gap-2">
          {/* 30-Sec Visual Guide */}
          <button
            onClick={() => {
              sound.playClick();
              setExplainerOpen(true);
            }}
            className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-100/80 border border-purple-200 hover:border-purple-800 text-purple-900 transition-colors shadow-2xs cursor-pointer"
            title="30-Second Plain English Visual Walkthrough"
          >
            <Sparkles className="w-3 h-3 text-purple-700" />
            <span className="font-semibold">30s Guide</span>
          </button>

          {/* Ambience Links Breeze */}
          <button
            onClick={toggleAmbienceAudio}
            className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border transition-colors shadow-2xs cursor-pointer ${
              ambienceOn 
                ? 'bg-emerald-100 border-emerald-300 text-emerald-900 font-semibold' 
                : 'bg-white border-[#d6cfc2] hover:border-[#141210] text-[#57534e]'
            }`}
            title="Toggle Coastal Clubhouse Ambience Soundscape"
          >
            <Headphones className={`w-3 h-3 ${ambienceOn ? 'text-emerald-700' : 'text-stone-400'}`} />
            <span>{ambienceOn ? 'Links Ambience: On' : 'Ambience'}</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleAudio}
            className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white border border-[#d6cfc2] hover:border-[#141210] text-[#57534e] hover:text-[#141210] transition-colors shadow-2xs cursor-pointer"
            title="Toggle Luxury Micro-Audio"
          >
            {soundOn ? <Volume2 className="w-3 h-3 text-[#141210]" /> : <VolumeX className="w-3 h-3 text-stone-400" />}
            <span className="font-medium">{soundOn ? 'Sound: On' : 'Off'}</span>
          </button>

          {/* Engineering PRD Notes */}
          <button
            onClick={() => {
              sound.playClick();
              setDossierOpen(true);
            }}
            className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white border border-[#d6cfc2] hover:border-[#141210] text-[#141210] transition-colors shadow-2xs cursor-pointer"
            title="Inspect PRD Architecture and Compliance Matrix"
          >
            <FileCode2 className="w-3 h-3 text-purple-700" />
            <span className="font-medium">PRD Specs</span>
          </button>

          {/* Quick Persona Switcher */}
          <div className="relative">
            <button
              onClick={() => {
                sound.playClick();
                setRoleSwitcherOpen(!roleSwitcherOpen);
              }}
              className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#141210] text-white hover:bg-[#282522] transition-colors font-medium shadow-2xs cursor-pointer"
            >
              <span>Personas</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {roleSwitcherOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-[#e8e3da] shadow-xl p-2 z-50 text-[#141210]">
                <div className="text-[10px] uppercase font-bold tracking-wider text-[#8c857b] px-3 py-1.5">
                  Select Evaluation Persona:
                </div>
                {allUsers.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => handleRoleSwitch(u.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between text-xs transition-colors cursor-pointer ${
                      currentUser?.id === u.id ? 'bg-[#141210] text-white font-medium' : 'hover:bg-[#f7f4ee] text-[#141210]'
                    }`}
                  >
                    <div className="truncate">
                      <div className="font-semibold truncate">{u.fullName}</div>
                      <div className="text-[10px] opacity-75 capitalize">{u.role}</div>
                    </div>
                    {u.role === 'admin' ? (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono-code ${currentUser?.id === u.id ? 'bg-white/20 text-white' : 'bg-purple-100 text-purple-900'}`}>Admin</span>
                    ) : (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono-code ${currentUser?.id === u.id ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-700'}`}>Golfer</span>
                    )}
                  </button>
                ))}
                <hr className="my-1 border-[#e8e3da]" />
                <button
                  onClick={() => {
                    sound.playClick();
                    logout();
                    setRoleSwitcherOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 rounded-xl hover:bg-rose-50 text-rose-700 text-xs flex items-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Public Visitor (Log Out)</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* 2. REAL-TIME CLUBHOUSE PULSE MARQUEE */}
      <RealtimeClubhousePulse />

      {/* 3. MAIN QUIET LUXURY NAVBAR */}
      <header className="sticky top-0 z-40 w-full bg-[#faf8f5]/90 backdrop-blur-md border-b border-[#e8e3da]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Bespoke Typographic Brand Emblem */}
            <Link 
              href="/" 
              onClick={() => sound.playClick()}
              className="flex items-center gap-3.5 group"
            >
              <div className="w-9 h-9 rounded-full border border-[#141210] flex items-center justify-center font-editorial font-bold text-sm text-[#141210] group-hover:bg-[#141210] group-hover:text-white transition-all duration-300">
                DH
              </div>
              <div className="flex flex-col">
                <span className="font-serif-luxury tracking-[0.24em] uppercase text-sm sm:text-base font-semibold text-[#141210]">
                  Digital Heroes
                </span>
                <span className="tracking-[0.22em] uppercase text-[9px] text-[#8c857b] font-mono-code">
                  Golf · Philanthropy · Prize Draw
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-8 text-[13px] tracking-wide font-medium">
              <Link
                href="/draws"
                onClick={() => sound.playClick()}
                className={`transition-colors py-1 ${
                  isActive('/draws') ? 'text-[#141210] font-semibold border-b border-[#141210]' : 'text-[#57534e] hover:text-[#141210]'
                }`}
              >
                Prize Syndicate
              </Link>

              <Link
                href="/charities"
                onClick={() => sound.playClick()}
                className={`transition-colors py-1 ${
                  isActive('/charities') ? 'text-[#141210] font-semibold border-b border-[#141210]' : 'text-[#57534e] hover:text-[#141210]'
                }`}
              >
                Charity Directory
              </Link>

              <Link
                href="/how-it-works"
                onClick={() => sound.playClick()}
                className={`transition-colors py-1 ${
                  isActive('/how-it-works') ? 'text-[#141210] font-semibold border-b border-[#141210]' : 'text-[#57534e] hover:text-[#141210]'
                }`}
              >
                How It Works
              </Link>
            </nav>

            {/* Right Side Member Actions */}
            <div className="hidden md:flex items-center gap-3.5">
              {currentUser ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => sound.playClick()}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium border transition-all ${
                      isActive('/dashboard')
                        ? 'bg-[#141210] text-white border-[#141210]'
                        : 'bg-white text-[#141210] border-[#d6cfc2] hover:border-[#141210]'
                    }`}
                  >
                    <UserIcon className="w-3.5 h-3.5" />
                    <span>Member Portal</span>
                    {subscription?.status === 'active' && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    )}
                  </Link>

                  {currentUser.role === 'admin' && (
                    <Link
                      href="/admin"
                      onClick={() => sound.playClick()}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium transition-all ${
                        isActive('/admin')
                          ? 'bg-purple-900 text-white'
                          : 'bg-purple-50 text-purple-900 border border-purple-200 hover:bg-purple-100'
                      }`}
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Admin Console</span>
                    </Link>
                  )}
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => sound.playClick()}
                    className="text-xs font-medium text-[#57534e] hover:text-[#141210] px-3 py-2 transition-colors"
                  >
                    Sign In
                  </Link>

                  <Link
                    href="/subscribe"
                    onClick={() => sound.playChime()}
                    className="px-5 py-2.5 rounded-full bg-[#141210] hover:bg-[#282522] text-white text-xs font-medium tracking-wider uppercase transition-all shadow-xs"
                  >
                    Join Syndicate
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Hamburger Toggle */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-[#141210] hover:bg-[#f3efe6] transition-colors"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#e8e3da] bg-[#faf8f5] px-4 py-6 space-y-4">
            <nav className="flex flex-col space-y-3 text-sm font-medium">
              <Link
                href="/draws"
                onClick={() => { setMobileMenuOpen(false); sound.playClick(); }}
                className="text-[#57534e] hover:text-[#141210]"
              >
                Prize Syndicate
              </Link>
              <Link
                href="/charities"
                onClick={() => { setMobileMenuOpen(false); sound.playClick(); }}
                className="text-[#57534e] hover:text-[#141210]"
              >
                Charity Directory
              </Link>
              <Link
                href="/how-it-works"
                onClick={() => { setMobileMenuOpen(false); sound.playClick(); }}
                className="text-[#57534e] hover:text-[#141210]"
              >
                How It Works
              </Link>
              {currentUser ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => { setMobileMenuOpen(false); sound.playClick(); }}
                    className="text-[#141210] font-semibold"
                  >
                    Member Portal
                  </Link>
                  {currentUser.role === 'admin' && (
                    <Link
                      href="/admin"
                      onClick={() => { setMobileMenuOpen(false); sound.playClick(); }}
                      className="text-purple-900 font-semibold"
                    >
                      Admin Console
                    </Link>
                  )}
                </>
              ) : (
                <Link
                  href="/subscribe"
                  onClick={() => { setMobileMenuOpen(false); sound.playClick(); }}
                  className="w-full py-3 rounded-full bg-[#141210] text-white text-center text-xs font-semibold uppercase tracking-wider block"
                >
                  Join Syndicate
                </Link>
              )}
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
