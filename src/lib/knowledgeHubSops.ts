/**
 * Official SLT Knowledge Hub SOPs & Live Resolution Decision Trees
 * 
 * Provides step-by-step troubleshooting checklists, decision outcomes,
 * and Trouble Ticket templates directly within AI Copilot chat feeds.
 */

export interface SopStep {
  step: number;
  title: string;
  action: string;
  details?: string[];
  is_decision?: boolean;
  outcome_group?: string;
  badge?: string;
}

export interface KnowledgeHubSop {
  id: string;
  title: string;
  url: string;
  target_group: string;
  rule_code: string;
  badge: string;
  summary: string;
  key_decision: string;
  steps: SopStep[];
  tt_template: string;
}

export const KNOWLEDGE_HUB_SOPS: Record<string, KnowledgeHubSop> = {
  PON_LOS_INDICATOR: {
    id: 'pon-los-indicator',
    title: 'PON / LOS Indicator Decision Flowchart (Red, Off, Blinking, Steady)',
    url: '/knowledge-hub/faq/ftth/pon-los-indicator',
    target_group: 'AREA-CPE-MTCE / Default Work Group',
    rule_code: 'RULE_LOS_RED / RULE_FIBER_VOICE_LINE_FAULT',
    badge: 'Interactive SOP',
    summary: 'Optical transmission & drop fiber diagnosis. RED/OFF/BLINKING indicates physical cable cut. STEADY indicates optical carrier locked with CPE/proxy failure.',
    key_decision: '🔴 LOS Red / Blinking or PON Off: Physical optical fiber severed or attenuated (Rx < -27 dBm). Immediately create Trouble Ticket to AREA-CPE-MTCE (or Default WG if customer away). 🟢 PON Steady: Optical link OK -> Perform ONT restart, check alternative browser, check private proxy.',
    steps: [
      {
        step: 1,
        title: 'Check Voice Service Subscription',
        action: 'Inquire whether customer is currently subscribed to and using SLT Voice landline service on this fiber line.',
        details: [
          '• If Voice service is active and line is dead, service category is Voice/BB.',
          '• Note: If customer is NOT available at premises to check indicators, create TT for Default Work Group.'
        ]
      },
      {
        step: 2,
        title: 'Inspect Optical LEDs on ONT Front Panel',
        action: 'Observe optical indicators (PON & LOS LEDs):',
        details: [
          '🔴 LOS Blinking RED or PON OFF: Physical optical loss / fiber cut (Rx optical power below -27 dBm).',
          '🟢 PON STEADY ON (LOS OFF): Optical signal is healthy and locked to OLT carrier.'
        ]
      },
      {
        step: 3,
        title: 'Action for PON / LOS Blinking, RED or OFF',
        action: 'Do NOT perform browser or proxy resets. Create Trouble Ticket directly to AREA-CPE-MTCE under Voice/BB Service.',
        details: [
          '• Mandatory: Check optical Rx power in GB Portal and record in TT description.',
          '• If customer is away from premises, route TT to Default Work Group.'
        ],
        is_decision: true,
        outcome_group: 'AREA-CPE-MTCE'
      },
      {
        step: 4,
        title: 'Action for PON STEADY ON (Internet Unreachable)',
        action: 'Guide customer through rapid CPE triage:',
        details: [
          '1. Instruct customer to power-cycle/restart the ONT router.',
          '2. Try browsing on another web browser (Chrome / Edge / Firefox).',
          '3. Test on another device or connect directly using LAN cable.',
          '4. Check Private Proxy in OS settings (Switch OFF if active).',
          '5. If proxy is OFF and issue persists -> Create TT to AREA-CPE-MTCE.'
        ],
        is_decision: true,
        outcome_group: 'AREA-CPE-MTCE'
      }
    ],
    tt_template: `Target Work Group: AREA-CPE-MTCE
Service Category: BB / Voice Service
Fault Complaint: Optical Loss (PON/LOS Indicator Blinking or Red)
Diagnostic Log:
• Optical Link: Rx < -27 dBm / LOS Blinking
• Customer Location: Premises verified
• Voice Service: Subscribed / Fiber line down
Action Required: Technician dispatch for drop wire inspection and optical power restoration.`
  },

  WIFI_NOT_WORKING: {
    id: 'wifi-not-working',
    title: 'Wi-Fi Not Working (PON Steady) - Decision SOP',
    url: '/knowledge-hub/faq/ftth/wifi-not-working',
    target_group: 'AREA-CPE-MTCE / CEN-CSC-TECH',
    rule_code: 'RULE_STB_ONT_ROUTER_FAULTY',
    badge: 'Interactive SOP',
    summary: 'WLAN indicator dead -> Toggle physical Wi-Fi button. If still OFF -> AREA-CPE-MTCE. WLAN indicator ON & SSID verified -> CEN-CSC-TECH. Low coverage -> AREA-CPE-MTCE.',
    key_decision: 'WLAN LED OFF: Press Wi-Fi button on ONT (hold 3-5s). If still OFF -> AREA-CPE-MTCE. WLAN LED ON: Client wireless verified & Wi-Fi config OK -> CEN-CSC-TECH. Low coverage -> Record distance & dispatch AREA-CPE-MTCE.',
    steps: [
      {
        step: 1,
        title: 'Check WLAN Indicator LED on ONT',
        action: 'Inspect WLAN LED on the ONT router front panel (OFF vs ON).'
      },
      {
        step: 2,
        title: 'If WLAN LED is OFF',
        action: 'Instruct customer to press and hold the physical Wi-Fi button on the ONT for 3-5 seconds.',
        details: [
          '• If WLAN LED turns ON -> Retest Wi-Fi connection.',
          '• If WLAN LED remains OFF -> Create TT to AREA-CPE-MTCE under BB Service (CPE hardware module failure).'
        ],
        is_decision: true,
        outcome_group: 'AREA-CPE-MTCE'
      },
      {
        step: 3,
        title: 'If WLAN LED is ON (Connected but No Internet)',
        action: 'Verify device wireless toggle is ON -> Test internet throughput.',
        details: [
          '• If internet dead -> Verify SSID & WPA2 password config in 192.168.1.1.',
          '• If config is correct -> Create TT to CEN-CSC-TECH under BB Service.'
        ],
        is_decision: true,
        outcome_group: 'CEN-CSC-TECH'
      },
      {
        step: 4,
        title: 'If Wi-Fi Coverage is Low / Signal Drops',
        action: 'Ask distance between ONT and device. Add distance in TT description and forward to AREA-CPE-MTCE under BB Service.',
        is_decision: true,
        outcome_group: 'AREA-CPE-MTCE'
      }
    ],
    tt_template: `Target Work Group: CEN-CSC-TECH
Service Category: BB Service
Fault Complaint: Wi-Fi Connected but No Internet (PON Steady)
Diagnostic Log:
• WLAN LED: ON (SSID broadcast active)
• Client Wi-Fi: Enabled & connected
• Configuration: SSID & WPA2 verified
Action Required: Technical investigation for gateway peering congestion or BNG session re-authentication.`
  },

  BROWSING_SLOW: {
    id: 'browsing-slow',
    title: 'Browsing Slow - Decision Flowchart SOP',
    url: '/knowledge-hub/faq/ftth/browsing-slow',
    target_group: 'Default WG (Voice) / CEN-CSC-TECH / QED Extra GB',
    rule_code: 'RULE_UNLIMITED_SLOWNESS',
    badge: 'Interactive SOP',
    summary: 'Check OGB-DC -> Settle bill. Voice line noisy -> TT under Voice to Default WG. Quota unexhausted -> Restart ONT & TT to CEN-CSC-TECH. Quota exceeded -> Add Extra GB via QED or MySLT Self-care.',
    key_decision: 'OGB-DC: Settle bill (End). Voice noisy: TT under Voice to Default WG with remarks. Quota unexhausted: Restart ONT & TT to CEN-CSC-TECH. Quota exceeded: Add Extra GB via QED or self-care via MySLT App/Portal/0112121212.',
    steps: [
      {
        step: 1,
        title: 'Check Connection Status in I-Hub/CRM',
        action: 'Query connection status in I-Hub/LDAP.',
        details: [
          '• If Status is OGB-DC -> Inform customer to settle Outstanding Bill (END).',
          '• If Active -> Proceed to Step 2.'
        ],
        is_decision: true,
        outcome_group: 'CUSTOMER_CARE'
      },
      {
        step: 2,
        title: 'Check Voice Line Quality',
        action: 'Inquire if landline phone has background static, humming or crackling noise.',
        details: [
          '• If Voice line noisy -> Create TT under Voice Service to Default Work Group with remarks (END).',
          '• If Clear -> Proceed to Step 3.'
        ],
        is_decision: true,
        outcome_group: 'Default Work Group'
      },
      {
        step: 3,
        title: 'Check Usage Limit (Monthly Quota)',
        action: 'Verify data quota in VAS Portal:',
        details: [
          '• Quota NOT exceeded: Instruct customer to restart ONT. If slowness persists, create TT to CEN-CSC-TECH work group under BB Service.',
          '• Quota exceeded: Inquire if customer wishes to add Extra GB.'
        ],
        is_decision: true,
        outcome_group: 'CEN-CSC-TECH'
      },
      {
        step: 4,
        title: 'Extra GB Top-Up Options',
        action: 'If customer wishes to add Extra GB, check extra GB field in I-HUB/CRM:',
        details: [
          '• Field present: Follow QED instructions and Add Extra GB.',
          '• Field NOT present: Do NOT add via 1212. Instruct customer to add extra GB via My SLT App, My SLT Portal or 0112 121 212 IVR.'
        ],
        is_decision: true,
        outcome_group: 'QED / SELF-CARE'
      }
    ],
    tt_template: `Target Work Group: CEN-CSC-TECH
Service Category: BB Service
Fault Complaint: Browsing Slow (Usage Limit Unexhausted / Speed Degradation)
Diagnostic Log:
• Connection Status: Active in I-Hub (Not OGB-DC)
• Voice Quality: Clear (No line noise)
• Quota: Verified in VAS Portal -> Data remaining
• Action Taken: Guided customer to power cycle ONT router
Action Required: Technical investigation for gateway peering congestion or BNG session re-authentication.`
  },

  ONT_NOT_WORKING: {
    id: 'ont-not-working',
    title: 'ONT Not Working - Hardware Decision SOP',
    url: '/knowledge-hub/faq/ftth/ont-not-working',
    target_group: 'AREA-CPE-MTCE',
    rule_code: 'RULE_STB_ONT_ROUTER_FAULTY',
    badge: 'Interactive SOP',
    summary: 'Hardware or power failure on customer premises ONT. Check power indicator -> OFF (check power switch & adapter) / ON (restart). If unresolved, dispatch TT to AREA-CPE-MTCE.',
    key_decision: 'Power LED OFF: Press power button, verify 12V charger adapter. Power LED ON: Power cycle restart (30s). Unresolved: Dispatch TT to AREA-CPE-MTCE.',
    steps: [
      {
        step: 1,
        title: 'Check Power Indicator LED on ONT',
        action: 'Check if Power LED on ONT is completely OFF or ON.'
      },
      {
        step: 2,
        title: 'If Power LED is OFF',
        action: 'Press physical Power ON/OFF button on ONT rear panel. Verify 12V charger adapter and wall outlet.',
        details: [
          '• Check if charger pin is plugged firmly into router.',
          '• Test wall socket with another electrical appliance.',
          '• If device remains completely dead -> Create TT to AREA-CPE-MTCE.'
        ],
        is_decision: true,
        outcome_group: 'AREA-CPE-MTCE'
      },
      {
        step: 3,
        title: 'If Power LED is ON but Router Faulty',
        action: 'Perform power-cycle restart (unplug power pin, wait 30 seconds, plug back in).',
        details: [
          '• If LEDs remain abnormal, blinking erratically, or device non-responsive -> Create TT to AREA-CPE-MTCE.'
        ],
        is_decision: true,
        outcome_group: 'AREA-CPE-MTCE'
      }
    ],
    tt_template: `Target Work Group: AREA-CPE-MTCE
Service Category: BB Service
Fault Complaint: ONT Router Hardware Failure / Dead
Diagnostic Log:
• Power Indicator: Verified OFF / Dead adapter
• Troubleshooting Taken: Verified power button, tested wall outlet, 30s power cycle
Action Required: Technician dispatch for CPE router replacement.`
  },

  GENERAL_QUESTIONS: {
    id: 'general-questions',
    title: 'General Questions FTTH - Connection Status & Quota SOP',
    url: '/knowledge-hub/faq/ftth/general-questions',
    target_group: 'CEN-CSC-DATA / Customer Care',
    rule_code: 'RULE_UNLIMITED_SLOWNESS',
    badge: 'Interactive SOP',
    summary: 'Check Connection Status in I-Hub/LDAP -> If Not Active, settle bill (END). If Active, check VAS Portal GB availability -> If throttled, add Extra GB or settle bill. If GBs available, route to ONT Indicators.',
    key_decision: 'Status Not Active: Settle bill (End). Active: Check VAS Portal GB availability. Throttled due to GB: Add Extra GB. Throttled due to bill: Settle bill. GB available: Route to ONT Indicators.',
    steps: [
      {
        step: 1,
        title: 'Query Connection Status in I-Hub/LDAP',
        action: 'Check account status in I-Hub/LDAP.',
        details: [
          '• If Status is Not Active -> Inform customer to settle outstanding bill (END).',
          '• If Active -> Proceed to Step 2.'
        ],
        is_decision: true,
        outcome_group: 'CUSTOMER_CARE'
      },
      {
        step: 2,
        title: 'Check VAS Portal Data Availability',
        action: 'Verify if speed throttled due to monthly GB exhausted or bill arrears.',
        details: [
          '• If throttled due to GB -> Offer Extra GB booster.',
          '• If throttled due to bill arrears -> Settle bill.'
        ]
      },
      {
        step: 3,
        title: 'Profile Synchronization Check',
        action: 'Ensure LDAP package matches VAS portal speed profile.'
      },
      {
        step: 4,
        title: 'Route to Optical Indicators',
        action: 'If quota is available -> Follow FAQ on ONT / PON Indicators.'
      }
    ],
    tt_template: `Target Work Group: CEN-CSC-DATA
Service Category: BB Service
Fault Complaint: General FTTH Inactivity / Quota Query
Diagnostic Log:
• LDAP Status: Checked
• VAS Portal Quota: Checked
Action Required: Account profile verification or billing ledger reconciliation.`
  }
};

