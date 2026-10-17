"use client";

import React, { useState } from 'react';
import { Search, Activity, User, Calendar, BarChart3, TrendingUp, AlertTriangle, PhoneCall, Star, FileText, CheckCircle2, Lock, Shield, Bell, LogOut, ShieldCheck, Zap, ArrowRight, Fingerprint, Database, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);

  const [serviceId, setServiceId] = useState('');
  const [date, setDate] = useState('2026-09-28');
  const [reportVisible, setReportVisible] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin123') {
      setIsAuthenticated(true);
      setLoginError(false);
    } else {
      setLoginError(true);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setReportVisible(false);
    setServiceId('');
  };

  if (!isAuthenticated) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 bg-[#0B1120] text-slate-200 min-h-screen w-full relative overflow-hidden">
        {/* Ambient Backgrounds */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="w-full max-w-md bg-[#162032]/80 backdrop-blur-xl rounded-3xl p-8 border border-white/5 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden z-10">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500 bg-[length:200%_100%] animate-gradient"></div>
          <div className="flex flex-col items-center mb-10">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center mb-5 border border-white/10 shadow-inner">
              <Shield className="w-10 h-10 text-cyan-400" />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">Admin Portal</h1>
            <p className="text-sm text-slate-400 font-medium mt-1">Smart PEARL Security Gateway</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Username</label>
              <div className="relative">
                <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full pl-12 pr-4 py-3.5 bg-[#0B1120] border border-slate-700/50 rounded-xl text-white focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all font-medium" placeholder="Enter username" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full pl-12 pr-4 py-3.5 bg-[#0B1120] border border-slate-700/50 rounded-xl text-white focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all font-medium" placeholder="Enter password" />
              </div>
            </div>
            {loginError && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg flex items-center gap-2 text-rose-400 text-sm font-medium">
                <AlertTriangle className="w-4 h-4 shrink-0" /> Invalid credentials. Please try again.
              </motion.div>
            )}
            <button type="submit" className="w-full py-4 mt-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold rounded-xl shadow-[0_10px_30px_rgba(8,145,178,0.3)] transition-all flex items-center justify-center gap-2 group active:scale-[0.98]">
              Authenticate <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
          
          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-cyan-400 transition-colors">
              <Fingerprint className="w-4 h-4" /> Return to Agent Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleSearch = () => {
    if (!serviceId) return;
    setIsSearching(true);
    // Simulate API call
    setTimeout(() => {
      setIsSearching(false);
      setReportVisible(true);
    }, 1200);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#0B1120] min-h-screen text-slate-200 font-sans selection:bg-cyan-500/30">
      
      {/* Top Header Navigation */}
      <header className="sticky top-0 z-50 bg-[#0B1120]/80 backdrop-blur-xl border-b border-white/5 shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.4)]">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                Smart PEARL <span className="px-2 py-0.5 rounded text-[10px] uppercase tracking-widest bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">Admin</span>
              </h1>
              <p className="text-xs text-slate-400 font-medium tracking-wide">Enterprise Operations Console</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-4 border-r border-white/10 pr-6">
              <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-[#0B1120]"></span>
              </button>
              <button className="p-2 text-slate-400 hover:text-white transition-colors">
                <Database className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-white">System Admin</p>
                <p className="text-xs text-cyan-400 font-medium">L3 Clearance</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#162032] border border-white/10 flex items-center justify-center">
                <User className="w-5 h-5 text-slate-300" />
              </div>
              <button onClick={handleLogout} className="ml-2 p-2 text-slate-500 hover:text-rose-400 transition-colors" title="Logout">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-6 lg:p-10 relative">
        {/* Glowing Orbs */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-600/5 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto space-y-10 relative z-10">
          
          {/* Dashboard Title */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-black text-white tracking-tight">Agent Evaluation Audit</h2>
              <p className="text-sm text-slate-400 mt-2 max-w-xl leading-relaxed">Search for an agent to view their daily AI evaluation report, KPI metrics, and behavioral insights generated by the Neural Core.</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-xs font-bold tracking-widest uppercase">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Systems Online
            </div>
          </div>

          {/* Search Command Center */}
          <div className="bg-[#162032]/80 backdrop-blur-xl rounded-3xl p-8 border border-white/5 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-cyan-400"></div>
            
            <div className="flex flex-col md:flex-row gap-6 items-end">
              <div className="flex-1 w-full">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Agent Service ID</label>
                <div className="relative group">
                  <User className="absolute left-4 top-4 w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                  <input 
                    type="text" 
                    placeholder="e.g. AGT-1024"
                    value={serviceId}
                    onChange={(e) => setServiceId(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-[#0B1120] border border-slate-700/50 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all text-lg font-medium shadow-inner"
                  />
                </div>
              </div>
              
              <div className="w-full md:w-64 shrink-0">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Select Date</label>
                <div className="relative group">
                  <Calendar className="absolute left-4 top-4 w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                  <input 
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-[#0B1120] border border-slate-700/50 rounded-2xl text-white focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all text-sm font-medium shadow-inner cursor-pointer"
                  />
                </div>
              </div>

              <button 
                onClick={handleSearch}
                disabled={!serviceId || isSearching}
                className="w-full md:w-auto px-10 py-4 bg-white text-slate-900 hover:bg-slate-200 disabled:opacity-50 disabled:bg-white/10 disabled:text-white font-black rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-all flex items-center justify-center gap-3 shrink-0 active:scale-95"
              >
                {isSearching ? (
                  <><div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div> processing</>
                ) : (
                  <><Search className="w-5 h-5" /> Generate Report</>
                )}
              </button>
            </div>
          </div>

          {/* Report View */}
          <AnimatePresence>
            {reportVisible && (
              <motion.div 
                initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.5, type: "spring", bounce: 0.2 }}
                className="space-y-8"
              >
                {/* Profile Banner */}
                <div className="bg-gradient-to-r from-blue-900/40 to-[#162032] rounded-3xl p-8 border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
                  <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
                  
                  <div className="flex items-center gap-6 z-10">
                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-white/10 flex items-center justify-center shrink-0 shadow-xl relative overflow-hidden">
                      <div className="absolute inset-0 bg-blue-500/10 animate-pulse"></div>
                      <User className="w-10 h-10 text-slate-400 relative z-10" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-3xl font-black text-white tracking-tight">{serviceId === 'AGT-1024' ? 'Gehan Jayawardana' : 'Agent ' + serviceId}</h2>
                        <span className="px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider">Top Performer</span>
                      </div>
                      <p className="text-sm font-medium text-slate-400 flex items-center gap-2">
                        <User className="w-4 h-4" /> Service ID: {serviceId} <span className="w-1 h-1 rounded-full bg-slate-600"></span> Inbound Support Team
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 z-10 bg-[#0B1120] p-4 rounded-2xl border border-white/5 shadow-inner">
                    <div className="text-right">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">AI Confidence Score</p>
                      <p className="text-2xl font-black text-cyan-400">98.5%</p>
                    </div>
                    <div className="w-12 h-12 rounded-full border-4 border-cyan-500/30 border-t-cyan-400 flex items-center justify-center shrink-0">
                      <Cpu className="w-5 h-5 text-cyan-400" />
                    </div>
                  </div>
                </div>

                {/* KPI Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { label: "Avg Quality Score", value: "90%", icon: BarChart3, colorClass: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
                    { label: "Total Handled Calls", value: "45", icon: PhoneCall, colorClass: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
                    { label: "Customer Sentiment", value: "Excellent", icon: Star, colorClass: "bg-amber-500/10 text-amber-400 border-amber-500/20" }
                  ].map((kpi, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * idx }}
                      className="bg-[#162032]/80 backdrop-blur-md rounded-3xl p-6 border border-white/5 shadow-xl flex items-center gap-5 hover:bg-[#1e2b42] transition-colors"
                    >
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border shadow-inner ${kpi.colorClass}`}>
                        <kpi.icon className="w-7 h-7" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">{kpi.label}</p>
                        <div className="text-3xl font-black text-white tracking-tight">{kpi.value}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* AI Analysis Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Strengths */}
                  <div className="bg-[#162032]/80 backdrop-blur-md rounded-3xl p-8 border border-emerald-500/20 shadow-[0_0_40px_rgba(16,185,129,0.05)] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-bl-full transition-transform group-hover:scale-110"></div>
                    <h3 className="text-lg font-black text-white flex items-center gap-3 mb-8 tracking-tight">
                      <div className="p-2 bg-emerald-500/20 rounded-lg"><TrendingUp className="w-5 h-5 text-emerald-400" /></div>
                      Key Strengths & Wins
                    </h3>
                    <ul className="space-y-5 relative z-10">
                      {[
                        "Consistently followed the standard SLTMobitel greeting on 100% of calls.",
                        "Excellent cross-selling of Home Plus packages during Fibre inquiries.",
                        "Kept average hold times under 30 seconds."
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-4 text-slate-300 font-medium">
                          <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                          <span className="pt-0.5 leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Weaknesses */}
                  <div className="bg-[#162032]/80 backdrop-blur-md rounded-3xl p-8 border border-rose-500/20 shadow-[0_0_40px_rgba(244,63,94,0.05)] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-bl-full transition-transform group-hover:scale-110"></div>
                    <h3 className="text-lg font-black text-white flex items-center gap-3 mb-8 tracking-tight">
                      <div className="p-2 bg-rose-500/20 rounded-lg"><AlertTriangle className="w-5 h-5 text-rose-400" /></div>
                      Areas for Improvement
                    </h3>
                    <ul className="space-y-4 relative z-10">
                      <li className="flex items-start gap-4 text-slate-300 font-medium bg-[#0B1120] p-5 rounded-2xl border border-rose-500/10 shadow-inner">
                        <span className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 font-black text-sm">1</span>
                        <div>
                          <strong className="text-rose-100 block mb-1 text-sm uppercase tracking-wider">Data Collection Flags (x3):</strong>
                          <span className="text-slate-400 text-sm">Missed asking for the exact street address during new connection feasibility checks.</span>
                        </div>
                      </li>
                      <li className="flex items-start gap-4 text-slate-300 font-medium bg-[#0B1120] p-5 rounded-2xl border border-amber-500/10 shadow-inner">
                        <span className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 font-black text-sm">2</span>
                        <div>
                          <strong className="text-amber-100 block mb-1 text-sm uppercase tracking-wider">Transfer Protocol (x1):</strong>
                          <span className="text-slate-400 text-sm">Forgot to offer warm transfer to Kandy branch and only provided the number.</span>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
