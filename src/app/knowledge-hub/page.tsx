"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
  Maximize2,
  Tv,
  Smartphone,
  CreditCard,
  Zap,
  Mail,
  Wrench,
  Radio,
  Bookmark,
  LayoutGrid,
  LayoutList,
  SlidersHorizontal,
  ArrowUpRight
} from 'lucide-react';

// Left Sidebar Menu Links
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

// Quick Access High-Frequency Interactive SOPs
const QUICK_SOPS = [
  {
    title: 'Wi-Fi Not Working (PON Steady)',
    path: '/knowledge-hub/faq/ftth/wifi-not-working',
    icon: Wifi,
    badge: 'Wi-Fi / PON',
    color: 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300'
  },
  {
    title: 'Browsing Slow (Speed Drop)',
    path: '/knowledge-hub/faq/ftth/browsing-slow',
    icon: Globe,
    badge: 'Speed / FUP',
    color: 'bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100 hover:border-blue-300'
  },
  {
    title: 'LOS Red Indicator (Fiber Cut)',
    path: '/knowledge-hub/faq/ftth/pon-los-indicator',
    icon: Zap,
    badge: 'Fiber Cut / LOS',
    color: 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100 hover:border-rose-300'
  },
  {
    title: 'ONT Router Dead / Power Off',
    path: '/knowledge-hub/faq/ftth/ont-not-working',
    icon: Server,
    badge: 'Hardware Fault',
    color: 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100 hover:border-amber-300'
  },
  {
    title: 'PEOTV STB & Remote Warranty',
    path: '/knowledge-hub/faq',
    icon: Tv,
    badge: 'IPTV Warranty',
    color: 'bg-purple-50 text-purple-800 border-purple-200 hover:bg-purple-100 hover:border-purple-300'
  },
];

