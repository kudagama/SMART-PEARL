"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Database,
  Layers,
  FileText,
  Building,
  Cpu,
  X,
  Copy,
  Check,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Globe,
  Phone,
  Wifi,
  Sparkles,
  Server,
  ArrowRight,
  ShieldCheck,
  Award,
  Users,
  Link as LinkIcon,
  BookOpen,
  Calendar,
  Grid,
  Maximize2
} from 'lucide-react';

// Sidebar Menu Links
const SIDEBAR_ITEMS = [
  { id: 'home', label: 'Home', active: true },
  { id: 'wfm', label: 'wfm - Duty Schedules' },
  { id: 'roster', label: 'Roster - Part Time Emp...' },
  { id: 'cca', label: 'CCA - Contract Basis' },
  { id: 'qms', label: 'ISO 9001:2015 QMS' },
  { id: 'tsu', label: 'CCD - TSU' },
  { id: 'qi', label: 'Qi Related Info' },
  { id: 'ecom', label: 'e-Communications' },
  { id: 'bbpkg', label: 'Broadband Package Ca...' },
  { id: 'conv', label: 'Conversations' },
  { id: 'docs', label: 'Documents' },
];

// 19 Main Category Tiles with gradients matching SLT Portal
const CATEGORY_TILES = [
  { id: 'megaline', title: 'Megaline', bg: 'from-[#006e52] to-[#004f44]', desc: 'PSTN Copper Voice, Fixed Line, Fault Reporting, Line tests, Dial tone restoration', asset: 'VOICE', ruleCode: 'RULE_FIBER_VOICE_LINE_FAULT' },
  { id: 'broadband', title: 'Broadband', bg: 'from-[#006e52] to-[#004f44]', desc: 'ADSL & FTTH Broadband Packages, Unlimited FUP, Speed issues, Thresholds', asset: 'DATA', ruleCode: 'RULE_UNLIMITED_SLOWNESS' },
  { id: 'bill_info', title: 'Bill Info', bg: 'from-[#006175] to-[#004359]', desc: 'Tariffs, e-Bill, Bill-Com, Dispute Handling, Disconnection Policies', asset: 'BILLING', ruleCode: 'RULE_4G_RELOAD_THIRD_PARTY_CHANNELS' },
  { id: 'faq', title: 'FAQ', bg: 'from-[#005e54] to-[#00383b]', desc: 'Customer Service Standard FAQs, Escalation Protocols, Contact Center Guide', asset: 'GENERAL', ruleCode: null },
  { id: 'slt_fibre', title: 'SLT Fibre', bg: 'from-[#007f5f] to-[#005f52]', desc: 'Fibre To The Home (FTTH), LOS Red Indicator, ONT Router, Optical Cable Cut', asset: 'DATA', ruleCode: 'RULE_LOS_RED' },
  { id: 'peo_tv', title: 'PEO TV', bg: 'from-[#006b7a] to-[#004c5c]', desc: 'Set-Top Box (STB), Remote Controller Warranty, Channel Packages, Video On Demand', asset: 'PEOTV', ruleCode: 'RULE_STB_ONT_ROUTER_FAULTY' },
  { id: 'slt_apps', title: 'SLT Apps', bg: 'from-[#007f5f] to-[#005f52]', desc: 'MySLT Self-care app, mCash integration, PEO Mobile, Bill payments', asset: 'VAS', ruleCode: 'RULE_CQMS_VAS_AND_PROMOS' },
  { id: 'qed', title: 'QED & Other Support', bg: 'from-[#005c6e] to-[#003a4d]', desc: 'Quality Enhancement Division, Customer Complaints, Escalations to Supervisor', asset: 'GENERAL', ruleCode: 'RULE_CQMS_VAS_AND_PROMOS' },
  { id: '4g_lte', title: '4G LTE', bg: 'from-[#007f5f] to-[#005f52]', desc: 'Fixed Wireless Broadband, 4G Prepaid & Postpaid Reloads, Dealer & Bank Payments', asset: 'BILLING', ruleCode: 'RULE_4G_RELOAD_DIRECT_CHANNELS' },
  { id: 'vas', title: 'Value Added Services', bg: 'from-[#006b7a] to-[#004c5c]', desc: 'Data Addons, Caller Ring Tunes, Voice Mail, Data Consumption Deductions', asset: 'VAS', ruleCode: 'RULE_ADDON_PROVISIONING_ERROR' },
  { id: 'self_services', title: 'SLT Self Services', bg: 'from-[#007f5f] to-[#005f52]', desc: 'USSD codes, Web Self-Care, Auto Password Reset, SMS balance inquiry', asset: 'VAS', ruleCode: 'RULE_CQMS_VAS_AND_PROMOS' },
  { id: 'enterprise', title: 'Enterprise Sales', bg: 'from-[#005c6e] to-[#003a4d]', desc: 'Corporate Leased Lines, MPLS, Cloud Hosting, SIP Trunking, SLA contracts', asset: 'GENERAL', ruleCode: null },
  { id: 'promotions', title: 'Promotions', bg: 'from-[#007f5f] to-[#005f52]', desc: 'Seasonal Promotions, Free Router Upgrades, Timely Pay Discounts, Double Data', asset: 'VAS', ruleCode: 'RULE_CQMS_VAS_AND_PROMOS' },
  { id: 'slt_mail', title: 'SLT Mail', bg: 'from-[#006b7a] to-[#004c5c]', desc: 'Customer email (mail.slt.lk), Webmail configuration, SMTP / POP3 settings', asset: 'DATA', ruleCode: null },
  { id: 'equipment', title: 'Equipment Sales', bg: 'from-[#007f5f] to-[#005f52]', desc: 'Mesh Wi-Fi extenders, Dual-band routers, Replacement power adapters, Teleshop pricing', asset: 'ROUTER', ruleCode: 'RULE_ADSL_ROUTER_FAULTY' },
  { id: 'staff_packages', title: 'Staff Packages', bg: 'from-[#005c6e] to-[#003a4d]', desc: 'Employee broadband concessions, staff voice quotas, HR provisioning guides', asset: 'INTERNAL', ruleCode: null },
  { id: 'cc_systems', title: 'CC Systems', bg: 'from-[#007f5f] to-[#005f52]', desc: 'Contact Center Telephony, MINT CRM, Clarity C12, Cisco Finesse, Avaya guides', asset: 'INTERNAL', ruleCode: null },
  { id: 'rebuilding', title: 'Rebuilding Sri Lanka', bg: 'from-[#006b7a] to-[#004c5c]', desc: 'National Digitization, e-Government initiatives, Rural connectivity, CSR Projects', asset: 'GENERAL', ruleCode: null },
  { id: 'latest_updates', title: 'LATEST UPDATES', bg: 'from-[#008f58] to-[#006346]', desc: 'Urgent Operational Circulars, System maintenance schedules, New Triage guidelines', asset: 'CIRCULARS', ruleCode: null },
];

