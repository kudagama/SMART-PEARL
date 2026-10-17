"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Grid,
  Search,
  ChevronDown,
  Home,
  FileText,
  Users,
  ArrowLeft,
  Check,
  CheckCircle2,
  AlertCircle,
  Wrench,
  Power,
  Copy,
  Target,
  Sparkles,
  PhoneCall,
  ExternalLink,
  BookOpen,
  ArrowRight,
  Database,
  CreditCard,
  BarChart2,
  Zap,
  Wifi,
  Activity,
  Layers,
  HelpCircle,
  AlertTriangle
} from 'lucide-react';

export default function GeneralQuestionsFTTHPage() {
  const [connectionStatus, setConnectionStatus] = useState<'Active' | 'Not Active' | null>('Active');
  const [gbStatus, setGbStatus] = useState<'throttled_gb' | 'throttled_arrears' | 'available' | null>('throttled_gb');
  const [viewMode, setViewMode] = useState<'interactive' | 'flowchart'>('interactive');
  const [copied, setCopied] = useState(false);

  const copyIspTicket = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const ispComplaintDraft = `Target Work Group: ISP-TECH-SUPPORT / SF-BB-PROV
Complaint Type: Package Synchronization Mismatch (LDAP vs VAS Portal)
Subscriber Details:
• I-Hub / LDAP Package: FTTH Fibre Unlimited Flash
• VAS Portal Provisioned Package: Web Starter 45GB
• Symptom: Subscriber throttled prematurely due to package quota rating mismatch between LDAP and VAS PCRF billing gateway.
Action Required: Resynchronize PCRF profile and align VAS quota with LDAP subscription.`;

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f4f7f9] overflow-y-auto select-none">
      
      {/* 1. TOP SHAREPOINT INTRANET BAR */}
      <div className="bg-[#005a9c] text-white px-4 py-2 flex items-center justify-between text-xs shadow-xs shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/knowledge-hub" className="flex items-center gap-1.5 cursor-pointer hover:opacity-80">
            <Grid className="w-4 h-4 text-white" />
            <span className="font-bold tracking-tight text-sm">SharePoint</span>
          </Link>
          <span className="hidden sm:inline text-white/50">|</span>
          <span className="hidden sm:inline text-cyan-100 font-medium">SLT-Mobitel Knowledge Hub</span>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <span className="hidden sm:inline text-cyan-100 font-medium">Intranet Portal</span>
          <div className="w-7 h-7 rounded-full bg-cyan-700 border border-cyan-400 flex items-center justify-center font-bold text-[11px] text-white">
            GJ
          </div>
        </div>
      </div>

      {/* 2. SLT MOBITEL BANNER & MENU NAVIGATION */}
      <div className="bg-white border-b border-slate-200 px-6 py-2.5 flex items-center justify-between shadow-2xs shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <span className="font-black text-xl text-[#005696] tracking-tighter">SLT</span>
              <span className="font-black text-xl text-[#22b14c] tracking-tighter">MOBITEL</span>
            </div>
            <span className="text-[9px] text-[#005696] font-semibold -mt-1 tracking-wider uppercase">The Connection</span>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-700">
          <Link href="/knowledge-hub" className="text-slate-700 hover:text-[#005696] hover:underline">Home</Link>
          <span className="flex items-center gap-1 cursor-pointer hover:text-[#005696]">Groups <ChevronDown className="w-3 h-3 text-slate-400" /></span>
          <span className="flex items-center gap-1 cursor-pointer hover:text-[#005696]">eApplications <ChevronDown className="w-3 h-3 text-slate-400" /></span>
          <Link href="/knowledge-hub/faq" className="text-[#005696] font-bold hover:underline flex items-center gap-1">
            Knowledge Base <ChevronDown className="w-3 h-3 text-[#005696]" />
          </Link>
        </div>
      </div>

      {/* 3. BREADCRUMBS */}
      <div className="bg-white border-b border-slate-200 px-6 py-2 flex items-center justify-between text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <Link href="/knowledge-hub/faq/ftth" className="text-[#005696] font-bold hover:underline flex items-center gap-1">
            <ArrowLeft className="w-3 h-3" /> Back to FTTH FAQs
          </Link>
          <span className="text-slate-300">/</span>
          <Link href="/knowledge-hub" className="hover:text-[#005696] hover:underline">Knowledge Hub</Link>
          <span className="text-slate-300">/</span>
          <Link href="/knowledge-hub/faq/ftth" className="hover:text-[#005696] hover:underline">FAQs - FTTH</Link>
          <span className="text-slate-300">/</span>
          <span className="font-bold text-[#005696]">General Questions FTTH</span>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-slate-500">
          <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
            Live SOP Active
          </span>
          <span className="flex items-center gap-1"><Users className="w-3 h-3" /> Contact Center Staff</span>
        </div>
      </div>

      {/* 4. HERO BANNER */}
      <div className="relative bg-gradient-to-r from-[#03152e] via-[#052b57] to-[#011429] text-white px-8 py-8 overflow-hidden border-b border-blue-900/40">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-500/20 via-transparent to-transparent pointer-events-none"></div>
        <div className="max-w-6xl mx-auto relative z-10 space-y-3">
          
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
              <Database className="w-3 h-3 text-emerald-400" /> FTTH Triage & Provisioning SOP
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-cyan-200 border border-cyan-400/30">
              I-Hub / LDAP & VAS Portal Matrix
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white drop-shadow-md">
            General Questions FTTH - Connection Status & Quota Decision SOP
          </h1>
          <p className="text-slate-300 text-xs md:text-sm max-w-3xl leading-relaxed">
            Standard operating procedure to triage customer FTTH broadband status: verify optical subscription status on I-Hub/LDAP, inspect quota consumption and bill arrears throttling on the VAS Portal, and route healthy connections to the ONT indicator decision tree.
          </p>

          {/* View mode switcher */}
          <div className="pt-2 flex items-center flex-wrap gap-3">
            <div className="bg-slate-900/60 p-1 rounded-lg border border-slate-700/60 flex items-center text-xs font-bold">
              <button
                onClick={() => setViewMode('interactive')}
                className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
                  viewMode === 'interactive'
                    ? 'bg-[#005696] text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                <span>Interactive Troubleshooter</span>
              </button>

              <button
                onClick={() => setViewMode('flowchart')}
                className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
                  viewMode === 'flowchart'
                    ? 'bg-[#005696] text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-emerald-300" />
                <span>Visual Decision Tree Diagram</span>
              </button>
            </div>

            <div className="flex items-center gap-2 ml-auto text-xs">
              <Link
                href="/knowledge-hub/faq/ftth/pon-los-indicator"
                className="px-3 py-1 rounded-md bg-[#ffd24d] hover:bg-[#ffc82c] text-black font-black text-xs shadow-xs flex items-center gap-1 border border-black transition-colors"
              >
                <span>Next SOP: PON/LOS Indicator</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* 5. MAIN CONTENT AREA */}
      <div className="flex-1 p-6 md:p-8 bg-slate-50">
        <div className="max-w-6xl mx-auto space-y-6">

          {/* CRITICAL OPERATIONAL HIGHLIGHT BOX */}
          <div className="p-4 rounded-xl border-2 border-black bg-[#e9d5ff] shadow-[4px_4px_0px_#000] flex items-start gap-3">
            <div className="p-2 rounded-lg bg-purple-700 text-white shrink-0 mt-0.5">
              <Layers className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <h4 className="font-black text-xs text-purple-950 uppercase tracking-wider">
                Crucial Quality Standard: LDAP & VAS Portal Package Alignment
              </h4>
              <p className="text-xs font-bold text-slate-900 leading-relaxed">
                Better if you can check whether the broadband package mentioned in both <strong className="text-purple-950 underline decoration-purple-600">LDAP</strong> and <strong className="text-purple-950 underline decoration-purple-600">VAS Portal</strong> are the same. If there are any mismatches, forward a complaint directly to <strong className="text-red-700 font-black">ISP</strong> for provisioning profile alignment.
              </p>
            </div>
          </div>

          {/* VIEW MODE 1: INTERACTIVE STEP-BY-STEP TROUBLESHOOTER */}
          {viewMode === 'interactive' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
              
              {/* STEP 1: I-Hub / LDAP CONNECTION STATUS */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#005696]">
                      Step 1: Primary System Verification
                    </span>
                    <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                      <Database className="w-5 h-5 text-[#005696]" />
                      Check the Connection Status (I-Hub/ LDAP)
                    </h3>
                  </div>
                  <span className="text-xs text-slate-500 font-medium">
                    Query customer circuit on I-Hub / LDAP directory
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Not Active Option */}
                  <button
                    onClick={() => {
                      setConnectionStatus('Not Active');
                    }}
                    className={`p-4 rounded-xl border-2 transition-all text-left flex items-center justify-between ${
                      connectionStatus === 'Not Active'
                        ? 'border-black bg-rose-50 shadow-[4px_4px_0px_#000]'
                        : 'border-slate-200 hover:border-slate-400 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-rose-100 text-rose-700 border border-rose-300 flex items-center justify-center font-black text-xs">
                        OFF
                      </div>
                      <div>
                        <h4 className="font-black text-sm text-slate-900">Not Active (Disconnected)</h4>
                        <p className="text-xs text-slate-500 font-medium">Barred for non-payment or suspended</p>
                      </div>
                    </div>
                    {connectionStatus === 'Not Active' && (
                      <CheckCircle2 className="w-5 h-5 text-rose-600 shrink-0" />
                    )}
                  </button>

                  {/* Active Option */}
                  <button
                    onClick={() => {
                      setConnectionStatus('Active');
                    }}
                    className={`p-4 rounded-xl border-2 transition-all text-left flex items-center justify-between ${
                      connectionStatus === 'Active'
                        ? 'border-black bg-emerald-50 shadow-[4px_4px_0px_#000]'
                        : 'border-slate-200 hover:border-slate-400 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center justify-center font-black text-xs">
                        ON
                      </div>
                      <div>
                        <h4 className="font-black text-sm text-slate-900">Active (In Service)</h4>
                        <p className="text-xs text-slate-500 font-medium">Provisioned circuit active in LDAP</p>
                      </div>
                    </div>
                    {connectionStatus === 'Active' && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    )}
                  </button>
                </div>

                {/* Outcome for Not Active */}
                {connectionStatus === 'Not Active' && (
                  <div className="p-5 rounded-xl border-2 border-black bg-[#5cb85c] text-black shadow-[4px_4px_0px_#000] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider text-black/70">
                        Resolution Path (Not Active)
                      </span>
                      <span className="px-2 py-0.5 rounded bg-black text-white text-[10px] font-black">
                        END
                      </span>
                    </div>
                    <h4 className="font-black text-base text-black">
                      Inform to settle the bill
                    </h4>
                    <p className="text-xs font-bold text-black/90 leading-relaxed">
                      Inform subscriber: Connection is barred due to outstanding billing arrears. Advise customer to settle the total due amount via MySLT, LankaQR, online banking, or nearest Teleshop. Once payment reflects, service will automatically restore (END).
                    </p>
                  </div>
                )}
              </div>

              {/* STEP 2: CHECK GB AVAILABILITY (VAS PORTAL) */}
              {connectionStatus === 'Active' && (
                <div className="space-y-4 pt-4 border-t border-slate-200">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#005696]">
                        Step 2: Bandwidth & Quota Inspection
                      </span>
                      <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                        <BarChart2 className="w-5 h-5 text-[#005696]" />
                        Check the GB availability (VAS Portal)
                      </h3>
                    </div>
                    <span className="text-xs text-slate-500 font-medium">
                      Check subscriber remaining volume & FUP profile
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                    
                    {/* Option 1: Throttled due to GB issue */}
                    <button
                      onClick={() => setGbStatus('throttled_gb')}
                      className={`p-4 rounded-xl border-2 transition-all text-left flex flex-col justify-between space-y-2 ${
                        gbStatus === 'throttled_gb'
                          ? 'border-black bg-amber-50 shadow-[4px_4px_0px_#000]'
                          : 'border-slate-200 hover:border-slate-400 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold text-[10px]">
                          Quota Exhausted
                        </span>
                        {gbStatus === 'throttled_gb' && <CheckCircle2 className="w-4 h-4 text-amber-600" />}
                      </div>
                      <div>
                        <h4 className="font-black text-xs text-slate-900">Throttled due to GB issue</h4>
                        <p className="text-[11px] text-slate-500">Standard monthly volume finished</p>
                      </div>
                    </button>

                    {/* Option 2: Throttled due to Bill Arrears */}
                    <button
                      onClick={() => setGbStatus('throttled_arrears')}
                      className={`p-4 rounded-xl border-2 transition-all text-left flex flex-col justify-between space-y-2 ${
                        gbStatus === 'throttled_arrears'
                          ? 'border-black bg-rose-50 shadow-[4px_4px_0px_#000]'
                          : 'border-slate-200 hover:border-slate-400 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-900 font-bold text-[10px]">
                          Billing Restrict
                        </span>
                        {gbStatus === 'throttled_arrears' && <CheckCircle2 className="w-4 h-4 text-rose-600" />}
                      </div>
                      <div>
                        <h4 className="font-black text-xs text-slate-900">Throttled due to Bill Arrears</h4>
                        <p className="text-[11px] text-slate-500">Speed restricted for overdue bill</p>
                      </div>
                    </button>

                    {/* Option 3: If GBs are available */}
                    <button
                      onClick={() => setGbStatus('available')}
                      className={`p-4 rounded-xl border-2 transition-all text-left flex flex-col justify-between space-y-2 ${
                        gbStatus === 'available'
                          ? 'border-black bg-emerald-50 shadow-[4px_4px_0px_#000]'
                          : 'border-slate-200 hover:border-slate-400 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-bold text-[10px]">
                          Quota Healthy
                        </span>
                        {gbStatus === 'available' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                      </div>
                      <div>
                        <h4 className="font-black text-xs text-slate-900">If GBs are available</h4>
                        <p className="text-[11px] text-slate-500">Remaining volume is sufficient</p>
                      </div>
                    </button>

                  </div>

                  {/* BRANCH OUTCOMES */}

                  {/* 1. Throttled due to GB issue */}
                  {gbStatus === 'throttled_gb' && (
                    <div className="p-5 rounded-xl border-2 border-black bg-[#5cb85c] text-black shadow-[4px_4px_0px_#000] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-wider text-black/70">
                          Resolution Action
                        </span>
                        <span className="px-2 py-0.5 rounded bg-black text-white text-[10px] font-black">
                          END
                        </span>
                      </div>
                      <h4 className="font-black text-base text-black">
                        Ask customer to add some extraGB.
                      </h4>
                      <p className="text-xs font-bold text-black/90 leading-relaxed">
                        Explain to customer that standard volume is exhausted and speed has throttled to FUP 64kbps/128kbps. Guide subscriber to top up Extra GB via MySLT App, web self-care portal, or add-on vouchers.
                      </p>
                    </div>
                  )}

                  {/* 2. Throttled due to Bill Arrears */}
                  {gbStatus === 'throttled_arrears' && (
                    <div className="space-y-3">
                      <div className="p-5 rounded-xl border-2 border-black bg-[#5cb85c] text-black shadow-[4px_4px_0px_#000] space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase tracking-wider text-black/70">
                            Resolution Action
                          </span>
                          <span className="px-2 py-0.5 rounded bg-black text-white text-[10px] font-black">
                            Action Required
                          </span>
                        </div>
                        <h4 className="font-black text-base text-black">
                          Ask customer to settle the bill
                        </h4>
                        <p className="text-xs font-bold text-black/90 leading-relaxed">
                          Account has entered soft-baring due to overdue invoice arrears. Advise customer to settle outstanding bill to unthrottle connection immediately.
                        </p>
                      </div>

                      {/* Package Mismatch ISP Escalation Helper */}
                      <div className="p-4 rounded-xl border-2 border-black bg-[#d8b4fe] text-black shadow-[4px_4px_0px_#000] space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-black text-xs uppercase tracking-wider text-purple-950 flex items-center gap-1.5">
                            <Layers className="w-4 h-4" /> Package Sync Check (LDAP vs VAS Portal)
                          </span>
                          <button
                            onClick={() => copyIspTicket(ispComplaintDraft)}
                            className="px-2.5 py-1 bg-purple-900 text-white rounded text-[10px] font-bold flex items-center gap-1 hover:bg-black transition-colors"
                          >
                            {copied ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3" />}
                            <span>{copied ? 'Copied Draft' : 'Copy ISP Escalation Draft'}</span>
                          </button>
                        </div>
                        <p className="text-xs font-bold text-slate-900 leading-relaxed">
                          (Note: Better if can check the package mentioned in both LDAP & VAS portal are same. If there are any mismatches, can forward a complaint to ISP).
                        </p>
                      </div>
                    </div>
                  )}

                  {/* 3. If GBs are available */}
                  {gbStatus === 'available' && (
                    <div className="p-6 rounded-xl border-2 border-black bg-[#5cb85c] text-black shadow-[4px_4px_0px_#000] space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-wider text-black/70">
                          Next Troubleshooting Stage
                        </span>
                        <span className="px-2.5 py-0.5 rounded bg-black text-white text-[10px] font-black">
                          Physical Hardware Check
                        </span>
                      </div>
                      
                      <div className="space-y-1">
                        <h4 className="font-black text-lg text-black">
                          Follow the next FAQ on ONT Indicators.
                        </h4>
                        <p className="text-xs font-bold text-black/90 leading-relaxed">
                          Since the subscription is Active and quota is sufficient, the fault is isolated to local premises equipment (ONT, optical link, or Wi-Fi). Guide customer to examine ONT LED indicators.
                        </p>
                      </div>

                      <div className="pt-2 flex items-center flex-wrap gap-2">
                        <Link
                          href="/knowledge-hub/faq/ftth/pon-los-indicator"
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-black text-white font-black text-xs hover:bg-slate-900 shadow-md transition-all active:scale-95"
                        >
                          <Power className="w-4 h-4 text-amber-400" />
                          <span>Open PON/LOS Indicator Decision Guide</span>
                          <ArrowRight className="w-4 h-4 text-amber-400 ml-1" />
                        </Link>

                        <Link
                          href="/knowledge-hub/faq/ftth/ont-not-working"
                          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-800 font-bold text-xs shadow-2xs transition-all"
                        >
                          <span>ONT Not Working SOP</span>
                        </Link>
                      </div>
                    </div>
                  )}

                </div>
              )}

            </div>
          )}

          {/* VIEW MODE 2: VISUAL DECISION TREE DIAGRAM (OFFICIAL FLOWCHART) */}
          {viewMode === 'flowchart' && (
            <div className="bg-white rounded-xl border border-slate-300 shadow-md p-6 sm:p-10 space-y-6">
              
              <div className="text-center space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Sri Lanka Telecom - Contact Center Quality SOP
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  General Questions - Official Decision Flowchart
                </h2>
              </div>

              {/* Exact SVG Vector Flowchart matching General Questions.pdf */}
              <div className="max-w-3xl mx-auto border border-slate-200 rounded-xl p-4 sm:p-6 bg-slate-50/50">
                <svg
                  viewBox="0 0 800 640"
                  className="w-full h-auto select-none font-sans"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <filter id="retroShadowGq" x="-15%" y="-15%" width="130%" height="130%">
                      <feDropShadow dx="4" dy="4" stdDeviation="0" floodColor="#000000" floodOpacity="1" />
                    </filter>
                    <marker id="arrowGq" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#000000" />
                    </marker>
                  </defs>

                  {/* Flowchart Title */}
                  <text
                    x="400"
                    y="32"
                    textAnchor="middle"
                    fontWeight="900"
                    fontSize="28"
                    fontFamily="Arial, Helvetica, sans-serif"
                    fill="#000000"
                    letterSpacing="0.5"
                  >
                    General Questions
                  </text>

                  {/* ROOT NODE: Check the Connection Status (I-Hub/ LDAP) */}
                  <g>
                    <rect
                      x="340"
                      y="54"
                      width="260"
                      height="46"
                      rx="23"
                      ry="23"
                      fill="#5cb85c"
                      stroke="#000000"
                      strokeWidth="2.5"
                      filter="url(#retroShadowGq)"
                    />
                    <text
                      x="470"
                      y="74"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="12"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      Check the Connection Status
                    </text>
                    <text
                      x="470"
                      y="89"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="12"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      (I-Hub/ LDAP)
                    </text>
                  </g>

                  {/* BRANCH 1: Not Active (goes left and down) */}
                  <path d="M 340 77 L 230 77 L 230 112" stroke="#000000" strokeWidth="2.5" markerEnd="url(#arrowGq)" fill="none" />
                  <text
                    x="285"
                    y="69"
                    textAnchor="middle"
                    fontWeight="bold"
                    fontSize="11.5"
                    fill="#ff0000"
                    fontFamily="Arial, Helvetica, sans-serif"
                  >
                    Not Active
                  </text>

                  {/* Green Node: Inform to settle the bill */}
                  <g>
                    <rect
                      x="145"
                      y="112"
                      width="170"
                      height="44"
                      rx="22"
                      ry="22"
                      fill="#5cb85c"
                      stroke="#000000"
                      strokeWidth="2"
                      filter="url(#retroShadowGq)"
                    />
                    <text
                      x="230"
                      y="139"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="12"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      Inform to settle the bill
                    </text>
                  </g>

                  {/* Arrow down to END */}
                  <path d="M 230 156 L 230 184" stroke="#000000" strokeWidth="2.5" markerEnd="url(#arrowGq)" />
                  <text
                    x="230"
                    y="200"
                    textAnchor="middle"
                    fontWeight="900"
                    fontSize="13"
                    fill="#00b050"
                    fontFamily="Arial, Helvetica, sans-serif"
                  >
                    END
                  </text>

                  {/* BRANCH 2: Active (goes straight down into Check GB) */}
                  <path d="M 470 100 L 470 190" stroke="#000000" strokeWidth="2.5" markerEnd="url(#arrowGq)" />
                  <text
                    x="490"
                    y="145"
                    textAnchor="start"
                    fontWeight="bold"
                    fontSize="11.5"
                    fill="#00b050"
                    fontFamily="Arial, Helvetica, sans-serif"
                  >
                    Active
                  </text>

                  {/* NODE 2: Check the GB availability (VAS Portal) */}
                  <g>
                    <rect
                      x="340"
                      y="190"
                      width="260"
                      height="46"
                      rx="23"
                      ry="23"
                      fill="#5cb85c"
                      stroke="#000000"
                      strokeWidth="2.5"
                      filter="url(#retroShadowGq)"
                    />
                    <text
                      x="470"
                      y="210"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="12"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      Check the GB availability
                    </text>
                    <text
                      x="470"
                      y="225"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="12"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      (VAS Portal)
                    </text>
                  </g>

                  {/* ================= THREE SUB-BRANCHES FROM CHECK GB ================= */}

                  {/* Sub-Branch 1 (Left): Throttled due to GB issue */}
                  <path d="M 340 213 L 270 213 L 270 290" stroke="#000000" strokeWidth="2.5" markerEnd="url(#arrowGq)" fill="none" />
                  <text
                    x="220"
                    y="245"
                    textAnchor="middle"
                    fontWeight="bold"
                    fontSize="11"
                    fill="#ff0000"
                    fontFamily="Arial, Helvetica, sans-serif"
                  >
                    Throttled due to
                  </text>
                  <text
                    x="220"
                    y="259"
                    textAnchor="middle"
                    fontWeight="bold"
                    fontSize="11"
                    fill="#ff0000"
                    fontFamily="Arial, Helvetica, sans-serif"
                  >
                    GB issue
                  </text>

                  {/* Green Node: Ask customer to add some extraGB. */}
                  <g>
                    <rect
                      x="170"
                      y="290"
                      width="200"
                      height="44"
                      rx="22"
                      ry="22"
                      fill="#5cb85c"
                      stroke="#000000"
                      strokeWidth="2"
                      filter="url(#retroShadowGq)"
                    />
                    <text
                      x="270"
                      y="310"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="11.5"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      Ask customer to add some
                    </text>
                    <text
                      x="270"
                      y="324"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="11.5"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      extraGB.
                    </text>
                  </g>

                  {/* Arrow down to END */}
                  <path d="M 270 334 L 270 365" stroke="#000000" strokeWidth="2.5" markerEnd="url(#arrowGq)" />
                  <text
                    x="270"
                    y="382"
                    textAnchor="middle"
                    fontWeight="900"
                    fontSize="13"
                    fill="#00b050"
                    fontFamily="Arial, Helvetica, sans-serif"
                  >
                    END
                  </text>

                  {/* Sub-Branch 2 (Center): Throttled due to Bill Arrears */}
                  <path d="M 470 236 L 470 300" stroke="#000000" strokeWidth="2.5" markerEnd="url(#arrowGq)" />
                  <text
                    x="425"
                    y="255"
                    textAnchor="middle"
                    fontWeight="bold"
                    fontSize="11"
                    fill="#ff0000"
                    fontFamily="Arial, Helvetica, sans-serif"
                  >
                    Throttled due to
                  </text>
                  <text
                    x="425"
                    y="269"
                    textAnchor="middle"
                    fontWeight="bold"
                    fontSize="11"
                    fill="#ff0000"
                    fontFamily="Arial, Helvetica, sans-serif"
                  >
                    Bill Arrears
                  </text>

                  {/* Green Node: Ask customer to settle the bill */}
                  <g>
                    <rect
                      x="385"
                      y="300"
                      width="170"
                      height="44"
                      rx="22"
                      ry="22"
                      fill="#5cb85c"
                      stroke="#000000"
                      strokeWidth="2"
                      filter="url(#retroShadowGq)"
                    />
                    <text
                      x="470"
                      y="327"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="11.5"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      Ask customer to settle the bill
                    </text>
                  </g>

                  {/* Lavender Note below Ask customer to settle the bill */}
                  <g>
                    <rect
                      x="345"
                      y="360"
                      width="250"
                      height="54"
                      rx="24"
                      ry="24"
                      fill="#d8b4fe"
                      stroke="#000000"
                      strokeWidth="2"
                      filter="url(#retroShadowGq)"
                    />
                    <text
                      x="470"
                      y="378"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="9"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      (Note: Better if can check the package mentioned in
                    </text>
                    <text
                      x="470"
                      y="390"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="9"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      bothLDAP & VAS portal are same. If there are any
                    </text>
                    <text
                      x="470"
                      y="402"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="9"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      mismatches,can forward a complaint to ISP)
                    </text>
                  </g>

                  {/* Sub-Branch 3 (Right): If GBs are available */}
                  <path d="M 600 213 L 640 213 L 640 430" stroke="#000000" strokeWidth="2.5" markerEnd="url(#arrowGq)" fill="none" />
                  <text
                    x="650"
                    y="320"
                    textAnchor="start"
                    fontWeight="bold"
                    fontSize="11"
                    fill="#00b050"
                    fontFamily="Arial, Helvetica, sans-serif"
                  >
                    If GBs are available
                  </text>

                  {/* Green Node: Follow the next FAQ on ONT Indicators. */}
                  <g
                    className="cursor-pointer"
                    onClick={() => window.location.href = '/knowledge-hub/faq/ftth/pon-los-indicator'}
                  >
                    <rect
                      x="530"
                      y="430"
                      width="220"
                      height="46"
                      rx="23"
                      ry="23"
                      fill="#5cb85c"
                      stroke="#000000"
                      strokeWidth="2"
                      filter="url(#retroShadowGq)"
                    />
                    <text
                      x="640"
                      y="450"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="11.5"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      Follow the next FAQ
                    </text>
                    <text
                      x="640"
                      y="464"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="11.5"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      on ONT Indicators.
                    </text>
                  </g>

                </svg>
              </div>

            </div>
          )}

          {/* 6. BOTTOM NAVIGATION FOOTER */}
          <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200">
            <Link
              href="/knowledge-hub/faq/ftth"
              className="px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-2 transition-all shadow-2xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to FAQs - FTTH</span>
            </Link>

            <div className="flex items-center gap-2">
              <Link
                href="/knowledge-hub/faq/ftth/ont-not-working"
                className="px-3 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-all shadow-2xs"
              >
                <span>ONT Not Working SOP</span>
              </Link>

              <Link
                href="/knowledge-hub/faq/ftth/pon-los-indicator"
                className="px-4 py-2 rounded-lg bg-[#005696] hover:bg-[#00477d] text-white font-bold text-xs flex items-center gap-2 transition-all shadow-xs"
              >
                <span>Next: PON/LOS Indicator SOP</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
