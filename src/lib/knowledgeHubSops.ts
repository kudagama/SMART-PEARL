/**
 * Official SLT Knowledge Hub SOPs & Live Resolution Decision Trees
 * 
 * Ultra-simplified, rapid-action troubleshooting checklists, decision rules,
 * and Trouble Ticket templates designed for call center agents to log complaints in seconds.
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
    title: 'PON / LOS Indicator (Red, Off, Blinking, Steady)',
    url: '/knowledge-hub/faq/ftth/pon-los-indicator',
    target_group: 'AREA-CPE-MTCE',
    rule_code: 'RULE_LOS_RED / RULE_FIBER_VOICE_LINE_FAULT',
    badge: 'Quick SOP',
    summary: 'Optical Cable Cut vs Carrier Locked Decision Tree.',
    key_decision: '🔴 LOS Red / Blinking or PON Off: Physical cable cut (Rx < -27 dBm) ➔ Direct TT to AREA-CPE-MTCE. (If customer away ➔ Default WG). 🟢 PON Steady: Optical link OK ➔ Quick restart ONT + Proxy OFF ➔ If fails ➔ TT to AREA-CPE-MTCE.',
    steps: [
      {
        step: 1,
        title: 'Voice Service & Location',
        action: 'Inquire if customer uses landline voice. (If customer away from home ➔ route TT to Default Work Group).'
      },
      {
        step: 2,
        title: 'Check PON & LOS Indicator LEDs',
        action: '🔴 Red / Blinking or PON OFF = Optical Fiber Cut | 🟢 Steady Green = Optical Link OK.'
      },
      {
        step: 3,
        title: 'If Red / Blinking (Optical Loss)',
        action: 'Do NOT reboot router! Record Rx power from GB Portal ➔ Create TT directly to AREA-CPE-MTCE under Voice/BB.',
        is_decision: true,
        outcome_group: 'AREA-CPE-MTCE'
      },
      {
        step: 4,
        title: 'If Steady Green (No Internet)',
        action: 'Quick ONT restart ➔ Check & disable Private Proxy in OS settings ➔ If unresolved ➔ TT to AREA-CPE-MTCE.',
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
• Action Taken: Direct TT dispatched for drop wire inspection`
  },

  WIFI_NOT_WORKING: {
    id: 'wifi-not-working',
    title: 'Wi-Fi Not Working (PON Steady)',
    url: '/knowledge-hub/faq/ftth/wifi-not-working',
    target_group: 'AREA-CPE-MTCE / CEN-CSC-TECH',
    rule_code: 'RULE_STB_ONT_ROUTER_FAULTY',
    badge: 'Quick SOP',
    summary: 'WLAN Radio Failure vs Gateway Peering SOP.',
    key_decision: '🔘 WLAN LED OFF: Press Wi-Fi button 5s. If still OFF ➔ TT to AREA-CPE-MTCE. 🟢 WLAN LED ON: Device connected but no internet ➔ TT to CEN-CSC-TECH. 📶 Low Coverage: Record distance in meters ➔ TT to AREA-CPE-MTCE.',
    steps: [
      {
        step: 1,
        title: 'Check WLAN LED Status',
        action: 'Check WLAN light on router front panel (OFF vs ON).'
      },
      {
        step: 2,
        title: 'If WLAN LED is OFF',
        action: 'Press & hold Wi-Fi button on ONT for 3-5s. If still OFF ➔ TT to AREA-CPE-MTCE (Hardware module dead).',
        is_decision: true,
        outcome_group: 'AREA-CPE-MTCE'
      },
      {
        step: 3,
        title: 'If WLAN LED is ON (No Internet)',
        action: 'Check SSID & WPA2 in 192.168.1.1. If config correct ➔ TT to CEN-CSC-TECH under BB Service.',
        is_decision: true,
        outcome_group: 'CEN-CSC-TECH'
      },
      {
        step: 4,
        title: 'If Wi-Fi Coverage is Low',
        action: 'Ask distance between router and client (meters) ➔ Record in TT ➔ Forward to AREA-CPE-MTCE.',
        is_decision: true,
        outcome_group: 'AREA-CPE-MTCE'
      }
    ],
    tt_template: `Target Work Group: CEN-CSC-TECH
Service Category: BB Service
Fault Complaint: Wi-Fi Connected but No Internet (PON Steady)
Diagnostic Log:
• WLAN LED: ON (SSID active)
• Client Wi-Fi: Connected & config verified
• Action Required: Gateway session re-authentication`
  },

  BROWSING_SLOW: {
    id: 'browsing-slow',
    title: 'Browsing Slow - Resolution SOP',
    url: '/knowledge-hub/faq/ftth/browsing-slow',
    target_group: 'CEN-CSC-TECH / QED Extra GB',
    rule_code: 'RULE_UNLIMITED_SLOWNESS',
    badge: 'Quick SOP',
    summary: 'Account Status, Line Quality & Quota Triage.',
    key_decision: '🚫 OGB-DC: Settle bill (End). 🔊 Voice Noisy: TT under Voice to Default WG. 📊 Quota Remaining: Restart ONT ➔ TT to CEN-CSC-TECH. ⚠️ Quota Exceeded: Add Extra GB via QED or MySLT Self-care.',
    steps: [
      {
        step: 1,
        title: 'Check I-Hub Account Status',
        action: 'If Status is OGB-DC ➔ Advise customer to settle outstanding bill (END). If Active ➔ proceed to Step 2.',
        is_decision: true,
        outcome_group: 'CUSTOMER_CARE'
      },
      {
        step: 2,
        title: 'Check Voice Line Noise',
        action: 'Ask if landline has static/noise. If noisy ➔ Create TT under Voice to Default Work Group (END).',
        is_decision: true,
        outcome_group: 'Default Work Group'
      },
      {
        step: 3,
        title: 'Check Data Quota in VAS Portal',
        action: 'If quota available ➔ Restart ONT. If still slow ➔ TT to CEN-CSC-TECH under BB Service.',
        is_decision: true,
        outcome_group: 'CEN-CSC-TECH'
      },
      {
        step: 4,
        title: 'If Quota Exceeded (Extra GB)',
        action: 'Add Extra GB via QED if eligible, or advise customer to activate via MySLT App / 0112 121 212 IVR.',
        is_decision: true,
        outcome_group: 'QED / SELF-CARE'
      }
    ],
    tt_template: `Target Work Group: CEN-CSC-TECH
Service Category: BB Service
Fault Complaint: Browsing Slow (Quota Available)
Diagnostic Log:
• I-Hub Status: Active
• Voice Quality: Clear
• VAS Quota: Data remaining
• Action Taken: ONT restart verified, speed degraded`
  },

  ONT_NOT_WORKING: {
    id: 'ont-not-working',
    title: 'ONT Not Working - Hardware Power SOP',
    url: '/knowledge-hub/faq/ftth/ont-not-working',
    target_group: 'AREA-CPE-MTCE',
    rule_code: 'RULE_STB_ONT_ROUTER_FAULTY',
    badge: 'Quick SOP',
    summary: 'Hardware Power Failure & Adapter Triage.',
    key_decision: '⚫ Power LED OFF: Check power button & 12V adapter. If dead ➔ TT to AREA-CPE-MTCE. 🟢 Power LED ON (Dead): 30s power cycle. If unresolved ➔ TT to AREA-CPE-MTCE.',
    steps: [
      {
        step: 1,
        title: 'Check Power LED Status',
        action: 'Check if Power LED on router front panel is OFF or ON.'
      },
      {
        step: 2,
        title: 'If Power LED is OFF',
        action: 'Press Power button on rear panel. Test wall outlet and 12V adapter pin. If dead ➔ TT to AREA-CPE-MTCE.',
        is_decision: true,
        outcome_group: 'AREA-CPE-MTCE'
      },
      {
        step: 3,
        title: 'If Power LED is ON but Dead',
        action: 'Unplug power pin, wait 30 seconds, plug back in. If device non-responsive ➔ TT to AREA-CPE-MTCE.',
        is_decision: true,
        outcome_group: 'AREA-CPE-MTCE'
      }
    ],
    tt_template: `Target Work Group: AREA-CPE-MTCE
Service Category: BB Service
Fault Complaint: ONT Router Hardware Failure / Dead
Diagnostic Log:
• Power Indicator: Verified OFF / Dead adapter
• Troubleshooting Taken: Tested power button, wall outlet, 30s power cycle
• Action Required: Technician dispatch for CPE router replacement`
  },

  GENERAL_QUESTIONS: {
    id: 'general-questions',
    title: 'General Questions FTTH - Status & Quota SOP',
    url: '/knowledge-hub/faq/ftth/general-questions',
    target_group: 'CEN-CSC-DATA / Customer Care',
    rule_code: 'RULE_UNLIMITED_SLOWNESS',
    badge: 'Quick SOP',
    summary: 'Connection Status & Profile Synchronization.',
    key_decision: '🚫 Not Active: Settle bill arrears. 📉 Throttled: Add Extra GB. ✅ Active & GBs OK: Route to ONT Indicators FAQ.',
    steps: [
      {
        step: 1,
        title: 'Check I-Hub / LDAP Status',
        action: 'If Not Active ➔ Settle outstanding bill. If Active ➔ proceed to Step 2.',
        is_decision: true,
        outcome_group: 'CUSTOMER_CARE'
      },
      {
        step: 2,
        title: 'Check VAS Data Quota',
        action: 'If throttled due to monthly GB ➔ Offer Extra GB booster. If bill arrears ➔ Settle bill.'
      },
      {
        step: 3,
        title: 'Profile Synchronization',
        action: 'Verify LDAP package matches VAS portal speed profile.'
      },
      {
        step: 4,
        title: 'Route to Optical Indicators',
        action: 'If quota available and line active ➔ Follow PON / LOS Indicator SOP.'
      }
    ],
    tt_template: `Target Work Group: CEN-CSC-DATA
Service Category: BB Service
Fault Complaint: FTTH Profile Inquiry / Data Quota Check
Diagnostic Log:
• LDAP Status: Active
• VAS Portal: Quota checked
• Action Required: Account profile verification`
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