// COMMON LINKS Matrix organized into official SLT Portal columns
const COMMON_LINKS = {
  operational: {
    title: 'Operational',
    headerBg: 'bg-[#d8f3dc] text-[#1b4332] border-[#b7e4c7]',
    items: [
      { code: '(01)', name: 'MINT CRM', desc: 'Customer Relationship Management Portal for subscriber profiles, contact history, and service orders.', url: 'https://mintcrm.slt.lk' },
      { code: '(02)', name: 'C-Log', desc: 'Customer Complaint Logging Engine for Trouble Ticket dispatching.', url: '#' },
      { code: '(03)', name: 'C-Log Viewer', desc: 'Read-only inquiry for historical complaints and field officer visit updates.', url: '#' },
      { code: '(04)', name: 'CQMS', desc: 'Customer Quality Management System for commercial queries and promotional escalations.', url: '#' },
      { code: '(05)', name: 'sDesk', desc: 'Internal Service Desk for technical escalations and IT support tickets.', url: '#' },
      { code: '(06)', name: 'Clarity C12', desc: 'Telecommunications OSS/BSS Service Provisioning & Inventory Management System.', url: '#' },
      { code: '(07)', name: 'Railway VAS Portal', desc: 'Specialized enterprise portal for Railway communication lines and signaling circuits.', url: '#' },
      { code: '(08)', name: 'VAS Service portal', desc: 'Management console for activating and troubleshooting Value Added Services.', url: '#' },
      { code: '(09)', name: 'DBYD', desc: 'Dial Before You Dig - Outdoor excavation safety and underground fiber cable maps.', url: '#' },
    ]
  },
  broadbandEmail1: {
    title: 'Broadband/Email',
    headerBg: 'bg-[#e0f2fe] text-[#0369a1] border-[#bae6fd]',
    items: [
      { code: '(11)', name: 'LDAP (Old)', desc: 'Directory Access Protocol verification for subscriber broadband authentication credentials.', url: '#' },
      { code: '(12)', name: 'PW Reset', desc: 'Customer Broadband and Wi-Fi password reset utility.', url: '#' },
      { code: '(13)', name: 'PW Reset (back-up)', desc: 'Secondary failover server for customer password resets.', url: '#' },
      { code: '(14)', name: 'Top up (Old)', desc: 'Legacy extra data volume top-up tool for limited packages.', url: '#' },
      { code: '(15)', name: 'Top up New', desc: 'New High-Speed extra data booster allocation portal.', url: '#' },
      { code: '(16)', name: 'PCRF', desc: 'Policy and Charging Rules Function - Fair Usage Policy and bandwidth throttling management.', url: '#' },
      { code: '(17)', name: 'ADSL Usage (BB VAS)', desc: 'Detailed data session logs, IP address assignments, and traffic graphs.', url: '#' },
      { code: '(18)', name: 'ACS', desc: 'Auto Configuration Server (TR-069) for remote ONT router diagnosis and firmware updates.', url: '#' },
      { code: '(19)', name: 'Loyalty', desc: 'SLT Mobitel customer loyalty points and tier rewards dashboard.', url: '#' },
    ]
  },
  broadbandEmail2: {
    title: 'Broadband/Email',
    headerBg: 'bg-[#e0f2fe] text-[#0369a1] border-[#bae6fd]',
    items: [
      { code: '(21)', name: 'Email (slt.lk)', desc: 'Webmail login and customer email quota administration.', url: 'https://mail.slt.lk' },
      { code: '(22)', name: 'Coverage', desc: 'National Fibre (FTTH), 4G LTE, and Copper network coverage map.', url: '#' },
      { code: '(22)', name: 'BB Package Change-Admin', desc: 'Administrative interface for processing package upgrades and downgrades.', url: '#' },
      { code: '(23)', name: 'BB Package Change-Customer', desc: 'Self-care flow for customer initiated package changes.', url: '#' },
    ]
  },
  billing: {
    title: 'Billing',
    headerBg: 'bg-[#fce7f3] text-[#9d174d] border-[#fbcfe8]',
    items: [
      { code: '(31)', name: 'IBSIB', desc: 'Integrated Broadband & Subscriber Information Billing engine.', url: '#' },
      { code: '(32)', name: 'I-Hub', desc: 'Integration Hub connecting bank transactions and merchant payments.', url: '#' },
      { code: '(33)', name: 'CMS', desc: 'Credit Management System for tracking overdue invoices and credit limits.', url: '#' },
      { code: '(34)', name: 'CMSB', desc: 'Credit Management System Billing subsidiary module.', url: '#' },
      { code: '(35)', name: 'Bill View', desc: 'Real-time itemized bill viewer with PDF statement generator.', url: '#' },
      { code: '(36)', name: 'Online Payments', desc: 'Direct Visa / Mastercard / LankaQR online payment settlement console.', url: '#' },
      { code: '(37)', name: 'e-Bill Portal', desc: 'Electronic bill paperless email / SMS registration portal.', url: '#' },
      { code: '(38)', name: 'Bill-Com', desc: 'Billing Complaints and ledger reconciliation module.', url: '#' },
      { code: '(39)', name: 'SRS-T/L login', desc: 'Service Request System Team Leader supervisory approval login.', url: '#' },
    ]
  },
  other: {
    title: 'Other',
    headerBg: 'bg-[#f1f5f9] text-[#334155] border-[#cbd5e1]',
    items: [
      { code: '(41)', name: 'Insura', desc: 'Subscriber equipment and life insurance partner policy check.', url: '#' },
      { code: '(42)', name: 'Telehealth', desc: 'eChannelling and healthcare telemedicine directory integration.', url: '#' },
      { code: '(43)', name: 'Ananthaya', desc: 'Corporate intranet portal for SLT Mobitel internal news.', url: '#' },
      { code: '(44)', name: 'Railway Time schedule', desc: 'Official Sri Lanka Railways timetable reference for contact center directory queries.', url: '#' },
      { code: '(45)', name: 'Self Service Extra GB', desc: 'Emergency extra gigabyte provisioning module.', url: '#' },
      { code: '(46)', name: 'SLT Filmhall', desc: 'PEO TV Film Hall movie ordering and pay-per-view schedule.', url: '#' },
      { code: '(47)', name: 'R-WFM', desc: 'Regional Workforce Management for field technician dispatch tracking.', url: '#' },
      { code: '(48)', name: 'SISU Connect', desc: 'Student education package (Sisu Diriya) administration.', url: '#' },
      { code: '(49)', name: 'SRM', desc: 'Supplier & Regional Maintenance escalation route.', url: '#' },
    ]
  },
  internal: {
    title: 'Internal',
    headerBg: 'bg-[#f3e8ff] text-[#6b21a8] border-[#e9d5ff]',
    items: [
      { code: '(51)', name: 'AMS', desc: 'Asset Management System for equipment barcodes and serial tracking.', url: '#' },
      { code: '(52)', name: 'e-Teacher', desc: 'Staff e-learning and contact center agent training portal.', url: '#' },
      { code: '(53)', name: 'WFM', desc: 'Workforce Management agent shift scheduling and attendance.', url: '#' },
      { code: '(54)', name: 'ESAT', desc: 'Employee Satisfaction & Internal Staff Survey module.', url: '#' },
      { code: '(55)', name: 'Qi Notice board', desc: 'Quality Improvement Notice Board with real-time operational bulletins.', url: '#' },
      { code: '(56)', name: 'MINT Dashboard', desc: 'Executive Contact Center live call volume and queue monitor.', url: '#' },
      { code: '(57)', name: 'Meeting Manager', desc: 'Room reservation and inter-departmental meeting scheduler.', url: '#' },
      { code: '(58)', name: 'ESS', desc: 'Employee Self Service - Leave requests, pay slips, and HR records.', url: '#' },
      { code: '(59)', name: 'Contact Center KPI Meter', desc: 'Real-time Average Handling Time (AHT) and First Call Resolution (FCR) stats.', url: '#' },
    ]
  },
  documents: {
    title: 'Documents/Reports',
    headerBg: 'bg-[#fef9c3] text-[#854d0e] border-[#fde047]',
    items: [
      { code: '(61)', name: 'SLT Quality policy', desc: 'Official ISO 9001:2015 Quality Policy and Customer Charter guidelines.', url: '#' },
      { code: '(62)', name: 'LEA Codes/RTOMs', desc: 'Local Exchange Area (LEA) mapping and Regional Telecom Office (RTOM) zoning boundaries.', url: '#' },
    ]
  }
};