// 19 Main Categories with modern icon assignments, tags, and theme styling
const CATEGORY_TILES = [
  {
    id: 'faq',
    title: 'Interactive SOPs & FAQs',
    pillar: 'operations',
    icon: HelpCircle,
    gradient: 'from-amber-500 via-orange-500 to-rose-500',
    cardBorder: 'border-amber-300 shadow-amber-500/10',
    badge: '⭐ Primary Guide',
    badgeStyle: 'bg-amber-100 text-amber-900 border-amber-200',
    desc: 'Interactive decision trees, troubleshooting flowcharts, customer inquiry SOPs & Escalation Matrix.',
    asset: 'GENERAL',
    ruleCode: null,
    isSpecial: true,
    route: '/knowledge-hub/faq'
  },
  {
    id: 'slt_fibre',
    title: 'SLT Fibre (FTTH)',
    pillar: 'connectivity',
    icon: Wifi,
    gradient: 'from-cyan-600 via-blue-600 to-indigo-700',
    cardBorder: 'border-cyan-300 shadow-cyan-500/10',
    badge: 'Rule 1: LOS Red',
    badgeStyle: 'bg-cyan-100 text-cyan-900 border-cyan-200',
    desc: 'Fibre To The Home, LOS Red Indicator, ONT Router replacements, Optical fiber cable cuts & GB portal pre-checks.',
    asset: 'DATA',
    ruleCode: 'RULE_LOS_RED',
    route: '/knowledge-hub/faq/ftth'
  },
  {
    id: 'broadband',
    title: 'Broadband & High-Speed Data',
    pillar: 'connectivity',
    icon: Globe,
    gradient: 'from-blue-600 to-indigo-700',
    cardBorder: 'border-blue-300 shadow-blue-500/10',
    badge: 'Rule 4: Slowness',
    badgeStyle: 'bg-blue-100 text-blue-900 border-blue-200',
    desc: 'ADSL & FTTH Broadband Packages, Unlimited FUP thresholds, speed tests, and AREA-MTCE dispatch guidelines.',
    asset: 'DATA',
    ruleCode: 'RULE_UNLIMITED_SLOWNESS'
  },
  {
    id: 'peo_tv',
    title: 'PEO TV (IPTV Service)',
    pillar: 'multimedia',
    icon: Tv,
    gradient: 'from-purple-600 to-violet-700',
    cardBorder: 'border-purple-300 shadow-purple-500/10',
    badge: 'Rule 2 & 5: STB/Remote',
    badgeStyle: 'bg-purple-100 text-purple-900 border-purple-200',
    desc: 'Set-Top Box (STB) hardware issues, Remote controller 6-month warranty validation, Channel lineup & VOD.',
    asset: 'PEOTV',
    ruleCode: 'RULE_STB_ONT_ROUTER_FAULTY'
  },
  {
    id: 'megaline',
    title: 'Megaline PSTN Voice',
    pillar: 'connectivity',
    icon: Phone,
    gradient: 'from-teal-600 to-emerald-700',
    cardBorder: 'border-teal-300 shadow-teal-500/10',
    badge: 'Rule 11: Voice MDF',
    badgeStyle: 'bg-teal-100 text-teal-900 border-teal-200',
    desc: 'PSTN Copper Voice, FTTH telephone dial tone faults, PON steady vs off routing, Line tests & MDF dispatch.',
    asset: 'VOICE',
    ruleCode: 'RULE_FIBER_VOICE_LINE_FAULT'
  },
  {
    id: '4g_lte',
    title: '4G LTE Fixed Wireless',
    pillar: 'connectivity',
    icon: Radio,
    gradient: 'from-emerald-600 to-teal-700',
    cardBorder: 'border-emerald-300 shadow-emerald-500/10',
    badge: 'Rule 9 & 10: 4G Reload',
    badgeStyle: 'bg-emerald-100 text-emerald-900 border-emerald-200',
    desc: 'Fixed Wireless Broadband, 4G Prepaid & Postpaid Reloads, Dealer mCash vs Third-party Bank refund advice.',
    asset: 'BILLING',
    ruleCode: 'RULE_4G_RELOAD_DIRECT_CHANNELS'
  },
  {
    id: 'bill_info',
    title: 'Billing & Tariff Information',
    pillar: 'billing',
    icon: CreditCard,
    gradient: 'from-pink-600 to-rose-700',
    cardBorder: 'border-pink-300 shadow-pink-500/10',
    badge: 'Billing Support',
    badgeStyle: 'bg-pink-100 text-pink-900 border-pink-200',
    desc: 'Tariffs, e-Bill paperless registration, Bill-Com disputes, disconnection policies & payment reconciliation.',
    asset: 'BILLING',
    ruleCode: 'RULE_4G_RELOAD_THIRD_PARTY_CHANNELS'
  },
  {
    id: 'slt_apps',
    title: 'SLT Apps & Digital Channels',
    pillar: 'multimedia',
    icon: Smartphone,
    gradient: 'from-indigo-600 to-blue-700',
    cardBorder: 'border-indigo-300 shadow-indigo-500/10',
    badge: 'Self-Care Apps',
    badgeStyle: 'bg-indigo-100 text-indigo-900 border-indigo-200',
    desc: 'MySLT Self-care app, mCash integration, PEO Mobile streaming, bill settlement & password resets.',
    asset: 'VAS',
    ruleCode: 'RULE_CQMS_VAS_AND_PROMOS'
  },
  {
    id: 'vas',
    title: 'Value Added Services (VAS)',
    pillar: 'multimedia',
    icon: Sparkles,
    gradient: 'from-violet-600 to-purple-700',
    cardBorder: 'border-violet-300 shadow-violet-500/10',
    badge: 'Rule 7 & 8: Addons',
    badgeStyle: 'bg-violet-100 text-violet-900 border-violet-200',
    desc: 'Data Addons, Caller Ring Tunes (CRBT), Voice Mail, Data consumption not deducting issues (INT-NW-SYS-ADMIN).',
    asset: 'VAS',
    ruleCode: 'RULE_ADDON_PROVISIONING_ERROR'
  },
  {
    id: 'self_services',
    title: 'SLT Self Services & USSD',
    pillar: 'billing',
    icon: Zap,
    gradient: 'from-amber-600 to-orange-700',
    cardBorder: 'border-amber-300 shadow-amber-500/10',
    badge: 'Automated 24/7',
    badgeStyle: 'bg-amber-100 text-amber-900 border-amber-200',
    desc: 'USSD shortcodes (*121#), Web Self-Care portal, Auto Wi-Fi Password Reset, SMS balance & usage inquiry.',
    asset: 'VAS',
    ruleCode: 'RULE_CQMS_VAS_AND_PROMOS'
  },
  {
    id: 'promotions',
    title: 'Promotions & Special Schemes',
    pillar: 'billing',
    icon: Award,
    gradient: 'from-rose-600 to-pink-700',
    cardBorder: 'border-rose-300 shadow-rose-500/10',
    badge: 'Rule 13: CQMS',
    badgeStyle: 'bg-rose-100 text-rose-900 border-rose-200',
    desc: 'Seasonal Promotions, Free Router Upgrades, Timely Pay Discounts, Double Data, CQMS commercial logging.',
    asset: 'VAS',
    ruleCode: 'RULE_CQMS_VAS_AND_PROMOS'
  },
  {
    id: 'enterprise',
    title: 'Enterprise & Corporate Sales',
    pillar: 'enterprise',
    icon: Building,
    gradient: 'from-slate-700 to-slate-900',
    cardBorder: 'border-slate-300 shadow-slate-500/10',
    badge: 'B2B / SLA',
    badgeStyle: 'bg-slate-100 text-slate-900 border-slate-200',
    desc: 'Corporate Leased Lines, MPLS VPNs, Tier-III Cloud Hosting, SIP Trunking, Priority Enterprise SLA contracts.',
    asset: 'GENERAL',
    ruleCode: null
  },
  {
    id: 'equipment',
    title: 'Equipment & Hardware Sales',
    pillar: 'enterprise',
    icon: Wrench,
    gradient: 'from-cyan-700 to-blue-900',
    cardBorder: 'border-cyan-300 shadow-cyan-500/10',
    badge: 'Rule 3: ADSL/Hardware',
    badgeStyle: 'bg-cyan-100 text-cyan-900 border-cyan-200',
    desc: 'Mesh Wi-Fi extenders, Dual-band gigabit routers, replacement power adapters, Teleshop direct exchange pricing.',
    asset: 'ROUTER',
    ruleCode: 'RULE_ADSL_ROUTER_FAULTY'
  },
  {
    id: 'slt_mail',
    title: 'SLT Customer Webmail',
    pillar: 'enterprise',
    icon: Mail,
    gradient: 'from-blue-700 to-indigo-900',
    cardBorder: 'border-blue-300 shadow-blue-500/10',
    badge: 'mail.slt.lk',
    badgeStyle: 'bg-blue-100 text-blue-900 border-blue-200',
    desc: 'Customer email domain (mail.slt.lk), Webmail configuration, SMTP / POP3 / IMAP port security parameters.',
    asset: 'DATA',
    ruleCode: null
  },
  {
    id: 'staff_packages',
    title: 'Staff Packages & HR Guides',
    pillar: 'enterprise',
    icon: Users,
    gradient: 'from-slate-600 to-slate-800',
    cardBorder: 'border-slate-300 shadow-slate-500/10',
    badge: 'Internal Employee',
    badgeStyle: 'bg-slate-100 text-slate-800 border-slate-200',
    desc: 'Employee broadband concessions, staff voice quotas, HR provisioning guides, and transfer policies.',
    asset: 'INTERNAL',
    ruleCode: null
  },
  {
    id: 'cc_systems',
    title: 'CC Telephony & OSS/BSS Systems',
    pillar: 'operations',
    icon: Server,
    gradient: 'from-sky-700 to-blue-900',
    cardBorder: 'border-sky-300 shadow-sky-500/10',
    badge: 'OSS / BSS Systems',
    badgeStyle: 'bg-sky-100 text-sky-900 border-sky-200',
    desc: 'Contact Center Telephony, MINT CRM, Clarity C12, Cisco Finesse, Avaya desktop integration user guides.',
    asset: 'INTERNAL',
    ruleCode: null
  },
  {
    id: 'qed',
    title: 'QED & Quality Escalations',
    pillar: 'operations',
    icon: ShieldCheck,
    gradient: 'from-teal-700 to-emerald-900',
    cardBorder: 'border-teal-300 shadow-teal-500/10',
    badge: 'Supervisor Level',
    badgeStyle: 'bg-teal-100 text-teal-900 border-teal-200',
    desc: 'Quality Enhancement Division, Customer Complaints, Escalations to Team Leader & Supervisor protocol.',
    asset: 'GENERAL',
    ruleCode: 'RULE_CQMS_VAS_AND_PROMOS'
  },
  {
    id: 'latest_updates',
    title: 'Latest Circulars & Urgent Notices',
    pillar: 'operations',
    icon: Bookmark,
    gradient: 'from-red-600 to-rose-800',
    cardBorder: 'border-red-300 shadow-red-500/10',
    badge: 'Urgent Bulletins',
    badgeStyle: 'bg-red-100 text-red-900 border-red-200',
    desc: 'Urgent Operational Circulars, System maintenance outage schedules, and New Triage rule modifications.',
    asset: 'CIRCULARS',
    ruleCode: null
  },
  {
    id: 'rebuilding',
    title: 'National Digital Transformation',
    pillar: 'operations',
    icon: Layers,
    gradient: 'from-blue-800 to-slate-900',
    cardBorder: 'border-blue-300 shadow-blue-500/10',
    badge: 'Gov & CSR',
    badgeStyle: 'bg-blue-100 text-blue-900 border-blue-200',
    desc: 'National Digitization, e-Government initiatives, Rural connectivity, and SLT Corporate Social Responsibility.',
    asset: 'GENERAL',
    ruleCode: null
  },
];

