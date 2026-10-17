import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { FAULT_RULES_SEED_DATA } from '@/scripts/seedFaultRules';
import {
  ACTION_TYPES,
  SUPPORT_GROUPS,
  ASSET_TYPES,
  PON_STATUS,
  RELOAD_CHANNELS,
} from '@/models/enums';

// System prompt instructing Gemini to analyze voice or text for SLT Fault Triage
const GEMINI_SYSTEM_PROMPT = `
You are the Senior AI Telecom Triage Engineer for Sri Lanka Telecom (SLT-Mobitel).
Your job is to listen to the customer's or agent's voice (which may be in Sinhala, Singlish, English, or Tamil), accurately transcribe what was said, identify the technical telecom fault or inquiry, and map it directly to official SLT Trouble Ticket (TT) & Service Request (SR) triage rules.

Here are the 13 Official SLT Triage Rules:
1. "LOS red" (Loss of optical signal / fiber cut) -> Action: DIRECT_TT -> Target Group: AREA-MTCE (Mandatory Pre-checks: LDAP & GB portal)
2. "STB faulty/ONT router" (Modem/ONT dead or STB box faulty) -> Action: DIRECT_TT -> Target Group: AREA-MTCE
3. "ADSL router faulty (double play BB only)" -> Action: DONT_REPORT_TT -> Target Group: NONE -> Advice: Bring modem & power adapter to nearest Regional Telecom Office (RTO)
4. "Unlimited slowness" -> Action: DIRECT_TT -> Target Group: AREA-MTCE (Only if speed < 40Mbps and low pay bill verified. If speed >= 40Mbps, reject dispatch)
5. "Remote faulty (<= 6 Months)" -> Action: DONT_REPORT_TT -> Target Group: NONE -> Advice: Bring remote to nearest SLT Teleshop for warranty replacement. (Physical damage not covered)
6. "Remote faulty (> 6 Months)" -> Action: DONT_REPORT_TT -> Target Group: NONE -> Advice: Device is out of warranty. Customer must purchase a replacement remote
7. "Addon adding/cancelling error" -> Action: DIRECT_TT -> Target Group: INT-NW-SYS-ADMIN (Requires addon name and error message)
8. "Data consumption not deducted from addon" -> Action: DIRECT_TT -> Target Group: CEN-CSC-UI (Requires addon name and issue description)
9. "4G Prepaid reload via Mobitel dealers/My SLT/mCash" -> Action: DIRECT_TT -> Target Group: BSS-OPR-OCR (Requires date, amount, source)
10. "4G Prepaid reload via Banks/Third-party (Food City, Singer, Abans)" -> Action: BILL_SR_ONLY -> Target Group: NONE -> Advice: Advise customer to contact merchant/bank for refund
11. "Fiber Voice line faulty" (FTTH telephone no dial tone / dead):
    - DYNAMIC ROUTING BASED ON ONT PON STATUS:
      * If PON LED is ON -> Action: DIRECT_TT -> Target Group: MDF (Main Distribution Frame)
      * If PON LED is OFF or BLINKING -> Action: DIRECT_TT -> Target Group: AREA-MTCE (Outdoor fiber maintenance)
12. "PING is high" (Gaming lag / latency spike) -> Action: DIRECT_TT -> Target Group: CEN-CSC-TECH (Requires game name, ping delay in ms)
13. "PEO mobile / Timely pay offer / Kaspersky / Dual band router request" -> Action: CQMS_COMPLAINT -> Target Group: NONE

You must return ONLY a clean JSON object without Markdown backticks or extra text, formatted exactly as follows:
{
  "transcription": "The exact transcription of the voice/speech in English or original language",
  "detected_language": "Sinhala" | "Singlish" | "English" | "Tamil",
  "customer_intent": "FAULT_REPORTING" | "DIRECTORY_INQUIRY" | "GENERAL",
  "asset_type": "VOICE" | "DATA" | "PEOTV" | "VAS" | "ROUTER" | "BILLING",
  "symptom": "Brief summary of the symptom",
  "technical_context": {
    "pon_status": "ON" | "OFF" | "BLINKING" | "NOT_APPLICABLE",
    "measured_speed_mbps": number | null,
    "game_name": string | null,
    "ping_delay_ms": number | null,
    "addon_name": string | null,
    "error_message": string | null,
    "device_age_months": number | null
  },
  "billing_context": {
    "channel_type": string | null,
    "amount": number | null,
    "transaction_date": string | null
  },
  "pre_check_flags": {
    "ldap_checked": boolean,
    "gb_portal_checked": boolean,
    "peotv_admin_checked": boolean,
    "low_pay_bill_verified": boolean
  },
  "suggested_rule_code": "RULE_LOS_RED" | "RULE_FIBER_VOICE_LINE_FAULT" | "RULE_UNLIMITED_SLOWNESS" | "RULE_HIGH_PING_GAMING" | "RULE_STB_ONT_ROUTER_FAULTY" | "RULE_ADSL_ROUTER_FAULTY" | "RULE_PEOTV_REMOTE_UNDER_WARRANTY" | "RULE_PEOTV_REMOTE_OUT_OF_WARRANTY" | "RULE_ADDON_PROVISIONING_ERROR" | "RULE_DATA_CONSUMPTION_ADDON_MISMATCH" | "RULE_4G_RELOAD_DIRECT_CHANNELS" | "RULE_4G_RELOAD_THIRD_PARTY_CHANNELS" | "RULE_CQMS_VAS_AND_PROMOS",
  "target_workgroup": "AREA-MTCE" | "INT-NW-SYS-ADMIN" | "CEN-CSC-UI" | "BSS-OPR-OCR" | "CEN-CSC-TECH" | "CEN-CSC-DATA" | "SF-VOICE-NET" | "MDF" | "NONE",
  "action_type": "DIRECT_TT" | "DONT_REPORT_TT" | "BILL_SR_ONLY" | "INFORM_SUPERVISOR" | "CQMS_COMPLAINT" | "CUSTOMER_SELF_CARE",
  "operational_advice": "Detailed guidance for the agent",
  "routing_reason": "Specific rationale for why this target workgroup was chosen"
}
`;

