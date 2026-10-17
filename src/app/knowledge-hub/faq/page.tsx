"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Grid,
  ChevronDown,
  Globe,
  Home,
  Users,
  Atom,
  Tv,
  CreditCard,
  Mail,
  Phone,
  Radio,
  FileText,
  X,
  Copy,
  Check,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Wrench,
  BookOpen,
  ArrowLeft,
  Share2,
  Monitor,
  Smartphone,
  Cpu
} from 'lucide-react';

// FAQ Content mapping with real SLT Contact Center knowledge
const FAQ_DETAILS: Record<string, {
  title: string;
  category: string;
  ruleCode?: string;
  targetGroup?: string;
  questions: { q: string; a: string; action?: string }[];
  configSteps?: string[];
}> = {
  'FAQ-FTTH': {
    title: 'FAQ - FTTH (Fibre To The Home)',
    category: 'Broadband',
    ruleCode: 'RULE_LOS_RED',
    targetGroup: 'AREA-MTCE',
    questions: [
      {
        q: 'What should the agent do if the customer reports LOS Red LED blinking on the ONT router?',
        a: 'LOS Red blinking indicates an Optical Signal Loss (fiber drop cable cut, outdoor bend, or exchange power drop). Check LDAP and GB Portal optical power (Rx < -27 dBm). Dispatch direct Trouble Ticket to AREA-MTCE immediately.',
        action: 'Direct TT to AREA-MTCE'
      },
      {
        q: 'What if telephone voice line has no dial tone, but ONT PON LED is solid green (ON)?',
        a: 'Per Rule 11, if PON is ON, optical transmission is healthy. The voice issue is internal to SIP port configuration or exchange MDF frame. Dispatch directly to MDF (Main Distribution Frame).',
        action: 'Direct TT to MDF'
      },
      {
        q: 'How to verify customer Wi-Fi dual-band (2.4GHz vs 5GHz) connectivity on ONT?',
        a: 'Advise customer to connect devices to the 5GHz SSID for high-speed fiber testing (within 5 meters). For longer distances through concrete walls, use the 2.4GHz network.'
      }
    ],
    configSteps: [
      'Access ONT IP: http://192.168.1.1',
      'Username: user | Password: on sticker behind router',
      'Check PON status under Status -> WAN Information',
      'Verify Optical RX Power between -8 dBm and -25 dBm'
    ]
  },
  'FAQ-ADSL': {
    title: 'FAQ - ADSL (Copper Broadband)',
    category: 'Broadband',
    ruleCode: 'RULE_ADSL_ROUTER_FAULTY',
    targetGroup: 'NONE',
    questions: [
      {
        q: 'What to advise if customer ADSL router is faulty on double-play copper?',
        a: 'DO NOT report Trouble Ticket. Per official triage rule, advise customer to take the faulty ADSL router with power adapter to the nearest Regional Telecom Office (RTO) for physical replacement.',
        action: 'Advise Nearest RTO Visit'
      },
      {
        q: 'Frequent line disconnections during rainy weather?',
        a: 'Check loop resistance and SNR margin on copper line. If SNR margin is below 6 dB, log Trouble Ticket to AREA-MTCE for line rehabilitation.'
      }
    ]
  },
  'FAQ-LTE': {
    title: 'FAQ - 4G LTE Fixed Wireless',
    category: 'Broadband',
    ruleCode: 'RULE_4G_RELOAD_DIRECT_CHANNELS',
    targetGroup: 'BSS-OPR-OCR',
    questions: [
      {
        q: 'What if 4G LTE Prepaid reload was paid via Mobitel dealer or MySLT but not credited?',
        a: 'Dispatch Trouble Ticket directly to BSS-OPR-OCR. Must capture transaction date, amount, and source channel.',
        action: 'Direct TT to BSS-OPR-OCR'
      },
      {
        q: 'What if 4G LTE Prepaid reload was paid via Food City or Commercial Banks?',
        a: 'DO NOT create technical TT. Create BILL_SR_ONLY and advise customer to contact merchant/bank with physical receipt for refund.',
        action: 'BILL_SR_ONLY'
      }
    ]
  },
  'FAQ-SLTmail': {
    title: 'FAQ - SLTmail (webmail.slt.lk)',
    category: 'Broadband',
    questions: [
      {
        q: 'How do customers configure Outlook for SLT Mail?',
        a: 'Incoming IMAP: imap.sltnet.lk (Port 993 SSL). Outgoing SMTP: smtp.sltnet.lk (Port 465 SSL or Port 587 STARTTLS).'
      },
      {
        q: 'Customer forgot SLTnet email password?',
        a: 'Verify subscriber NIC and SLT telephone number. Issue password reset link via registered mobile.'
      }
    ]
  },
  'FAQ-MySLT': {
    title: 'FAQ - My SLT App & Self-Care',
    category: 'Broadband',
    questions: [
      {
        q: 'Customer unable to log into MySLT app?',
        a: 'Verify account active status. Advise clearing app cache or resetting password via registered primary contact number.'
      },
      {
        q: 'Extra data purchase deduction delay?',
        a: 'MySLT purchases activate within 60 seconds. If data is not added after 15 minutes, check I-Hub billing transaction status.'
      }
    ]
  },
  'FAQ-NewSystemMIT': {
    title: 'FAQ - PEO TV New System (MIT Platform)',
    category: 'PEO TV',
    ruleCode: 'RULE_STB_ONT_ROUTER_FAULTY',
    targetGroup: 'AREA-MTCE',
    questions: [
      {
        q: 'Customer PEO TV screen displays "Error Code 403 / Authentication Failed"?',
        a: 'Check PEOTV Admin portal to confirm STB MAC address is paired to subscriber port. Perform remote port reset.'
      },
      {
        q: 'PEO TV Remote controller unresponsive within 6 months of purchase?',
        a: 'DO NOT create Trouble Ticket. Device is under warranty. Advise customer to bring remote to nearest Teleshop for free replacement.',
        action: 'Teleshop Replacement Under Warranty'
      }
    ]
  },
  'FAQ-HuwaComNetgem': {
    title: 'FAQ - PEO TV (Huawei / Netgem STB)',
    category: 'PEO TV',
    questions: [
      {
        q: 'Netgem STB flashing purple light and stuck on boot screen?',
        a: 'Perform hard power cycle: disconnect power for 30 seconds while holding STB standby button upon reconnection.'
      },
      {
        q: 'HDMI signal loss on Huawei STB?',
        a: 'Advise customer to test alternative HDMI port or check AV cable. If hardware power LED is completely dead, dispatch AREA-MTCE for STB swap.'
      }
    ]
  },
  'FAQ-MINTClarity': {
    title: 'FAQ - MINT / Clarity Provisioning',
    category: 'PEO TV',
    questions: [
      {
        q: 'Service order stuck in "In-Flight" status in Clarity C12?',
        a: 'Escalate to INT-NW-SYS-ADMIN with Clarity Order ID and customer SLT circuit ID.'
      }
    ]
  },
  'FAQ-BillingOperational': {
    title: 'FAQ - Billing Operational Guidelines',
    category: 'Billing',
    questions: [
      {
        q: 'Customer disconnected for non-payment after paying bill online?',
        a: 'Check payment transaction in I-Hub or CMS. If paid within 2 hours, issue immediate temporary reconnection via CMS system.'
      },
      {
        q: 'What is the Low Pay Bill verification policy before dispatching slowness TT?',
        a: 'Ensure customer does not have overdue bills exceeding credit limit, as speed is intentionally throttled prior to disconnection.'
      }
    ]
  },
  'FAQ-BillInquires': {
    title: 'FAQ - Bill Inquiries & Itemized Charges',
    category: 'Billing',
    questions: [
      {
        q: 'Customer disputes unexpected VAS charges on monthly bill?',
        a: 'Inspect active VAS subscriptions in IBSIB. If activated without customer consent, raise credit adjustment SR.'
      }
    ]
  },
  'FAQ-BillComplains': {
    title: 'FAQ - Bill Complaints & Reconciliation',
    category: 'Billing',
    questions: [
      {
        q: 'How to log a formal Billing Complaint?',
        a: 'Create a BILL_SR_ONLY ticket assigned to BSS-OPR-OCR with bank payment slip attachment.'
      }
    ]
  },
  'FAQ-eBill': {
    title: 'FAQ - e-Bill Paperless Service',
    category: 'Billing',
    questions: [
      {
        q: 'How can a customer register for e-Bill?',
        a: 'Customer can SMS "EBILL <space> SLT Telephone No <space> Email" to 0710125555 or register via MySLT portal.'
      }
    ]
  },
  'FAQ-MyBill': {
    title: 'FAQ - My-Bill Online Statements',
    category: 'Billing',
    questions: [
      {
        q: 'Customer requesting PDF copies of past 6 months bills?',
        a: 'Direct customer to MySLT web portal or email PDF statements directly to verified primary email on file.'
      }
    ]
  },
  'FAQ-MintCRM': {
    title: 'FAQ - Mint CRM Best Practices',
    category: 'Billing',
    questions: [
      {
        q: 'How to search customer account by Mobile Number?',
        a: 'Use Global Search with prefix "07" or search by National Identity Card (NIC) number.'
      }
    ]
  },
  'FAQ-IGENCRM': {
    title: 'FAQ - IGEN CRM Module',
    category: 'Billing',
    questions: [
      {
        q: 'Handling corporate enterprise customer tickets in IGEN CRM?',
        a: 'Select Enterprise SLA queue with account manager tagging.'
      }
    ]
  },
  'FAQ-sDesk': {
    title: 'FAQ - sDesk Internal IT Support',
    category: 'Billing',
    questions: [
      {
        q: 'Reporting agent workstation VPN / Finesse phone issues?',
        a: 'Raise urgent priority ticket on sDesk with agent terminal IP and extension number.'
      }
    ]
  },
  'RouterConfig-FTTH': {
    title: 'Router Configuration - FTTH (ZTE / Huawei / FiberHome)',
    category: 'Broadband Configuration Support',
    configSteps: [
      '1. Connect PC to LAN Port 1 or connect to default Wi-Fi SSID.',
      '2. Open web browser and navigate to: http://192.168.1.1',
      '3. Login with admin credentials (or user/user1234).',
      '4. Navigate to Network -> WAN -> Internet Connection.',
      '5. Verify VLAN ID is set to 20 for High-Speed Internet.',
      '6. Verify VLAN ID is set to 30 for PEO TV.',
      '7. Enter PPPoE Username (e.g. slt_xxxx@sltbb) and Password.',
      '8. Save and reboot ONT router.'
    ],
    questions: [
      {
        q: 'VLAN Configuration for PEO TV port binding?',
        a: 'PEO TV requires LAN Port 4 bound to VLAN 30 (IPTV) with IGMP Snooping enabled.'
      }
    ]
  },
  'RouterConfig-ADSL': {
    title: 'Router Configuration - ADSL Modem',
    category: 'Broadband Configuration Support',
    configSteps: [
      '1. Open http://192.168.1.1 in browser.',
      '2. VPI: 8 | VCI: 35 | Protocol: PPPoE LLC.',
      '3. Enter customer broadband username and password.',
      '4. Modulation mode: ADSL2+ (Annex A).'
    ],
    questions: []
  },
  'RouterConfig-LTE': {
    title: 'Router Configuration - 4G LTE CPE Router',
    category: 'Broadband Configuration Support',
    configSteps: [
      '1. Connect to 4G router Wi-Fi.',
      '2. Navigate to http://192.168.8.1.',
      '3. APN Name: sltbb (or mobitel).',
      '4. Network mode: 4G Only (prefer Band 40 / 2300MHz or Band 3 / 1800MHz).'
    ],
    questions: []
  },
  'CPE-Management': {
    title: 'CPE - Management System (TR-069 Auto Configuration)',
    category: 'Broadband Configuration Support',
    configSteps: [
      'ACS URL: http://acs.slt.lk:8080/openacs/service',
      'ACS Username & Password: Provisioned automatically via DHCP Option 43.'
    ],
    questions: [
      {
        q: 'Can an agent remotely change customer Wi-Fi password through ACS?',
        a: 'Yes, authorized officers can push new WPA2 Pre-Shared Keys via the TR-069 ACS portal without on-site visits.'
      }
    ]
  },
  'FAQ-eMail': {
    title: 'FAQ - e-Mail Services',
    category: 'Other Services',
    questions: [
      {
        q: 'Mail storage quota exceeded?',
        a: 'Advise customer to log into webmail.slt.lk and purge Deleted Items and Spam folders.'
      }
    ]
  },
  'FAQ-CDMA': {
    title: 'FAQ - CDMA Legacy Migrations',
    category: 'Other Services',
    questions: [
      {
        q: 'Customer migrating from old CDMA CityLink to 4G VoLTE?',
        a: 'Issue free 4G VoLTE desk phone unit at nearest Teleshop with existing telephone number retained.'
      }
    ]
  },
  'FAQ-VOICE': {
    title: 'FAQ - Voice Line & Dial Tone Services',
    category: 'Other Services',
    ruleCode: 'RULE_FIBER_VOICE_LINE_FAULT',
    questions: [
      {
        q: 'Telephone line has loud humming noise or cross-talk?',
        a: 'Check outdoor drop wire insulation. Log Trouble Ticket to MDF or AREA-MTCE based on exchange test.'
      }
    ]
  },
  'FAQ-OTHER': {
    title: 'FAQ - Other Inquiries & Value Added Services',
    category: 'Other Services',
    questions: [
      {
        q: 'How to check directory inquiry number for government offices?',
        a: 'Use SMART-PEARL Directory Search tool or dial 1212 / 161 helpline.'
      }
    ]
  }
};

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFaqKey, setSelectedFaqKey] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const openFaq = (key: string) => {
    setSelectedFaqKey(key);
  };

  const activeFaq = selectedFaqKey ? FAQ_DETAILS[selectedFaqKey] : null;

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f4f7f9] overflow-y-auto select-none">
      
      {/* 1. TOP SHAREPOINT BAR */}
      <div className="bg-[#005a9c] text-white px-4 py-2 flex items-center justify-between text-xs shadow-xs shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/knowledge-hub" className="flex items-center gap-1.5 cursor-pointer hover:opacity-80">
            <Grid className="w-4 h-4 text-white" />
            <span className="font-bold tracking-tight text-sm">SharePoint</span>
          </Link>

          <div className="relative ml-4 w-72 md:w-96">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search this site..."
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
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <span className="font-black text-xl text-[#005696] tracking-tighter">SLT</span>
              <span className="font-black text-xl text-[#22b14c] tracking-tighter">MOBITEL</span>
            </div>
            <span className="text-[9px] text-[#005696] font-semibold -mt-1 tracking-wider uppercase">The Connection</span>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-700">
          <Link href="/knowledge-hub" className="text-slate-700 hover:text-[#005696] hover:underline">Home</Link>
          <span className="flex items-center gap-1 cursor-pointer hover:text-[#005696]">Groups <ChevronDown className="w-3 h-3 text-slate-400" /></span>
          <span className="flex items-center gap-1 cursor-pointer hover:text-[#005696]">eApplications <ChevronDown className="w-3 h-3 text-slate-400" /></span>
          <span className="flex items-center gap-1 cursor-pointer hover:text-[#005696]">General <ChevronDown className="w-3 h-3 text-slate-400" /></span>
          <span className="flex items-center gap-1 cursor-pointer hover:text-[#005696] text-[#005696] font-bold">Knowledge Base <ChevronDown className="w-3 h-3 text-[#005696]" /></span>
        </div>
      </div>

      {/* 3. BREADCRUMB SUB-HEADER */}
      <div className="bg-white border-b border-slate-200 px-6 py-2 flex items-center justify-between text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <Link href="/knowledge-hub" className="text-[#005696] font-bold hover:underline flex items-center gap-1">
            <ArrowLeft className="w-3 h-3" /> Back to Knowledge Hub
          </Link>
          <span className="text-slate-300">/</span>
          <span className="font-semibold text-slate-800">FAQ - ( Frequently Asked Questions )</span>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-slate-500">
          <span>Private group</span>
          <span className="flex items-center gap-1"><Users className="w-3 h-3" /> 1 member</span>
          <span className="cursor-pointer font-bold">•••</span>
        </div>
      </div>

      {/* 4. HERO BANNER WITH F.A.Q. KEYBOARD IMAGE */}
      <div className="relative bg-gradient-to-r from-[#1a0f0f] via-[#2d1215] to-[#111116] text-white px-8 py-10 overflow-hidden border-b border-red-950/40">
        {/* Background glow and subtle keyboard key pattern */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-25 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-600 via-transparent to-transparent pointer-events-none"></div>
        <div className="absolute right-12 top-1/2 -translate-y-1/2 text-8xl font-black text-red-500/10 tracking-widest font-mono pointer-events-none select-none">
          F.A.Q.
        </div>

        <div className="max-w-6xl mx-auto relative z-10 space-y-4">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white drop-shadow-md">
            FAQ - ( Frequently Asked Questions )
          </h1>

          {/* Publisher metadata matching screenshot */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-teal-700 to-emerald-600 border border-teal-400 flex items-center justify-center font-bold text-xs text-white shadow-sm">
              MR
            </div>
            <div className="text-xs">
              <p className="font-bold text-white">Mohamed Riyas</p>
              <p className="text-[11px] text-red-200/80">Contact Centre Associate - A15</p>
              <p className="text-[10px] text-slate-400">Published 2/11/2026</p>
            </div>
          </div>
        </div>
      </div>

      {/* 5. QUICK NAVIGATION ACTION BUTTONS */}
      <div className="bg-[#0b1426] px-6 py-4 border-b border-indigo-950/60 shadow-inner">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center gap-3">
          <Link
            href="/knowledge-hub"
            className="px-5 py-2.5 rounded-lg border border-indigo-400/40 bg-white/5 hover:bg-white/10 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-xs hover:border-cyan-400 group"
          >
            <Home className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
            <span>Home</span>
          </Link>

          <button
            onClick={() => openFaq('FAQ-BillingOperational')}
            className="px-5 py-2.5 rounded-lg border border-indigo-400/40 bg-white/5 hover:bg-white/10 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-xs hover:border-cyan-400 group"
          >
            <Users className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
            <span>Team Leader Escalations</span>
          </button>

          <button
            onClick={() => openFaq('FAQ-OTHER')}
            className="px-5 py-2.5 rounded-lg border border-indigo-400/40 bg-white/5 hover:bg-white/10 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-xs hover:border-cyan-400 group"
          >
            <Atom className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
            <span>Rebuilding Sri Lanka</span>
          </button>
        </div>
      </div>

      {/* 6. MAIN CONTENT BODY: FAQ GRID ON DARK CONSTELLATION BACKGROUND */}
      <div className="relative flex-1 bg-[radial-gradient(#1e293b_1px,transparent_1px)] bg-[#070e1d] [background-size:20px_20px] p-6 md:p-8 text-white">
        
        {/* Subtle decorative network node connection lines */}
        <div className="max-w-6xl mx-auto space-y-8 relative z-10">
          
          {/* Main 4-Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
            
            {/* COLUMN 1: Broadband */}
            <div className="space-y-3">
              <h3 className="text-center text-sm font-black text-white border-b border-indigo-500/50 pb-1.5 uppercase tracking-wider">
                Broadband
              </h3>
              <div className="space-y-2.5">
                <button
                  onClick={() => openFaq('FAQ-FTTH')}
                  className="w-full py-2.5 px-3 bg-white hover:bg-cyan-50 text-[#005696] font-bold text-xs rounded-md shadow-md text-left flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-95 border border-slate-200"
                >
                  <Globe className="w-4 h-4 text-cyan-600 shrink-0" />
                  <span>FAQ- FTTH</span>
                </button>

                <button
                  onClick={() => openFaq('FAQ-ADSL')}
                  className="w-full py-2.5 px-3 bg-white hover:bg-cyan-50 text-[#005696] font-bold text-xs rounded-md shadow-md text-left flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-95 border border-slate-200"
                >
                  <Globe className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>FAQ- ADSL</span>
                </button>

                <button
                  onClick={() => openFaq('FAQ-LTE')}
                  className="w-full py-2.5 px-3 bg-white hover:bg-cyan-50 text-[#005696] font-bold text-xs rounded-md shadow-md text-left flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-95 border border-slate-200"
                >
                  <Radio className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>FAQ - LTE</span>
                </button>

                <button
                  onClick={() => openFaq('FAQ-SLTmail')}
                  className="w-full py-2.5 px-3 bg-white hover:bg-cyan-50 text-[#005696] font-bold text-xs rounded-md shadow-md text-left flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-95 border border-slate-200"
                >
                  <Mail className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>FAQ - SLTmail</span>
                </button>

                <div className="pt-4">
                  <button
                    onClick={() => openFaq('FAQ-MySLT')}
                    className="w-full py-2.5 px-3 bg-white hover:bg-cyan-50 text-[#005696] font-bold text-xs rounded-md shadow-md text-left flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-95 border border-slate-200"
                  >
                    <Smartphone className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>FAQ - My SLT</span>
                  </button>
                </div>
              </div>
            </div>

            {/* COLUMN 2: PEO TV */}
            <div className="space-y-3">
              <h3 className="text-center text-sm font-black text-white border-b border-indigo-500/50 pb-1.5 uppercase tracking-wider">
                PEO TV
              </h3>
              <div className="space-y-2.5">
                <button
                  onClick={() => openFaq('FAQ-NewSystemMIT')}
                  className="w-full py-2.5 px-3 bg-white hover:bg-cyan-50 text-[#005696] font-bold text-xs rounded-md shadow-md text-left flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-95 border border-slate-200"
                >
                  <Tv className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>FAQ - New System (MIT)</span>
                </button>

                <button
                  onClick={() => openFaq('FAQ-HuwaComNetgem')}
                  className="w-full py-2.5 px-3 bg-white hover:bg-cyan-50 text-[#005696] font-bold text-xs rounded-md shadow-md text-left flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-95 border border-slate-200"
                >
                  <Tv className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>FAQ - (HuwaCom /Netgem )</span>
                </button>

                <div className="pt-16">
                  <button
                    onClick={() => openFaq('FAQ-MINTClarity')}
                    className="w-full py-2.5 px-3 bg-white hover:bg-cyan-50 text-[#005696] font-bold text-xs rounded-md shadow-md text-left flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-95 border border-slate-200"
                  >
                    <Monitor className="w-4 h-4 text-cyan-600 shrink-0" />
                    <span>FAQ - MINT/Clarity</span>
                  </button>
                </div>
              </div>
            </div>

            {/* COLUMN 3: Billing */}
            <div className="space-y-3">
              <h3 className="text-center text-sm font-black text-white border-b border-indigo-500/50 pb-1.5 uppercase tracking-wider">
                Billing
              </h3>
              <div className="space-y-2.5">
                <button
                  onClick={() => openFaq('FAQ-BillingOperational')}
                  className="w-full py-2.5 px-3 bg-white hover:bg-cyan-50 text-[#005696] font-bold text-xs rounded-md shadow-md text-left flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-95 border border-slate-200"
                >
                  <CreditCard className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>FAQ - Billing Operational...</span>
                </button>

                <button
                  onClick={() => openFaq('FAQ-BillInquires')}
                  className="w-full py-2.5 px-3 bg-white hover:bg-cyan-50 text-[#005696] font-bold text-xs rounded-md shadow-md text-left flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-95 border border-slate-200"
                >
                  <CreditCard className="w-4 h-4 text-pink-600 shrink-0" />
                  <span>FAQ - Bill Inquires</span>
                </button>

                <button
                  onClick={() => openFaq('FAQ-BillComplains')}
                  className="w-full py-2.5 px-3 bg-white hover:bg-cyan-50 text-[#005696] font-bold text-xs rounded-md shadow-md text-left flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-95 border border-slate-200"
                >
                  <CreditCard className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>FAQ - Bill Complains</span>
                </button>

                <button
                  onClick={() => openFaq('FAQ-eBill')}
                  className="w-full py-2.5 px-3 bg-white hover:bg-cyan-50 text-[#005696] font-bold text-xs rounded-md shadow-md text-left flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-95 border border-slate-200"
                >
                  <CreditCard className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>FAQ - e-Bill</span>
                </button>

                <button
                  onClick={() => openFaq('FAQ-MyBill')}
                  className="w-full py-2.5 px-3 bg-white hover:bg-cyan-50 text-[#005696] font-bold text-xs rounded-md shadow-md text-left flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-95 border border-slate-200"
                >
                  <CreditCard className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>FAQ - My-Bill</span>
                </button>

                <div className="pt-2 space-y-2">
                  <button
                    onClick={() => openFaq('FAQ-MintCRM')}
                    className="w-full py-2.5 px-3 bg-white hover:bg-cyan-50 text-[#005696] font-bold text-xs rounded-md shadow-md text-left flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-95 border border-slate-200"
                  >
                    <CreditCard className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>FAQ - Mint CRM</span>
                  </button>

                  <button
                    onClick={() => openFaq('FAQ-IGENCRM')}
                    className="w-full py-2.5 px-3 bg-white hover:bg-cyan-50 text-[#005696] font-bold text-xs rounded-md shadow-md text-left flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-95 border border-slate-200"
                  >
                    <CreditCard className="w-4 h-4 text-purple-600 shrink-0" />
                    <span>FAQ - IGEN CRM</span>
                  </button>

                  <button
                    onClick={() => openFaq('FAQ-sDesk')}
                    className="w-full py-2.5 px-3 bg-white hover:bg-cyan-50 text-[#005696] font-bold text-xs rounded-md shadow-md text-left flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-95 border border-slate-200"
                  >
                    <CreditCard className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>FAQ - sDesk</span>
                  </button>
                </div>
              </div>
            </div>

            {/* COLUMN 4: Broadband Configuration Support (Right Dark Blue Panel) */}
            <div className="bg-[#002f5e]/90 border border-cyan-500/40 rounded-xl p-4 space-y-3.5 shadow-xl backdrop-blur-md">
              <h3 className="text-sm font-black text-white text-center pb-2 border-b border-cyan-400/30 tracking-tight">
                Broadband Configuration Support
              </h3>

              <div className="space-y-2.5">
                <button
                  onClick={() => openFaq('RouterConfig-FTTH')}
                  className="w-full py-2.5 px-3 bg-white hover:bg-cyan-50 text-[#005696] font-bold text-xs rounded-md shadow-md text-left flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-95"
                >
                  <Globe className="w-4 h-4 text-cyan-600 shrink-0" />
                  <span>Router Configuration - FTTH</span>
                </button>

                <button
                  onClick={() => openFaq('RouterConfig-ADSL')}
                  className="w-full py-2.5 px-3 bg-white hover:bg-cyan-50 text-[#005696] font-bold text-xs rounded-md shadow-md text-left flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-95"
                >
                  <Globe className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Router Configuration - ADSL</span>
                </button>

                <button
                  onClick={() => openFaq('RouterConfig-LTE')}
                  className="w-full py-2.5 px-3 bg-white hover:bg-cyan-50 text-[#005696] font-bold text-xs rounded-md shadow-md text-left flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-95"
                >
                  <Globe className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Router Configuration - LTE</span>
                </button>

                <button
                  onClick={() => openFaq('CPE-Management')}
                  className="w-full py-2.5 px-3 bg-white hover:bg-cyan-50 text-[#005696] font-bold text-xs rounded-md shadow-md text-left flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-95"
                >
                  <Globe className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>CPE - Management System</span>
                </button>
              </div>
            </div>

          </div>

          {/* LOWER SECTION: Other Services */}
          <div className="pt-4 border-t border-indigo-900/40">
            <h3 className="text-left text-sm font-black text-white border-b-2 border-indigo-400/40 pb-1 mb-3.5 inline-block uppercase tracking-wider">
              Other Services
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <button
                onClick={() => openFaq('FAQ-eMail')}
                className="py-2.5 px-3 bg-white hover:bg-cyan-50 text-[#005696] font-bold text-xs rounded-md shadow-md text-left flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-95"
              >
                <Mail className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>FAQ - e-Mail</span>
              </button>

              <button
                onClick={() => openFaq('FAQ-CDMA')}
                className="py-2.5 px-3 bg-white hover:bg-cyan-50 text-[#005696] font-bold text-xs rounded-md shadow-md text-left flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-95"
              >
                <Smartphone className="w-4 h-4 text-teal-600 shrink-0" />
                <span>FAQ - CDMA</span>
              </button>

              <button
                onClick={() => openFaq('FAQ-VOICE')}
                className="py-2.5 px-3 bg-white hover:bg-cyan-50 text-[#005696] font-bold text-xs rounded-md shadow-md text-left flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-95"
              >
                <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>FAQ - VOICE</span>
              </button>

              <button
                onClick={() => openFaq('FAQ-OTHER')}
                className="py-2.5 px-3 bg-white hover:bg-cyan-50 text-[#005696] font-bold text-xs rounded-md shadow-md text-left flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-95"
              >
                <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                <span>FAQ - OTHER</span>
              </button>
            </div>
          </div>

        </div>
      </div>


      {/* ======================================================== */}
      {/* INTERACTIVE FAQ DETAIL MODAL / DRAWER                    */}
      {/* ======================================================== */}
      <AnimatePresence>
        {activeFaq && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden"
            >
              {/* Header */}
              <div className="p-4 bg-[#005696] text-white flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2.5">
                  <BookOpen className="w-5 h-5 text-cyan-200" />
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-200">
                      {activeFaq.category} Knowledge Guide
                    </span>
                    <h3 className="text-base font-bold text-white">
                      {activeFaq.title}
                    </h3>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedFaqKey(null)}
                  className="p-1 rounded-md text-white/80 hover:text-white hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
                
                {/* Connected Triage Rule Banner if applicable */}
                {activeFaq.ruleCode && (
                  <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider">
                        Connected AI Trouble Ticket Rule
                      </span>
                      <p className="font-mono font-bold text-indigo-950 text-xs">{activeFaq.ruleCode}</p>
                    </div>
                    {activeFaq.targetGroup && (
                      <span className="px-2.5 py-1 rounded bg-amber-400 text-amber-950 font-black text-[10px] uppercase tracking-wider">
                        {activeFaq.targetGroup}
                      </span>
                    )}
                  </div>
                )}

                {/* Step-by-Step Configuration Steps if available */}
                {activeFaq.configSteps && activeFaq.configSteps.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                      <Wrench className="w-4 h-4 text-[#005696]" /> Step-by-Step Configuration Guide
                    </h4>
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
                      {activeFaq.configSteps.map((step, idx) => (
                        <p key={idx} className="font-mono text-[11px] text-slate-800 flex items-start gap-2">
                          <span className="w-4 h-4 rounded-full bg-[#005696] text-white flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5">{idx + 1}</span>
                          <span>{step}</span>
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Frequently Asked Questions */}
                {activeFaq.questions && activeFaq.questions.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                      <HelpCircle className="w-4 h-4 text-emerald-600" /> Operational Q&amp;A
                    </h4>
                    <div className="space-y-3">
                      {activeFaq.questions.map((item, idx) => (
                        <div key={idx} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                          <p className="font-bold text-slate-900 text-xs">
                            Q: {item.q}
                          </p>
                          <p className="text-slate-600 leading-relaxed font-medium">
                            A: {item.a}
                          </p>
                          {item.action && (
                            <div className="pt-1 flex items-center justify-between">
                              <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                Action: {item.action}
                              </span>
                              <button
                                onClick={() => copyToClipboard(item.a, `q-${idx}`)}
                                className="text-[10px] font-bold text-[#005696] hover:underline flex items-center gap-1"
                              >
                                {copiedId === `q-${idx}` ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                                <span>Copy Script</span>
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>

              {/* Footer */}
              <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex justify-end">
                <button
                  onClick={() => setSelectedFaqKey(null)}
                  className="px-5 py-1.5 bg-[#005696] hover:bg-[#00407a] text-white text-xs font-bold rounded-lg transition-colors shadow-xs"
                >
                  Close FAQ
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
