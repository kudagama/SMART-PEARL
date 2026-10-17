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
  Plug,
  RotateCcw,
  Copy,
  Target,
  Sparkles,
  PhoneCall,
  ExternalLink,
  Share2,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Zap,
  Info
} from 'lucide-react';

export default function OntNotWorkingPage() {
  const [powerStatus, setPowerStatus] = useState<'OFF' | 'ON' | null>('OFF');
  const [offStep, setOffStep] = useState<'initial' | 'power_btn_failed' | 'charger_connected_not_working'>('initial');
  const [onStep, setOnStep] = useState<'initial' | 'restart_failed'>('initial');
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'interactive' | 'flowchart'>('interactive');

  const copyTtDetails = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const ttTemplate = `Work Group: AREA-CPE-MTCE
Fault Type: ONT Hardware / Power Failure (ONT Not Working)
Diagnostic Summary:
• Customer reported ONT is completely unresponsive.
• Power indicator status: ${powerStatus || 'OFF'}
• Power button toggled: Yes (Customer premises)
• Charger / adapter connection verified: Yes (Connected properly)
• Wall socket tested: Yes
• Result: ONT remains dead / power not restored.
Action Required: Technician dispatch for on-site CPE hardware swap & power adapter inspection.`;

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
          <span className="font-bold text-[#005696]">ONT Not Working</span>
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
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-600/30 text-red-300 border border-red-500/40 flex items-center gap-1">
              <Power className="w-3 h-3 text-red-400" /> FTTH Hardware Diagnostic SOP
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-cyan-200 border border-cyan-400/30">
              Rule: RULE_STB_ONT_ROUTER_FAULTY
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white drop-shadow-md">
            ONT NOT WORKING - Troubleshooting & Decision Flowchart
          </h1>
          <p className="text-slate-300 text-xs md:text-sm max-w-3xl leading-relaxed">
            Step-by-step diagnostic workflow for Customer Service Officers. Guide the subscriber to check the power indicator, test wall outlet connections, and execute on-site technician dispatch to <strong className="text-white font-bold">AREA-CPE-MTCE</strong> when hardware failure is confirmed.
          </p>

          {/* Quick action buttons & view mode switcher */}
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
              <span className="text-slate-300 text-[11px]">Direct Escalation:</span>
              <span className="px-3 py-1 rounded-md bg-red-600 text-white font-black text-xs shadow-xs flex items-center gap-1">
                <Target className="w-3.5 h-3.5" /> AREA-CPE-MTCE
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* 5. MAIN CONTENT AREA */}
      <div className="flex-1 p-6 md:p-8 bg-slate-50">
        <div className="max-w-6xl mx-auto space-y-6">

          {/* CRITICAL SLT OPERATIONAL ALERTS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Alert 1: Tenda ONT Special Handling */}
            <div className="p-4 rounded-xl border-2 border-black bg-[#e9d5ff] shadow-[4px_4px_0px_#000] flex items-start gap-3">
              <div className="p-2 rounded-lg bg-purple-700 text-white shrink-0 mt-0.5">
                <Power className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <h4 className="font-black text-xs text-purple-950 uppercase tracking-wider">
                  Special Note: Tenda ONT Models
                </h4>
                <p className="text-xs font-bold text-slate-900 leading-relaxed">
                  There is <span className="underline decoration-red-600 decoration-2">no power button</span> on TENDA ONT models. Inform the customer to switch off the power directly from the 230V wall socket.
                </p>
              </div>
            </div>

            {/* Alert 2: Mandatory TT Description Standard */}
            <div className="p-4 rounded-xl border-2 border-black bg-[#e9d5ff] shadow-[4px_4px_0px_#000] flex items-start gap-3">
              <div className="p-2 rounded-lg bg-purple-700 text-white shrink-0 mt-0.5">
                <FileText className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <h4 className="font-black text-xs text-purple-950 uppercase tracking-wider">
                  Mandatory TT Quality Standard
                </h4>
                <p className="text-xs font-bold text-slate-900 leading-relaxed">
                  TT Description is <span className="text-red-700 font-black">mandatory</span>. Ensure the TT description clearly matches the customer's reported complaint and includes all relevant troubleshooting details (LED status, power button check, charger verification).
                </p>
              </div>
            </div>

          </div>

          {/* VIEW MODE 1: INTERACTIVE STEP-BY-STEP TROUBLESHOOTER */}
          {viewMode === 'interactive' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
              
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#005696]">
                    Interactive Diagnostic Assistant
                  </span>
                  <h3 className="text-lg font-black text-slate-900">
                    Step 1: Check the Power indicator in ONT
                  </h3>
                </div>
                <span className="text-xs text-slate-500 font-medium">
                  Ask the customer to observe the front panel Power LED
                </span>
              </div>

              {/* Power Status Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* OFF Option */}
                <button
                  onClick={() => {
                    setPowerStatus('OFF');
                    setOffStep('initial');
                  }}
                  className={`p-5 rounded-xl border-2 transition-all text-left flex items-center justify-between ${
                    powerStatus === 'OFF'
                      ? 'border-black bg-amber-50 shadow-[4px_4px_0px_#000]'
                      : 'border-slate-200 hover:border-slate-400 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-slate-400 flex items-center justify-center font-black text-slate-700 text-sm">
                      OFF
                    </div>
                    <div>
                      <h4 className="font-black text-sm text-slate-900">Power LED is OFF</h4>
                      <p className="text-xs text-slate-500 font-medium">Indicator light is completely unlit</p>
                    </div>
                  </div>
                  {powerStatus === 'OFF' && (
                    <CheckCircle2 className="w-5 h-5 text-amber-600 shrink-0" />
                  )}
                </button>

                {/* ON Option */}
                <button
                  onClick={() => {
                    setPowerStatus('ON');
                    setOnStep('initial');
                  }}
                  className={`p-5 rounded-xl border-2 transition-all text-left flex items-center justify-between ${
                    powerStatus === 'ON'
                      ? 'border-black bg-emerald-50 shadow-[4px_4px_0px_#000]'
                      : 'border-slate-200 hover:border-slate-400 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-full bg-emerald-500 border-2 border-emerald-700 flex items-center justify-center font-black text-white text-sm">
                      ON
                    </div>
                    <div>
                      <h4 className="font-black text-sm text-slate-900">Power LED is ON</h4>
                      <p className="text-xs text-slate-500 font-medium">Indicator light is solid or illuminated</p>
                    </div>
                  </div>
                  {powerStatus === 'ON' && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  )}
                </button>

              </div>

              {/* BRANCH 1: POWER STATUS IS OFF */}
              {powerStatus === 'OFF' && (
                <div className="space-y-4 pt-2">
                  
                  {/* Step A: Switch on by the Power button */}
                  <div className="p-5 rounded-xl border-2 border-black bg-[#5cb85c]/20 shadow-[3px_3px_0px_#000] space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[#5cb85c] text-white flex items-center justify-center font-bold text-xs border border-black">
                          1
                        </span>
                        <h4 className="font-black text-sm text-slate-900">
                          Instruct Customer: Switch on by the Power button in ONT
                        </h4>
                      </div>
                      <span className="text-[11px] font-bold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-300">
                        Check Button State
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 font-medium leading-relaxed">
                      Ask subscriber to locate the black circular or push button on the side/rear of the ONT. Press once to switch ON. (If TENDA ONT, remind subscriber there is no button; check the wall socket).
                    </p>

                    <div className="flex items-center gap-3 pt-2">
                      <button
                        onClick={() => setOffStep('initial')}
                        className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
                      >
                        <Check className="w-3.5 h-3.5" /> Working (Power Restored $\rightarrow$ END)
                      </button>

                      <button
                        onClick={() => setOffStep('power_btn_failed')}
                        className={`px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-1.5 border transition-all ${
                          offStep === 'power_btn_failed' || offStep === 'charger_connected_not_working'
                            ? 'bg-rose-600 text-white border-rose-700 shadow-xs'
                            : 'bg-white hover:bg-rose-50 text-rose-700 border-rose-300'
                        }`}
                      >
                        <AlertCircle className="w-3.5 h-3.5" /> Not Working (Still Dead)
                      </button>
                    </div>
                  </div>

                  {/* Step B: Check Power Charger (Triggered if power button failed) */}
                  {(offStep === 'power_btn_failed' || offStep === 'charger_connected_not_working') && (
                    <div className="p-5 rounded-xl border-2 border-black bg-[#5cb85c]/20 shadow-[3px_3px_0px_#000] space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-[#5cb85c] text-white flex items-center justify-center font-bold text-xs border border-black">
                            2
                          </span>
                          <h4 className="font-black text-sm text-slate-900">
                            Check whether the power charger / adapter is connected properly
                          </h4>
                        </div>
                        <span className="text-[11px] font-bold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-300">
                          Physical Inspection
                        </span>
                      </div>

                      <p className="text-xs text-slate-700 font-medium leading-relaxed">
                        Verify if the 12V DC power jack is fully inserted into the back of the ONT and the AC wall adapter is plugged into an active wall socket (not a loose multi-plug).
                      </p>

                      <div className="flex items-center flex-wrap gap-3 pt-2">
                        <button
                          onClick={() => {
                            setOffStep('power_btn_failed');
                            alert('Instruct customer: Connect power charger properly and switch on wall socket. Once power turns green, issue is resolved (END).');
                          }}
                          className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
                        >
                          <Plug className="w-3.5 h-3.5" /> Loose/Disconnected $\rightarrow$ Connect Properly (END)
                        </button>

                        <button
                          onClick={() => setOffStep('charger_connected_not_working')}
                          className={`px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-1.5 border transition-all ${
                            offStep === 'charger_connected_not_working'
                              ? 'bg-red-600 text-white border-red-700 shadow-xs'
                              : 'bg-white hover:bg-red-50 text-red-700 border-red-300'
                          }`}
                        >
                          <AlertCircle className="w-3.5 h-3.5" /> Connected properly but not working
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Terminal Escalation: CREATE TT TO AREA-CPE-MTCE */}
                  {offStep === 'charger_connected_not_working' && (
                    <div className="p-6 rounded-xl border-2 border-black bg-red-600 text-white shadow-[4px_4px_0px_#000] space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Target className="w-5 h-5 text-white animate-bounce" />
                          <h3 className="text-base font-black uppercase tracking-wide">
                            Official Resolution: Create a TT to AREA-CPE-MTCE
                          </h3>
                        </div>
                        <span className="px-2.5 py-1 rounded bg-black/30 text-white text-[10px] font-bold uppercase tracking-wider">
                          Hardware Swap Required
                        </span>
                      </div>

                      <p className="text-xs text-white/95 leading-relaxed font-medium">
                        Device confirmed non-operational (hardware failure or blown adapter). Immediate Trouble Ticket dispatch to <strong>AREA-CPE-MTCE</strong> for physical premises replacement.
                      </p>

                      {/* Ready-to-copy Ticket Template */}
                      <div className="bg-slate-900/90 text-white p-4 rounded-lg font-mono text-[11px] space-y-2 border border-black/40">
                        <div className="flex items-center justify-between text-slate-400 border-b border-slate-700 pb-1.5">
                          <span>Standard Trouble Ticket Draft</span>
                          <button
                            onClick={() => copyTtDetails(ttTemplate)}
                            className="px-2.5 py-1 bg-[#005696] hover:bg-[#0070ba] text-white text-[10px] rounded flex items-center gap-1 transition-all"
                          >
                            {copied ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3" />}
                            <span>{copied ? 'Copied!' : 'Copy TT'}</span>
                          </button>
                        </div>
                        <pre className="whitespace-pre-wrap leading-relaxed text-emerald-300">
                          {ttTemplate}
                        </pre>
                      </div>

                      <div className="flex items-center justify-end gap-3 pt-2">
                        <button
                          onClick={() => copyTtDetails(ttTemplate)}
                          className="px-5 py-2.5 rounded-lg bg-white text-red-600 font-black text-xs hover:bg-slate-100 flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
                        >
                          {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                          <span>{copied ? 'Copied to Clipboard!' : 'Copy TT & Dispatch to AREA-CPE-MTCE'}</span>
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              )}

              {/* BRANCH 2: POWER STATUS IS ON */}
              {powerStatus === 'ON' && (
                <div className="space-y-4 pt-2">
                  
                  {/* Step A: Switch off switch on the ONT (RESTART) */}
                  <div className="p-5 rounded-xl border-2 border-black bg-[#5cb85c]/20 shadow-[3px_3px_0px_#000] space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[#5cb85c] text-white flex items-center justify-center font-bold text-xs border border-black">
                          1
                        </span>
                        <h4 className="font-black text-sm text-slate-900">
                          Instruct Customer: Switch off switch on the ONT (RESTART)
                        </h4>
                      </div>
                      <span className="text-[11px] font-bold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-300">
                        Power Cycle
                      </span>
                    </div>

                    {/* Lavender note for restart procedure */}
                    <div className="p-3 rounded-lg border border-black bg-[#d8b4fe] text-xs font-bold text-slate-900 leading-relaxed shadow-2xs">
                      Restart means: Switch off and on from the power button/power socket or unplug from the power adapter. Wait 15 seconds before powering back on.
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <button
                        onClick={() => setOnStep('initial')}
                        className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
                      >
                        <Check className="w-3.5 h-3.5" /> Working (Restored after Restart $\rightarrow$ END)
                      </button>

                      <button
                        onClick={() => setOnStep('restart_failed')}
                        className={`px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-1.5 border transition-all ${
                          onStep === 'restart_failed'
                            ? 'bg-rose-600 text-white border-rose-700 shadow-xs'
                            : 'bg-white hover:bg-rose-50 text-rose-700 border-rose-300'
                        }`}
                      >
                        <AlertCircle className="w-3.5 h-3.5" /> Not Working (Unresponsive)
                      </button>
                    </div>
                  </div>

                  {/* Terminal Escalation: CREATE TT TO AREA-CPE-MTCE */}
                  {onStep === 'restart_failed' && (
                    <div className="p-6 rounded-xl border-2 border-black bg-red-600 text-white shadow-[4px_4px_0px_#000] space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Target className="w-5 h-5 text-white animate-bounce" />
                          <h3 className="text-base font-black uppercase tracking-wide">
                            Official Resolution: Create a TT to AREA-CPE-MTCE
                          </h3>
                        </div>
                        <span className="px-2.5 py-1 rounded bg-black/30 text-white text-[10px] font-bold uppercase tracking-wider">
                          Hardware Swapped by Technician
                        </span>
                      </div>

                      <p className="text-xs text-white/95 leading-relaxed font-medium">
                        Device remains faulty despite successful power cycle reboot. Dispatch Trouble Ticket to <strong>AREA-CPE-MTCE</strong> for on-site CPE replacement.
                      </p>

                      <div className="bg-slate-900/90 text-white p-4 rounded-lg font-mono text-[11px] space-y-2 border border-black/40">
                        <div className="flex items-center justify-between text-slate-400 border-b border-slate-700 pb-1.5">
                          <span>Standard Trouble Ticket Draft</span>
                          <button
                            onClick={() => copyTtDetails(ttTemplate)}
                            className="px-2.5 py-1 bg-[#005696] hover:bg-[#0070ba] text-white text-[10px] rounded flex items-center gap-1 transition-all"
                          >
                            {copied ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3" />}
                            <span>{copied ? 'Copied!' : 'Copy TT'}</span>
                          </button>
                        </div>
                        <pre className="whitespace-pre-wrap leading-relaxed text-emerald-300">
                          {ttTemplate}
                        </pre>
                      </div>

                      <div className="flex items-center justify-end gap-3 pt-2">
                        <button
                          onClick={() => copyTtDetails(ttTemplate)}
                          className="px-5 py-2.5 rounded-lg bg-white text-red-600 font-black text-xs hover:bg-slate-100 flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
                        >
                          {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                          <span>{copied ? 'Copied to Clipboard!' : 'Copy TT & Dispatch to AREA-CPE-MTCE'}</span>
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              )}

            </div>
          )}

          {/* VIEW MODE 2: VISUAL DECISION TREE DIAGRAM (OFFICIAL SHAREPOINT LAYOUT) */}
          {viewMode === 'flowchart' && (
            <div className="bg-white rounded-xl border border-slate-300 shadow-md p-6 sm:p-10 space-y-6">
              
              <div className="text-center space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Sri Lanka Telecom - Contact Center Quality SOP
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  ONT NOT WORKING - Official Decision Flowchart
                </h2>
              </div>

              {/* The SVG Vector Flowchart */}
              <div className="max-w-3xl mx-auto border border-slate-200 rounded-xl p-4 sm:p-6 bg-slate-50/50">
                <svg
                  viewBox="0 0 800 720"
                  className="w-full h-auto select-none font-sans"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <filter id="retroShadowPage" x="-15%" y="-15%" width="130%" height="130%">
                      <feDropShadow dx="4" dy="4" stdDeviation="0" floodColor="#000000" floodOpacity="1" />
                    </filter>
                    <filter id="retroShadowSmPage" x="-15%" y="-15%" width="130%" height="130%">
                      <feDropShadow dx="3" dy="3" stdDeviation="0" floodColor="#000000" floodOpacity="1" />
                    </filter>
                    <marker id="arrowPage" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#000000" />
                    </marker>
                  </defs>

                  {/* Flowchart Header */}
                  <text
                    x="410"
                    y="32"
                    textAnchor="middle"
                    fontWeight="900"
                    fontSize="28"
                    fontFamily="Arial, Helvetica, sans-serif"
                    fill="#000000"
                    letterSpacing="0.5"
                  >
                    ONT NOT WORKING
                  </text>

                  {/* ROOT NODE: Check the Power indicator in ONT */}
                  <g>
                    <rect
                      x="235"
                      y="54"
                      width="350"
                      height="46"
                      rx="23"
                      ry="23"
                      fill="#ffffff"
                      stroke="#000000"
                      strokeWidth="2.5"
                      filter="url(#retroShadowPage)"
                    />
                    <text
                      x="410"
                      y="82"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="14.5"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      Check the Power indicator in ONT
                    </text>
                  </g>

                  {/* FORK ARROWS DOWN TO OFF AND ON */}
                  <path d="M 320 100 L 320 138" stroke="#000000" strokeWidth="2.5" markerEnd="url(#arrowPage)" />
                  <path d="M 520 100 L 520 138" stroke="#000000" strokeWidth="2.5" markerEnd="url(#arrowPage)" />

                  {/* OFF NODE */}
                  <g>
                    <rect
                      x="270"
                      y="138"
                      width="100"
                      height="30"
                      rx="15"
                      ry="15"
                      fill="#ffffff"
                      stroke="#000000"
                      strokeWidth="2"
                      filter="url(#retroShadowSmPage)"
                    />
                    <text
                      x="320"
                      y="158"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="13"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      OFF
                    </text>
                  </g>

                  {/* ON NODE */}
                  <g>
                    <rect
                      x="470"
                      y="138"
                      width="100"
                      height="30"
                      rx="15"
                      ry="15"
                      fill="#ffffff"
                      stroke="#000000"
                      strokeWidth="2"
                      filter="url(#retroShadowSmPage)"
                    />
                    <text
                      x="520"
                      y="158"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="13"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      ON
                    </text>
                  </g>

                  {/* ================= LEFT BRANCH (OFF) ================= */}
                  <path d="M 320 168 L 320 206" stroke="#000000" strokeWidth="2.5" markerEnd="url(#arrowPage)" />

                  {/* Green Node: Switch on by the Power button in ONT */}
                  <g>
                    <rect
                      x="195"
                      y="206"
                      width="250"
                      height="42"
                      rx="21"
                      ry="21"
                      fill="#5cb85c"
                      stroke="#000000"
                      strokeWidth="2"
                      filter="url(#retroShadowPage)"
                    />
                    <text
                      x="320"
                      y="223"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="11.5"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      Switch on by the Power button
                    </text>
                    <text
                      x="320"
                      y="237"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="11.5"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      in ONT
                    </text>
                  </g>

                  {/* Arrow Left to END */}
                  <path d="M 195 227 L 140 227" stroke="#000000" strokeWidth="2.5" markerEnd="url(#arrowPage)" />
                  <text
                    x="170"
                    y="218"
                    textAnchor="middle"
                    fontWeight="bold"
                    fontSize="11"
                    fill="#00b050"
                    fontFamily="Arial, Helvetica, sans-serif"
                  >
                    Working
                  </text>
                  <text
                    x="130"
                    y="231"
                    textAnchor="end"
                    fontWeight="900"
                    fontSize="13"
                    fill="#00b050"
                    fontFamily="Arial, Helvetica, sans-serif"
                  >
                    END
                  </text>

                  {/* Arrow Down from Switch on... to Check charger */}
                  <path d="M 320 248 L 320 292" stroke="#000000" strokeWidth="2.5" markerEnd="url(#arrowPage)" />
                  <text
                    x="310"
                    y="273"
                    textAnchor="end"
                    fontWeight="bold"
                    fontSize="11"
                    fill="#e11d48"
                    fontFamily="Arial, Helvetica, sans-serif"
                  >
                    Not Working
                  </text>

                  {/* Green Node: Check whether the power charger is connected properly */}
                  <g>
                    <rect
                      x="185"
                      y="292"
                      width="270"
                      height="42"
                      rx="21"
                      ry="21"
                      fill="#5cb85c"
                      stroke="#000000"
                      strokeWidth="2"
                      filter="url(#retroShadowPage)"
                    />
                    <text
                      x="320"
                      y="309"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="11.5"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      Check whether the power charger is
                    </text>
                    <text
                      x="320"
                      y="323"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="11.5"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      connected properly
                    </text>
                  </g>

                  {/* Left Branch from Check charger to Connect Power Charger properly */}
                  <path d="M 185 313 L 130 313 L 130 348" stroke="#000000" strokeWidth="2.5" markerEnd="url(#arrowPage)" fill="none" />
                  <text
                    x="160"
                    y="305"
                    textAnchor="middle"
                    fontWeight="bold"
                    fontSize="11"
                    fill="#e11d48"
                    fontFamily="Arial, Helvetica, sans-serif"
                  >
                    No
                  </text>

                  {/* Green Node: Connect Power Charger properly */}
                  <g>
                    <rect
                      x="45"
                      y="348"
                      width="170"
                      height="42"
                      rx="21"
                      ry="21"
                      fill="#5cb85c"
                      stroke="#000000"
                      strokeWidth="2"
                      filter="url(#retroShadowPage)"
                    />
                    <text
                      x="130"
                      y="365"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="11.5"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      Connect Power Charger
                    </text>
                    <text
                      x="130"
                      y="379"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="11.5"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      properly
                    </text>
                  </g>

                  {/* Arrow down from Connect Power Charger properly to END */}
                  <path d="M 130 390 L 130 422" stroke="#000000" strokeWidth="2.5" markerEnd="url(#arrowPage)" />
                  <text
                    x="130"
                    y="440"
                    textAnchor="middle"
                    fontWeight="900"
                    fontSize="13"
                    fill="#00b050"
                    fontFamily="Arial, Helvetica, sans-serif"
                  >
                    END
                  </text>

                  {/* Line from Check charger to Red TT Node */}
                  <path d="M 320 334 L 320 460 L 520 460 L 520 414" stroke="#000000" strokeWidth="2.5" markerEnd="url(#arrowPage)" fill="none" />
                  <text
                    x="420"
                    y="445"
                    textAnchor="middle"
                    fontWeight="bold"
                    fontSize="11"
                    fill="#000000"
                    fontFamily="Arial, Helvetica, sans-serif"
                  >
                    Connected properly
                  </text>
                  <text
                    x="420"
                    y="457"
                    textAnchor="middle"
                    fontWeight="bold"
                    fontSize="11"
                    fill="#000000"
                    fontFamily="Arial, Helvetica, sans-serif"
                  >
                    but not working
                  </text>

                  {/* ================= RIGHT BRANCH (ON) ================= */}
                  <path d="M 520 168 L 520 206" stroke="#000000" strokeWidth="2.5" markerEnd="url(#arrowPage)" />

                  {/* Green Node: Switch off switch on the ONT (RESTART) */}
                  <g>
                    <rect
                      x="395"
                      y="206"
                      width="250"
                      height="42"
                      rx="21"
                      ry="21"
                      fill="#5cb85c"
                      stroke="#000000"
                      strokeWidth="2"
                      filter="url(#retroShadowPage)"
                    />
                    <text
                      x="520"
                      y="223"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="11.5"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      Switch off switch on the ONT
                    </text>
                    <text
                      x="520"
                      y="237"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="11.5"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      (RESTART)
                    </text>
                  </g>

                  {/* Arrow Right to END */}
                  <path d="M 645 227 L 700 227" stroke="#000000" strokeWidth="2.5" markerEnd="url(#arrowPage)" />
                  <text
                    x="670"
                    y="218"
                    textAnchor="middle"
                    fontWeight="bold"
                    fontSize="11"
                    fill="#00b050"
                    fontFamily="Arial, Helvetica, sans-serif"
                  >
                    Working
                  </text>
                  <text
                    x="708"
                    y="231"
                    textAnchor="start"
                    fontWeight="900"
                    fontSize="13"
                    fill="#00b050"
                    fontFamily="Arial, Helvetica, sans-serif"
                  >
                    END
                  </text>

                  {/* Arrow down from RESTART to Lavender Note */}
                  <path d="M 520 248 L 520 274" stroke="#000000" strokeWidth="2.5" markerEnd="url(#arrowPage)" />

                  {/* Lavender Node: Restart means,Switch off and on... */}
                  <g>
                    <rect
                      x="375"
                      y="274"
                      width="290"
                      height="52"
                      rx="24"
                      ry="24"
                      fill="#d8b4fe"
                      stroke="#000000"
                      strokeWidth="2"
                      filter="url(#retroShadowPage)"
                    />
                    <text
                      x="520"
                      y="290"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="10"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      Restart means,Switch off and on from the
                    </text>
                    <text
                      x="520"
                      y="303"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="10"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      power button/power socket or unplug from
                    </text>
                    <text
                      x="520"
                      y="316"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="10"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      the power adapter
                    </text>
                  </g>

                  {/* Arrow down from Lavender Note to Red TT Node */}
                  <path d="M 520 326 L 520 366" stroke="#000000" strokeWidth="2.5" markerEnd="url(#arrowPage)" />
                  <text
                    x="530"
                    y="348"
                    textAnchor="start"
                    fontWeight="bold"
                    fontSize="11"
                    fill="#e11d48"
                    fontFamily="Arial, Helvetica, sans-serif"
                  >
                    Not Working
                  </text>

                  {/* RED TARGET NODE: Create a TT to AREA-CPE-MTCE */}
                  <g
                    className="cursor-pointer"
                    onClick={() => copyTtDetails(ttTemplate)}
                  >
                    <rect
                      x="410"
                      y="366"
                      width="220"
                      height="44"
                      rx="22"
                      ry="22"
                      fill="#ef4444"
                      stroke="#000000"
                      strokeWidth="2.5"
                      filter="url(#retroShadowPage)"
                    />
                    <text
                      x="520"
                      y="384"
                      textAnchor="middle"
                      fontWeight="900"
                      fontSize="12.5"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      Create a TT to
                    </text>
                    <text
                      x="520"
                      y="399"
                      textAnchor="middle"
                      fontWeight="900"
                      fontSize="12.5"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      AREA-CPE-MTCE
                    </text>
                  </g>

                  {/* ================= BOTTOM NOTES ================= */}
                  <g>
                    <rect
                      x="250"
                      y="545"
                      width="320"
                      height="46"
                      rx="23"
                      ry="23"
                      fill="#d8b4fe"
                      stroke="#000000"
                      strokeWidth="2"
                      filter="url(#retroShadowPage)"
                    />
                    <text
                      x="410"
                      y="560"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="10.5"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      theres no power button in TENDA ONT
                    </text>
                    <text
                      x="410"
                      y="572"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="10.5"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      inform customer to switch off
                    </text>
                    <text
                      x="410"
                      y="584"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="10.5"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      the power from the wall socket.
                    </text>
                  </g>

                  <g>
                    <rect
                      x="200"
                      y="608"
                      width="420"
                      height="64"
                      rx="28"
                      ry="28"
                      fill="#d8b4fe"
                      stroke="#000000"
                      strokeWidth="2"
                      filter="url(#retroShadowPage)"
                    />
                    <text
                      x="410"
                      y="626"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="11"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      TT Description is mandatory. Ensure the TT
                    </text>
                    <text
                      x="410"
                      y="641"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="11"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      description clearly matches the customer's
                    </text>
                    <text
                      x="410"
                      y="655"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="11"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      reported complaint and includes all
                    </text>
                    <text
                      x="410"
                      y="669"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="11"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      relevant troubleshooting details.
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

            <Link
              href="/knowledge-hub"
              className="px-4 py-2 rounded-lg bg-[#005696] hover:bg-[#00477d] text-white font-bold text-xs flex items-center gap-2 transition-all shadow-xs"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Knowledge Hub Home</span>
            </Link>
          </div>

        </div>
      </div>

    </div>
  );
}
