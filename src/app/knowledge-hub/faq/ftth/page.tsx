"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Grid,
  ChevronDown,
  Home,
  FileText,
  Users,
  ArrowLeft,
  X,
  Copy,
  Check,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Wrench,
  BookOpen,
  Phone,
  Wifi,
  ExternalLink,
  Download,
  PhoneCall,
  ShieldCheck,
  Zap,
  Star,
  Eye,
  Share2,
  MessageSquare,
  Maximize2,
  Printer,
  ZoomIn,
  ZoomOut
} from 'lucide-react';

// Official FTTH Complaints & Symptoms/Action Matrix Data matching screenshot
const FTTH_FAQ_ROWS = [
  {
    id: 'general',
    complaint: {
      title: 'General Questions',
      updated: null,
      note: null
    },
    actions: [
      {
        text: 'General Questions FTTH',
        linkText: 'Click Here',
        type: 'general_questions_flowchart',
        pageUrl: '/knowledge-hub/faq/ftth/general-questions',
        content: {
          title: 'General Questions FTTH - Connection Status & Quota SOP',
          guidance: 'Step-by-step triage: Check Connection Status in I-Hub/LDAP -> If Not Active, inform to settle bill (END). If Active, check VAS Portal GB availability -> If throttled due to GB, add Extra GB (END); If throttled due to bill arrears, settle bill (check LDAP/VAS package match); If GBs available, follow FAQ on ONT Indicators.',
          sop: '1. Check I-Hub/LDAP status (Active/Not Active).\n2. If Active, check VAS Portal GB availability.\n3. Verify LDAP vs VAS Portal package match.\n4. Route to ONT Indicators if quota is available.'
        }
      }
    ]
  },
  {
    id: 'ont_pon',
    complaint: {
      title: 'ONT - PON indicator issue',
      note: '(When the customer is not available at the location, to check the ONT indicators to report the fault, Create the TT for the Default WG.)',
      updated: null
    },
    actions: [
      {
        text: '• ONT not working',
        linkText: 'Click Here',
        type: 'ont_pdf_flowchart',
        content: {
          title: 'ONT Not Working - Official Decision Flowchart',
          ruleCode: 'RULE_STB_ONT_ROUTER_FAULTY',
          targetGroup: 'AREA-CPE-MTCE',
          guidance: 'Hardware or power failure on customer premises ONT. Follow official decision tree: Check power indicator -> OFF (check power button & charger) / ON (restart). If unresolved, dispatch Trouble Ticket to AREA-CPE-MTCE.',
          sop: '1. Check power indicator (OFF/ON).\n2. If OFF, press power button; verify charger adapter.\n3. If ON, perform power cycle restart.\n4. If still faulty, create TT to AREA-CPE-MTCE.'
        }
      },
      {
        text: '• PON indicator Red, Off, Blinking and Steady (The customer is using the voice service/ Does not using voice service )',
        linkText: 'Click Here',
        type: 'pon_indicator_flowchart',
        pageUrl: '/knowledge-hub/faq/ftth/pon-los-indicator',
        content: {
          title: 'PON / LOS Indicator Diagnostic Matrix',
          ruleCode: 'RULE_LOS_RED / RULE_FIBER_VOICE_LINE_FAULT',
          targetGroup: 'AREA-CPE-MTCE / AREA-MTCE / MDF',
          guidance: 'CRITICAL ROUTING MATRIX:\n- LOS RED Blinking / PON OFF: Optical transmission fault / cable cut -> Dispatch DIRECT_TT to AREA-CPE-MTCE (or Default WG if customer unavailable).\n- PON STEADY ON: ONT Restart -> Browser check -> Device check -> Check Private Proxy. If proxy off but still not working -> Create TT to AREA-CPE-MTCE.',
          sop: 'Mandatory Pre-checks: Verify LDAP account status and GB Portal optical power (threshold: Rx between -8 dBm and -27 dBm). TT description is mandatory.'
        }
      }
    ]
  },
  {
    id: 'wifi_not_working',
    complaint: {
      title: 'Wi-Fi not working',
      updated: 'Reviewed and updated on 12/02/2026',
      note: null
    },
    actions: [
      {
        text: '• Wi-Fi not working (PON Steady)',
        linkText: 'Click Here',
        type: 'wifi_flowchart',
        pageUrl: '/knowledge-hub/faq/ftth/wifi-not-working',
        content: {
          title: 'Wi-Fi Not Working (PON Steady) - Official Decision Flowchart',
          ruleCode: 'RULE_STB_ONT_ROUTER_FAULTY',
          targetGroup: 'AREA-CPE-MTCE / CEN-CSC-TECH',
          guidance: 'WLAN LED OFF: Press Wi-Fi button in ONT. If still OFF -> Create TT to AREA-CPE-MTCE under BB Service. WLAN LED ON: Check device wireless ON. Check internet -> If not working, check Wi-Fi config. If config correct -> Create TT to CEN-CSC-TECH under BB Service. If low coverage -> Record distance & forward to AREA-CPE-MTCE.',
          sop: '1. Check WLAN LED (OFF/ON).\n2. If OFF, toggle physical WLAN button.\n3. If ON, verify client device Wi-Fi & test throughput.\n4. Audit SSID/WPA2 config in 192.168.1.1.'
        }
      }
    ]
  },
  {
    id: 'browsing_slow',
    complaint: {
      title: 'Browsing slow',
      updated: 'Reviewed and updated on 23/10/2024\nReviewed and updated on 24/10/2024',
      note: null
    },
    actions: [
      {
        text: '• Browsing slow',
        linkText: 'Click Here',
        type: 'browsing_slow_flowchart',
        pageUrl: '/knowledge-hub/faq/ftth/browsing-slow',
        content: {
          title: 'Browsing Slow - Official Decision Flowchart',
          ruleCode: 'RULE_UNLIMITED_SLOWNESS',
          targetGroup: 'Default WG (Voice) / CEN-CSC-TECH / QED Extra GB',
          guidance: 'Check OGB-DC -> Settle bill. Voice noisy -> TT under Voice to Default WG with remarks. Quota exceeded: No -> Restart ONT & TT to CEN-CSC-TECH. Quota exceeded: Yes -> Add extra GB via QED or instruct self-care via MySLT app/portal/0112121212 IVR.',
          sop: '1. Check OGB-DC in I-Hub.\n2. Verify Voice Line noise.\n3. Check monthly quota usage in VAS Portal.\n4. Route to CEN-CSC-TECH or QED Extra GB.'
        }
      },
      {
        text: '• Browsing slow - ACS (New Updated 07-02-2025)',
        linkText: 'PDF',
        subLinkText: 'Sample Call',
        type: 'pdf_sample',
        content: {
          title: 'Browsing Slow - TR-069 ACS Diagnostic Procedure',
          guidance: 'Using TR-069 Auto Configuration Server to check subscriber Wi-Fi channel congestion, connected clients, and RF interference remotely.',
          sop: '1. Open ACS portal -> Query customer PPPoE account.\n2. Check 2.4GHz channel interference index.\n3. Change Wi-Fi channel from Auto to least congested channel (1, 6, or 11).\n4. Push configuration and reboot ONT.'
        },
        sampleCall: {
          title: 'Sample Call - Browsing Slow Handling',
          script: `AGENT: ආයුබෝවන්! මම හිමාලි, මට පුළුවනි ඔබට සහය වන්න සර්.\nCUSTOMER: මගේ Fiber internet එක හරිම slow, youtube එකවත් load වෙන්නේ නෑ.\nAGENT: කරුණාකර ඇමතුමේ රැඳී ඉන්න සර්, මම ඔබගේ router optical power එක සහ bandwidth session එක පරීක්ෂා කරන්නම්.\nAGENT: රැඳීසිටියාට ස්තූතියි සර්. ඔබගේ speed එක 18 Mbps වලට පහල බැහැලා තියෙන්නේ. මම Area Maintenance (AREA-MTCE) වෙත Trouble Ticket එකක් යොමු කළා.\nAGENT: වෙනත් යමක් දැනගැනීමට අවශ්‍යද සර්?\nCUSTOMER: නෑ බොහොම ස්තූතියි.\nAGENT: මා ලබාදුන් සේවය ඇගයීම සඳහා රැඳී සිටින්න. SLT Mobitel ඇමතුවාට ස්තූතියි. සුබ දවසක්!`
        }
      },
      {
        text: '• How to add extra GB via Top up new',
        linkText: 'PDF',
        type: 'pdf',
        content: {
          title: 'How to Add Extra GB via New Top Up Portal',
          guidance: 'Procedure to guide limited volume package customers to top up extra gigabytes through MySLT or USSD.',
          sop: '1. Login to https://myslt.slt.lk or open MySLT Mobile App.\n2. Select "Add-ons / Extra GB".\n3. Choose Data Booster (1GB / 5GB / 10GB / 50GB).\n4. Confirm purchase via Credit Card, LankaQR, or add to monthly bill.'
        }
      }
    ]
  },
  {
    id: 'voice_issues',
    complaint: {
      title: 'Voice Issues',
      updated: 'Reviewed and updated on 24/10/2024',
      note: null
    },
    actions: [
      {
        text: '• Phone not working',
        linkText: 'PDF',
        type: 'pdf',
        content: {
          title: 'FTTH Telephone Dead / No Dial Tone',
          ruleCode: 'RULE_FIBER_VOICE_LINE_FAULT',
          targetGroup: 'MDF / AREA-MTCE',
          guidance: 'If ONT PON is ON -> Dispatch to MDF.\nIf ONT PON is OFF/Blinking -> Dispatch to AREA-MTCE.',
          sop: '1. Verify phone RJ11 cable is firmly inserted into Phone 1 / TEL port on ONT.\n2. Check if TEL indicator light on ONT is ON.\n3. Check optical status in LDAP.'
        }
      },
      {
        text: '• FTTH Voice – Drop wire (cable) damage/ the Wire broken',
        linkText: 'PDF',
        type: 'pdf',
        content: {
          title: 'Drop Wire / Fiber Cable Physical Damage',
          ruleCode: 'RULE_LOS_RED',
          targetGroup: 'AREA-MTCE',
          guidance: 'Outdoor physical fiber cable cut by tree branch, road excavation, or vehicle strike. Direct Trouble Ticket to AREA-MTCE for outdoor drop cable replacement.',
          sop: '1. Mark ticket with urgent outdoor repair priority.\n2. Record exact pole number or landmark location from customer.'
        }
      },
      {
        text: "• VAS Related Issues (CLI, IDD, can't dial short codes, etc.)",
        linkText: 'PDF',
        type: 'pdf',
        content: {
          title: 'Voice VAS (Caller ID, IDD, Short Codes)',
          guidance: 'Troubleshooting Caller Line Identification (CLI), International Direct Dialing (IDD) barring, and 4-digit short codes.',
          sop: '1. Verify CLI feature active in IBSIB.\n2. Check IDD deposit status.\n3. If provisioning failed, escalate to SF-VOICE-NET.'
        }
      }
    ]
  },
  {
    id: 'password_reset',
    complaint: {
      title: 'Password Reset',
      updated: 'Reviewed and updated on 25/10/2024',
      note: null
    },
    actions: [
      {
        text: '• BB password reset',
        redNote: '(Do not reset BB password for FTTH BB customers)',
        type: 'warning',
        content: {
          title: 'Broadband Password Policy for FTTH',
          guidance: 'CRITICAL WARNING: DO NOT reset Broadband PPPoE password for FTTH customers manually over the phone, as ONT auto-configures PPPoE. Resetting password causes WAN connection failure and total internet outage.',
          sop: 'If customer explicitly requests Wi-Fi password change, guide them through the Wi-Fi reset procedure instead of PPPoE password reset.'
        }
      },
      {
        text: '• Portal Password Reset',
        linkText: 'PDF',
        type: 'pdf',
        content: {
          title: 'MySLT Self-Care Portal Password Reset',
          guidance: 'Procedure to send OTP verification code to registered mobile number for customer web portal password reset.',
          sop: '1. Confirm subscriber NIC.\n2. Verify last 3 digits of registered mobile phone.\n3. Trigger portal reset email/SMS.'
        }
      },
      {
        text: '• Wi-Fi Password Reset',
        linkText: 'PDF',
        type: 'pdf',
        content: {
          title: 'Wi-Fi Password Reset Guide',
          guidance: 'Step-by-step instructions to change WPA2/WPA3 Pre-Shared Key on Huawei, ZTE, and FiberHome ONT routers.',
          sop: '1. Access router gateway: http://192.168.1.1\n2. Navigate to Network -> 2.4G/5G Wireless -> Security.\n3. Enter new Wi-Fi password (minimum 8 alphanumeric characters).\n4. Click Save/Apply.'
        }
      }
    ]
  },
  {
    id: 'change_ip',
    complaint: {
      title: 'Change IP',
      updated: 'Reviewed and updated on 25/10/2024',
      note: null
    },
    actions: [
      {
        text: '• Change Private IP to Public IP',
        linkText: 'PDF',
        type: 'pdf',
        content: {
          title: 'Private IP to Public IP Conversion SOP',
          guidance: 'Customers hosting CCTV DVRs, gaming servers, or port forwarding require a Public Dynamic IP or Static IP.',
          sop: '1. Check if customer is on CGNAT (Carrier Grade NAT, IP starting with 100.64.x.x).\n2. Inform monthly rental for Static IP (if required) or configure Public Dynamic IP APN.\n3. Escalate request to INT-NW-SYS-ADMIN.'
        }
      }
    ]
  },
  {
    id: 'pstn_to_ftth',
    complaint: {
      title: 'How PSTN number is transferred to FTTH?',
      updated: 'Reviewed and updated on 25/10/2024',
      note: null
    },
    actions: [
      {
        text: 'Customer should make the request via RTOM.',
        type: 'info',
        content: {
          title: 'PSTN Copper to FTTH Fiber Number Porting',
          guidance: 'To migrate an existing copper PSTN telephone number to fiber while retaining the same 7-digit number, subscriber must visit the nearest Regional Telecom Office (RTOM).',
          sop: 'Advise customer to visit nearest RTOM with National Identity Card (NIC) and original billing account proof.'
        }
      }
    ]
  },
  {
    id: 'port_forwarding',
    complaint: {
      title: 'Port Forwarding',
      updated: 'Reviewed and updated on 28/04/2025',
      note: null
    },
    actions: [
      {
        text: 'As per the CEN-CSC-TECH, the customer should personally manage and configure the port forwarding settings. Therefore, do not create Trouble Tickets to CEN-CSC-TECH or AREA-CPE-MTCE.',
        boldNote: 'Forward Port Forwarding request to CEN-CSC-TECH work group',
        type: 'warning',
        content: {
          title: 'Port Forwarding Policy & Routing Rules',
          targetGroup: 'CEN-CSC-TECH',
          guidance: 'POLICY: Port forwarding on customer premise equipment is customer-managed. Contact center officers must NOT dispatch field technicians to customer premises for port forwarding.',
          sop: '1. Inform customer that port forwarding configuration is customer self-service.\n2. If public IP routing is blocked, escalate inquiry to CEN-CSC-TECH work group for IP firewall clearance.'
        }
      }
    ]
  },
  {
    id: 'data_usage_issues',
    complaint: {
      title: 'Data Usage Issues',
      updated: 'Reviewed and updated on 23/02/2026',
      note: null
    },
    actions: [
      {
        text: '( If customer does not agree with the usage volume )',
        linkText: 'PDF',
        type: 'pdf',
        content: {
          title: 'Data Usage Discrepancy Dispute SOP',
          guidance: 'When customer disputes high data volume consumption, extract hourly session usage reports from IBSIB / ADSL Usage portal.',
          sop: '1. Access ADSL Usage portal -> Query customer broadband circuit.\n2. Identify peak upload/download session timestamps.\n3. Explain cloud backup (iCloud, OneDrive, Google Photos) and Windows updates.\n4. If system error suspected, raise inquiry to CEN-CSC-UI.'
        }
      }
    ]
  },
  {
    id: 'data_addon_issues',
    complaint: {
      title: 'Data Add-on Issues',
      updated: 'Reviewed and updated on 23/02/2026',
      note: null
    },
    actions: [
      {
        text: 'Data Add-On Issues',
        linkText: 'PDF',
        type: 'pdf',
        content: {
          title: 'Data Addon Provisioning & Rating Issues',
          ruleCode: 'RULE_DATA_CONSUMPTION_ADDON_MISMATCH',
          targetGroup: 'CEN-CSC-UI',
          guidance: 'If customer purchased specific addon (e.g. YouTube / Work & Learn bundle) but data was deducted from standard quota, dispatch Trouble Ticket to CEN-CSC-UI.',
          sop: '1. Confirm active addon in PCRF and IBSIB.\n2. Note addon name and start timestamp.\n3. Dispatch Trouble Ticket to CEN-CSC-UI.'
        }
      }
    ]
  },
  {
    id: 'online_topup_unavailability',
    complaint: {
      title: 'Unavailability of online top up ( Temporary )',
      updated: 'Updated 05-13-2026',
      note: null,
      isTemporary: true
    },
    actions: [
      {
        text: 'Pay Now option via Credit Card of Extra GB and Add-ons.',
        linkText: 'PDF',
        type: 'pdf',
        content: {
          title: 'Online Top Up Fallback Procedure',
          guidance: 'During scheduled maintenance of the MySLT billing gateway, customers can purchase Extra GB using the direct LankaQR or PayNow credit card portal.',
          sop: 'Direct customer to https://pay.slt.lk for standalone top-up voucher generation.'
        }
      }
    ]
  }
];

