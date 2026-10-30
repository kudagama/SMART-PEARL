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

// 4 Main SLT Product Pillars (Fiber, Megaline, PEO TV, Trio)
// Each Main Card contains 5 Inner Sub-Cards: Voice, Broadband, PEO TV, VAS, and FAQ
const MAIN_PRODUCT_TILES = [
  {
    id: 'fiber',
    title: 'Fiber',
    fullName: 'SLT Fibre (FTTH Broadband & Voice)',
    pillar: 'fiber',
    icon: Wifi,
    gradient: 'from-[#003B66] via-[#005696] to-cyan-600',
    cardBorder: 'border-cyan-300 shadow-cyan-500/10 hover:border-cyan-500 hover:shadow-cyan-500/20',
    badge: '1Gbps FTTH Optical',
    badgeStyle: 'bg-cyan-100 text-cyan-900 border-cyan-200',
    desc: 'Ultra high-speed optical fiber connectivity, GPON ONT router triage, Wi-Fi 6 diagnostics, LOS red alarms, and direct Trouble Ticket dispatch to AREA-MTCE.',
    asset: 'DATA / FTTH',
    ruleCode: 'RULE_LOS_RED',
    route: '/knowledge-hub/faq/ftth',
    ctaText: 'Open Fiber Decision Trees',
    subCards: [
      {
        id: 'fiber-voice',
        title: 'Voice',
        badge: 'SIP / Dial Tone',
        badgeStyle: 'bg-teal-50 text-teal-800 border-teal-200',
        icon: Phone,
        iconBg: 'bg-gradient-to-br from-teal-500 to-emerald-600',
        desc: 'ONT Phone LED status, SIP registration, dial tone loss, and exchange MDF dispatch (Rule 11).',
        ruleCode: 'RULE_FIBER_VOICE_LINE_FAULT',
        ttTemplate: 'SERVICE: FTTH Voice\nFAULT: No Dial Tone / Voice Line Inoperable\nONT PON STATUS: Steady Green (Normal Transmission)\nDIAGNOSIS: Optical signal healthy. Voice line inactive on SIP port.\nACTION: Dispatch TT to MDF for SIP port reactivation.',
        route: '/knowledge-hub/faq/ftth'
      },
      {
        id: 'fiber-broadband',
        title: 'Broadband',
        badge: '1Gbps / GPON & Wi-Fi',
        badgeStyle: 'bg-cyan-50 text-cyan-800 border-cyan-200',
        icon: Globe,
        iconBg: 'bg-gradient-to-br from-cyan-500 to-blue-600',
        desc: 'LOS Red fiber cut alarm, Wi-Fi 2.4/5GHz disconnects, ONT replacement, and speed drop triage.',
        ruleCode: 'RULE_LOS_RED',
        ttTemplate: 'SERVICE: FTTH Broadband\nFAULT: LOS Indicator Red / Optical Signal Lost\nPRE-CHECKS: Verified subscriber account on LDAP. GB Portal Rx power unavailable.\nACTION: Dispatch Direct TT to AREA-MTCE for outdoor fiber cut restoration.',
        route: '/knowledge-hub/faq/ftth'
      },
      {
        id: 'fiber-peotv',
        title: 'PEO TV',
        badge: 'VLAN 30 / Port 4',
        badgeStyle: 'bg-purple-50 text-purple-800 border-purple-200',
        icon: Tv,
        iconBg: 'bg-gradient-to-br from-purple-500 to-indigo-600',
        desc: 'ONT LAN Port 4 binding, IGMP Snooping, STB pixelation, HDMI handshakes, and HD channel streams.',
        ruleCode: 'RULE_STB_ONT_ROUTER_FAULTY',
        ttTemplate: 'SERVICE: PEO TV on FTTH\nFAULT: STB Hardware Defect / Screen Freezing\nONT CONFIG: LAN 4 bound to VLAN 30. IGMP Snooping enabled.\nACTION: Dispatch TT to AREA-MTCE for premises visit and STB replacement.',
        route: '/knowledge-hub/faq'
      },
      {
        id: 'fiber-vas',
        title: 'VAS',
        badge: 'Addons & Static IP',
        badgeStyle: 'bg-amber-50 text-amber-800 border-amber-200',
        icon: Sparkles,
        iconBg: 'bg-gradient-to-br from-amber-500 to-orange-600',
        desc: 'Extra GB booster add-on errors, Static IP configuration, Caller Ring Back Tunes (CRBT), and Webmail.',
        ruleCode: 'RULE_ADDON_PROVISIONING_ERROR',
        ttTemplate: 'SERVICE: FTTH VAS\nFAULT: Extra GB Data Addon Purchased but not deducting from PCRF bucket\nACTION: Escalate Trouble Ticket to INT-NW-SYS-ADMIN for quota bucket sync.',
        route: '/knowledge-hub/faq'
      },
      {
        id: 'fiber-faq',
        title: 'FAQ',
        badge: 'Interactive SOPs',
        badgeStyle: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        icon: HelpCircle,
        iconBg: 'bg-gradient-to-br from-emerald-500 to-teal-600',
        desc: 'Visual decision trees for Wi-Fi, LOS Red, Speed drop, and ONT dead hardware triage.',
        ruleCode: null,
        ttTemplate: 'KNOWLEDGE BASE: FTTH Interactive SOPs & Decision Trees\nURL: /knowledge-hub/faq/ftth\nACTION: Follow step-by-step visual resolution flowcharts.',
        route: '/knowledge-hub/faq/ftth'
      }
    ]
  },
  {
    id: 'megaline',
    title: 'Megaline',
    fullName: 'SLT Megaline (PSTN Copper & ADSL)',
    pillar: 'megaline',
    icon: Phone,
    gradient: 'from-emerald-700 via-teal-700 to-cyan-800',
    cardBorder: 'border-teal-300 shadow-teal-500/10 hover:border-teal-500 hover:shadow-teal-500/20',
    badge: 'Copper Wireline Voice',
    badgeStyle: 'bg-teal-100 text-teal-900 border-teal-200',
    desc: 'Traditional copper wireline voice telephone, ADSL broadband double-play, line noise / crackling, SNR & loop resistance diagnostics, and MDF exchange dispatch.',
    asset: 'VOICE / COPPER',
    ruleCode: 'RULE_FIBER_VOICE_LINE_FAULT',
    route: '/knowledge-hub/faq',
    ctaText: 'Open Megaline SOPs',
    subCards: [
      {
        id: 'megaline-voice',
        title: 'Voice',
        badge: 'PSTN / MDF',
        badgeStyle: 'bg-teal-50 text-teal-800 border-teal-200',
        icon: Phone,
        iconBg: 'bg-gradient-to-br from-teal-500 to-emerald-600',
        desc: 'No dial tone on copper pair, heavy line noise / crackling, loop resistance testing, and MDF frame dispatch.',
        ruleCode: 'RULE_FIBER_VOICE_LINE_FAULT',
        ttTemplate: 'SERVICE: Megaline PSTN\nFAULT: No dial tone / Line noise detected\nLINE TEST: DC Loop resistance abnormal.\nACTION: Dispatch TT to MDF / AREA-MTCE for copper pair restoration.',
        route: '/knowledge-hub/faq'
      },
      {
        id: 'megaline-broadband',
        title: 'Broadband',
        badge: 'ADSL2+ Copper',
        badgeStyle: 'bg-cyan-50 text-cyan-800 border-cyan-200',
        icon: Globe,
        iconBg: 'bg-gradient-to-br from-cyan-500 to-blue-600',
        desc: 'ADSL router faulty (Rule 3: RTO walk-in replacement), SNR margin drop, and copper speed degradation.',
        ruleCode: 'RULE_ADSL_ROUTER_FAULTY',
        ttTemplate: 'SERVICE: Megaline ADSL Broadband\nFAULT: Defective ADSL Modem / Power failure\nRULE: RULE_ADSL_ROUTER_FAULTY\nADVICE: DO NOT LOG TT. Customer advised to bring modem + adapter to nearest RTO.',
        route: '/knowledge-hub/faq'
      },
      {
        id: 'megaline-peotv',
        title: 'PEO TV',
        badge: 'Copper IPTV',
        badgeStyle: 'bg-purple-50 text-purple-800 border-purple-200',
        icon: Tv,
        iconBg: 'bg-gradient-to-br from-purple-500 to-indigo-600',
        desc: 'Copper ADSL IPTV synchronization, channel freeze due to SNR margin, and 6-month remote warranty.',
        ruleCode: 'RULE_REMOTE_CONTROLLER_WARRANTY',
        ttTemplate: 'SERVICE: PEO TV (Copper Double Play)\nFAULT: STB Remote Controller Defective\nRULE: RULE_REMOTE_CONTROLLER_WARRANTY\nADVICE: Customer directed to Regional Telecom Office with faulty remote & STB.',
        route: '/knowledge-hub/faq'
      },
      {
        id: 'megaline-vas',
        title: 'VAS',
        badge: 'Calling Features',
        badgeStyle: 'bg-amber-50 text-amber-800 border-amber-200',
        icon: Sparkles,
        iconBg: 'bg-gradient-to-br from-amber-500 to-orange-600',
        desc: 'Call waiting, call forwarding, CLI, 3-way conference, and telephone ring tones on copper wire.',
        ruleCode: 'RULE_CQMS_VAS_AND_PROMOS',
        ttTemplate: 'SERVICE: Megaline VAS\nFAULT: PSTN Calling Feature (CLI / Call Waiting) activation inquiry\nACTION: Query subscriber profile on MINT CRM and escalate to CQMS.',
        route: '/knowledge-hub/faq'
      },
      {
        id: 'megaline-faq',
        title: 'FAQ',
        badge: 'PSTN SOPs',
        badgeStyle: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        icon: HelpCircle,
        iconBg: 'bg-gradient-to-br from-emerald-500 to-teal-600',
        desc: 'Copper line testing protocols, ADSL modem VPI/VCI settings (8/35), and rainy season outage rules.',
        ruleCode: null,
        ttTemplate: 'KNOWLEDGE BASE: Megaline PSTN & ADSL Guides\nURL: /knowledge-hub/faq\nACTION: Follow official copper line triage guidelines.',
        route: '/knowledge-hub/faq'
      }
    ]
  },
  {
    id: 'peo_tv',
    title: 'PEO TV',
    fullName: 'SLT PEO TV (Interactive IPTV Platform)',
    pillar: 'peo_tv',
    icon: Tv,
    gradient: 'from-indigo-800 via-purple-700 to-pink-700',
    cardBorder: 'border-purple-300 shadow-purple-500/10 hover:border-purple-400 hover:shadow-purple-500/20',
    badge: 'Digital IPTV & VOD',
    badgeStyle: 'bg-purple-100 text-purple-900 border-purple-200',
    desc: 'High-definition digital IPTV streaming, Set-Top Box (STB) hardware failure triage, remote controller 6-month warranty checks, VLAN 30 port binding, and PEO Mobile.',
    asset: 'PEOTV / IPTV',
    ruleCode: 'RULE_STB_ONT_ROUTER_FAULTY',
    route: '/knowledge-hub/faq',
    ctaText: 'Open PEO TV Guides',
    subCards: [
      {
        id: 'peotv-voice',
        title: 'Voice',
        badge: 'Tandem Voice',
        badgeStyle: 'bg-teal-50 text-teal-800 border-teal-200',
        icon: Phone,
        iconBg: 'bg-gradient-to-br from-teal-500 to-emerald-600',
        desc: 'Tandem voice line verification when PEO TV operates alongside landline voice.',
        ruleCode: 'RULE_FIBER_VOICE_LINE_FAULT',
        ttTemplate: 'SERVICE: PEO TV / Voice Tandem\nFAULT: Voice line disturbance while PEO TV is streaming\nACTION: Microfilter check & dispatch to MDF.',
        route: '/knowledge-hub/faq'
      },
      {
        id: 'peotv-broadband',
        title: 'Broadband',
        badge: 'Multicast QoS',
        badgeStyle: 'bg-cyan-50 text-cyan-800 border-cyan-200',
        icon: Globe,
        iconBg: 'bg-gradient-to-br from-cyan-500 to-blue-600',
        desc: 'Multicast QoS bandwidth reservation, IGMP snooping packet loss, and video buffering checks.',
        ruleCode: 'RULE_UNLIMITED_SLOWNESS',
        ttTemplate: 'SERVICE: Broadband & PEO TV\nFAULT: Video buffering due to bandwidth saturation\nACTION: Re-verify QoS profile and advise bandwidth booster.',
        route: '/knowledge-hub/faq'
      },
      {
        id: 'peotv-core',
        title: 'PEO TV',
        badge: 'STB & Remote',
        badgeStyle: 'bg-purple-50 text-purple-800 border-purple-200',
        icon: Tv,
        iconBg: 'bg-gradient-to-br from-purple-500 to-indigo-600',
        desc: 'STB power failure, blinking red LED, HDMI handshaking, remote controller warranty, and channel packages.',
        ruleCode: 'RULE_STB_ONT_ROUTER_FAULTY',
        ttTemplate: 'SERVICE: PEO TV Core\nFAULT: STB Hardware Failure / Red Power Light\nACTION: Dispatch TT to AREA-MTCE for premises hardware replacement.',
        route: '/knowledge-hub/faq'
      },
      {
        id: 'peotv-vas',
        title: 'VAS',
        badge: 'VOD & PEO Mobile',
        badgeStyle: 'bg-amber-50 text-amber-800 border-amber-200',
        icon: Sparkles,
        iconBg: 'bg-gradient-to-br from-amber-500 to-orange-600',
        desc: 'Video-on-Demand purchases, PEO Mobile multi-screen subscription, and SVOD channel add-ons.',
        ruleCode: 'RULE_CQMS_VAS_AND_PROMOS',
        ttTemplate: 'SERVICE: PEO TV VAS\nFAULT: PEO Mobile App Authentication / Channel Subscription not active\nACTION: Dispatch to Digital Services Support.',
        route: '/knowledge-hub/faq'
      },
      {
        id: 'peotv-faq',
        title: 'FAQ',
        badge: 'Error Matrix',
        badgeStyle: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        icon: HelpCircle,
        iconBg: 'bg-gradient-to-br from-emerald-500 to-teal-600',
        desc: 'Decoder error codes (CAS error, 101, 102), factory reset, and remote pairing codes.',
        ruleCode: null,
        ttTemplate: 'KNOWLEDGE BASE: PEO TV Error Matrix & Decoder Diagnostics\nURL: /knowledge-hub/faq\nACTION: Reference CAS error codes and STB reboot sequences.',
        route: '/knowledge-hub/faq'
      }
    ]
  },
  {
    id: 'trio',
    title: 'Trio',
    fullName: 'SLT Trio (Triple Play 3-in-1 Unified Bundle)',
    pillar: 'trio',
    icon: Layers,
    gradient: 'from-amber-600 via-orange-600 to-rose-600',
    cardBorder: 'border-amber-300 shadow-amber-500/10 hover:border-amber-400 hover:shadow-amber-500/20',
    badge: 'Voice + Data + IPTV (3-in-1)',
    badgeStyle: 'bg-amber-100 text-amber-900 border-amber-200',
    desc: 'Unified 3-in-1 Triple Play package combining Megaline/Fiber Telephone Voice + High Speed Broadband + PEO TV on a single consolidated bill with bundled savings.',
    asset: 'TRIO / BUNDLE',
    ruleCode: 'RULE_UNLIMITED_SLOWNESS',
    route: '/knowledge-hub/faq',
    ctaText: 'Open Trio Solutions',
    subCards: [
      {
        id: 'trio-voice',
        title: 'Voice',
        badge: 'Trio Landline',
        badgeStyle: 'bg-teal-50 text-teal-800 border-teal-200',
        icon: Phone,
        iconBg: 'bg-gradient-to-br from-teal-500 to-emerald-600',
        desc: 'Unified telephone line diagnostics bundled under Trio triple-play consolidated package.',
        ruleCode: 'RULE_FIBER_VOICE_LINE_FAULT',
        ttTemplate: 'SERVICE: Trio Triple Play (Voice)\nFAULT: Landline Inactive / Outgoing calls blocked\nACTION: Check Trio package status and route to MDF.',
        route: '/knowledge-hub/faq'
      },
      {
        id: 'trio-broadband',
        title: 'Broadband',
        badge: 'Trio High-Speed',
        badgeStyle: 'bg-cyan-50 text-cyan-800 border-cyan-200',
        icon: Globe,
        iconBg: 'bg-gradient-to-br from-cyan-500 to-blue-600',
        desc: 'Dedicated broadband data quota, FUP management, and concurrent streaming checks.',
        ruleCode: 'RULE_UNLIMITED_SLOWNESS',
        ttTemplate: 'SERVICE: Trio Broadband\nFAULT: Speed Drop / FUP Limit Exceeded\nACTION: Advised extra GB booster or package upgrade via QED.',
        route: '/knowledge-hub/faq/ftth/browsing-slow'
      },
      {
        id: 'trio-peotv',
        title: 'PEO TV',
        badge: 'Trio TV Stream',
        badgeStyle: 'bg-purple-50 text-purple-800 border-purple-200',
        icon: Tv,
        iconBg: 'bg-gradient-to-br from-purple-500 to-indigo-600',
        desc: 'Integrated PEO TV service on Trio bundle, multi-room decoders, and premium packages.',
        ruleCode: 'RULE_STB_ONT_ROUTER_FAULTY',
        ttTemplate: 'SERVICE: Trio PEO TV\nFAULT: Channel Authorization Failure on Trio Bundle\nACTION: Resend CAS entitlement signal.',
        route: '/knowledge-hub/faq'
      },
      {
        id: 'trio-vas',
        title: 'VAS',
        badge: 'Trio Perks',
        badgeStyle: 'bg-amber-50 text-amber-800 border-amber-200',
        icon: Sparkles,
        iconBg: 'bg-gradient-to-br from-amber-500 to-orange-600',
        desc: 'Trio exclusive VAS discounts, family sharing, free OTT bundles (HBO, SonyLIV).',
        ruleCode: 'RULE_CQMS_VAS_AND_PROMOS',
        ttTemplate: 'SERVICE: Trio VAS Perks\nFAULT: OTT App Bundle Access not synchronized\nACTION: Escalate to Digital Channels Team.',
        route: '/knowledge-hub/faq'
      },
      {
        id: 'trio-faq',
        title: 'FAQ',
        badge: 'Consolidated Bill',
        badgeStyle: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        icon: HelpCircle,
        iconBg: 'bg-gradient-to-br from-emerald-500 to-teal-600',
        desc: 'Trio single bill dispute resolution, bundle discounts, migration & upgrade SOPs.',
        ruleCode: null,
        ttTemplate: 'KNOWLEDGE BASE: Trio Consolidated Billing & Service Rules\nURL: /knowledge-hub/faq\nACTION: Verify single invoice allocation and dispute policies.',
        route: '/knowledge-hub/faq'
      }
    ]
  },
];

