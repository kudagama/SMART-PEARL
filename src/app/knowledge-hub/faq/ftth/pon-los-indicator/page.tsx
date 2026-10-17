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
  RotateCcw
} from 'lucide-react';

export default function PonLosIndicatorPage() {
  const [indicatorStatus, setIndicatorStatus] = useState<'RED_OFF_BLINKING' | 'STEADY'>('STEADY');
  const [steadyStep, setSteadyStep] = useState<'restart' | 'browser' | 'device' | 'proxy' | 'proxy_on' | 'proxy_off_failed'>('restart');
  const [viewMode, setViewMode] = useState<'interactive' | 'flowchart'>('interactive');
  const [copied, setCopied] = useState(false);

  const copyTtDetails = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const ttTemplateRed = `Target Work Group: AREA-CPE-MTCE (or Default WG if customer unavailable)
Fault Complaint: Optical Signal Failure (PON / LOS Indicator Faulty)
Diagnostic Log:
• Observed ONT LED Status: ${indicatorStatus === 'RED_OFF_BLINKING' ? 'RED / OFF / BLINKING' : 'STEADY'}
• Optical Power: Loss of signal / Cable cut suspected
• Physical inspection: Patch cord checked, optical fiber lead connected
• Customer Availability: At premises (Confirmed)
Action Required: Field technician dispatch for optical link power level measurement (-8 to -27 dBm) and CPE transceiver inspection.`;

  const ttTemplateSteady = `Target Work Group: AREA-CPE-MTCE
Fault Complaint: FTTH No Internet Access (PON Steady, LAN/WAN Session Dead)
Diagnostic Log:
• Observed ONT LED Status: PON STEADY (Optical carrier healthy)
• Troubleshooting Steps Executed:
  1. ONT Restarted (Power cycled): Completed (No change)
  2. Browser Changed (Chrome/Edge tested): Completed (No change)
  3. Secondary Device Tested (Mobile/PC): Completed (No change)
  4. Private Proxy / VPN: Checked & switched off. Connection remains broken.
Action Required: Technician dispatch for ONT routing table clearance, CPE hardware swap, or gateway provisioning reset.`;

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
          <span className="font-bold text-[#005696]">PON/LOS Indicators</span>
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
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/30 text-amber-300 border border-amber-500/40 flex items-center gap-1">
              <Radio className="w-3 h-3 text-amber-400" /> Optical Carrier Diagnostic SOP
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-cyan-200 border border-cyan-400/30">
              Rules: RULE_LOS_RED / RULE_FIBER_VOICE_LINE_FAULT
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white drop-shadow-md">
            PON/LOS Indicator RED, OFF, Blinking or Steady
          </h1>
          <p className="text-slate-300 text-xs md:text-sm max-w-3xl leading-relaxed">
            Standard operating procedure to diagnose FTTH optical connectivity. Immediately escalate RED / OFF / BLINKING states to <strong className="text-white font-bold">AREA-CPE-MTCE</strong> for physical fiber repair, or guide the customer through ONT restart, browser, device, and proxy isolation if PON is STEADY.
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
                <BookOpen className="w-3.5 h-3.5 text-amber-300" />
                <span>Visual Decision Tree Diagram</span>
              </button>
            </div>

            <div className="flex items-center gap-2 ml-auto text-xs">
              <span className="text-slate-300 text-[11px]">Primary Dispatch:</span>
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

          {/* CRITICAL OPERATIONAL ALERTS (MATCHING THE OFFICIAL SCREENSHOT NOTES) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Note 1: Customer Not Available at Location */}
            <div className="p-4 rounded-xl border-2 border-black bg-[#e9d5ff] shadow-[4px_4px_0px_#000] flex items-start gap-3">
              <div className="p-2 rounded-lg bg-purple-700 text-white shrink-0 mt-0.5">
                <Clock className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <h4 className="font-black text-xs text-purple-950 uppercase tracking-wider">
                  If Customer Not Available at Location
                </h4>
                <p className="text-xs font-bold text-slate-900 leading-relaxed">
                  Create the TT under the <strong className="text-purple-950 underline decoration-purple-600">Default WG</strong>. Record the customer's available date and time in the TT Description.
                </p>
              </div>
            </div>

            {/* Note 2: Mandatory TT Description Standard */}
            <div className="p-4 rounded-xl border-2 border-black bg-[#e9d5ff] shadow-[4px_4px_0px_#000] flex items-start gap-3">
              <div className="p-2 rounded-lg bg-purple-700 text-white shrink-0 mt-0.5">
                <FileText className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <h4 className="font-black text-xs text-purple-950 uppercase tracking-wider">
                  Mandatory TT Description Standard
                </h4>
                <p className="text-xs font-bold text-slate-900 leading-relaxed">
                  TT Description is <strong className="text-red-700 font-black">mandatory</strong>. Ensure the TT description clearly matches the customer's reported complaint and includes all relevant troubleshooting details.
                </p>
              </div>
            </div>

          </div>

          {/* VIEW MODE 1: INTERACTIVE STEP-BY-STEP TROUBLESHOOTER */}
          {viewMode === 'interactive' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
              
              {/* ROOT SELECTOR: CHECK PON/LOS INDICATOR IN ONT */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#005696]">
                      Step 1: Optical LED Status
                    </span>
                    <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                      <Radio className="w-5 h-5 text-[#005696]" />
                      Check the PON/LOS indicator in ONT
                    </h3>
                  </div>
                  <span className="text-xs text-slate-500 font-medium">
                    Ask subscriber to observe PON & LOS front indicators
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Option A: RED / OFF / BLINKING */}
                  <button
                    onClick={() => {
                      setIndicatorStatus('RED_OFF_BLINKING');
                    }}
                    className={`p-4 rounded-xl border-2 transition-all text-left flex items-center justify-between ${
                      indicatorStatus === 'RED_OFF_BLINKING'
                        ? 'border-black bg-rose-50 shadow-[4px_4px_0px_#000]'
                        : 'border-slate-200 hover:border-slate-400 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-full bg-rose-600 text-white border-2 border-black flex items-center justify-center font-black text-xs shadow-xs animate-pulse">
                        RED
                      </div>
                      <div>
                        <h4 className="font-black text-sm text-slate-900">RED / OFF / BLINKING</h4>
                        <p className="text-xs text-slate-500 font-medium">LOS is blinking Red, or PON is unlit/flashing</p>
                      </div>
                    </div>
                    {indicatorStatus === 'RED_OFF_BLINKING' && (
                      <CheckCircle2 className="w-5 h-5 text-rose-600 shrink-0" />
                    )}
                  </button>

                  {/* Option B: STEADY */}
                  <button
                    onClick={() => {
                      setIndicatorStatus('STEADY');
                      setSteadyStep('restart');
                    }}
                    className={`p-4 rounded-xl border-2 transition-all text-left flex items-center justify-between ${
                      indicatorStatus === 'STEADY'
                        ? 'border-black bg-amber-50 shadow-[4px_4px_0px_#000]'
                        : 'border-slate-200 hover:border-slate-400 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-full bg-emerald-500 text-white border-2 border-black flex items-center justify-center font-black text-xs shadow-xs">
                        ON
                      </div>
                      <div>
                        <h4 className="font-black text-sm text-slate-900">STEADY (Solid Green)</h4>
                        <p className="text-xs text-slate-500 font-medium">PON indicator is solid continuous green</p>
                      </div>
                    </div>
                    {indicatorStatus === 'STEADY' && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    )}
                  </button>

                </div>
              </div>

              {/* BRANCH 1: RED / OFF / BLINKING (IMMEDIATE ESCALATION TO AREA-CPE-MTCE) */}
              {indicatorStatus === 'RED_OFF_BLINKING' && (
                <div className="p-6 rounded-xl border-2 border-black bg-red-600 text-white shadow-[4px_4px_0px_#000] space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-white animate-bounce" />
                      <h3 className="text-base font-black uppercase tracking-wide">
                        Official Decision: Create a TT to AREA-CPE-MTCE
                      </h3>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-black/40 text-white text-[10px] font-black uppercase tracking-wider">
                      Physical Optical Link Breakdown
                    </span>
                  </div>

                  <p className="text-xs text-white/95 leading-relaxed font-medium">
                    When LOS is Red or PON is Off/Blinking, optical synchronization has failed due to fiber attenuation, cable cut, or premise transceiver failure. Dispatch Trouble Ticket directly to <strong>AREA-CPE-MTCE</strong>.
                  </p>

                  {/* Ready-to-copy Ticket Template */}
                  <div className="bg-slate-900/90 text-white p-4 rounded-lg font-mono text-[11px] space-y-2 border border-black/40">
                    <div className="flex items-center justify-between text-slate-400 border-b border-slate-700 pb-1.5">
                      <span>Standard Trouble Ticket Draft (AREA-CPE-MTCE)</span>
                      <button
                        onClick={() => copyTtDetails(ttTemplateRed)}
                        className="px-2.5 py-1 bg-[#005696] hover:bg-[#0070ba] text-white text-[10px] rounded flex items-center gap-1 transition-all"
                      >
                        {copied ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3" />}
                        <span>{copied ? 'Copied!' : 'Copy TT'}</span>
                      </button>
                    </div>
                    <pre className="whitespace-pre-wrap leading-relaxed text-emerald-300">
                      {ttTemplateRed}
                    </pre>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      onClick={() => copyTtDetails(ttTemplateRed)}
                      className="px-5 py-2.5 rounded-lg bg-white text-red-600 font-black text-xs hover:bg-slate-100 flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      <span>{copied ? 'Copied to Clipboard!' : 'Copy TT & Dispatch to AREA-CPE-MTCE'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* BRANCH 2: STEADY (FIVE-STAGE ISOLATION PIPELINE) */}
              {indicatorStatus === 'STEADY' && (
                <div className="space-y-4 pt-2">
                  
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-950 text-xs font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>PON is Steady: Optical carrier is intact. Follow the 5 progressive isolation stages below:</span>
                  </div>

                  {/* STAGE 1: RESTART THE ONT */}
                  <div className="p-5 rounded-xl border-2 border-black bg-[#ffd24d] shadow-[3px_3px_0px_#000] space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs">
                          1
                        </span>
                        <h4 className="font-black text-sm text-black">
                          Restart the ONT ( Switch OFF & Switch On )
                        </h4>
                      </div>
                      <span className="text-[10px] font-bold bg-black text-white px-2 py-0.5 rounded">
                        Power Cycle
                      </span>
                    </div>

                    <p className="text-xs text-black/90 font-bold leading-relaxed">
                      Instruct subscriber to turn off the ONT from the power switch or unplug the power adapter for 15 seconds, then power back ON.
                    </p>

                    <div className="flex items-center gap-3 pt-1">
                      <button
                        onClick={() => alert('Fault Resolved! Pre-close call according to Call Quality Standards (END).')}
                        className="px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs flex items-center gap-1.5 shadow-xs"
                      >
                        <Check className="w-3.5 h-3.5" /> Working $\rightarrow$ END
                      </button>

                      <button
                        onClick={() => setSteadyStep('browser')}
                        className={`px-4 py-2 rounded-lg font-black text-xs flex items-center gap-1.5 border transition-all ${
                          steadyStep !== 'restart'
                            ? 'bg-red-600 text-white border-black shadow-xs'
                            : 'bg-white hover:bg-red-50 text-red-700 border-black'
                        }`}
                      >
                        <AlertCircle className="w-3.5 h-3.5" /> Not Working $\rightarrow$ Proceed to Browser Test
                      </button>
                    </div>
                  </div>

                  {/* STAGE 2: CHANGE BROWSER */}
                  {steadyStep !== 'restart' && (
                    <div className="p-5 rounded-xl border-2 border-black bg-[#ffd24d] shadow-[3px_3px_0px_#000] space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs">
                            2
                          </span>
                          <h4 className="font-black text-sm text-black">
                            Change the Browser and check
                          </h4>
                        </div>
                        <span className="text-[10px] font-bold bg-black text-white px-2 py-0.5 rounded">
                          Application Isolation
                        </span>
                      </div>

                      <p className="text-xs text-black/90 font-bold leading-relaxed">
                        Ask subscriber to test using a different web browser (e.g. switch from Chrome to Microsoft Edge, Firefox, or open an Incognito/Private window).
                      </p>

                      <div className="flex items-center gap-3 pt-1">
                        <button
                          onClick={() => alert('Fault Resolved! Clear browser cache/cookies on primary browser (END).')}
                          className="px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs flex items-center gap-1.5 shadow-xs"
                        >
                          <Check className="w-3.5 h-3.5" /> Working $\rightarrow$ END
                        </button>

                        <button
                          onClick={() => setSteadyStep('device')}
                          className={`px-4 py-2 rounded-lg font-black text-xs flex items-center gap-1.5 border transition-all ${
                            steadyStep === 'device' || steadyStep === 'proxy' || steadyStep === 'proxy_on' || steadyStep === 'proxy_off_failed'
                              ? 'bg-red-600 text-white border-black shadow-xs'
                              : 'bg-white hover:bg-red-50 text-red-700 border-black'
                          }`}
                        >
                          <AlertCircle className="w-3.5 h-3.5" /> Not Working $\rightarrow$ Proceed to Device Test
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STAGE 3: CHECK WITH ANOTHER DEVICE */}
                  {(steadyStep === 'device' || steadyStep === 'proxy' || steadyStep === 'proxy_on' || steadyStep === 'proxy_off_failed') && (
                    <div className="p-5 rounded-xl border-2 border-black bg-[#ffd24d] shadow-[3px_3px_0px_#000] space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs">
                            3
                          </span>
                          <h4 className="font-black text-sm text-black">
                            Check with another Device
                          </h4>
                        </div>
                        <span className="text-[10px] font-bold bg-black text-white px-2 py-0.5 rounded">
                          Hardware Isolation
                        </span>
                      </div>

                      <p className="text-xs text-black/90 font-bold leading-relaxed">
                        Ask subscriber to test internet access on another device connected to the same Wi-Fi / LAN (e.g., mobile phone, second laptop, tablet).
                      </p>

                      <div className="flex items-center gap-3 pt-1">
                        <button
                          onClick={() => alert('Fault Resolved! The issue is isolated to customer individual device network settings/NIC (END).')}
                          className="px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs flex items-center gap-1.5 shadow-xs"
                        >
                          <Check className="w-3.5 h-3.5" /> Working $\rightarrow$ END
                        </button>

                        <button
                          onClick={() => setSteadyStep('proxy')}
                          className={`px-4 py-2 rounded-lg font-black text-xs flex items-center gap-1.5 border transition-all ${
                            steadyStep === 'proxy' || steadyStep === 'proxy_on' || steadyStep === 'proxy_off_failed'
                              ? 'bg-red-600 text-white border-black shadow-xs'
                              : 'bg-white hover:bg-red-50 text-red-700 border-black'
                          }`}
                        >
                          <AlertCircle className="w-3.5 h-3.5" /> Not Working $\rightarrow$ Proceed to Proxy Check
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STAGE 4: CHECK WHETHER USING A PRIVATE PROXY */}
                  {(steadyStep === 'proxy' || steadyStep === 'proxy_on' || steadyStep === 'proxy_off_failed') && (
                    <div className="p-5 rounded-xl border-2 border-black bg-[#ffd24d] shadow-[3px_3px_0px_#000] space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs">
                            4
                          </span>
                          <h4 className="font-black text-sm text-black">
                            Check weather using a Private Proxy
                          </h4>
                        </div>
                        <span className="text-[10px] font-bold bg-black text-white px-2 py-0.5 rounded">
                          Network Gateway Configuration
                        </span>
                      </div>

                      <p className="text-xs text-black/90 font-bold leading-relaxed">
                        Verify if a VPN, corporate proxy, or third-party DNS changer is running on the client computer or router.
                      </p>

                      <div className="flex items-center flex-wrap gap-3 pt-1">
                        <button
                          onClick={() => setSteadyStep('proxy_on')}
                          className={`px-4 py-2 rounded-lg font-black text-xs flex items-center gap-1.5 border transition-all ${
                            steadyStep === 'proxy_on'
                              ? 'bg-slate-900 text-white border-black shadow-xs'
                              : 'bg-white hover:bg-slate-100 text-slate-900 border-black'
                          }`}
                        >
                          <Shield className="w-3.5 h-3.5" /> Proxy is ON $\rightarrow$ Ask to switch off Proxy
                        </button>

                        <button
                          onClick={() => setSteadyStep('proxy_off_failed')}
                          className={`px-4 py-2 rounded-lg font-black text-xs flex items-center gap-1.5 border transition-all ${
                            steadyStep === 'proxy_off_failed'
                              ? 'bg-red-600 text-white border-black shadow-xs'
                              : 'bg-white hover:bg-red-50 text-red-700 border-black'
                          }`}
                        >
                          <AlertCircle className="w-3.5 h-3.5" /> Proxy Switched Off but still Not Working
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STAGE 5A: PROXY WAS ON -> ASK TO SWITCH OFF PROXY */}
                  {steadyStep === 'proxy_on' && (
                    <div className="p-5 rounded-xl border-2 border-black bg-[#ffd24d] shadow-[3px_3px_0px_#000] space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs">
                            5
                          </span>
                          <h4 className="font-black text-sm text-black">
                            Ask to switch off Proxy
                          </h4>
                        </div>
                        <span className="text-[10px] font-bold bg-black text-white px-2 py-0.5 rounded">
                          Disable VPN / Proxy
                        </span>
                      </div>

                      <p className="text-xs text-black/90 font-bold leading-relaxed">
                        Guide customer to disconnect VPN or disable manual proxy in Windows Settings $\rightarrow$ Network & Internet $\rightarrow$ Proxy.
                      </p>

                      <div className="flex items-center gap-3 pt-1">
                        <button
                          onClick={() => alert('Fault Resolved! Proxy was blocking routing (END).')}
                          className="px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs flex items-center gap-1.5 shadow-xs"
                        >
                          <Check className="w-3.5 h-3.5" /> Working $\rightarrow$ END
                        </button>

                        <button
                          onClick={() => setSteadyStep('proxy_off_failed')}
                          className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-black text-xs flex items-center gap-1.5 shadow-xs"
                        >
                          <AlertCircle className="w-3.5 h-3.5" /> Proxy Switched Off but still Not Working
                        </button>
                      </div>
                    </div>
                  )}

                  {/* FINAL TERMINAL ESCALATION: PROXY SWITCHED OFF BUT STILL NOT WORKING */}
                  {steadyStep === 'proxy_off_failed' && (
                    <div className="p-6 rounded-xl border-2 border-black bg-red-600 text-white shadow-[4px_4px_0px_#000] space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Target className="w-5 h-5 text-white animate-bounce" />
                          <h3 className="text-base font-black uppercase tracking-wide">
                            Official Decision: Create a TT to AREA-CPE-MTCE
                          </h3>
                        </div>
                        <span className="px-2.5 py-1 rounded bg-black/40 text-white text-[10px] font-black uppercase tracking-wider">
                          All Client Tests Failed
                        </span>
                      </div>

                      <p className="text-xs text-white/95 leading-relaxed font-medium">
                        Restart attempted, multiple browsers tested, alternative devices tested, and proxy verified OFF, but browsing remains down despite steady optical link. Dispatch Trouble Ticket to <strong>AREA-CPE-MTCE</strong> for premise router inspection.
                      </p>

                      {/* Ready-to-copy Ticket Template */}
                      <div className="bg-slate-900/90 text-white p-4 rounded-lg font-mono text-[11px] space-y-2 border border-black/40">
                        <div className="flex items-center justify-between text-slate-400 border-b border-slate-700 pb-1.5">
                          <span>Standard Trouble Ticket Draft (AREA-CPE-MTCE)</span>
                          <button
                            onClick={() => copyTtDetails(ttTemplateSteady)}
                            className="px-2.5 py-1 bg-[#005696] hover:bg-[#0070ba] text-white text-[10px] rounded flex items-center gap-1 transition-all"
                          >
                            {copied ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3" />}
                            <span>{copied ? 'Copied!' : 'Copy TT'}</span>
                          </button>
                        </div>
                        <pre className="whitespace-pre-wrap leading-relaxed text-emerald-300">
                          {ttTemplateSteady}
                        </pre>
                      </div>

                      <div className="flex items-center justify-end gap-3 pt-2">
                        <button
                          onClick={() => copyTtDetails(ttTemplateSteady)}
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

          {/* VIEW MODE 2: VISUAL DECISION TREE DIAGRAM (OFFICIAL FLOWCHART) */}
          {viewMode === 'flowchart' && (
            <div className="bg-white rounded-xl border border-slate-300 shadow-md p-6 sm:p-10 space-y-6">
              
              <div className="text-center space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Sri Lanka Telecom - Contact Center Quality SOP
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  PON/LOS Indicator RED,OFF, Blinking or Steady
                </h2>
              </div>

              {/* Exact SVG Vector Flowchart matching PON-LOS Ind... Steady.pdf */}
              <div className="max-w-3xl mx-auto border border-slate-200 rounded-xl p-4 sm:p-6 bg-slate-50/50">
                <svg
                  viewBox="0 0 800 780"
                  className="w-full h-auto select-none font-sans"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <filter id="retroShadowPon" x="-15%" y="-15%" width="130%" height="130%">
                      <feDropShadow dx="4" dy="4" stdDeviation="0" floodColor="#000000" floodOpacity="1" />
                    </filter>
                    <marker id="arrowPon" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#000000" />
                    </marker>
                  </defs>

                  {/* Flowchart Title */}
                  <text
                    x="400"
                    y="32"
                    textAnchor="middle"
                    fontWeight="900"
                    fontSize="24"
                    fontFamily="Arial, Helvetica, sans-serif"
                    fill="#000000"
                    letterSpacing="0.5"
                  >
                    PON/LOS Indicator RED,OFF, Blinking or Steady
                  </text>

                  {/* ROOT NODE: Check the PON/LOS indicator in ONT */}
                  <g>
                    <rect
                      x="300"
                      y="54"
                      width="240"
                      height="46"
                      rx="23"
                      ry="23"
                      fill="#ffffff"
                      stroke="#000000"
                      strokeWidth="2.5"
                      filter="url(#retroShadowPon)"
                    />
                    <text
                      x="420"
                      y="74"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="12"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      Check the PON/LOS
                    </text>
                    <text
                      x="420"
                      y="89"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="12"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      indicator in ONT
                    </text>
                  </g>

                  {/* BRANCH 1: RED / OFF/ BLINKING (Left) */}
                  <path d="M 320 100 L 320 148" stroke="#000000" strokeWidth="2.5" markerEnd="url(#arrowPon)" />
                  <text
                    x="290"
                    y="125"
                    textAnchor="end"
                    fontWeight="bold"
                    fontSize="11"
                    fill="#000000"
                    fontFamily="Arial, Helvetica, sans-serif"
                  >
                    RED / OFF/ BLINKING
                  </text>

                  {/* Red Node: Create a TT to AREA-CPE-MTCE */}
                  <g
                    className="cursor-pointer"
                    onClick={() => copyTtDetails(ttTemplateRed)}
                  >
                    <rect
                      x="230"
                      y="148"
                      width="180"
                      height="44"
                      rx="22"
                      ry="22"
                      fill="#ff0000"
                      stroke="#000000"
                      strokeWidth="2.5"
                      filter="url(#retroShadowPon)"
                    />
                    <text
                      x="320"
                      y="166"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="11"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      Create a TT to
                    </text>
                    <text
                      x="320"
                      y="180"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="11"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      AREA-CPE-MTCE
                    </text>
                  </g>

                  {/* BRANCH 2: STEADY (Right) */}
                  <path d="M 520 100 L 520 148" stroke="#000000" strokeWidth="2.5" markerEnd="url(#arrowPon)" />
                  <text
                    x="530"
                    y="125"
                    textAnchor="start"
                    fontWeight="bold"
                    fontSize="11"
                    fill="#000000"
                    fontFamily="Arial, Helvetica, sans-serif"
                  >
                    STEADY
                  </text>

                  {/* NODE 1: Restart the ONT ( Switch OFF & Switch On ) */}
                  <g>
                    <rect
                      x="430"
                      y="148"
                      width="180"
                      height="44"
                      rx="22"
                      ry="22"
                      fill="#ffd24d"
                      stroke="#000000"
                      strokeWidth="2"
                      filter="url(#retroShadowPon)"
                    />
                    <text
                      x="520"
                      y="166"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="11"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      Restart the ONT
                    </text>
                    <text
                      x="520"
                      y="180"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="10"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      ( Switch OFF &amp; Switch On )
                    </text>
                  </g>

                  {/* Arrow Right to END */}
                  <path d="M 610 170 L 670 170" stroke="#000000" strokeWidth="2.5" markerEnd="url(#arrowPon)" />
                  <text
                    x="640"
                    y="160"
                    textAnchor="middle"
                    fontWeight="bold"
                    fontSize="11"
                    fill="#00b050"
                    fontFamily="Arial, Helvetica, sans-serif"
                  >
                    Working
                  </text>
                  <text
                    x="680"
                    y="174"
                    textAnchor="start"
                    fontWeight="900"
                    fontSize="13"
                    fill="#00b050"
                    fontFamily="Arial, Helvetica, sans-serif"
                  >
                    END
                  </text>

                  {/* Arrow Down to Node 2 */}
                  <path d="M 520 192 L 520 236" stroke="#000000" strokeWidth="2.5" markerEnd="url(#arrowPon)" />
                  <text
                    x="530"
                    y="218"
                    textAnchor="start"
                    fontWeight="bold"
                    fontSize="11"
                    fill="#ff0000"
                    fontFamily="Arial, Helvetica, sans-serif"
                  >
                    Not Working
                  </text>

                  {/* NODE 2: Change the Browser and check */}
                  <g>
                    <rect
                      x="430"
                      y="236"
                      width="180"
                      height="44"
                      rx="22"
                      ry="22"
                      fill="#ffd24d"
                      stroke="#000000"
                      strokeWidth="2"
                      filter="url(#retroShadowPon)"
                    />
                    <text
                      x="520"
                      y="254"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="11"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      Change the Browser
                    </text>
                    <text
                      x="520"
                      y="268"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="11"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      and check
                    </text>
                  </g>

                  {/* Arrow Right to END */}
                  <path d="M 610 258 L 670 258" stroke="#000000" strokeWidth="2.5" markerEnd="url(#arrowPon)" />
                  <text
                    x="640"
                    y="248"
                    textAnchor="middle"
                    fontWeight="bold"
                    fontSize="11"
                    fill="#00b050"
                    fontFamily="Arial, Helvetica, sans-serif"
                  >
                    Working
                  </text>
                  <text
                    x="680"
                    y="262"
                    textAnchor="start"
                    fontWeight="900"
                    fontSize="13"
                    fill="#00b050"
                    fontFamily="Arial, Helvetica, sans-serif"
                  >
                    END
                  </text>

                  {/* Arrow Down to Node 3 */}
                  <path d="M 520 280 L 520 324" stroke="#000000" strokeWidth="2.5" markerEnd="url(#arrowPon)" />
                  <text
                    x="530"
                    y="306"
                    textAnchor="start"
                    fontWeight="bold"
                    fontSize="11"
                    fill="#ff0000"
                    fontFamily="Arial, Helvetica, sans-serif"
                  >
                    Not Working
                  </text>

                  {/* NODE 3: Check with another Device */}
                  <g>
                    <rect
                      x="430"
                      y="324"
                      width="180"
                      height="44"
                      rx="22"
                      ry="22"
                      fill="#ffd24d"
                      stroke="#000000"
                      strokeWidth="2"
                      filter="url(#retroShadowPon)"
                    />
                    <text
                      x="520"
                      y="351"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="11"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      Check with another Device
                    </text>
                  </g>

                  {/* Arrow Right to END */}
                  <path d="M 610 346 L 670 346" stroke="#000000" strokeWidth="2.5" markerEnd="url(#arrowPon)" />
                  <text
                    x="640"
                    y="336"
                    textAnchor="middle"
                    fontWeight="bold"
                    fontSize="11"
                    fill="#00b050"
                    fontFamily="Arial, Helvetica, sans-serif"
                  >
                    Working
                  </text>
                  <text
                    x="680"
                    y="350"
                    textAnchor="start"
                    fontWeight="900"
                    fontSize="13"
                    fill="#00b050"
                    fontFamily="Arial, Helvetica, sans-serif"
                  >
                    END
                  </text>

                  {/* Arrow Down to Node 4 */}
                  <path d="M 520 368 L 520 412" stroke="#000000" strokeWidth="2.5" markerEnd="url(#arrowPon)" />
                  <text
                    x="530"
                    y="394"
                    textAnchor="start"
                    fontWeight="bold"
                    fontSize="11"
                    fill="#ff0000"
                    fontFamily="Arial, Helvetica, sans-serif"
                  >
                    Not Working
                  </text>

                  {/* NODE 4: Check weather using a Private Proxy */}
                  <g>
                    <rect
                      x="430"
                      y="412"
                      width="180"
                      height="44"
                      rx="22"
                      ry="22"
                      fill="#ffd24d"
                      stroke="#000000"
                      strokeWidth="2"
                      filter="url(#retroShadowPon)"
                    />
                    <text
                      x="520"
                      y="430"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="11"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      Check weather using a
                    </text>
                    <text
                      x="520"
                      y="444"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="11"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      Private Proxy
                    </text>
                  </g>

                  {/* Path from Node 4 back up to Red TT Node! */}
                  <path d="M 430 434 L 320 434 L 320 196" stroke="#000000" strokeWidth="2.5" markerEnd="url(#arrowPon)" fill="none" />
                  <text
                    x="330"
                    y="415"
                    textAnchor="start"
                    fontWeight="bold"
                    fontSize="10"
                    fill="#ff0000"
                    fontFamily="Arial, Helvetica, sans-serif"
                  >
                    Proxy Switched Off
                  </text>
                  <text
                    x="330"
                    y="427"
                    textAnchor="start"
                    fontWeight="bold"
                    fontSize="10"
                    fill="#ff0000"
                    fontFamily="Arial, Helvetica, sans-serif"
                  >
                    but still Not Working
                  </text>

                  {/* Arrow Down to Node 5 */}
                  <path d="M 520 456 L 520 500" stroke="#000000" strokeWidth="2.5" markerEnd="url(#arrowPon)" />
                  <text
                    x="530"
                    y="482"
                    textAnchor="start"
                    fontWeight="bold"
                    fontSize="11"
                    fill="#ff0000"
                    fontFamily="Arial, Helvetica, sans-serif"
                  >
                    Proxy On
                  </text>

                  {/* NODE 5: Ask to switch off Proxy */}
                  <g>
                    <rect
                      x="430"
                      y="500"
                      width="180"
                      height="44"
                      rx="22"
                      ry="22"
                      fill="#ffd24d"
                      stroke="#000000"
                      strokeWidth="2"
                      filter="url(#retroShadowPon)"
                    />
                    <text
                      x="520"
                      y="527"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="11"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      Ask to switch off Proxy
                    </text>
                  </g>

                  {/* Arrow Right to END */}
                  <path d="M 610 522 L 670 522" stroke="#000000" strokeWidth="2.5" markerEnd="url(#arrowPon)" />
                  <text
                    x="640"
                    y="512"
                    textAnchor="middle"
                    fontWeight="bold"
                    fontSize="11"
                    fill="#00b050"
                    fontFamily="Arial, Helvetica, sans-serif"
                  >
                    Working
                  </text>
                  <text
                    x="680"
                    y="526"
                    textAnchor="start"
                    fontWeight="900"
                    fontSize="13"
                    fill="#00b050"
                    fontFamily="Arial, Helvetica, sans-serif"
                  >
                    END
                  </text>

                  {/* ================= BOTTOM LAVENDER NOTES ================= */}
                  {/* Note 1: If Customer Not Available at Location */}
                  <g>
                    <rect
                      x="220"
                      y="595"
                      width="420"
                      height="54"
                      rx="24"
                      ry="24"
                      fill="#d8b4fe"
                      stroke="#000000"
                      strokeWidth="2"
                      filter="url(#retroShadowPon)"
                    />
                    <text
                      x="430"
                      y="612"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="10"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      If the Customer Not Available at the Location
                    </text>
                    <text
                      x="430"
                      y="625"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="10"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      Create the TT under the Default WG.
                    </text>
                    <text
                      x="430"
                      y="638"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="10"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      Record the customer's available date and time in the TT Description.
                    </text>
                  </g>

                  {/* Note 2: TT Description is mandatory */}
                  <g>
                    <rect
                      x="230"
                      y="665"
                      width="400"
                      height="46"
                      rx="23"
                      ry="23"
                      fill="#d8b4fe"
                      stroke="#000000"
                      strokeWidth="2"
                      filter="url(#retroShadowPon)"
                    />
                    <text
                      x="430"
                      y="683"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="10"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      TT Description is mandatory. Ensure the TT description clearly matches the
                    </text>
                    <text
                      x="430"
                      y="697"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="10"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      customer's reported complaint and includes all relevant troubleshooting details.
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
              href="/knowledge-hub/faq/ftth/ont-not-working"
              className="px-4 py-2 rounded-lg bg-[#005696] hover:bg-[#00477d] text-white font-bold text-xs flex items-center gap-2 transition-all shadow-xs"
            >
              <span>ONT Not Working SOP</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      </div>

    </div>
  );
}
