'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Sparkles,
  Check,
  X,
  Trash2,
  Plus,
  RefreshCw,
  Sliders,
  Volume2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  Save,
  BookOpen,
  Headphones
} from 'lucide-react';
import {
  CustomAccentRule,
  getStoredAccentRules,
  saveLearnedAccentRule,
  removeAccentRule,
  resetAccentRulesToDefault,
  normalizeTelecomSpeech
} from '@/lib/telecomVoiceNormalizer';

interface VoiceAccentTrainerModalProps {
  isOpen: boolean;
  onClose: () => void;
  voiceLang: string;
  onRulesUpdated?: (rules: CustomAccentRule[]) => void;
}

export default function VoiceAccentTrainerModal({
  isOpen,
  onClose,
  voiceLang,
  onRulesUpdated
}: VoiceAccentTrainerModalProps) {
  const [activeTab, setActiveTab] = useState<'practice' | 'dictionary'>('practice');
  const [rules, setRules] = useState<CustomAccentRule[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Live mic practice states
  const [isListening, setIsListening] = useState(false);
  const [rawCaptured, setRawCaptured] = useState('');
  const [normalizedResult, setNormalizedResult] = useState('');
  const [showTeachForm, setShowTeachForm] = useState(false);
  const [teachMisheard, setTeachMisheard] = useState('');
  const [teachCorrect, setTeachCorrect] = useState('');
  const [teachCategory, setTeachCategory] = useState<'telecom' | 'sinhala' | 'general'>('telecom');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Manual rule addition form
  const [manualMisheard, setManualMisheard] = useState('');
  const [manualCorrect, setManualCorrect] = useState('');
  const [manualCategory, setManualCategory] = useState<'telecom' | 'sinhala' | 'general'>('telecom');

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (isOpen) {
      loadRules();
    } else {
      stopPracticeMic();
    }
  }, [isOpen]);

  const loadRules = () => {
    const loaded = getStoredAccentRules();
    setRules(loaded);
    if (onRulesUpdated) onRulesUpdated(loaded);
  };

  const showNotification = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  // Start Mic for Live Practice
  const startPracticeMic = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Your browser does not support Web Speech Recognition. Please use Chrome or Edge.');
      return;
    }

    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = voiceLang;

    recognition.onstart = () => {
      setIsListening(true);
      setRawCaptured('');
      setNormalizedResult('');
      setShowTeachForm(false);
    };

    recognition.onresult = (event: any) => {
      let interim = '';
      for (let i = 0; i < event.results.length; ++i) {
        interim += event.results[i][0].transcript;
      }
      const trimmed = interim.trim();
      setRawCaptured(trimmed);
      const norm = normalizeTelecomSpeech(trimmed, voiceLang, rules);
      setNormalizedResult(norm);
    };

    recognition.onerror = (e: any) => {
      console.warn('Practice speech error:', e);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    try {
      recognition.start();
    } catch (e) {
      console.error(e);
    }
  };

  const stopPracticeMic = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    setIsListening(false);
  };

  const handleOpenTeachForm = () => {
    setTeachMisheard(rawCaptured);
    setTeachCorrect(normalizedResult || rawCaptured);
    setShowTeachForm(true);
  };

  const handleSaveTaughtRule = () => {
    if (!teachMisheard.trim() || !teachCorrect.trim()) return;
    const updated = saveLearnedAccentRule(teachMisheard, teachCorrect, teachCategory);
    setRules(updated);
    if (onRulesUpdated) onRulesUpdated(updated);
    
    // Test the newly saved rule right on the current text
    const reTested = normalizeTelecomSpeech(rawCaptured, voiceLang, updated);
    setNormalizedResult(reTested);
    setShowTeachForm(false);
    showNotification(`✨ Model calibrated! Next time you say "${teachMisheard.trim()}", it will auto-correct to "${teachCorrect.trim()}".`);
  };

  const handleAddManualRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualMisheard.trim() || !manualCorrect.trim()) return;
    const updated = saveLearnedAccentRule(manualMisheard, manualCorrect, manualCategory);
    setRules(updated);
    if (onRulesUpdated) onRulesUpdated(updated);
    setManualMisheard('');
    setManualCorrect('');
    showNotification(`Rule "${manualMisheard}" ➔ "${manualCorrect}" saved to accent memory!`);
  };

  const handleDeleteRule = (id: string) => {
    const updated = removeAccentRule(id);
    setRules(updated);
    if (onRulesUpdated) onRulesUpdated(updated);
  };

  const handleResetDefaults = () => {
    if (confirm('Reset your custom accent rules back to standard SLT factory defaults?')) {
      const defs = resetAccentRulesToDefault();
      setRules(defs);
      if (onRulesUpdated) onRulesUpdated(defs);
      showNotification('Reset to factory defaults.');
    }
  };

  if (!isOpen) return null;

  const filteredRules = rules.filter(
    (r) =>
      r.misheard.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.correct.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-[#003B66] via-[#005696] to-[#00A3E0] text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center backdrop-blur-md border border-white/20 shadow-inner">
              <Headphones className="w-5 h-5 text-cyan-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black tracking-tight text-white">Voice Accent Calibration & Training</h2>
                <span className="px-2 py-0.5 text-[10px] font-black uppercase rounded-full bg-cyan-400/20 text-cyan-200 border border-cyan-300/30">
                  SLT AI Engine
                </span>
              </div>
              <p className="text-xs text-cyan-100 font-medium">
                Train the speech engine to adapt to your accent and telecom pronunciation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Toast */}
        {successToast && (
          <div className="bg-emerald-600 text-white px-6 py-2.5 text-xs font-bold flex items-center gap-2 shadow-md animate-in slide-in-from-top-2">
            <Sparkles className="w-4 h-4 text-emerald-200 animate-spin" />
            <span>{successToast}</span>
          </div>
        )}

        {/* Tab Selector */}
        <div className="flex border-b border-slate-200 bg-slate-50/70 px-6 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('practice')}
            className={`pb-3 px-4 text-xs font-black flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'practice'
                ? 'border-[#005696] text-[#005696]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Mic className="w-4 h-4" />
            <span>1. Voice Practice & Instant Teach</span>
          </button>
          <button
            onClick={() => setActiveTab('dictionary')}
            className={`pb-3 px-4 text-xs font-black flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'dictionary'
                ? 'border-[#005696] text-[#005696]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>2. Trained Vocabulary ({rules.length} Rules)</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {activeTab === 'practice' ? (
            <div className="space-y-6">
              {/* How it works guidance */}
              <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl flex items-start gap-3">
                <HelpCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div className="text-xs text-blue-900 leading-relaxed">
                  <p className="font-bold mb-1">How Accent Calibration Works:</p>
                  <ol className="list-decimal list-inside space-y-0.5 text-blue-800 font-medium">
                    <li>Click the mic below and pronounce any word (e.g. <i>"LOS Red", "PON indicator", "රවුටරේ wada na"</i>).</li>
                    <li>If the mic mishears your pronunciation, click <b>"✏️ Teach Correct Word"</b>.</li>
                    <li>Type the correct technical word and save. The model will instantly remember and adapt!</li>
                  </ol>
                </div>
              </div>

              {/* Mic Action Area */}
              <div className="p-6 bg-gradient-to-b from-slate-50 to-slate-100/70 border border-slate-200 rounded-2xl text-center space-y-4 shadow-xs">
                <div className="inline-flex items-center justify-center p-3 rounded-full bg-white shadow-sm border border-slate-200 mb-1">
                  <button
                    onClick={isListening ? stopPracticeMic : startPracticeMic}
                    className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                      isListening
                        ? 'bg-rose-600 text-white animate-pulse ring-8 ring-rose-200 shadow-lg'
                        : 'bg-gradient-to-r from-[#005696] to-[#00A3E0] text-white hover:scale-105 active:scale-95 shadow-md'
                    }`}
                  >
                    {isListening ? <MicOff className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
                  </button>
                </div>

                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    {isListening ? '🎙️ Listening... Speak naturally now' : 'Click Mic to Test Your Pronunciation'}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Target Language: <span className="font-bold text-[#005696]">{voiceLang === 'si-LK' ? '🇱🇰 සිංහල (si-LK)' : '🌐 English / Singlish (en-US)'}</span>
                  </p>
                </div>

                {/* Transcription Card */}
                {(rawCaptured || normalizedResult) && (
                  <div className="mt-4 p-4 bg-white rounded-xl border border-slate-200 text-left space-y-3 shadow-xs">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <span className="text-[11px] font-black uppercase text-slate-500 tracking-wider">
                        Speech Engine Feedback
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800">
                        {isListening ? 'Streaming...' : 'Captured'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
                        <span className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                          1. Raw Browser Captured
                        </span>
                        <p className="font-mono text-slate-700 italic">
                          "{rawCaptured || '...'}"
                        </p>
                      </div>

                      <div className="p-3 bg-emerald-50/60 rounded-lg border border-emerald-200/80">
                        <span className="block text-[10px] font-bold uppercase text-emerald-700 mb-1 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-emerald-600" />
                          2. Normalized With Trained Accent
                        </span>
                        <p className="font-bold text-emerald-900">
                          "{normalizedResult || '...'}"
                        </p>
                      </div>
                    </div>

                    {/* Verification & Teach Prompt */}
                    {!isListening && rawCaptured && (
                      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 text-xs text-slate-700">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Did the system transcribe this accurately?</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => showNotification('Great! Pronunciation verified and aligned.')}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Yes, Correct!</span>
                          </button>
                          <button
                            onClick={handleOpenTeachForm}
                            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
                          >
                            <Sliders className="w-3.5 h-3.5" />
                            <span>✏️ No, Teach Correct Word</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Teach Form Expansion */}
                {showTeachForm && (
                  <div className="mt-4 p-5 bg-amber-50/70 border border-amber-200 rounded-xl text-left space-y-4 animate-in slide-in-from-top-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-600" />
                        <h4 className="text-xs font-black uppercase text-amber-900 tracking-wider">
                          Train Voice Accent Rule
                        </h4>
                      </div>
                      <button
                        onClick={() => setShowTeachForm(false)}
                        className="text-amber-700 hover:text-amber-900 p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          When the mic hears this (Misheard word/phrase):
                        </label>
                        <input
                          type="text"
                          value={teachMisheard}
                          onChange={(e) => setTeachMisheard(e.target.value)}
                          placeholder="e.g. phone light, laws red, water now"
                          className="w-full px-3 py-2 bg-white border border-amber-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-amber-500 outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Auto-correct it to this (What you actually meant):
                        </label>
                        <input
                          type="text"
                          value={teachCorrect}
                          onChange={(e) => setTeachCorrect(e.target.value)}
                          placeholder="e.g. PON light, LOS Red, wada na"
                          className="w-full px-3 py-2 bg-white border border-amber-300 rounded-lg text-xs font-bold text-[#005696] focus:ring-2 focus:ring-amber-500 outline-hidden"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-bold text-slate-600">Category:</span>
                        {(['telecom', 'sinhala', 'general'] as const).map((cat) => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => setTeachCategory(cat)}
                            className={`px-2 py-0.5 rounded text-[11px] font-bold capitalize transition-all ${
                              teachCategory === cat
                                ? 'bg-amber-600 text-white'
                                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={handleSaveTaughtRule}
                        className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-105 text-white rounded-lg text-xs font-black flex items-center gap-2 shadow-sm"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Save & Train Model</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Add Custom Rule Form */}
              <form onSubmit={handleAddManualRule} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
                    <Plus className="w-4 h-4 text-[#005696]" />
                    Add New Accent Rule Manually
                  </h4>
                  <span className="text-[10px] text-slate-400">Trained client-side in browser profile</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Misheard Speech Pattern:
                    </label>
                    <input
                      type="text"
                      value={manualMisheard}
                      onChange={(e) => setManualMisheard(e.target.value)}
                      placeholder="e.g. phone steady / ලොස්ට් රෙඩ්"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium focus:ring-2 focus:ring-[#005696] outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Correct Technical Term:
                    </label>
                    <input
                      type="text"
                      value={manualCorrect}
                      onChange={(e) => setManualCorrect(e.target.value)}
                      placeholder="e.g. PON Steady / LOS Red"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-[#005696] focus:ring-2 focus:ring-[#005696] outline-hidden"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-bold text-slate-500">Category:</span>
                    {(['telecom', 'sinhala', 'general'] as const).map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setManualCategory(cat)}
                        className={`px-2 py-0.5 rounded text-[11px] font-bold capitalize transition-all ${
                          manualCategory === cat
                            ? 'bg-[#005696] text-white'
                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#005696] hover:bg-[#004780] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-2xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Rule</span>
                  </button>
                </div>
              </form>

              {/* Rules List Header */}
              <div className="flex items-center justify-between gap-3">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search trained accent words..."
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs w-64 focus:ring-2 focus:ring-[#005696] outline-hidden"
                />

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleResetDefaults}
                    className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center gap-1.5 transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Reset Defaults</span>
                  </button>
                </div>
              </div>

              {/* Rules Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-600 font-black uppercase text-[10px] tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-4">Spoken / Misheard Pattern</th>
                      <th className="py-2.5 px-4"></th>
                      <th className="py-2.5 px-4">Calibrated Term</th>
                      <th className="py-2.5 px-4">Category</th>
                      <th className="py-2.5 px-4 text-center">Hits</th>
                      <th className="py-2.5 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {filteredRules.length > 0 ? (
                      filteredRules.map((rule) => (
                        <tr key={rule.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-2.5 px-4 font-mono text-slate-700">
                            "{rule.misheard}"
                          </td>
                          <td className="py-2.5 px-1 text-slate-400">
                            <ArrowRight className="w-3.5 h-3.5" />
                          </td>
                          <td className="py-2.5 px-4 font-bold text-[#005696]">
                            {rule.correct}
                          </td>
                          <td className="py-2.5 px-4">
                            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-slate-100 text-slate-600 capitalize">
                              {rule.category || 'telecom'}
                            </span>
                          </td>
                          <td className="py-2.5 px-4 text-center font-mono text-[11px] text-slate-500">
                            {rule.timesUsed || 1}
                          </td>
                          <td className="py-2.5 px-4 text-right">
                            <button
                              onClick={() => handleDeleteRule(rule.id)}
                              className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50 transition-colors"
                              title="Delete Rule"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-slate-400 italic">
                          No matching accent rules found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Learned vocabulary is active in all live call center mic sessions.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#005696] hover:bg-[#004780] text-white rounded-lg font-bold text-xs shadow-xs"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