export default function FTTHFAQPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalData, setActiveModalData] = useState<any | null>(null);
  const [sampleCallData, setSampleCallData] = useState<any | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showOntPdfModal, setShowOntPdfModal] = useState(false);
  const [showGeneralPdfModal, setShowGeneralPdfModal] = useState(false);
  const [showPonPdfModal, setShowPonPdfModal] = useState(false);
  const [showWifiPdfModal, setShowWifiPdfModal] = useState(false);
  const [showBrowsingSlowPdfModal, setShowBrowsingSlowPdfModal] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [ttCopied, setTtCopied] = useState(false);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredRows = FTTH_FAQ_ROWS.filter(row => {
    const q = searchQuery.toLowerCase();
    const titleMatch = row.complaint.title.toLowerCase().includes(q);
    const actionMatch = row.actions.some(a => a.text.toLowerCase().includes(q));
    return titleMatch || actionMatch;
  });

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
          <Link href="/knowledge-hub/faq" className="text-[#005696] font-bold hover:underline flex items-center gap-1">
            Knowledge Base <ChevronDown className="w-3 h-3 text-[#005696]" />
          </Link>
        </div>
      </div>

      {/* 3. BREADCRUMB SUB-HEADER */}
      <div className="bg-white border-b border-slate-200 px-6 py-2 flex items-center justify-between text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <Link href="/knowledge-hub/faq" className="text-[#005696] font-bold hover:underline flex items-center gap-1">
            <ArrowLeft className="w-3 h-3" /> Back to FAQs
          </Link>
          <span className="text-slate-300">/</span>
          <span className="font-semibold text-slate-800">Knowledge Hub</span>
          <span className="text-slate-300">/</span>
          <span className="font-bold text-[#005696]">FAQs - FTTH</span>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-slate-500">
          <span>Private group</span>
          <span className="flex items-center gap-1"><Users className="w-3 h-3" /> 1 member</span>
          <span className="cursor-pointer font-bold">•••</span>
        </div>
      </div>

      {/* 4. HERO BANNER WITH GLOWING FIBER OPTIC STRANDS */}
      <div className="relative bg-gradient-to-r from-[#03152e] via-[#052b57] to-[#011429] text-white px-8 py-9 overflow-hidden border-b border-blue-900/40">
        {/* Optical fiber strands glow background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-500/20 via-transparent to-transparent pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-2/3 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-600/15 via-transparent to-transparent pointer-events-none"></div>

        <div className="max-w-6xl mx-auto relative z-10 space-y-3">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white drop-shadow-md">
            FAQs - FTTH
          </h1>

          {/* Publisher Metadata matching screenshot */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-700 border border-cyan-400 flex items-center justify-center font-bold text-xs text-white shadow-sm">
              CR
            </div>
            <div className="text-xs">
              <p className="font-bold text-white">Chathurani Rathnayake</p>
              <p className="text-[11px] text-cyan-200/90">Senior Assistant Manager (Customer Relations) - A7</p>
            </div>
          </div>
        </div>
      </div>

      {/* 5. NAVIGATION PILL BUTTONS */}
      <div className="bg-white px-6 py-3 border-b border-slate-200">
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          <Link
            href="/knowledge-hub"
            className="px-5 py-2 rounded-md border border-[#005696]/40 hover:border-[#005696] bg-white hover:bg-slate-50 text-[#005696] font-bold text-xs flex items-center gap-2 transition-all shadow-2xs"
          >
            <Home className="w-4 h-4 text-[#005696]" />
            <span>Home</span>
          </Link>

          <Link
            href="/knowledge-hub/faq"
            className="px-5 py-2 rounded-md border border-[#005696]/40 hover:border-[#005696] bg-white hover:bg-slate-50 text-[#005696] font-bold text-xs flex items-center gap-2 transition-all shadow-2xs"
          >
            <FileText className="w-4 h-4 text-[#005696]" />
            <span>FAQs</span>
          </Link>
        </div>
      </div>

      {/* 6. COMPLAINT / REQUEST VS SYMPTOMS/ACTION TABLE */}
      <div className="flex-1 p-6 md:p-8 bg-slate-50">
        <div className="max-w-6xl mx-auto bg-white rounded-md border border-slate-300 shadow-sm overflow-hidden">
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100/80 border-b border-slate-300 font-black text-slate-800 text-sm">
                  <th className="py-3 px-5 border-r border-slate-300 text-center w-1/3">
                    Complaint / Request
                  </th>
                  <th className="py-3 px-5 text-center w-2/3">
                    Symptoms/Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredRows.map((row) => (
                  <tr key={row.id} className="hover:bg-cyan-50/25 transition-colors">
                    
                    {/* Left Column: Complaint / Request */}
                    <td className="p-4 border-r border-slate-200 align-top space-y-1">
                      <p className="font-bold text-slate-900 text-xs">
                        {row.complaint.title}
                        {row.complaint.isTemporary && (
                          <span className="text-red-600 font-bold ml-1">( Temporary )</span>
                        )}
                      </p>

                      {row.complaint.note && (
                        <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                          {row.complaint.note}
                        </p>
                      )}

                      {row.complaint.updated && (
                        <div className="space-y-0.5 pt-0.5">
                          {row.complaint.updated.split('\n').map((u, uIdx) => (
                            <p key={uIdx} className="text-[10px] text-red-600 font-semibold italic">
                              ({u})
                            </p>
                          ))}
                        </div>
                      )}
                    </td>

                    {/* Right Column: Symptoms/Action */}
                    <td className="p-4 align-top space-y-2">
                      {row.actions.map((act: any, aIdx) => {
                        const isOntFlowchart = act.type === 'ont_pdf_flowchart' || act.text.includes('ONT not working');
                        const isGeneralFlowchart = act.type === 'general_questions_flowchart' || act.text.includes('General Questions FTTH');
                        const isPonFlowchart = act.type === 'pon_indicator_flowchart' || act.text.includes('PON indicator Red, Off, Blinking and Steady');
                        const isWifiFlowchart = act.type === 'wifi_flowchart' || act.text.includes('Wi-Fi not working (PON Steady)');
                        const isBrowsingSlowFlowchart = act.type === 'browsing_slow_flowchart' || (act.text.includes('Browsing slow') && !act.text.includes('ACS'));
                        return (
                          <div key={aIdx} className="space-y-1">
                            <div className="flex items-baseline flex-wrap gap-1.5 leading-relaxed">
                              {isGeneralFlowchart ? (
                                <>
                                  <Link
                                    href="/knowledge-hub/faq/ftth/general-questions"
                                    className="font-bold text-[#005696] hover:text-[#003865] hover:underline cursor-pointer flex items-center gap-1.5"
                                  >
                                    <span>{act.text}</span>
                                    <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                                      Interactive Guide
                                    </span>
                                  </Link>

                                  <Link
                                    href="/knowledge-hub/faq/ftth/general-questions"
                                    className="font-bold text-[#005696] hover:text-[#003865] hover:underline cursor-pointer ml-1 inline-flex items-center gap-0.5 text-xs"
                                  >
                                    ( View Interactive Guide )
                                  </Link>

                                  <button
                                    onClick={() => setShowGeneralPdfModal(true)}
                                    className="text-slate-500 hover:text-slate-700 hover:underline cursor-pointer ml-1 text-[11px]"
                                    title="View SharePoint PDF viewer layout"
                                  >
                                    ( PDF )
                                  </button>
                                </>
                              ) : isOntFlowchart ? (
                                <>
                                  <Link
                                    href="/knowledge-hub/faq/ftth/ont-not-working"
                                    className="font-bold text-[#005696] hover:text-[#003865] hover:underline cursor-pointer flex items-center gap-1.5"
                                  >
                                    <span>{act.text}</span>
                                    <span className="px-1.5 py-0.2 rounded bg-blue-100 text-[#005696] font-bold text-[10px]">
                                      Interactive Guide
                                    </span>
                                  </Link>

                                  <Link
                                    href="/knowledge-hub/faq/ftth/ont-not-working"
                                    className="font-bold text-[#005696] hover:text-[#003865] hover:underline cursor-pointer ml-1 inline-flex items-center gap-0.5 text-xs"
                                  >
                                    ( View Interactive Guide )
                                  </Link>

                                  <button
                                    onClick={() => setShowOntPdfModal(true)}
                                    className="text-slate-500 hover:text-slate-700 hover:underline cursor-pointer ml-1 text-[11px]"
                                    title="View SharePoint PDF viewer layout"
                                  >
                                    ( PDF )
                                  </button>
                                </>
                              ) : isPonFlowchart ? (
                                <>
                                  <Link
                                    href="/knowledge-hub/faq/ftth/pon-los-indicator"
                                    className="font-bold text-[#005696] hover:text-[#003865] hover:underline cursor-pointer flex items-center gap-1.5"
                                  >
                                    <span>{act.text}</span>
                                    <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 font-bold text-[10px]">
                                      Interactive Guide
                                    </span>
                                  </Link>

                                  <Link
                                    href="/knowledge-hub/faq/ftth/pon-los-indicator"
                                    className="font-bold text-[#005696] hover:text-[#003865] hover:underline cursor-pointer ml-1 inline-flex items-center gap-0.5 text-xs"
                                  >
                                    ( View Interactive Guide )
                                  </Link>

                                  <button
                                    onClick={() => setShowPonPdfModal(true)}
                                    className="text-slate-500 hover:text-slate-700 hover:underline cursor-pointer ml-1 text-[11px]"
                                    title="View SharePoint PDF viewer layout"
                                  >
                                    ( PDF )
                                  </button>
                                </>
                              ) : isWifiFlowchart ? (
                                <>
                                  <Link
                                    href="/knowledge-hub/faq/ftth/wifi-not-working"
                                    className="font-bold text-[#005696] hover:text-[#003865] hover:underline cursor-pointer flex items-center gap-1.5"
                                  >
                                    <span>{act.text}</span>
                                    <span className="px-1.5 py-0.2 rounded bg-lime-100 text-lime-900 font-bold text-[10px]">
                                      Interactive Guide
                                    </span>
                                  </Link>

                                  <Link
                                    href="/knowledge-hub/faq/ftth/wifi-not-working"
                                    className="font-bold text-[#005696] hover:text-[#003865] hover:underline cursor-pointer ml-1 inline-flex items-center gap-0.5 text-xs"
                                  >
                                    ( View Interactive Guide )
                                  </Link>

                                  <button
                                    onClick={() => setShowWifiPdfModal(true)}
                                    className="text-slate-500 hover:text-slate-700 hover:underline cursor-pointer ml-1 text-[11px]"
                                    title="View SharePoint PDF viewer layout"
                                  >
                                    ( PDF )
                                  </button>
                                </>
                              ) : isBrowsingSlowFlowchart ? (
                                <>
                                  <Link
                                    href="/knowledge-hub/faq/ftth/browsing-slow"
                                    className="font-bold text-[#005696] hover:text-[#003865] hover:underline cursor-pointer flex items-center gap-1.5"
                                  >
                                    <span>{act.text}</span>
                                    <span className="px-1.5 py-0.2 rounded bg-purple-100 text-purple-900 font-bold text-[10px]">
                                      Interactive Guide
                                    </span>
                                  </Link>

                                  <Link
                                    href="/knowledge-hub/faq/ftth/browsing-slow"
                                    className="font-bold text-[#005696] hover:text-[#003865] hover:underline cursor-pointer ml-1 inline-flex items-center gap-0.5 text-xs"
                                  >
                                    ( View Interactive Guide )
                                  </Link>

                                  <button
                                    onClick={() => setShowBrowsingSlowPdfModal(true)}
                                    className="text-slate-500 hover:text-slate-700 hover:underline cursor-pointer ml-1 text-[11px]"
                                    title="View SharePoint PDF viewer layout"
                                  >
                                    ( PDF )
                                  </button>
                                </>
                              ) : (
                                <>
                                  <span className="font-semibold text-slate-800 text-xs">
                                    {act.text}
                                  </span>

                                  {act.redNote && (
                                    <span className="text-red-600 font-bold text-xs">
                                      {act.redNote}
                                    </span>
                                  )}

                                  {act.linkText && (
                                    <button
                                      onClick={() => setActiveModalData(act.content)}
                                      className="font-bold text-[#005696] hover:text-[#003865] hover:underline cursor-pointer ml-1 inline-flex items-center gap-0.5"
                                    >
                                      ( {act.linkText} )
                                    </button>
                                  )}
                                </>
                              )}

                              {act.subLinkText && (
                                <button
                                  onClick={() => setSampleCallData(act.sampleCall)}
                                  className="font-bold text-[#005696] hover:text-[#003865] hover:underline cursor-pointer ml-1 inline-flex items-center gap-0.5"
                                >
                                  ( {act.subLinkText} )
                                </button>
                              )}
                            </div>

                            {act.boldNote && (
                              <p className="font-black text-slate-900 text-xs pt-1">
                                {act.boldNote}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>

      {/* ======================================================== */}
      {/* 7. INTERACTIVE SOP / PDF DOCUMENT VIEWER MODAL          */}
      {/* ======================================================== */}
      <AnimatePresence>
        {activeModalData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-xl max-w-xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden"
            >
              {/* Modal Header */}
              <div className="p-4 bg-[#005696] text-white flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2.5">
                  <BookOpen className="w-5 h-5 text-cyan-200" />
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-200">
                      Official FTTH Operational Guide
                    </span>
                    <h3 className="text-base font-bold text-white">
                      {activeModalData.title}
                    </h3>
                  </div>
                </div>
                <button
                  onClick={() => setActiveModalData(null)}
                  className="p-1 rounded-md text-white/80 hover:text-white hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
                
                {/* Connected AI Triage Rule */}
                {activeModalData.ruleCode && (
                  <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider">
                        Smart PEARL Auto-Triage Rule
                      </span>
                      <p className="font-mono font-bold text-indigo-950 text-xs">{activeModalData.ruleCode}</p>
                    </div>
                    {activeModalData.targetGroup && (
                      <span className="px-2.5 py-1 rounded bg-amber-400 text-amber-950 font-black text-[10px] uppercase tracking-wider">
                        Target: {activeModalData.targetGroup}
                      </span>
                    )}
                  </div>
                )}

                {/* Guidance Narrative */}
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Operational Guidance</span>
                  <p className="text-slate-800 leading-relaxed font-medium">
                    {activeModalData.guidance}
                  </p>
                </div>

                {/* Standard Operating Procedure (SOP) */}
                {activeModalData.sop && (
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                      <Wrench className="w-3.5 h-3.5 text-[#005696]" /> Standard Operating Procedure (SOP)
                    </span>
                    <pre className="p-3.5 bg-slate-900 text-emerald-300 font-mono text-[11px] rounded-xl whitespace-pre-wrap leading-relaxed border border-slate-800">
                      {activeModalData.sop}
                    </pre>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                <button
                  onClick={() => copyToClipboard(activeModalData.guidance + '\n' + (activeModalData.sop || ''), 'modal-sop')}
                  className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
                >
                  {copiedId === 'modal-sop' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy Instructions</span>
                </button>

                <button
                  onClick={() => setActiveModalData(null)}
                  className="px-4 py-1.5 bg-[#005696] hover:bg-[#00407a] text-white text-xs font-bold rounded-lg transition-colors shadow-xs"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* 8. SAMPLE CALL SCRIPT MODAL                             */}
      {/* ======================================================== */}
      <AnimatePresence>
        {sampleCallData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-xl max-w-xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden"
            >
              <div className="p-4 bg-gradient-to-r from-emerald-700 to-teal-800 text-white flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <PhoneCall className="w-5 h-5 text-emerald-200" />
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-200">
                      SLT Call Quality Standards
                    </span>
                    <h3 className="text-base font-bold text-white">
                      {sampleCallData.title}
                    </h3>
                  </div>
                </div>
                <button
                  onClick={() => setSampleCallData(null)}
                  className="p-1 rounded-md text-white/80 hover:text-white hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900 text-[11px] font-semibold">
                  100% Quality Standards compliant dialogue: Greeting $\rightarrow$ Hold 45s threshold $\rightarrow$ Pre-close $\rightarrow$ IVR transfer.
                </div>

                <div className="space-y-2.5">
                  {sampleCallData.script.split('\n').map((line: string, idx: number) => {
                    const isAgent = line.startsWith('AGENT:');
                    return (
                      <div
                        key={idx}
                        className={`p-3 rounded-xl border text-xs leading-relaxed ${
                          isAgent
                            ? 'bg-blue-50/70 border-blue-200 text-blue-950 ml-4 font-medium'
                            : 'bg-slate-50 border-slate-200 text-slate-800 mr-4'
                        }`}
                      >
                        <span className="font-bold text-[10px] uppercase block mb-0.5 text-slate-500">
                          {isAgent ? 'Officer (Himali)' : 'Customer'}
                        </span>
                        {line.replace(/^(AGENT|CUSTOMER):\s*/, '')}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex justify-end">
                <button
                  onClick={() => setSampleCallData(null)}
                  className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg transition-colors"
                >
                  Close Script
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* 9. OFFICIAL ONT NOT WORKING PDF VIEWER MODAL             */}
      {/* ======================================================== */}
      <AnimatePresence>
        {showOntPdfModal && (
          <div className="fixed inset-0 z-50 flex flex-col bg-[#262626] text-white overflow-hidden animate-in fade-in duration-200">
            
            {/* Top SharePoint / PDF Reader Dark Toolbar matching screenshot */}
            <div className="bg-[#262626] border-b border-white/10 px-3 sm:px-5 py-2 flex items-center justify-between text-xs select-none shrink-0 shadow-md">
              
              {/* Left Icons: Sidebar toggle | Download, Star, Info, More */}
              <div className="flex items-center gap-2 sm:gap-3 text-slate-300">
                <button
                  title="Document Thumbnails"
                  className="p-1 rounded hover:bg-white/10 hover:text-white transition-colors"
                >
                  <FileText className="w-4 h-4" />
                </button>

                <div className="h-4 w-px bg-slate-600"></div>

                <button
                  onClick={() => window.print()}
                  title="Download / Print PDF"
                  className="p-1 rounded hover:bg-white/10 hover:text-white transition-colors"
                >
                  <Download className="w-4 h-4" />
                </button>

                <button
                  title="Star Favorite"
                  className="p-1 rounded hover:bg-white/10 hover:text-amber-400 transition-colors"
                >
                  <Star className="w-4 h-4" />
                </button>

                <button
                  title="Document Information"
                  className="p-1 rounded hover:bg-white/10 hover:text-white transition-colors"
                >
                  <AlertCircle className="w-4 h-4" />
                </button>

                <button
                  title="More Options"
                  className="p-1 rounded hover:bg-white/10 hover:text-white transition-colors font-bold text-sm tracking-widest px-1.5"
                >
                  •••
                </button>
              </div>

              {/* Center: Red Adobe PDF badge + File Name */}
              <div className="flex items-center gap-2 mx-2 truncate">
                <div className="bg-red-600 text-white rounded-xs px-1.5 py-0.5 text-[10px] font-black tracking-wider flex items-center justify-center shadow-xs">
                  PDF
                </div>
                <span className="text-xs sm:text-sm font-semibold text-white tracking-tight truncate">
                  ONT NOT WORKING.pdf
                </span>
              </div>

              {/* Right: Avatar, Teams chat, Viewing, Open, Share, Close */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div
                  title="User Profile: GJ"
                  className="w-6 h-6 rounded-full bg-teal-600 border border-teal-300 flex items-center justify-center font-bold text-[10px] text-white shadow-2xs"
                >
                  GJ
                </div>

                <button
                  title="Teams Conversation"
                  className="p-1 rounded hover:bg-white/10 text-slate-300 hover:text-white transition-colors hidden sm:inline-flex"
                >
                  <MessageSquare className="w-4 h-4" />
                </button>

                <button
                  className="hidden md:flex items-center gap-1 text-[11px] text-slate-200 hover:bg-white/10 px-2 py-1 rounded transition-colors"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-300" />
                  <span>Viewing</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                <button
                  className="hidden lg:flex items-center gap-1 text-[11px] text-slate-200 hover:bg-white/10 px-2 py-1 rounded transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-slate-300" />
                  <span>Open</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                <button
                  className="hidden sm:flex items-center gap-1 text-[11px] text-slate-200 hover:bg-white/10 px-2 py-1 rounded transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5 text-slate-300" />
                  <span>Share</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                <button
                  onClick={() => setShowOntPdfModal(false)}
                  title="Close PDF Viewer"
                  className="p-1 rounded text-slate-300 hover:text-white hover:bg-red-600/40 transition-colors ml-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

            </div>

            {/* Sub Toolbar / Zoom & TT Action Helper */}
            <div className="bg-[#1f1f1f] px-4 py-1.5 flex items-center justify-between text-xs text-slate-400 border-b border-black/40">
              <div className="flex items-center gap-3">
                <span className="text-[11px] text-slate-400">Page 1 of 1</span>
                <span className="text-slate-600">|</span>
                <button
                  onClick={() => setZoomLevel(Math.max(60, zoomLevel - 15))}
                  title="Zoom Out"
                  className="p-1 hover:text-white hover:bg-white/10 rounded"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-[11px] font-mono text-slate-300 min-w-[3rem] text-center">{zoomLevel}%</span>
                <button
                  onClick={() => setZoomLevel(Math.min(150, zoomLevel + 15))}
                  title="Zoom In"
                  className="p-1 hover:text-white hover:bg-white/10 rounded"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setZoomLevel(100)}
                  className="text-[10px] uppercase font-bold px-1.5 py-0.5 bg-white/5 hover:bg-white/15 rounded text-slate-300"
                >
                  Reset
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const ttText = `Target Work Group: AREA-CPE-MTCE\nFault Complaint: ONT Not Working / Power Failure\nAction Taken: Verified Power LED indicator, guided customer to test power button and power adapter/socket. Device completely non-operational. Escalated for on-site CPE maintenance swap.`;
                    navigator.clipboard.writeText(ttText);
                    setTtCopied(true);
                    setTimeout(() => setTtCopied(false), 2500);
                  }}
                  className="px-2.5 py-1 bg-red-600/90 hover:bg-red-600 text-white rounded text-[11px] font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  {ttCopied ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3" />}
                  <span>{ttCopied ? 'TT Copied to Clipboard!' : 'Copy TT AREA-CPE-MTCE'}</span>
                </button>
              </div>
            </div>

            {/* Main Viewer Body with Centered White Page */}
            <div className="flex-1 bg-[#3c4043] overflow-y-auto p-4 sm:p-8 flex justify-center items-start">
              <div
                style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
                className="bg-white text-black shadow-[0_20px_50px_rgba(0,0,0,0.7)] rounded-xs w-full max-w-[800px] min-h-[920px] p-6 sm:p-10 relative transition-transform duration-150"
              >
                
                {/* SVG Vector Flowchart matching exact official diagram */}
                <svg
                  viewBox="0 0 800 720"
                  className="w-full h-auto select-none font-sans"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    {/* Solid black drop shadow matching Visio / PowerPoint neubrutalist style */}
                    <filter id="retroShadow" x="-15%" y="-15%" width="130%" height="130%">
                      <feDropShadow dx="4" dy="4" stdDeviation="0" floodColor="#000000" floodOpacity="1" />
                    </filter>
                    <filter id="retroShadowSm" x="-15%" y="-15%" width="130%" height="130%">
                      <feDropShadow dx="3" dy="3" stdDeviation="0" floodColor="#000000" floodOpacity="1" />
                    </filter>
                    {/* Sharp black arrowhead marker */}
                    <marker id="arrow" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#000000" />
                    </marker>
                  </defs>

                  {/* Flowchart Header */}
                  <text
                    x="410"
                    y="32"
                    textAnchor="middle"
                    fontWeight="900"
                    fontSize="28"
                    fontFamily="Arial, Helvetica, sans-serif"
                    fill="#000000"
                    letterSpacing="0.5"
                  >
                    ONT NOT WORKING
                  </text>

                  {/* ROOT NODE: Check the Power indicator in ONT */}
                  <g>
                    <rect
                      x="235"
                      y="54"
                      width="350"
                      height="46"
                      rx="23"
                      ry="23"
                      fill="#ffffff"
                      stroke="#000000"
                      strokeWidth="2.5"
                      filter="url(#retroShadow)"
                    />
                    <text
                      x="410"
                      y="82"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="14.5"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      Check the Power indicator in ONT
                    </text>
                  </g>

                  {/* FORK ARROWS DOWN TO OFF AND ON */}
                  <path d="M 320 100 L 320 138" stroke="#000000" strokeWidth="2.5" markerEnd="url(#arrow)" />
                  <path d="M 520 100 L 520 138" stroke="#000000" strokeWidth="2.5" markerEnd="url(#arrow)" />

                  {/* OFF NODE */}
                  <g>
                    <rect
                      x="270"
                      y="138"
                      width="100"
                      height="30"
                      rx="15"
                      ry="15"
                      fill="#ffffff"
                      stroke="#000000"
                      strokeWidth="2"
                      filter="url(#retroShadowSm)"
                    />
                    <text
                      x="320"
                      y="158"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="13"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      OFF
                    </text>
                  </g>

                  {/* ON NODE */}
                  <g>
                    <rect
                      x="470"
                      y="138"
                      width="100"
                      height="30"
                      rx="15"
                      ry="15"
                      fill="#ffffff"
                      stroke="#000000"
                      strokeWidth="2"
                      filter="url(#retroShadowSm)"
                    />
                    <text
                      x="520"
                      y="158"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="13"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      ON
                    </text>
                  </g>

                  {/* ================= LEFT BRANCH (OFF) ================= */}
                  {/* Arrow from OFF down to Switch on by the Power button */}
                  <path d="M 320 168 L 320 206" stroke="#000000" strokeWidth="2.5" markerEnd="url(#arrow)" />

                  {/* Green Node: Switch on by the Power button in ONT */}
                  <g>
                    <rect
                      x="195"
                      y="206"
                      width="250"
                      height="42"
                      rx="21"
                      ry="21"
                      fill="#5cb85c"
                      stroke="#000000"
                      strokeWidth="2"
                      filter="url(#retroShadow)"
                    />
                    <text
                      x="320"
                      y="223"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="11.5"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      Switch on by the Power button
                    </text>
                    <text
                      x="320"
                      y="237"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="11.5"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      in ONT
                    </text>
                  </g>

                  {/* Arrow Left to END */}
                  <path d="M 195 227 L 140 227" stroke="#000000" strokeWidth="2.5" markerEnd="url(#arrow)" />
                  <text
                    x="170"
                    y="218"
                    textAnchor="middle"
                    fontWeight="bold"
                    fontSize="11"
                    fill="#00b050"
                    fontFamily="Arial, Helvetica, sans-serif"
                  >
                    Working
                  </text>
                  <text
                    x="130"
                    y="231"
                    textAnchor="end"
                    fontWeight="900"
                    fontSize="13"
                    fill="#00b050"
                    fontFamily="Arial, Helvetica, sans-serif"
                  >
                    END
                  </text>

                  {/* Arrow Down from Switch on... to Check charger */}
                  <path d="M 320 248 L 320 292" stroke="#000000" strokeWidth="2.5" markerEnd="url(#arrow)" />
                  <text
                    x="310"
                    y="273"
                    textAnchor="end"
                    fontWeight="bold"
                    fontSize="11"
                    fill="#e11d48"
                    fontFamily="Arial, Helvetica, sans-serif"
                  >
                    Not Working
                  </text>

                  {/* Green Node: Check whether the power charger is connected properly */}
                  <g>
                    <rect
                      x="185"
                      y="292"
                      width="270"
                      height="42"
                      rx="21"
                      ry="21"
                      fill="#5cb85c"
                      stroke="#000000"
                      strokeWidth="2"
                      filter="url(#retroShadow)"
                    />
                    <text
                      x="320"
                      y="309"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="11.5"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      Check whether the power charger is
                    </text>
                    <text
                      x="320"
                      y="323"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="11.5"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      connected properly
                    </text>
                  </g>

                  {/* Left Branch from Check charger to Connect Power Charger properly */}
                  <path d="M 185 313 L 130 313 L 130 348" stroke="#000000" strokeWidth="2.5" markerEnd="url(#arrow)" fill="none" />
                  <text
                    x="160"
                    y="305"
                    textAnchor="middle"
                    fontWeight="bold"
                    fontSize="11"
                    fill="#e11d48"
                    fontFamily="Arial, Helvetica, sans-serif"
                  >
                    No
                  </text>

                  {/* Green Node: Connect Power Charger properly */}
                  <g>
                    <rect
                      x="45"
                      y="348"
                      width="170"
                      height="42"
                      rx="21"
                      ry="21"
                      fill="#5cb85c"
                      stroke="#000000"
                      strokeWidth="2"
                      filter="url(#retroShadow)"
                    />
                    <text
                      x="130"
                      y="365"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="11.5"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      Connect Power Charger
                    </text>
                    <text
                      x="130"
                      y="379"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="11.5"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      properly
                    </text>
                  </g>

                  {/* Arrow down from Connect Power Charger properly to END */}
                  <path d="M 130 390 L 130 422" stroke="#000000" strokeWidth="2.5" markerEnd="url(#arrow)" />
                  <text
                    x="130"
                    y="440"
                    textAnchor="middle"
                    fontWeight="900"
                    fontSize="13"
                    fill="#00b050"
                    fontFamily="Arial, Helvetica, sans-serif"
                  >
                    END
                  </text>

                  {/* Line from Check charger to Red TT Node */}
                  {/* Goes down from 320 to 460, right to 520, UP into bottom of red box at 414 */}
                  <path d="M 320 334 L 320 460 L 520 460 L 520 414" stroke="#000000" strokeWidth="2.5" markerEnd="url(#arrow)" fill="none" />
                  <text
                    x="420"
                    y="445"
                    textAnchor="middle"
                    fontWeight="bold"
                    fontSize="11"
                    fill="#000000"
                    fontFamily="Arial, Helvetica, sans-serif"
                  >
                    Connected properly
                  </text>
                  <text
                    x="420"
                    y="457"
                    textAnchor="middle"
                    fontWeight="bold"
                    fontSize="11"
                    fill="#000000"
                    fontFamily="Arial, Helvetica, sans-serif"
                  >
                    but not working
                  </text>

                  {/* ================= RIGHT BRANCH (ON) ================= */}
                  {/* Arrow from ON down to Switch off switch on the ONT (RESTART) */}
                  <path d="M 520 168 L 520 206" stroke="#000000" strokeWidth="2.5" markerEnd="url(#arrow)" />

                  {/* Green Node: Switch off switch on the ONT (RESTART) */}
                  <g>
                    <rect
                      x="395"
                      y="206"
                      width="250"
                      height="42"
                      rx="21"
                      ry="21"
                      fill="#5cb85c"
                      stroke="#000000"
                      strokeWidth="2"
                      filter="url(#retroShadow)"
                    />
                    <text
                      x="520"
                      y="223"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="11.5"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      Switch off switch on the ONT
                    </text>
                    <text
                      x="520"
                      y="237"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="11.5"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      (RESTART)
                    </text>
                  </g>

                  {/* Arrow Right to END */}
                  <path d="M 645 227 L 700 227" stroke="#000000" strokeWidth="2.5" markerEnd="url(#arrow)" />
                  <text
                    x="670"
                    y="218"
                    textAnchor="middle"
                    fontWeight="bold"
                    fontSize="11"
                    fill="#00b050"
                    fontFamily="Arial, Helvetica, sans-serif"
                  >
                    Working
                  </text>
                  <text
                    x="708"
                    y="231"
                    textAnchor="start"
                    fontWeight="900"
                    fontSize="13"
                    fill="#00b050"
                    fontFamily="Arial, Helvetica, sans-serif"
                  >
                    END
                  </text>

                  {/* Arrow down from RESTART to Lavender Note */}
                  <path d="M 520 248 L 520 274" stroke="#000000" strokeWidth="2.5" markerEnd="url(#arrow)" />

                  {/* Lavender Node: Restart means,Switch off and on... */}
                  <g>
                    <rect
                      x="375"
                      y="274"
                      width="290"
                      height="52"
                      rx="24"
                      ry="24"
                      fill="#d8b4fe"
                      stroke="#000000"
                      strokeWidth="2"
                      filter="url(#retroShadow)"
                    />
                    <text
                      x="520"
                      y="290"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="10"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      Restart means,Switch off and on from the
                    </text>
                    <text
                      x="520"
                      y="303"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="10"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      power button/power socket or unplug from
                    </text>
                    <text
                      x="520"
                      y="316"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="10"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      the power adapter
                    </text>
                  </g>

                  {/* Arrow down from Lavender Note to Red TT Node */}
                  <path d="M 520 326 L 520 366" stroke="#000000" strokeWidth="2.5" markerEnd="url(#arrow)" />
                  <text
                    x="530"
                    y="348"
                    textAnchor="start"
                    fontWeight="bold"
                    fontSize="11"
                    fill="#e11d48"
                    fontFamily="Arial, Helvetica, sans-serif"
                  >
                    Not Working
                  </text>

                  {/* RED TARGET NODE: Create a TT to AREA-CPE-MTCE */}
                  <g
                    className="cursor-pointer"
                    onClick={() => {
                      const ttText = `Target Work Group: AREA-CPE-MTCE\nFault Complaint: ONT Not Working / Power Failure\nAction Taken: Verified Power LED indicator, guided customer to test power button and power adapter/socket. Device completely non-operational. Escalated for on-site CPE maintenance swap.`;
                      navigator.clipboard.writeText(ttText);
                      setTtCopied(true);
                      setTimeout(() => setTtCopied(false), 2500);
                    }}
                  >
                    <rect
                      x="410"
                      y="366"
                      width="220"
                      height="44"
                      rx="22"
                      ry="22"
                      fill="#ef4444"
                      stroke="#000000"
                      strokeWidth="2.5"
                      filter="url(#retroShadow)"
                    />
                    <text
                      x="520"
                      y="384"
                      textAnchor="middle"
                      fontWeight="900"
                      fontSize="12.5"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      Create a TT to
                    </text>
                    <text
                      x="520"
                      y="399"
                      textAnchor="middle"
                      fontWeight="900"
                      fontSize="12.5"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      AREA-CPE-MTCE
                    </text>
                  </g>

                  {/* ================= BOTTOM NOTES ================= */}
                  {/* Lavender Note 1: theres no power button in TENDA ONT... */}
                  <g>
                    <rect
                      x="250"
                      y="545"
                      width="320"
                      height="46"
                      rx="23"
                      ry="23"
                      fill="#d8b4fe"
                      stroke="#000000"
                      strokeWidth="2"
                      filter="url(#retroShadow)"
                    />
                    <text
                      x="410"
                      y="560"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="10.5"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      theres no power button in TENDA ONT
                    </text>
                    <text
                      x="410"
                      y="572"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="10.5"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      inform customer to switch off
                    </text>
                    <text
                      x="410"
                      y="584"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="10.5"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      the power from the wall socket.
                    </text>
                  </g>

                  {/* Lavender Note 2: TT Description is mandatory... */}
                  <g>
                    <rect
                      x="200"
                      y="608"
                      width="420"
                      height="64"
                      rx="28"
                      ry="28"
                      fill="#d8b4fe"
                      stroke="#000000"
                      strokeWidth="2"
                      filter="url(#retroShadow)"
                    />
                    <text
                      x="410"
                      y="626"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="11"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      TT Description is mandatory. Ensure the TT
                    </text>
                    <text
                      x="410"
                      y="641"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="11"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      description clearly matches the customer's
                    </text>
                    <text
                      x="410"
                      y="655"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="11"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      reported complaint and includes all
                    </text>
                    <text
                      x="410"
                      y="669"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="11"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      relevant troubleshooting details.
                    </text>
                  </g>

                </svg>

              </div>
            </div>

          </div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* 10. OFFICIAL GENERAL QUESTIONS PDF VIEWER MODAL          */}
      {/* ======================================================== */}
      <AnimatePresence>
        {showGeneralPdfModal && (
          <div className="fixed inset-0 z-50 flex flex-col bg-[#262626] text-white overflow-hidden animate-in fade-in duration-200">
            
            {/* Top SharePoint / PDF Reader Dark Toolbar */}
            <div className="bg-[#262626] border-b border-white/10 px-3 sm:px-5 py-2 flex items-center justify-between text-xs select-none shrink-0 shadow-md">
              
              {/* Left Icons */}
              <div className="flex items-center gap-2 sm:gap-3 text-slate-300">
                <button
                  title="Document Thumbnails"
                  className="p-1 rounded hover:bg-white/10 hover:text-white transition-colors"
                >
                  <FileText className="w-4 h-4" />
                </button>

                <div className="h-4 w-px bg-slate-600"></div>

                <button
                  onClick={() => window.print()}
                  title="Download / Print PDF"
                  className="p-1 rounded hover:bg-white/10 hover:text-white transition-colors"
                >
                  <Download className="w-4 h-4" />
                </button>

                <button
                  title="Star Favorite"
                  className="p-1 rounded hover:bg-white/10 hover:text-amber-400 transition-colors"
                >
                  <Star className="w-4 h-4" />
                </button>

                <button
                  title="Document Information"
                  className="p-1 rounded hover:bg-white/10 hover:text-white transition-colors"
                >
                  <AlertCircle className="w-4 h-4" />
                </button>

                <button
                  title="More Options"
                  className="p-1 rounded hover:bg-white/10 hover:text-white transition-colors font-bold text-sm tracking-widest px-1.5"
                >
                  •••
                </button>
              </div>

              {/* Center: Red Adobe PDF badge + File Name */}
              <div className="flex items-center gap-2 mx-2 truncate">
                <div className="bg-red-600 text-white rounded-xs px-1.5 py-0.5 text-[10px] font-black tracking-wider flex items-center justify-center shadow-xs">
                  PDF
                </div>
                <span className="text-xs sm:text-sm font-semibold text-white tracking-tight truncate">
                  General Questions.pdf
                </span>
              </div>

              {/* Right Icons */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div
                  title="User Profile: GJ"
                  className="w-6 h-6 rounded-full bg-teal-600 border border-teal-300 flex items-center justify-center font-bold text-[10px] text-white shadow-2xs"
                >
                  GJ
                </div>

                <button
                  title="Teams Conversation"
                  className="p-1 rounded hover:bg-white/10 text-slate-300 hover:text-white transition-colors hidden sm:inline-flex"
                >
                  <MessageSquare className="w-4 h-4" />
                </button>

                <button
                  className="hidden md:flex items-center gap-1 text-[11px] text-slate-200 hover:bg-white/10 px-2 py-1 rounded transition-colors"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-300" />
                  <span>Viewing</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                <button
                  className="hidden lg:flex items-center gap-1 text-[11px] text-slate-200 hover:bg-white/10 px-2 py-1 rounded transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-slate-300" />
                  <span>Open</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                <button
                  className="hidden sm:flex items-center gap-1 text-[11px] text-slate-200 hover:bg-white/10 px-2 py-1 rounded transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5 text-slate-300" />
                  <span>Share</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                <button
                  onClick={() => setShowGeneralPdfModal(false)}
                  title="Close PDF Viewer"
                  className="p-1 rounded text-slate-300 hover:text-white hover:bg-red-600/40 transition-colors ml-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

            </div>

            {/* Sub Toolbar / Zoom & Direct Page Helper */}
            <div className="bg-[#1f1f1f] px-4 py-1.5 flex items-center justify-between text-xs text-slate-400 border-b border-black/40">
              <div className="flex items-center gap-3">
                <span className="text-[11px] text-slate-400">Page 1 of 1</span>
                <span className="text-slate-600">|</span>
                <button
                  onClick={() => setZoomLevel(Math.max(60, zoomLevel - 15))}
                  title="Zoom Out"
                  className="p-1 hover:text-white hover:bg-white/10 rounded"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-[11px] font-mono text-slate-300 min-w-[3rem] text-center">{zoomLevel}%</span>
                <button
                  onClick={() => setZoomLevel(Math.min(150, zoomLevel + 15))}
                  title="Zoom In"
                  className="p-1 hover:text-white hover:bg-white/10 rounded"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setZoomLevel(100)}
                  className="text-[10px] uppercase font-bold px-1.5 py-0.5 bg-white/5 hover:bg-white/15 rounded text-slate-300"
                >
                  Reset
                </button>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/knowledge-hub/faq/ftth/general-questions"
                  className="px-2.5 py-1 bg-[#005696] hover:bg-[#0070ba] text-white rounded text-[11px] font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Open Full Interactive Web Page</span>
                </Link>
              </div>
            </div>

            {/* Main Viewer Body with Centered White Page */}
            <div className="flex-1 bg-[#3c4043] overflow-y-auto p-4 sm:p-8 flex justify-center items-start">
              <div
                style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
                className="bg-white text-black shadow-[0_20px_50px_rgba(0,0,0,0.7)] rounded-xs w-full max-w-[800px] min-h-[920px] p-6 sm:p-10 relative transition-transform duration-150"
              >
                
                {/* SVG Vector Flowchart matching General Questions.pdf */}
                <svg
                  viewBox="0 0 800 640"
                  className="w-full h-auto select-none font-sans"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <filter id="retroShadowGqModal" x="-15%" y="-15%" width="130%" height="130%">
                      <feDropShadow dx="4" dy="4" stdDeviation="0" floodColor="#000000" floodOpacity="1" />
                    </filter>
                    <marker id="arrowGqModal" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#000000" />
                    </marker>
                  </defs>

                  {/* Flowchart Title */}
                  <text
                    x="400"
                    y="32"
                    textAnchor="middle"
                    fontWeight="900"
                    fontSize="28"
                    fontFamily="Arial, Helvetica, sans-serif"
                    fill="#000000"
                    letterSpacing="0.5"
                  >
                    General Questions
                  </text>

                  {/* ROOT NODE: Check the Connection Status (I-Hub/ LDAP) */}
                  <g>
                    <rect
                      x="340"
                      y="54"
                      width="260"
                      height="46"
                      rx="23"
                      ry="23"
                      fill="#5cb85c"
                      stroke="#000000"
                      strokeWidth="2.5"
                      filter="url(#retroShadowGqModal)"
                    />
                    <text
                      x="470"
                      y="74"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="12"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      Check the Connection Status
                    </text>
                    <text
                      x="470"
                      y="89"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="12"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      (I-Hub/ LDAP)
                    </text>
                  </g>

                  {/* BRANCH 1: Not Active */}
                  <path d="M 340 77 L 230 77 L 230 112" stroke="#000000" strokeWidth="2.5" markerEnd="url(#arrowGqModal)" fill="none" />
                  <text
                    x="285"
                    y="69"
                    textAnchor="middle"
                    fontWeight="bold"
                    fontSize="11.5"
                    fill="#ff0000"
                    fontFamily="Arial, Helvetica, sans-serif"
                  >
                    Not Active
                  </text>

                  {/* Green Node: Inform to settle the bill */}
                  <g>
                    <rect
                      x="145"
                      y="112"
                      width="170"
                      height="44"
                      rx="22"
                      ry="22"
                      fill="#5cb85c"
                      stroke="#000000"
                      strokeWidth="2"
                      filter="url(#retroShadowGqModal)"
                    />
                    <text
                      x="230"
                      y="139"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="12"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      Inform to settle the bill
                    </text>
                  </g>

                  {/* Arrow down to END */}
                  <path d="M 230 156 L 230 184" stroke="#000000" strokeWidth="2.5" markerEnd="url(#arrowGqModal)" />
                  <text
                    x="230"
                    y="200"
                    textAnchor="middle"
                    fontWeight="900"
                    fontSize="13"
                    fill="#00b050"
                    fontFamily="Arial, Helvetica, sans-serif"
                  >
                    END
                  </text>

                  {/* BRANCH 2: Active */}
                  <path d="M 470 100 L 470 190" stroke="#000000" strokeWidth="2.5" markerEnd="url(#arrowGqModal)" />
                  <text
                    x="490"
                    y="145"
                    textAnchor="start"
                    fontWeight="bold"
                    fontSize="11.5"
                    fill="#00b050"
                    fontFamily="Arial, Helvetica, sans-serif"
                  >
                    Active
                  </text>

                  {/* NODE 2: Check the GB availability (VAS Portal) */}
                  <g>
                    <rect
                      x="340"
                      y="190"
                      width="260"
                      height="46"
                      rx="23"
                      ry="23"
                      fill="#5cb85c"
                      stroke="#000000"
                      strokeWidth="2.5"
                      filter="url(#retroShadowGqModal)"
                    />
                    <text
                      x="470"
                      y="210"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="12"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      Check the GB availability
                    </text>
                    <text
                      x="470"
                      y="225"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="12"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      (VAS Portal)
                    </text>
                  </g>

                  {/* ================= THREE SUB-BRANCHES ================= */}

                  {/* Sub-Branch 1: Throttled due to GB issue */}
                  <path d="M 340 213 L 270 213 L 270 290" stroke="#000000" strokeWidth="2.5" markerEnd="url(#arrowGqModal)" fill="none" />
                  <text
                    x="220"
                    y="245"
                    textAnchor="middle"
                    fontWeight="bold"
                    fontSize="11"
                    fill="#ff0000"
                    fontFamily="Arial, Helvetica, sans-serif"
                  >
                    Throttled due to
                  </text>
                  <text
                    x="220"
                    y="259"
                    textAnchor="middle"
                    fontWeight="bold"
                    fontSize="11"
                    fill="#ff0000"
                    fontFamily="Arial, Helvetica, sans-serif"
                  >
                    GB issue
                  </text>

                  {/* Green Node: Ask customer to add some extraGB. */}
                  <g>
                    <rect
                      x="170"
                      y="290"
                      width="200"
                      height="44"
                      rx="22"
                      ry="22"
                      fill="#5cb85c"
                      stroke="#000000"
                      strokeWidth="2"
                      filter="url(#retroShadowGqModal)"
                    />
                    <text
                      x="270"
                      y="310"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="11.5"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      Ask customer to add some
                    </text>
                    <text
                      x="270"
                      y="324"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="11.5"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      extraGB.
                    </text>
                  </g>

                  {/* Arrow down to END */}
                  <path d="M 270 334 L 270 365" stroke="#000000" strokeWidth="2.5" markerEnd="url(#arrowGqModal)" />
                  <text
                    x="270"
                    y="382"
                    textAnchor="middle"
                    fontWeight="900"
                    fontSize="13"
                    fill="#00b050"
                    fontFamily="Arial, Helvetica, sans-serif"
                  >
                    END
                  </text>

                  {/* Sub-Branch 2: Throttled due to Bill Arrears */}
                  <path d="M 470 236 L 470 300" stroke="#000000" strokeWidth="2.5" markerEnd="url(#arrowGqModal)" />
                  <text
                    x="425"
                    y="255"
                    textAnchor="middle"
                    fontWeight="bold"
                    fontSize="11"
                    fill="#ff0000"
                    fontFamily="Arial, Helvetica, sans-serif"
                  >
                    Throttled due to
                  </text>
                  <text
                    x="425"
                    y="269"
                    textAnchor="middle"
                    fontWeight="bold"
                    fontSize="11"
                    fill="#ff0000"
                    fontFamily="Arial, Helvetica, sans-serif"
                  >
                    Bill Arrears
                  </text>

                  {/* Green Node: Ask customer to settle the bill */}
                  <g>
                    <rect
                      x="385"
                      y="300"
                      width="170"
                      height="44"
                      rx="22"
                      ry="22"
                      fill="#5cb85c"
                      stroke="#000000"
                      strokeWidth="2"
                      filter="url(#retroShadowGqModal)"
                    />
                    <text
                      x="470"
                      y="327"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="11.5"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      Ask customer to settle the bill
                    </text>
                  </g>

                  {/* Lavender Note */}
                  <g>
                    <rect
                      x="345"
                      y="360"
                      width="250"
                      height="54"
                      rx="24"
                      ry="24"
                      fill="#d8b4fe"
                      stroke="#000000"
                      strokeWidth="2"
                      filter="url(#retroShadowGqModal)"
                    />
                    <text
                      x="470"
                      y="378"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="9"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      (Note: Better if can check the package mentioned in
                    </text>
                    <text
                      x="470"
                      y="390"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="9"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      bothLDAP & VAS portal are same. If there are any
                    </text>
                    <text
                      x="470"
                      y="402"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="9"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      mismatches,can forward a complaint to ISP)
                    </text>
                  </g>

                  {/* Sub-Branch 3: If GBs are available */}
                  <path d="M 600 213 L 640 213 L 640 430" stroke="#000000" strokeWidth="2.5" markerEnd="url(#arrowGqModal)" fill="none" />
                  <text
                    x="650"
                    y="320"
                    textAnchor="start"
                    fontWeight="bold"
                    fontSize="11"
                    fill="#00b050"
                    fontFamily="Arial, Helvetica, sans-serif"
                  >
                    If GBs are available
                  </text>

                  {/* Green Node: Follow the next FAQ on ONT Indicators. */}
                  <g
                    className="cursor-pointer"
                    onClick={() => {
                      setShowGeneralPdfModal(false);
                      setShowOntPdfModal(true);
                    }}
                  >
                    <rect
                      x="530"
                      y="430"
                      width="220"
                      height="46"
                      rx="23"
                      ry="23"
                      fill="#5cb85c"
                      stroke="#000000"
                      strokeWidth="2"
                      filter="url(#retroShadowGqModal)"
                    />
                    <text
                      x="640"
                      y="450"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="11.5"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      Follow the next FAQ
                    </text>
                    <text
                      x="640"
                      y="464"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="11.5"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      on ONT Indicators.
                    </text>
                  </g>

                </svg>

              </div>
            </div>

          </div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* 11. OFFICIAL PON/LOS INDICATOR PDF VIEWER MODAL          */}
      {/* ======================================================== */}
      <AnimatePresence>
        {showPonPdfModal && (
          <div className="fixed inset-0 z-50 flex flex-col bg-[#262626] text-white overflow-hidden animate-in fade-in duration-200">
            
            {/* Top SharePoint / PDF Reader Dark Toolbar matching screenshot */}
            <div className="bg-[#262626] border-b border-white/10 px-3 sm:px-5 py-2 flex items-center justify-between text-xs select-none shrink-0 shadow-md">
              
              {/* Left Icons: Sidebar toggle | Download, Star, Info, More */}
              <div className="flex items-center gap-2 sm:gap-3 text-slate-300">
                <button
                  title="Document Thumbnails"
                  className="p-1 rounded hover:bg-white/10 hover:text-white transition-colors"
                >
                  <FileText className="w-4 h-4" />
                </button>

                <div className="h-4 w-px bg-slate-600"></div>

                <button
                  onClick={() => window.print()}
                  title="Download / Print PDF"
                  className="p-1 rounded hover:bg-white/10 hover:text-white transition-colors"
                >
                  <Download className="w-4 h-4" />
                </button>

                <button
                  title="Star Favorite"
                  className="p-1 rounded hover:bg-white/10 hover:text-amber-400 transition-colors"
                >
                  <Star className="w-4 h-4" />
                </button>

                <button
                  title="Document Information"
                  className="p-1 rounded hover:bg-white/10 hover:text-white transition-colors"
                >
                  <AlertCircle className="w-4 h-4" />
                </button>

                <button
                  title="More Options"
                  className="p-1 rounded hover:bg-white/10 hover:text-white transition-colors font-bold text-sm tracking-widest px-1.5"
                >
                  •••
                </button>
              </div>

              {/* Center: Red Adobe PDF badge + File Name */}
              <div className="flex items-center gap-2 mx-2 truncate">
                <div className="bg-red-600 text-white rounded-xs px-1.5 py-0.5 text-[10px] font-black tracking-wider flex items-center justify-center shadow-xs">
                  PDF
                </div>
                <span className="text-xs sm:text-sm font-semibold text-white tracking-tight truncate">
                  PON-LOS Ind... Steady.pdf
                </span>
              </div>

              {/* Right: Avatar, Teams chat, Viewing, Open, Share, Close */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div
                  title="User Profile: GJ"
                  className="w-6 h-6 rounded-full bg-teal-600 border border-teal-300 flex items-center justify-center font-bold text-[10px] text-white shadow-2xs"
                >
                  GJ
                </div>

                <button
                  title="Teams Conversation"
                  className="p-1 rounded hover:bg-white/10 text-slate-300 hover:text-white transition-colors hidden sm:inline-flex"
                >
                  <MessageSquare className="w-4 h-4" />
                </button>

                <button
                  className="hidden md:flex items-center gap-1 text-[11px] text-slate-200 hover:bg-white/10 px-2 py-1 rounded transition-colors"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-300" />
                  <span>Viewing</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                <Link
                  href="/knowledge-hub/faq/ftth/pon-los-indicator"
                  className="hidden lg:flex items-center gap-1 text-[11px] text-cyan-200 hover:text-white hover:bg-white/10 px-2.5 py-1 rounded transition-colors border border-cyan-400/30"
                  title="Open Interactive Troubleshooter in Full Page"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-cyan-300" />
                  <span>Open Interactive SOP</span>
                </Link>

                <button
                  className="hidden sm:flex items-center gap-1 text-[11px] text-slate-200 hover:bg-white/10 px-2 py-1 rounded transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5 text-slate-300" />
                  <span>Share</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                <button
                  onClick={() => setShowPonPdfModal(false)}
                  title="Close PDF Viewer"
                  className="p-1 rounded text-slate-300 hover:text-white hover:bg-red-600/40 transition-colors ml-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

            </div>

            {/* Sub Toolbar / Zoom & TT Action Helper */}
            <div className="bg-[#1f1f1f] px-4 py-1.5 flex items-center justify-between text-xs text-slate-400 border-b border-black/40">
              <div className="flex items-center gap-3">
                <span className="text-[11px] text-slate-400">Page 1 of 1</span>
                <span className="text-slate-600">|</span>
                <button
                  onClick={() => setZoomLevel(Math.max(60, zoomLevel - 15))}
                  title="Zoom Out"
                  className="p-1 hover:text-white hover:bg-white/10 rounded"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-[11px] font-mono text-slate-300 min-w-[3rem] text-center">{zoomLevel}%</span>
                <button
                  onClick={() => setZoomLevel(Math.min(150, zoomLevel + 15))}
                  title="Zoom In"
                  className="p-1 hover:text-white hover:bg-white/10 rounded"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setZoomLevel(100)}
                  className="text-[10px] uppercase font-bold px-1.5 py-0.5 bg-white/5 hover:bg-white/15 rounded text-slate-300"
                >
                  Reset
                </button>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/knowledge-hub/faq/ftth/pon-los-indicator"
                  className="px-2.5 py-1 bg-amber-500/90 hover:bg-amber-500 text-black font-black rounded text-[11px] flex items-center gap-1 shadow-xs transition-colors"
                >
                  <span>Guided Triage Mode</span>
                </Link>

                <button
                  onClick={() => {
                    const ttText = `Target Work Group: AREA-CPE-MTCE (or Default WG if customer unavailable)\nFault Complaint: Optical Signal / PON Indicator Fault\nDiagnostic Log:\n• Observed ONT LED Status: RED / OFF / BLINKING or STEADY (Session dead)\n• Private Proxy / Device check completed\n• Customer Availability: Confirmed on site\nAction Required: Field technician dispatch for optical link power measurement and CPE transceiver check.`;
                    navigator.clipboard.writeText(ttText);
                    setTtCopied(true);
                    setTimeout(() => setTtCopied(false), 2500);
                  }}
                  className="px-2.5 py-1 bg-red-600/90 hover:bg-red-600 text-white rounded text-[11px] font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  {ttCopied ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3" />}
                  <span>{ttCopied ? 'TT Copied!' : 'Copy TT AREA-CPE-MTCE'}</span>
                </button>
              </div>
            </div>

            {/* Main Viewer Body with Centered White Page */}
            <div className="flex-1 bg-[#3c4043] overflow-y-auto p-4 sm:p-8 flex justify-center items-start">
              <div
                style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
                className="bg-white text-black shadow-[0_20px_50px_rgba(0,0,0,0.7)] rounded-xs w-full max-w-[800px] min-h-[920px] p-6 sm:p-10 relative transition-transform duration-150"
              >
                
                {/* Flowchart Title matching PDF */}
                <h2 className="text-center font-black text-2xl sm:text-3xl tracking-tight text-black mb-8">
                  PON/LOS Indicator RED,OFF, Blinking or Steady
                </h2>

                {/* SVG Vector Flowchart matching exact official diagram */}
                <svg
                  viewBox="0 0 800 780"
                  className="w-full h-auto select-none font-sans"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <filter id="retroShadowPonModal" x="-15%" y="-15%" width="130%" height="130%">
                      <feDropShadow dx="4" dy="4" stdDeviation="0" floodColor="#000000" floodOpacity="1" />
                    </filter>
                    <marker id="arrowPonModal" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#000000" />
                    </marker>
                  </defs>

                  {/* ROOT NODE: Check the PON/LOS indicator in ONT */}
                  <g>
                    <rect
                      x="300"
                      y="14"
                      width="240"
                      height="46"
                      rx="23"
                      ry="23"
                      fill="#ffffff"
                      stroke="#000000"
                      strokeWidth="2.5"
                      filter="url(#retroShadowPonModal)"
                    />
                    <text
                      x="420"
                      y="34"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="12"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      Check the PON/LOS
                    </text>
                    <text
                      x="420"
                      y="49"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="12"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      indicator in ONT
                    </text>
                  </g>

                  {/* BRANCH 1: RED / OFF/ BLINKING (Left) */}
                  <path d="M 320 60 L 320 108" stroke="#000000" strokeWidth="2.5" markerEnd="url(#arrowPonModal)" />
                  <text
                    x="290"
                    y="85"
                    textAnchor="end"
                    fontWeight="bold"
                    fontSize="11"
                    fill="#000000"
                    fontFamily="Arial, Helvetica, sans-serif"
                  >
                    RED / OFF/ BLINKING
                  </text>

                  {/* Red Node: Create a TT to AREA-CPE-MTCE */}
                  <g>
                    <rect
                      x="230"
                      y="108"
                      width="180"
                      height="44"
                      rx="22"
                      ry="22"
                      fill="#ff0000"
                      stroke="#000000"
                      strokeWidth="2.5"
                      filter="url(#retroShadowPonModal)"
                    />
                    <text
                      x="320"
                      y="126"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="11"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      Create a TT to
                    </text>
                    <text
                      x="320"
                      y="140"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="11"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      AREA-CPE-MTCE
                    </text>
                  </g>

                  {/* BRANCH 2: STEADY (Right) */}
                  <path d="M 520 60 L 520 108" stroke="#000000" strokeWidth="2.5" markerEnd="url(#arrowPonModal)" />
                  <text
                    x="530"
                    y="85"
                    textAnchor="start"
                    fontWeight="bold"
                    fontSize="11"
                    fill="#000000"
                    fontFamily="Arial, Helvetica, sans-serif"
                  >
                    STEADY
                  </text>

                  {/* NODE 1: Restart the ONT ( Switch OFF & Switch On ) */}
                  <g>
                    <rect
                      x="430"
                      y="108"
                      width="180"
                      height="44"
                      rx="22"
                      ry="22"
                      fill="#ffd24d"
                      stroke="#000000"
                      strokeWidth="2"
                      filter="url(#retroShadowPonModal)"
                    />
                    <text
                      x="520"
                      y="126"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="11"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      Restart the ONT
                    </text>
                    <text
                      x="520"
                      y="140"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="10"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      ( Switch OFF &amp; Switch On )
                    </text>
                  </g>

                  {/* Arrow Right to END */}
                  <path d="M 610 130 L 670 130" stroke="#000000" strokeWidth="2.5" markerEnd="url(#arrowPonModal)" />
                  <text
                    x="640"
                    y="120"
                    textAnchor="middle"
                    fontWeight="bold"
                    fontSize="11"
                    fill="#00b050"
                    fontFamily="Arial, Helvetica, sans-serif"
                  >
                    Working
                  </text>
                  <text
                    x="680"
                    y="134"
                    textAnchor="start"
                    fontWeight="900"
                    fontSize="13"
                    fill="#00b050"
                    fontFamily="Arial, Helvetica, sans-serif"
                  >
                    END
                  </text>

                  {/* Arrow Down to Node 2 */}
                  <path d="M 520 152 L 520 196" stroke="#000000" strokeWidth="2.5" markerEnd="url(#arrowPonModal)" />
                  <text
                    x="530"
                    y="178"
                    textAnchor="start"
                    fontWeight="bold"
                    fontSize="11"
                    fill="#ff0000"
                    fontFamily="Arial, Helvetica, sans-serif"
                  >
                    Not Working
                  </text>

                  {/* NODE 2: Change the Browser and check */}
                  <g>
                    <rect
                      x="430"
                      y="196"
                      width="180"
                      height="44"
                      rx="22"
                      ry="22"
                      fill="#ffd24d"
                      stroke="#000000"
                      strokeWidth="2"
                      filter="url(#retroShadowPonModal)"
                    />
                    <text
                      x="520"
                      y="214"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="11"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      Change the Browser
                    </text>
                    <text
                      x="520"
                      y="228"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="11"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      and check
                    </text>
                  </g>

                  {/* Arrow Right to END */}
                  <path d="M 610 218 L 670 218" stroke="#000000" strokeWidth="2.5" markerEnd="url(#arrowPonModal)" />
                  <text
                    x="640"
                    y="208"
                    textAnchor="middle"
                    fontWeight="bold"
                    fontSize="11"
                    fill="#00b050"
                    fontFamily="Arial, Helvetica, sans-serif"
                  >
                    Working
                  </text>
                  <text
                    x="680"
                    y="222"
                    textAnchor="start"
                    fontWeight="900"
                    fontSize="13"
                    fill="#00b050"
                    fontFamily="Arial, Helvetica, sans-serif"
                  >
                    END
                  </text>

                  {/* Arrow Down to Node 3 */}
                  <path d="M 520 240 L 520 284" stroke="#000000" strokeWidth="2.5" markerEnd="url(#arrowPonModal)" />
                  <text
                    x="530"
                    y="266"
                    textAnchor="start"
                    fontWeight="bold"
                    fontSize="11"
                    fill="#ff0000"
                    fontFamily="Arial, Helvetica, sans-serif"
                  >
                    Not Working
                  </text>

                  {/* NODE 3: Check with another Device */}
                  <g>
                    <rect
                      x="430"
                      y="284"
                      width="180"
                      height="44"
                      rx="22"
                      ry="22"
                      fill="#ffd24d"
                      stroke="#000000"
                      strokeWidth="2"
                      filter="url(#retroShadowPonModal)"
                    />
                    <text
                      x="520"
                      y="311"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="11"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      Check with another Device
                    </text>
                  </g>

                  {/* Arrow Right to END */}
                  <path d="M 610 306 L 670 306" stroke="#000000" strokeWidth="2.5" markerEnd="url(#arrowPonModal)" />
                  <text
                    x="640"
                    y="296"
                    textAnchor="middle"
                    fontWeight="bold"
                    fontSize="11"
                    fill="#00b050"
                    fontFamily="Arial, Helvetica, sans-serif"
                  >
                    Working
                  </text>
                  <text
                    x="680"
                    y="310"
                    textAnchor="start"
                    fontWeight="900"
                    fontSize="13"
                    fill="#00b050"
                    fontFamily="Arial, Helvetica, sans-serif"
                  >
                    END
                  </text>

                  {/* Arrow Down to Node 4 */}
                  <path d="M 520 328 L 520 372" stroke="#000000" strokeWidth="2.5" markerEnd="url(#arrowPonModal)" />
                  <text
                    x="530"
                    y="354"
                    textAnchor="start"
                    fontWeight="bold"
                    fontSize="11"
                    fill="#ff0000"
                    fontFamily="Arial, Helvetica, sans-serif"
                  >
                    Not Working
                  </text>

                  {/* NODE 4: Check weather using a Private Proxy */}
                  <g>
                    <rect
                      x="430"
                      y="372"
                      width="180"
                      height="44"
                      rx="22"
                      ry="22"
                      fill="#ffd24d"
                      stroke="#000000"
                      strokeWidth="2"
                      filter="url(#retroShadowPonModal)"
                    />
                    <text
                      x="520"
                      y="390"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="11"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      Check weather using a
                    </text>
                    <text
                      x="520"
                      y="404"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="11"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      Private Proxy
                    </text>
                  </g>

                  {/* Path from Node 4 back up to Red TT Node! */}
                  <path d="M 430 394 L 320 394 L 320 156" stroke="#000000" strokeWidth="2.5" markerEnd="url(#arrowPonModal)" fill="none" />
                  <text
                    x="330"
                    y="375"
                    textAnchor="start"
                    fontWeight="bold"
                    fontSize="10"
                    fill="#ff0000"
                    fontFamily="Arial, Helvetica, sans-serif"
                  >
                    Proxy Switched Off
                  </text>
                  <text
                    x="330"
                    y="387"
                    textAnchor="start"
                    fontWeight="bold"
                    fontSize="10"
                    fill="#ff0000"
                    fontFamily="Arial, Helvetica, sans-serif"
                  >
                    but still Not Working
                  </text>

                  {/* Arrow Down to Node 5 */}
                  <path d="M 520 416 L 520 460" stroke="#000000" strokeWidth="2.5" markerEnd="url(#arrowPonModal)" />
                  <text
                    x="530"
                    y="442"
                    textAnchor="start"
                    fontWeight="bold"
                    fontSize="11"
                    fill="#ff0000"
                    fontFamily="Arial, Helvetica, sans-serif"
                  >
                    Proxy On
                  </text>

                  {/* NODE 5: Ask to switch off Proxy */}
                  <g>
                    <rect
                      x="430"
                      y="460"
                      width="180"
                      height="44"
                      rx="22"
                      ry="22"
                      fill="#ffd24d"
                      stroke="#000000"
                      strokeWidth="2"
                      filter="url(#retroShadowPonModal)"
                    />
                    <text
                      x="520"
                      y="487"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="11"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      Ask to switch off Proxy
                    </text>
                  </g>

                  {/* Arrow Right to END */}
                  <path d="M 610 482 L 670 482" stroke="#000000" strokeWidth="2.5" markerEnd="url(#arrowPonModal)" />
                  <text
                    x="640"
                    y="472"
                    textAnchor="middle"
                    fontWeight="bold"
                    fontSize="11"
                    fill="#00b050"
                    fontFamily="Arial, Helvetica, sans-serif"
                  >
                    Working
                  </text>
                  <text
                    x="680"
                    y="486"
                    textAnchor="start"
                    fontWeight="900"
                    fontSize="13"
                    fill="#00b050"
                    fontFamily="Arial, Helvetica, sans-serif"
                  >
                    END
                  </text>

                  {/* ================= BOTTOM LAVENDER NOTES ================= */}
                  {/* Note 1: If Customer Not Available at Location */}
                  <g>
                    <rect
                      x="220"
                      y="555"
                      width="420"
                      height="54"
                      rx="24"
                      ry="24"
                      fill="#d8b4fe"
                      stroke="#000000"
                      strokeWidth="2"
                      filter="url(#retroShadowPonModal)"
                    />
                    <text
                      x="430"
                      y="572"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="10"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      If the Customer Not Available at the Location
                    </text>
                    <text
                      x="430"
                      y="585"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="10"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      Create the TT under the Default WG.
                    </text>
                    <text
                      x="430"
                      y="598"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="10"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      Record the customer's available date and time in the TT Description.
                    </text>
                  </g>

                  {/* Note 2: TT Description is mandatory */}
                  <g>
                    <rect
                      x="230"
                      y="625"
                      width="400"
                      height="46"
                      rx="23"
                      ry="23"
                      fill="#d8b4fe"
                      stroke="#000000"
                      strokeWidth="2"
                      filter="url(#retroShadowPonModal)"
                    />
                    <text
                      x="430"
                      y="643"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="10"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      TT Description is mandatory. Ensure the TT description clearly matches the
                    </text>
                    <text
                      x="430"
                      y="657"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="10"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      customer's reported complaint and includes all relevant troubleshooting details.
                    </text>
                  </g>

                </svg>

              </div>
            </div>

          </div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* 12. OFFICIAL WI-FI NOT WORKING PDF VIEWER MODAL          */}
      {/* ======================================================== */}
      <AnimatePresence>
        {showWifiPdfModal && (
          <div className="fixed inset-0 z-50 flex flex-col bg-[#262626] text-white overflow-hidden animate-in fade-in duration-200">
            
            {/* Top SharePoint / PDF Reader Dark Toolbar matching screenshot */}
            <div className="bg-[#262626] border-b border-white/10 px-3 sm:px-5 py-2 flex items-center justify-between text-xs select-none shrink-0 shadow-md">
              
              {/* Left Icons: Sidebar toggle | Download, Star, Info, More */}
              <div className="flex items-center gap-2 sm:gap-3 text-slate-300">
                <button
                  title="Document Thumbnails"
                  className="p-1 rounded hover:bg-white/10 hover:text-white transition-colors"
                >
                  <FileText className="w-4 h-4" />
                </button>

                <div className="h-4 w-px bg-slate-600"></div>

                <button
                  onClick={() => window.print()}
                  title="Download / Print PDF"
                  className="p-1 rounded hover:bg-white/10 hover:text-white transition-colors"
                >
                  <Download className="w-4 h-4" />
                </button>

                <button
                  title="Star Favorite"
                  className="p-1 rounded hover:bg-white/10 hover:text-amber-400 transition-colors"
                >
                  <Star className="w-4 h-4" />
                </button>

                <button
                  title="Document Information"
                  className="p-1 rounded hover:bg-white/10 hover:text-white transition-colors"
                >
                  <AlertCircle className="w-4 h-4" />
                </button>

                <button
                  title="More Options"
                  className="p-1 rounded hover:bg-white/10 hover:text-white transition-colors font-bold text-sm tracking-widest px-1.5"
                >
                  •••
                </button>
              </div>

              {/* Center: Red Adobe PDF badge + File Name */}
              <div className="flex items-center gap-2 mx-2 truncate">
                <div className="bg-red-600 text-white rounded-xs px-1.5 py-0.5 text-[10px] font-black tracking-wider flex items-center justify-center shadow-xs">
                  PDF
                </div>
                <span className="text-xs sm:text-sm font-semibold text-white tracking-tight truncate">
                  4. WiFi not working.pdf
                </span>
              </div>

              {/* Right: Avatar, Teams chat, Viewing, Open, Share, Close */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div
                  title="User Profile: GJ"
                  className="w-6 h-6 rounded-full bg-teal-600 border border-teal-300 flex items-center justify-center font-bold text-[10px] text-white shadow-2xs"
                >
                  GJ
                </div>

                <button
                  title="Teams Conversation"
                  className="p-1 rounded hover:bg-white/10 text-slate-300 hover:text-white transition-colors hidden sm:inline-flex"
                >
                  <MessageSquare className="w-4 h-4" />
                </button>

                <button
                  className="hidden md:flex items-center gap-1 text-[11px] text-slate-200 hover:bg-white/10 px-2 py-1 rounded transition-colors"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-300" />
                  <span>Viewing</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                <Link
                  href="/knowledge-hub/faq/ftth/wifi-not-working"
                  className="hidden lg:flex items-center gap-1 text-[11px] text-lime-300 hover:text-white hover:bg-white/10 px-2.5 py-1 rounded transition-colors border border-lime-400/30"
                  title="Open Interactive Troubleshooter in Full Page"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-lime-300" />
                  <span>Open Interactive SOP</span>
                </Link>

                <button
                  className="hidden sm:flex items-center gap-1 text-[11px] text-slate-200 hover:bg-white/10 px-2 py-1 rounded transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5 text-slate-300" />
                  <span>Share</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                <button
                  onClick={() => setShowWifiPdfModal(false)}
                  title="Close PDF Viewer"
                  className="p-1 rounded text-slate-300 hover:text-white hover:bg-red-600/40 transition-colors ml-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

            </div>

            {/* Sub Toolbar / Zoom & TT Action Helper */}
            <div className="bg-[#1f1f1f] px-4 py-1.5 flex items-center justify-between text-xs text-slate-400 border-b border-black/40">
              <div className="flex items-center gap-3">
                <span className="text-[11px] text-slate-400">Page 1 of 1</span>
                <span className="text-slate-600">|</span>
                <button
                  onClick={() => setZoomLevel(Math.max(60, zoomLevel - 15))}
                  title="Zoom Out"
                  className="p-1 hover:text-white hover:bg-white/10 rounded"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-[11px] font-mono text-slate-300 min-w-[3rem] text-center">{zoomLevel}%</span>
                <button
                  onClick={() => setZoomLevel(Math.min(150, zoomLevel + 15))}
                  title="Zoom In"
                  className="p-1 hover:text-white hover:bg-white/10 rounded"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setZoomLevel(100)}
                  className="text-[10px] uppercase font-bold px-1.5 py-0.5 bg-white/5 hover:bg-white/15 rounded text-slate-300"
                >
                  Reset
                </button>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/knowledge-hub/faq/ftth/wifi-not-working"
                  className="px-2.5 py-1 bg-lime-400 hover:bg-lime-300 text-slate-900 font-black rounded text-[11px] flex items-center gap-1 shadow-xs transition-colors"
                >
                  <span>Guided Triage Mode</span>
                </Link>

                <button
                  onClick={() => {
                    const ttText = `Target Work Group: AREA-CPE-MTCE\nService Category: BB Service\nFault Complaint: Wi-Fi Not Working (WLAN Indicator Dead / Button Non-responsive)\nAction Taken: Guided customer to press and hold WLAN button in ONT. WLAN light remains OFF. Dispatching for CPE router inspection.`;
                    navigator.clipboard.writeText(ttText);
                    setTtCopied(true);
                    setTimeout(() => setTtCopied(false), 2500);
                  }}
                  className="px-2 py-1 bg-emerald-600/90 hover:bg-emerald-600 text-white rounded text-[11px] font-bold flex items-center gap-1 shadow-xs transition-colors"
                >
                  {ttCopied ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3" />}
                  <span>Copy TT AREA-CPE</span>
                </button>

                <button
                  onClick={() => {
                    const ttText = `Target Work Group: CEN-CSC-TECH\nService Category: BB Service\nFault Complaint: Wi-Fi Connected but No Internet (PON Steady)\nAction Taken: Client wireless is ON, Wi-Fi config verified (SSID & Password OK). Gateway session unreachable. Escalating to CEN-CSC-TECH.`;
                    navigator.clipboard.writeText(ttText);
                    setTtCopied(true);
                    setTimeout(() => setTtCopied(false), 2500);
                  }}
                  className="px-2 py-1 bg-blue-600/90 hover:bg-blue-600 text-white rounded text-[11px] font-bold flex items-center gap-1 shadow-xs transition-colors"
                >
                  {ttCopied ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3" />}
                  <span>Copy TT CEN-CSC</span>
                </button>
              </div>
            </div>

            {/* Main Viewer Body with Centered White Page */}
            <div className="flex-1 bg-[#3c4043] overflow-y-auto p-4 sm:p-8 flex justify-center items-start">
              <div
                style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
                className="bg-white text-black shadow-[0_20px_50px_rgba(0,0,0,0.7)] rounded-xs w-full max-w-[880px] min-h-[920px] p-6 sm:p-10 relative transition-transform duration-150"
              >
                
                {/* SVG Vector Flowchart matching exact official diagram */}
                <svg
                  viewBox="0 0 920 620"
                  className="w-full h-auto select-none font-sans"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <marker id="arrowWifiModal" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#ff0000" />
                    </marker>
                  </defs>

                  {/* Flowchart Title */}
                  <text
                    x="460"
                    y="32"
                    textAnchor="middle"
                    fontWeight="900"
                    fontSize="26"
                    fontFamily="Arial, Helvetica, sans-serif"
                    fill="#000000"
                  >
                    Wi-Fi not working (PON Steady)
                  </text>

                  {/* ROOT NODE: Check the Wi-Fi or WLAN indicator is ON */}
                  <g>
                    <rect
                      x="360"
                      y="64"
                      width="160"
                      height="46"
                      rx="23"
                      ry="23"
                      fill="#ffffb0"
                      stroke="#000000"
                      strokeWidth="2"
                    />
                    <text
                      x="440"
                      y="83"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="10.5"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      Check the <tspan fontWeight="900">Wi-Fi</tspan> or
                    </text>
                    <text
                      x="440"
                      y="98"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="10.5"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      <tspan fontWeight="900">WLAN</tspan> indicator is ON
                    </text>
                  </g>

                  {/* BRANCH 1: Off (Left) */}
                  <path d="M 360 87 L 295 87 L 295 130" stroke="#ff0000" strokeWidth="2" markerEnd="url(#arrowWifiModal)" fill="none" />
                  <text
                    x="330"
                    y="80"
                    textAnchor="middle"
                    fontWeight="bold"
                    fontSize="11"
                    fill="#ff0000"
                    fontFamily="Arial, Helvetica, sans-serif"
                  >
                    Off
                  </text>

                  {/* Node 1A: Press and switch on Wi-Fi or WLAN button in ONT */}
                  <g>
                    <rect
                      x="220"
                      y="130"
                      width="150"
                      height="46"
                      fill="#ffffb0"
                      stroke="#000000"
                      strokeWidth="1.8"
                    />
                    <text
                      x="295"
                      y="146"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="9.5"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      Press and switch on
                    </text>
                    <text
                      x="295"
                      y="158"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="9.5"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      <tspan fontWeight="900">Wi-Fi</tspan> or <tspan fontWeight="900">WLAN</tspan> button
                    </text>
                    <text
                      x="295"
                      y="170"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="9.5"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      in ONT
                    </text>
                  </g>

                  {/* Sub-branch Off from Node 1A -> Down to Create TT to AREA-CPE-MTCE */}
                  <path d="M 220 153 L 155 153 L 155 220" stroke="#ff0000" strokeWidth="2" markerEnd="url(#arrowWifiModal)" fill="none" />
                  <text
                    x="180"
                    y="145"
                    textAnchor="middle"
                    fontWeight="bold"
                    fontSize="11"
                    fill="#ff0000"
                    fontFamily="Arial, Helvetica, sans-serif"
                  >
                    Off
                  </text>

                  {/* GREEN NODE: Create a TT to AREA-CPE-MTCE Work Group under BB Service */}
                  <g>
                    <rect
                      x="80"
                      y="220"
                      width="170"
                      height="90"
                      rx="30"
                      ry="30"
                      fill="#88c848"
                      stroke="#000000"
                      strokeWidth="2"
                    />
                    <text
                      x="165"
                      y="245"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="11"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      Create a TT to
                    </text>
                    <text
                      x="165"
                      y="262"
                      textAnchor="middle"
                      fontWeight="900"
                      fontSize="12"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      AREA-CPE-MTCE
                    </text>
                    <text
                      x="165"
                      y="280"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="11"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      Work Group under BB
                    </text>
                    <text
                      x="165"
                      y="296"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="11"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      Service
                    </text>
                  </g>

                  {/* Sub-branch On from Node 1A -> Points Right into Check whether the Internet is working */}
                  <path d="M 370 153 L 420 153 L 420 230" stroke="#ff0000" strokeWidth="2" markerEnd="url(#arrowWifiModal)" fill="none" />
                  <text
                    x="395"
                    y="145"
                    textAnchor="middle"
                    fontWeight="bold"
                    fontSize="11"
                    fill="#ff0000"
                    fontFamily="Arial, Helvetica, sans-serif"
                  >
                    On
                  </text>

                  {/* BRANCH 2: On (Right from Root Node) */}
                  <path d="M 520 87 L 610 87 L 610 130" stroke="#ff0000" strokeWidth="2" markerEnd="url(#arrowWifiModal)" fill="none" />
                  <text
                    x="565"
                    y="80"
                    textAnchor="middle"
                    fontWeight="bold"
                    fontSize="11"
                    fill="#ff0000"
                    fontFamily="Arial, Helvetica, sans-serif"
                  >
                    On
                  </text>

                  {/* Node 1B: Check Wireless is on in customer's device (Eg: Laptop or Smart Phone) */}
                  <g>
                    <rect
                      x="510"
                      y="130"
                      width="180"
                      height="46"
                      fill="#ffffb0"
                      stroke="#000000"
                      strokeWidth="1.8"
                    />
                    <text
                      x="600"
                      y="148"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="9.5"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      Check Wireless is on in
                    </text>
                    <text
                      x="600"
                      y="160"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="9.5"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      customer’s device
                    </text>
                    <text
                      x="600"
                      y="171"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="8.5"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      (Eg: Laptop or Smart Phone)
                    </text>
                  </g>

                  {/* Sub-branch No from Node 1B -> Right to Instruct customer... */}
                  <path d="M 690 153 L 740 153" stroke="#ff0000" strokeWidth="2" markerEnd="url(#arrowWifiModal)" fill="none" />
                  <text
                    x="715"
                    y="145"
                    textAnchor="middle"
                    fontWeight="bold"
                    fontSize="11"
                    fill="#ff0000"
                    fontFamily="Arial, Helvetica, sans-serif"
                  >
                    No
                  </text>

                  {/* Node: Instruct customer to switch on Wi-Fi in the Device */}
                  <g>
                    <rect
                      x="745"
                      y="125"
                      width="135"
                      height="56"
                      rx="28"
                      ry="28"
                      fill="#ffffb0"
                      stroke="#000000"
                      strokeWidth="1.8"
                    />
                    <text
                      x="812"
                      y="145"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="9"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      Instruct customer
                    </text>
                    <text
                      x="812"
                      y="157"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="9"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      to switch on Wi-Fi
                    </text>
                    <text
                      x="812"
                      y="169"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="9"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      in the Device
                    </text>
                  </g>

                  {/* Sub-branch Yes from Node 1B -> Down to Check Wi-Fi Configuration */}
                  <path d="M 610 176 L 610 230" stroke="#ff0000" strokeWidth="2" markerEnd="url(#arrowWifiModal)" fill="none" />
                  <text
                    x="625"
                    y="200"
                    textAnchor="start"
                    fontWeight="bold"
                    fontSize="11"
                    fill="#ff0000"
                    fontFamily="Arial, Helvetica, sans-serif"
                  >
                    Yes
                  </text>

                  {/* MIDDLE NODE: Check whether the Internet is working */}
                  <g>
                    <rect
                      x="380"
                      y="230"
                      width="145"
                      height="46"
                      fill="#ffffb0"
                      stroke="#000000"
                      strokeWidth="1.8"
                    />
                    <text
                      x="452"
                      y="249"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="9.5"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      Check whether the
                    </text>
                    <text
                      x="452"
                      y="263"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="9.5"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      Internet is working
                    </text>
                  </g>

                  {/* From Internet working: Yes -> Down to End */}
                  <path d="M 400 276 L 400 300 L 330 300 L 330 330" stroke="#ff0000" strokeWidth="2" markerEnd="url(#arrowWifiModal)" fill="none" />
                  <text
                    x="365"
                    y="292"
                    textAnchor="middle"
                    fontWeight="bold"
                    fontSize="11"
                    fill="#ff0000"
                    fontFamily="Arial, Helvetica, sans-serif"
                  >
                    Yes
                  </text>

                  {/* GREEN END NODE */}
                  <g>
                    <rect
                      x="290"
                      y="330"
                      width="80"
                      height="34"
                      rx="17"
                      ry="17"
                      fill="#88c848"
                      stroke="#000000"
                      strokeWidth="1.8"
                    />
                    <text
                      x="330"
                      y="351"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="12"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      End
                    </text>
                  </g>

                  {/* From Internet working: Arrow Right into Check Wi-Fi Configuration */}
                  <path d="M 525 253 L 555 253" stroke="#ff0000" strokeWidth="2" markerEnd="url(#arrowWifiModal)" fill="none" />

                  {/* NODE: Check Wi-Fi Configuration */}
                  <g>
                    <rect
                      x="555"
                      y="230"
                      width="120"
                      height="46"
                      fill="#ffffb0"
                      stroke="#000000"
                      strokeWidth="1.8"
                    />
                    <text
                      x="615"
                      y="250"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="9.5"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      Check Wi-Fi
                    </text>
                    <text
                      x="615"
                      y="264"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="9.5"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      Configuration
                    </text>
                  </g>

                  {/* From Check Wi-Fi Config: Incorrect -> Right to Enter correct Wi-Fi settings */}
                  <path d="M 675 253 L 735 253" stroke="#ff0000" strokeWidth="2" markerEnd="url(#arrowWifiModal)" fill="none" />
                  <text
                    x="705"
                    y="245"
                    textAnchor="middle"
                    fontWeight="bold"
                    fontSize="11"
                    fill="#ff0000"
                    fontFamily="Arial, Helvetica, sans-serif"
                  >
                    Incorrect
                  </text>

                  {/* Node: Enter correct Wi-Fi settings */}
                  <g>
                    <rect
                      x="740"
                      y="228"
                      width="140"
                      height="50"
                      rx="25"
                      ry="25"
                      fill="#ffffb0"
                      stroke="#000000"
                      strokeWidth="1.8"
                    />
                    <text
                      x="810"
                      y="248"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="9"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      Enter correct Wi-Fi
                    </text>
                    <text
                      x="810"
                      y="262"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="9"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      settings
                    </text>
                  </g>

                  {/* From Check Wi-Fi Config: Correct -> Down and Left to Create TT to CEN-CSC-TECH */}
                  <path d="M 615 276 L 615 375 L 535 375" stroke="#ff0000" strokeWidth="2" markerEnd="url(#arrowWifiModal)" fill="none" />
                  <text
                    x="640"
                    y="310"
                    textAnchor="start"
                    fontWeight="bold"
                    fontSize="11"
                    fill="#ff0000"
                    fontFamily="Arial, Helvetica, sans-serif"
                  >
                    Correct
                  </text>

                  {/* GREEN NODE: Create a TT to CEN-CSC-TECH Work Group under BB Service */}
                  <g>
                    <rect
                      x="370"
                      y="330"
                      width="165"
                      height="90"
                      rx="30"
                      ry="30"
                      fill="#88c848"
                      stroke="#000000"
                      strokeWidth="2"
                    />
                    <text
                      x="452"
                      y="355"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="11"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      Create a TT to
                    </text>
                    <text
                      x="452"
                      y="372"
                      textAnchor="middle"
                      fontWeight="900"
                      fontSize="12"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      CEN-CSC-TECH
                    </text>
                    <text
                      x="452"
                      y="390"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="11"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      Work Group under BB
                    </text>
                    <text
                      x="452"
                      y="406"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="11"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#000000"
                    >
                      Service
                    </text>
                  </g>

                  {/* ======================================================== */}
                  {/* BOTTOM PURPLE CALLOUT BOXES MATCHING EXACT SCREENSHOT    */}
                  {/* ======================================================== */}
                  
                  {/* Left Callout Note: If Wi-Fi coverage is low */}
                  <g>
                    <path
                      d="M 120 440 C 100 440, 100 580, 120 580 L 330 580 C 350 580, 320 510, 350 440 Z"
                      fill="#f5e8ff"
                      stroke="#800080"
                      strokeWidth="2"
                    />
                    <text x="175" y="465" fontWeight="bold" fontSize="10" fill="#ff0000" fontFamily="Arial, Helvetica, sans-serif">
                      Note:
                    </text>
                    <text x="175" y="478" fontWeight="bold" fontSize="9" fill="#ff0000" fontFamily="Arial, Helvetica, sans-serif">
                      If Wi-Fi coverage is low,
                    </text>
                    <text x="190" y="495" fontWeight="bold" fontSize="9" fill="#000000" fontFamily="Arial, Helvetica, sans-serif">
                      1. Ask the distance
                    </text>
                    <text x="205" y="508" fontWeight="normal" fontSize="8" fill="#000000" fontFamily="Arial, Helvetica, sans-serif">
                      between the ONT and
                    </text>
                    <text x="205" y="520" fontWeight="normal" fontSize="8" fill="#000000" fontFamily="Arial, Helvetica, sans-serif">
                      the device
                    </text>
                    <text x="190" y="535" fontWeight="bold" fontSize="8.5" fill="#000000" fontFamily="Arial, Helvetica, sans-serif">
                      2. Add the distance in the
                    </text>
                    <text x="205" y="546" fontWeight="normal" fontSize="8" fill="#000000" fontFamily="Arial, Helvetica, sans-serif">
                      description of the TT
                    </text>
                    <text x="190" y="560" fontWeight="bold" fontSize="8.5" fill="#000000" fontFamily="Arial, Helvetica, sans-serif">
                      3. Forward such issues to
                    </text>
                    <text x="205" y="571" fontWeight="bold" fontSize="8.5" fill="#000000" fontFamily="Arial, Helvetica, sans-serif">
                      AREA- CPE- MTCE
                    </text>
                  </g>

                  {/* Right Callout Note: Refer Wi-Fi Configuration guides for ONTs */}
                  <g>
                    <path
                      d="M 680 430 C 650 430, 680 500, 650 570 L 860 570 C 880 570, 880 430, 860 430 Z"
                      fill="#f5e8ff"
                      stroke="#800080"
                      strokeWidth="2"
                    />
                    <text x="705" y="455" fontWeight="bold" fontSize="10" fill="#000000" fontFamily="Arial, Helvetica, sans-serif">
                      <tspan fill="#ff0000">Note: </tspan>Refer Wi-Fi
                    </text>
                    <text x="705" y="470" fontWeight="bold" fontSize="9" fill="#000000" fontFamily="Arial, Helvetica, sans-serif">
                      Configuration guides for
                    </text>
                    <text x="705" y="485" fontWeight="bold" fontSize="9" fill="#000000" fontFamily="Arial, Helvetica, sans-serif">
                      ONTs and check SSID,
                    </text>
                    <text x="705" y="500" fontWeight="bold" fontSize="9" fill="#000000" fontFamily="Arial, Helvetica, sans-serif">
                      Enable SSID,
                    </text>
                    <text x="705" y="515" fontWeight="bold" fontSize="9" fill="#000000" fontFamily="Arial, Helvetica, sans-serif">
                      Encryption,
                    </text>
                    <text x="705" y="530" fontWeight="bold" fontSize="9" fill="#000000" fontFamily="Arial, Helvetica, sans-serif">
                      Wireless p/w
                    </text>
                    <text x="705" y="546" fontWeight="bold" fontSize="9" fill="#000000" textDecoration="underline" fontFamily="Arial, Helvetica, sans-serif">
                      Through Detail
                    </text>
                    <text x="705" y="559" fontWeight="bold" fontSize="8.5" fill="#000000" textDecoration="underline" fontFamily="Arial, Helvetica, sans-serif">
                      Setup/Advance Setup or
                    </text>
                    <text x="705" y="571" fontWeight="bold" fontSize="8.5" fill="#000000" textDecoration="underline" fontFamily="Arial, Helvetica, sans-serif">
                      Network
                    </text>
                  </g>

                </svg>

              </div>
            </div>

          </div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* 11. BROWSING SLOW SHAREPOINT PDF VIEWER MODAL             */}
      {/* ======================================================== */}
      <AnimatePresence>
        {showBrowsingSlowPdfModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex flex-col justify-between animate-in fade-in duration-200">
            
            {/* Top Toolbar matching modern SharePoint / Edge PDF viewer */}
            <div className="bg-[#2d3134] text-white px-4 py-2.5 flex items-center justify-between text-xs border-b border-black/50 select-none shrink-0 shadow-md">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-red-600 rounded text-white font-bold text-[10px] tracking-wider">
                    PDF
                  </span>
                  <span className="font-semibold text-slate-100 text-xs sm:text-sm">
                    5. Browzing slow.pdf
                  </span>
                </div>
              </div>

              {/* Center / Action controls */}
              <div className="flex items-center gap-2">
                <button
                  className="hidden md:flex items-center gap-1 text-[11px] text-slate-200 hover:bg-white/10 px-2.5 py-1 rounded transition-colors"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-300" />
                  <span>Viewing</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                <Link
                  href="/knowledge-hub/faq/ftth/browsing-slow"
                  className="hidden lg:flex items-center gap-1 text-[11px] text-purple-300 hover:text-white hover:bg-white/10 px-2.5 py-1 rounded transition-colors border border-purple-400/30"
                  title="Open Interactive Troubleshooter in Full Page"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-purple-300" />
                  <span>Open Interactive SOP</span>
                </Link>

                <button
                  className="hidden sm:flex items-center gap-1 text-[11px] text-slate-200 hover:bg-white/10 px-2 py-1 rounded transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5 text-slate-300" />
                  <span>Share</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                <button
                  onClick={() => setShowBrowsingSlowPdfModal(false)}
                  title="Close PDF Viewer"
                  className="p-1 rounded text-slate-300 hover:text-white hover:bg-red-600/40 transition-colors ml-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

            </div>

            {/* Sub Toolbar / Zoom & TT Action Helper */}
            <div className="bg-[#1f1f1f] px-4 py-1.5 flex items-center justify-between text-xs text-slate-400 border-b border-black/40">
              <div className="flex items-center gap-3">
                <span className="text-[11px] text-slate-400">Page 1 of 1</span>
                <span className="text-slate-600">|</span>
                <button
                  onClick={() => setZoomLevel(Math.max(60, zoomLevel - 15))}
                  title="Zoom Out"
                  className="p-1 hover:text-white hover:bg-white/10 rounded"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-[11px] font-mono text-slate-300 min-w-[3rem] text-center">{zoomLevel}%</span>
                <button
                  onClick={() => setZoomLevel(Math.min(150, zoomLevel + 15))}
                  title="Zoom In"
                  className="p-1 hover:text-white hover:bg-white/10 rounded"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setZoomLevel(100)}
                  className="text-[10px] uppercase font-bold px-1.5 py-0.5 bg-white/5 hover:bg-white/15 rounded text-slate-300"
                >
                  Reset
                </button>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/knowledge-hub/faq/ftth/browsing-slow"
                  className="px-2.5 py-1 bg-purple-400 hover:bg-purple-300 text-slate-900 font-black rounded text-[11px] flex items-center gap-1 shadow-xs transition-colors"
                >
                  <span>Guided Triage Mode</span>
                </Link>

                <button
                  onClick={() => {
                    const ttText = `Target Work Group: Default Work Group\nService Category: Voice Service\nFault Complaint: Voice Line Noisy / Severe Static with FTTH Slowness\nAction Required: Technician dispatch to inspect fiber drop cable, optical splitter, and VoIP telephone port impedance.`;
                    navigator.clipboard.writeText(ttText);
                    setTtCopied(true);
                    setTimeout(() => setTtCopied(false), 2500);
                  }}
                  className="px-2 py-1 bg-emerald-600/90 hover:bg-emerald-600 text-white rounded text-[11px] font-bold flex items-center gap-1 shadow-xs transition-colors"
                >
                  {ttCopied ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3" />}
                  <span>Copy TT Voice Default WG</span>
                </button>

                <button
                  onClick={() => {
                    const ttText = `Target Work Group: CEN-CSC-TECH\nService Category: BB Service (Broadband)\nFault Complaint: Browsing Slow (Usage Limit Unexhausted / Speed Degradation)\nAction Taken: Customer guided to power cycle/restart ONT router. Data remaining in VAS Portal. Speed below SLA.\nAction Required: Technical investigation for gateway peering congestion, BNG session re-authentication, or IP profile speed restoration.`;
                    navigator.clipboard.writeText(ttText);
                    setTtCopied(true);
                    setTimeout(() => setTtCopied(false), 2500);
                  }}
                  className="px-2 py-1 bg-blue-600/90 hover:bg-blue-600 text-white rounded text-[11px] font-bold flex items-center gap-1 shadow-xs transition-colors"
                >
                  {ttCopied ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3" />}
                  <span>Copy TT CEN-CSC-TECH</span>
                </button>
              </div>
            </div>

            {/* Main Viewer Body with Centered White Page */}
            <div className="flex-1 bg-[#3c4043] overflow-y-auto p-4 sm:p-8 flex justify-center items-start">
              <div
                style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
                className="bg-white text-black shadow-2xl rounded-sm p-6 sm:p-10 max-w-[960px] w-full transition-transform duration-150 border border-slate-300 my-auto"
              >
                
                {/* SVG High-Fidelity Flowchart matching 5. Browzing slow.pdf */}
                <svg
                  viewBox="0 0 920 640"
                  className="w-full h-auto select-none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <marker
                      id="arrowSlowModal"
                      viewBox="0 0 10 10"
                      refX="6"
                      refY="5"
                      markerWidth="6"
                      markerHeight="6"
                      orient="auto-start-reverse"
                    >
                      <path d="M 0 1 L 10 5 L 0 9 z" fill="#ff0000" />
                    </marker>
                  </defs>

                  {/* Flowchart Title */}
                  <text
                    x="460"
                    y="32"
                    textAnchor="middle"
                    fontWeight="900"
                    fontSize="22"
                    fontFamily="Arial, Helvetica, sans-serif"
                    fill="#000000"
                  >
                    Browsing Slow
                  </text>

                  {/* ROOT NODE: Check whether the connection status is OGB -DC */}
                  <g>
                    <rect
                      x="390"
                      y="54"
                      width="140"
                      height="54"
                      rx="27"
                      ry="27"
                      fill="#88c848"
                      stroke="#000000"
                      strokeWidth="2"
                    />
                    <text x="460" y="70" textAnchor="middle" fontWeight="bold" fontSize="9.5" fontFamily="Arial, Helvetica, sans-serif" fill="#000000">
                      Check whether the
                    </text>
                    <text x="460" y="82" textAnchor="middle" fontWeight="bold" fontSize="9.5" fontFamily="Arial, Helvetica, sans-serif" fill="#000000">
                      connection status is
                    </text>
                    <text x="460" y="96" textAnchor="middle" fontWeight="900" fontSize="10.5" fontFamily="Arial, Helvetica, sans-serif" fill="#000000">
                      OGB -DC
                    </text>
                  </g>

                  {/* Root Node: Left Branch (Yes) -> Inform Customer to settle the Outstanding bill */}
                  <path d="M 390 81 L 285 81" stroke="#ff0000" strokeWidth="2" markerEnd="url(#arrowSlowModal)" fill="none" />
                  <text x="337" y="74" textAnchor="middle" fontWeight="bold" fontSize="11" fill="#ff0000" fontFamily="Arial, Helvetica, sans-serif">
                    Yes
                  </text>

                  {/* Node: Inform Customer to settle the Outstanding bill */}
                  <g>
                    <rect
                      x="130"
                      y="58"
                      width="155"
                      height="46"
                      rx="23"
                      ry="23"
                      fill="#88c848"
                      stroke="#000000"
                      strokeWidth="2"
                    />
                    <text x="207" y="77" textAnchor="middle" fontWeight="bold" fontSize="9.5" fontFamily="Arial, Helvetica, sans-serif" fill="#000000">
                      Inform Customer to settle the
                    </text>
                    <text x="207" y="91" textAnchor="middle" fontWeight="900" fontSize="10.5" fontFamily="Arial, Helvetica, sans-serif" fill="#000000">
                      Outstanding bill
                    </text>
                  </g>

                  {/* Root Node: Down Branch (No) -> Check whether the voice line is noisy */}
                  <path d="M 460 108 L 460 148" stroke="#ff0000" strokeWidth="2" markerEnd="url(#arrowSlowModal)" fill="none" />
                  <text x="475" y="130" textAnchor="start" fontWeight="bold" fontSize="11" fill="#ff0000" fontFamily="Arial, Helvetica, sans-serif">
                    No
                  </text>

                  {/* NODE 2: Check whether the voice line is noisy */}
                  <g>
                    <rect
                      x="395"
                      y="148"
                      width="130"
                      height="46"
                      rx="23"
                      ry="23"
                      fill="#ffffb0"
                      stroke="#000000"
                      strokeWidth="1.8"
                    />
                    <text x="460" y="167" textAnchor="middle" fontWeight="bold" fontSize="9.5" fontFamily="Arial, Helvetica, sans-serif" fill="#000000">
                      Check whether the
                    </text>
                    <text x="460" y="181" textAnchor="middle" fontWeight="bold" fontSize="9.5" fontFamily="Arial, Helvetica, sans-serif" fill="#000000">
                      voice line is noisy
                    </text>
                  </g>

                  {/* Node 2: Right Branch (Yes) -> Create a TT under Voice Service to Default Work Group with remarks */}
                  <path d="M 525 171 L 620 171" stroke="#ff0000" strokeWidth="2" markerEnd="url(#arrowSlowModal)" fill="none" />
                  <text x="572" y="163" textAnchor="middle" fontWeight="bold" fontSize="11" fill="#ff0000" fontFamily="Arial, Helvetica, sans-serif">
                    Yes
                  </text>

                  {/* Node: Create a TT under Voice Service to Default Work Group with remarks */}
                  <g>
                    <rect
                      x="620"
                      y="140"
                      width="160"
                      height="62"
                      rx="25"
                      ry="25"
                      fill="#88c848"
                      stroke="#000000"
                      strokeWidth="2"
                    />
                    <text x="700" y="158" textAnchor="middle" fontWeight="bold" fontSize="9" fontFamily="Arial, Helvetica, sans-serif" fill="#000000">
                      Create a TT <tspan fontWeight="900">under Voice</tspan>
                    </text>
                    <text x="700" y="171" textAnchor="middle" fontWeight="900" fontSize="10" fontFamily="Arial, Helvetica, sans-serif" fill="#000000">
                      Service to Default Work
                    </text>
                    <text x="700" y="184" textAnchor="middle" fontWeight="bold" fontSize="9" fontFamily="Arial, Helvetica, sans-serif" fill="#000000">
                      <tspan fontWeight="900">Group</tspan> with remarks
                    </text>
                  </g>

                  {/* Node 2: Down Branch (No) -> Check Usage Limit is exceeded by customer */}
                  <path d="M 460 194 L 460 234" stroke="#ff0000" strokeWidth="2" markerEnd="url(#arrowSlowModal)" fill="none" />
                  <text x="475" y="216" textAnchor="start" fontWeight="bold" fontSize="11" fill="#ff0000" fontFamily="Arial, Helvetica, sans-serif">
                    No
                  </text>

                  {/* NODE 3: Check Usage Limit is exceeded by customer */}
                  <g>
                    <rect
                      x="395"
                      y="234"
                      width="130"
                      height="46"
                      fill="#88c848"
                      stroke="#000000"
                      strokeWidth="1.8"
                    />
                    <text x="460" y="249" textAnchor="middle" fontWeight="bold" fontSize="9" fontFamily="Arial, Helvetica, sans-serif" fill="#000000">
                      Check Usage Limit is
                    </text>
                    <text x="460" y="261" textAnchor="middle" fontWeight="bold" fontSize="9" fontFamily="Arial, Helvetica, sans-serif" fill="#000000">
                      exceeded by
                    </text>
                    <text x="460" y="272" textAnchor="middle" fontWeight="bold" fontSize="9" fontFamily="Arial, Helvetica, sans-serif" fill="#000000">
                      customer
                    </text>
                  </g>

                  {/* Node 3: Left Branch (No) -> Instruct customer to restart the ONT and create a TT to CEN-CSC-TECH work group */}
                  <path d="M 395 257 L 310 257" stroke="#ff0000" strokeWidth="2" markerEnd="url(#arrowSlowModal)" fill="none" />
                  <text x="350" y="250" textAnchor="middle" fontWeight="bold" fontSize="11" fill="#ff0000" fontFamily="Arial, Helvetica, sans-serif">
                    No
                  </text>

                  {/* Node: Instruct customer to restart the ONT and create a TT to CEN-CSC-TECH work group */}
                  <g>
                    <rect
                      x="140"
                      y="226"
                      width="170"
                      height="62"
                      rx="25"
                      ry="25"
                      fill="#88c848"
                      stroke="#000000"
                      strokeWidth="2"
                    />
                    <text x="225" y="244" textAnchor="middle" fontWeight="bold" fontSize="8.5" fontFamily="Arial, Helvetica, sans-serif" fill="#000000">
                      Instruct customer to restart the
                    </text>
                    <text x="225" y="256" textAnchor="middle" fontWeight="bold" fontSize="8.5" fontFamily="Arial, Helvetica, sans-serif" fill="#000000">
                      ONT and create a TT to
                    </text>
                    <text x="225" y="270" textAnchor="middle" fontWeight="900" fontSize="10" fontFamily="Arial, Helvetica, sans-serif" fill="#000000">
                      CEN-CSC-TECH <tspan fontWeight="bold" fontSize="8.5">work group</tspan>
                    </text>
                  </g>

                  {/* Node 3: Down Branch (Yes) -> Ask if customer wishes to add Extra GB */}
                  <path d="M 460 280 L 460 324" stroke="#ff0000" strokeWidth="2" markerEnd="url(#arrowSlowModal)" fill="none" />
                  <text x="475" y="304" textAnchor="start" fontWeight="bold" fontSize="11" fill="#ff0000" fontFamily="Arial, Helvetica, sans-serif">
                    Yes
                  </text>

                  {/* NODE 4: Ask if customer wishes to add Extra GB */}
                  <g>
                    <rect
                      x="395"
                      y="324"
                      width="130"
                      height="46"
                      fill="#ffffb0"
                      stroke="#000000"
                      strokeWidth="1.8"
                    />
                    <text x="460" y="342" textAnchor="middle" fontWeight="bold" fontSize="9" fontFamily="Arial, Helvetica, sans-serif" fill="#000000">
                      Ask if customer wishes
                    </text>
                    <text x="460" y="356" textAnchor="middle" fontWeight="bold" fontSize="9" fontFamily="Arial, Helvetica, sans-serif" fill="#000000">
                      to add Extra GB
                    </text>
                  </g>

                  {/* Node 4: Right Branch (No) -> End */}
                  <path d="M 525 347 L 640 347" stroke="#ff0000" strokeWidth="2" markerEnd="url(#arrowSlowModal)" fill="none" />
                  <text x="580" y="340" textAnchor="middle" fontWeight="bold" fontSize="11" fill="#ff0000" fontFamily="Arial, Helvetica, sans-serif">
                    No
                  </text>

                  {/* GREEN END NODE */}
                  <g>
                    <rect
                      x="640"
                      y="330"
                      width="75"
                      height="34"
                      rx="17"
                      ry="17"
                      fill="#88c848"
                      stroke="#000000"
                      strokeWidth="1.8"
                    />
                    <text x="677" y="351" textAnchor="middle" fontWeight="bold" fontSize="11" fontFamily="Arial, Helvetica, sans-serif" fill="#000000">
                      End
                    </text>
                  </g>

                  {/* Node 4: Down Branch (Yes) -> Check extra GB field in I HUB/CRM */}
                  <path d="M 460 370 L 460 410" stroke="#ff0000" strokeWidth="2" markerEnd="url(#arrowSlowModal)" fill="none" />
                  <text x="475" y="392" textAnchor="start" fontWeight="bold" fontSize="11" fill="#ff0000" fontFamily="Arial, Helvetica, sans-serif">
                    Yes
                  </text>

                  {/* NODE 5: Check extra GB field in I HUB/CRM */}
                  <g>
                    <rect
                      x="395"
                      y="410"
                      width="130"
                      height="46"
                      fill="#88c848"
                      stroke="#000000"
                      strokeWidth="1.8"
                    />
                    <text x="460" y="429" textAnchor="middle" fontWeight="bold" fontSize="9" fontFamily="Arial, Helvetica, sans-serif" fill="#000000">
                      Check extra GB field
                    </text>
                    <text x="460" y="443" textAnchor="middle" fontWeight="bold" fontSize="9" fontFamily="Arial, Helvetica, sans-serif" fill="#000000">
                      in I HUB/CRM
                    </text>
                  </g>

                  {/* Node 5: Left Branch (Yes) -> Follow the QED instructions and Add Extra GB */}
                  <path d="M 395 433 L 295 433" stroke="#ff0000" strokeWidth="2" markerEnd="url(#arrowSlowModal)" fill="none" />
                  <text x="345" y="425" textAnchor="middle" fontWeight="bold" fontSize="11" fill="#ff0000" fontFamily="Arial, Helvetica, sans-serif">
                    Yes
                  </text>

                  {/* Node: Follow the QED instructions and Add Extra GB */}
                  <g>
                    <rect
                      x="145"
                      y="410"
                      width="150"
                      height="46"
                      rx="23"
                      ry="23"
                      fill="#88c848"
                      stroke="#000000"
                      strokeWidth="2"
                    />
                    <text x="220" y="429" textAnchor="middle" fontWeight="bold" fontSize="9" fontFamily="Arial, Helvetica, sans-serif" fill="#000000">
                      Follow the QED instructions
                    </text>
                    <text x="220" y="443" textAnchor="middle" fontWeight="900" fontSize="9.5" fontFamily="Arial, Helvetica, sans-serif" fill="#000000">
                      and Add Extra GB
                    </text>
                  </g>

                  {/* Node 5: Right Branch (No) -> Don't add extra GB through 1212 but instruct customer... */}
                  <path d="M 525 433 L 645 433" stroke="#ff0000" strokeWidth="2" markerEnd="url(#arrowSlowModal)" fill="none" />
                  <text x="585" y="425" textAnchor="middle" fontWeight="bold" fontSize="11" fill="#ff0000" fontFamily="Arial, Helvetica, sans-serif">
                    No
                  </text>

                  {/* Node: Don't add extra GB through 1212... */}
                  <g>
                    <rect
                      x="645"
                      y="404"
                      width="235"
                      height="58"
                      rx="29"
                      ry="29"
                      fill="#ffffb0"
                      stroke="#000000"
                      strokeWidth="1.8"
                    />
                    <text x="762" y="423" textAnchor="middle" fontWeight="bold" fontSize="8" fontFamily="Arial, Helvetica, sans-serif" fill="#000000">
                      Don’t add extra GB through 1212 but instruct
                    </text>
                    <text x="762" y="435" textAnchor="middle" fontWeight="bold" fontSize="8" fontFamily="Arial, Helvetica, sans-serif" fill="#000000">
                      customer add extra GBs by using My SLT App,
                    </text>
                    <text x="762" y="447" textAnchor="middle" fontWeight="900" fontSize="8.5" fontFamily="Arial, Helvetica, sans-serif" fill="#000000">
                      My SLT portal &amp; 0112121212 IVR
                    </text>
                  </g>

                  {/* Purple Callout Note */}
                  <g>
                    <path
                      d="M 50 490 C 30 490, 30 610, 50 610 L 160 610 C 180 610, 155 550, 180 490 Z"
                      fill="#f5e8ff"
                      stroke="#800080"
                      strokeWidth="2"
                    />
                    <text x="90" y="515" fontWeight="bold" fontSize="9.5" fill="#ff0000" fontFamily="Arial, Helvetica, sans-serif">
                      Note:
                    </text>
                    <text x="90" y="530" fontWeight="bold" fontSize="8.5" fill="#000000" fontFamily="Arial, Helvetica, sans-serif">
                      Please follow QED
                    </text>
                    <text x="90" y="543" fontWeight="bold" fontSize="8.5" fill="#000000" fontFamily="Arial, Helvetica, sans-serif">
                      for Process of Adding
                    </text>
                    <text x="90" y="556" fontWeight="bold" fontSize="8.5" fill="#000000" fontFamily="Arial, Helvetica, sans-serif">
                      Extra GB for
                    </text>
                    <text x="90" y="569" fontWeight="bold" fontSize="8.5" fill="#000000" fontFamily="Arial, Helvetica, sans-serif">
                      Broadband
                    </text>
                    <text x="90" y="582" fontWeight="bold" fontSize="8.5" fill="#000000" fontFamily="Arial, Helvetica, sans-serif">
                      Customers
                    </text>
                  </g>

                </svg>

              </div>
            </div>

          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
