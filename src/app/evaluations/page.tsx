"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Activity, 
  FileText, 
  Calendar, 
  ChevronRight, 
  X, 
  PhoneCall, 
  BarChart3, 
  Award, 
  BookOpen, 
  Sparkles, 
  Volume2, 
  Check, 
  ShieldCheck,
  Languages,
  HelpCircle
} from 'lucide-react';
import { OFFICIAL_SLT_STANDARDS, QualityStandardResult, evaluateCallQuality } from '@/lib/qualityStandards';

type CallEvaluation = {
  id: string;
  type: string;
  caller: string;
  time: string;
  duration: string;
  score: number;
  sentiment: 'Excellent' | 'Good' | 'Average' | 'Poor';
  language?: string;
  strengths: string[];
  weaknesses: { issue: string; desc: string; standardRef?: string }[];
  criteria?: QualityStandardResult['criteria'];
  transcript?: string;
};

const defaultSeedCalls: Record<string, CallEvaluation[]> = {
  '2026-10-17': [
    {
      id: 'c-today-1',
      type: 'FTTH Voice & Fibre Triage',
      caller: '011 244 5566',
      time: '11:45 AM',
      duration: '03:15',
      score: 95,
      sentiment: 'Excellent',
      language: 'Sinhala',
      strengths: [
        'Accurately delivered the standard Sinhala greeting: "ආයුබෝවන්! මම හිමාලි, මට පුළුවනි ඔබට සහය වන්න".',
        'Addressed the customer respectfully as "සර්" throughout the inquiry.',
        'Properly delivered pre-close inquiry ("වෙනත් යමක් දැනගැනීමට අවශ්‍යද?") and announced IVR C-Sat rating before ending.'
      ],
      weaknesses: [
        { 
          issue: 'Hold Statement Threshold', 
          desc: 'Brief hold placed at 01:20 was refreshed after 40s, just within the 45-second long hold threshold.', 
          standardRef: 'Standard 2: Holding' 
        }
      ],
      criteria: evaluateCallQuality('ආයුබෝවන්! මම හිමාලි, මට පුළුවනි ඔබට සහය වන්න සර්. කරුණාකර ඇමතුමේ රැඳී ඉන්න සර්. රැඳීසිටියාට ස්තූතියි. වෙනත් යමක් දැනගැනීමට අවශ්‍යද? මා ලබාදුන් සේවය ඇගයීම සඳහා රැඳී සිටින්න. SLT Mobitel ඇමතුවාට ස්තූතියි. සුබ දවසක්!').criteria,
      transcript: `AGENT: ආයුබෝවන්! මම හිමාලි, මට පුළුවනි ඔබට සහය වන්න සර්.\nCUSTOMER: මගේ fiber router එකේ PON ලයිට් එක ON හැබැයි dial tone නෑ.\nAGENT: කරුණාකර ඇමතුමේ රැඳී ඉන්න සර් මම MDF switch checks බලන්නම්.\nAGENT: රැඳීසිටියාට ස්තූතියි සර්. මම Trouble Ticket එකක් MDF අංශයට යොමු කළා.\nAGENT: වෙනත් යමක් දැනගැනීමට අවශ්‍යද සර්?\nCUSTOMER: නෑ බොහොම ස්තූතියි.\nAGENT: මා ලබාදුන් සේවය ඇගයීම සඳහා රැඳී සිටින්න. SLT Mobitel ඇමතුවාට ස්තූතියි. සුබ දවසක්!`
    },
    {
      id: 'c-today-2',
      type: 'Broadband Speed Issue',
      caller: '071 556 7788',
      time: '10:15 AM',
      duration: '02:45',
      score: 80,
      sentiment: 'Good',
      language: 'English',
      strengths: [
        'Used official English greeting: "Ayubowan! I am Himali, How may I help you?".',
        'Maintained polite tone and addressed caller as Madam.'
      ],
      weaknesses: [
        { 
          issue: 'Pre-Close Question Missed', 
          desc: 'Concluded call without asking "Is there anything else I can help you with Sir/Madam?".', 
          standardRef: 'Standard 3: Pre-Close' 
        }
      ],
      criteria: evaluateCallQuality('Ayubowan! I am Himali, How may I help you Madam? Please hold on Madam. Thank you for being on hold. Please hold on to rate my service. Thank you for calling SLT Mobitel. Have a nice day!').criteria
    }
  ],
  '2026-09-28': [
    {
      id: 'c1',
      type: 'Product Inquiry (Fibre)',
      caller: '071 234 5678',
      time: '10:45 AM',
      duration: '04:30',
      score: 85,
      sentiment: 'Good',
      language: 'English',
      strengths: [
        'Promptly greeted the customer and maintained polite tone throughout.',
        'Successfully gathered initial location data (Nugegoda) for coverage checking.'
      ],
      weaknesses: [
        { issue: 'Missed Upsell Opportunity', desc: 'Failed to mention the "Free Router & Installation" promotion currently active for Fibre connections.' },
        { issue: 'Incomplete Data Collection', desc: 'Only gathered city "Nugegoda" but did not ask for exact street address.' }
      ]
    },
    {
      id: 'c2',
      type: 'Directory Inquiry',
      caller: '077 987 6543',
      time: '01:15 PM',
      duration: '01:20',
      score: 95,
      sentiment: 'Excellent',
      language: 'English',
      strengths: [
        'Instantly identified the requested branch (BOC Kandy) without asking for repeats.',
        'Proactively offered the email address when the customer asked for it.'
      ],
      weaknesses: [
        { issue: 'Transfer Protocol', desc: 'Could have offered to directly transfer the call to the BOC Kandy branch instead of just reading the number.' }
      ]
    }
  ]
};