/**
 * Resolves the relevant Knowledge Hub SOP for any voice transcript or query text.
 */
export function matchKnowledgeHubSop(text: string): KnowledgeHubSop | null {
  if (!text) return null;
  const lower = text.toLowerCase();

  // 1. Wi-Fi Faults
  if (
    lower.includes('wifi') ||
    lower.includes('wi-fi') ||
    lower.includes('wlan')
  ) {
    return KNOWLEDGE_HUB_SOPS.WIFI_NOT_WORKING;
  }

  // 2. PON & LOS Indicator Faults (blinking, red, off, steady)
  if (
    (lower.includes('pon') && lower.includes('los')) ||
    lower.includes('pon indicator') ||
    lower.includes('los indicator') ||
    lower.includes('pon red') ||
    lower.includes('los red') ||
    lower.includes('pon blinking') ||
    lower.includes('los blinking') ||
    lower.includes('los blink') ||
    lower.includes('pon blink') ||
    lower.includes('pon steady') ||
    lower.includes('pon off') ||
    lower.includes('los off') ||
    lower.includes('red light') ||
    lower.includes('optical loss') ||
    lower.includes('fiber cut') ||
    lower.includes('proxy') ||
    (lower.includes('pon') && (lower.includes('light') || lower.includes('indicator') || lower.includes('led')))
  ) {
    return KNOWLEDGE_HUB_SOPS.PON_LOS_INDICATOR;
  }

  // 3. Browsing Slow
  if (
    lower.includes('browsing slow') ||
    lower.includes('browzing slow') ||
    lower.includes('browsing') ||
    lower.includes('speed slow') ||
    lower.includes('speed madi') ||
    lower.includes('ogb-dc') ||
    lower.includes('ogb dc') ||
    lower.includes('usage limit') ||
    lower.includes('extra gb') ||
    lower.includes('data iwarai') ||
    (lower.includes('voice') && lower.includes('noisy'))
  ) {
    return KNOWLEDGE_HUB_SOPS.BROWSING_SLOW;
  }

  // 4. ONT Not Working / Power Failure
  if (
    lower.includes('ont not working') ||
    lower.includes('ont wada na') ||
    lower.includes('ont dead') ||
    lower.includes('ont power') ||
    lower.includes('power indicator') ||
    (lower.includes('ont') && (lower.includes('off') || lower.includes('broken') || lower.includes('faulty') || lower.includes('dead')))
  ) {
    return KNOWLEDGE_HUB_SOPS.ONT_NOT_WORKING;
  }

  // 5. General Questions FTTH
  if (
    lower.includes('general question') ||
    lower.includes('connection status') ||
    lower.includes('i-hub') ||
    lower.includes('ihub') ||
    lower.includes('vas portal')
  ) {
    return KNOWLEDGE_HUB_SOPS.GENERAL_QUESTIONS;
  }

  return null;
}
