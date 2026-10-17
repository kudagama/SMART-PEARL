"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, Lock, User, ArrowRight, ShieldCheck, Fingerprint } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [agentId, setAgentId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen w-full flex bg-[#F8FAFC]">
      
      {/* Left Panel - Branding & Visuals (Hidden on small screens) */}
      <div className="hidden lg:flex flex-col relative w-1/2 bg-gradient-to-br from-[#005696] to-[#002f54] text-white p-12 overflow-hidden shadow-2xl z-10">
        {/* Decorative background shapes */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#00A3E0]/20 rounded-full blur-3xl mix-blend-screen pointer-events-none"></div>
        <div className="absolute bottom-12 right-12 w-[30rem] h-[30rem] bg-cyan-400/10 rounded-full blur-3xl mix-blend-screen pointer-events-none"></div>
        
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 mb-auto"
        >
          <div className="flex items-center gap-4 mb-16">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-[#005696] font-black text-xl tracking-tighter shadow-lg shadow-black/20">
              SLT
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Smart PEARL</h1>
              <p className="text-sm text-cyan-200 font-medium">Enterprise Copilot</p>
            </div>
          </div>

          <div className="space-y-6 max-w-md">
            <h2 className="text-4xl lg:text-5xl font-black leading-tight tracking-tight">
              Empowering <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-[#00A3E0]">Contact Center</span> Excellence.
            </h2>
            <p className="text-lg text-blue-100/80 leading-relaxed font-medium">
              Access the AI-powered directory with sub-second retrieval, trilingual natural language support, and intelligent contextual routing.
            </p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="relative z-10 mt-auto pt-12 flex items-center gap-6 border-t border-white/10"
        >
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            <span className="text-sm font-semibold text-blue-100">End-to-End Encrypted</span>
          </div>
          <div className="w-px h-6 bg-white/20"></div>
          <div className="flex items-center gap-3">
            <Building2 className="w-6 h-6 text-cyan-400" />
            <span className="text-sm font-semibold text-blue-100">Internal Network Only</span>
          </div>
        </motion.div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-24 relative overflow-hidden">
        {/* Mobile-only background blur */}
        <div className="lg:hidden absolute top-0 right-0 w-64 h-64 bg-[#00A3E0]/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="flex lg:hidden items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-[#005696] rounded-xl flex items-center justify-center text-white font-black text-lg tracking-tighter shadow-md">
              SLT
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Smart PEARL</h1>
            </div>
          </div>

          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Welcome back</h2>
            <p className="text-slate-500 font-medium">Please enter your credentials to access the system.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Agent ID / Employee Number</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400 group-focus-within:text-[#005696] transition-colors" />
                </div>
                <input
                  type="text"
                  value={agentId}
                  onChange={(e) => setAgentId(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#005696]/20 focus:border-[#005696] transition-all shadow-sm font-medium text-slate-800 placeholder-slate-400"
                  placeholder="e.g. 8492-SLT"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-bold text-slate-700">Password</label>
                <a href="#" className="text-xs font-bold text-[#00A3E0] hover:text-[#005696] transition-colors">Forgot password?</a>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-[#005696] transition-colors" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#005696]/20 focus:border-[#005696] transition-all shadow-sm font-medium text-slate-800 placeholder-slate-400"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-gradient-to-r from-[#005696] to-[#006bb3] text-white rounded-xl font-bold text-base shadow-[0_8px_20px_rgba(0,86,150,0.2)] hover:shadow-[0_10px_25px_rgba(0,86,150,0.3)] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group active:scale-[0.98]"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  Sign in to Dashboard <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-slate-200"></div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Or continue with</span>
            <div className="flex-1 h-px bg-slate-200"></div>
          </div>

          <button className="w-full mt-8 py-3.5 bg-white border border-slate-200/80 text-slate-700 rounded-xl font-bold text-sm shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-3 active:scale-[0.98]">
            <Fingerprint className="w-5 h-5 text-[#005696]" />
            SLT Single Sign-On (SSO)
          </button>

          <p className="mt-12 text-center text-xs text-slate-500 font-medium">
            By signing in, you agree to the Sri Lanka Telecom<br/>
            <a href="#" className="text-[#005696] hover:underline font-bold">Acceptable Use Policy</a> and <a href="#" className="text-[#005696] hover:underline font-bold">Privacy Guidelines</a>.
          </p>

          <div className="mt-8 text-center">
            <Link href="/admin" className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-400 hover:text-[#005696] transition-colors">
              <ShieldCheck className="w-4 h-4" /> Admin Login
            </Link>
          </div>
        </motion.div>
      </div>

    </div>
  );
}
