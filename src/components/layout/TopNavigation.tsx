"use client";

import React, { useState } from 'react';
import { Search, Globe, User, HelpCircle, LayoutDashboard, Phone, Signal, Activity } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function TopNavigation() {
  const [language, setLanguage] = useState('EN');
  const pathname = usePathname();
  const isEscalation = pathname === '/escalation';
  const isAdmin = pathname?.startsWith('/admin');
  const isLogin = pathname === '/';

  const toggleLanguage = () => {
    const langs = ['EN', 'SI', 'TA'];
    const nextIndex = (langs.indexOf(language) + 1) % langs.length;
    setLanguage(langs[nextIndex]);
  };

  if (isAdmin || isLogin) return null;

  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 shadow-sm z-10 shrink-0">
      {/* Left: Branding & Status */}
      <div className="flex items-center gap-3">
        <Link href="/dashboard" className="w-8 h-8 bg-[#005696] rounded-md flex items-center justify-center text-white font-bold tracking-tighter hover:bg-[#00407a] transition-colors">
          SLT
        </Link>
        <div>
          <h1 className="text-sm font-bold text-slate-900 leading-tight">Smart PEARL</h1>
          <p className="text-[10px] text-slate-500 font-medium leading-none">Contact Center Assistant</p>
        </div>
        
        <div className="hidden md:flex items-center ml-4 gap-2">
          {/* Network Status */}
          <div className="flex items-center px-2 py-1 bg-slate-50 text-slate-600 rounded-full text-[10px] font-semibold border border-slate-200">
            <Signal className="w-3 h-3 mr-1 text-emerald-500" />
            Connected
          </div>
          
          {/* Active Call Timer - Conditionally rendered for edge case */}
          {isEscalation && (
            <div className="flex items-center px-2 py-1 bg-rose-50 text-rose-700 rounded-full text-xs font-bold border border-rose-200">
              <div className="w-1.5 h-1.5 bg-rose-500 rounded-full mr-1.5 animate-pulse"></div>
              <Phone className="w-3 h-3 mr-1" />
              02:45
            </div>
          )}
        </div>
      </div>

      {/* Center: Main Search Hint */}
      {!isEscalation && (
        <div className="hidden lg:flex items-center justify-center flex-1 max-w-md mx-6">
          <div className="relative w-full text-slate-400 focus-within:text-[#005696] transition-colors">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4" />
            </div>
            <input
              type="text"
              className="block w-full pl-9 pr-3 py-1.5 border border-slate-200 rounded-md leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#005696] focus:border-[#005696] sm:text-sm transition-all"
              placeholder="Quick search..."
              readOnly
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-2">
              <span className="inline-flex items-center px-1.5 rounded border border-slate-200 text-[10px] font-sans font-medium text-slate-400">
                /
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Right: Actions */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-4 mr-2">
          <Link href="/dashboard" className="text-sm font-medium text-slate-600 hover:text-[#005696] transition-colors flex items-center gap-1.5">
            <Search className="w-4 h-4" />
            PEARL
          </Link>

          <Link href="/evaluations" className="text-sm font-medium text-slate-600 hover:text-[#005696] transition-colors flex items-center gap-1.5">
            <Activity className="w-4 h-4" />
            Performance
          </Link>
        </nav>

        <div className="w-px h-5 bg-slate-200 hidden md:block"></div>

        {/* Language Toggle */}
        <button 
          onClick={toggleLanguage}
          className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-slate-100 text-sm font-medium text-slate-600 transition-colors"
          title="Toggle Language"
        >
          <Globe className="w-4 h-4 text-slate-400" />
          <span className="w-4 text-center">{language}</span>
        </button>

        {/* Agent Profile / Logout */}
        <Link href="/" className="flex items-center gap-2 pl-2 border-l border-slate-200 group" title="Sign Out">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-semibold text-slate-700 leading-none group-hover:text-rose-600 transition-colors">Gehan Jayawardana</p>
            <p className="text-[10px] text-slate-500 mt-0.5 font-mono">Sign Out</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-[#e0f4fc] border border-cyan-100 flex items-center justify-center text-[#005696] group-hover:bg-rose-50 group-hover:text-rose-600 group-hover:border-rose-100 transition-colors">
            <User className="w-4 h-4" />
          </div>
        </Link>
      </div>
    </header>
  );
}