export default function EvaluationsPage() {
  const [selectedDate, setSelectedDate] = useState('2026-10-17');
  const [selectedCall, setSelectedCall] = useState<CallEvaluation | null>(null);
  const [activeStandardLang, setActiveStandardLang] = useState<'sinhala' | 'english' | 'tamil'>('sinhala');
  const [storedCalls, setStoredCalls] = useState<CallEvaluation[]>([]);

  // Load dynamically evaluated calls from localStorage
  useEffect(() => {
    try {
      const localData = localStorage.getItem('slt_call_evaluations');
      if (localData) {
        const parsed = JSON.parse(localData);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setStoredCalls(parsed);
        }
      }
    } catch (e) {
      console.error('Failed to parse stored evaluations', e);
    }
  }, []);

  // Merge today's calls with stored calls
  const currentDayCalls: CallEvaluation[] = [
    ...(selectedDate === '2026-10-17' ? storedCalls : []),
    ...(defaultSeedCalls[selectedDate] || [])
  ];

  const averageScore = currentDayCalls.length > 0 
    ? Math.round(currentDayCalls.reduce((acc, call) => acc + call.score, 0) / currentDayCalls.length) 
    : 0;

  const standard = OFFICIAL_SLT_STANDARDS[activeStandardLang];

  return (
    <div className="flex-1 flex overflow-hidden bg-slate-50">
      <div className="flex-1 flex flex-col h-full overflow-y-auto relative">
        {/* Background Decorations */}
        <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-indigo-200/20 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="relative z-10 px-6 py-8 max-w-6xl mx-auto w-full space-y-8">
          
          {/* Header */}
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-slate-200/80">
            <div>
              <motion.div 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 border border-blue-200 text-[#005696] text-xs font-black mb-3 shadow-2xs"
              >
                <ShieldCheck className="w-4 h-4 text-[#005696]" />
                SLT Contact Center Quality Assurance (QA)
              </motion.div>
              <h1 className="text-3xl font-black text-slate-800 tracking-tight">
                Quality Standards & <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#005696] to-indigo-600">Performance</span>
              </h1>
              <p className="text-slate-500 text-sm mt-1 font-medium">
                Real-time compliance monitoring and official SLT call handling quality audits.
              </p>
            </div>

            <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-xs border border-slate-200">
              <Calendar className="w-4 h-4 text-[#005696] ml-2" />
              <select 
                className="bg-transparent border-none text-xs font-black text-slate-700 focus:ring-0 cursor-pointer outline-none pr-3"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              >
                <option value="2026-10-17">Today (Oct 17, 2026 - Active)</option>
                <option value="2026-09-28">Sep 28, 2026</option>
              </select>
            </div>
          </header>

          {/* Average Performance KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center gap-5">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#005696] to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-200">
                <BarChart3 className="w-7 h-7" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">QA Standards Average</p>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-3xl font-black text-slate-800">{averageScore}</span>
                  <span className="text-lg font-bold text-slate-400">%</span>
                  <span className="ml-2 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    {averageScore >= 85 ? 'Target Met' : 'Needs Review'}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center gap-5">
              <div className="w-14 h-14 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 shadow-sm">
                <PhoneCall className="w-7 h-7" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Audited Calls</p>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-3xl font-black text-slate-800">{currentDayCalls.length}</span>
                  <span className="text-xs font-medium text-slate-400">sessions recorded</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center gap-5">
              <div className="w-14 h-14 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 shadow-sm">
                <Award className="w-7 h-7" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Target Compliance</p>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-3xl font-black text-slate-800">90%</span>
                  <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">SLT SLA</span>
                </div>
              </div>
            </div>
          </div>

          {/* OFFICIAL SLT QUALITY STANDARDS REFERENCE ACCORDION / TABS */}
          <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 text-white rounded-3xl p-6 shadow-xl border border-indigo-800/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#00A3E0]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-cyan-300">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black tracking-tight flex items-center gap-2">
                    Official Quality Standards of Calls
                    <span className="text-[10px] bg-cyan-400 text-slate-900 font-extrabold px-2 py-0.5 rounded-full uppercase">
                      Mandatory SLA
                    </span>
                  </h2>
                  <p className="text-xs text-blue-200">
                    Sri Lanka Telecom contact center standard verbatim scripts & procedures
                  </p>
                </div>
              </div>

              {/* Language Selector for Quality Standards */}
              <div className="flex items-center gap-1 bg-white/10 p-1 rounded-xl border border-white/10 backdrop-blur-md">
                <button
                  onClick={() => setActiveStandardLang('sinhala')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeStandardLang === 'sinhala'
                      ? 'bg-cyan-400 text-slate-950 shadow-md'
                      : 'text-white/80 hover:text-white hover:bg-white/5'
                  }`}
                >
                  🇱🇰 සිංහල (Sinhala)
                </button>
                <button
                  onClick={() => setActiveStandardLang('english')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeStandardLang === 'english'
                      ? 'bg-cyan-400 text-slate-950 shadow-md'
                      : 'text-white/80 hover:text-white hover:bg-white/5'
                  }`}
                >
                  🌐 English
                </button>
                <button
                  onClick={() => setActiveStandardLang('tamil')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeStandardLang === 'tamil'
                      ? 'bg-cyan-400 text-slate-950 shadow-md'
                      : 'text-white/80 hover:text-white hover:bg-white/5'
                  }`}
                >
                  தமிழ் (Tamil)
                </button>
              </div>
            </div>

            {/* Standards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
              {/* 1. Greeting */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2 hover:bg-white/10 transition-colors">
                <span className="text-[10px] font-bold text-cyan-300 uppercase tracking-widest flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-cyan-400/20 text-cyan-300 flex items-center justify-center text-[10px]">1</span>
                  Greeting Standard
                </span>
                <p className="text-sm font-black text-white leading-snug">
                  "{standard.greeting.standard}"
                </p>
                <p className="text-[11px] text-blue-200/80 leading-relaxed">
                  {standard.greeting.description}
                </p>
              </div>

              {/* 2. Holding */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2 hover:bg-white/10 transition-colors">
                <span className="text-[10px] font-bold text-amber-300 uppercase tracking-widest flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center text-[10px]">2</span>
                  Holding Protocol (45s)
                </span>
                <p className="text-xs font-bold text-white">
                  Prior: <span className="text-amber-200">"{standard.holding.prior}"</span>
                </p>
                <p className="text-[10px] text-amber-300/90 leading-tight">
                  ⏱️ {standard.holding.threshold}
                </p>
                <p className="text-xs font-bold text-white pt-1 border-t border-white/10">
                  Retrieval: <span className="text-emerald-300">"{standard.holding.retrieval}"</span>
                </p>
              </div>

              {/* 3. Pre-close */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2 hover:bg-white/10 transition-colors">
                <span className="text-[10px] font-bold text-purple-300 uppercase tracking-widest flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-purple-400/20 text-purple-300 flex items-center justify-center text-[10px]">3</span>
                  Pre-Close Inquiry
                </span>
                <p className="text-sm font-black text-white leading-snug">
                  "{standard.preClose.standard}"
                </p>
                <p className="text-[11px] text-purple-200/80 leading-relaxed">
                  {standard.preClose.description}
                </p>
              </div>

              {/* 4. IVR C-Sat & Ending */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2 hover:bg-white/10 transition-colors">
                <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-widest flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-emerald-400/20 text-emerald-300 flex items-center justify-center text-[10px]">4</span>
                  IVR C-Sat & Ending
                </span>
                <p className="text-xs font-black text-white leading-snug">
                  "{standard.ivrEnding.standard}"
                </p>
                <p className="text-[11px] text-emerald-200/80 leading-relaxed">
                  {standard.ivrEnding.description}
                </p>
              </div>
            </div>

            {/* Mandatory Notes */}
            <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center gap-y-2 gap-x-6 text-[11px] text-blue-100 font-medium">
              <span className="font-bold text-cyan-300 uppercase tracking-wider">Mandatory Notes:</span>
              {standard.mandatoryNotes.map((note, idx) => (
                <span key={idx} className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  {note}
                </span>
              ))}
            </div>
          </div>

          {/* Calls List with Live Standards Verification Badges */}
          <div className="bg-white rounded-3xl shadow-xs border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
              <div>
                <h2 className="text-base font-black text-slate-800 flex items-center gap-2">
                  <PhoneCall className="w-4 h-4 text-[#005696]" /> Audited Call Records
                </h2>
                <p className="text-xs text-slate-400 font-medium">Live evaluations verified against SLT QA Standards</p>
              </div>
              <span className="text-xs font-bold text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200">
                {currentDayCalls.length} records available
              </span>
            </div>
            
            {currentDayCalls.length === 0 ? (
              <div className="p-12 text-center text-slate-500 space-y-2">
                <HelpCircle className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="font-bold text-slate-700">No calls evaluated for this date yet.</p>
                <p className="text-xs text-slate-400">Simulate or speak a call in the PEARL Dashboard to generate live QA evaluations.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {currentDayCalls.map((call) => (
                  <div key={call.id} className="p-5 hover:bg-slate-50/60 transition-colors flex flex-col md:flex-row items-center justify-between gap-5">
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 font-black text-sm shadow-xs ${
                        call.score >= 90 ? 'bg-emerald-100 text-emerald-800' : call.score >= 75 ? 'bg-blue-100 text-[#005696]' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {call.score}%
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-black text-slate-800">{call.type}</h3>
                          {call.language && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                              {call.language}
                            </span>
                          )}
                          {call.id.startsWith('call-') && (
                            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 animate-pulse">
                              LIVE AUDIT
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 font-medium">
                          {call.caller} • {call.time} • Duration: <span className="font-mono font-bold text-slate-700">{call.duration}</span>
                        </p>
                      </div>
                    </div>
                    
                    {/* Live Standards Checkmark Badges */}
                    <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-bold">
                      <span className={`px-2 py-1 rounded-lg flex items-center gap-1 ${
                        call.criteria?.greeting?.passed !== false ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {call.criteria?.greeting?.passed !== false ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <AlertTriangle className="w-3 h-3 text-rose-600" />}
                        Greeting
                      </span>

                      <span className={`px-2 py-1 rounded-lg flex items-center gap-1 ${
                        call.criteria?.holding?.passed !== false ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600'
                      }`}>
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Hold 45s
                      </span>

                      <span className={`px-2 py-1 rounded-lg flex items-center gap-1 ${
                        call.criteria?.preClose?.passed !== false ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {call.criteria?.preClose?.passed !== false ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <AlertTriangle className="w-3 h-3 text-rose-600" />}
                        Pre-Close
                      </span>

                      <span className={`px-2 py-1 rounded-lg flex items-center gap-1 ${
                        call.criteria?.ivrEnding?.passed !== false ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {call.criteria?.ivrEnding?.passed !== false ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <AlertTriangle className="w-3 h-3 text-rose-600" />}
                        IVR C-Sat
                      </span>

                      <span className={`px-2 py-1 rounded-lg flex items-center gap-1 ${
                        call.criteria?.sirMadam?.passed !== false ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {call.criteria?.sirMadam?.passed !== false ? <CheckCircle2 className="w-3 h-3 text-indigo-600" /> : <AlertTriangle className="w-3 h-3 text-rose-600" />}
                        Sir/Madam
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => setSelectedCall(call)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-[#005696] hover:bg-[#00477d] text-white rounded-xl text-xs font-black transition-all shadow-sm active:scale-95"
                      >
                        Audit Details <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal for Detailed SLT Quality Standards Breakdown */}
      <AnimatePresence>
        {selectedCall && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
              onClick={() => setSelectedCall(null)}
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[92vh]"
            >
              {/* Modal Header */}
              <div className="border-b border-slate-100 px-6 py-5 flex items-center justify-between bg-slate-50/70">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-base shadow-sm ${
                    selectedCall.score >= 90 ? 'bg-emerald-600' : selectedCall.score >= 75 ? 'bg-[#005696]' : 'bg-amber-600'
                  }`}>
                    {selectedCall.score}%
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
                      {selectedCall.type} QA Audit
                      <span className="text-xs font-bold text-slate-500 bg-white px-2.5 py-0.5 rounded-full border border-slate-200">
                        {selectedCall.duration}
                      </span>
                    </h2>
                    <p className="text-xs text-slate-500 font-medium">
                      Caller: <span className="font-mono font-bold text-slate-700">{selectedCall.caller}</span> • Evaluated at: {selectedCall.time}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedCall(null)}
                  className="p-2 bg-white hover:bg-slate-100 rounded-full border border-slate-200 transition-colors"
                >
                  <X className="w-5 h-5 text-slate-600" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto flex-1 space-y-6">
                
                {/* SLT Quality Standards Compliance Checklist */}
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#005696]" /> Official Quality Standards Checklist
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Greeting */}
                    <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800">1. Greeting & Identity</span>
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded ${
                          selectedCall.criteria?.greeting?.passed !== false ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {selectedCall.criteria?.greeting?.passed !== false ? 'PASSED (25/25)' : 'MISSED (0/25)'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium">
                        Standard: "ආයුබෝවන්! මම හිමාලි, මට පුළුවනි ඔබට සහය වන්න" / "Ayubowan! I am Himali, How may I help you?"
                      </p>
                    </div>

                    {/* Holding */}
                    <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800">2. Holding Protocol</span>
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded ${
                          selectedCall.criteria?.holding?.passed !== false ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {selectedCall.criteria?.holding?.passed !== false ? 'PASSED (20/20)' : 'NEEDS CHECK'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium">
                        Standard: "Please hold on Sir/Madam" (45s max refresh) &rarr; "Thank you for being on hold"
                      </p>
                    </div>

                    {/* Pre-Close */}
                    <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800">3. Pre-Close Inquiry</span>
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded ${
                          selectedCall.criteria?.preClose?.passed !== false ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {selectedCall.criteria?.preClose?.passed !== false ? 'PASSED (20/20)' : 'MISSED (0/20)'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium">
                        Standard: "වෙනත් යමක් දැනගැනීමට අවශ්‍යද?" / "Is there anything else I can help you with Sir/Madam?"
                      </p>
                    </div>

                    {/* IVR C-Sat Ending */}
                    <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800">4. IVR C-Sat & Ending</span>
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded ${
                          selectedCall.criteria?.ivrEnding?.passed !== false ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {selectedCall.criteria?.ivrEnding?.passed !== false ? 'PASSED (20/20)' : 'MISSED (0/20)'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium">
                        Standard: "Please hold on to rate my service. Thank you for calling SLT Mobitel. Have a nice day!"
                      </p>
                    </div>

                    {/* Customer Courtesy */}
                    <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1 md:col-span-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800">5. Courtesy & Honorific Standards (Sir / Madam & Sorry)</span>
                        <span className="text-[10px] font-black px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                          COMPLIANT (15/15)
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium">
                        Standard: Officer must address customer respectfully as "Sir / Madam" and use "Sorry" when appropriate.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Strengths & Weaknesses Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Strengths */}
                  <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-5 space-y-3">
                    <h3 className="text-xs font-black uppercase tracking-wider text-emerald-800 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-emerald-600" /> Compliant Strengths
                    </h3>
                    <ul className="space-y-2.5">
                      {selectedCall.strengths.map((s, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-xs text-slate-700 font-medium">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Areas for Improvement */}
                  <div className="bg-rose-50/60 border border-rose-200 rounded-2xl p-5 space-y-3">
                    <h3 className="text-xs font-black uppercase tracking-wider text-rose-800 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-600" /> Non-Compliance & Action Points
                    </h3>
                    {selectedCall.weaknesses.length === 0 ? (
                      <p className="text-xs text-slate-500 italic">No non-compliance flags detected. Outstanding adherence!</p>
                    ) : (
                      <ul className="space-y-2.5">
                        {selectedCall.weaknesses.map((w, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-slate-700 bg-white p-3 rounded-xl border border-rose-200/80 shadow-2xs">
                            <span className="w-5 h-5 rounded-full bg-rose-200 text-rose-800 flex items-center justify-center shrink-0 font-bold text-[10px] mt-0.5">
                              {i + 1}
                            </span>
                            <div>
                              <strong className="text-slate-800 block text-xs font-bold">{w.issue}</strong>
                              <p className="text-slate-600 text-[11px] mt-0.5">{w.desc}</p>
                              {w.standardRef && (
                                <span className="inline-block mt-1 text-[9px] font-bold text-rose-700 bg-rose-100 px-1.5 py-0.2 rounded">
                                  {w.standardRef}
                                </span>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                {/* Call Transcript if available */}
                {selectedCall.transcript && (
                  <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-2 font-mono text-xs">
                    <p className="text-[10px] font-bold text-cyan-300 uppercase tracking-widest">Audited Audio Transcript Dialogue</p>
                    <pre className="whitespace-pre-wrap font-sans text-xs leading-relaxed text-slate-200 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                      {selectedCall.transcript}
                    </pre>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
