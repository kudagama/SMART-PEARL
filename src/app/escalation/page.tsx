"use client";

import React, { useState } from 'react';
import { Search, AlertTriangle, PhoneCall, Copy, Clock, MapPin, Building2, ChevronDown, Flag, Info, Send, FileWarning, Mic } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function EscalationPage() {
  const [accordionOpen, setAccordionOpen] = useState(true);
  const [isListening, setIsListening] = useState(false);
  
  return (
    <div className="flex w-full h-[calc(100vh-3.5rem)] bg-slate-50 overflow-y-auto lg:overflow-hidden">
      {/* 3-Column Layout Container */}
      <div className="flex flex-col lg:flex-row w-full max-w-[1600px] mx-auto p-4 sm:p-6 gap-6 min-h-min lg:h-full lg:overflow-hidden">
        
        {/* Left Column: Search & Context */}
        <div className="flex-1 flex flex-col min-w-0 max-w-2xl gap-6 lg:overflow-y-auto">
          {/* Main Search Omnibox */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
              <Search className="w-4 h-4 text-[#005696]" />
              Agent Query Context
            </h2>
            <div className="relative">
              <input 
                type="text" 
                className={`w-full text-lg pl-4 pr-32 py-3.5 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all bg-white shadow-sm font-medium ${
                  isListening 
                    ? 'border-[#00A3E0] focus:ring-[#00A3E0]/20 text-[#005696]' 
                    : 'border-[#005696] focus:ring-[#005696]/10 text-slate-900'
                }`}
                value={isListening ? "Listening... Speak now" : "kandy rto billing section number ekak danna"}
                readOnly
              />
              <div className="absolute right-3 top-2.5 flex items-center gap-2">
                <button 
                  onClick={() => setIsListening(!isListening)}
                  className={`p-2 rounded-lg transition-all flex items-center justify-center ${
                    isListening 
                      ? 'bg-rose-50 text-rose-600 animate-pulse border border-rose-200' 
                      : 'bg-slate-50 text-slate-400 hover:text-[#005696] hover:bg-[#e0f4fc] border border-transparent'
                  }`}
                  title="Voice Search (Sinhala/Tamil/English)"
                >
                  <Mic className="w-5 h-5" />
                </button>
                {!isListening && (
                  <div className="px-2 py-1 bg-[#e0f4fc] text-[#005696] text-xs font-semibold rounded border border-cyan-200">
                    Singlish
                  </div>
                )}
              </div>
            </div>
            
            {/* Alert Banner */}
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 flex items-start gap-3 p-4 bg-amber-50 rounded-xl border border-amber-200"
            >
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-amber-900">Partial Match Found (Confidence: 74%)</h3>
                <p className="text-sm text-amber-700 mt-1">
                  The query contains ambiguous mixed language context. Suggesting the closest regional office for "billing section" inquiries in Kandy.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Primary Result Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col"
          >
            <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 bg-white border border-slate-200 rounded text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                    Regional Office
                  </span>
                  <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-100 uppercase tracking-wider">
                    <Clock className="w-3 h-3" /> Open Now
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 leading-tight">
                  Regional Telecom Office (RTO) - Kandy (Central Province)
                </h3>
              </div>
            </div>

            <div className="p-6">
              {/* Language Fallback Chips */}
              <div className="flex flex-col sm:flex-row gap-2 mb-6">
                <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 font-sans" style={{ fontFamily: 'sans-serif' }}>
                  මහනුවර ප්‍රාදේශීය විදුලි සංදේශ කාර්යාලය
                </div>
                <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 font-sans" style={{ fontFamily: 'sans-serif' }}>
                  கண்டி பிராந்திய தொலைத்தொடர்பு அலுவலகம்
                </div>
              </div>

              {/* Action Bar */}
              <div className="flex items-center justify-between p-4 bg-[#f8fafc] border border-slate-200 rounded-xl mb-6">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Direct Hotline</p>
                  <p className="text-3xl font-bold tabular-nums text-slate-900">081 2 233 233</p>
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 hover:text-[#005696] hover:border-[#005696] transition-all flex items-center gap-2 shadow-sm" title="Copy Number">
                    <Copy className="w-4 h-4" />
                    Copy
                  </button>
                  <button className="px-5 py-3 bg-[#005696] text-white rounded-xl text-sm font-semibold hover:bg-[#00407a] transition-colors flex items-center gap-2 shadow-sm">
                    <PhoneCall className="w-4 h-4" />
                    Quick Dial
                  </button>
                </div>
              </div>

              {/* Secondary Info Accordion */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <button 
                  onClick={() => setAccordionOpen(!accordionOpen)}
                  className="w-full px-4 py-3 bg-slate-50 flex items-center justify-between text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Info className="w-4 h-4 text-[#005696]" />
                    Additional Information & Routing
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${accordionOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {accordionOpen && (
                  <div className="p-4 bg-white border-t border-slate-200 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1 text-sm">
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Working Hours</p>
                        <div className="flex items-start gap-2 text-slate-700 font-medium">
                          <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                          <span>08:30 AM - 05:00 PM</span>
                        </div>
                        <p className="text-xs text-slate-500 ml-6">(Lunch Break: 12:30 PM - 01:00 PM)</p>
                      </div>
                      
                      <div className="space-y-1 text-sm">
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Physical Address</p>
                        <div className="flex items-start gap-2 text-slate-700 font-medium">
                          <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                          <span>No 7, Yatinuwara Veediya,<br/>Kandy 20000</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-3 mt-3 border-t border-slate-100">
                      <div className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                        <Building2 className="w-4 h-4 text-slate-400" />
                        Escalation Tier: <span className="font-bold text-slate-900">Tier 2 (Regional Support)</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Sidebar: Escalation Drawer */}
        <div className="w-full lg:w-[400px] shrink-0 h-full flex flex-col">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full overflow-hidden">
            <div className="p-5 border-b border-slate-200 bg-slate-50/50">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileWarning className="w-5 h-5 text-rose-600" />
                Manual Escalation
              </h2>
              <p className="text-xs text-slate-500 mt-1">Log notes or route this query if the provided information is insufficient.</p>
            </div>
            
            <div className="p-5 flex-1 overflow-y-auto">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Officer Notes for Manual Verification
                  </label>
                  <textarea 
                    className="w-full h-32 p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#005696]/20 focus:border-[#005696] resize-none"
                    placeholder="E.g., Customer is asking for a specific officer in the billing department whose number is not listed..."
                  ></textarea>
                </div>
                
                <div className="bg-rose-50 border border-rose-100 rounded-xl p-4">
                  <h4 className="text-sm font-bold text-rose-900 mb-1">Feedback Loop</h4>
                  <p className="text-xs text-rose-700 mb-3">If you notice this record is consistently failing or outdated, flag it for the DB Admin.</p>
                  <button className="text-sm font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1.5 transition-colors">
                    <Flag className="w-4 h-4" />
                    Report Outdated Number
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-5 border-t border-slate-200 bg-slate-50/50 space-y-3">
              <button className="w-full py-3 bg-[#005696] text-white rounded-xl text-sm font-bold hover:bg-[#00407a] transition-colors shadow-sm flex items-center justify-center gap-2">
                <Send className="w-4 h-4" />
                Route to Level-2 Support
              </button>
              <Link href="/dashboard" className="w-full py-3 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors shadow-sm flex items-center justify-center">
                Cancel / Return to Search
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
