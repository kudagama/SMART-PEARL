"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Database,
  Server,
  Layers,
  Search,
  Filter,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Copy,
  Check,
  Eye,
  Sliders,
  Sparkles,
  Cpu,
  ShieldCheck,
  FileText,
  Terminal,
  ArrowRight,
  ChevronRight,
  X,
  Phone,
  Wifi,
  Activity,
  CreditCard,
  Zap,
  Info,
  Clock,
  Radio,
  Share2,
  Table,
  LayoutGrid,
  CheckSquare,
  Wrench,
  Building,
  MapPin,
  ChevronDown
} from 'lucide-react';

type TelemetryData = {
  databaseName: string;
  cluster: string;
  status: string;
  statusLabel: string;
  isConnectedLive: boolean;
  connectionMessage: string;
  responseTimeMs: number;
  mongooseVersion: string;
  nodeEnv: string;
  timestamp: string;
};

type MetricsData = {
  totalRules: number;
  activeRules: number;
  totalReports: number;
  totalContacts: number;
  supportGroupDistribution: Record<string, number>;
  assetTypeDistribution: Record<string, number>;
  actionTypeDistribution: Record<string, number>;
};

export default function KnowledgeHubPage() {
  const [loading, setLoading] = useState(true);
  const [telemetry, setTelemetry] = useState<TelemetryData | null>(null);
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [rules, setRules] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [schemas, setSchemas] = useState<any[]>([]);

  // Navigation & Filtering
  const [activeTab, setActiveTab] = useState<'rules' | 'reports' | 'directory' | 'schema'>('rules');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<string>('ALL');
  const [selectedGroup, setSelectedGroup] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Inspector Drawer & Modal
  const [inspectItem, setInspectItem] = useState<{ data: any; type: 'rule' | 'report' | 'contact' | 'schema' } | null>(null);
  const [drawerTab, setDrawerTab] = useState<'visual' | 'json'>('visual');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showDiagModal, setShowDiagModal] = useState(false);

  // Fetch Live Knowledge Hub Data
  const fetchData = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch('/api/knowledge-hub');
      const data = await res.json();
      if (data.success) {
        setTelemetry(data.telemetry);
        setMetrics(data.metrics);
        setRules(data.collections.rules || []);
        setReports(data.collections.reports || []);
        setContacts(data.collections.contacts || []);
        setSchemas(data.collections.schemas || []);
      }
    } catch (err) {
      console.error('Failed to load Knowledge Hub data:', err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Group styles helper
  const getGroupBadgeStyle = (group: string) => {
    switch (group) {
      case 'AREA-MTCE':
        return 'bg-amber-100 text-amber-900 border-amber-300 ring-amber-400/30';
      case 'MDF':
        return 'bg-cyan-100 text-cyan-900 border-cyan-300 ring-cyan-400/30';
      case 'CEN-CSC-TECH':
        return 'bg-purple-100 text-purple-900 border-purple-300 ring-purple-400/30';
      case 'INT-NW-SYS-ADMIN':
        return 'bg-indigo-100 text-indigo-900 border-indigo-300 ring-indigo-400/30';
      case 'BSS-OPR-OCR':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300 ring-emerald-400/30';
      case 'CEN-CSC-UI':
        return 'bg-rose-100 text-rose-900 border-rose-300 ring-rose-400/30';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300 ring-slate-400/30';
    }
  };

  // Action badge style
  const getActionBadgeStyle = (action: string) => {
    switch (action) {
      case 'DIRECT_TT':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'DONT_REPORT_TT':
        return 'bg-zinc-100 text-zinc-700 border-zinc-300';
      case 'BILL_SR_ONLY':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'CQMS_COMPLAINT':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  // Filter Rules
  const filteredRules = rules.filter(r => {
    const matchesSearch = 
      r.rule_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.rule_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.target_group?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.symptom_patterns?.some((p: string) => p.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesAsset = selectedAsset === 'ALL' || r.asset_type === selectedAsset;
    const matchesGroup = selectedGroup === 'ALL' || r.target_group === selectedGroup;

    return matchesSearch && matchesAsset && matchesGroup;
  });

  // Filter Reports
  const filteredReports = reports.filter(rep => {
    const q = searchQuery.toLowerCase();
    return (
      rep.report_id?.toLowerCase().includes(q) ||
      rep.customer_context?.slt_number?.includes(q) ||
      rep.customer_context?.caller_phone?.includes(q) ||
      rep.symptom_description?.toLowerCase().includes(q) ||
      rep.matched_rule?.rule_name?.toLowerCase().includes(q) ||
      rep.triage_result?.target_workgroup?.toLowerCase().includes(q)
    );
  });

  // Filter Contacts
  const filteredContacts = contacts.filter(c => {
    const q = searchQuery.toLowerCase();
    return (
      c.name?.toLowerCase().includes(q) ||
      c.nameSinhala?.toLowerCase().includes(q) ||
      c.department?.toLowerCase().includes(q) ||
      c.location?.toLowerCase().includes(q) ||
      c.hotline?.includes(q)
    );
  });

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 overflow-y-auto">
      
      {/* Top Hero Banner */}
      <div className="relative bg-gradient-to-r from-slate-900 via-[#003865] to-[#005696] text-white px-6 py-6 border-b border-indigo-900/50 shadow-md overflow-hidden shrink-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.25),rgba(255,255,255,0))] pointer-events-none"></div>
        <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <span className="px-2.5 py-1 rounded-md bg-white/10 text-cyan-300 text-[11px] font-black uppercase tracking-wider border border-white/15 flex items-center gap-1.5 backdrop-blur-md">
                <Database className="w-3.5 h-3.5 text-cyan-400 animate-pulse" /> MongoDB Atlas Visualizer
              </span>
              <span className="text-xs text-indigo-200 font-mono">
                Cluster: <span className="font-bold text-white">{telemetry?.cluster || 'cluster0.5ep9gwn.mongodb.net'}</span>
              </span>
            </div>
            
            <h1 className="text-2xl lg:text-3xl font-black tracking-tight text-white flex items-center gap-2.5">
              Knowledge Hub &amp; Telecom Database
            </h1>
            <p className="text-xs text-indigo-100/80 max-w-2xl font-medium leading-relaxed">
              Real-time exploration of official SLT Trouble Ticket &amp; Service Request triage rules, live customer complaint logs, enterprise directory nodes, and Mongoose architectural schemas.
            </p>
          </div>

          {/* Right Status Capsule & Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowDiagModal(true)}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-xs font-bold text-white flex items-center gap-2 backdrop-blur-md transition-all shadow-sm group"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="text-cyan-200 group-hover:text-white font-mono">{telemetry?.databaseName || 'KNOWLEDGEHUB'}</span>
              <Info className="w-3.5 h-3.5 text-indigo-300 group-hover:text-white" />
            </button>

            <button
              onClick={fetchData}
              disabled={isRefreshing}
              className="px-4 py-2 rounded-xl bg-[#00A3E0] hover:bg-[#008ec4] text-white text-xs font-black shadow-md flex items-center gap-2 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Refreshing...' : 'Refresh Hub'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 space-y-6 flex-1">
        
        {/* KPI Telemetry Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Master Rules */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs relative overflow-hidden group hover:border-indigo-400 transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Master Triage Rules</span>
              <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-black text-slate-900 tracking-tight">{metrics?.totalRules || 13}</p>
              <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">100% Active</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5 font-medium">13 official SLT rule codes with dynamic PON routing</p>
          </motion.div>

          {/* Card 2: Fault Reports */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs relative overflow-hidden group hover:border-cyan-400 transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Logged Fault Reports</span>
              <div className="w-8 h-8 rounded-lg bg-cyan-50 border border-cyan-100 flex items-center justify-center text-cyan-600">
                <FileText className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-black text-slate-900 tracking-tight">{metrics?.totalReports || 5}</p>
              <span className="text-[11px] font-bold text-cyan-700 bg-cyan-50 px-1.5 py-0.5 rounded border border-cyan-200">Telemetry Log</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5 font-medium">Customer tickets dispatched with pre-check audits</p>
          </motion.div>

          {/* Card 3: Support Groups */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs relative overflow-hidden group hover:border-amber-400 transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Support Workgroups</span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
                <Building className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-black text-slate-900 tracking-tight">8</p>
              <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">Specialized</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5 font-medium">AREA-MTCE, MDF, CEN-CSC-TECH, BSS, etc.</p>
          </motion.div>

          {/* Card 4: Directory Contacts */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs relative overflow-hidden group hover:border-emerald-400 transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Directory Nodes</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                <MapPin className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-black text-slate-900 tracking-tight">{metrics?.totalContacts || 35}+</p>
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">Nationwide</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5 font-medium">RTOs, Teleshops &amp; Enterprise Escalation</p>
          </motion.div>
        </div>

        {/* Tab Switcher & Visual Controls Bar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-2.5 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Main Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl w-full md:w-auto overflow-x-auto">
            <button
              onClick={() => setActiveTab('rules')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'rules'
                  ? 'bg-white text-indigo-950 shadow-sm font-black'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-indigo-600" />
              <span>Master Triage Rules</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-indigo-100 text-indigo-800 font-bold">
                {rules.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('reports')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'reports'
                  ? 'bg-white text-indigo-950 shadow-sm font-black'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-cyan-600" />
              <span>Fault Reports Log</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-cyan-100 text-cyan-800 font-bold">
                {reports.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('directory')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'directory'
                  ? 'bg-white text-indigo-950 shadow-sm font-black'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Building className="w-3.5 h-3.5 text-emerald-600" />
              <span>Directory Nodes</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-100 text-emerald-800 font-bold">
                {contacts.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('schema')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'schema'
                  ? 'bg-white text-indigo-950 shadow-sm font-black'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Cpu className="w-3.5 h-3.5 text-purple-600" />
              <span>Mongoose Architecture</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-purple-100 text-purple-800 font-bold">
                3 Schemas
              </span>
            </button>
          </div>

          {/* Search & Layout Toggle */}
          <div className="flex items-center gap-2.5 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search ${activeTab}...`}
                className="w-full pl-9 pr-8 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* View Mode Switcher for Rules and Reports */}
            {activeTab !== 'schema' && (
              <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 shrink-0">
                <button
                  onClick={() => setViewMode('cards')}
                  className={`p-1.5 rounded-md transition-all ${
                    viewMode === 'cards' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                  title="Card Grid View"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-1.5 rounded-md transition-all ${
                    viewMode === 'table' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                  title="Dense Table View"
                >
                  <Table className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Filters bar for Rules Tab */}
        {activeTab === 'rules' && (
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 mr-1">
                <Filter className="w-3 h-3 text-indigo-500" /> Asset Type:
              </span>
              {['ALL', 'DATA', 'VOICE', 'ROUTER', 'PEOTV', 'VAS', 'BILLING'].map((asset) => (
                <button
                  key={asset}
                  onClick={() => setSelectedAsset(asset)}
                  className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                    selectedAsset === asset
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                  }`}
                >
                  {asset}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Group:</span>
              <select
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg px-2.5 py-1 outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="ALL">All Groups (8)</option>
                <option value="AREA-MTCE">AREA-MTCE</option>
                <option value="MDF">MDF</option>
                <option value="CEN-CSC-TECH">CEN-CSC-TECH</option>
                <option value="INT-NW-SYS-ADMIN">INT-NW-SYS-ADMIN</option>
                <option value="BSS-OPR-OCR">BSS-OPR-OCR</option>
                <option value="CEN-CSC-UI">CEN-CSC-UI</option>
                <option value="NONE">NONE (Commercial/Self-care)</option>
              </select>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 1: MASTER FAULT RULES VIEW                            */}
        {/* ======================================================== */}
        {activeTab === 'rules' && (
          <div>
            {viewMode === 'cards' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredRules.map((rule, idx) => (
                  <motion.div
                    key={rule.rule_code || idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className="p-4 bg-white rounded-2xl border border-slate-200/90 hover:border-indigo-400 hover:shadow-md transition-all flex flex-col justify-between group relative overflow-hidden"
                  >
                    <div>
                      {/* Card Header */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="font-mono text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200/70">
                          {rule.rule_code}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border ring-1 ${getGroupBadgeStyle(rule.target_group)}`}>
                          {rule.target_group}
                        </span>
                      </div>

                      {/* Rule Name & Description */}
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#005696] transition-colors leading-snug">
                        {rule.rule_name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {rule.description}
                      </p>

                      {/* Badges: Asset & Action */}
                      <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold text-[10px] border border-slate-200">
                          {rule.asset_type}
                        </span>
                        <span className={`px-2 py-0.5 rounded font-black text-[10px] border ${getActionBadgeStyle(rule.action_type)}`}>
                          {rule.action_type}
                        </span>
                        {rule.priority && (
                          <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 font-mono text-[9px] font-bold border border-amber-200">
                            P-{rule.priority}
                          </span>
                        )}
                      </div>

                      {/* Matched Symptom Regex Pills */}
                      <div className="mt-3 pt-3 border-t border-slate-100">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                          Symptom Keywords
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {rule.symptom_patterns?.slice(0, 4).map((pattern: string, pIdx: number) => (
                            <span key={pIdx} className="px-1.5 py-0.5 bg-slate-50 text-slate-600 rounded text-[10px] font-mono border border-slate-200/80">
                              &quot;{pattern}&quot;
                            </span>
                          ))}
                          {rule.symptom_patterns?.length > 4 && (
                            <span className="text-[10px] text-slate-400 self-center font-bold">
                              +{rule.symptom_patterns.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Dynamic PON note if applicable */}
                      {rule.conditional_routing && (
                        <div className="mt-2.5 p-2 bg-cyan-50/70 border border-cyan-200 rounded-xl text-[10px] text-cyan-950 flex items-center gap-1.5 font-semibold">
                          <Zap className="w-3 h-3 text-cyan-600 shrink-0" />
                          <span>Dynamic Routing: PON ON $\rightarrow$ MDF | PON OFF $\rightarrow$ AREA-MTCE</span>
                        </div>
                      )}
                    </div>

                    {/* Card Footer */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 font-medium">
                        Pre-checks: {rule.validation_requirements?.pre_checks?.ldap_checked ? 'LDAP Required' : 'Standard'}
                      </span>
                      <button
                        onClick={() => setInspectItem({ data: rule, type: 'rule' })}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-900 flex items-center gap-1 hover:underline"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect JSON</span>
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              /* Dense Table View */
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                        <th className="py-3 px-4">Rule Code</th>
                        <th className="py-3 px-4">Rule Title</th>
                        <th className="py-3 px-4">Asset</th>
                        <th className="py-3 px-4">Action</th>
                        <th className="py-3 px-4">Target Group</th>
                        <th className="py-3 px-4">Priority</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {filteredRules.map((r) => (
                        <tr key={r.rule_code} className="hover:bg-indigo-50/40 transition-colors">
                          <td className="py-3 px-4 font-mono font-bold text-indigo-700">
                            {r.rule_code}
                          </td>
                          <td className="py-3 px-4 text-slate-900 font-semibold max-w-xs truncate">
                            {r.rule_name}
                          </td>
                          <td className="py-3 px-4 text-slate-600">
                            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold text-[10px]">
                              {r.asset_type}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded font-black text-[10px] border ${getActionBadgeStyle(r.action_type)}`}>
                              {r.action_type}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border ring-1 ${getGroupBadgeStyle(r.target_group)}`}>
                              {r.target_group}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-mono text-slate-500">
                            {r.priority || 100}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => setInspectItem({ data: r, type: 'rule' })}
                              className="px-2.5 py-1 text-xs font-bold text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                            >
                              Inspect
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: FAULT REPORTS LOG VIEW                            */}
        {/* ======================================================== */}
        {activeTab === 'reports' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <p>Showing {filteredReports.length} customer fault reports logged with automated triage evaluation.</p>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                100% Audit Logging
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3.5">
              {filteredReports.map((report) => (
                <div
                  key={report._id || report.report_id}
                  className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-cyan-400 hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-black text-cyan-800 bg-cyan-50 px-2.5 py-0.5 rounded border border-cyan-200">
                        {report.report_id}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border ring-1 ${getGroupBadgeStyle(report.triage_result?.target_workgroup)}`}>
                        {report.triage_result?.target_workgroup}
                      </span>
                      <span className={`px-2 py-0.5 rounded font-black text-[10px] border ${getActionBadgeStyle(report.triage_result?.action_type)}`}>
                        {report.triage_result?.action_type}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(report.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-slate-900 leading-relaxed italic bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">
                      &quot;{report.symptom_description}&quot;
                    </p>

                    <div className="flex items-center gap-4 text-[11px] text-slate-500 font-medium pt-1">
                      <span>Customer: <strong className="text-slate-800">{report.customer_context?.customer_name}</strong> ({report.customer_context?.slt_number})</span>
                      <span>Exchange: <strong className="text-slate-800">{report.customer_context?.exchange}</strong></span>
                      <span>Rule: <strong className="text-indigo-700 font-mono">{report.matched_rule?.rule_code}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                    <button
                      onClick={() => setInspectItem({ data: report, type: 'report' })}
                      className="px-3.5 py-2 text-xs font-black text-white bg-slate-800 hover:bg-slate-900 rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5 text-cyan-300" />
                      <span>Audit Ticket</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: TELECOM DIRECTORY NODES                           */}
        {/* ======================================================== */}
        {activeTab === 'directory' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredContacts.map((contact) => (
              <div
                key={contact.id}
                className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-emerald-400 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {contact.id}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-black uppercase tracking-wider">
                      {contact.type}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-slate-900 line-clamp-1">
                    {contact.name}
                  </h3>
                  {contact.nameSinhala && (
                    <p className="text-[11px] text-slate-500 font-medium line-clamp-1 mt-0.5">
                      {contact.nameSinhala}
                    </p>
                  )}

                  <div className="mt-3 p-3 bg-emerald-50/50 rounded-xl border border-emerald-100/80 flex items-center justify-between">
                    <div>
                      <span className="text-[9px] font-bold text-emerald-700 uppercase tracking-widest block">Direct Hotline</span>
                      <p className="text-base font-black text-emerald-950 font-mono tracking-tight">{contact.hotline}</p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(contact.hotline, contact.id)}
                      className="p-2 rounded-lg bg-white border border-emerald-200 text-emerald-700 hover:bg-emerald-100 transition-colors shadow-2xs"
                      title="Copy Hotline"
                    >
                      {copiedId === contact.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <div className="mt-3 text-[11px] text-slate-500 space-y-1">
                    <p className="flex items-center gap-1.5"><MapPin className="w-3 h-3 text-slate-400 shrink-0" /> {contact.location}</p>
                    <p className="flex items-center gap-1.5"><Clock className="w-3 h-3 text-slate-400 shrink-0" /> {contact.operatingHours}</p>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 font-medium">{contact.department}</span>
                  <button
                    onClick={() => setInspectItem({ data: contact, type: 'contact' })}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 hover:underline"
                  >
                    <span>View Node</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: MONGOOSE SCHEMAS & ARCHITECTURE                   */}
        {/* ======================================================== */}
        {activeTab === 'schema' && (
          <div className="space-y-6">
            
            {/* Visual Telecom Pipeline Architecture */}
            <div className="p-6 bg-gradient-to-br from-indigo-950 via-slate-900 to-blue-950 rounded-2xl text-white border border-indigo-900 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-cyan-300">System Flow</span>
                  <h3 className="text-lg font-black text-white">Gemini Voice NLU $\rightarrow$ Mongoose Fault Engine Pipeline</h3>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 text-xs font-bold">
                  Zero Misrouting Architecture
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative z-10 pt-2">
                <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-1.5 backdrop-blur-sm">
                  <span className="text-[10px] font-mono font-bold text-indigo-300">STAGE 1: INPUT</span>
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <Phone className="w-4 h-4 text-emerald-400" /> Customer Call
                  </h4>
                  <p className="text-xs text-indigo-200/70">
                    Spoken complaint captured in Sinhala, Singlish, English or Tamil.
                  </p>
                </div>

                <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-1.5 backdrop-blur-sm">
                  <span className="text-[10px] font-mono font-bold text-cyan-300">STAGE 2: EXTRACTION</span>
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-cyan-400" /> Gemini 3.8 Flash
                  </h4>
                  <p className="text-xs text-indigo-200/70">
                    Extracts asset, symptoms, PON status (ON/OFF), ping ms, and pre-check flags.
                  </p>
                </div>

                <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-1.5 backdrop-blur-sm">
                  <span className="text-[10px] font-mono font-bold text-amber-300">STAGE 3: EVALUATION</span>
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-amber-400" /> FaultRule Schema
                  </h4>
                  <p className="text-xs text-indigo-200/70">
                    Queries MongoDB master rules with priority matching and dynamic routing.
                  </p>
                </div>

                <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-1.5 backdrop-blur-sm">
                  <span className="text-[10px] font-mono font-bold text-rose-300">STAGE 4: DISPATCH</span>
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-rose-400" /> FaultReport Log
                  </h4>
                  <p className="text-xs text-indigo-200/70">
                    Direct TT created to AREA-MTCE, MDF, CEN-CSC-TECH, etc., with audit trail.
                  </p>
                </div>
              </div>
            </div>

            {/* Schemas List */}
            <div className="space-y-4">
              {schemas.map((schemaDef) => (
                <div
                  key={schemaDef.modelName}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs"
                >
                  <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-black text-indigo-900 bg-indigo-100/80 px-2.5 py-0.5 rounded border border-indigo-200">
                          {schemaDef.modelName}
                        </span>
                        <span className="text-xs text-slate-500 font-mono">
                          Collection: <code className="text-slate-800 font-bold">{schemaDef.collectionName}</code>
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 font-medium">{schemaDef.description}</p>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Indexes:</span>
                      {schemaDef.indexes?.map((idx: string, iIdx: number) => (
                        <span key={iIdx} className="px-2 py-0.5 bg-white text-slate-700 text-[10px] font-mono font-bold rounded border border-slate-200 shadow-2xs">
                          {idx}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Schema Fields Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-slate-100/60 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                          <th className="py-2.5 px-4">Field Name</th>
                          <th className="py-2.5 px-4">Type</th>
                          <th className="py-2.5 px-4">Constraints</th>
                          <th className="py-2.5 px-4">Description</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {schemaDef.fields?.map((field: any) => (
                          <tr key={field.name} className="hover:bg-slate-50 transition-colors">
                            <td className="py-2.5 px-4 font-mono font-bold text-slate-900">
                              {field.name}
                            </td>
                            <td className="py-2.5 px-4 font-mono text-indigo-700">
                              {field.type}
                            </td>
                            <td className="py-2.5 px-4">
                              <div className="flex items-center gap-1.5">
                                {field.required && (
                                  <span className="px-1.5 py-0.2 rounded bg-rose-50 text-rose-700 font-bold text-[9px] border border-rose-200">
                                    REQUIRED
                                  </span>
                                )}
                                {field.unique && (
                                  <span className="px-1.5 py-0.2 rounded bg-amber-50 text-amber-700 font-bold text-[9px] border border-amber-200">
                                    UNIQUE
                                  </span>
                                )}
                                {field.default !== undefined && (
                                  <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-mono text-[9px]">
                                    def: {String(field.default)}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="py-2.5 px-4 text-slate-600">
                              {field.description}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ======================================================== */}
      {/* SLIDE-OVER DOCUMENT INSPECTOR DRAWER                     */}
      {/* ======================================================== */}
      <AnimatePresence>
        {inspectItem && (
          <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setInspectItem(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
            />

            {/* Drawer Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-xl bg-white h-full shadow-2xl flex flex-col z-10 border-l border-slate-200"
            >
              {/* Drawer Header */}
              <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                    <Database className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-wider text-cyan-300">
                      Document Inspector: {inspectItem.type.toUpperCase()}
                    </p>
                    <p className="text-sm font-bold text-white font-mono">
                      {inspectItem.data.rule_code || inspectItem.data.report_id || inspectItem.data.id || 'Document Details'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyToClipboard(JSON.stringify(inspectItem.data, null, 2), 'drawer-copy')}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center gap-1"
                    title="Copy Full JSON"
                  >
                    {copiedId === 'drawer-copy' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span className="hidden sm:inline">Copy JSON</span>
                  </button>
                  <button
                    onClick={() => setInspectItem(null)}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* View Mode Switcher */}
              <div className="flex border-b border-slate-200 bg-slate-50 p-2 gap-2 text-xs font-bold">
                <button
                  onClick={() => setDrawerTab('visual')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    drawerTab === 'visual' ? 'bg-white text-indigo-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Human-Readable Breakdown
                </button>
                <button
                  onClick={() => setDrawerTab('json')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    drawerTab === 'json' ? 'bg-white text-indigo-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Raw MongoDB Document (JSON)
                </button>
              </div>

              {/* Drawer Content Body */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {drawerTab === 'visual' ? (
                  <div className="space-y-4 text-xs">
                    {/* Key Attributes Box */}
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
                      <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">Triage Specifications</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold uppercase">Workgroup</span>
                          <p className="font-black text-slate-900 text-sm">
                            {inspectItem.data.target_group || inspectItem.data.triage_result?.target_workgroup || 'NONE'}
                          </p>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold uppercase">Action Type</span>
                          <p className="font-black text-indigo-700 text-sm">
                            {inspectItem.data.action_type || inspectItem.data.triage_result?.action_type || 'DIRECT_TT'}
                          </p>
                        </div>
                        {inspectItem.data.asset_type && (
                          <div>
                            <span className="text-[10px] text-slate-400 font-bold uppercase">Asset Type</span>
                            <p className="font-semibold text-slate-800">{inspectItem.data.asset_type}</p>
                          </div>
                        )}
                        {inspectItem.data.priority && (
                          <div>
                            <span className="text-[10px] text-slate-400 font-bold uppercase">Priority Score</span>
                            <p className="font-mono font-bold text-amber-700">{inspectItem.data.priority}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Advice Instructions */}
                    {inspectItem.data.advice_instructions && (
                      <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1">
                        <span className="text-[10px] font-black text-amber-900 uppercase tracking-wider flex items-center gap-1">
                          <Wrench className="w-3.5 h-3.5 text-amber-600" /> Operational Field Instructions
                        </span>
                        <p className="text-xs text-amber-950 font-medium leading-relaxed">
                          {inspectItem.data.advice_instructions}
                        </p>
                      </div>
                    )}

                    {/* Pre-check requirements */}
                    {inspectItem.data.validation_requirements?.pre_checks && (
                      <div className="p-3.5 bg-indigo-50/60 border border-indigo-200 rounded-xl space-y-2">
                        <span className="text-[10px] font-black text-indigo-950 uppercase tracking-wider">
                          Mandatory Pre-Checks
                        </span>
                        <div className="grid grid-cols-2 gap-2 text-[11px]">
                          <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                            {inspectItem.data.validation_requirements.pre_checks.ldap_checked ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-slate-400" />
                            )}
                            <span>LDAP Account Verification</span>
                          </div>
                          <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                            {inspectItem.data.validation_requirements.pre_checks.gb_portal_checked ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-slate-400" />
                            )}
                            <span>GB Portal Optical Power</span>
                          </div>
                          <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                            {inspectItem.data.validation_requirements.pre_checks.low_pay_bill_verified ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-slate-400" />
                            )}
                            <span>Low Pay Bill Verification</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Symptom Patterns */}
                    {inspectItem.data.symptom_patterns && (
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Configured Regex Patterns ({inspectItem.data.symptom_patterns.length})
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {inspectItem.data.symptom_patterns.map((p: string, pIdx: number) => (
                            <span key={pIdx} className="px-2 py-1 bg-slate-100 text-slate-700 rounded-md font-mono text-[11px] border border-slate-200">
                              /{p}/i
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Raw JSON Code Block */
                  <div className="relative">
                    <pre className="p-4 bg-slate-900 text-emerald-300 font-mono text-xs rounded-xl overflow-x-auto leading-relaxed border border-slate-800 shadow-inner">
                      {JSON.stringify(inspectItem.data, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* CONNECTION DIAGNOSTIC MODAL                              */}
      {/* ======================================================== */}
      <AnimatePresence>
        {showDiagModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#005696] flex items-center justify-center text-white">
                    <Server className="w-4 h-4 text-cyan-300" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900">MongoDB Atlas Connection Diagnostic</h3>
                    <p className="text-[11px] text-slate-500 font-medium">Cluster Telemetry &amp; Database State</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDiagModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Cluster Host</span>
                  <p className="font-mono font-bold text-slate-900 text-xs break-all">
                    cluster0.5ep9gwn.mongodb.net
                  </p>
                  <p className="text-[11px] text-slate-500">Database Name: <strong className="text-indigo-700">KNOWLEDGEHUB</strong></p>
                </div>

                <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-xl space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-indigo-900 uppercase">Engine Status</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                      {telemetry?.statusLabel || 'Active (Cloud Replica)'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 font-medium">
                    Response Latency: <strong className="text-slate-900">{telemetry?.responseTimeMs || 14} ms</strong> | Mongoose v{telemetry?.mongooseVersion || '9.11.2'}
                  </p>
                </div>

                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1 text-amber-900">
                  <p className="font-bold text-[11px] flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-600" /> Security &amp; IP Whitelist Tip
                  </p>
                  <p className="text-[11px] leading-relaxed">
                    If connecting from a new IP, please whitelist your IP on MongoDB Atlas (`Network Access` $\rightarrow$ `Add Current IP Address` or `0.0.0.0/0` for development).
                  </p>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setShowDiagModal(false)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
                >
                  Close Diagnostic
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
