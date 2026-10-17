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
  Wifi,
  Laptop,
  Settings,
  Signal
} from 'lucide-react';

export default function WifiNotWorkingPage() {
  const [indicatorStatus, setIndicatorStatus] = useState<'INITIAL' | 'OFF' | 'ON'>('INITIAL');
  const [wlanButtonStatus, setWlanButtonStatus] = useState<'INITIAL' | 'STILL_OFF' | 'TURNED_ON'>('INITIAL');
  const [deviceWifiStatus, setDeviceWifiStatus] = useState<'INITIAL' | 'DEVICE_OFF' | 'DEVICE_ON'>('INITIAL');
  const [internetWorkingStatus, setInternetWorkingStatus] = useState<'INITIAL' | 'WORKING' | 'NOT_WORKING'>('INITIAL');
  const [configStatus, setConfigStatus] = useState<'INITIAL' | 'INCORRECT' | 'CORRECT'>('INITIAL');
  const [viewMode, setViewMode] = useState<'interactive' | 'flowchart'>('interactive');
  const [copied, setCopied] = useState<string | null>(null);

  const copyTtDetails = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2500);
  };

  const resetInteractive = () => {
    setIndicatorStatus('INITIAL');
    setWlanButtonStatus('INITIAL');
    setDeviceWifiStatus('INITIAL');
    setInternetWorkingStatus('INITIAL');
    setConfigStatus('INITIAL');
  };

  // TT Template 1: AREA-CPE-MTCE (WLAN LED Dead / Hardware failure)
  const ttTemplateAreaCpe = `Target Work Group: AREA-CPE-MTCE
Service Category: BB Service (Broadband)
Fault Complaint: Wi-Fi Not Working (WLAN Radio Dead / ONT Hardware Failure)
Diagnostic Log:
• Optical Status: PON STEADY (Optical carrier healthy)
• ONT WLAN Indicator: OFF
• Action Taken: Customer guided to press and switch on Wi-Fi/WLAN button in ONT. WLAN light remains completely OFF.
• Physical inspection: Router power cycled; Wi-Fi push button non-responsive.
Action Required: Technician dispatch for ONT wireless module repair or CPE router swap.`;

  // TT Template 2: AREA-CPE-MTCE (Low Wi-Fi Coverage)
  const ttTemplateLowCoverage = `Target Work Group: AREA-CPE-MTCE
Service Category: BB Service (Broadband)
Fault Complaint: Poor Wi-Fi Coverage / Signal Drop
Diagnostic Log:
• Optical Status: PON STEADY
• WLAN LED Status: ON (Operational)
• Customer Reported Distance: [Enter distance, e.g., 8 meters through 2 brick walls]
• Device Tested: Mobile Phone & Laptop tested near router vs at room
• Troubleshooting: Wi-Fi channel checked in ACS (Channel 6/11). Signal drops significantly beyond short range.
Action Required: Field technician visit for RF signal assessment, CPE antenna alignment, or recommendation of Wi-Fi Mesh Extender.`;

  // TT Template 3: CEN-CSC-TECH (Wi-Fi Config Correct, Internet Dead)
  const ttTemplateCenCsc = `Target Work Group: CEN-CSC-TECH
Service Category: BB Service (Broadband)
Fault Complaint: Wi-Fi Connected but No Internet Access (PON Steady)
Diagnostic Log:
• Optical Status: PON STEADY
• ONT WLAN LED: ON (Solid Green)
• Client Device: Wireless turned ON and connected to SSID
• Wi-Fi Configuration: Verified in Router Admin (SSID Enabled, WPA2-PSK, DHCP Active)
• Result: Device associates with Wi-Fi but WAN routing/IP leasing failed. Default gateway unreachable.
Action Required: Central technical assistance for IP session reset, DHCP pool verification, or gateway provisioning fix.`;

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
                Official SOP #04
              </span>
              <span className="px-2 py-0.5 rounded bg-white/20 text-cyan-100 font-bold text-[10px]">
                Target: AREA-CPE-MTCE / CEN-CSC-TECH (under BB Service)
              </span>
              <span className="px-2 py-0.5 rounded bg-white/10 text-white/80 font-mono text-[10px]">
                Reviewed: 12/02/2026
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-2">
              <Wifi className="w-7 h-7 text-lime-300" />
              <span>Wi-Fi not working (PON Steady)</span>
            </h1>
            <p className="text-xs sm:text-sm text-cyan-100/90 max-w-3xl leading-relaxed">
              Standard Operating Procedure for diagnosing FTTH Wireless Local Area Network (WLAN) outages when the optical carrier signal is healthy (PON Steady).
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
                  <span className="font-bold text-slate-700">Triage Status:</span>
                  <span className="font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    {indicatorStatus === 'INITIAL'
                      ? 'Awaiting Wi-Fi/WLAN Indicator Verification'
                      : indicatorStatus === 'OFF'
                      ? 'WLAN Indicator is OFF'
                      : 'WLAN Indicator is ON'}
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

              {/* STEP 1: Check the Wi-Fi or WLAN indicator is ON */}
              <div className="bg-white rounded-xl border border-slate-300 shadow-md p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-[#005696] text-white flex items-center justify-center font-black text-xs">
                      1
                    </span>
                    <h3 className="font-black text-slate-900 text-base">
                      Check the Wi-Fi or WLAN indicator in ONT
                    </h3>
                  </div>
                  <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                    Root Decision Node
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Direct the customer to look at the front LED panel of the Huawei, ZTE, or FiberHome ONT. Identify the LED labeled <strong>WLAN</strong> or <strong>2.4G / 5G Wi-Fi</strong>.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <button
                    onClick={() => {
                      setIndicatorStatus('OFF');
                      setWlanButtonStatus('INITIAL');
                    }}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      indicatorStatus === 'OFF'
                        ? 'border-red-500 bg-red-50/70 shadow-sm'
                        : 'border-slate-300 hover:border-red-400 bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-black text-red-600 text-sm flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4" /> WLAN Indicator is OFF
                      </span>
                      {indicatorStatus === 'OFF' && <Check className="w-4 h-4 text-red-600" />}
                    </div>
                    <p className="text-[11px] text-slate-600">
                      Wi-Fi / WLAN LED light is completely unlit or dark.
                    </p>
                  </button>

                  <button
                    onClick={() => {
                      setIndicatorStatus('ON');
                      setDeviceWifiStatus('INITIAL');
                      setInternetWorkingStatus('INITIAL');
                      setConfigStatus('INITIAL');
                    }}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      indicatorStatus === 'ON'
                        ? 'border-emerald-500 bg-emerald-50/70 shadow-sm'
                        : 'border-slate-300 hover:border-emerald-400 bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-black text-emerald-700 text-sm flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" /> WLAN Indicator is ON
                      </span>
                      {indicatorStatus === 'ON' && <Check className="w-4 h-4 text-emerald-600" />}
                    </div>
                    <p className="text-[11px] text-slate-600">
                      WLAN LED is solid green or blinking green (active data broadcast).
                    </p>
                  </button>
                </div>
              </div>

              {/* ======================================================== */}
              {/* BRANCH A: WLAN INDICATOR IS OFF                          */}
              {/* ======================================================== */}
              {indicatorStatus === 'OFF' && (
                <div className="bg-white rounded-xl border border-slate-300 shadow-md p-6 space-y-5 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-full bg-red-600 text-white flex items-center justify-center font-black text-xs">
                        2A
                      </span>
                      <h3 className="font-black text-slate-900 text-base">
                        Press and switch on Wi-Fi or WLAN button in ONT
                      </h3>
                    </div>
                    <span className="text-xs font-bold text-red-600 bg-red-100 px-2.5 py-1 rounded-full">
                      Physical Push Button Test
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    Guide the customer to locate the small physical push button on the side or rear of the ONT labeled <strong>WLAN</strong>, <strong>Wi-Fi</strong>, or <strong>WPS/WLAN</strong>. Instruct them to press and hold it firmly for <strong>3 to 5 seconds</strong>.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                      onClick={() => setWlanButtonStatus('STILL_OFF')}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        wlanButtonStatus === 'STILL_OFF'
                          ? 'border-red-600 bg-red-50 shadow-sm'
                          : 'border-slate-300 hover:border-red-400 bg-slate-50/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-black text-red-700 text-xs sm:text-sm">
                          Off (Remains OFF / Still Dark)
                        </span>
                        {wlanButtonStatus === 'STILL_OFF' && <Check className="w-4 h-4 text-red-600" />}
                      </div>
                      <p className="text-[11px] text-slate-600">
                        Button pressed/held, but WLAN indicator will not turn on.
                      </p>
                    </button>

                    <button
                      onClick={() => {
                        setWlanButtonStatus('TURNED_ON');
                        setInternetWorkingStatus('INITIAL');
                      }}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        wlanButtonStatus === 'TURNED_ON'
                          ? 'border-emerald-600 bg-emerald-50 shadow-sm'
                          : 'border-slate-300 hover:border-emerald-400 bg-slate-50/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-black text-emerald-800 text-xs sm:text-sm">
                          On (Turned ON / Solid Green)
                        </span>
                        {wlanButtonStatus === 'TURNED_ON' && <Check className="w-4 h-4 text-emerald-600" />}
                      </div>
                      <p className="text-[11px] text-slate-600">
                        WLAN indicator successfully illuminated green.
                      </p>
                    </button>
                  </div>

                  {/* SUB-BRANCH A1: BUTTON PRESSED BUT STILL OFF -> TT TO AREA-CPE-MTCE */}
                  {wlanButtonStatus === 'STILL_OFF' && (
                    <div className="p-6 rounded-xl border-2 border-black bg-[#84cc16] text-black shadow-[4px_4px_0px_#000] space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Target className="w-6 h-6 text-black animate-bounce" />
                          <h4 className="text-base font-black uppercase tracking-wide">
                            Official Decision: Create a TT to AREA-CPE-MTCE Work Group under BB Service
                          </h4>
                        </div>
                        <span className="px-2.5 py-1 rounded bg-black text-white text-[10px] font-black uppercase tracking-wider">
                          Hardware Fault
                        </span>
                      </div>

                      <p className="text-xs text-black/90 leading-relaxed font-semibold">
                        The physical WLAN push button does not trigger the internal radio transmitter. The ONT radio module is defective or hardware damaged. Dispatch Trouble Ticket under BB Service to <strong>AREA-CPE-MTCE</strong> for device inspection or router replacement.
                      </p>

                      {/* Ready-to-copy Ticket Template */}
                      <div className="bg-slate-900 text-white p-4 rounded-lg font-mono text-[11px] space-y-2 border border-black/40">
                        <div className="flex items-center justify-between text-slate-400 border-b border-slate-700 pb-1.5">
                          <span>Standard Trouble Ticket Draft (AREA-CPE-MTCE)</span>
                          <button
                            onClick={() => copyTtDetails(ttTemplateAreaCpe, 'tt-area-cpe')}
                            className="px-2.5 py-1 bg-[#005696] hover:bg-[#0070ba] text-white text-[10px] rounded flex items-center gap-1 transition-all"
                          >
                            {copied === 'tt-area-cpe' ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3" />}
                            <span>{copied === 'tt-area-cpe' ? 'Copied!' : 'Copy TT'}</span>
                          </button>
                        </div>
                        <pre className="whitespace-pre-wrap leading-relaxed text-lime-300">
                          {ttTemplateAreaCpe}
                        </pre>
                      </div>

                      <div className="flex items-center justify-end gap-3 pt-2">
                        <button
                          onClick={() => copyTtDetails(ttTemplateAreaCpe, 'tt-area-cpe')}
                          className="px-5 py-2.5 rounded-lg bg-black text-white font-black text-xs hover:bg-slate-900 flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
                        >
                          {copied === 'tt-area-cpe' ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                          <span>{copied === 'tt-area-cpe' ? 'Copied to Clipboard!' : 'Copy TT & Dispatch to AREA-CPE-MTCE'}</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* SUB-BRANCH A2: BUTTON PRESSED AND TURNED ON -> PROCEED TO INTERNET CHECK */}
                  {wlanButtonStatus === 'TURNED_ON' && (
                    <div className="p-4 rounded-xl border border-emerald-300 bg-emerald-50/70 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                        <div>
                          <p className="text-xs font-black text-emerald-900">
                            WLAN Radio Successfully Activated!
                          </p>
                          <p className="text-[11px] text-emerald-700">
                            Now verify whether customer device connects and browsing works.
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setIndicatorStatus('ON');
                          setDeviceWifiStatus('DEVICE_ON');
                        }}
                        className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
                      >
                        <span>Check Internet Connection</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                </div>
              )}

              {/* ======================================================== */}
              {/* BRANCH B: WLAN INDICATOR IS ON                           */}
              {/* ======================================================== */}
              {indicatorStatus === 'ON' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  
                  {/* STEP 2: Check Wireless is ON in customer's device */}
                  <div className="bg-white rounded-xl border border-slate-300 shadow-md p-6 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full bg-[#005696] text-white flex items-center justify-center font-black text-xs">
                          2B
                        </span>
                        <h3 className="font-black text-slate-900 text-base">
                          Check Wireless is on in customer's device (Eg: Laptop or Smart Phone)
                        </h3>
                      </div>
                      <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                        Client Device Verification
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                      Confirm if the customer’s smartphone, tablet, or laptop Wi-Fi toggle is enabled in Settings, and if Airplane mode is turned OFF.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <button
                        onClick={() => setDeviceWifiStatus('DEVICE_OFF')}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${
                          deviceWifiStatus === 'DEVICE_OFF'
                            ? 'border-amber-500 bg-amber-50/70 shadow-sm'
                            : 'border-slate-300 hover:border-amber-400 bg-slate-50/50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-black text-amber-800 text-xs sm:text-sm">
                            No (Device Wi-Fi is OFF / Airplane Mode)
                          </span>
                          {deviceWifiStatus === 'DEVICE_OFF' && <Check className="w-4 h-4 text-amber-600" />}
                        </div>
                        <p className="text-[11px] text-slate-600">
                          Customer has not switched on Wi-Fi on their phone/PC.
                        </p>
                      </button>

                      <button
                        onClick={() => {
                          setDeviceWifiStatus('DEVICE_ON');
                          setInternetWorkingStatus('INITIAL');
                        }}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${
                          deviceWifiStatus === 'DEVICE_ON'
                            ? 'border-emerald-500 bg-emerald-50/70 shadow-sm'
                            : 'border-slate-300 hover:border-emerald-400 bg-slate-50/50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-black text-emerald-800 text-xs sm:text-sm">
                            Yes (Device Wi-Fi is ON)
                          </span>
                          {deviceWifiStatus === 'DEVICE_ON' && <Check className="w-4 h-4 text-emerald-600" />}
                        </div>
                        <p className="text-[11px] text-slate-600">
                          Device Wi-Fi is active and scanning for nearby networks.
                        </p>
                      </button>
                    </div>

                    {/* IF NO -> Instruct customer to switch on Wi-Fi in the Device */}
                    {deviceWifiStatus === 'DEVICE_OFF' && (
                      <div className="p-5 rounded-xl border-2 border-black bg-[#ffd24d] shadow-[3px_3px_0px_#000] space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Smartphone className="w-5 h-5 text-black" />
                            <h4 className="font-black text-sm text-black uppercase">
                              Instruct customer to switch on Wi-Fi in the Device
                            </h4>
                          </div>
                          <span className="text-[10px] font-bold bg-black text-white px-2 py-0.5 rounded">
                            Client Guidance (END)
                          </span>
                        </div>
                        <p className="text-xs text-black/90 font-bold leading-relaxed">
                          Guide the customer to open Android Quick Settings, iOS Control Center, or Windows Taskbar network flyout and click the Wi-Fi icon to turn it ON.
                        </p>
                        <button
                          onClick={() => alert('Customer enabled Wi-Fi and connected successfully (END).')}
                          className="px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs flex items-center gap-1.5 shadow-xs"
                        >
                          <Check className="w-3.5 h-3.5" /> Customer Connected $\rightarrow$ END
                        </button>
                      </div>
                    )}
                  </div>

                  {/* STEP 3: Check whether the Internet is working */}
                  {deviceWifiStatus === 'DEVICE_ON' && (
                    <div className="bg-white rounded-xl border border-slate-300 shadow-md p-6 space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="w-7 h-7 rounded-full bg-[#005696] text-white flex items-center justify-center font-black text-xs">
                            3
                          </span>
                          <h3 className="font-black text-slate-900 text-base">
                            Check whether the Internet is working
                          </h3>
                        </div>
                        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                          Throughput / Browsing Check
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed font-medium">
                        Ask the customer to open a web browser and load a test webpage (e.g., <code>https://www.google.com</code> or <code>https://slt.lk</code>).
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button
                          onClick={() => setInternetWorkingStatus('WORKING')}
                          className={`p-4 rounded-xl border-2 text-left transition-all ${
                            internetWorkingStatus === 'WORKING'
                              ? 'border-emerald-600 bg-emerald-50 shadow-sm'
                              : 'border-slate-300 hover:border-emerald-400 bg-slate-50/50'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-black text-emerald-800 text-xs sm:text-sm">
                              Yes (Internet is Working)
                            </span>
                            {internetWorkingStatus === 'WORKING' && <Check className="w-4 h-4 text-emerald-600" />}
                          </div>
                          <p className="text-[11px] text-slate-600">
                            Pages load normally and Wi-Fi throughput is functional.
                          </p>
                        </button>

                        <button
                          onClick={() => {
                            setInternetWorkingStatus('NOT_WORKING');
                            setConfigStatus('INITIAL');
                          }}
                          className={`p-4 rounded-xl border-2 text-left transition-all ${
                            internetWorkingStatus === 'NOT_WORKING'
                              ? 'border-red-600 bg-red-50 shadow-sm'
                              : 'border-slate-300 hover:border-red-400 bg-slate-50/50'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-black text-red-700 text-xs sm:text-sm">
                              No (Internet is NOT Working)
                            </span>
                            {internetWorkingStatus === 'NOT_WORKING' && <Check className="w-4 h-4 text-red-600" />}
                          </div>
                          <p className="text-[11px] text-slate-600">
                            Browser says "No Internet", "Connected, no internet", or "DNS probe failed".
                          </p>
                        </button>
                      </div>

                      {/* IF YES -> End */}
                      {internetWorkingStatus === 'WORKING' && (
                        <div className="p-4 rounded-xl border-2 border-black bg-[#84cc16] text-black shadow-[3px_3px_0px_#000] flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-black" />
                            <div>
                              <p className="text-xs font-black uppercase">
                                Fault Resolved: Internet is Functional (END)
                              </p>
                              <p className="text-[11px] text-black/80 font-medium">
                                No Trouble Ticket required. Advise customer to enjoy SLT Fiber broadband.
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

                  {/* STEP 4: Check Wi-Fi Configuration */}
                  {internetWorkingStatus === 'NOT_WORKING' && (
                    <div className="bg-white rounded-xl border border-slate-300 shadow-md p-6 space-y-5">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="w-7 h-7 rounded-full bg-[#005696] text-white flex items-center justify-center font-black text-xs">
                            4
                          </span>
                          <h3 className="font-black text-slate-900 text-base">
                            Check Wi-Fi Configuration
                          </h3>
                        </div>
                        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                          Router Gateway &amp; SSID Audit
                        </span>
                      </div>

                      {/* Reference Callout matching screenshot */}
                      <div className="p-4 rounded-xl border-2 border-purple-400 bg-purple-50 text-purple-950 text-xs space-y-1.5 shadow-xs">
                        <div className="flex items-center gap-1.5 font-black text-purple-900">
                          <Settings className="w-4 h-4 text-purple-700" />
                          <span>Note: Wi-Fi Configuration Reference Guide</span>
                        </div>
                        <p className="text-[11px] text-purple-900/90 leading-relaxed font-medium">
                          Refer Wi-Fi Configuration guides for ONTs and check <strong>SSID, Enable SSID, Encryption (WPA2/WPA3), Wireless Password</strong> through <strong>Detail Setup / Advance Setup or Network</strong> in the router web interface (<code>http://192.168.1.1</code>).
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button
                          onClick={() => setConfigStatus('INCORRECT')}
                          className={`p-4 rounded-xl border-2 text-left transition-all ${
                            configStatus === 'INCORRECT'
                              ? 'border-amber-500 bg-amber-50 shadow-sm'
                              : 'border-slate-300 hover:border-amber-400 bg-slate-50/50'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-black text-amber-800 text-xs sm:text-sm">
                              Incorrect (Configuration Discrepancy Found)
                            </span>
                            {configStatus === 'INCORRECT' && <Check className="w-4 h-4 text-amber-600" />}
                          </div>
                          <p className="text-[11px] text-slate-600">
                            SSID broadcast disabled, wrong password entered, or encryption type mismatch.
                          </p>
                        </button>

                        <button
                          onClick={() => setConfigStatus('CORRECT')}
                          className={`p-4 rounded-xl border-2 text-left transition-all ${
                            configStatus === 'CORRECT'
                              ? 'border-red-600 bg-red-50 shadow-sm'
                              : 'border-slate-300 hover:border-red-400 bg-slate-50/50'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-black text-red-700 text-xs sm:text-sm">
                              Correct (All Wi-Fi Settings Verified OK)
                            </span>
                            {configStatus === 'CORRECT' && <Check className="w-4 h-4 text-red-600" />}
                          </div>
                          <p className="text-[11px] text-slate-600">
                            SSID enabled, password correct, DHCP enabled, yet connection still fails.
                          </p>
                        </button>
                      </div>

                      {/* IF INCORRECT -> Enter correct Wi-Fi settings */}
                      {configStatus === 'INCORRECT' && (
                        <div className="p-5 rounded-xl border-2 border-black bg-[#ffd24d] shadow-[3px_3px_0px_#000] space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Wrench className="w-5 h-5 text-black" />
                              <h4 className="font-black text-sm text-black uppercase">
                                Enter correct Wi-Fi settings
                              </h4>
                            </div>
                            <span className="text-[10px] font-bold bg-black text-white px-2 py-0.5 rounded">
                              Reconfiguration (END)
                            </span>
                          </div>
                          <p className="text-xs text-black/90 font-bold leading-relaxed">
                            Guide customer to enter correct WPA2 Pre-Shared Key or check the "Enable SSID" checkbox in ONT gateway. Test connection after applying settings.
                          </p>
                          <button
                            onClick={() => alert('Correct settings applied. Wi-Fi connected successfully (END).')}
                            className="px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs flex items-center gap-1.5 shadow-xs"
                          >
                            <Check className="w-3.5 h-3.5" /> Reconfiguration Applied $\rightarrow$ END
                          </button>
                        </div>
                      )}

                      {/* IF CORRECT -> Create a TT to CEN-CSC-TECH Work Group under BB Service */}
                      {configStatus === 'CORRECT' && (
                        <div className="p-6 rounded-xl border-2 border-black bg-[#84cc16] text-black shadow-[4px_4px_0px_#000] space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Target className="w-6 h-6 text-black animate-bounce" />
                              <h4 className="text-base font-black uppercase tracking-wide">
                                Official Decision: Create a TT to CEN-CSC-TECH Work Group under BB Service
                              </h4>
                            </div>
                            <span className="px-2.5 py-1 rounded bg-black text-white text-[10px] font-black uppercase tracking-wider">
                              Technical Escalation
                            </span>
                          </div>

                          <p className="text-xs text-black/90 leading-relaxed font-semibold">
                            Wi-Fi radio is active, client device wireless is ON, Wi-Fi configuration (SSID &amp; password) is verified correct, but the customer cannot browse despite steady optical carrier. Dispatch Trouble Ticket under BB Service to <strong>CEN-CSC-TECH</strong> for central gateway session clearance and DHCP/DNS pool diagnostics.
                          </p>

                          {/* Ready-to-copy Ticket Template */}
                          <div className="bg-slate-900 text-white p-4 rounded-lg font-mono text-[11px] space-y-2 border border-black/40">
                            <div className="flex items-center justify-between text-slate-400 border-b border-slate-700 pb-1.5">
                              <span>Standard Trouble Ticket Draft (CEN-CSC-TECH)</span>
                              <button
                                onClick={() => copyTtDetails(ttTemplateCenCsc, 'tt-cen-csc')}
                                className="px-2.5 py-1 bg-[#005696] hover:bg-[#0070ba] text-white text-[10px] rounded flex items-center gap-1 transition-all"
                              >
                                {copied === 'tt-cen-csc' ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3" />}
                                <span>{copied === 'tt-cen-csc' ? 'Copied!' : 'Copy TT'}</span>
                              </button>
                            </div>
                            <pre className="whitespace-pre-wrap leading-relaxed text-lime-300">
                              {ttTemplateCenCsc}
                            </pre>
                          </div>

                          <div className="flex items-center justify-end gap-3 pt-2">
                            <button
                              onClick={() => copyTtDetails(ttTemplateCenCsc, 'tt-cen-csc')}
                              className="px-5 py-2.5 rounded-lg bg-black text-white font-black text-xs hover:bg-slate-900 flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
                            >
                              {copied === 'tt-cen-csc' ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                              <span>{copied === 'tt-cen-csc' ? 'Copied to Clipboard!' : 'Copy TT & Dispatch to CEN-CSC-TECH'}</span>
                            </button>
                          </div>
                        </div>
                      )}

                    </div>
                  )}

                </div>
              )}

              {/* 5. LOW WI-FI COVERAGE OPERATIONAL NOTE BOX (Bottom-Left Banner) */}
              <div className="p-6 rounded-xl border-2 border-purple-400 bg-purple-50 text-purple-950 space-y-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Signal className="w-5 h-5 text-purple-700" />
                    <h4 className="font-black text-sm text-purple-900 uppercase tracking-wide">
                      Mandatory Policy: If Wi-Fi coverage is low
                    </h4>
                  </div>
                  <span className="px-2.5 py-0.5 rounded bg-purple-200 text-purple-800 text-[10px] font-bold">
                    Coverage Standard
                  </span>
                </div>

                <div className="space-y-1.5 text-xs font-semibold text-purple-900 leading-relaxed">
                  <p>1. Ask the distance between the ONT and the device.</p>
                  <p>2. Add the measured distance in the description of the TT.</p>
                  <p className="font-black text-purple-950">
                    3. Forward such issues to: <span className="underline decoration-purple-600">AREA-CPE-MTCE</span> Work Group under BB Service.
                  </p>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => copyTtDetails(ttTemplateLowCoverage, 'tt-low-cov')}
                    className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-xs transition-colors"
                  >
                    {copied === 'tt-low-cov' ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied === 'tt-low-cov' ? 'Copied Low Coverage TT' : 'Copy Low Coverage TT Template'}</span>
                  </button>
                </div>
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
                  Wi-Fi not working (PON Steady)
                </h2>
              </div>

              {/* Exact SVG Vector Flowchart matching 4. WiFi not working.pdf */}
              <div className="max-w-4xl mx-auto border border-slate-200 rounded-xl p-4 sm:p-6 bg-slate-50/50 overflow-x-auto">
                <svg
                  viewBox="0 0 920 620"
                  className="w-full min-w-[760px] h-auto select-none font-sans"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <filter id="retroShadowWifi" x="-15%" y="-15%" width="130%" height="130%">
                      <feDropShadow dx="3" dy="3" stdDeviation="0" floodColor="#000000" floodOpacity="1" />
                    </filter>
                    <marker id="arrowWifi" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#ff0000" />
                    </marker>
                    <marker id="arrowWifiBlack" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#000000" />
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
                    Wi-Fi not working (PON Steady)
                  </text>

                  {/* ROOT NODE: Check the Wi-Fi or WLAN indicator is ON */}
                  <g>
                    <rect
                      x="360"
                      y="64"
                      width="160"
                      height="46"
                      rx="23"
                      ry="23"
                      fill="#ffffb0"
                      stroke="#000000"
                      strokeWidth="2"
                    />
                    <text
                      x="440"
                      y="83"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="10.5"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      Check the <tspan fontWeight="900">Wi-Fi</tspan> or
                    </text>
                    <text
                      x="440"
                      y="98"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="10.5"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      <tspan fontWeight="900">WLAN</tspan> indicator is ON
                    </text>
                  </g>

                  {/* BRANCH 1: Off (Left) */}
                  <path d="M 360 87 L 295 87 L 295 130" stroke="#ff0000" strokeWidth="2" markerEnd="url(#arrowWifi)" fill="none" />
                  <text
                    x="330"
                    y="80"
                    textAnchor="middle"
                    fontWeight="bold"
                    fontSize="11"
                    fill="#ff0000"
                    fontFamily="Arial, Helvetica, sans-serif"
                  >
                    Off
                  </text>

                  {/* Node 1A: Press and switch on Wi-Fi or WLAN button in ONT */}
                  <g>
                    <rect
                      x="220"
                      y="130"
                      width="150"
                      height="46"
                      fill="#ffffb0"
                      stroke="#000000"
                      strokeWidth="1.8"
                    />
                    <text
                      x="295"
                      y="146"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="9.5"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      Press and switch on
                    </text>
                    <text
                      x="295"
                      y="158"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="9.5"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      <tspan fontWeight="900">Wi-Fi</tspan> or <tspan fontWeight="900">WLAN</tspan> button
                    </text>
                    <text
                      x="295"
                      y="170"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="9.5"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      in ONT
                    </text>
                  </g>

                  {/* Sub-branch Off from Node 1A -> Down to Create TT to AREA-CPE-MTCE */}
                  <path d="M 220 153 L 155 153 L 155 220" stroke="#ff0000" strokeWidth="2" markerEnd="url(#arrowWifi)" fill="none" />
                  <text
                    x="180"
                    y="145"
                    textAnchor="middle"
                    fontWeight="bold"
                    fontSize="11"
                    fill="#ff0000"
                    fontFamily="Arial, Helvetica, sans-serif"
                  >
                    Off
                  </text>

                  {/* GREEN NODE: Create a TT to AREA-CPE-MTCE Work Group under BB Service */}
                  <g
                    className="cursor-pointer"
                    onClick={() => copyTtDetails(ttTemplateAreaCpe, 'tt-area-cpe')}
                  >
                    <rect
                      x="80"
                      y="220"
                      width="170"
                      height="90"
                      rx="30"
                      ry="30"
                      fill="#88c848"
                      stroke="#000000"
                      strokeWidth="2"
                    />
                    <text
                      x="165"
                      y="245"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="11"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      Create a TT to
                    </text>
                    <text
                      x="165"
                      y="262"
                      textAnchor="middle"
                      fontWeight="900"
                      fontSize="12"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      AREA-CPE-MTCE
                    </text>
                    <text
                      x="165"
                      y="280"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="11"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      Work Group under BB
                    </text>
                    <text
                      x="165"
                      y="296"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="11"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      Service
                    </text>
                  </g>

                  {/* Sub-branch On from Node 1A -> Points Right into Check whether the Internet is working */}
                  <path d="M 370 153 L 420 153 L 420 230" stroke="#ff0000" strokeWidth="2" markerEnd="url(#arrowWifi)" fill="none" />
                  <text
                    x="395"
                    y="145"
                    textAnchor="middle"
                    fontWeight="bold"
                    fontSize="11"
                    fill="#ff0000"
                    fontFamily="Arial, Helvetica, sans-serif"
                  >
                    On
                  </text>

                  {/* BRANCH 2: On (Right from Root Node) */}
                  <path d="M 520 87 L 610 87 L 610 130" stroke="#ff0000" strokeWidth="2" markerEnd="url(#arrowWifi)" fill="none" />
                  <text
                    x="565"
                    y="80"
                    textAnchor="middle"
                    fontWeight="bold"
                    fontSize="11"
                    fill="#ff0000"
                    fontFamily="Arial, Helvetica, sans-serif"
                  >
                    On
                  </text>

                  {/* Node 1B: Check Wireless is on in customer's device (Eg: Laptop or Smart Phone) */}
                  <g>
                    <rect
                      x="510"
                      y="130"
                      width="180"
                      height="46"
                      fill="#ffffb0"
                      stroke="#000000"
                      strokeWidth="1.8"
                    />
                    <text
                      x="600"
                      y="148"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="9.5"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      Check Wireless is on in
                    </text>
                    <text
                      x="600"
                      y="160"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="9.5"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      customer’s device
                    </text>
                    <text
                      x="600"
                      y="171"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="8.5"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      (Eg: Laptop or Smart Phone)
                    </text>
                  </g>

                  {/* Sub-branch No from Node 1B -> Right to Instruct customer... */}
                  <path d="M 690 153 L 740 153" stroke="#ff0000" strokeWidth="2" markerEnd="url(#arrowWifi)" fill="none" />
                  <text
                    x="715"
                    y="145"
                    textAnchor="middle"
                    fontWeight="bold"
                    fontSize="11"
                    fill="#ff0000"
                    fontFamily="Arial, Helvetica, sans-serif"
                  >
                    No
                  </text>

                  {/* Node: Instruct customer to switch on Wi-Fi in the Device */}
                  <g>
                    <rect
                      x="745"
                      y="125"
                      width="135"
                      height="56"
                      rx="28"
                      ry="28"
                      fill="#ffffb0"
                      stroke="#000000"
                      strokeWidth="1.8"
                    />
                    <text
                      x="812"
                      y="145"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="9"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      Instruct customer
                    </text>
                    <text
                      x="812"
                      y="157"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="9"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      to switch on Wi-Fi
                    </text>
                    <text
                      x="812"
                      y="169"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="9"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      in the Device
                    </text>
                  </g>

                  {/* Sub-branch Yes from Node 1B -> Down to Check Wi-Fi Configuration */}
                  <path d="M 610 176 L 610 230" stroke="#ff0000" strokeWidth="2" markerEnd="url(#arrowWifi)" fill="none" />
                  <text
                    x="625"
                    y="200"
                    textAnchor="start"
                    fontWeight="bold"
                    fontSize="11"
                    fill="#ff0000"
                    fontFamily="Arial, Helvetica, sans-serif"
                  >
                    Yes
                  </text>

                  {/* MIDDLE NODE: Check whether the Internet is working */}
                  <g>
                    <rect
                      x="380"
                      y="230"
                      width="145"
                      height="46"
                      fill="#ffffb0"
                      stroke="#000000"
                      strokeWidth="1.8"
                    />
                    <text
                      x="452"
                      y="249"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="9.5"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      Check whether the
                    </text>
                    <text
                      x="452"
                      y="263"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="9.5"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      Internet is working
                    </text>
                  </g>

                  {/* From Internet working: Yes -> Down to End */}
                  <path d="M 400 276 L 400 300 L 330 300 L 330 330" stroke="#ff0000" strokeWidth="2" markerEnd="url(#arrowWifi)" fill="none" />
                  <text
                    x="365"
                    y="292"
                    textAnchor="middle"
                    fontWeight="bold"
                    fontSize="11"
                    fill="#ff0000"
                    fontFamily="Arial, Helvetica, sans-serif"
                  >
                    Yes
                  </text>

                  {/* GREEN END NODE */}
                  <g>
                    <rect
                      x="290"
                      y="330"
                      width="80"
                      height="34"
                      rx="17"
                      ry="17"
                      fill="#88c848"
                      stroke="#000000"
                      strokeWidth="1.8"
                    />
                    <text
                      x="330"
                      y="351"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="12"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      End
                    </text>
                  </g>

                  {/* From Internet working: Arrow Right into Check Wi-Fi Configuration */}
                  <path d="M 525 253 L 555 253" stroke="#ff0000" strokeWidth="2" markerEnd="url(#arrowWifi)" fill="none" />

                  {/* NODE: Check Wi-Fi Configuration */}
                  <g>
                    <rect
                      x="555"
                      y="230"
                      width="120"
                      height="46"
                      fill="#ffffb0"
                      stroke="#000000"
                      strokeWidth="1.8"
                    />
                    <text
                      x="615"
                      y="250"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="9.5"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      Check Wi-Fi
                    </text>
                    <text
                      x="615"
                      y="264"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="9.5"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      Configuration
                    </text>
                  </g>

                  {/* From Check Wi-Fi Config: Incorrect -> Right to Enter correct Wi-Fi settings */}
                  <path d="M 675 253 L 735 253" stroke="#ff0000" strokeWidth="2" markerEnd="url(#arrowWifi)" fill="none" />
                  <text
                    x="705"
                    y="245"
                    textAnchor="middle"
                    fontWeight="bold"
                    fontSize="11"
                    fill="#ff0000"
                    fontFamily="Arial, Helvetica, sans-serif"
                  >
                    Incorrect
                  </text>

                  {/* Node: Enter correct Wi-Fi settings */}
                  <g>
                    <rect
                      x="740"
                      y="228"
                      width="140"
                      height="50"
                      rx="25"
                      ry="25"
                      fill="#ffffb0"
                      stroke="#000000"
                      strokeWidth="1.8"
                    />
                    <text
                      x="810"
                      y="248"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="9"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      Enter correct Wi-Fi
                    </text>
                    <text
                      x="810"
                      y="262"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="9"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      settings
                    </text>
                  </g>

                  {/* From Check Wi-Fi Config: Correct -> Down and Left to Create TT to CEN-CSC-TECH */}
                  <path d="M 615 276 L 615 375 L 535 375" stroke="#ff0000" strokeWidth="2" markerEnd="url(#arrowWifi)" fill="none" />
                  <text
                    x="640"
                    y="310"
                    textAnchor="start"
                    fontWeight="bold"
                    fontSize="11"
                    fill="#ff0000"
                    fontFamily="Arial, Helvetica, sans-serif"
                  >
                    Correct
                  </text>

                  {/* GREEN NODE: Create a TT to CEN-CSC-TECH Work Group under BB Service */}
                  <g
                    className="cursor-pointer"
                    onClick={() => copyTtDetails(ttTemplateCenCsc, 'tt-cen-csc')}
                  >
                    <rect
                      x="370"
                      y="330"
                      width="165"
                      height="90"
                      rx="30"
                      ry="30"
                      fill="#88c848"
                      stroke="#000000"
                      strokeWidth="2"
                    />
                    <text
                      x="452"
                      y="355"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="11"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      Create a TT to
                    </text>
                    <text
                      x="452"
                      y="372"
                      textAnchor="middle"
                      fontWeight="900"
                      fontSize="12"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      CEN-CSC-TECH
                    </text>
                    <text
                      x="452"
                      y="390"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="11"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      Work Group under BB
                    </text>
                    <text
                      x="452"
                      y="406"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="11"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      Service
                    </text>
                  </g>

                  {/* ======================================================== */}
                  {/* BOTTOM PURPLE CALLOUT BOXES MATCHING EXACT SCREENSHOT    */}
                  {/* ======================================================== */}
                  
                  {/* Left Callout Note: If Wi-Fi coverage is low */}
                  <g>
                    <path
                      d="M 120 440 C 100 440, 100 580, 120 580 L 330 580 C 350 580, 320 510, 350 440 Z"
                      fill="#f5e8ff"
                      stroke="#800080"
                      strokeWidth="2"
                    />
                    <text x="175" y="465" fontWeight="bold" fontSize="10" fill="#ff0000" fontFamily="Arial, Helvetica, sans-serif">
                      Note:
                    </text>
                    <text x="175" y="478" fontWeight="bold" fontSize="9" fill="#ff0000" fontFamily="Arial, Helvetica, sans-serif">
                      If Wi-Fi coverage is low,
                    </text>
                    <text x="190" y="495" fontWeight="bold" fontSize="9" fill="#000000" fontFamily="Arial, Helvetica, sans-serif">
                      1. Ask the distance
                    </text>
                    <text x="205" y="508" fontWeight="normal" fontSize="8" fill="#000000" fontFamily="Arial, Helvetica, sans-serif">
                      between the ONT and
                    </text>
                    <text x="205" y="520" fontWeight="normal" fontSize="8" fill="#000000" fontFamily="Arial, Helvetica, sans-serif">
                      the device
                    </text>
                    <text x="190" y="535" fontWeight="bold" fontSize="8.5" fill="#000000" fontFamily="Arial, Helvetica, sans-serif">
                      2. Add the distance in the
                    </text>
                    <text x="205" y="546" fontWeight="normal" fontSize="8" fill="#000000" fontFamily="Arial, Helvetica, sans-serif">
                      description of the TT
                    </text>
                    <text x="190" y="560" fontWeight="bold" fontSize="8.5" fill="#000000" fontFamily="Arial, Helvetica, sans-serif">
                      3. Forward such issues to
                    </text>
                    <text x="205" y="571" fontWeight="bold" fontSize="8.5" fill="#000000" fontFamily="Arial, Helvetica, sans-serif">
                      AREA- CPE- MTCE
                    </text>
                  </g>

                  {/* Right Callout Note: Refer Wi-Fi Configuration guides for ONTs */}
                  <g>
                    <path
                      d="M 680 430 C 650 430, 680 500, 650 570 L 860 570 C 880 570, 880 430, 860 430 Z"
                      fill="#f5e8ff"
                      stroke="#800080"
                      strokeWidth="2"
                    />
                    <text x="705" y="455" fontWeight="bold" fontSize="10" fill="#000000" fontFamily="Arial, Helvetica, sans-serif">
                      <tspan fill="#ff0000">Note: </tspan>Refer Wi-Fi
                    </text>
                    <text x="705" y="470" fontWeight="bold" fontSize="9" fill="#000000" fontFamily="Arial, Helvetica, sans-serif">
                      Configuration guides for
                    </text>
                    <text x="705" y="485" fontWeight="bold" fontSize="9" fill="#000000" fontFamily="Arial, Helvetica, sans-serif">
                      ONTs and check SSID,
                    </text>
                    <text x="705" y="500" fontWeight="bold" fontSize="9" fill="#000000" fontFamily="Arial, Helvetica, sans-serif">
                      Enable SSID,
                    </text>
                    <text x="705" y="515" fontWeight="bold" fontSize="9" fill="#000000" fontFamily="Arial, Helvetica, sans-serif">
                      Encryption,
                    </text>
                    <text x="705" y="530" fontWeight="bold" fontSize="9" fill="#000000" fontFamily="Arial, Helvetica, sans-serif">
                      Wireless p/w
                    </text>
                    <text x="705" y="546" fontWeight="bold" fontSize="9" fill="#000000" textDecoration="underline" fontFamily="Arial, Helvetica, sans-serif">
                      Through Detail
                    </text>
                    <text x="705" y="559" fontWeight="bold" fontSize="8.5" fill="#000000" textDecoration="underline" fontFamily="Arial, Helvetica, sans-serif">
                      Setup/Advance Setup or
                    </text>
                    <text x="705" y="571" fontWeight="bold" fontSize="8.5" fill="#000000" textDecoration="underline" fontFamily="Arial, Helvetica, sans-serif">
                      Network
                    </text>
                  </g>

                </svg>
              </div>

            </div>
          )}

          {/* 6. BOTTOM NAVIGATION FOOTER */}
          <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200">
            <Link
              href="/knowledge-hub/faq/ftth/pon-los-indicator"
              className="px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-2 transition-all shadow-2xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous: PON/LOS Indicator SOP</span>
            </Link>

            <div className="flex items-center gap-3">
              <Link
                href="/knowledge-hub/faq/ftth"
                className="px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-2 transition-all shadow-2xs"
              >
                <span>Back to FAQs - FTTH</span>
              </Link>

              <Link
                href="/knowledge-hub/faq/ftth/browsing-slow"
                className="px-4 py-2 rounded-lg bg-[#005696] hover:bg-[#00477d] text-white font-bold text-xs flex items-center gap-2 transition-all shadow-xs"
              >
                <span>Next: Browsing Slow SOP</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
