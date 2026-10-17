"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, PhoneOff, User, Bot, Zap, Wifi, CheckCircle2, AlertCircle, Play, Pause, Activity, ShieldAlert, Cpu, X, Star, TrendingUp, AlertTriangle, Target, PhoneCall, Mic, MicOff, Volume2, Sparkles, Send, Check, Copy, ArrowRight, ShieldCheck, Wrench, CreditCard, Radio, Award, BookOpen } from 'lucide-react';
import { evaluateCallQuality, QualityStandardResult, OFFICIAL_SLT_STANDARDS } from '@/lib/qualityStandards';

type TranscriptMessage = {
  id: string;
  speaker: 'customer' | 'agent';
  text: string;
};

type CopilotSuggestion = {
  id: string;
  type: 'product' | 'action' | 'intent';
  title: string;
  content: React.ReactNode;
};

const sinhalaCallScript = [
  { delay: 1000, speaker: 'agent', text: 'ආයුබෝවන්! මම හිමාලි, මට පුළුවනි ඔබට සහය වන්න.' },
  { delay: 4000, speaker: 'customer', text: 'මට Kandy Bank of Ceylon ශාඛාවේ අංකය දැනගන්න පුළුවන්ද?' },
  { delay: 9000, speaker: 'agent', text: 'කරුණාකර රැඳී ඉන්න සර්/ මැඩම්.' },
  { delay: 13000, speaker: 'agent', text: 'රැඳීසිටියාට ස්තූතියි. අංකය 081 222 2222. වෙනත් යමක් දැනගැනීමට අවශ්‍යද?' },
  { delay: 19000, speaker: 'customer', text: 'නෑ, එච්චරයි. ස්තූතියි.' },
  { delay: 22000, speaker: 'agent', text: 'මා ලබාදුන් සේවය ඇගයීම සඳහා රැඳී සිටින්න. SLT Mobitel ඇමතුවාට ස්තූතියි. සුභ දවසක්!' }
];

const englishCallScript = [
  { delay: 1000, speaker: 'agent', text: 'Ayubowan! I am Himali. How may I help you?' },
  { delay: 4000, speaker: 'customer', text: 'Hello, I am looking to get a new unlimited broadband connection.' },
  { delay: 9000, speaker: 'agent', text: 'Please hold on Sir/Madam while I check the details.' },
  { delay: 13000, speaker: 'agent', text: 'Thank you for being on hold. The Unlimited Home plan is Rs. 5,900 and Home Plus is Rs. 9,900. Is there anything else I can help you with Sir/Madam?' },
  { delay: 19000, speaker: 'customer', text: 'No, that is all. Thanks!' },
  { delay: 22000, speaker: 'agent', text: 'Please hold on to rate my service. Thank you for calling SLT Mobitel. Have a nice day!' }
];

const tamilCallScript = [
  { delay: 1000, speaker: 'agent', text: 'வணக்கம் ! நான் ஹிமாலி , என்னால் எவ்வகையில் உதவ முடியும்?' },
  { delay: 4000, speaker: 'customer', text: 'நான் Kandy General Hospital இலக்கத்தை அறிய விரும்புகிறேன்.' },
  { delay: 9000, speaker: 'agent', text: 'தயவு செய்து அழைப்பில் காத்திருங்கள். Sir / Madam.' },
  { delay: 13000, speaker: 'agent', text: 'அழைப்பில் காத்திருந்தமைக்கு நன்றி. இலக்கம் 081 222 2222. வேறேதும் தெரிந்து கொள்ள இருக்கிறதா? Sir / Madam.' },
  { delay: 19000, speaker: 'customer', text: 'இல்லை, நன்றி.' },
  { delay: 22000, speaker: 'agent', text: 'இந்த அழைப்பை மதிப்பீடு செய்ய தயவு செய்து காத்திருங்கள். SLT Mobitel அழைத்தமைக்கு நன்றி இந்த நாள் இனிய நாளாக அமையட்டும்.' }
];

const incrementalDirScript = [
  { delay: 1000, speaker: 'agent', text: 'Ayubowan! I am Kasun. How may I help you?' },
  { delay: 4000, speaker: 'customer', text: 'I want the contact number for the Bank of Ceylon...' },
  { delay: 8000, speaker: 'customer', text: '...the Kandy branch, please.' },
  { delay: 11000, speaker: 'agent', text: 'Please hold on Sir/Madam while I check the details.' },
  { delay: 14000, speaker: 'agent', text: 'The number for BOC Kandy is 081 222 2222. Is there anything else?' },
  { delay: 18000, speaker: 'customer', text: 'No, that is all.' },
  { delay: 21000, speaker: 'agent', text: 'Thank you for calling SLT Mobitel. Have a nice day!' }
];

const fiberVoicePonOnScript = [
  { delay: 800, speaker: 'agent', text: 'ආයුබෝවන් SLT Telecom Support. මම කසුන්. ඔබට කෙසේද උදව් කල හැක්කේ?' },
  { delay: 3500, speaker: 'customer', text: 'මගේ Fiber telephone එකේ dial tone නෑ, call ගන්න බෑ. හැබැයි router එකේ PON light එක ON වෙලා තියෙන්නේ.' },
  { delay: 7500, speaker: 'agent', text: 'හරි සර්, optical signal එක සාමාන්‍යයි. Gemini Copilot එක මඟින් මේක MDF වෙත යොමු කෙරෙනවා.' }
];

const fiberVoicePonOffScript = [
  { delay: 800, speaker: 'agent', text: 'Ayubowan SLT Support Desk. How may I assist you?' },
  { delay: 3500, speaker: 'customer', text: 'Mage FTTH voice line eka dead, call ganna ba. Router eke baladdi PON light ekath OFF wela thiyenne.' },
  { delay: 7500, speaker: 'agent', text: 'Optical transmission fault detected. Routing Trouble Ticket directly to Area Maintenance.' }
];

const losRedScript = [
  { delay: 800, speaker: 'agent', text: 'SLT Technical Helpdesk. Himali speaking.' },
  { delay: 3500, speaker: 'customer', text: 'Router eke LOS red light eka blink wenawa, internet sampoornayenma naha! Fiber cable eka kadilada koheda.' },
  { delay: 7500, speaker: 'agent', text: 'Loss of optical signal verified. Running LDAP & GB Portal checks for immediate AREA-MTCE dispatch.' }
];

const highPingScript = [
  { delay: 800, speaker: 'agent', text: 'SLT Esports & Gaming Support desk.' },
  { delay: 3500, speaker: 'customer', text: 'Valorant play karaddi ping eka 185ms walata nagala godak lag wenawa. Peering spike ekakda?' },
  { delay: 7500, speaker: 'agent', text: 'Logging target game Valorant and 185ms latency for CEN-CSC-TECH IP routing engineers.' }
];

const unlimitedSlowScript = [
  { delay: 800, speaker: 'agent', text: 'SLT Broadband Operations desk.' },
  { delay: 3500, speaker: 'customer', text: 'Mage Unlimited broadband package eke speed eka 18 Mbps walata bahala, mara slow.' },
  { delay: 7500, speaker: 'agent', text: 'Measured speed is 18 Mbps (< 40 Mbps) and low pay bill policy verified. Direct TT to AREA-MTCE.' }
];

const foodCityReloadScript = [
  { delay: 800, speaker: 'agent', text: 'SLT Mobitel 4G Prepaid Reload Desk.' },
  { delay: 3500, speaker: 'customer', text: 'Food City counter eken Rs. 2,000 ka 4G prepaid reload ekak damma, thama account ekata awe na.' },
  { delay: 7500, speaker: 'agent', text: 'Logging BILL_SR_ONLY request and advising customer to contact Food City for payment reversal.' }
];