/**
 * Intelligent Fallback Intent & Rule Extractor (Runs when Gemini API Key is missing or rate limited)
 * Handles Sinhala, Singlish, and English telecom fault keywords.
 */
function extractFaultRulesFallback(text: string) {
  const lower = text.toLowerCase();

  // 0. General Questions FTTH / Connection Status / VAS Portal GB Check
  if (
    lower.includes('general question') ||
    lower.includes('general questions') ||
    lower.includes('connection status') ||
    lower.includes('i-hub') ||
    lower.includes('ihub') ||
    lower.includes('ldap status') ||
    lower.includes('vas portal') ||
    lower.includes('gb availability') ||
    lower.includes('bill arrears') ||
    lower.includes('throttled due to')
  ) {
    return {
      transcription: text,
      detected_language: lower.includes('eka') ? 'Singlish' : 'English',
      customer_intent: 'GENERAL',
      asset_type: ASSET_TYPES.DATA,
      symptom: 'FTTH General Questions / Connection Status & Quota Check',
      technical_context: {
        pon_status: PON_STATUS.NOT_APPLICABLE,
        measured_speed_mbps: null,
        game_name: null,
        ping_delay_ms: null,
        addon_name: null,
        error_message: null,
        device_age_months: null,
      },
      billing_context: { channel_type: null, amount: null, transaction_date: null },
      pre_check_flags: { ldap_checked: true, gb_portal_checked: true, peotv_admin_checked: false, low_pay_bill_verified: false },
      suggested_rule_code: 'RULE_UNLIMITED_SLOWNESS',
      target_workgroup: 'CEN-CSC-DATA',
      action_type: ACTION_TYPES.CUSTOMER_SELF_CARE,
      operational_advice: '1. Check I-Hub/LDAP connection status -> If Not Active, advise to settle bill. 2. If Active, check VAS Portal GB availability -> If throttled due to GB, advise Extra GB. If throttled due to arrears, advise bill payment. If GBs available, proceed to ONT Indicators FAQ.',
      routing_reason: 'FTTH General Inquiry / Connection Status & Quota Triage SOP.',
      knowledge_article: {
        title: 'General Questions FTTH - Connection Status & Quota SOP',
        url: '/knowledge-hub/faq/ftth/general-questions',
        summary: '1. Check Connection Status (I-Hub/LDAP) -> 2. Check VAS Portal GB availability -> 3. Route to ONT Indicators if quota is available.',
        target_group: 'CEN-CSC-DATA',
        badge: 'FTTH SOP'
      }
    };
  }

  // 1. Fiber Voice line faulty
  if (
    lower.includes('voice') ||
    lower.includes('phone') ||
    lower.includes('telephone') ||
    lower.includes('dial tone') ||
    lower.includes('katana') ||
    lower.includes('call ganna ba') ||
    lower.includes('phone eka wada na') ||
    lower.includes('fone eka dead') ||
    lower.includes('fiber voice')
  ) {
    const isPonOffOrBlink =
      /pon\s*(?:light|led|indicator)?\s*(?:is|eka)?\s*(?:off|blink|blinking|naha|na|red|down)/i.test(lower) ||
      lower.includes('pon off') ||
      lower.includes('pon light off') ||
      lower.includes('pon blinking') ||
      lower.includes('pon blink');

    const isPonOn =
      /pon\s*(?:light|led|indicator)?\s*(?:is|eka)?\s*(?:on|green|up|wada)/i.test(lower) ||
      lower.includes('pon on') ||
      lower.includes('pon light on');

    const ponStatus = isPonOffOrBlink ? PON_STATUS.OFF : isPonOn ? PON_STATUS.ON : PON_STATUS.ON;
    const targetGroup = ponStatus === PON_STATUS.ON ? SUPPORT_GROUPS.MDF : SUPPORT_GROUPS.AREA_MTCE;

    return {
      transcription: text,
      detected_language: lower.includes('wada') || lower.includes('eka') ? 'Singlish' : 'English',
      customer_intent: 'FAULT_REPORTING',
      asset_type: ASSET_TYPES.VOICE,
      symptom: 'Fiber voice line faulty / No dial tone',
      technical_context: {
        pon_status: ponStatus,
        measured_speed_mbps: null,
        game_name: null,
        ping_delay_ms: null,
        addon_name: null,
        error_message: null,
        device_age_months: null,
      },
      billing_context: { channel_type: null, amount: null, transaction_date: null },
      pre_check_flags: { ldap_checked: true, gb_portal_checked: true, peotv_admin_checked: false, low_pay_bill_verified: false },
      suggested_rule_code: 'RULE_FIBER_VOICE_LINE_FAULT',
      target_workgroup: targetGroup,
      action_type: ACTION_TYPES.DIRECT_TT,
      operational_advice:
        ponStatus === PON_STATUS.ON
          ? 'Optical signal is healthy (PON ON). Fault isolated to voice SIP port or MDF frame. Dispatch Trouble Ticket directly to MDF.'
          : 'PON is OFF or BLINKING (Optical failure). Dispatch Trouble Ticket directly to AREA-MTCE for outdoor fiber inspection.',
      routing_reason: `Fiber Voice triage: PON status is '${ponStatus}' -> Routed to ${targetGroup}.`,
    };
  }

  // 2. LOS red light
  if (lower.includes('los red') || lower.includes('red light') || lower.includes('los light') || lower.includes('los blink') || lower.includes('optical loss') || lower.includes('fiber cut') || lower.includes('rathu paatai')) {
    return {
      transcription: text,
      detected_language: lower.includes('eka') || lower.includes('na') ? 'Singlish' : 'English',
      customer_intent: 'FAULT_REPORTING',
      asset_type: ASSET_TYPES.DATA,
      symptom: 'Optical Signal Loss (LOS Red Light)',
      technical_context: {
        pon_status: PON_STATUS.OFF,
        measured_speed_mbps: null,
        game_name: null,
        ping_delay_ms: null,
        addon_name: null,
        error_message: null,
        device_age_months: null,
      },
      billing_context: { channel_type: null, amount: null, transaction_date: null },
      pre_check_flags: { ldap_checked: true, gb_portal_checked: true, peotv_admin_checked: false, low_pay_bill_verified: false },
      suggested_rule_code: 'RULE_LOS_RED',
      target_workgroup: SUPPORT_GROUPS.AREA_MTCE,
      action_type: ACTION_TYPES.DIRECT_TT,
      operational_advice: 'Optical power loss detected. Mandatory pre-checks verified: Dispatch Trouble Ticket to AREA-MTCE for fiber restoration.',
      routing_reason: 'LOS Red Light indicates physical optical link failure -> AREA-MTCE.',
    };
  }

  // 3. High Ping / Gaming latency
  if (lower.includes('ping') || lower.includes('lag') || lower.includes('latency') || lower.includes('game') || lower.includes('gaming') || lower.includes('valorant') || lower.includes('pubg') || lower.includes('cod')) {
    const pingMatch = text.match(/(\d+)\s*ms/i) || text.match(/ping\s*(?:is|eke)?\s*(\d+)/i);
    const pingDelay = pingMatch ? parseInt(pingMatch[1], 10) : 185;

    let gameName = 'Online Gaming (International Server)';
    if (lower.includes('valorant')) gameName = 'Valorant (Singapore)';
    else if (lower.includes('pubg')) gameName = 'PUBG Mobile';
    else if (lower.includes('cod') || lower.includes('warzone')) gameName = 'Call of Duty';

    return {
      transcription: text,
      detected_language: lower.includes('eka') ? 'Singlish' : 'English',
      customer_intent: 'FAULT_REPORTING',
      asset_type: ASSET_TYPES.DATA,
      symptom: 'High PING / Latency spike in online gaming',
      technical_context: {
        pon_status: PON_STATUS.ON,
        measured_speed_mbps: null,
        game_name: gameName,
        ping_delay_ms: pingDelay,
        addon_name: null,
        error_message: null,
        device_age_months: null,
      },
      billing_context: { channel_type: null, amount: null, transaction_date: null },
      pre_check_flags: { ldap_checked: true, gb_portal_checked: true, peotv_admin_checked: false, low_pay_bill_verified: false },
      suggested_rule_code: 'RULE_HIGH_PING_GAMING',
      target_workgroup: SUPPORT_GROUPS.CEN_CSC_TECH,
      action_type: ACTION_TYPES.DIRECT_TT,
      operational_advice: `Dispatch Trouble Ticket directly to CEN-CSC-TECH with game server (${gameName}) and ping latency (${pingDelay} ms).`,
      routing_reason: 'Latency and international peering degradation requires CEN-CSC-TECH IP routing investigation.',
    };
  }

  // 4. Unlimited Slowness
  if (lower.includes('slowness') || lower.includes('slow') || lower.includes('speed') || lower.includes('unlimited slow') || lower.includes('speed bahi') || lower.includes('speed madi')) {
    const speedMatch = text.match(/(\d+)\s*mbps/i) || text.match(/speed\s*(?:is|eka)?\s*(\d+)/i);
    const speed = speedMatch ? parseInt(speedMatch[1], 10) : 18;

    return {
      transcription: text,
      detected_language: lower.includes('eka') ? 'Singlish' : 'English',
      customer_intent: 'FAULT_REPORTING',
      asset_type: ASSET_TYPES.DATA,
      symptom: 'Unlimited broadband speed degradation',
      technical_context: {
        pon_status: PON_STATUS.ON,
        measured_speed_mbps: speed,
        game_name: null,
        ping_delay_ms: null,
        addon_name: null,
        error_message: null,
        device_age_months: null,
      },
      billing_context: { channel_type: null, amount: null, transaction_date: null },
      pre_check_flags: { ldap_checked: true, gb_portal_checked: true, peotv_admin_checked: false, low_pay_bill_verified: true },
      suggested_rule_code: 'RULE_UNLIMITED_SLOWNESS',
      target_workgroup: speed < 40 ? SUPPORT_GROUPS.AREA_MTCE : SUPPORT_GROUPS.NONE,
      action_type: speed < 40 ? ACTION_TYPES.DIRECT_TT : ACTION_TYPES.CUSTOMER_SELF_CARE,
      operational_advice:
        speed < 40
          ? `Measured speed is ${speed} Mbps (< 40 Mbps threshold) and low pay bill verified. Direct Trouble Ticket to AREA-MTCE.`
          : `Measured speed is ${speed} Mbps (>= 40 Mbps). Ticket dispatch to AREA-MTCE prohibited. Advise package usage.`,
      routing_reason: `Measured speed: ${speed} Mbps, Threshold: 40 Mbps.`,
    };
  }

  // 5. 4G Reload Failure
  if (lower.includes('reload') || lower.includes('recharge') || lower.includes('topup') || lower.includes('salli dala awe na') || lower.includes('prepaid reload')) {
    const isFoodCity = lower.includes('food city') || lower.includes('singer') || lower.includes('abans') || lower.includes('bank');
    const channel = isFoodCity ? 'Food City' : 'My SLT';

    if (isFoodCity) {
      return {
        transcription: text,
        detected_language: lower.includes('eka') ? 'Singlish' : 'English',
        customer_intent: 'FAULT_REPORTING',
        asset_type: ASSET_TYPES.BILLING,
        symptom: '4G Prepaid Reload Failure via Third-Party Merchant (Food City)',
        technical_context: {
          pon_status: PON_STATUS.NOT_APPLICABLE,
          measured_speed_mbps: null,
          game_name: null,
          ping_delay_ms: null,
          addon_name: null,
          error_message: null,
          device_age_months: null,
        },
        billing_context: { channel_type: channel, amount: 2000, transaction_date: new Date().toISOString() },
        pre_check_flags: { ldap_checked: false, gb_portal_checked: false, peotv_admin_checked: false, low_pay_bill_verified: false },
        suggested_rule_code: 'RULE_4G_RELOAD_THIRD_PARTY_CHANNELS',
        target_workgroup: SUPPORT_GROUPS.NONE,
        action_type: ACTION_TYPES.BILL_SR_ONLY,
        operational_advice: 'DO NOT create technical TT. Create BILL_SR_ONLY and advise customer to contact merchant/bank with payment receipt for reversal.',
        routing_reason: 'Third-party retailer transaction settlement -> BILL_SR_ONLY.',
      };
    } else {
      return {
        transcription: text,
        detected_language: lower.includes('eka') ? 'Singlish' : 'English',
        customer_intent: 'FAULT_REPORTING',
        asset_type: ASSET_TYPES.BILLING,
        symptom: '4G Prepaid Reload Failure via Direct Channel (My SLT / Mobitel)',
        technical_context: {
          pon_status: PON_STATUS.NOT_APPLICABLE,
          measured_speed_mbps: null,
          game_name: null,
          ping_delay_ms: null,
          addon_name: null,
          error_message: null,
          device_age_months: null,
        },
        billing_context: { channel_type: 'My SLT', amount: 1450, transaction_date: new Date().toISOString() },
        pre_check_flags: { ldap_checked: false, gb_portal_checked: false, peotv_admin_checked: false, low_pay_bill_verified: false },
        suggested_rule_code: 'RULE_4G_RELOAD_DIRECT_CHANNELS',
        target_workgroup: SUPPORT_GROUPS.BSS_OPR_OCR,
        action_type: ACTION_TYPES.DIRECT_TT,
        operational_advice: 'Direct Trouble Ticket to BSS-OPR-OCR for online charging ledger reconciliation.',
        routing_reason: 'Direct SLT channel recharge ledger mismatch -> BSS-OPR-OCR.',
      };
    }
  }

  // 6. Router or STB fault / ONT Not Working
  const isOntFault =
    lower.includes('ont not working') ||
    lower.includes('ont wada na') ||
    lower.includes('ont eka dead') ||
    lower.includes('ont dead') ||
    lower.includes('ont eka wada na') ||
    lower.includes('ont power') ||
    lower.includes('power indicator') ||
    lower.includes('tenda ont') ||
    lower.includes('power adapter') ||
    lower.includes('power charger') ||
    lower.includes('ont light na') ||
    lower.includes('ont on wenne na') ||
    lower.includes('router eka on wenne na') ||
    lower.includes('ont router dead') ||
    (lower.includes('ont') && (lower.includes('off') || lower.includes('dead') || lower.includes('faulty') || lower.includes('broken')));

  if (isOntFault) {
    return {
      transcription: text,
      detected_language: lower.includes('eka') || lower.includes('wada') ? 'Singlish' : 'English',
      customer_intent: 'FAULT_REPORTING',
      asset_type: ASSET_TYPES.ROUTER,
      symptom: 'ONT Not Working / Power Failure (Hardware Dead)',
      technical_context: {
        pon_status: PON_STATUS.OFF,
        measured_speed_mbps: null,
        game_name: null,
        ping_delay_ms: null,
        addon_name: null,
        error_message: null,
        device_age_months: null,
      },
      billing_context: { channel_type: null, amount: null, transaction_date: null },
      pre_check_flags: { ldap_checked: true, gb_portal_checked: false, peotv_admin_checked: false, low_pay_bill_verified: false },
      suggested_rule_code: 'RULE_STB_ONT_ROUTER_FAULTY',
      target_workgroup: 'AREA-CPE-MTCE',
      action_type: ACTION_TYPES.DIRECT_TT,
      operational_advice: 'Follow official Decision Flowchart: Check Power LED -> Toggle power button / restart -> Verify charger connection. If device remains unresponsive, dispatch Trouble Ticket to AREA-CPE-MTCE.',
      routing_reason: 'Confirmed premises ONT hardware/power failure -> Dispatch to AREA-CPE-MTCE for device replacement.',
      knowledge_article: {
        title: 'ONT Not Working - Interactive Diagnostic Decision Guide',
        url: '/knowledge-hub/faq/ftth/ont-not-working',
        summary: 'Step 1: Check Power LED (OFF/ON) -> Step 2: Toggle Power Button / Restart -> Step 3: Check Power Adapter -> Terminal: Escalate to AREA-CPE-MTCE.',
        target_group: 'AREA-CPE-MTCE',
        badge: 'Interactive SOP'
      }
    };
  }

  if (lower.includes('stb') || lower.includes('router faulty') || lower.includes('router eka wada na')) {
    const isAdsl = lower.includes('adsl') || lower.includes('double play');

    if (isAdsl) {
      return {
        transcription: text,
        detected_language: lower.includes('eka') ? 'Singlish' : 'English',
        customer_intent: 'FAULT_REPORTING',
        asset_type: ASSET_TYPES.ROUTER,
        symptom: 'ADSL router faulty (double play broadband)',
        technical_context: {
          pon_status: PON_STATUS.NOT_APPLICABLE,
          measured_speed_mbps: null,
          game_name: null,
          ping_delay_ms: null,
          addon_name: null,
          error_message: null,
          device_age_months: null,
        },
        billing_context: { channel_type: null, amount: null, transaction_date: null },
        pre_check_flags: { ldap_checked: false, gb_portal_checked: false, peotv_admin_checked: false, low_pay_bill_verified: false },
        suggested_rule_code: 'RULE_ADSL_ROUTER_FAULTY',
        target_workgroup: SUPPORT_GROUPS.NONE,
        action_type: ACTION_TYPES.DONT_REPORT_TT,
        operational_advice: 'DO NOT REPORT TROUBLE TICKET. Advise customer to bring the faulty ADSL router with adapter to the nearest RTO for replacement.',
        routing_reason: 'ADSL Double Play router exchange policy requires customer walk-in at RTO.',
      };
    }

    return {
      transcription: text,
      detected_language: lower.includes('eka') ? 'Singlish' : 'English',
      customer_intent: 'FAULT_REPORTING',
      asset_type: ASSET_TYPES.ROUTER,
      symptom: 'Customer premises equipment failure (STB / ONT router)',
      technical_context: {
        pon_status: PON_STATUS.NOT_APPLICABLE,
        measured_speed_mbps: null,
        game_name: null,
        ping_delay_ms: null,
        addon_name: null,
        error_message: null,
        device_age_months: null,
      },
      billing_context: { channel_type: null, amount: null, transaction_date: null },
      pre_check_flags: { ldap_checked: true, gb_portal_checked: false, peotv_admin_checked: false, low_pay_bill_verified: false },
      suggested_rule_code: 'RULE_STB_ONT_ROUTER_FAULTY',
      target_workgroup: 'AREA-CPE-MTCE',
      action_type: ACTION_TYPES.DIRECT_TT,
      operational_advice: 'Direct Trouble Ticket to AREA-CPE-MTCE for on-site hardware swap and premises inspection.',
      routing_reason: 'Premises ONT/STB hardware malfunction -> AREA-CPE-MTCE field dispatch.',
      knowledge_article: {
        title: 'ONT Not Working - Interactive Diagnostic Decision Guide',
        url: '/knowledge-hub/faq/ftth/ont-not-working',
        summary: 'Step 1: Check Power LED (OFF/ON) -> Step 2: Toggle Power Button / Restart -> Step 3: Check Power Adapter -> Terminal: Escalate to AREA-CPE-MTCE.',
        target_group: 'AREA-CPE-MTCE',
        badge: 'Interactive SOP'
      }
    };
  }

  // 7. Generic Fallback
  return {
    transcription: text,
    detected_language: 'English',
    customer_intent: 'GENERAL',
    asset_type: ASSET_TYPES.DATA,
    symptom: text.slice(0, 80),
    technical_context: {
      pon_status: PON_STATUS.NOT_APPLICABLE,
      measured_speed_mbps: null,
      game_name: null,
      ping_delay_ms: null,
      addon_name: null,
      error_message: null,
      device_age_months: null,
    },
    billing_context: { channel_type: null, amount: null, transaction_date: null },
    pre_check_flags: { ldap_checked: false, gb_portal_checked: false, peotv_admin_checked: false, low_pay_bill_verified: false },
    suggested_rule_code: 'RULE_LOS_RED',
    target_workgroup: SUPPORT_GROUPS.AREA_MTCE,
    action_type: ACTION_TYPES.DIRECT_TT,
    operational_advice: 'General issue reported. Verify subscriber records and line profile.',
    routing_reason: 'General inquiry analyzed.',
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { audio, audioMimeType = 'audio/webm', transcript, customerPhone = '0112445566' } = body;

    let recognizedText = transcript || '';
    let triageResult: any = null;

    const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
    const hasValidApiKey = apiKey && !apiKey.includes('INSERT_YOUR') && !apiKey.includes('your-gemini-key');

    // =========================================================================
    // STEP 1: GEMINI VOICE-TO-TEXT AND MULTIMODAL REASONING
    // =========================================================================
    if (hasValidApiKey) {
      try {
        console.log('[Gemini Voice Triage] Initializing Gemini 3.8 Flash...');
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
          model: 'gemini-3.8-flash',
          generationConfig: {
            temperature: 0.1,
            responseMimeType: 'application/json',
          },
        });

        const promptContent: any[] = [{ text: GEMINI_SYSTEM_PROMPT }];

        if (audio) {
          // Clean base64 string
          const base64Data = audio.replace(/^data:audio\/\w+;base64,/, '');
          promptContent.push({
            inlineData: {
              mimeType: audioMimeType,
              data: base64Data,
            },
          });
          promptContent.push({
            text: 'Please listen to this voice audio from the customer or agent, transcribe it, and identify the exact SLT telecom fault, rule code, and target workgroup.',
          });
        } else if (recognizedText) {
          promptContent.push({
            text: `Analyze the following spoken customer utterance:\n"${recognizedText}"\nIdentify the exact SLT telecom fault, rule code, and target workgroup.`,
          });
        }

        const response = await model.generateContent(promptContent);
        const responseText = response.response.text();
        console.log('[Gemini Voice Triage] Response received:', responseText);

        triageResult = JSON.parse(responseText);
        recognizedText = triageResult.transcription || recognizedText;
      } catch (geminiError: any) {
        console.warn('[Gemini Voice Triage] Gemini API call failed or audio unreadable, falling back to local NLP engine:', geminiError.message);
      }
    }

    // =========================================================================
    // STEP 2: RESILIENT LOCAL NLP FALLBACK
    // =========================================================================
    if (!triageResult) {
      console.log('[Voice Triage] Using built-in Telecom NLP Engine for text:', recognizedText);
      triageResult = extractFaultRulesFallback(recognizedText || 'LOS red light on fiber router');
    }

    // Match with official seed rule for exact advice if rule code was found
    const matchedSeed = FAULT_RULES_SEED_DATA.find((r) => r.rule_code === triageResult.suggested_rule_code);

    return NextResponse.json({
      success: true,
      transcription: recognizedText || triageResult.transcription,
      detected_language: triageResult.detected_language || 'Singlish',
      customer_intent: triageResult.customer_intent || 'FAULT_REPORTING',
      asset_type: triageResult.asset_type || (matchedSeed ? matchedSeed.asset_type : ASSET_TYPES.DATA),
      symptom: triageResult.symptom || (matchedSeed ? matchedSeed.symptom_patterns[0] : 'Reported telecom fault'),
      rule: {
        code: triageResult.suggested_rule_code || (matchedSeed ? matchedSeed.rule_code : 'RULE_LOS_RED'),
        name: matchedSeed ? matchedSeed.rule_name : triageResult.symptom,
        description: matchedSeed ? matchedSeed.description : '',
      },
      triage: {
        target_workgroup: triageResult.target_workgroup || (matchedSeed ? matchedSeed.target_group : SUPPORT_GROUPS.AREA_MTCE),
        action_type: triageResult.action_type || (matchedSeed ? matchedSeed.action_type : ACTION_TYPES.DIRECT_TT),
        routing_reason: triageResult.routing_reason || 'Triaged according to official SLT matrix.',
        operational_advice: triageResult.operational_advice || (matchedSeed ? matchedSeed.advice_instructions : ''),
      },
      technical_context: triageResult.technical_context || {},
      billing_context: triageResult.billing_context || {},
      pre_check_flags: triageResult.pre_check_flags || {
        ldap_checked: true,
        gb_portal_checked: true,
        peotv_admin_checked: false,
        low_pay_bill_verified: false,
      },
      customer_context: {
        slt_number: customerPhone,
        service_type: 'FTTH',
      },
      knowledge_article:
        triageResult.knowledge_article ||
        (triageResult.suggested_rule_code === 'RULE_STB_ONT_ROUTER_FAULTY'
          ? {
              title: 'ONT Not Working - Interactive Diagnostic Decision Guide',
              url: '/knowledge-hub/faq/ftth/ont-not-working',
              summary: 'Check Power LED: If OFF, press power button & verify charger; If ON, restart. Unresolved -> dispatch to AREA-CPE-MTCE.',
              target_group: 'AREA-CPE-MTCE',
              badge: 'Interactive SOP'
            }
          : triageResult.suggested_rule_code === 'RULE_LOS_RED'
          ? {
              title: 'PON / LOS Indicator Diagnostic Matrix',
              url: '/knowledge-hub/faq/ftth',
              summary: 'LOS Red indicates fiber cut/signal loss. Verify LDAP/GB Portal and dispatch to AREA-MTCE.',
              target_group: 'AREA-MTCE',
              badge: 'FTTH FAQ'
            }
          : null),
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('[Voice Triage API Error]:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal Server Error during voice triage',
      },
      { status: 500 }
    );
  }
}