// "Our Team" Contact Center Leadership & Management
const TEAM_MEMBERS = [
  { name: 'Sonali Dalupotha', title: 'Deputy General Manager - Contact Center', role: 'Executive Leadership', initials: 'SD', color: 'bg-emerald-600' },
  { name: 'Nilanthi Amarasena', title: 'Manager - Contact Center Operations', role: 'Operations', initials: 'NA', color: 'bg-blue-600' },
  { name: 'Dilhani', title: 'Manager - Contact Centre Quality', role: 'Quality & Compliance', initials: 'DL', color: 'bg-indigo-600' },
  { name: 'Shiromi Wimalaratne', title: 'Senior Executive Assistant Manager', role: 'Executive Management', initials: 'SW', color: 'bg-purple-600' },
  { name: 'Chathurani Rathnayake', title: 'Senior Assistant Manager (Contact Center)', role: 'Shift Operations', initials: 'CR', color: 'bg-rose-600' },
  { name: 'Prasadi Fernando', title: 'Senior Assistant Manager (Contact Center)', role: 'Customer Experience', initials: 'PF', color: 'bg-amber-600' },
  { name: 'Mushi', title: 'Senior Assistant Manager (Contact Center)', role: 'Technical Escalations', initials: 'MU', color: 'bg-cyan-600' },
  { name: 'Mohamed Riyas', title: 'Contact Centre Associate - A15', role: 'Frontline Associate', initials: 'MR', color: 'bg-teal-600' },
];