export default function DashboardPage() {
  const [callActive, setCallActive] = useState(false);
  const [activeCallType, setActiveCallType] = useState<'sinhala' | 'english' | 'tamil' | 'incremental' | 'fiberVoicePonOn' | 'fiberVoicePonOff' | 'losRed' | 'highPing' | 'unlimitedSlow' | 'foodCityReload' | null>(null);
  const [transcript, setTranscript] = useState<TranscriptMessage[]>([]);
  const [suggestions, setSuggestions] = useState<CopilotSuggestion[]>([]);
  const [callTimer, setCallTimer] = useState(0);
  const [showEvaluation, setShowEvaluation] = useState(false);
  
  // Live Voice & Gemini Triage State
  const [isMicListening, setIsMicListening] = useState(false);
  const [isAiTriaging, setIsAiTriaging] = useState(false);
  const [micTranscript, setMicTranscript] = useState('');
  const [liveMicText, setLiveMicText] = useState('');
  const [voiceLang, setVoiceLang] = useState<'en-US' | 'si-LK'>('en-US');
  const [dispatchedTicket, setDispatchedTicket] = useState<{ number: string; group: string; time: string } | null>(null);

  const transcriptRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const scriptTimers = useRef<NodeJS.Timeout[]>([]);
  const recognitionRef = useRef<any>(null);
  const isListeningActiveRef = useRef<boolean>(false);
  const liveMicTextRef = useRef<string>('');
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const voiceLangRef = useRef<'en-US' | 'si-LK'>('en-US');

  // SLT Quality Standards Compliance State
  const [qualityResult, setQualityResult] = useState<QualityStandardResult>(() => evaluateCallQuality([]));

  // Keep voiceLangRef in sync
  useEffect(() => {
    voiceLangRef.current = voiceLang;
  }, [voiceLang]);

  // Scroll to bottom of transcript whenever messages or live streaming text update
  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [transcript, liveMicText]);

  // Real-time SLT Call Quality Standards Evaluation
  useEffect(() => {
    const allItems = [...transcript];
    if (liveMicText) {
      allItems.push({ id: 'live-stream', speaker: 'agent', text: liveMicText });
    }
    if (allItems.length > 0) {
      const result = evaluateCallQuality(allItems);
      setQualityResult(result);
    } else {
      setQualityResult(evaluateCallQuality([]));
    }
  }, [transcript, liveMicText]);

  // Clean up speech recognition & timers on unmount
  useEffect(() => {
    return () => {
      isListeningActiveRef.current = false;
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
    };
  }, []);

  // Trigger Gemini Voice Triage API and inject Workgroup card into Live Copilot Feed
  const triggerVoiceTriage = async (spokenText: string) => {
    if (!spokenText || spokenText.trim().length === 0) return;
    setIsAiTriaging(true);

    try {
      const res = await fetch('/api/copilot/voice-triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript: spokenText,
          customerPhone: '0112445566'
        })
      });

      const data = await res.json();
      if (data.success) {
        renderFaultTriageCard(data);
      }
    } catch (err) {
      console.error('[Voice Triage Error]:', err);
    } finally {
      setIsAiTriaging(false);
    }
  };

  // Render high-impact Telecom Fault Triage & Workgroup Card
  const renderFaultTriageCard = (data: any) => {
    const { triage, rule, technical_context, billing_context, pre_check_flags, transcription, asset_type } = data;

    const groupStyles: Record<string, { bg: string; text: string; border: string; glow: string; badge: string }> = {
      'MDF': { bg: 'from-blue-950 via-cyan-900 to-slate-900', text: 'text-cyan-300', border: 'border-cyan-500/50', glow: 'shadow-cyan-500/20', badge: 'bg-cyan-400 text-cyan-950 font-black' },
      'AREA-MTCE': { bg: 'from-amber-950 via-orange-900 to-slate-900', text: 'text-amber-300', border: 'border-amber-500/50', glow: 'shadow-amber-500/20', badge: 'bg-amber-400 text-amber-950 font-black' },
      'INT-NW-SYS-ADMIN': { bg: 'from-indigo-950 via-blue-900 to-slate-900', text: 'text-indigo-300', border: 'border-indigo-500/50', glow: 'shadow-indigo-500/20', badge: 'bg-indigo-400 text-indigo-950 font-black' },
      'BSS-OPR-OCR': { bg: 'from-emerald-950 via-teal-900 to-slate-900', text: 'text-emerald-300', border: 'border-emerald-500/50', glow: 'shadow-emerald-500/20', badge: 'bg-emerald-400 text-emerald-950 font-black' },
      'CEN-CSC-TECH': { bg: 'from-purple-950 via-violet-900 to-slate-900', text: 'text-purple-300', border: 'border-purple-500/50', glow: 'shadow-purple-500/20', badge: 'bg-purple-400 text-purple-950 font-black' },
      'CEN-CSC-UI': { bg: 'from-rose-950 via-pink-900 to-slate-900', text: 'text-rose-300', border: 'border-rose-500/50', glow: 'shadow-rose-500/20', badge: 'bg-rose-400 text-rose-950 font-black' },
      'NONE': { bg: 'from-slate-900 via-gray-900 to-zinc-900', text: 'text-slate-300', border: 'border-slate-500/50', glow: 'shadow-slate-500/20', badge: 'bg-slate-300 text-slate-900 font-black' },
    };

    const style = groupStyles[triage.target_workgroup] || groupStyles['AREA-MTCE'];
    const generatedTicketNo = `${triage.action_type === 'DIRECT_TT' ? 'TT' : triage.action_type === 'BILL_SR_ONLY' ? 'SR' : 'CQ'}-20261017-${Math.floor(1000 + Math.random() * 9000)}`;

    const triageCard: CopilotSuggestion = {
      id: `triage-${Date.now()}`,
      type: 'intent',
      title: `Fault Triage: ${rule.name}`,
      content: (
        <div className="space-y-3.5">
          {/* Top Header Badge */}
          <div className="flex items-center justify-between text-[11px] font-bold">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              <Sparkles className="w-3 h-3 text-indigo-600 animate-pulse" /> Gemini Voice Triage
            </span>
            <span className="text-slate-400 font-mono text-[10px] uppercase font-bold tracking-wider">
              Asset: {asset_type}
            </span>
          </div>

          {/* TARGET WORKGROUP HERO BANNER */}
          <div className={`p-4 rounded-xl bg-gradient-to-br ${style.bg} border ${style.border} text-white shadow-lg ${style.glow} relative overflow-hidden`}>
            <div className="absolute top-0 right-0 w-28 h-28 bg-white/5 rounded-bl-full pointer-events-none"></div>
            
            <div className="flex items-center justify-between mb-1 relative z-10">
              <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-200 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-cyan-400" /> Target Support Group
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded shadow-sm ${style.badge}`}>
                {triage.action_type}
              </span>
            </div>

            <p className="text-2xl font-black tracking-tight text-white mb-2 relative z-10 flex items-center gap-2">
              <Wrench className="w-5 h-5 text-cyan-400" /> {triage.target_workgroup}
            </p>

            <div className="pt-2 border-t border-white/10 text-xs text-white/90 leading-snug relative z-10 font-medium">
              <span className="text-cyan-200 font-bold">Routing Logic: </span>
              {triage.routing_reason}
            </div>
          </div>

          {/* Voice Utterance */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Volume2 className="w-3 h-3 text-slate-500" /> Voice Input Transcript
            </p>
            <p className="text-xs font-semibold text-slate-800 italic">
              "{transcription}"
            </p>
          </div>

          {/* Context & Pre-check Badges */}
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            {technical_context?.pon_status && technical_context.pon_status !== 'NOT_APPLICABLE' && (
              <div className="p-2 bg-blue-50/70 border border-blue-200 rounded-lg flex items-center justify-between">
                <span className="text-slate-500 font-medium">PON LED:</span>
                <span className={`font-bold px-1.5 py-0.5 rounded text-[10px] ${technical_context.pon_status === 'ON' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                  {technical_context.pon_status}
                </span>
              </div>
            )}

            {technical_context?.measured_speed_mbps !== undefined && technical_context.measured_speed_mbps !== null && (
              <div className="p-2 bg-purple-50/70 border border-purple-200 rounded-lg flex items-center justify-between">
                <span className="text-slate-500 font-medium">Speed:</span>
                <span className="font-bold text-purple-700 text-[10px]">{technical_context.measured_speed_mbps} Mbps</span>
              </div>
            )}

            {technical_context?.ping_delay_ms !== undefined && technical_context.ping_delay_ms !== null && (
              <div className="p-2 bg-violet-50/70 border border-violet-200 rounded-lg flex items-center justify-between">
                <span className="text-slate-500 font-medium">Latency:</span>
                <span className="font-bold text-violet-700 text-[10px]">{technical_context.ping_delay_ms} ms</span>
              </div>
            )}

            {billing_context?.channel_type && (
              <div className="p-2 bg-amber-50/70 border border-amber-200 rounded-lg flex items-center justify-between">
                <span className="text-slate-500 font-medium">Channel:</span>
                <span className="font-bold text-amber-800 text-[10px]">{billing_context.channel_type}</span>
              </div>
            )}

            <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between col-span-2">
              <span className="text-slate-500 font-medium">Pre-checks:</span>
              <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-700">
                <span className="flex items-center gap-0.5"><CheckCircle2 className="w-3 h-3 text-emerald-500" /> LDAP</span>
                <span className="flex items-center gap-0.5"><CheckCircle2 className="w-3 h-3 text-emerald-500" /> GB Portal</span>
                <span className="flex items-center gap-0.5"><CheckCircle2 className="w-3 h-3 text-emerald-500" /> Bill Ok</span>
              </div>
            </div>
          </div>

          {/* Operational Advice */}
          {triage.operational_advice && (
            <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1">
              <p className="font-bold text-[10px] uppercase tracking-wider text-amber-800">Operational Advice / Agent Action</p>
              <p className="leading-relaxed">{triage.operational_advice}</p>
            </div>
          )}

          {/* One-click Action Button */}
          <button 
            onClick={() => {
              setDispatchedTicket({
                number: generatedTicketNo,
                group: triage.target_workgroup,
                time: new Date().toLocaleTimeString()
              });
            }}
            className="w-full py-2.5 px-4 text-xs font-black text-white bg-gradient-to-r from-[#005696] to-[#0070ba] hover:from-[#00477d] hover:to-[#005696] rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <Send className="w-3.5 h-3.5" />
            {triage.action_type === 'DIRECT_TT'
              ? `Dispatch Trouble Ticket to ${triage.target_workgroup}`
              : triage.action_type === 'BILL_SR_ONLY'
              ? 'Raise Billing Service Request (SR)'
              : 'Log CQMS Customer Complaint'}
          </button>
        </div>
      )
    };

    setSuggestions(prev => [triageCard, ...prev.filter(s => !s.id.startsWith('triage-')).slice(0, 3)]);
  };

  // Commit the full coherent utterance once speaker pauses or finishes speaking
  const commitUtterance = (textToCommit: string) => {
    const clean = textToCommit.trim();
    if (!clean || clean.length < 3) return;

    // Check if this exact text was already committed right before to avoid accidental duplicate
    setTranscript((prev) => {
      const lastMsg = prev[prev.length - 1];
      if (lastMsg && lastMsg.speaker === 'customer' && lastMsg.text === clean) {
        return prev;
      }
      return [
        ...prev,
        { id: `mic-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, speaker: 'customer', text: clean },
      ];
    });

    setLiveMicText('');
    liveMicTextRef.current = '';
    setMicTranscript(clean);

    // Trigger Gemini Voice Triage ONCE with the complete coherent sentence!
    triggerVoiceTriage(clean);
  };

  const stopMicListening = () => {
    isListeningActiveRef.current = false;
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    if (liveMicTextRef.current) {
      commitUtterance(liveMicTextRef.current);
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    setIsMicListening(false);
  };

  const startMicListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Your browser does not support Web Speech Recognition. Please try Google Chrome or Edge.');
      return;
    }

    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = voiceLangRef.current;

    isListeningActiveRef.current = true;
    setIsMicListening(true);
    setLiveMicText('');
    liveMicTextRef.current = '';

    recognition.onstart = () => {
      setIsMicListening(true);
    };

    recognition.onresult = (event: any) => {
      // Accumulate entire sentence in ONE continuous string
      let fullSentence = '';
      for (let i = 0; i < event.results.length; ++i) {
        fullSentence += event.results[i][0].transcript + ' ';
      }
      const trimmed = fullSentence.trim();
      if (!trimmed) return;

      // Update live stream in place without creating multiple fragmented messages
      setLiveMicText(trimmed);
      liveMicTextRef.current = trimmed;
      setMicTranscript(trimmed);

      // Debounce: when speaker pauses for ~1300ms, finalize the sentence into the conversation!
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
      silenceTimerRef.current = setTimeout(() => {
        if (liveMicTextRef.current) {
          commitUtterance(liveMicTextRef.current);
        }
      }, 1300);
    };

    recognition.onerror = (event: any) => {
      console.warn('Speech recognition warning:', event.error);
      if (event.error === 'not-allowed') {
        stopMicListening();
        alert('Microphone permission was denied. Please allow microphone access in your browser settings.');
      }
    };

    recognition.onend = () => {
      // If user hasn't explicitly stopped, restart continuous session seamlessly
      if (isListeningActiveRef.current) {
        try {
          recognition.start();
        } catch (e) {
          // Ignore if already started
        }
      } else {
        setIsMicListening(false);
      }
    };

    try {
      recognition.start();
    } catch (e) {
      console.error('Error starting recognition:', e);
    }
  };

  // Toggle Live Microphone Voice Recognition
  const toggleMicListening = () => {
    if (isMicListening) {
      stopMicListening();
    } else {
      startMicListening();
    }
  };

  const startCallSimulation = (type: 'sinhala' | 'english' | 'tamil' | 'incremental' | 'fiberVoicePonOn' | 'fiberVoicePonOff' | 'losRed' | 'highPing' | 'unlimitedSlow' | 'foodCityReload') => {
    setCallActive(true);
    setActiveCallType(type);
    setTranscript([]);
    setSuggestions([]);
    setCallTimer(0);
    setShowEvaluation(false);
    setDispatchedTicket(null);
    
    timerRef.current = setInterval(() => {
      setCallTimer(prev => prev + 1);
    }, 1000);

    let activeScript: { delay: number; speaker: string; text: string }[] = sinhalaCallScript;
    if (type === 'english') activeScript = englishCallScript;
    else if (type === 'tamil') activeScript = tamilCallScript;
    else if (type === 'incremental') activeScript = incrementalDirScript;
    else if (type === 'fiberVoicePonOn') activeScript = fiberVoicePonOnScript;
    else if (type === 'fiberVoicePonOff') activeScript = fiberVoicePonOffScript;
    else if (type === 'losRed') activeScript = losRedScript;
    else if (type === 'highPing') activeScript = highPingScript;
    else if (type === 'unlimitedSlow') activeScript = unlimitedSlowScript;
    else if (type === 'foodCityReload') activeScript = foodCityReloadScript;

    // Schedule transcript messages and auto-trigger Gemini Voice Triage
    activeScript.forEach((step) => {
      const timer = setTimeout(() => {
        setTranscript(prev => [...prev, { id: Math.random().toString(), speaker: step.speaker as 'customer' | 'agent', text: step.text }]);
        
        // If customer spoke, analyze with Gemini Voice Triage
        if (step.speaker === 'customer') {
          triggerVoiceTriage(step.text);
        } else {
          analyzeRealTimeAudio(step.text);
        }
      }, step.delay);
      scriptTimers.current.push(timer);
    });
  };

  const endCall = () => {
    setCallActive(false);
    setActiveCallType(null);
    if (timerRef.current) clearInterval(timerRef.current);
    scriptTimers.current.forEach(timer => clearTimeout(timer));
    scriptTimers.current = [];
    
    if (transcript.length > 0) {
      setShowEvaluation(true);

      // Save this evaluated call into localStorage for the Performance tab!
      try {
        const finalEval = evaluateCallQuality(transcript);
        const newCallRecord = {
          id: `call-${Date.now()}`,
          type: activeCallType === 'fiberVoicePonOn' || activeCallType === 'fiberVoicePonOff'
            ? 'FTTH Voice Support'
            : activeCallType === 'losRed'
            ? 'Fibre LOS Fault'
            : activeCallType === 'highPing'
            ? 'High Ping Gaming'
            : activeCallType === 'unlimitedSlow'
            ? 'Broadband Speed Issue'
            : activeCallType === 'foodCityReload'
            ? '4G Prepaid Reload Issue'
            : activeCallType === 'sinhala'
            ? 'Sinhala Directory Inquiry'
            : activeCallType === 'tamil'
            ? 'Tamil Hospital Inquiry'
            : 'Telecom Customer Service',
          caller: '011 244 5566',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          duration: formatTime(callTimer || 38),
          score: finalEval.overallScore,
          sentiment: finalEval.overallScore >= 85 ? 'Excellent' : finalEval.overallScore >= 70 ? 'Good' : 'Average',
          strengths: finalEval.strengths,
          weaknesses: finalEval.weaknesses,
          criteria: finalEval.criteria,
          language: finalEval.language,
          transcript: transcript.map(t => `${t.speaker.toUpperCase()}: ${t.text}`).join('\n')
        };
        const existing = JSON.parse(localStorage.getItem('slt_call_evaluations') || '[]');
        localStorage.setItem('slt_call_evaluations', JSON.stringify([newCallRecord, ...existing.slice(0, 15)]));
      } catch (e) {
        console.error('Failed to save call evaluation to localStorage', e);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const analyzeRealTimeAudio = (text: string) => {
    const lowerText = text.toLowerCase();
    const newSuggestions: CopilotSuggestion[] = [];

    if (lowerText.includes('hospital')) {
      newSuggestions.push({
        id: 'hospital-dir',
        type: 'intent',
        title: 'Directory Search: Kandy Hospital',
        content: (
          <div className="space-y-3">
            <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-rose-500/5 rounded-bl-full pointer-events-none"></div>
              <div className="flex items-center justify-between mb-3 relative z-10">
                <span className="text-xs font-black text-rose-900 uppercase tracking-widest">Primary Contact</span>
                <button className="text-rose-700 hover:text-rose-900"><Phone className="w-4 h-4" /></button>
              </div>
              <p className="text-3xl font-black text-rose-700 tracking-tight mb-1 relative z-10">081 222 2222</p>
              <p className="text-xs font-medium text-rose-800 relative z-10">kgh@health.gov.lk</p>
              
              <div className="mt-4 pt-3 border-t border-rose-200/60 grid grid-cols-2 gap-3 relative z-10">
                <div>
                  <p className="text-[10px] font-bold text-rose-600/70 uppercase tracking-widest mb-1">Emergency</p>
                  <p className="text-sm font-bold text-rose-800">081 222 2224</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-rose-600/70 uppercase tracking-widest mb-1">Fax Number</p>
                  <p className="text-sm font-bold text-rose-800">081 222 2225</p>
                </div>
              </div>
            </div>
            <button className="w-full py-2.5 text-xs font-bold text-white bg-rose-600 border border-rose-700 rounded-lg shadow hover:bg-rose-700 transition-colors">
              Transfer Call
            </button>
          </div>
        )
      });
    }

    if (lowerText.includes('contact number for the bank of ceylon')) {
      newSuggestions.push({
        id: 'partial-dir',
        type: 'intent',
        title: 'Intent Detected: Bank of Ceylon',
        content: (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">Bank of Ceylon</p>
              <p className="text-xs text-slate-500 mt-1">Found 310 branches. Waiting for customer to specify location...</p>
            </div>
          </div>
        )
      });
    }

    if (lowerText.includes('broadband') || lowerText.includes('fibre')) {
      newSuggestions.push({
        id: 'fibre-product',
        type: 'product',
        title: 'SLT Fibre (FTTH)',
        content: (
          <div className="space-y-3">
            <p className="text-sm text-slate-600">Ultra-fast broadband up to 1 Gbps.</p>
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Wifi className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold text-blue-900">Key Features</span>
              </div>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>• Free Router & Installation</li>
                <li>• Lowest Latency for Gaming</li>
              </ul>
            </div>
          </div>
        )
      });
    }

    if (lowerText.includes('nugegoda')) {
      newSuggestions.push({
        id: 'coverage-check',
        type: 'intent',
        title: 'Location Identified',
        content: (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">Nugegoda Area</p>
              <p className="text-xs text-slate-500 mt-1">Fibre coverage is available. High density zone.</p>
            </div>
          </div>
        )
      });
    }

    if (lowerText.includes('unlimited packages') || lowerText.includes('prices for unlimited')) {
      newSuggestions.push({
        id: 'unlimited-plans',
        type: 'product',
        title: 'Fibre Unlimited Packages',
        content: (
          <div className="space-y-2">
            <div className="flex justify-between items-center p-2 border border-slate-200 rounded-md bg-white">
              <span className="text-xs font-bold text-slate-700">Plan 1 - Home</span>
              <span className="text-xs font-bold text-[#005696]">Rs. 5,900</span>
            </div>
            <div className="flex justify-between items-center p-2 border border-slate-200 rounded-md bg-white">
              <span className="text-xs font-bold text-slate-700">Plan 2 - Home Plus</span>
              <span className="text-xs font-bold text-[#005696]">Rs. 9,900</span>
            </div>
            <div className="flex justify-between items-center p-2 border border-slate-200 rounded-md bg-white">
              <span className="text-xs font-bold text-slate-700">Plan 3 - Twin</span>
              <span className="text-xs font-bold text-[#005696]">Rs. 14,900</span>
            </div>
          </div>
        )
      });
    }

    if (lowerText.includes('home package') || lowerText.includes('unlimited home')) {
      newSuggestions.push({
        id: 'home-packages',
        type: 'product',
        title: 'Unlimited Home Packages',
        content: (
          <div className="space-y-2 text-xs">
            <div className="border border-slate-200 rounded-md overflow-hidden bg-white">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 text-slate-600">
                    <th className="py-2 px-3 font-bold">Package</th>
                    <th className="py-2 px-3 font-bold">Speed</th>
                    <th className="py-2 px-3 font-bold">Monthly</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr><td className="py-2 px-3 font-medium">Home</td><td className="py-2 px-3 text-slate-500">100/50</td><td className="py-2 px-3 font-bold text-[#005696]">Rs. 5,900</td></tr>
                  <tr><td className="py-2 px-3 font-medium">Home Plus</td><td className="py-2 px-3 text-slate-500">200/100</td><td className="py-2 px-3 font-bold text-[#005696]">Rs. 9,900</td></tr>
                  <tr><td className="py-2 px-3 font-medium">Twin</td><td className="py-2 px-3 text-slate-500">200/200</td><td className="py-2 px-3 font-bold text-[#005696]">Rs. 14,900 <span className="text-[9px] text-slate-400 block leading-tight">+1 Static IP</span></td></tr>
                  <tr><td className="py-2 px-3 font-medium">Pro</td><td className="py-2 px-3 text-slate-500">500/200</td><td className="py-2 px-3 font-bold text-[#005696]">Rs. 19,900</td></tr>
                  <tr><td className="py-2 px-3 font-medium">Edge</td><td className="py-2 px-3 text-slate-500">750/250</td><td className="py-2 px-3 font-bold text-[#005696]">Rs. 29,900</td></tr>
                  <tr><td className="py-2 px-3 font-medium">Turbo</td><td className="py-2 px-3 text-slate-500">1000/300</td><td className="py-2 px-3 font-bold text-[#005696]">Rs. 39,900</td></tr>
                </tbody>
              </table>
            </div>
            <button className="w-full py-2 text-xs font-bold text-white bg-[#005696] rounded-md hover:bg-[#00407a] transition-colors mt-2">
              Send Full Details via SMS
            </button>
          </div>
        )
      });
    }

    // Directory Call Keywords
    if (lowerText.includes('bank of ceylon') && !lowerText.includes('contact number for the bank of ceylon') || lowerText.includes('kandy branch')) {
      newSuggestions.push({
        id: 'dir-boc-kandy',
        type: 'action',
        title: 'Directory Result: BOC Kandy',
        content: (
          <div className="space-y-3">
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/5 rounded-bl-full pointer-events-none"></div>
              <div className="flex items-center justify-between mb-3 relative z-10">
                <span className="text-xs font-black text-emerald-900 uppercase tracking-widest">Primary Contact</span>
                <button className="text-emerald-700 hover:text-emerald-900"><Phone className="w-4 h-4" /></button>
              </div>
              <p className="text-3xl font-black text-emerald-700 tracking-tight mb-1 relative z-10">081 222 2222</p>
              <p className="text-xs font-medium text-emerald-800 relative z-10">boc.kandy@boc.lk</p>
              
              <div className="mt-4 pt-3 border-t border-emerald-200/60 grid grid-cols-2 gap-3 relative z-10">
                <div>
                  <p className="text-[10px] font-bold text-emerald-600/70 uppercase tracking-widest mb-1">WhatsApp</p>
                  <p className="text-sm font-bold text-emerald-800">077 222 2222</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-emerald-600/70 uppercase tracking-widest mb-1">Fax Number</p>
                  <p className="text-sm font-bold text-emerald-800">081 222 2223</p>
                </div>
              </div>
            </div>
            <button className="w-full py-2.5 text-xs font-bold text-white bg-emerald-600 border border-emerald-700 rounded-lg shadow hover:bg-emerald-700 transition-colors">
              Transfer Call
            </button>
          </div>
        )
      });
    }

    if (newSuggestions.length > 0) {
      setSuggestions(prev => {
        // Prevent duplicates based on ID
        const combined = [...newSuggestions, ...prev];
        const unique = Array.from(new Map(combined.map(item => [item.id, item])).values());
        return unique.slice(0, 4);
      });
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-3.5rem)] overflow-hidden bg-slate-50">
      
      {/* Main Layout (Row) */}
      <div className="flex w-full h-full">
        {/* Left Panel: Pearl Modernized Interface */}
        <div className="w-full lg:w-7/12 flex flex-col border-r border-slate-200 bg-white relative shadow-[10px_0_30px_rgba(0,0,0,0.02)] z-10">
          
          {/* Pearl Top Header */}
          <div className="px-6 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between text-xs font-bold text-slate-600 overflow-x-auto whitespace-nowrap">
            <div className="flex items-center gap-4 lg:gap-6">
              <div className="flex items-center gap-2 text-[#005696] font-black text-sm">
                <ShieldAlert className="w-4 h-4" /> PEARL AI
              </div>
              <div>Logged in as: <span className="text-slate-800">Gehan Jayawardana</span></div>
              <div>Campaign: <span className="text-slate-800">C_SLT</span></div>
            </div>
            <div className="flex items-center gap-4 lg:gap-6 text-right">
              <div>Calls in Queue: <span className="text-slate-800 font-black">0</span></div>
              {callActive ? (
                 <div className="text-emerald-600 font-black uppercase flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> LIVE CALL ({formatTime(callTimer)})</div>
              ) : (
                 <div className="text-slate-400 font-black uppercase">NO LIVE CALL</div>
              )}
            </div>
          </div>

          {/* Body Section */}
          <div className="flex flex-1 overflow-hidden relative">
            
            {/* Left Action Buttons */}
            <div className="w-32 lg:w-40 border-r border-slate-200 bg-slate-50 p-4 flex flex-col gap-3 shrink-0">
              <div className="text-xs font-black text-slate-500 mb-2">STATUS:</div>
              <button className="w-full py-2 bg-emerald-500 text-white font-bold text-[10px] rounded border border-emerald-600 shadow-sm">YOU ARE ACTIVE</button>
              <button className="w-full py-2 bg-amber-400 text-amber-900 font-bold text-[10px] rounded border border-amber-500 shadow-sm">BREAK</button>
              
              <div className="mt-8 space-y-3">
                <button className="w-full py-2 bg-slate-200 text-slate-600 font-bold text-[10px] rounded border border-slate-300 hover:bg-slate-300">PARK CALL</button>
                <button onClick={callActive ? endCall : undefined} className={`w-full py-2 font-bold text-[10px] rounded border shadow-sm ${callActive ? 'bg-purple-500 text-white border-purple-600 hover:bg-purple-600' : 'bg-slate-200 text-slate-600 border-slate-300 hover:bg-slate-300'}`}>TRANSFER - CONF</button>
                {callActive && (
                  <button onClick={endCall} className="w-full py-2 bg-rose-500 text-white font-bold text-[10px] rounded border border-rose-600 hover:bg-rose-600 shadow-sm mt-4">HANGUP CUSTOMER</button>
                )}
              </div>
            </div>

            {/* Form Area */}
            <div className="flex-1 p-6 overflow-y-auto bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed relative" style={{ backgroundColor: '#ffffff' }}>
              
              {/* Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mb-6">
                
                {/* Left Column Fields */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <label className="w-20 text-right text-xs font-bold text-slate-600">Title:</label>
                    <input type="text" className="flex-1 border border-slate-300 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-blue-500 outline-none" />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="w-20 text-right text-xs font-bold text-slate-600">First:</label>
                    <input type="text" className="flex-1 border border-slate-300 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-blue-500 outline-none" />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="w-20 text-right text-xs font-bold text-slate-600">Last:</label>
                    <input type="text" className="flex-1 border border-slate-300 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-blue-500 outline-none" />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="w-20 text-right text-xs font-bold text-slate-600">Address1:</label>
                    <input type="text" className="flex-1 border border-slate-300 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-blue-500 outline-none" />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="w-20 text-right text-xs font-bold text-slate-600">City:</label>
                    <input type="text" className="flex-1 border border-slate-300 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-blue-500 outline-none" />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="w-20 text-right text-xs font-bold text-slate-600">Province:</label>
                    <input type="text" className="flex-1 border border-slate-300 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-blue-500 outline-none" />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="w-20 text-right text-xs font-bold text-slate-600">Phone:</label>
                    <input type="text" className="flex-1 border border-slate-300 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-blue-500 outline-none" value={callActive ? "0776165556" : ""} readOnly />
                  </div>
                </div>

                {/* Right Column Fields */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <label className="w-20 text-right text-xs font-bold text-slate-600">Address3:</label>
                    <input type="text" className="flex-1 border border-slate-300 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-blue-500 outline-none" />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="w-20 text-right text-xs font-bold text-slate-600">State:</label>
                    <input type="text" className="flex-1 border border-slate-300 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-blue-500 outline-none" />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="w-20 text-right text-xs font-bold text-slate-600">IVR Entry:</label>
                    <input type="text" className="flex-1 border border-slate-300 rounded px-2 py-1 text-xs text-slate-500 bg-slate-50 focus:ring-1 focus:ring-blue-500 outline-none" readOnly value={callActive ? "CONTACT_0776165556" : ""} />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="w-20 text-right text-xs font-bold text-slate-600">Email:</label>
                    <input type="text" className="flex-1 border border-slate-300 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-blue-500 outline-none" />
                  </div>
                  <div className="flex items-center gap-2 mt-6">
                    <label className="w-20 text-right text-xs font-bold text-slate-600">PostCode:</label>
                    <input type="text" className="flex-1 border border-slate-300 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-blue-500 outline-none" />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="w-20 text-right text-xs font-bold text-slate-600">Gender:</label>
                    <select className="flex-1 border border-slate-300 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-blue-500 outline-none">
                       <option>U - Undefined</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Live Gemini Voice Copilot & Simulation Controls */}
              <div className="mt-8 p-6 border-2 border-indigo-200/80 bg-gradient-to-br from-indigo-50/50 via-white to-blue-50/50 rounded-2xl max-w-xl mx-auto space-y-5 shadow-lg backdrop-blur-md">
                
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-indigo-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#005696] to-indigo-600 flex items-center justify-center text-white shadow-sm">
                      <Sparkles className="w-4 h-4 text-cyan-200" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-800">Gemini Live Voice Triage</p>
                      <p className="text-[10px] text-slate-500 font-medium">Speak in Sinhala, Singlish, or English</p>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200 flex items-center gap-1">
                    <Radio className="w-3 h-3 text-indigo-600 animate-pulse" /> Live Speech AI
                  </span>
                </div>

                {/* Recognition Language Selector */}
                <div className="flex items-center justify-between text-xs bg-indigo-50/80 p-2 px-3 rounded-xl border border-indigo-100 shadow-2xs">
                  <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                    <Volume2 className="w-3.5 h-3.5 text-[#005696]" /> Voice Language:
                  </span>
                  <div className="flex gap-1 bg-white p-0.5 rounded-lg border border-slate-200 shadow-2xs text-[10px]">
                    <button
                      onClick={() => {
                        setVoiceLang('en-US');
                        if (isMicListening) {
                          stopMicListening();
                        }
                      }}
                      className={`px-2.5 py-1 rounded-md font-black transition-all ${
                        voiceLang === 'en-US'
                          ? 'bg-[#005696] text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      🌐 Singlish / English
                    </button>
                    <button
                      onClick={() => {
                        setVoiceLang('si-LK');
                        if (isMicListening) {
                          stopMicListening();
                        }
                      }}
                      className={`px-2.5 py-1 rounded-md font-black transition-all ${
                        voiceLang === 'si-LK'
                          ? 'bg-[#005696] text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      🇱🇰 සිංහල (si-LK)
                    </button>
                  </div>
                </div>

                {/* Primary Live Microphone Button */}
                <div className="space-y-2">
                  <button
                    onClick={toggleMicListening}
                    className={`w-full py-3.5 px-6 rounded-xl font-black text-sm shadow-md flex items-center justify-center gap-3 transition-all ${
                      isMicListening
                        ? 'bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 text-white animate-pulse ring-4 ring-rose-400/30'
                        : 'bg-gradient-to-r from-[#005696] via-[#006bb3] to-[#00A3E0] text-white hover:brightness-105 active:scale-95'
                    }`}
                  >
                    {isMicListening ? (
                      <>
                        <MicOff className="w-5 h-5 text-white animate-bounce" />
                        <span>Listening Continuously... Click to Finish</span>
                      </>
                    ) : (
                      <>
                        <Mic className="w-5 h-5 text-cyan-200" />
                        <span>🎙️ Speak Fault (Continuous Live Voice)</span>
                      </>
                    )}
                  </button>

                  {/* Audio wave indicator when listening */}
                  {isMicListening && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="p-3.5 bg-gradient-to-r from-rose-50 via-red-50 to-pink-50 border border-rose-200 rounded-xl text-center space-y-2 shadow-xs"
                    >
                      <div className="flex items-center justify-center gap-1.5">
                        <span className="w-1.5 h-4 bg-rose-500 rounded-full animate-pulse"></span>
                        <span className="w-1.5 h-6 bg-rose-600 rounded-full animate-pulse delay-75"></span>
                        <span className="w-1.5 h-8 bg-rose-700 rounded-full animate-pulse delay-150"></span>
                        <span className="w-1.5 h-5 bg-rose-600 rounded-full animate-pulse delay-100"></span>
                        <span className="w-1.5 h-3 bg-rose-500 rounded-full animate-pulse delay-200"></span>
                      </div>
                      
                      <div className="bg-white/95 p-3 rounded-xl border border-rose-200/90 text-left shadow-2xs">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] font-black uppercase tracking-wider text-rose-600 flex items-center gap-1.5">
                            <Radio className="w-3.5 h-3.5 text-rose-500 animate-pulse" /> Live Speech Buffer ({voiceLang === 'si-LK' ? 'සිංහල' : 'Singlish / English'})
                          </span>
                          <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                            Streaming In-Place
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-slate-800 italic leading-relaxed min-h-[1.5rem]">
                          {liveMicText || micTranscript ? `"${liveMicText || micTranscript}"` : 'Listening continuously... Speak your sentence naturally.'}
                        </p>
                      </div>

                      <p className="text-[10px] text-slate-500 font-medium">
                        💡 Pause for 1 second when finished speaking to auto-commit and send to Gemini.
                      </p>
                    </motion.div>
                  )}
                </div>

                {/* Telecom Fault Voice Presets */}
                <div className="pt-2 border-t border-slate-200/80 space-y-2.5">
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider text-left flex items-center justify-between">
                    <span>⚡ Quick Test Voice Fault Calls</span>
                    <span className="text-[9px] text-indigo-600 font-mono">Auto-Triage</span>
                  </p>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    <button
                      onClick={() => startCallSimulation('fiberVoicePonOn')}
                      className="p-2.5 bg-white hover:bg-cyan-50/60 border border-slate-200 hover:border-cyan-400 rounded-xl text-left transition-all shadow-xs group"
                    >
                      <p className="text-[10px] font-bold text-cyan-600 flex items-center gap-1">
                        <Phone className="w-3 h-3" /> Voice PON ON
                      </p>
                      <p className="text-xs font-black text-slate-800 group-hover:text-cyan-900">MDF Route</p>
                    </button>

                    <button
                      onClick={() => startCallSimulation('fiberVoicePonOff')}
                      className="p-2.5 bg-white hover:bg-amber-50/60 border border-slate-200 hover:border-amber-400 rounded-xl text-left transition-all shadow-xs group"
                    >
                      <p className="text-[10px] font-bold text-amber-600 flex items-center gap-1">
                        <Phone className="w-3 h-3" /> Voice PON OFF
                      </p>
                      <p className="text-xs font-black text-slate-800 group-hover:text-amber-900">AREA-MTCE</p>
                    </button>

                    <button
                      onClick={() => startCallSimulation('losRed')}
                      className="p-2.5 bg-white hover:bg-rose-50/60 border border-slate-200 hover:border-rose-400 rounded-xl text-left transition-all shadow-xs group"
                    >
                      <p className="text-[10px] font-bold text-rose-600 flex items-center gap-1">
                        <Wifi className="w-3 h-3" /> LOS Red Light
                      </p>
                      <p className="text-xs font-black text-slate-800 group-hover:text-rose-900">AREA-MTCE</p>
                    </button>

                    <button
                      onClick={() => startCallSimulation('highPing')}
                      className="p-2.5 bg-white hover:bg-purple-50/60 border border-slate-200 hover:border-purple-400 rounded-xl text-left transition-all shadow-xs group"
                    >
                      <p className="text-[10px] font-bold text-purple-600 flex items-center gap-1">
                        <Activity className="w-3 h-3" /> High Ping 185ms
                      </p>
                      <p className="text-xs font-black text-slate-800 group-hover:text-purple-900">CEN-CSC-TECH</p>
                    </button>

                    <button
                      onClick={() => startCallSimulation('unlimitedSlow')}
                      className="p-2.5 bg-white hover:bg-orange-50/60 border border-slate-200 hover:border-orange-400 rounded-xl text-left transition-all shadow-xs group"
                    >
                      <p className="text-[10px] font-bold text-orange-600 flex items-center gap-1">
                        <Zap className="w-3 h-3" /> Speed 18 Mbps
                      </p>
                      <p className="text-xs font-black text-slate-800 group-hover:text-orange-900">AREA-MTCE</p>
                    </button>

                    <button
                      onClick={() => startCallSimulation('foodCityReload')}
                      className="p-2.5 bg-white hover:bg-emerald-50/60 border border-slate-200 hover:border-emerald-400 rounded-xl text-left transition-all shadow-xs group"
                    >
                      <p className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                        <CreditCard className="w-3 h-3" /> Food City Reload
                      </p>
                      <p className="text-xs font-black text-slate-800 group-hover:text-emerald-900">BILL_SR_ONLY</p>
                    </button>
                  </div>
                </div>

                {/* Directory Simulations Accordion */}
                <div className="pt-2 border-t border-slate-200/80 text-left">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Original Directory Scripts</p>
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => startCallSimulation('sinhala')} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold text-[11px] transition-colors">
                      සිංහල Directory
                    </button>
                    <button onClick={() => startCallSimulation('english')} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold text-[11px] transition-colors">
                      English Product
                    </button>
                    <button onClick={() => startCallSimulation('tamil')} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold text-[11px] transition-colors">
                      தமிழ் Directory
                    </button>
                    <button onClick={() => startCallSimulation('incremental')} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold text-[11px] transition-colors">
                      Interactive Dir
                    </button>
                  </div>
                </div>
              </div>

              {/* Floating Incoming Call Banner */}
              <AnimatePresence>
                {callActive && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="mt-6 mx-auto w-full max-w-lg bg-indigo-900 border border-indigo-700 rounded-xl p-4 shadow-xl z-20 text-center text-white"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
                        <Radio className="w-3 h-3 animate-pulse text-rose-400" /> Active Telecom Call Session
                      </span>
                      <span className="text-xs font-mono font-bold text-emerald-400">Duration: {formatTime(callTimer)}</span>
                    </div>
                    <p className="text-sm font-black mb-1">Incoming: (011) 244-5566 | FTTH Subscriber</p>
                    <p className="text-xs text-indigo-200 font-medium">Gemini Copilot actively listening and extracting fault parameters in real-time.</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Dispatched Ticket Confirmation Banner */}
              <AnimatePresence>
                {dispatchedTicket && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="mt-6 mx-auto w-full max-w-lg bg-emerald-900 border border-emerald-700 text-white rounded-xl p-4 shadow-xl text-left"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                        <div>
                          <p className="text-sm font-black text-white">Ticket Dispatched Successfully!</p>
                          <p className="text-xs text-emerald-200">Ref: <span className="font-mono font-bold text-white">{dispatchedTicket.number}</span> $\rightarrow$ Assigned: <span className="font-bold text-amber-300">{dispatchedTicket.group}</span></p>
                        </div>
                      </div>
                      <button onClick={() => setDispatchedTicket(null)} className="p-1 hover:bg-emerald-800 rounded text-emerald-300">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </div>
          
          {/* Transcript Footer (Like Pearl Bottom Bar) */}
          <div className="h-40 bg-[#4287f5] border-t border-slate-300 relative overflow-hidden flex flex-col shrink-0">
             <div className="p-2 px-4 text-white text-[10px] font-bold border-b border-[#2b6bd4] flex justify-between shadow-sm">
                <span>Show conference call channel information</span>
                <span>Agents View +</span>
             </div>
             
             {/* Live transcript area */}
             <div className="flex-1 overflow-y-auto p-4 space-y-1.5" ref={transcriptRef}>
                {transcript.map((msg) => (
                  <div key={msg.id} className="text-xs font-bold">
                    <span className={msg.speaker === 'agent' ? 'text-blue-100' : 'text-emerald-200 uppercase'}>{msg.speaker}:</span> <span className="text-white font-medium">{msg.text}</span>
                  </div>
                ))}

                {/* Active streaming voice line (continuous live feedback without fragmenting into chunks) */}
                {liveMicText && (
                  <div className="text-xs font-bold text-amber-200 bg-blue-900/60 p-2 rounded-lg border border-cyan-400/40 flex items-center justify-between shadow-xs">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <span className="text-cyan-300 uppercase shrink-0 flex items-center gap-1 font-black">
                        <Radio className="w-3.5 h-3.5 text-rose-400 animate-pulse" /> CUSTOMER (SPEAKING):
                      </span>
                      <span className="text-white font-medium italic">{liveMicText}</span>
                    </div>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0 ml-2"></span>
                  </div>
                )}

                {isAiTriaging && (
                  <div className="flex items-center gap-2 text-cyan-200 text-xs font-bold bg-indigo-950/50 p-2 rounded-lg border border-indigo-500/30">
                    <Sparkles className="w-3.5 h-3.5 animate-spin text-cyan-300" />
                    <span>Gemini 3.8 Flash analyzing complete conversation...</span>
                  </div>
                )}

                {callActive && !liveMicText && (
                  <div className="flex items-center gap-2 text-blue-200 text-xs font-medium mt-2">
                    <Activity className="w-3 h-3 animate-pulse" /> AI is listening to the live call...
                  </div>
                )}
             </div>
          </div>
        </div>

        {/* Right Panel: AI Live Feed & Extractions */}
        <div className="flex-1 bg-slate-50 overflow-y-auto relative">
          {/* Background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#00A3E0]/5 rounded-full blur-3xl pointer-events-none"></div>

          <div className="p-6 relative z-10">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#005696] to-[#00A3E0] flex items-center justify-center shadow-md">
                  <Cpu className="w-4 h-4 text-white" />
                </div>
                Live Copilot Feed
              </h2>
              <div className="flex items-center gap-2">
                {isAiTriaging && (
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-700 animate-pulse border border-indigo-200 flex items-center gap-1 shadow-sm">
                    <Sparkles className="w-3 h-3 text-indigo-600 animate-spin" /> Gemini Triaging...
                  </span>
                )}
                <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Active
                </div>
              </div>
            </div>

            {/* 1. TARGET WORKGROUP & FAULT COMPLAINT TRIAGE CARDS (PRIMARY AT TOP) */}
            <div className="mb-6 space-y-4">
              <AnimatePresence>
                {suggestions.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0, y: -5 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0 }}
                    className="p-5 bg-gradient-to-br from-white via-slate-50/70 to-blue-50/30 border border-slate-200 border-dashed rounded-2xl text-center space-y-2 shadow-2xs"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#005696] to-cyan-600 text-white flex items-center justify-center mx-auto shadow-xs">
                      <Target className="w-5 h-5 text-cyan-200" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-800">Target Support Group & Complaint Dispatch</h4>
                      <p className="text-[11px] text-slate-500 font-medium max-w-sm mx-auto mt-0.5">
                        Speak a fault or run a preset. Gemini will instantly detect the technical fault, map the rule, and surface the assigned support group (AREA-MTCE, MDF, CEN-CSC-TECH, etc.) here.
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <div className="space-y-4">
                    {suggestions.map((suggestion, idx) => (
                      <motion.div
                        key={suggestion.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1, type: 'spring', stiffness: 200, damping: 20 }}
                        className="bg-white border-2 border-[#005696]/20 rounded-2xl p-5 shadow-[0_8px_30px_rgba(0,86,150,0.08)] hover:shadow-[0_12px_36px_rgba(0,86,150,0.12)] transition-all"
                      >
                        <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-3">
                          <div className="flex items-center gap-2">
                            {suggestion.type === 'product' && <Wifi className="w-4 h-4 text-purple-500" />}
                            {suggestion.type === 'intent' && <ShieldAlert className="w-4 h-4 text-emerald-500" />}
                            <span className="text-[10px] font-black text-[#005696] uppercase tracking-wider">
                              {suggestion.type === 'product' ? 'Product Match' : 'Identified Fault Triage & Action'}
                            </span>
                          </div>
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#005696] border border-blue-200">
                            Priority #1 Action
                          </span>
                        </div>
                        
                        <h3 className="text-base font-bold text-slate-800 mb-3">{suggestion.title}</h3>
                        
                        <div>{suggestion.content}</div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* 2. REAL-TIME SLT CALL QUALITY STANDARDS COMPLIANCE MONITOR (BELOW COMPLAINT AREA) */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-2xl bg-gradient-to-br from-[#005696]/5 via-indigo-50/50 to-blue-50/50 border border-indigo-200/80 shadow-xs relative overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-indigo-100">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#005696] text-white flex items-center justify-center shadow-xs">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-slate-900 tracking-tight flex items-center gap-1.5">
                      Quality Standards of Calls
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-700">
                        QA SLA
                      </span>
                    </h3>
                    <p className="text-[10px] text-slate-500 font-medium">Real-time Call Quality Compliance Verification</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className={`px-2.5 py-1 rounded-xl font-black text-xs shadow-2xs flex items-center gap-1 ${
                    qualityResult.overallScore >= 85
                      ? 'bg-emerald-500 text-white'
                      : qualityResult.overallScore >= 60
                      ? 'bg-[#005696] text-white'
                      : 'bg-amber-500 text-white'
                  }`}>
                    <Award className="w-3.5 h-3.5" />
                    <span>{qualityResult.overallScore}%</span>
                  </div>

                  <Link 
                    href="/evaluations"
                    title="Open Full Performance Dashboard"
                    className="p-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-[#005696] transition-all shadow-2xs"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* 5 Real-Time Quality Checkpoints */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
                {/* 1. Greeting */}
                <div className={`p-2 rounded-xl border text-left transition-all ${
                  qualityResult.criteria.greeting.passed
                    ? 'bg-emerald-50/80 border-emerald-300 text-emerald-900'
                    : 'bg-white/80 border-slate-200 text-slate-600'
                }`}>
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[10px] font-bold">1. Greeting</span>
                    {qualityResult.criteria.greeting.passed ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-slate-300" />
                    )}
                  </div>
                  <p className="text-[9px] font-semibold text-slate-500 leading-tight truncate">
                    {qualityResult.criteria.greeting.passed ? 'Ayubowan / ආයුබෝවන්' : 'Ayubowan + Name'}
                  </p>
                </div>

                {/* 2. Holding */}
                <div className={`p-2 rounded-xl border text-left transition-all ${
                  qualityResult.criteria.holding.passed
                    ? 'bg-emerald-50/80 border-emerald-300 text-emerald-900'
                    : 'bg-white/80 border-slate-200 text-slate-600'
                }`}>
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[10px] font-bold">2. Holding 45s</span>
                    {qualityResult.criteria.holding.passed ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-slate-300" />
                    )}
                  </div>
                  <p className="text-[9px] font-semibold text-slate-500 leading-tight truncate">
                    {qualityResult.criteria.holding.passed ? 'Hold & Retrieved' : 'Hold + Retrieval'}
                  </p>
                </div>

                {/* 3. Pre-Close */}
                <div className={`p-2 rounded-xl border text-left transition-all ${
                  qualityResult.criteria.preClose.passed
                    ? 'bg-emerald-50/80 border-emerald-300 text-emerald-900'
                    : 'bg-white/80 border-slate-200 text-slate-600'
                }`}>
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[10px] font-bold">3. Pre-Close</span>
                    {qualityResult.criteria.preClose.passed ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-slate-300" />
                    )}
                  </div>
                  <p className="text-[9px] font-semibold text-slate-500 leading-tight truncate">
                    {qualityResult.criteria.preClose.passed ? 'Inquiry Done' : 'Anything else?'}
                  </p>
                </div>

                {/* 4. IVR C-Sat Ending */}
                <div className={`p-2 rounded-xl border text-left transition-all ${
                  qualityResult.criteria.ivrEnding.passed
                    ? 'bg-emerald-50/80 border-emerald-300 text-emerald-900'
                    : 'bg-white/80 border-slate-200 text-slate-600'
                }`}>
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[10px] font-bold">4. IVR C-Sat</span>
                    {qualityResult.criteria.ivrEnding.passed ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-slate-300" />
                    )}
                  </div>
                  <p className="text-[9px] font-semibold text-slate-500 leading-tight truncate">
                    {qualityResult.criteria.ivrEnding.passed ? 'Rating Script' : 'Rate service'}
                  </p>
                </div>

                {/* 5. Sir/Madam */}
                <div className={`p-2 rounded-xl border text-left transition-all ${
                  qualityResult.criteria.sirMadam.passed
                    ? 'bg-indigo-50/80 border-indigo-300 text-indigo-900'
                    : 'bg-white/80 border-slate-200 text-slate-600'
                }`}>
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[10px] font-bold">5. Sir / Madam</span>
                    {qualityResult.criteria.sirMadam.passed ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-slate-300" />
                    )}
                  </div>
                  <p className="text-[9px] font-semibold text-slate-500 leading-tight truncate">
                    {qualityResult.criteria.sirMadam.passed ? 'Honorific Used' : 'Address Sir/Madam'}
                  </p>
                </div>

                {/* 6. Apology / Courtesy */}
                <div className="p-2 rounded-xl border bg-white/80 border-slate-200 text-slate-600 text-left">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[10px] font-bold">6. Courtesy</span>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  <p className="text-[9px] font-semibold text-slate-500 leading-tight truncate">
                    Sorry when needed
                  </p>
                </div>
              </div>

              {/* Live Real-time Quality Coaching Prompt Banner */}
              <div className="p-2.5 rounded-xl bg-white border border-indigo-100 shadow-2xs flex items-center justify-between text-left">
                <div className="flex items-center gap-2 overflow-hidden">
                  <Sparkles className="w-4 h-4 text-[#005696] shrink-0" />
                  <p className="text-[11px] font-bold text-slate-700 truncate">
                    {!qualityResult.criteria.greeting.passed
                      ? 'Say: "ආයුබෝවන්! මම හිමාලි, මට පුළුවනි ඔබට සහය වන්න" or "Ayubowan! I am Himali..."'
                      : !qualityResult.criteria.sirMadam.passed
                      ? 'Remember to address the customer respectfully as "Sir" or "Madam"'
                      : !qualityResult.criteria.preClose.passed
                      ? 'Pre-close: "වෙනත් යමක් දැනගැනීමට අවශ්‍යද?" / "Is there anything else I can help you with Sir/Madam?"'
                      : !qualityResult.criteria.ivrEnding.passed
                      ? 'Ending: "මා ලබාදුන් සේවය ඇගයීම සඳහා රැඳී සිටින්න. SLT Mobitel ඇමතුවාට ස්තූතියි."'
                      : '🌟 Outstanding! 100% adherence to official SLT Call Quality Standards.'}
                  </p>
                </div>
                <Link
                  href="/evaluations"
                  className="text-[10px] font-black text-[#005696] hover:underline shrink-0 ml-2"
                >
                  View Performance ➔
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Evaluation Saved Toast with Link to Performance */}
      <AnimatePresence>
        {showEvaluation && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: 50 }}
            className="absolute bottom-6 right-6 bg-slate-900 text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between gap-4 z-50 border border-slate-700"
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm ${
                qualityResult.overallScore >= 85 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
              }`}>
                {qualityResult.overallScore}%
              </div>
              <div>
                <p className="text-sm font-black">Call Finished & Evaluated</p>
                <p className="text-xs text-slate-300">
                  Quality Score: <span className="font-bold text-emerald-400">{qualityResult.overallScore}%</span> • Saved to Performance tab.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link 
                href="/evaluations"
                className="px-3 py-1.5 bg-[#005696] hover:bg-[#00477d] text-white rounded-lg text-xs font-bold transition-all shadow-sm"
              >
                View in Performance ➔
              </Link>
              <button onClick={() => setShowEvaluation(false)} className="p-1 hover:bg-slate-800 rounded-lg transition-colors">
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