// Service Pillars grouping the 19 domains cleanly
const SERVICE_PILLARS = [
  {
    id: 'all',
    label: 'All Domains (19)',
    icon: LayoutGrid
  },
  {
    id: 'connectivity',
    label: 'Core Connectivity',
    sub: 'FTTH, Broadband, Voice & 4G',
    icon: Wifi,
    color: 'text-cyan-600'
  },
  {
    id: 'multimedia',
    label: 'Entertainment & Lifestyle',
    sub: 'PEOTV, MySLT & VAS',
    icon: Tv,
    color: 'text-purple-600'
  },
  {
    id: 'billing',
    label: 'Billing & Commercial',
    sub: 'Tariffs, Self-Care & Promos',
    icon: CreditCard,
    color: 'text-pink-600'
  },
  {
    id: 'enterprise',
    label: 'Enterprise & Hardware',
    sub: 'B2B, Routers & Webmail',
    icon: Building,
    color: 'text-slate-700'
  },
  {
    id: 'operations',
    label: 'SOPs, Systems & Quality',
    sub: 'Decision Trees, CRM & Circulars',
    icon: BookOpen,
    color: 'text-amber-600'
  }
];

// Common Links Categories
const COMMON_LINKS = {
  operational: {
    title: 'Operational (C-Log & CRM)',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
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
  broadbandEmail: {
    title: 'Broadband, TR-069 & Email',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
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
      { code: '(21)', name: 'Email (slt.lk)', desc: 'Webmail login and customer email quota administration.', url: 'https://mail.slt.lk' },
      { code: '(22)', name: 'Coverage Map', desc: 'National Fibre (FTTH), 4G LTE, and Copper network coverage map.', url: '#' },
      { code: '(23)', name: 'BB Package Change', desc: 'Administrative interface for processing customer package upgrades and downgrades.', url: '#' },
    ]
  },
  billing: {
    title: 'Billing & Ledger Systems',
    badgeColor: 'bg-pink-100 text-pink-800 border-pink-200',
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
  internal: {
    title: 'Internal Tools & Employee Services',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
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
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPillar, setSelectedPillar] = useState('all');
  const [viewMode, setViewMode] = useState<'bento' | 'compact'>('bento');
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [activeCommonTab, setActiveCommonTab] = useState<'operational' | 'broadbandEmail' | 'billing' | 'internal'>('operational');

  // Filter Categories by search and active pillar
  const filteredCategories = CATEGORY_TILES.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.badge && c.badge.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesPillar = selectedPillar === 'all' || c.pillar === selectedPillar;

    return matchesSearch && matchesPillar;
  });

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(id);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f8fafc] overflow-hidden select-none">
      
      {/* 1. TOP SLT MOBITEL ENTERPRISE BAR */}
      <header className="bg-gradient-to-r from-[#003B66] via-[#005696] to-[#0072CE] text-white px-5 py-2.5 flex items-center justify-between text-xs shadow-md shrink-0 border-b border-blue-400/20">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <div className="flex flex-col leading-none">
              <span className="font-black text-lg text-white tracking-tighter drop-shadow-xs">SLT MOBITEL</span>
              <span className="text-[9px] text-cyan-200 uppercase tracking-widest font-bold">Smart PEARL Knowledge Hub</span>
            </div>
          </Link>

          <span className="h-5 w-px bg-white/20 hidden sm:block"></span>

          {/* Quick Universal Knowledge Hub Search Bar */}
          <div className="relative w-72 md:w-96">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-cyan-200" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 19 Domains, SOPs, Rules, or Common Links..."
              className="w-full bg-white/15 text-white placeholder-cyan-100/70 text-xs pl-8 pr-7 py-1.5 rounded-lg border border-white/20 focus:outline-hidden focus:ring-2 focus:ring-cyan-300 backdrop-blur-md transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-cyan-200 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="px-3 py-1 rounded-md bg-white/10 hover:bg-white/20 border border-white/20 text-[11px] font-bold text-white transition-all flex items-center gap-1.5 shadow-2xs"
          >
            <span>🎙️ Copilot Dashboard</span>
          </Link>
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 border border-white/30 flex items-center justify-center font-black text-xs text-white shadow-xs">
            GJ
          </div>
        </div>
      </header>

      {/* 2. SUB NAVIGATION & OPERATIONAL STATUS BAR */}
      <div className="bg-white border-b border-slate-200/80 px-6 py-2 flex items-center justify-between text-xs shadow-2xs shrink-0">
        <div className="flex items-center gap-2 text-slate-600 font-semibold">
          <span className="text-[#005696] font-black">Knowledge Hub</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-800 font-bold">2026 NextGen Edition</span>
          <span className="ml-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Live Enterprise Directory
          </span>
        </div>

        {/* View Switcher & Direct FAQ Link */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-[11px]">
            <button
              onClick={() => setViewMode('bento')}
              className={`px-2.5 py-1 rounded-md font-bold flex items-center gap-1.5 transition-all ${
                viewMode === 'bento'
                  ? 'bg-white text-[#005696] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Modern Bento</span>
            </button>
            <button
              onClick={() => setViewMode('compact')}
              className={`px-2.5 py-1 rounded-md font-bold flex items-center gap-1.5 transition-all ${
                viewMode === 'compact'
                  ? 'bg-white text-[#005696] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutList className="w-3.5 h-3.5" />
              <span>Compact Tiles</span>
            </button>
          </div>

          <Link
            href="/knowledge-hub/faq"
            className="px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg text-xs font-black shadow-xs hover:brightness-105 transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Open SOP Flowcharts ➔</span>
          </Link>
        </div>
      </div>

      {/* 3. MAIN WORKSPACE WITH SIDEBAR */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left SharePoint Sidebar */}
        <aside className="w-48 sm:w-56 bg-gradient-to-b from-[#004B80] to-[#003359] text-white flex flex-col shrink-0 shadow-lg border-r border-[#002f52] overflow-y-auto">
          <div className="p-3 border-b border-white/10">
            <span className="text-[10px] font-black uppercase tracking-wider text-cyan-200">
              Operational Navigation
            </span>
          </div>

          <nav className="py-1">
            {SIDEBAR_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() =>
                  setSelectedItem({
                    title: item.label,
                    type: 'sidebar',
                    desc: `SLT Internal Resource: ${item.label}. Used by Contact Center duty officers and shift supervisors.`
                  })
                }
                className={`w-full text-left px-4 py-2 text-xs font-semibold transition-all flex items-center justify-between group ${
                  item.active
                    ? 'bg-white/15 font-black text-white border-l-4 border-cyan-400 shadow-inner'
                    : 'text-cyan-100/90 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className="truncate">{item.label}</span>
                <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-cyan-300 shrink-0" />
              </button>
            ))}
          </nav>

          <div className="mt-auto p-4 border-t border-white/10 bg-slate-950/20 text-[10px] text-cyan-200/80 space-y-1">
            <p className="font-bold text-white flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> ISO 9001:2015
            </p>
            <p>Smart PEARL Edition 2026</p>
          </div>
        </aside>

        {/* Right Main Content Stream */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">

          {/* ======================================================== */}
          {/* A. HERO SOP QUICK-LAUNCH BAR                            */}
          {/* ======================================================== */}
          <div className="p-4 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl text-white shadow-lg border border-blue-700/40 relative overflow-hidden">
            <div className="relative z-10 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-cyan-400/20 text-cyan-300 border border-cyan-300/30">
                      Top Call Center Scenarios
                    </span>
                    <span className="text-xs text-blue-200">Instant SOP &amp; Flowchart Resolution</span>
                  </div>
                  <h2 className="text-base font-black text-white mt-1">
                    Instant Trouble Ticket &amp; Fault Resolution Quick-Launch
                  </h2>
                </div>

                <Link
                  href="/knowledge-hub/faq"
                  className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-lg text-xs font-black flex items-center gap-1.5 transition-all shadow-md"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Browse All SOPs</span>
                </Link>
              </div>

              {/* 5 High-Frequency Scenario Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2 pt-1">
                {QUICK_SOPS.map((sop, idx) => {
                  const SopIcon = sop.icon;
                  return (
                    <Link
                      key={idx}
                      href={sop.path}
                      className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all group ${sop.color} shadow-xs hover:shadow-md hover:scale-[1.02]`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <SopIcon className="w-4 h-4" />
                        <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-white/80">
                          {sop.badge}
                        </span>
                      </div>
                      <p className="text-xs font-bold leading-snug line-clamp-2 group-hover:underline">
                        {sop.title}
                      </p>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* B. SERVICE PILLARS FILTER TAB BAR                        */}
          {/* ======================================================== */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
              {SERVICE_PILLARS.map((pillar) => {
                const PillarIcon = pillar.icon;
                const isSelected = selectedPillar === pillar.id;
                return (
                  <button
                    key={pillar.id}
                    onClick={() => setSelectedPillar(pillar.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all whitespace-nowrap shadow-2xs ${
                      isSelected
                        ? 'bg-[#005696] text-white shadow-md ring-2 ring-[#005696]/20'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <PillarIcon className="w-3.5 h-3.5" />
                    <span>{pillar.label}</span>
                  </button>
                );
              })}
            </div>

            <span className="text-xs text-slate-400 font-semibold shrink-0">
              Showing <b className="text-slate-800">{filteredCategories.length}</b> of 19 Domains
            </span>
          </div>

          {/* ======================================================== */}
          {/* C. 19 MAIN CATEGORY TILES (MODERN BENTO / COMPACT VIEW) */}
          {/* ======================================================== */}
          {viewMode === 'bento' ? (
            /* Modern Rich Bento Grid View */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredCategories.map((tile) => {
                const IconComponent = tile.icon;
                return (
                  <motion.div
                    key={tile.id}
                    whileHover={{ y: -3, scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => {
                      if (tile.route) {
                        router.push(tile.route);
                      } else {
                        setSelectedItem({ ...tile, type: 'tile' });
                      }
                    }}
                    className={`bg-white rounded-2xl p-4 border transition-all cursor-pointer relative overflow-hidden group flex flex-col justify-between shadow-xs hover:shadow-xl ${
                      tile.isSpecial
                        ? 'border-amber-400 bg-gradient-to-br from-amber-50/70 via-white to-orange-50/30'
                        : 'border-slate-200/90 hover:border-[#005696]/40'
                    }`}
                  >
                    {/* Top Header */}
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div
                          className={`w-10 h-10 rounded-xl bg-gradient-to-br ${tile.gradient} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}
                        >
                          <IconComponent className="w-5 h-5" />
                        </div>

                        {tile.badge && (
                          <span
                            className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border shadow-2xs ${tile.badgeStyle}`}
                          >
                            {tile.badge}
                          </span>
                        )}
                      </div>

                      <h3 className="font-black text-sm text-slate-900 group-hover:text-[#005696] transition-colors flex items-center gap-1.5">
                        <span>{tile.title}</span>
                        <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#005696]" />
                      </h3>

                      <p className="text-xs text-slate-500 font-medium leading-relaxed mt-1 line-clamp-2">
                        {tile.desc}
                      </p>
                    </div>

                    {/* Bottom Metadata & Quick Launch */}
                    <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        {tile.asset || 'Service'}
                      </span>

                      {tile.route ? (
                        <span className="font-black text-amber-600 group-hover:underline flex items-center gap-1 text-[11px]">
                          View SOP &rarr;
                        </span>
                      ) : tile.ruleCode ? (
                        <span className="font-mono text-[9px] font-bold px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                          {tile.ruleCode}
                        </span>
                      ) : (
                        <span className="text-slate-400 font-medium group-hover:text-slate-700">
                          Inspect &rarr;
                        </span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            /* Compact Modern Tiles View */
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {filteredCategories.map((tile) => {
                const IconComponent = tile.icon;
                return (
                  <motion.button
                    key={tile.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      if (tile.route) {
                        router.push(tile.route);
                      } else {
                        setSelectedItem({ ...tile, type: 'tile' });
                      }
                    }}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all bg-white hover:bg-slate-50 shadow-2xs hover:shadow-md cursor-pointer ${
                      tile.isSpecial ? 'border-amber-400 bg-amber-50/40' : 'border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className={`p-1.5 rounded-lg bg-gradient-to-br ${tile.gradient} text-white shadow-xs`}>
                        <IconComponent className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[9px] font-bold text-slate-400 uppercase truncate">
                        {tile.asset}
                      </span>
                    </div>

                    <h4 className="font-bold text-xs text-slate-800 line-clamp-1">
                      {tile.title}
                    </h4>

                    {tile.badge && (
                      <span className="text-[9px] font-bold text-[#005696] mt-1 truncate">
                        {tile.badge}
                      </span>
                    )}
                  </motion.button>
                );
              })}
            </div>
          )}

          {/* ======================================================== */}
          {/* D. MODERNIZED COMMON LINKS & OPERATIONAL TOOLS MATRIX   */}
          {/* ======================================================== */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <LinkIcon className="w-4 h-4 text-[#005696]" />
                  <span>SLT Internal Systems &amp; Common Links (60+ Tools)</span>
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Direct OSS / BSS, Customer Portal, Billing &amp; Field Dispatch links
                </p>
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs">
                {(['operational', 'broadbandEmail', 'billing', 'internal'] as const).map((tabKey) => (
                  <button
                    key={tabKey}
                    onClick={() => setActiveCommonTab(tabKey)}
                    className={`px-3 py-1 rounded-lg font-bold capitalize transition-all ${
                      activeCommonTab === tabKey
                        ? 'bg-[#005696] text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {tabKey === 'broadbandEmail'
                      ? 'Broadband & Email'
                      : tabKey === 'operational'
                      ? 'C-Log & CRM'
                      : tabKey}
                  </button>
                ))}
              </div>
            </div>

            {/* Links Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {COMMON_LINKS[activeCommonTab].items.map((linkItem, idx) => (
                <div
                  key={idx}
                  onClick={() =>
                    setSelectedItem({
                      ...linkItem,
                      type: 'link',
                      category: COMMON_LINKS[activeCommonTab].title
                    })
                  }
                  className="p-3 rounded-xl border border-slate-200/90 bg-slate-50/60 hover:bg-blue-50/40 hover:border-blue-300 transition-all cursor-pointer group flex flex-col justify-between shadow-2xs"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono font-bold text-slate-400">
                        {linkItem.code}
                      </span>
                      <ArrowRight className="w-3 h-3 text-slate-300 group-hover:text-[#005696] transition-colors" />
                    </div>
                    <h5 className="font-black text-xs text-slate-800 group-hover:text-[#005696] transition-colors">
                      {linkItem.name}
                    </h5>
                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-relaxed font-medium">
                      {linkItem.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ======================================================== */}
          {/* E. OUR TEAM (LEADERSHIP & OPERATIONS)                   */}
          {/* ======================================================== */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="border-b border-slate-200 pb-2 flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Users className="w-4 h-4 text-[#005696]" />
                <span>Contact Center Operations &amp; Leadership</span>
              </h3>
              <span className="text-xs text-slate-400 font-medium">Duty Management &amp; Support</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-1">
              {TEAM_MEMBERS.map((member, idx) => (
                <div
                  key={idx}
                  onClick={() =>
                    setSelectedItem({
                      title: member.name,
                      desc: `${member.title} | ${member.role}`,
                      type: 'team'
                    })
                  }
                  className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-200/80 hover:bg-slate-50 transition-all cursor-pointer group shadow-2xs"
                >
                  <div
                    className={`w-9 h-9 rounded-xl ${member.color} text-white font-black flex items-center justify-center text-xs shadow-xs shrink-0 group-hover:scale-105 transition-transform`}
                  >
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4"
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#003B66] to-[#005696] text-white flex items-center justify-center font-bold shadow-md">
                    <BookOpen className="w-5 h-5 text-cyan-200" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#005696]">
                      {selectedItem.category || selectedItem.asset || 'Knowledge Hub Portal Item'}
                    </span>
                    <h3 className="text-base font-black text-slate-900">
                      {selectedItem.name || selectedItem.title}
                    </h3>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="space-y-3 text-xs">
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Description &amp; Operational Purpose
                  </span>
                  <p className="text-slate-700 font-medium leading-relaxed">
                    {selectedItem.desc}
                  </p>
                </div>

                {/* If connected to an active fault rule */}
                {selectedItem.ruleCode && (
                  <div className="p-3.5 bg-indigo-50 border border-indigo-200 rounded-xl space-y-1.5 text-indigo-950">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-indigo-700">
                        AI Triage Engine Mapping
                      </span>
                      <span className="px-2 py-0.5 rounded bg-indigo-600 text-white font-mono text-[9px] font-bold">
                        {selectedItem.ruleCode}
                      </span>
                    </div>
                    <p className="text-[11px] text-indigo-900 leading-relaxed">
                      This service domain is automatically analyzed by Gemini Voice Triage for instant trouble ticket creation and dispatch.
                    </p>
                  </div>
                )}

                {/* If a Common Link */}
                {selectedItem.type === 'link' && (
                  <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-emerald-950">
                    <div>
                      <span className="text-[9px] font-bold text-emerald-700 uppercase">System Reference</span>
                      <p className="font-mono font-bold text-xs">{selectedItem.code} {selectedItem.name}</p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(selectedItem.name, 'modal-copy')}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-[10px] hover:bg-emerald-700 transition-colors flex items-center gap-1 shadow-xs"
                    >
                      {copiedLink === 'modal-copy' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      <span>Copy Name</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="pt-2 flex justify-between items-center">
                {selectedItem.route ? (
                  <button
                    onClick={() => {
                      router.push(selectedItem.route);
                      setSelectedItem(null);
                    }}
                    className="px-4 py-2 bg-[#005696] hover:bg-[#004780] text-white rounded-xl text-xs font-black shadow-xs flex items-center gap-1.5"
                  >
                    <span>Open Interactive SOP Page</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : <div></div>}

                <button
                  onClick={() => setSelectedItem(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
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
