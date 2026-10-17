"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Bot, Sparkles, AlertCircle, AlertTriangle, Phone, Copy, Check, CheckCircle2, MapPin, X, MessageSquare, Flag, ExternalLink, Mic, MicOff, Wrench, Target, Send, BookOpen, ArrowRight, Languages } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { normalizeTelecomSpeech } from '@/lib/telecomVoiceNormalizer';
import { KnowledgeHubSop, SopStep } from '@/lib/knowledgeHubSops';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  match?: any;
  confidence?: number;
  triage?: {
    target_workgroup: string;
    action_type: string;
    routing_reason: string;
    operational_advice: string;
    rule: { code: string; name: string };
    asset_type: string;
    knowledge_article?: KnowledgeHubSop | {
      id?: string;
      title: string;
      url: string;
      summary: string;
      badge?: string;
      key_decision?: string;
      steps?: SopStep[];
      tt_template?: string;
    };
  };
};


export default function CopilotChat() {
  const [isOpen, setIsOpen] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I am your AI Copilot. Ask me to find any SLT contact or get details about SLT products in natural language (English, Sinhala, or Tamil).'
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceLang, setVoiceLang] = useState<'en-US' | 'si-LK'>('en-US');
  const [copiedTtId, setCopiedTtId] = useState<string | null>(null);

  const copyTtToClipboard = (text: string, id: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedTtId(id);
      setTimeout(() => setCopiedTtId(null), 2500);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Your browser does not support voice search. Please try Google Chrome.');
      return;
    }

    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = voiceLang;

    recognition.onstart = () => {
      setIsListening(true);
      setInput("");
    };

    recognition.onresult = (event: any) => {
      let fullTranscript = '';
      for (let i = 0; i < event.results.length; ++i) {
        fullTranscript += event.results[i][0].transcript + ' ';
      }
      const normalized = normalizeTelecomSpeech(fullTranscript, voiceLang);
      setInput(normalized);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognition.start();
  };
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = { id: Date.now().toString(), role: 'user' as const, content: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    const lower = userMsg.content.toLowerCase();
    const isFaultQuery =
      lower.includes('voice') ||
      lower.includes('phone') ||
      lower.includes('dial tone') ||
      lower.includes('los') ||
      lower.includes('red') ||
      lower.includes('ping') ||
      lower.includes('lag') ||
      lower.includes('speed') ||
      lower.includes('slow') ||
      lower.includes('reload') ||
      lower.includes('router') ||
      lower.includes('stb') ||
      lower.includes('pon') ||
      lower.includes('wada na') ||
      lower.includes('dead') ||
      lower.includes('unlimited') ||
      lower.includes('blink') ||
      lower.includes('blinking') ||
      lower.includes('indicator') ||
      lower.includes('light') ||
      lower.includes('led') ||
      lower.includes('wifi') ||
      lower.includes('wi-fi') ||
      lower.includes('wlan') ||
      lower.includes('extra gb') ||
      lower.includes('ogb') ||
      lower.includes('ihub') ||
      lower.includes('i-hub') ||
      lower.includes('ldap') ||
      lower.includes('proxy');

    if (isFaultQuery) {
      try {
        const triageRes = await fetch('/api/copilot/voice-triage', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ transcript: userMsg.content, customerPhone: '0112445566' })
        });
        const triageData = await triageRes.json();
        if (triageData.success) {
          const assistantMsg: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: `Identified Fault: ${triageData.rule.name}. Designated Support Group: ${triageData.triage.target_workgroup}.`,
            confidence: 98,
            triage: {
              target_workgroup: triageData.triage.target_workgroup,
              action_type: triageData.triage.action_type,
              routing_reason: triageData.triage.routing_reason,
              operational_advice: triageData.triage.operational_advice,
              rule: triageData.rule,
              asset_type: triageData.asset_type,
              knowledge_article: triageData.knowledge_article
            }
          };
          setMessages(prev => [...prev, assistantMsg]);
          setIsLoading(false);
          return;
        }
      } catch (err) {
        console.warn('Voice triage check failed, continuing to directory search', err);
      }
    }

    try {
      const res = await fetch('/api/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: userMsg.content })
      });
      
      const data = await res.json();
      
      const assistantMsg = {
        id: (Date.now() + 1).toString(),
        role: 'assistant' as const,
        content: data.summary,
        match: data.match,
        confidence: data.confidence
      };
      
      setMessages(prev => [...prev, assistantMsg]);
    } catch (error) {
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: "An error occurred connecting to the AI Copilot." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[50vh] lg:h-full bg-gradient-to-b from-slate-50/60 to-slate-100/40 border-b lg:border-b-0 lg:border-r border-slate-200/60 w-full lg:w-[400px] xl:w-[460px] shrink-0 overflow-hidden relative z-20 shadow-[1px_0_15px_rgba(0,0,0,0.02)]">
      
      <div className="px-6 py-5 border-b border-slate-200/60 bg-white/80 backdrop-blur-md flex items-center justify-between z-10 sticky top-0">
        <h2 className="text-sm font-extrabold text-slate-800 flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100/50 flex items-center justify-center border border-blue-200/50 shadow-sm">
            <Bot className="w-4 h-4 text-[#005696]" />
          </div>
          Agent AI Copilot
        </h2>
        <span className="text-[10px] bg-gradient-to-r from-emerald-50 to-emerald-100/50 text-emerald-700 border border-emerald-200/50 px-2.5 py-1 rounded-full font-bold flex items-center gap-1.5 shadow-sm">
          <Sparkles className="w-3 h-3 text-emerald-500" />
          Live Voice & Fault Triage
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-7 relative">
        {messages.map((msg) => (
          msg.role === 'user' ? (
            <div key={msg.id} className="flex flex-col items-end">
              <div className="bg-gradient-to-br from-[#005696] to-[#006bb3] text-white px-5 py-3.5 rounded-2xl rounded-tr-sm max-w-[90%] text-sm shadow-[0_8px_20px_rgba(0,86,150,0.15)] font-medium leading-relaxed">
                {msg.content}
              </div>
            </div>
          ) : (
            <motion.div 
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-start"
            >
              <div className="bg-white/95 backdrop-blur-sm border border-slate-200/70 text-slate-800 p-1.5 rounded-2xl rounded-tl-sm max-w-[95%] shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                {msg.match && (
                  <div className="px-4 py-2.5 flex items-center gap-2 border-b border-slate-100/80 bg-slate-50/50 rounded-t-xl">
                    <span className="bg-emerald-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                      <CheckCircle2 className="w-3.5 h-3.5" /> {msg.confidence}% Match
                    </span>
                    <span className="text-[11px] text-slate-400 font-semibold truncate">{msg.match.name}</span>
                  </div>
                )}

                <div className="p-4 space-y-3">
                  <p className="text-sm font-medium text-slate-700 leading-relaxed">
                    {msg.content}
                  </p>

                  {/* Telecom Fault & Workgroup Triage Card in Copilot */}
                  {msg.triage && (
                    <div className="p-4 rounded-xl bg-gradient-to-br from-blue-950 via-indigo-900 to-slate-900 text-white shadow-md border border-cyan-500/30 space-y-2.5">
                      <div className="flex items-center justify-between text-[10px] font-bold">
                        <span className="text-cyan-300 uppercase tracking-widest flex items-center gap-1">
                          <Target className="w-3.5 h-3.5 text-cyan-400" /> Target Support Group
                        </span>
                        <span className="px-2 py-0.5 rounded bg-white/20 text-white font-mono">
                          {msg.triage.action_type}
                        </span>
                      </div>
                      <p className="text-xl font-black text-white flex items-center gap-2">
                        <Wrench className="w-5 h-5 text-cyan-400" /> {msg.triage.target_workgroup}
                      </p>
                      <p className="text-xs text-white/90 leading-snug">{msg.triage.routing_reason}</p>
                      {msg.triage.operational_advice && (
                        <div className="p-2.5 bg-black/30 rounded-lg text-xs text-amber-200 border border-amber-500/30">
                          {msg.triage.operational_advice}
                        </div>
                      )}
                      {msg.triage.knowledge_article && (
                        <div className="mt-3 pt-3 border-t border-cyan-500/30 space-y-3">
                          {/* Knowledge Hub Header */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
                                <BookOpen className="w-3.5 h-3.5" />
                              </div>
                              <div>
                                <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-300 block">
                                  Knowledge Hub Resolution SOP
                                </span>
                                <h4 className="text-xs font-bold text-white leading-tight">
                                  {msg.triage.knowledge_article.title}
                                </h4>
                              </div>
                            </div>
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-400/20 text-cyan-300 border border-cyan-400/30 font-semibold shrink-0">
                              {msg.triage.knowledge_article.badge || 'SOP Steps'}
                            </span>
                          </div>

                          {/* 1-Click Fast Action Button at Top for Quick Complaint Logging */}
                          {'tt_template' in msg.triage.knowledge_article && msg.triage.knowledge_article.tt_template && (
                            <button
                              type="button"
                              onClick={() => copyTtToClipboard((msg.triage!.knowledge_article as any).tt_template, msg.id)}
                              className={`w-full py-2.5 px-3 rounded-lg text-xs font-black flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 ${
                                copiedTtId === msg.id
                                  ? 'bg-emerald-500 text-white'
                                  : 'bg-gradient-to-r from-cyan-400 via-cyan-300 to-sky-400 hover:from-cyan-300 hover:to-sky-300 text-slate-950'
                              }`}
                            >
                              {copiedTtId === msg.id ? (
                                <>
                                  <Check className="w-4 h-4 text-white" />
                                  <span>Copied TT Draft! Paste in CRM (Clarity)</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-4 h-4 text-slate-950" />
                                  <span>Copy Trouble Ticket Draft ({msg.triage.target_workgroup})</span>
                                </>
                              )}
                            </button>
                          )}

                          {/* Key Decision Callout - Quick Glance */}
                          {'key_decision' in msg.triage.knowledge_article && msg.triage.knowledge_article.key_decision && (
                            <div className="p-2.5 rounded-lg bg-amber-500/15 border border-amber-400/40 text-amber-200 text-xs leading-relaxed space-y-1">
                              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-300">
                                <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                Quick Decision Rules
                              </div>
                              <p className="text-[11px] text-amber-100/95 font-medium leading-snug">
                                {msg.triage.knowledge_article.key_decision}
                              </p>
                            </div>
                          )}

                          {/* Simplified Step-by-Step SOP Checklist */}
                          {'steps' in msg.triage.knowledge_article && msg.triage.knowledge_article.steps && msg.triage.knowledge_article.steps.length > 0 && (
                            <div className="space-y-1.5">
                              <div className="text-[10px] uppercase font-bold tracking-wider text-cyan-300 flex items-center justify-between">
                                <span>Agent Troubleshooting Steps (Quick Checklist)</span>
                                <span className="text-white/60 text-[9px] font-normal">Execute 1 to {msg.triage.knowledge_article.steps.length}</span>
                              </div>

                              <div className="space-y-1.5">
                                {msg.triage.knowledge_article.steps.map((st) => (
                                  <div 
                                    key={st.step}
                                    className="p-2 rounded-lg bg-slate-900/90 border border-white/10 hover:border-cyan-400/40 transition-all text-xs flex items-start gap-2.5"
                                  >
                                    <span className="w-5 h-5 rounded-full bg-cyan-500 text-slate-950 font-black text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                                      {st.step}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center justify-between gap-1">
                                        <span className="font-bold text-white text-[11px]">
                                          {st.title}
                                        </span>
                                        {st.outcome_group && (
                                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 font-mono font-bold shrink-0">
                                            {st.outcome_group}
                                          </span>
                                        )}
                                      </div>
                                      <p className="text-[11px] text-slate-200 leading-normal mt-0.5">
                                        {st.action}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Trouble Ticket Draft Preview Box */}
                          {'tt_template' in msg.triage.knowledge_article && msg.triage.knowledge_article.tt_template && (
                            <div className="p-2 rounded-lg bg-black/50 border border-white/10 space-y-1">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                                Ticket Draft Preview
                              </span>
                              <pre className="text-[10px] font-mono text-cyan-200/90 whitespace-pre-wrap leading-tight bg-black/60 p-2 rounded max-h-20 overflow-y-auto">
                                {(msg.triage.knowledge_article as any).tt_template}
                              </pre>
                            </div>
                          )}

                          {/* Secondary Link to Knowledge Hub SVG Flowchart */}
                          <Link
                            href={msg.triage.knowledge_article.url}
                            className="p-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 text-cyan-300 flex items-center justify-between group transition-all text-[11px]"
                          >
                            <span className="flex items-center gap-1.5">
                              <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                              <span>View full visual decision flowchart in Knowledge Hub</span>
                            </span>
                            <ArrowRight className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-x-1 transition-transform" />
                          </Link>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {msg.match && (
                    <div className="mt-5 space-y-2.5">
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl mb-4">
                         <p className="text-xs text-slate-500 font-semibold mb-1">Direct Hotline</p>
                         <p className="text-xl font-bold tabular-nums text-[#005696]">{msg.match.hotline}</p>
                      </div>

                      <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-rose-600 bg-rose-50/50 hover:bg-rose-50 border border-rose-100 rounded-xl transition-all hover:shadow-sm active:scale-95">
                        <Flag className="w-4 h-4" />
                        Report Outdated Number
                      </button>
                      
                      <Link href="/escalation" className="w-full flex items-center justify-between gap-2 px-4 py-2.5 text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-xl transition-all hover:shadow-sm active:scale-95 group">
                        <span className="flex items-center gap-2">
                          <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                          Transfer to Level-2 Support
                        </span>
                        <span className="text-[10px] bg-white border border-slate-200 text-slate-500 px-2 py-0.5 rounded shadow-sm font-mono font-bold group-hover:border-slate-300">L2</span>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 text-slate-400 text-xs font-medium px-2">
            <Bot className="w-4 h-4 animate-pulse" />
            Copilot is thinking...
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <div className="p-3.5 border-t border-slate-200 bg-white space-y-2">
        {/* Voice Language Selector Bar */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500">
            <Languages className="w-3.5 h-3.5 text-[#005696]" />
            <span>Voice Mode:</span>
          </div>
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              type="button"
              onClick={() => setVoiceLang('en-US')}
              className={`px-2.5 py-0.5 rounded text-[10px] font-bold transition-all ${
                voiceLang === 'en-US'
                  ? 'bg-[#005696] text-white shadow-xs'
                  : 'text-slate-600 hover:text-black'
              }`}
              title="Speak in English or Singlish (Auto-normalizes telecom terms)"
            >
              🌐 English / Singlish
            </button>
            <button
              type="button"
              onClick={() => setVoiceLang('si-LK')}
              className={`px-2.5 py-0.5 rounded text-[10px] font-bold transition-all ${
                voiceLang === 'si-LK'
                  ? 'bg-[#005696] text-white shadow-xs'
                  : 'text-slate-600 hover:text-black'
              }`}
              title="සිංහල භාෂාවෙන් කතා කරන්න"
            >
              🇱🇰 සිංහල
            </button>
          </div>
        </div>

        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-3 pr-20 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#005696]/20 focus:border-[#005696] resize-none h-12 transition-all"
            placeholder={isListening ? "Listening to your voice..." : "Type or speak your fault query..."}
          ></textarea>
          
          <div className="absolute right-2 top-2 flex items-center gap-1.5">
            <button
              type="button"
              onClick={toggleListening}
              className={`p-1.5 rounded-md transition-colors ${
                isListening
                  ? 'bg-rose-500 text-white animate-pulse ring-2 ring-rose-300'
                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
              }`}
              title={isListening ? 'Listening... click to stop' : 'Click to speak with voice'}
            >
              {isListening ? <MicOff className="w-4 h-4 text-white" /> : <Mic className="w-4 h-4" />}
            </button>
            <button 
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="p-1.5 bg-[#005696] text-white rounded-md hover:bg-[#00407a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Sparkles className="w-4 h-4" />
            </button>
          </div>
        </div>
        <p className="text-[10px] text-slate-400 text-center mt-2">
          Voice & Fault Triage powered by Gemini & SLT Rules. Always verify critical escalations.
        </p>
      </div>
    </div>
  );
}
