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
  ShieldAlert,
  Globe,
  Monitor,
  Smartphone,
  Shield,
  Clock,
  Layers,
  HelpCircle,
  AlertTriangle,
  Radio,
  RotateCcw,
  Gauge,
  Phone,
  Database,
  CreditCard,
  Volume2
} from 'lucide-react';

export default function BrowsingSlowPage() {
  const [ogbStatus, setOgbStatus] = useState<'INITIAL' | 'YES' | 'NO'>('INITIAL');
  const [voiceNoiseStatus, setVoiceNoiseStatus] = useState<'INITIAL' | 'YES' | 'NO'>('INITIAL');
  const [usageExceededStatus, setUsageExceededStatus] = useState<'INITIAL' | 'NO' | 'YES'>('INITIAL');
  const [extraGbWishStatus, setExtraGbWishStatus] = useState<'INITIAL' | 'NO' | 'YES'>('INITIAL');
  const [extraGbFieldStatus, setExtraGbFieldStatus] = useState<'INITIAL' | 'YES' | 'NO'>('INITIAL');
  const [viewMode, setViewMode] = useState<'interactive' | 'flowchart'>('interactive');
  const [copied, setCopied] = useState<string | null>(null);

  const copyTtDetails = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2500);
  };

  const resetInteractive = () => {
    setOgbStatus('INITIAL');
    setVoiceNoiseStatus('INITIAL');
    setUsageExceededStatus('INITIAL');
    setExtraGbWishStatus('INITIAL');
    setExtraGbFieldStatus('INITIAL');
  };

  // TT Template 1: Voice Service to Default Work Group (Noisy Line)
  const ttTemplateVoiceNoise = `Target Work Group: Default Work Group
Service Category: Voice Service
Fault Complaint: Voice Line Noisy / Severe Static with FTTH Slowness
Diagnostic Log:
• Connection Status: Active in I-Hub/LDAP (Not OGB-DC)
• Telephone Dial Tone & Quality: Customer reports severe background crackling/noise/hum on landline
• Optical Power / Session: Physical drop cable optical attenuation or RF transceiver interference suspected
Action Required: Technician dispatch to inspect fiber drop cable, optical splitter, and VoIP telephone port impedance.`;

  // TT Template 2: CEN-CSC-TECH (Usage Limit NOT Exceeded, Slowness persists)
  const ttTemplateCenCsc = `Target Work Group: CEN-CSC-TECH
Service Category: BB Service (Broadband)
Fault Complaint: Browsing Slow (Usage Limit Unexhausted / Speed Degradation)
Diagnostic Log:
• Connection Status: Active (OGB-DC = No)
• Voice Quality: Clear (No line noise)
• Usage Limit / Quota: Verified in VAS Portal -> Data remaining (Not throttled)
• Action Taken: Customer guided to power cycle/restart ONT router
• Speed Test: Measured speed below package SLA threshold
Action Required: Technical investigation for gateway peering congestion, BNG session re-authentication, or IP profile speed restoration.`;

  // Advice Template 3: Self-care Extra GB Top-up channels
  const extraGbAdviceText = `Customer Guidance - Extra GB Self-Care Channels:
• MySLT Mobile App: Available on Google Play Store & Apple App Store (Instant Top-up)
• MySLT Web Portal: https://myslt.slt.lk (Pay via Card, LankaQR, or Bill Add-on)
• Automated Tele-Self-Care: Dial 0112 121 212 IVR from registered mobile/landline`;

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
            <span className="text-[9px] font-bold tracking-widest text-slate-400 uppercase -mt-1">
              The Connection
            </span>
          </div>
          <div className="h-6 w-px bg-slate-300 mx-2 hidden sm:block"></div>
          <div className="hidden sm:flex flex-col">
            <span className="text-xs font-bold text-slate-800">Quality Management &amp; Customer Relations</span>
            <span className="text-[10px] text-slate-500">Contact Center Standard Operating Procedures (SOP)</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/knowledge-hub/faq/ftth"
            className="px-3 py-1.5 rounded border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-all shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>FTTH Matrix</span>
          </Link>

          <Link
            href="/knowledge-hub"
            className="px-3 py-1.5 rounded bg-[#005696] hover:bg-[#00477d] text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
        </div>
      </div>

      {/* 3. HERO SOP BANNER */}
      <div className="bg-gradient-to-r from-[#003865] via-[#005696] to-[#0284c7] text-white px-6 py-6 shadow-md shrink-0">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-lime-400 text-slate-900 font-black text-[10px] tracking-wide uppercase shadow-xs">
                Official SOP #05
              </span>
              <span className="px-2 py-0.5 rounded bg-white/20 text-cyan-100 font-bold text-[10px]">
                Target: Default WG (Voice) / CEN-CSC-TECH / QED Extra GB
              </span>
              <span className="px-2 py-0.5 rounded bg-white/10 text-white/80 font-mono text-[10px]">
                Reviewed: 24/10/2024
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-2">
              <Gauge className="w-7 h-7 text-lime-300" />
              <span>Browsing Slow</span>
            </h1>
            <p className="text-xs sm:text-sm text-cyan-100/90 max-w-3xl leading-relaxed">
              Standard Operating Procedure for handling customer slowness complaints: Checking OGB-DC status, line noise isolation, quota usage limits, and Extra GB provisioning channels.
            </p>
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center gap-1.5 bg-black/30 p-1.5 rounded-lg border border-white/20 shrink-0 self-start md:self-auto">
            <button
              onClick={() => setViewMode('interactive')}
              className={`px-3 py-1.5 rounded-md font-black text-xs flex items-center gap-1.5 transition-all ${
                viewMode === 'interactive'
                  ? 'bg-lime-400 text-slate-900 shadow-sm'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Interactive Troubleshooter</span>
            </button>

            <button
              onClick={() => setViewMode('flowchart')}
              className={`px-3 py-1.5 rounded-md font-black text-xs flex items-center gap-1.5 transition-all ${
                viewMode === 'flowchart'
                  ? 'bg-lime-400 text-slate-900 shadow-sm'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Vector Flowchart</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. MAIN CONTENT CONTAINER */}
      <div className="flex-1 p-4 sm:p-6 md:p-8">
        <div className="max-w-6xl mx-auto space-y-6">

          {/* VIEW MODE 1: INTERACTIVE STEP-BY-STEP TROUBLESHOOTER */}
          {viewMode === 'interactive' && (
            <div className="space-y-6">
              
              {/* Reset Controls & Quick Summary */}
              <div className="flex items-center justify-between bg-white px-5 py-3 rounded-xl border border-slate-300 shadow-xs">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-bold text-slate-700">Triage Stage:</span>
                  <span className="font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    {ogbStatus === 'INITIAL'
                      ? 'Step 1: Check Connection Status in I-Hub/CRM'
                      : ogbStatus === 'YES'
                      ? 'Connection is OGB-DC (Arrears Disconnection)'
                      : voiceNoiseStatus === 'INITIAL'
                      ? 'Step 2: Check Voice Line Noise'
                      : voiceNoiseStatus === 'YES'
                      ? 'Voice Line is Noisy'
                      : usageExceededStatus === 'INITIAL'
                      ? 'Step 3: Check Usage Limit'
                      : usageExceededStatus === 'NO'
                      ? 'Usage Limit NOT Exceeded'
                      : extraGbWishStatus === 'INITIAL'
                      ? 'Step 4: Customer Extra GB Purchase Decision'
                      : extraGbWishStatus === 'NO'
                      ? 'Customer Declines Extra GB'
                      : extraGbFieldStatus === 'INITIAL'
                      ? 'Step 5: Check Extra GB Field in I-Hub'
                      : extraGbFieldStatus === 'YES'
                      ? 'QED Extra GB Eligible'
                      : 'Self-Care Extra GB Routing'}
                  </span>
                </div>

                <button
                  onClick={resetInteractive}
                  className="px-3 py-1 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded border border-slate-300 flex items-center gap-1 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Restart Triage</span>
                </button>
              </div>

              {/* STEP 1: Check whether the connection status is OGB -DC */}
              <div className="bg-white rounded-xl border border-slate-300 shadow-md p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-[#005696] text-white flex items-center justify-center font-black text-xs">
                      1
                    </span>
                    <h3 className="font-black text-slate-900 text-base">
                      Check whether the connection status is OGB -DC
                    </h3>
                  </div>
                  <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                    Billing Status Audit
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Query the customer account in <strong>I-Hub / CRM / LDAP</strong>. Check whether the line is restricted or soft-disconnected under <strong>OGB - DC</strong> (Outgoing Barred - Disconnected for overdue bill arrears).
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <button
                    onClick={() => setOgbStatus('YES')}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      ogbStatus === 'YES'
                        ? 'border-red-500 bg-red-50/70 shadow-sm'
                        : 'border-slate-300 hover:border-red-400 bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-black text-red-700 text-sm flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4" /> Yes (Status is OGB - DC)
                      </span>
                      {ogbStatus === 'YES' && <Check className="w-4 h-4 text-red-600" />}
                    </div>
                    <p className="text-[11px] text-slate-600">
                      Subscriber line is in arrears. Outgoing data traffic is blocked or throttled by billing gateway.
                    </p>
                  </button>

                  <button
                    onClick={() => {
                      setOgbStatus('NO');
                      setVoiceNoiseStatus('INITIAL');
                      setUsageExceededStatus('INITIAL');
                      setExtraGbWishStatus('INITIAL');
                      setExtraGbFieldStatus('INITIAL');
                    }}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      ogbStatus === 'NO'
                        ? 'border-emerald-500 bg-emerald-50/70 shadow-sm'
                        : 'border-slate-300 hover:border-emerald-400 bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-black text-emerald-800 text-sm flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" /> No (Status is Active)
                      </span>
                      {ogbStatus === 'NO' && <Check className="w-4 h-4 text-emerald-600" />}
                    </div>
                    <p className="text-[11px] text-slate-600">
                      Line is fully active and not barred for bill payment arrears.
                    </p>
                  </button>
                </div>

                {/* IF YES -> Inform Customer to settle the Outstanding bill */}
                {ogbStatus === 'YES' && (
                  <div className="p-5 rounded-xl border-2 border-black bg-[#88c848] text-black shadow-[3px_3px_0px_#000] space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-black" />
                        <h4 className="font-black text-sm text-black uppercase">
                          Official Decision: Inform Customer to settle the Outstanding bill
                        </h4>
                      </div>
                      <span className="text-[10px] font-bold bg-black text-white px-2 py-0.5 rounded">
                        Billing Action (END)
                      </span>
                    </div>

                    <p className="text-xs text-black/90 font-bold leading-relaxed">
                      DO NOT create a technical Trouble Ticket. Inform the customer of the total outstanding amount and guide them to pay via online banking, MySLT portal (pay.slt.lk), LankaQR, or nearest Teleshop. Line speed will automatically restore once bill is settled.
                    </p>

                    <button
                      onClick={() => alert('Customer informed to settle outstanding bill (END).')}
                      className="px-4 py-2 rounded-lg bg-black text-white font-black text-xs flex items-center gap-1.5 shadow-xs"
                    >
                      <Check className="w-3.5 h-3.5 text-lime-400" /> Bill Settle Advice Given $\rightarrow$ END
                    </button>
                  </div>
                )}
              </div>

              {/* STEP 2: Check whether the voice line is noisy */}
              {ogbStatus === 'NO' && (
                <div className="bg-white rounded-xl border border-slate-300 shadow-md p-6 space-y-4 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-full bg-[#005696] text-white flex items-center justify-center font-black text-xs">
                        2
                      </span>
                      <h3 className="font-black text-slate-900 text-base">
                        Check whether the voice line is noisy
                      </h3>
                    </div>
                    <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                      Physical Link Noise Test
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    Ask customer if they experience crackling, static noise, humming, or voice distortion when making calls on the connected fixed telephone.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                      onClick={() => setVoiceNoiseStatus('YES')}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        voiceNoiseStatus === 'YES'
                          ? 'border-red-500 bg-red-50/70 shadow-sm'
                          : 'border-slate-300 hover:border-red-400 bg-slate-50/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-black text-red-700 text-xs sm:text-sm flex items-center gap-1.5">
                          <Volume2 className="w-4 h-4" /> Yes (Voice Line is Noisy / Distorted)
                        </span>
                        {voiceNoiseStatus === 'YES' && <Check className="w-4 h-4 text-red-600" />}
                      </div>
                      <p className="text-[11px] text-slate-600">
                        Line has audible noise, indicating physical fiber attenuation or RJ11 port fault.
                      </p>
                    </button>

                    <button
                      onClick={() => {
                        setVoiceNoiseStatus('NO');
                        setUsageExceededStatus('INITIAL');
                        setExtraGbWishStatus('INITIAL');
                        setExtraGbFieldStatus('INITIAL');
                      }}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        voiceNoiseStatus === 'NO'
                          ? 'border-emerald-500 bg-emerald-50/70 shadow-sm'
                          : 'border-slate-300 hover:border-emerald-400 bg-slate-50/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-black text-emerald-800 text-xs sm:text-sm flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4" /> No (Voice Line is Clear)
                        </span>
                        {voiceNoiseStatus === 'NO' && <Check className="w-4 h-4 text-emerald-600" />}
                      </div>
                      <p className="text-[11px] text-slate-600">
                        Telephone dial tone is crystal clear with no background noise.
                      </p>
                    </button>
                  </div>

                  {/* IF YES -> Create a TT under Voice Service to Default Work Group with remarks */}
                  {voiceNoiseStatus === 'YES' && (
                    <div className="p-6 rounded-xl border-2 border-black bg-[#88c848] text-black shadow-[4px_4px_0px_#000] space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Target className="w-6 h-6 text-black animate-bounce" />
                          <h4 className="text-base font-black uppercase tracking-wide">
                            Official Decision: Create a TT under Voice Service to Default Work Group with remarks
                          </h4>
                        </div>
                        <span className="px-2.5 py-1 rounded bg-black text-white text-[10px] font-black uppercase tracking-wider">
                          Physical Fault
                        </span>
                      </div>

                      <p className="text-xs text-black/90 leading-relaxed font-semibold">
                        A noisy voice line indicates physical transmission degradation (optical splitter cut, micro-bending, or CPE telephone port failure). Create a Trouble Ticket under <strong>Voice Service</strong> assigned to the <strong>Default Work Group</strong> with clear troubleshooting remarks.
                      </p>

                      {/* Ready-to-copy Ticket Template */}
                      <div className="bg-slate-900 text-white p-4 rounded-lg font-mono text-[11px] space-y-2 border border-black/40">
                        <div className="flex items-center justify-between text-slate-400 border-b border-slate-700 pb-1.5">
                          <span>Standard Trouble Ticket Draft (Voice Service -> Default WG)</span>
                          <button
                            onClick={() => copyTtDetails(ttTemplateVoiceNoise, 'tt-voice-noise')}
                            className="px-2.5 py-1 bg-[#005696] hover:bg-[#0070ba] text-white text-[10px] rounded flex items-center gap-1 transition-all"
                          >
                            {copied === 'tt-voice-noise' ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3" />}
                            <span>{copied === 'tt-voice-noise' ? 'Copied!' : 'Copy TT'}</span>
                          </button>
                        </div>
                        <pre className="whitespace-pre-wrap leading-relaxed text-lime-300">
                          {ttTemplateVoiceNoise}
                        </pre>
                      </div>

                      <div className="flex items-center justify-end gap-3 pt-2">
                        <button
                          onClick={() => copyTtDetails(ttTemplateVoiceNoise, 'tt-voice-noise')}
                          className="px-5 py-2.5 rounded-lg bg-black text-white font-black text-xs hover:bg-slate-900 flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
                        >
                          {copied === 'tt-voice-noise' ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                          <span>{copied === 'tt-voice-noise' ? 'Copied to Clipboard!' : 'Copy TT & Dispatch to Default WG'}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 3: Check Usage Limit is exceeded by customer */}
              {voiceNoiseStatus === 'NO' && (
                <div className="bg-white rounded-xl border border-slate-300 shadow-md p-6 space-y-4 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-full bg-[#005696] text-white flex items-center justify-center font-black text-xs">
                        3
                      </span>
                      <h3 className="font-black text-slate-900 text-base">
                        Check Usage Limit is exceeded by customer
                      </h3>
                    </div>
                    <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                      Broadband Quota Verification
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    Query customer package quota in <strong>VAS Portal / Billing Data Meter</strong>. Has the customer exhausted their monthly allocated peak/standard volume?
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                      onClick={() => setUsageExceededStatus('NO')}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        usageExceededStatus === 'NO'
                          ? 'border-red-500 bg-red-50/70 shadow-sm'
                          : 'border-slate-300 hover:border-red-400 bg-slate-50/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-black text-red-700 text-xs sm:text-sm">
                          No (Quota Remaining / Usage Limit NOT Exceeded)
                        </span>
                        {usageExceededStatus === 'NO' && <Check className="w-4 h-4 text-red-600" />}
                      </div>
                      <p className="text-[11px] text-slate-600">
                        Customer still has GBs available. Slowness is caused by network/gateway/hardware routing.
                      </p>
                    </button>

                    <button
                      onClick={() => {
                        setUsageExceededStatus('YES');
                        setExtraGbWishStatus('INITIAL');
                        setExtraGbFieldStatus('INITIAL');
                      }}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        usageExceededStatus === 'YES'
                          ? 'border-emerald-500 bg-emerald-50/70 shadow-sm'
                          : 'border-slate-300 hover:border-emerald-400 bg-slate-50/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-black text-emerald-800 text-xs sm:text-sm">
                          Yes (Usage Limit Exceeded / Quota Throttled)
                        </span>
                        {usageExceededStatus === 'YES' && <Check className="w-4 h-4 text-emerald-600" />}
                      </div>
                      <p className="text-[11px] text-slate-600">
                        0 GB remaining in monthly bundle. Speed throttled to 64 Kbps policy speed.
                      </p>
                    </button>
                  </div>

                  {/* IF NO -> Instruct customer to restart the ONT and create a TT to CEN-CSC-TECH work group */}
                  {usageExceededStatus === 'NO' && (
                    <div className="p-6 rounded-xl border-2 border-black bg-[#88c848] text-black shadow-[4px_4px_0px_#000] space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Target className="w-6 h-6 text-black animate-bounce" />
                          <h4 className="text-base font-black uppercase tracking-wide">
                            Official Decision: Instruct customer to restart the ONT and create a TT to CEN-CSC-TECH work group
                          </h4>
                        </div>
                        <span className="px-2.5 py-1 rounded bg-black text-white text-[10px] font-black uppercase tracking-wider">
                          Technical Escalation
                        </span>
                      </div>

                      <p className="text-xs text-black/90 leading-relaxed font-semibold">
                        Customer has not exceeded their bandwidth quota, the optical connection is active, and voice quality is clear. Instruct customer to restart the ONT. If speed remains degraded, create a Trouble Ticket directly to <strong>CEN-CSC-TECH</strong> for gateway session clearance.
                      </p>

                      {/* Ready-to-copy Ticket Template */}
                      <div className="bg-slate-900 text-white p-4 rounded-lg font-mono text-[11px] space-y-2 border border-black/40">
                        <div className="flex items-center justify-between text-slate-400 border-b border-slate-700 pb-1.5">
                          <span>Standard Trouble Ticket Draft (CEN-CSC-TECH)</span>
                          <button
                            onClick={() => copyTtDetails(ttTemplateCenCsc, 'tt-cencsc-speed')}
                            className="px-2.5 py-1 bg-[#005696] hover:bg-[#0070ba] text-white text-[10px] rounded flex items-center gap-1 transition-all"
                          >
                            {copied === 'tt-cencsc-speed' ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3" />}
                            <span>{copied === 'tt-cencsc-speed' ? 'Copied!' : 'Copy TT'}</span>
                          </button>
                        </div>
                        <pre className="whitespace-pre-wrap leading-relaxed text-lime-300">
                          {ttTemplateCenCsc}
                        </pre>
                      </div>

                      <div className="flex items-center justify-end gap-3 pt-2">
                        <button
                          onClick={() => copyTtDetails(ttTemplateCenCsc, 'tt-cencsc-speed')}
                          className="px-5 py-2.5 rounded-lg bg-black text-white font-black text-xs hover:bg-slate-900 flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
                        >
                          {copied === 'tt-cencsc-speed' ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                          <span>{copied === 'tt-cencsc-speed' ? 'Copied to Clipboard!' : 'Copy TT & Dispatch to CEN-CSC-TECH'}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 4: Ask if customer wishes to add Extra GB */}
              {usageExceededStatus === 'YES' && (
                <div className="bg-white rounded-xl border border-slate-300 shadow-md p-6 space-y-4 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-full bg-[#005696] text-white flex items-center justify-center font-black text-xs">
                        4
                      </span>
                      <h3 className="font-black text-slate-900 text-base">
                        Ask if customer wishes to add Extra GB
                      </h3>
                    </div>
                    <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                      Commercial Upsell Offer
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    Advise customer: <em>"ඔබගේ මාසික quota සීමාව ඉක්මවා ගොස් ඇති බැවින් වේගය අඩු වී ඇත. ඔබට අවශ්‍ය නම් Extra GB add-on එකක් මිලදී ගත හැක."</em>
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                      onClick={() => setExtraGbWishStatus('NO')}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        extraGbWishStatus === 'NO'
                          ? 'border-slate-500 bg-slate-100 shadow-sm'
                          : 'border-slate-300 hover:border-slate-400 bg-slate-50/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-black text-slate-800 text-xs sm:text-sm">
                          No (Declines Extra GB)
                        </span>
                        {extraGbWishStatus === 'NO' && <Check className="w-4 h-4 text-slate-700" />}
                      </div>
                      <p className="text-[11px] text-slate-600">
                        Customer does not want to purchase extra data and accepts throttled speed until next bill cycle.
                      </p>
                    </button>

                    <button
                      onClick={() => {
                        setExtraGbWishStatus('YES');
                        setExtraGbFieldStatus('INITIAL');
                      }}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        extraGbWishStatus === 'YES'
                          ? 'border-emerald-500 bg-emerald-50/70 shadow-sm'
                          : 'border-slate-300 hover:border-emerald-400 bg-slate-50/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-black text-emerald-800 text-xs sm:text-sm">
                          Yes (Customer Wishes to Add Extra GB)
                        </span>
                        {extraGbWishStatus === 'YES' && <Check className="w-4 h-4 text-emerald-600" />}
                      </div>
                      <p className="text-[11px] text-slate-600">
                        Customer agrees to purchase Extra GB booster.
                      </p>
                    </button>
                  </div>

                  {/* IF NO -> End */}
                  {extraGbWishStatus === 'NO' && (
                    <div className="p-4 rounded-xl border-2 border-black bg-[#88c848] text-black shadow-[3px_3px_0px_#000] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-black" />
                        <div>
                          <p className="text-xs font-black uppercase">
                            End of Call: Customer Declines Extra GB (END)
                          </p>
                          <p className="text-[11px] text-black/80 font-medium">
                            Advise date of quota reset. No ticket required.
                          </p>
                        </div>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-black text-white font-black text-xs">
                        END
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 5: Check extra GB field in I HUB/CRM */}
              {extraGbWishStatus === 'YES' && (
                <div className="bg-white rounded-xl border border-slate-300 shadow-md p-6 space-y-4 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-full bg-[#005696] text-white flex items-center justify-center font-black text-xs">
                        5
                      </span>
                      <h3 className="font-black text-slate-900 text-base">
                        Check extra GB field in I HUB/CRM
                      </h3>
                    </div>
                    <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                      QED Agent Eligibility Check
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    Check whether the Extra GB provision field is available and active in the customer's I-HUB profile.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                      onClick={() => setExtraGbFieldStatus('YES')}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        extraGbFieldStatus === 'YES'
                          ? 'border-emerald-600 bg-emerald-50 shadow-sm'
                          : 'border-slate-300 hover:border-emerald-400 bg-slate-50/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-black text-emerald-800 text-xs sm:text-sm">
                          Yes (Field is Available in I-HUB)
                        </span>
                        {extraGbFieldStatus === 'YES' && <Check className="w-4 h-4 text-emerald-600" />}
                      </div>
                      <p className="text-[11px] text-slate-600">
                        Agent has permission to trigger QED Extra GB top-up directly.
                      </p>
                    </button>

                    <button
                      onClick={() => setExtraGbFieldStatus('NO')}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        extraGbFieldStatus === 'NO'
                          ? 'border-amber-500 bg-amber-50 shadow-sm'
                          : 'border-slate-300 hover:border-amber-400 bg-slate-50/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-black text-amber-800 text-xs sm:text-sm">
                          No (Field Unavailable in I-HUB)
                        </span>
                        {extraGbFieldStatus === 'NO' && <Check className="w-4 h-4 text-amber-600" />}
                      </div>
                      <p className="text-[11px] text-slate-600">
                        Top-up field disabled or customer package requires direct digital self-care.
                      </p>
                    </button>
                  </div>

                  {/* IF YES -> Follow the QED instructions and Add Extra GB */}
                  {extraGbFieldStatus === 'YES' && (
                    <div className="p-5 rounded-xl border-2 border-black bg-[#88c848] text-black shadow-[3px_3px_0px_#000] space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-black" />
                          <h4 className="font-black text-sm text-black uppercase">
                            Official Decision: Follow the QED instructions and Add Extra GB
                          </h4>
                        </div>
                        <span className="text-[10px] font-bold bg-black text-white px-2 py-0.5 rounded">
                          QED Execution (END)
                        </span>
                      </div>
                      <p className="text-xs text-black/90 font-bold leading-relaxed">
                        Follow the official QED process to select the requested package (1GB / 5GB / 10GB / 25GB) and apply the add-on to the customer's broadband account. Confirm immediate speed restoration.
                      </p>
                      <button
                        onClick={() => alert('Extra GB added via QED instructions (END).')}
                        className="px-4 py-2 rounded-lg bg-black text-white font-black text-xs flex items-center gap-1.5 shadow-xs"
                      >
                        <Check className="w-3.5 h-3.5 text-lime-400" /> Extra GB Applied $\rightarrow$ END
                      </button>
                    </div>
                  )}

                  {/* IF NO -> Don't add extra GB through 1212 but instruct customer... */}
                  {extraGbFieldStatus === 'NO' && (
                    <div className="p-5 rounded-xl border-2 border-black bg-[#ffffb0] text-black shadow-[3px_3px_0px_#000] space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Smartphone className="w-5 h-5 text-black" />
                          <h4 className="font-black text-sm text-black uppercase">
                            Don’t add extra GB through 1212 but instruct customer
                          </h4>
                        </div>
                        <span className="text-[10px] font-bold bg-black text-white px-2 py-0.5 rounded">
                          Self-Care Guidance (END)
                        </span>
                      </div>

                      <p className="text-xs text-black/90 font-bold leading-relaxed">
                        Don’t add extra GB through 1212 but instruct customer to add extra GBs by using <strong>My SLT App</strong>, <strong>My SLT portal (myslt.slt.lk)</strong> &amp; <strong>0112121212 IVR</strong>.
                      </p>

                      <div className="bg-white p-3 rounded-lg border border-black/20 text-xs font-mono space-y-1">
                        <p className="font-bold text-slate-800">Direct Customer Self-Service Options:</p>
                        <p className="text-slate-600">• MySLT Mobile App (Android / iOS)</p>
                        <p className="text-slate-600">• Portal: https://myslt.slt.lk</p>
                        <p className="text-slate-600">• Automated IVR: Dial 0112 121 212</p>
                      </div>

                      <div className="flex justify-end pt-1">
                        <button
                          onClick={() => copyTtDetails(extraGbAdviceText, 'extra-gb-advice')}
                          className="px-4 py-2 bg-black hover:bg-slate-900 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-xs"
                        >
                          {copied === 'extra-gb-advice' ? <Check className="w-3.5 h-3.5 text-lime-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copied === 'extra-gb-advice' ? 'Copied Channels Script' : 'Copy Self-Care Script'}</span>
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              )}

              {/* 6. BOTTOM CALLOUT / NOTE (Purple Ribbon matching screenshot) */}
              <div className="p-5 rounded-xl border-2 border-purple-400 bg-purple-50 text-purple-950 space-y-2 shadow-xs">
                <div className="flex items-center gap-2 font-black text-purple-900 text-sm">
                  <Database className="w-4 h-4 text-purple-700" />
                  <span>Note: Official Extra GB Procedure Reference</span>
                </div>
                <p className="text-xs font-semibold text-purple-900 leading-relaxed">
                  Please follow <strong>QED</strong> for Process of Adding Extra GB for Broadband Customers. Ensure customer identity is verified prior to billing commitments.
                </p>
              </div>

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
                  Browsing Slow
                </h2>
              </div>

              {/* Exact SVG Vector Flowchart matching 5. Browzing slow.pdf */}
              <div className="max-w-4xl mx-auto border border-slate-200 rounded-xl p-4 sm:p-6 bg-slate-50/50 overflow-x-auto">
                <svg
                  viewBox="0 0 920 660"
                  className="w-full min-w-[780px] h-auto select-none font-sans"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <marker id="arrowSlow" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#ff0000" />
                    </marker>
                  </defs>

                  {/* Flowchart Title */}
                  <text
                    x="460"
                    y="32"
                    textAnchor="middle"
                    fontWeight="900"
                    fontSize="26"
                    fontFamily="Arial, Helvetica, sans-serif"
                    fill="#000000"
                  >
                    Browsing Slow
                  </text>

                  {/* ROOT NODE: Check whether the connection status is OGB -DC */}
                  <g>
                    <rect
                      x="390"
                      y="54"
                      width="140"
                      height="54"
                      rx="27"
                      ry="27"
                      fill="#88c848"
                      stroke="#000000"
                      strokeWidth="2"
                    />
                    <text x="460" y="70" textAnchor="middle" fontWeight="bold" fontSize="9.5" fontFamily="Arial, Helvetica, sans-serif" fill="#000000">
                      Check whether the
                    </text>
                    <text x="460" y="82" textAnchor="middle" fontWeight="bold" fontSize="9.5" fontFamily="Arial, Helvetica, sans-serif" fill="#000000">
                      connection status is
                    </text>
                    <text x="460" y="96" textAnchor="middle" fontWeight="900" fontSize="10.5" fontFamily="Arial, Helvetica, sans-serif" fill="#000000">
                      OGB -DC
                    </text>
                  </g>

                  {/* Root Node: Left Branch (Yes) -> Inform Customer to settle the Outstanding bill */}
                  <path d="M 390 81 L 285 81" stroke="#ff0000" strokeWidth="2" markerEnd="url(#arrowSlow)" fill="none" />
                  <text x="337" y="74" textAnchor="middle" fontWeight="bold" fontSize="11" fill="#ff0000" fontFamily="Arial, Helvetica, sans-serif">
                    Yes
                  </text>

                  {/* Node: Inform Customer to settle the Outstanding bill */}
                  <g>
                    <rect
                      x="130"
                      y="58"
                      width="155"
                      height="46"
                      rx="23"
                      ry="23"
                      fill="#88c848"
                      stroke="#000000"
                      strokeWidth="2"
                    />
                    <text x="207" y="77" textAnchor="middle" fontWeight="bold" fontSize="9.5" fontFamily="Arial, Helvetica, sans-serif" fill="#000000">
                      Inform Customer to settle the
                    </text>
                    <text x="207" y="91" textAnchor="middle" fontWeight="900" fontSize="10.5" fontFamily="Arial, Helvetica, sans-serif" fill="#000000">
                      Outstanding bill
                    </text>
                  </g>

                  {/* Root Node: Down Branch (No) -> Check whether the voice line is noisy */}
                  <path d="M 460 108 L 460 148" stroke="#ff0000" strokeWidth="2" markerEnd="url(#arrowSlow)" fill="none" />
                  <text x="475" y="130" textAnchor="start" fontWeight="bold" fontSize="11" fill="#ff0000" fontFamily="Arial, Helvetica, sans-serif">
                    No
                  </text>

                  {/* NODE 2: Check whether the voice line is noisy */}
                  <g>
                    <rect
                      x="395"
                      y="148"
                      width="130"
                      height="46"
                      rx="23"
                      ry="23"
                      fill="#ffffb0"
                      stroke="#000000"
                      strokeWidth="1.8"
                    />
                    <text x="460" y="167" textAnchor="middle" fontWeight="bold" fontSize="9.5" fontFamily="Arial, Helvetica, sans-serif" fill="#000000">
                      Check whether the
                    </text>
                    <text x="460" y="181" textAnchor="middle" fontWeight="bold" fontSize="9.5" fontFamily="Arial, Helvetica, sans-serif" fill="#000000">
                      voice line is noisy
                    </text>
                  </g>

                  {/* Node 2: Right Branch (Yes) -> Create a TT under Voice Service to Default Work Group with remarks */}
                  <path d="M 525 171 L 620 171" stroke="#ff0000" strokeWidth="2" markerEnd="url(#arrowSlow)" fill="none" />
                  <text x="572" y="163" textAnchor="middle" fontWeight="bold" fontSize="11" fill="#ff0000" fontFamily="Arial, Helvetica, sans-serif">
                    Yes
                  </text>

                  {/* Node: Create a TT under Voice Service to Default Work Group with remarks */}
                  <g
                    className="cursor-pointer"
                    onClick={() => copyTtDetails(ttTemplateVoiceNoise, 'tt-voice-noise')}
                  >
                    <rect
                      x="620"
                      y="140"
                      width="160"
                      height="62"
                      rx="25"
                      ry="25"
                      fill="#88c848"
                      stroke="#000000"
                      strokeWidth="2"
                    />
                    <text x="700" y="158" textAnchor="middle" fontWeight="bold" fontSize="9" fontFamily="Arial, Helvetica, sans-serif" fill="#000000">
                      Create a TT <tspan fontWeight="900">under Voice</tspan>
                    </text>
                    <text x="700" y="171" textAnchor="middle" fontWeight="900" fontSize="10" fontFamily="Arial, Helvetica, sans-serif" fill="#000000">
                      Service to Default Work
                    </text>
                    <text x="700" y="184" textAnchor="middle" fontWeight="bold" fontSize="9" fontFamily="Arial, Helvetica, sans-serif" fill="#000000">
                      <tspan fontWeight="900">Group</tspan> with remarks
                    </text>
                  </g>

                  {/* Node 2: Down Branch (No) -> Check Usage Limit is exceeded by customer */}
                  <path d="M 460 194 L 460 234" stroke="#ff0000" strokeWidth="2" markerEnd="url(#arrowSlow)" fill="none" />
                  <text x="475" y="216" textAnchor="start" fontWeight="bold" fontSize="11" fill="#ff0000" fontFamily="Arial, Helvetica, sans-serif">
                    No
                  </text>

                  {/* NODE 3: Check Usage Limit is exceeded by customer */}
                  <g>
                    <rect
                      x="395"
                      y="234"
                      width="130"
                      height="46"
                      fill="#88c848"
                      stroke="#000000"
                      strokeWidth="1.8"
                    />
                    <text x="460" y="249" textAnchor="middle" fontWeight="bold" fontSize="9" fontFamily="Arial, Helvetica, sans-serif" fill="#000000">
                      Check Usage Limit is
                    </text>
                    <text x="460" y="261" textAnchor="middle" fontWeight="bold" fontSize="9" fontFamily="Arial, Helvetica, sans-serif" fill="#000000">
                      exceeded by
                    </text>
                    <text x="460" y="272" textAnchor="middle" fontWeight="bold" fontSize="9" fontFamily="Arial, Helvetica, sans-serif" fill="#000000">
                      customer
                    </text>
                  </g>

                  {/* Node 3: Left Branch (No) -> Instruct customer to restart the ONT and create a TT to CEN-CSC-TECH work group */}
                  <path d="M 395 257 L 310 257" stroke="#ff0000" strokeWidth="2" markerEnd="url(#arrowSlow)" fill="none" />
                  <text x="350" y="250" textAnchor="middle" fontWeight="bold" fontSize="11" fill="#ff0000" fontFamily="Arial, Helvetica, sans-serif">
                    No
                  </text>

                  {/* Node: Instruct customer to restart the ONT and create a TT to CEN-CSC-TECH work group */}
                  <g
                    className="cursor-pointer"
                    onClick={() => copyTtDetails(ttTemplateCenCsc, 'tt-cencsc-speed')}
                  >
                    <rect
                      x="140"
                      y="226"
                      width="170"
                      height="62"
                      rx="25"
                      ry="25"
                      fill="#88c848"
                      stroke="#000000"
                      strokeWidth="2"
                    />
                    <text x="225" y="244" textAnchor="middle" fontWeight="bold" fontSize="8.5" fontFamily="Arial, Helvetica, sans-serif" fill="#000000">
                      Instruct customer to restart the
                    </text>
                    <text x="225" y="256" textAnchor="middle" fontWeight="bold" fontSize="8.5" fontFamily="Arial, Helvetica, sans-serif" fill="#000000">
                      ONT and create a TT to
                    </text>
                    <text x="225" y="270" textAnchor="middle" fontWeight="900" fontSize="10" fontFamily="Arial, Helvetica, sans-serif" fill="#000000">
                      CEN-CSC-TECH <tspan fontWeight="bold" fontSize="8.5">work group</tspan>
                    </text>
                  </g>

                  {/* Node 3: Down Branch (Yes) -> Ask if customer wishes to add Extra GB */}
                  <path d="M 460 280 L 460 324" stroke="#ff0000" strokeWidth="2" markerEnd="url(#arrowSlow)" fill="none" />
                  <text x="475" y="304" textAnchor="start" fontWeight="bold" fontSize="11" fill="#ff0000" fontFamily="Arial, Helvetica, sans-serif">
                    Yes
                  </text>

                  {/* NODE 4: Ask if customer wishes to add Extra GB */}
                  <g>
                    <rect
                      x="395"
                      y="324"
                      width="130"
                      height="46"
                      fill="#ffffb0"
                      stroke="#000000"
                      strokeWidth="1.8"
                    />
                    <text x="460" y="342" textAnchor="middle" fontWeight="bold" fontSize="9" fontFamily="Arial, Helvetica, sans-serif" fill="#000000">
                      Ask if customer wishes
                    </text>
                    <text x="460" y="356" textAnchor="middle" fontWeight="bold" fontSize="9" fontFamily="Arial, Helvetica, sans-serif" fill="#000000">
                      to add Extra GB
                    </text>
                  </g>

                  {/* Node 4: Right Branch (No) -> End */}
                  <path d="M 525 347 L 640 347" stroke="#ff0000" strokeWidth="2" markerEnd="url(#arrowSlow)" fill="none" />
                  <text x="580" y="340" textAnchor="middle" fontWeight="bold" fontSize="11" fill="#ff0000" fontFamily="Arial, Helvetica, sans-serif">
                    No
                  </text>

                  {/* GREEN END NODE */}
                  <g>
                    <rect
                      x="640"
                      y="330"
                      width="75"
                      height="34"
                      rx="17"
                      ry="17"
                      fill="#88c848"
                      stroke="#000000"
                      strokeWidth="1.8"
                    />
                    <text x="677" y="351" textAnchor="middle" fontWeight="bold" fontSize="11" fontFamily="Arial, Helvetica, sans-serif" fill="#000000">
                      End
                    </text>
                  </g>

                  {/* Node 4: Down Branch (Yes) -> Check extra GB field in I HUB/CRM */}
                  <path d="M 460 370 L 460 410" stroke="#ff0000" strokeWidth="2" markerEnd="url(#arrowSlow)" fill="none" />
                  <text x="475" y="392" textAnchor="start" fontWeight="bold" fontSize="11" fill="#ff0000" fontFamily="Arial, Helvetica, sans-serif">
                    Yes
                  </text>

                  {/* NODE 5: Check extra GB field in I HUB/CRM */}
                  <g>
                    <rect
                      x="395"
                      y="410"
                      width="130"
                      height="46"
                      fill="#88c848"
                      stroke="#000000"
                      strokeWidth="1.8"
                    />
                    <text x="460" y="429" textAnchor="middle" fontWeight="bold" fontSize="9" fontFamily="Arial, Helvetica, sans-serif" fill="#000000">
                      Check extra GB field
                    </text>
                    <text x="460" y="443" textAnchor="middle" fontWeight="bold" fontSize="9" fontFamily="Arial, Helvetica, sans-serif" fill="#000000">
                      in I HUB/CRM
                    </text>
                  </g>

                  {/* Node 5: Left Branch (Yes) -> Follow the QED instructions and Add Extra GB */}
                  <path d="M 395 433 L 295 433" stroke="#ff0000" strokeWidth="2" markerEnd="url(#arrowSlow)" fill="none" />
                  <text x="345" y="425" textAnchor="middle" fontWeight="bold" fontSize="11" fill="#ff0000" fontFamily="Arial, Helvetica, sans-serif">
                    Yes
                  </text>

                  {/* Node: Follow the QED instructions and Add Extra GB */}
                  <g>
                    <rect
                      x="145"
                      y="410"
                      width="150"
                      height="46"
                      rx="23"
                      ry="23"
                      fill="#88c848"
                      stroke="#000000"
                      strokeWidth="2"
                    />
                    <text x="220" y="429" textAnchor="middle" fontWeight="bold" fontSize="9" fontFamily="Arial, Helvetica, sans-serif" fill="#000000">
                      Follow the QED instructions
                    </text>
                    <text x="220" y="443" textAnchor="middle" fontWeight="900" fontSize="9.5" fontFamily="Arial, Helvetica, sans-serif" fill="#000000">
                      and Add Extra GB
                    </text>
                  </g>

                  {/* Node 5: Right Branch (No) -> Don't add extra GB through 1212 but instruct customer... */}
                  <path d="M 525 433 L 645 433" stroke="#ff0000" strokeWidth="2" markerEnd="url(#arrowSlow)" fill="none" />
                  <text x="585" y="425" textAnchor="middle" fontWeight="bold" fontSize="11" fill="#ff0000" fontFamily="Arial, Helvetica, sans-serif">
                    No
                  </text>

                  {/* Node: Don't add extra GB through 1212... */}
                  <g
                    className="cursor-pointer"
                    onClick={() => copyTtDetails(extraGbAdviceText, 'extra-gb-advice')}
                  >
                    <rect
                      x="645"
                      y="404"
                      width="235"
                      height="58"
                      rx="29"
                      ry="29"
                      fill="#ffffb0"
                      stroke="#000000"
                      strokeWidth="1.8"
                    />
                    <text x="762" y="423" textAnchor="middle" fontWeight="bold" fontSize="8" fontFamily="Arial, Helvetica, sans-serif" fill="#000000">
                      Don’t add extra GB through 1212 but instruct
                    </text>
                    <text x="762" y="435" textAnchor="middle" fontWeight="bold" fontSize="8" fontFamily="Arial, Helvetica, sans-serif" fill="#000000">
                      customer add extra GBs by using My SLT App,
                    </text>
                    <text x="762" y="447" textAnchor="middle" fontWeight="900" fontSize="8.5" fontFamily="Arial, Helvetica, sans-serif" fill="#000000">
                      My SLT portal &amp; 0112121212 IVR
                    </text>
                  </g>

                  {/* ======================================================== */}
                  {/* BOTTOM PURPLE CALLOUT RIBBON MATCHING EXACT SCREENSHOT   */}
                  {/* ======================================================== */}
                  <g>
                    <path
                      d="M 50 490 C 30 490, 30 610, 50 610 L 160 610 C 180 610, 155 550, 180 490 Z"
                      fill="#f5e8ff"
                      stroke="#800080"
                      strokeWidth="2"
                    />
                    <text x="90" y="515" fontWeight="bold" fontSize="9.5" fill="#ff0000" fontFamily="Arial, Helvetica, sans-serif">
                      Note:
                    </text>
                    <text x="90" y="530" fontWeight="bold" fontSize="8.5" fill="#000000" fontFamily="Arial, Helvetica, sans-serif">
                      Please follow QED
                    </text>
                    <text x="90" y="543" fontWeight="bold" fontSize="8.5" fill="#000000" fontFamily="Arial, Helvetica, sans-serif">
                      for Process of Adding
                    </text>
                    <text x="90" y="556" fontWeight="bold" fontSize="8.5" fill="#000000" fontFamily="Arial, Helvetica, sans-serif">
                      Extra GB for
                    </text>
                    <text x="90" y="569" fontWeight="bold" fontSize="8.5" fill="#000000" fontFamily="Arial, Helvetica, sans-serif">
                      Broadband
                    </text>
                    <text x="90" y="582" fontWeight="bold" fontSize="8.5" fill="#000000" fontFamily="Arial, Helvetica, sans-serif">
                      Customers
                    </text>
                  </g>

                </svg>
              </div>

            </div>
          )}

          {/* 7. BOTTOM NAVIGATION FOOTER */}
          <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200">
            <Link
              href="/knowledge-hub/faq/ftth/wifi-not-working"
              className="px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-2 transition-all shadow-2xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous: Wi-Fi Not Working SOP</span>
            </Link>

            <Link
              href="/knowledge-hub/faq/ftth"
              className="px-4 py-2 rounded-lg bg-[#005696] hover:bg-[#00477d] text-white font-bold text-xs flex items-center gap-2 transition-all shadow-xs"
            >
              <span>Back to FAQs - FTTH</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      </div>

    </div>
  );
}
