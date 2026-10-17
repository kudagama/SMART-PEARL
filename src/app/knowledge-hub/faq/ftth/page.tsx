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
        type: 'modal',
        content: {
          title: 'General Questions FTTH',
          guidance: 'Overview of Fibre To The Home (FTTH) architecture, GPON transmission principles, maximum bandwidth capabilities (up to 1 Gbps), and standard CPE warranty terms.',
          sop: '1. Verify optical line active status via LDAP/GB portal.\n2. Confirm customer package type (Home, Pro, Gaming, Enterprise).\n3. Check optical attenuation levels before answering customer inquiries.'
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
        type: 'modal',
        content: {
          title: 'PON / LOS Indicator Diagnostic Matrix',
          ruleCode: 'RULE_LOS_RED / RULE_FIBER_VOICE_LINE_FAULT',
          targetGroup: 'AREA-MTCE / MDF',
          guidance: 'CRITICAL ROUTING MATRIX:\n- LOS RED Blinking / PON OFF: Optical transmission fault / cable cut -> Dispatch DIRECT_TT to AREA-MTCE.\n- PON STEADY ON (Voice dead/no dial tone): Optical signal is healthy. SIP port or exchange issue -> Dispatch DIRECT_TT to MDF (Main Distribution Frame).',
          sop: 'Mandatory Pre-checks: Verify LDAP account status and GB Portal optical power (threshold: Rx between -8 dBm and -27 dBm).'
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
        linkText: 'PDF',
        type: 'pdf',
        content: {
          title: 'Wi-Fi Not Working (PON Steady) - SOP',
          guidance: 'When PON is steady, internet connectivity to the premises is functional. Guide customer to verify WLAN LED status on ONT.',
          sop: '1. Check if WLAN/Wi-Fi LED on ONT is solid green.\n2. If OFF, press Wi-Fi push button on side of ONT for 3 seconds.\n3. Verify SSID broadcast on mobile device.\n4. If 5GHz band not showing, advise customer device may only support 2.4GHz.\n5. If still failing, access http://192.168.1.1 to verify WLAN Enable checkbox.'
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
        linkText: 'PDF',
        type: 'pdf',
        content: {
          title: 'Browsing Slow Standard Troubleshooting',
          ruleCode: 'RULE_UNLIMITED_SLOWNESS',
          targetGroup: 'AREA-MTCE',
          guidance: 'Condition: Speed < 40 Mbps on unlimited package AND Low Pay Bill verified. If speed >= 40 Mbps, DO NOT dispatch Trouble Ticket.',
          sop: '1. Instruct customer to run Ookla Speedtest connected via LAN cable.\n2. Check for active background downloads or torrents.\n3. Check Low Pay Bill status on billing system.\n4. If speed < 40 Mbps, dispatch Trouble Ticket to AREA-MTCE.'
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
                      {row.actions.map((act, aIdx) => {
                        const isOntFlowchart = act.type === 'ont_pdf_flowchart' || act.text.includes('ONT not working');
                        return (
                          <div key={aIdx} className="space-y-1">
                            <div className="flex items-baseline flex-wrap gap-1.5 leading-relaxed">
                              <span
                                onClick={() => {
                                  if (isOntFlowchart) setShowOntPdfModal(true);
                                }}
                                className={`font-semibold text-slate-800 text-xs ${
                                  isOntFlowchart
                                    ? 'cursor-pointer hover:text-[#005696] hover:underline font-bold text-[#005696]'
                                    : ''
                                }`}
                              >
                                {act.text}
                              </span>

                              {act.redNote && (
                                <span className="text-red-600 font-bold text-xs">
                                  {act.redNote}
                                </span>
                              )}

                              {act.linkText && (
                                <button
                                  onClick={() => {
                                    if (isOntFlowchart) {
                                      setShowOntPdfModal(true);
                                    } else {
                                      setActiveModalData(act.content);
                                    }
                                  }}
                                  className="font-bold text-[#005696] hover:text-[#003865] hover:underline cursor-pointer ml-1 inline-flex items-center gap-0.5"
                                >
                                  ( {act.linkText} )
                                </button>
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

    </div>
  );
}