export default function KnowledgeHubPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  // Filter Categories by search
  const filteredCategories = CATEGORY_TILES.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(id);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f4f7f9] overflow-hidden select-none">
      
      {/* 1. TOP SHAREPOINT & SLT HEADER BAR */}
      <div className="bg-[#005a9c] text-white px-4 py-2 flex items-center justify-between text-xs shadow-xs shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 cursor-pointer hover:opacity-80">
            <Grid className="w-4 h-4 text-white" />
            <span className="font-bold tracking-tight text-sm">SharePoint</span>
          </div>

          <div className="relative ml-4 w-72 md:w-96">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Knowledge Hub or Common Links..."
              className="w-full bg-white text-slate-800 text-xs pl-8 pr-6 py-1 rounded-sm focus:outline-none focus:ring-1 focus:ring-cyan-300"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <span className="hidden sm:inline text-cyan-100 font-medium">SLT-Mobitel Intranet</span>
          <div className="w-7 h-7 rounded-full bg-cyan-700 border border-cyan-400 flex items-center justify-center font-bold text-[11px] text-white">
            GJ
          </div>
        </div>
      </div>

      {/* 2. SLT MOBITEL BANNER & MENU NAVIGATION */}
      <div className="bg-white border-b border-slate-200 px-6 py-2.5 flex items-center justify-between shadow-2xs shrink-0">
        <div className="flex items-center gap-3">
          {/* SLT Logo & Tagline */}
          <div className="flex items-center gap-2">
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="font-black text-xl text-[#005696] tracking-tighter">SLT</span>
                <span className="font-black text-xl text-[#22b14c] tracking-tighter">MOBITEL</span>
              </div>
              <span className="text-[9px] text-[#005696] font-semibold -mt-1 tracking-wider uppercase">The Connection</span>
            </div>
          </div>
        </div>

        {/* Sub-menu bar */}
        <div className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-700">
          <span className="text-[#005696] font-black cursor-pointer hover:underline">Home</span>
          <span className="flex items-center gap-1 cursor-pointer hover:text-[#005696]">Groups <ChevronDown className="w-3 h-3 text-slate-400" /></span>
          <span className="flex items-center gap-1 cursor-pointer hover:text-[#005696]">eApplications <ChevronDown className="w-3 h-3 text-slate-400" /></span>
          <span className="flex items-center gap-1 cursor-pointer hover:text-[#005696]">General <ChevronDown className="w-3 h-3 text-slate-400" /></span>
          <span className="flex items-center gap-1 cursor-pointer hover:text-[#005696] text-[#005696] font-bold">Knowledge Base <ChevronDown className="w-3 h-3 text-[#005696]" /></span>
        </div>
      </div>

      {/* 3. MAIN WORKSPACE (SIDEBAR + CONTENT) */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Blue Sidebar */}
        <aside className="w-48 sm:w-56 bg-[#0066b2] text-white flex flex-col shrink-0 shadow-md border-r border-[#00508c] overflow-y-auto">
          <div className="py-2">
            {SIDEBAR_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedItem({ title: item.label, type: 'sidebar', desc: `SLT Internal Resource: ${item.label}. Used by Contact Center duty officers.` })}
                className={`w-full text-left px-4 py-2 text-xs font-medium transition-colors flex items-center justify-between group ${
                  item.active ? 'bg-[#004f8b] font-bold text-white border-l-4 border-cyan-300' : 'text-cyan-50 hover:bg-[#005a9e] hover:text-white'
                }`}
              >
                <span className="truncate">{item.label}</span>
                <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-cyan-300 shrink-0" />
              </button>
            ))}
          </div>

          <div className="mt-auto p-4 border-t border-[#005596] text-[10px] text-cyan-200/80 space-y-1">
            <p className="font-bold text-white">Contact Center Hub</p>
            <p>Smart PEARL Edition 2026</p>
          </div>
        </aside>

        {/* Right Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          
          {/* A. 19 MAIN CATEGORY TILES (4 COLUMNS GRID) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {filteredCategories.map((tile) => (
              <motion.button
                key={tile.id}
                whileHover={{ scale: 1.015, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedItem({ ...tile, type: 'tile' })}
                className={`bg-gradient-to-r ${tile.bg} text-white p-4 rounded-md shadow-sm text-center flex flex-col items-center justify-center min-h-[58px] transition-all hover:shadow-md cursor-pointer border border-white/10 relative overflow-hidden group`}
              >
                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                <h3 className="font-bold text-sm tracking-wide text-white drop-shadow-xs">
                  {tile.title}
                </h3>
                {tile.ruleCode && (
                  <span className="text-[9px] text-cyan-200 font-mono mt-0.5 opacity-80 group-hover:opacity-100">
                    Active Triage Rule
                  </span>
                )}
              </motion.button>
            ))}
          </div>

          {/* B. COMMON LINKS TABLE */}
          <div className="bg-white rounded-md border border-slate-300 shadow-sm overflow-hidden">
            {/* Table Header */}
            <div className="bg-slate-100 py-2.5 px-4 text-center border-b border-slate-300">
              <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center justify-center gap-2">
                <LinkIcon className="w-4 h-4 text-[#005696]" />
                <span className="border-b-2 border-[#005696] pb-0.5">COMMON LINKS</span>
              </h2>
            </div>

            {/* Responsive Table Columns */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-300 font-bold text-center">
                    <th className={`p-2 border-r border-slate-300 ${COMMON_LINKS.operational.headerBg}`}>Operational</th>
                    <th className={`p-2 border-r border-slate-300 ${COMMON_LINKS.broadbandEmail1.headerBg}`} colSpan={2}>Broadband/Email</th>
                    <th className={`p-2 border-r border-slate-300 ${COMMON_LINKS.billing.headerBg}`}>Billing</th>
                    <th className={`p-2 border-r border-slate-300 ${COMMON_LINKS.other.headerBg}`}>Other</th>
                    <th className={`p-2 border-r border-slate-300 ${COMMON_LINKS.internal.headerBg}`}>Internal</th>
                    <th className={`p-2 ${COMMON_LINKS.documents.headerBg}`}>Documents/<br/>Reports</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {/* Generating max 9 rows for alignment matching screenshot */}
                  {Array.from({ length: 9 }).map((_, rIdx) => {
                    const opItem = COMMON_LINKS.operational.items[rIdx];
                    const bb1Item = COMMON_LINKS.broadbandEmail1.items[rIdx];
                    const bb2Item = COMMON_LINKS.broadbandEmail2.items[rIdx];
                    const billItem = COMMON_LINKS.billing.items[rIdx];
                    const otherItem = COMMON_LINKS.other.items[rIdx];
                    const intItem = COMMON_LINKS.internal.items[rIdx];
                    const docItem = COMMON_LINKS.documents.items[rIdx];

                    return (
                      <tr key={rIdx} className="hover:bg-cyan-50/40 transition-colors">
                        
                        {/* 1. Operational */}
                        <td className="p-2 border-r border-slate-200 align-top bg-[#d8f3dc]/20">
                          {opItem && (
                            <button
                              onClick={() => setSelectedItem({ ...opItem, type: 'link', category: 'Operational' })}
                              className="text-left text-[#005696] hover:text-[#003865] hover:underline font-bold text-[11px] block"
                            >
                              <span className="font-semibold text-slate-800">{opItem.code}</span> {opItem.name}
                            </button>
                          )}
                        </td>

                        {/* 2. Broadband/Email Part 1 */}
                        <td className="p-2 border-r border-slate-200 align-top bg-[#e0f2fe]/20">
                          {bb1Item && (
                            <button
                              onClick={() => setSelectedItem({ ...bb1Item, type: 'link', category: 'Broadband/Email' })}
                              className="text-left text-[#005696] hover:text-[#003865] hover:underline font-bold text-[11px] block"
                            >
                              <span className="font-semibold text-slate-800">{bb1Item.code}</span> {bb1Item.name}
                            </button>
                          )}
                        </td>

                        {/* 3. Broadband/Email Part 2 */}
                        <td className="p-2 border-r border-slate-200 align-top bg-[#e0f2fe]/20">
                          {bb2Item && (
                            <button
                              onClick={() => setSelectedItem({ ...bb2Item, type: 'link', category: 'Broadband/Email' })}
                              className="text-left text-[#005696] hover:text-[#003865] hover:underline font-bold text-[11px] block"
                            >
                              <span className="font-semibold text-slate-800">{bb2Item.code}</span> {bb2Item.name}
                            </button>
                          )}
                        </td>

                        {/* 4. Billing */}
                        <td className="p-2 border-r border-slate-200 align-top bg-[#fce7f3]/20">
                          {billItem && (
                            <button
                              onClick={() => setSelectedItem({ ...billItem, type: 'link', category: 'Billing' })}
                              className="text-left text-[#005696] hover:text-[#003865] hover:underline font-bold text-[11px] block"
                            >
                              <span className="font-semibold text-slate-800">{billItem.code}</span> {billItem.name}
                            </button>
                          )}
                        </td>

                        {/* 5. Other */}
                        <td className="p-2 border-r border-slate-200 align-top bg-[#f1f5f9]/40">
                          {otherItem && (
                            <button
                              onClick={() => setSelectedItem({ ...otherItem, type: 'link', category: 'Other' })}
                              className="text-left text-[#005696] hover:text-[#003865] hover:underline font-bold text-[11px] block"
                            >
                              <span className="font-semibold text-slate-800">{otherItem.code}</span> {otherItem.name}
                            </button>
                          )}
                        </td>

                        {/* 6. Internal */}
                        <td className="p-2 border-r border-slate-200 align-top bg-[#f3e8ff]/20">
                          {intItem && (
                            <button
                              onClick={() => setSelectedItem({ ...intItem, type: 'link', category: 'Internal' })}
                              className="text-left text-[#005696] hover:text-[#003865] hover:underline font-bold text-[11px] block"
                            >
                              <span className="font-semibold text-slate-800">{intItem.code}</span> {intItem.name}
                            </button>
                          )}
                        </td>

                        {/* 7. Documents/Reports */}
                        <td className="p-2 align-top bg-[#fef9c3]/30">
                          {docItem && (
                            <button
                              onClick={() => setSelectedItem({ ...docItem, type: 'link', category: 'Documents/Reports' })}
                              className="text-left text-[#005696] hover:text-[#003865] hover:underline font-bold text-[11px] block"
                            >
                              <span className="font-semibold text-slate-800">{docItem.code}</span> {docItem.name}
                            </button>
                          )}
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* C. OUR TEAM SECTION */}
          <div className="bg-white rounded-md border border-slate-300 p-5 shadow-sm space-y-4">
            <div className="border-b-2 border-[#005696] pb-1.5 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <Users className="w-4 h-4 text-[#005696]" />
                <span>Our Team</span>
              </h2>
              <span className="text-[10px] text-slate-500 font-medium">SLT Contact Center Leadership &amp; Operations</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-1">
              {TEAM_MEMBERS.map((member, idx) => (
                <div 
                  key={idx}
                  onClick={() => setSelectedItem({ title: member.name, desc: `${member.title} | ${member.role}`, type: 'team' })}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200 cursor-pointer group"
                >
                  <div className={`w-10 h-10 rounded-full ${member.color} text-white font-bold flex items-center justify-center text-xs shadow-xs shrink-0 group-hover:scale-105 transition-transform`}>
                    {member.initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-800 truncate group-hover:text-[#005696] transition-colors">
                      {member.name}
                    </p>
                    <p className="text-[10px] text-slate-500 truncate leading-tight">
                      {member.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </main>
      </div>

      {/* ======================================================== */}
      {/* INTERACTIVE DETAIL MODAL / DRAWER                        */}
      {/* ======================================================== */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4"
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#005696] text-white flex items-center justify-center font-bold">
                    <BookOpen className="w-4 h-4 text-cyan-200" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#005696]">
                      {selectedItem.category || selectedItem.asset || 'Knowledge Hub Portal Item'}
                    </span>
                    <h3 className="text-base font-bold text-slate-900">
                      {selectedItem.name || selectedItem.title}
                    </h3>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Description &amp; Operational Purpose</span>
                  <p className="text-slate-700 font-medium leading-relaxed">
                    {selectedItem.desc}
                  </p>
                </div>

                {/* If connected to an active fault rule */}
                {selectedItem.ruleCode && (
                  <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg space-y-1.5 text-indigo-950">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase text-indigo-700">Triage Engine Connection</span>
                      <span className="px-2 py-0.5 rounded bg-indigo-600 text-white font-mono text-[9px] font-bold">
                        {selectedItem.ruleCode}
                      </span>
                    </div>
                    <p className="text-[11px] text-indigo-900">
                      This service tile is automatically monitored by Gemini Live Voice Triage for instant Trouble Ticket routing.
                    </p>
                  </div>
                )}

                {/* If a Common Link */}
                {selectedItem.type === 'link' && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between text-emerald-950">
                    <div>
                      <span className="text-[9px] font-bold text-emerald-700 uppercase">System Reference</span>
                      <p className="font-mono font-bold text-xs">{selectedItem.code} {selectedItem.name}</p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(selectedItem.name, 'modal-copy')}
                      className="px-3 py-1.5 rounded bg-emerald-600 text-white font-bold text-[10px] hover:bg-emerald-700 transition-colors flex items-center gap-1 shadow-xs"
                    >
                      {copiedLink === 'modal-copy' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      <span>Copy Name</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="pt-2 flex justify-end gap-2">
                <button
                  onClick={() => setSelectedItem(null)}
                  className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-md transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