// Service Pillars grouping the 4 core products cleanly
const SERVICE_PILLARS = [
  {
    id: 'all',
    label: 'All 4 Core Pillars',
    icon: LayoutGrid
  },
  {
    id: 'fiber',
    label: 'Fiber (FTTH)',
    icon: Wifi,
    color: 'text-cyan-600'
  },
  {
    id: 'megaline',
    label: 'Megaline (Copper)',
    icon: Phone,
    color: 'text-teal-600'
  },
  {
    id: 'peo_tv',
    label: 'PEO TV (IPTV)',
    icon: Tv,
    color: 'text-purple-600'
  },
  {
    id: 'trio',
    label: 'Trio (Triple Play)',
    icon: Layers,
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

  // Filter 4 Main Pillars by search and active pillar
  const filteredCategories = MAIN_PRODUCT_TILES.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.badge && c.badge.toLowerCase().includes(searchQuery.toLowerCase())) ||
      c.subCards.some(
        (sc) =>
          sc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          sc.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
          sc.badge.toLowerCase().includes(searchQuery.toLowerCase())
      );

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
          <Link href="/" className="flex items-center gap-2 group">
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
              placeholder="Search Fiber, Megaline, PEO TV, Trio, SOPs..."
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
              Showing <b className="text-slate-800">{filteredCategories.length}</b> of 4 Core Pillars
            </span>
          </div>

          {/* ======================================================== */}
          {/* C. 4 MAIN PRODUCT TILES (FIBER, MEGALINE, PEO TV, TRIO) */}
          {/* ======================================================== */}
          {viewMode === 'bento' ? (
            /* Modern Rich 4-Pillar Grid View */
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
              {filteredCategories.map((tile) => {
                const IconComponent = tile.icon;
                return (
                  <motion.div
                    key={tile.id}
                    whileHover={{ y: -4, scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                    className={`bg-white rounded-2xl p-5 border transition-all relative overflow-hidden group flex flex-col justify-between shadow-xs hover:shadow-xl ${tile.cardBorder}`}
                  >
                    {/* Top Header */}
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div
                          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tile.gradient} text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform`}
                        >
                          <IconComponent className="w-6 h-6" />
                        </div>

                        <span
                          className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border shadow-2xs ${tile.badgeStyle}`}
                        >
                          {tile.badge}
                        </span>
                      </div>

                      <h3 className="font-black text-xl text-slate-900 group-hover:text-[#005696] transition-colors flex items-center justify-between">
                        <span>{tile.title}</span>
                        <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-[#005696]" />
                      </h3>

                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                        {tile.fullName}
                      </p>

                      <p className="text-xs text-slate-600 font-medium leading-relaxed line-clamp-3 mb-4">
                        {tile.desc}
                      </p>

                      {/* 5 Distinct Sub-Cards (Voice, Broadband, PEO TV, VAS, FAQ) */}
                      <div className="space-y-2 pt-3 border-t border-slate-100">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                            Service Cards (5 Domains):
                          </span>
                          <span className="text-[9px] font-bold text-[#005696] bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                            Click to inspect &amp; TT
                          </span>
                        </div>

                        <div className="flex flex-col gap-1.5">
                          {tile.subCards.map((sc, scIdx) => {
                            const ScIcon = sc.icon;
                            return (
                              <div
                                key={scIdx}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedItem({
                                    name: `${tile.title} - ${sc.title}`,
                                    title: `${tile.title} - ${sc.title}`,
                                    category: `${tile.title} Core Domain`,
                                    desc: sc.desc,
                                    ruleCode: sc.ruleCode,
                                    ttTemplate: sc.ttTemplate,
                                    route: sc.route,
                                    badge: sc.badge,
                                    badgeStyle: sc.badgeStyle,
                                    type: 'subcard'
                                  });
                                }}
                                className="p-2 rounded-xl bg-slate-50 hover:bg-white border border-slate-200/90 hover:border-[#005696]/60 hover:shadow-md transition-all cursor-pointer group/sc flex items-center justify-between gap-2"
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <div
                                    className={`w-6 h-6 rounded-lg ${sc.iconBg} text-white flex items-center justify-center shadow-2xs group-hover/sc:scale-110 transition-transform shrink-0`}
                                  >
                                    <ScIcon className="w-3 h-3" />
                                  </div>
                                  <div className="min-w-0">
                                    <div className="flex items-center gap-1.5">
                                      <span className="font-bold text-xs text-slate-800 group-hover/sc:text-[#005696] transition-colors truncate">
                                        {sc.title}
                                      </span>
                                      <span
                                        className={`text-[8px] font-black uppercase px-1.5 py-0.2 rounded border ${sc.badgeStyle} shrink-0`}
                                      >
                                        {sc.badge}
                                      </span>
                                    </div>
                                    <p className="text-[10px] text-slate-500 font-medium truncate leading-tight mt-0.5">
                                      {sc.desc}
                                    </p>
                                  </div>
                                </div>
                                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover/sc:text-[#005696] group-hover/sc:translate-x-0.5 transition-all shrink-0" />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Bottom CTA */}
                    <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        {tile.asset}
                      </span>
                      <Link
                        href={tile.route}
                        className="px-3.5 py-1.5 rounded-lg bg-[#005696] hover:bg-[#00407a] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm hover:shadow transition-all"
                      >
                        <span>{tile.ctaText}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            /* Compact Modern Tiles View */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredCategories.map((tile) => {
                const IconComponent = tile.icon;
                return (
                  <motion.div
                    key={tile.id}
                    whileHover={{ scale: 1.01 }}
                    className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all bg-white hover:bg-slate-50 shadow-2xs hover:shadow-md ${tile.cardBorder}`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className={`p-2 rounded-lg bg-gradient-to-br ${tile.gradient} text-white shadow-xs`}>
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${tile.badgeStyle}`}>
                          {tile.badge}
                        </span>
                      </div>

                      <h4 className="font-black text-lg text-slate-900">
                        {tile.title}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-bold mb-2 truncate">
                        {tile.fullName}
                      </p>
                      <p className="text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed mb-3">
                        {tile.desc}
                      </p>

                      {/* 5 Sub-Cards Quick Bar in Compact Mode */}
                      <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-slate-100">
                        {tile.subCards.map((sc, scIdx) => {
                          const ScIcon = sc.icon;
                          return (
                            <button
                              key={scIdx}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedItem({
                                  name: `${tile.title} - ${sc.title}`,
                                  title: `${tile.title} - ${sc.title}`,
                                  category: `${tile.title} Core Domain`,
                                  desc: sc.desc,
                                  ruleCode: sc.ruleCode,
                                  ttTemplate: sc.ttTemplate,
                                  route: sc.route,
                                  badge: sc.badge,
                                  badgeStyle: sc.badgeStyle,
                                  type: 'subcard'
                                });
                              }}
                              className="px-2 py-1 rounded-md bg-slate-100 hover:bg-blue-50 border border-slate-200 text-left flex items-center gap-1.5 transition-colors"
                            >
                              <ScIcon className="w-3 h-3 text-[#005696] shrink-0" />
                              <span className="text-[10px] font-bold text-slate-700 truncate">{sc.title}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[9px] font-bold text-slate-400 uppercase">
                        {tile.asset}
                      </span>
                      <Link
                        href={tile.route}
                        className="text-xs font-bold text-[#005696] hover:underline flex items-center gap-1"
                      >
                        <span>{tile.ctaText}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </motion.div>
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

                {/* If Trouble Ticket Template is present */}
                {selectedItem.ttTemplate && (
                  <div className="p-3.5 bg-slate-900 border border-slate-700 rounded-xl space-y-2 text-white font-mono text-[11px]">
                    <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-1.5">
                      <span className="font-bold text-cyan-300">Standard Trouble Ticket Draft</span>
                      <button
                        onClick={() => copyToClipboard(selectedItem.ttTemplate, 'modal-tt-copy')}
                        className="px-2.5 py-1 bg-[#005696] hover:bg-[#0070ba] text-white text-[10px] rounded-md font-sans font-bold flex items-center gap-1 transition-all"
                      >
                        {copiedLink === 'modal-tt-copy' ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedLink === 'modal-tt-copy' ? 'Copied TT!' : 'Copy TT'}</span>
                      </button>
                    </div>
                    <pre className="whitespace-pre-wrap leading-relaxed text-lime-300 font-mono text-[10px]">
                      {selectedItem.ttTemplate}
                    </pre>
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
