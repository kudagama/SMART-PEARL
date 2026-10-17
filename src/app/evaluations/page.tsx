"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, AlertTriangle, CheckCircle2, Clock, Activity, FileText, Calendar, ChevronRight, X, PhoneCall, BarChart3 } from 'lucide-react';

type CallEvaluation = {
  id: string;
  type: string;
  caller: string;
  time: string;
  duration: string;
  score: number;
  sentiment: 'Excellent' | 'Good' | 'Average' | 'Poor';
  strengths: string[];
  weaknesses: { issue: string; desc: string }[];
};

const dummyData: Record<string, CallEvaluation[]> = {
  '2026-09-28': [
    {
      id: 'c1',
      type: 'Product Inquiry (Fibre)',
      caller: '071 234 5678',
      time: '10:45 AM',
      duration: '04:30',
      score: 85,
      sentiment: 'Good',
      strengths: [
        'Promptly greeted the customer and maintained a polite tone throughout.',
        'Successfully gathered initial location data (Nugegoda) for coverage checking.'
      ],
      weaknesses: [
        { issue: 'Missed Upsell Opportunity', desc: 'Failed to mention the "Free Router & Installation" promotion currently active for Fibre connections.' },
        { issue: 'Incomplete Data Collection', desc: 'Only gathered the city "Nugegoda" but did not ask for the exact street address which is required for accurate fibre availability validation.' }
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
      strengths: [
        'Instantly identified the requested branch (BOC Kandy) without asking for repeats.',
        'Proactively offered the email address when the customer asked for it.'
      ],
      weaknesses: [
        { issue: 'Transfer Protocol', desc: 'Could have offered to directly transfer the call to the BOC Kandy branch instead of just reading the number.' }
      ]
    },
    {
      id: 'c3',
      type: 'Technical Support',
      caller: '011 233 4455',
      time: '03:30 PM',
      duration: '06:15',
      score: 75,
      sentiment: 'Average',
      strengths: [
        'Followed standard troubleshooting protocol for router restart.'
      ],
      weaknesses: [
        { issue: 'Long Hold Time', desc: 'Put customer on hold for over 2 minutes without checking back in.' }
      ]
    }
  ]
};

export default function EvaluationsPage() {
  const [selectedDate, setSelectedDate] = useState('2026-09-28');
  const [selectedCall, setSelectedCall] = useState<CallEvaluation | null>(null);

  const calls = dummyData[selectedDate] || [];
  const averageScore = calls.length > 0 ? Math.round(calls.reduce((acc, call) => acc + call.score, 0) / calls.length) : 0;

  return (
    <div className="flex-1 flex overflow-hidden bg-slate-50">
      <div className="flex-1 flex flex-col h-full overflow-y-auto relative">
        {/* Background Decorations */}
        <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-indigo-200/20 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="relative z-10 px-8 py-10 max-w-6xl mx-auto w-full">
          
          <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <motion.div 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-100/50 border border-indigo-200 text-indigo-700 text-sm font-bold mb-4"
              >
                <Activity className="w-4 h-4" />
                Performance Dashboard
              </motion.div>
              <h1 className="text-4xl font-black text-slate-800 tracking-tight">
                My <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-500">Evaluations</span>
              </h1>
              <p className="text-slate-500 text-lg mt-2">
                Review your recent calls and AI feedback to improve your performance.
              </p>
            </div>

            <div className="flex items-center gap-4 bg-white p-2 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
                <Calendar className="w-5 h-5 text-slate-400" />
                <select 
                  className="bg-transparent border-none text-sm font-bold text-slate-700 focus:ring-0 cursor-pointer outline-none"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                >
                  <option value="2026-09-28">Today (Sep 28, 2026)</option>
                  <option value="2026-09-27">Yesterday (Sep 27, 2026)</option>
                </select>
              </div>
            </div>
          </header>

          {/* Average Performance Widget */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                <BarChart3 className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Daily Average</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-slate-800">{averageScore}<span className="text-2xl text-slate-400">%</span></span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                <PhoneCall className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Total Calls</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-slate-800">105</span>
                </div>
              </div>
            </div>
          </div>

          {/* Aggregated Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
            {/* Strengths */}
            <div className="bg-emerald-50/30 rounded-3xl p-6 border border-emerald-100 shadow-sm relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500"></div>
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-6">
                <TrendingUp className="w-5 h-5 text-emerald-500" /> Daily Summarized Strengths
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-sm text-slate-600 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  Consistently followed the standard SLTMobitel greeting on 100% of calls.
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-600 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  Excellent cross-selling of Home Plus packages during Fibre inquiries.
                </li>
              </ul>
            </div>

            {/* Weaknesses */}
            <div className="bg-amber-50/30 rounded-3xl p-6 border border-amber-100 shadow-sm relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500"></div>
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-6">
                <AlertTriangle className="w-5 h-5 text-amber-500" /> Daily Areas for Improvement
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-sm text-slate-600 font-medium bg-amber-50/80 p-4 rounded-xl border border-amber-100/50">
                  <span className="w-6 h-6 rounded-full bg-amber-200 text-amber-700 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">1</span>
                  <span>
                    <strong className="text-slate-800 block mb-1">Data Collection Flags:</strong>
                    Missed asking for the exact street address during new connection feasibility checks.
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Calls List */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-lg font-bold text-slate-800">Call History</h2>
            </div>
            
            {calls.length === 0 ? (
              <div className="p-10 text-center text-slate-500">
                No calls found for this date.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {calls.map((call) => (
                  <div key={call.id} className="p-6 hover:bg-slate-50/50 transition-colors flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center shrink-0">
                        <PhoneCall className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-slate-800">{call.type}</h3>
                        <p className="text-sm font-medium text-slate-500 mt-0.5">{call.caller} • {call.time} • {call.duration}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-8">
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Score</p>
                        <p className={`text-xl font-black ${call.score >= 90 ? 'text-emerald-500' : call.score >= 80 ? 'text-[#005696]' : 'text-amber-500'}`}>
                          {call.score}%
                        </p>
                      </div>
                      <div className="text-right w-24">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Sentiment</p>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-slate-100 text-slate-600">
                          {call.sentiment}
                        </span>
                      </div>
                      <button 
                        onClick={() => setSelectedCall(call)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-bold transition-colors shadow-md"
                      >
                        Details <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal for Detailed View */}
      <AnimatePresence>
        {selectedCall && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setSelectedCall(null)}
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="border-b border-slate-100 px-6 py-5 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-800">{selectedCall.type} Evaluation</h2>
                    <p className="text-sm text-slate-500">
                      {selectedCall.caller} • {selectedCall.time}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedCall(null)}
                  className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-slate-600" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1 bg-slate-50/30">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Strengths */}
                  <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-6 relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500"></div>
                    <h3 className="text-base font-bold text-slate-800 flex items-center gap-2 mb-6">
                      <TrendingUp className="w-5 h-5 text-emerald-500" /> What went well
                    </h3>
                    <ul className="space-y-4">
                      {selectedCall.strengths.map((s, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-slate-600 font-medium">
                          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Weaknesses */}
                  <div className="bg-rose-50/50 border border-rose-100 rounded-2xl p-6 relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-rose-500"></div>
                    <h3 className="text-base font-bold text-slate-800 flex items-center gap-2 mb-6">
                      <AlertTriangle className="w-5 h-5 text-rose-500" /> Areas for Improvement
                    </h3>
                    <ul className="space-y-4">
                      {selectedCall.weaknesses.map((w, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-slate-600 font-medium bg-white/60 p-4 rounded-xl border border-rose-100/50">
                          <span className="w-6 h-6 rounded-full bg-rose-200 text-rose-700 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">{i+1}</span>
                          <span>
                            <strong className="text-slate-800 block mb-1">{w.issue}:</strong>
                            {w.desc}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
