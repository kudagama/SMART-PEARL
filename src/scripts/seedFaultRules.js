/**
 * Master Data Seeder for Telecom Fault Reporting Triage Rules
 * Populates official Trouble Ticket (TT) & Service Request (SR) routing matrix.
 */

const mongoose = require('mongoose');
const FaultRule = require('../models/FaultRule');
const { ACTION_TYPES, SUPPORT_GROUPS, ASSET_TYPES, RELOAD_CHANNELS, PON_STATUS } = require('../models/enums');
const { connectToDatabase, disconnectDatabase, MONGODB_URI } = require('../lib/db');

/**
 * The 13 official triage rules configured according to telecom specifications
 */
const FAULT_RULES_SEED_DATA = [
  // 1. LOS red -> DIRECT_TT -> AREA-MTCE (Pre-check: LDAP & GB portal)
  {
    rule_code: 'RULE_LOS_RED',
    rule_name: 'Optical Fiber Loss of Signal (LOS Red Alarm)',
    description: 'Loss of optical signal detected on customer ONT/ONU fiber interface.',
    asset_type: ASSET_TYPES.DATA,
    symptom_patterns: [
      'los red',
      'los red light',
      'los light red',
      'los blinking red',
      'optical loss',
      'red los light',
      'fiber cut',
    ],
    action_type: ACTION_TYPES.DIRECT_TT,
    target_group: SUPPORT_GROUPS.AREA_MTCE,
    validation_requirements: {
      required_fields: ['customer_context.slt_number'],
      pre_checks: {
        ldap_checked: true,
        gb_portal_checked: true,
        peotv_admin_checked: false,
        low_pay_bill_verified: false,
      },
    },
    advice_instructions:
      'Optical signal lost. Mandatory pre-checks: Verify customer account on LDAP and verify Optical Power on GB Portal before dispatching Trouble Ticket to AREA-MTCE.',
    priority: 150,
    is_active: true,
  },

  // 2. STB faulty/ONT router -> DIRECT_TT -> AREA-MTCE
  {
    rule_code: 'RULE_STB_ONT_ROUTER_FAULTY',
    rule_name: 'Customer Premises Equipment Failure (STB / ONT Router)',
    description: 'Hardware failure or power fault on premises ONT Router or PEOTV Set-Top Box.',
    asset_type: ASSET_TYPES.ROUTER,
    symptom_patterns: [
      'stb faulty',
      'ont router faulty',
      'stb not working',
      'ont router not working',
      'stb power fault',
      'ont router dead',
      'stb hardware defect',
    ],
    action_type: ACTION_TYPES.DIRECT_TT,
    target_group: SUPPORT_GROUPS.AREA_MTCE,
    validation_requirements: {
      required_fields: ['customer_context.slt_number'],
    },
    advice_instructions:
      'Dispatch Trouble Ticket directly to AREA-MTCE for premises visit, on-site hardware diagnosis, and equipment replacement.',
    priority: 120,
    is_active: true,
  },

  // 3. ADSL router faulty (double play BB only) -> DONT_REPORT_TT -> Bring to nearest RTO
  {
    rule_code: 'RULE_ADSL_ROUTER_FAULTY',
    rule_name: 'ADSL Router Hardware Fault (Double Play BB Only)',
    description: 'Defective ADSL modem/router on copper double-play broadband connections.',
    asset_type: ASSET_TYPES.ROUTER,
    symptom_patterns: [
      'adsl router faulty',
      'adsl modem faulty',
      'adsl router dead',
      'adsl double play router faulty',
      'adsl router not powering on',
    ],
    action_type: ACTION_TYPES.DONT_REPORT_TT,
    target_group: SUPPORT_GROUPS.NONE,
    validation_requirements: {
      required_fields: ['customer_context.slt_number'],
    },
    advice_instructions:
      'DO NOT REPORT TROUBLE TICKET. Advise customer to bring the faulty ADSL router together with the power adapter to the nearest Regional Telecom Office (RTO) for testing and replacement.',
    priority: 140,
    is_active: true,
  },

  // 4. Unlimited slowness -> DIRECT_TT -> AREA-MTCE (Condition: speed < 40Mbps, check low pay bill)
  {
    rule_code: 'RULE_UNLIMITED_SLOWNESS',
    rule_name: 'Broadband Speed Degradation on Unlimited Package',
    description: 'Customer on Unlimited package complaining of severe speed degradation.',
    asset_type: ASSET_TYPES.DATA,
    symptom_patterns: [
      'unlimited slowness',
      'unlimited speed slow',
      'slow speed on unlimited',
      'speed degradation unlimited',
      'unlimited slow',
    ],
    action_type: ACTION_TYPES.DIRECT_TT,
    target_group: SUPPORT_GROUPS.AREA_MTCE,
    validation_requirements: {
      required_fields: ['technical_context.measured_speed_mbps'],
      pre_checks: {
        ldap_checked: false,
        gb_portal_checked: false,
        peotv_admin_checked: false,
        low_pay_bill_verified: true,
      },
      thresholds: {
        max_speed_mbps: 40,
      },
    },
    advice_instructions:
      'Dispatch Trouble Ticket to AREA-MTCE ONLY if measured speed < 40 Mbps AND low pay bill policy has been verified. If measured speed is 40 Mbps or higher, reject dispatch.',
    priority: 130,
    is_active: true,
  },

  // 5. Remote faulty (<= 6 Months) -> DONT_REPORT_TT -> Bring to nearest SLT (Physical damage not covered)
  {
    rule_code: 'RULE_PEOTV_REMOTE_UNDER_WARRANTY',
    rule_name: 'PEOTV Remote Controller Faulty (Within Warranty <= 6 Months)',
    description: 'PEOTV remote control failure within the 6-month warranty window.',
    asset_type: ASSET_TYPES.PEOTV,
    symptom_patterns: [
      'remote faulty',
      'peotv remote faulty',
      'remote controller not working',
      'remote buttons unresponsive',
    ],
    action_type: ACTION_TYPES.DONT_REPORT_TT,
    target_group: SUPPORT_GROUPS.NONE,
    validation_requirements: {
      required_fields: ['technical_context.device_age_months'],
      thresholds: {
        max_device_age_months: 6,
      },
    },
    advice_instructions:
      'DO NOT REPORT TROUBLE TICKET. Device is within warranty (<= 6 Months). Advise customer to bring remote to nearest SLT Teleshop for replacement. Note: Physical damage and water ingress are strictly not covered under warranty.',
    priority: 145,
    is_active: true,
  },

  // 6. Remote faulty (> 6 Months) -> DONT_REPORT_TT -> Customer must purchase
  {
    rule_code: 'RULE_PEOTV_REMOTE_OUT_OF_WARRANTY',
    rule_name: 'PEOTV Remote Controller Faulty (Out of Warranty > 6 Months)',
    description: 'PEOTV remote control failure beyond the 6-month warranty period.',
    asset_type: ASSET_TYPES.PEOTV,
    symptom_patterns: [
      'remote faulty out of warranty',
      'peotv remote faulty old',
      'remote older than 6 months',
      'purchase replacement remote',
    ],
    action_type: ACTION_TYPES.DONT_REPORT_TT,
    target_group: SUPPORT_GROUPS.NONE,
    validation_requirements: {
      required_fields: ['technical_context.device_age_months'],
      thresholds: {
        min_device_age_months: 6.0001,
      },
    },
    advice_instructions:
      'DO NOT REPORT TROUBLE TICKET. Device is beyond warranty (> 6 Months). Customer must purchase a replacement remote controller at the nearest SLT Teleshop or order via the My SLT self-care app.',
    priority: 140,
    is_active: true,
  },

  // 7. Addon adding/cancelling error -> DIRECT_TT -> INT-NW-SYS-ADMIN (Require addon name and error)
  {
    rule_code: 'RULE_ADDON_PROVISIONING_ERROR',
    rule_name: 'Addon Package Provisioning or Cancellation Failure',
    description: 'System or provisioning error encountered while activating or deactivating VAS/Data addons.',
    asset_type: ASSET_TYPES.VAS,
    symptom_patterns: [
      'addon adding error',
      'addon cancelling error',
      'addon activation failure',
      'unable to add addon',
      'error cancelling addon',
      'addon error',
    ],
    action_type: ACTION_TYPES.DIRECT_TT,
    target_group: SUPPORT_GROUPS.INT_NW_SYS_ADMIN,
    validation_requirements: {
      required_fields: ['technical_context.addon_name', 'technical_context.error_message'],
    },
    advice_instructions:
      'Dispatch Trouble Ticket directly to INT-NW-SYS-ADMIN. Mandatory: Must record the specific Addon Name and the exact System Error Message returned during provisioning/cancellation.',
    priority: 135,
    is_active: true,
  },

  // 8. Data consumption not deducted from addon -> DIRECT_TT -> CEN-CSC-UI (Require addon name and issue)
  {
    rule_code: 'RULE_DATA_CONSUMPTION_ADDON_MISMATCH',
    rule_name: 'Data Consumption Rating Discrepancy (Not Deducted From Addon)',
    description: 'Data usage is rated against standard bundle rather than specific active data addon quota.',
    asset_type: ASSET_TYPES.DATA,
    symptom_patterns: [
      'data consumption not deducted from addon',
      'addon data not being used',
      'standard quota deducted instead of addon',
      'addon data deduction error',
    ],
    action_type: ACTION_TYPES.DIRECT_TT,
    target_group: SUPPORT_GROUPS.CEN_CSC_UI,
    validation_requirements: {
      required_fields: ['technical_context.addon_name', 'technical_context.error_message'],
    },
    advice_instructions:
      'Dispatch Trouble Ticket directly to CEN-CSC-UI (Central CSC Usage Interface & Rating). Mandatory: Specify addon name and detailed rating issue behavior.',
    priority: 135,
    is_active: true,
  },

  // 9. 4G Prepaid reload via Mobitel dealers/My SLT/mCash -> DIRECT_TT -> BSS-OPR-OCR (Require date, amount, source)
  {
    rule_code: 'RULE_4G_RELOAD_DIRECT_CHANNELS',
    rule_name: '4G LTE Prepaid Recharge Failure via Direct Channels',
    description: 'Recharge not credited when paid via official direct channels (Mobitel dealers, My SLT, mCash).',
    asset_type: ASSET_TYPES.BILLING,
    symptom_patterns: [
      '4g prepaid reload mobitel dealer',
      '4g prepaid reload myslt',
      '4g prepaid reload mcash',
      'prepaid reload not credited direct',
      'reload via mobitel dealers',
    ],
    action_type: ACTION_TYPES.DIRECT_TT,
    target_group: SUPPORT_GROUPS.BSS_OPR_OCR,
    validation_requirements: {
      required_fields: [
        'billing_context.transaction_date',
        'billing_context.amount',
        'billing_context.channel_type',
      ],
      thresholds: {
        allowed_channels: [
          RELOAD_CHANNELS.MOBITEL_DEALERS,
          RELOAD_CHANNELS.MY_SLT,
          RELOAD_CHANNELS.MCASH,
        ],
      },
    },
    advice_instructions:
      'Dispatch Trouble Ticket directly to BSS-OPR-OCR (Business Support System Online Charging & Reconciliation). Mandatory: Capture Transaction Date, Amount, and Source Channel.',
    priority: 140,
    is_active: true,
  },

  // 10. 4G Prepaid reload via Banks/Third-party (Food City, Singer, Abans) -> BILL_SR_ONLY -> Advise refund
  {
    rule_code: 'RULE_4G_RELOAD_THIRD_PARTY_CHANNELS',
    rule_name: '4G LTE Prepaid Recharge via Commercial Third-Party / Banking Channels',
    description: 'Recharge failure processed through external commercial partners (Banks, Supermarkets, Retailers).',
    asset_type: ASSET_TYPES.BILLING,
    symptom_patterns: [
      '4g prepaid reload bank',
      'reload food city',
      'food city reload',
      'reload singer',
      'singer reload',
      'reload abans',
      'abans reload',
      'third party reload fail',
      'commercial bank reload',
      'third party reload',
    ],
    action_type: ACTION_TYPES.BILL_SR_ONLY,
    target_group: SUPPORT_GROUPS.NONE,
    validation_requirements: {
      required_fields: [
        'billing_context.transaction_date',
        'billing_context.amount',
        'billing_context.channel_type',
      ],
      thresholds: {
        allowed_channels: [
          RELOAD_CHANNELS.BANKS,
          RELOAD_CHANNELS.FOOD_CITY,
          RELOAD_CHANNELS.SINGER,
          RELOAD_CHANNELS.ABANS,
          RELOAD_CHANNELS.THIRD_PARTY,
        ],
      },
    },
    advice_instructions:
      'DO NOT create technical Trouble Ticket. Create BILL_SR_ONLY (Billing Service Request). Advise customer to contact their respective Bank or Merchant partner with payment receipt for transaction reversal/refund.',
    priority: 140,
    is_active: true,
  },

  // 11. Fiber Voice line faulty -> DIRECT_TT -> If PON is ON: MDF; If PON is OFF/Blinking: AREA-MTCE (Under voice asset)
  {
    rule_code: 'RULE_FIBER_VOICE_LINE_FAULT',
    rule_name: 'FTTH Fiber Voice Line Service Outage (Dynamic PON Routing)',
    description: 'No dial tone or voice line failure on Fiber To The Home (FTTH) connection.',
    asset_type: ASSET_TYPES.VOICE,
    symptom_patterns: [
      'fiber voice line faulty',
      'fiber telephone dead',
      'ftth voice no dial tone',
      'voice line faulty on fiber',
      'fiber telephone not ringing',
    ],
    action_type: ACTION_TYPES.DIRECT_TT,
    target_group: SUPPORT_GROUPS.MDF, // Default group
    conditional_routing: [
      {
        condition_field: 'technical_context.pon_status',
        operator: 'eq',
        value: PON_STATUS.ON,
        action_type: ACTION_TYPES.DIRECT_TT,
        target_group: SUPPORT_GROUPS.MDF,
        advice_instructions:
          'PON status is ON (Optical signal healthy). Voice failure indicates SIP port or MDF frame termination issue. Dispatch Trouble Ticket directly to MDF.',
      },
      {
        condition_field: 'technical_context.pon_status',
        operator: 'in',
        value: [PON_STATUS.OFF, PON_STATUS.BLINKING],
        action_type: ACTION_TYPES.DIRECT_TT,
        target_group: SUPPORT_GROUPS.AREA_MTCE,
        advice_instructions:
          'PON status is OFF or BLINKING (Optical transmission failure). Dispatch Trouble Ticket directly to AREA-MTCE for optical fiber drop inspection.',
      },
    ],
    validation_requirements: {
      required_fields: ['technical_context.pon_status'],
    },
    advice_instructions:
      'Check ONT PON indicator status: If PON is ON -> Route to MDF; If PON is OFF or BLINKING -> Route to AREA-MTCE.',
    priority: 160,
    is_active: true,
  },

  // 12. PING is high -> DIRECT_TT -> CEN-CSC-TECH (Require game name, start time, ping latency)
  {
    rule_code: 'RULE_HIGH_PING_GAMING',
    rule_name: 'High Latency / Ping Spike in Online Gaming & Peering',
    description: 'Elevated network latency impacting international routing or online gaming performance.',
    asset_type: ASSET_TYPES.DATA,
    symptom_patterns: [
      'ping is high',
      'high ping',
      'gaming latency high',
      'ping delay spike',
      'game lag high ping',
    ],
    action_type: ACTION_TYPES.DIRECT_TT,
    target_group: SUPPORT_GROUPS.CEN_CSC_TECH,
    validation_requirements: {
      required_fields: [
        'technical_context.game_name',
        'technical_context.ping_delay_ms',
      ],
    },
    advice_instructions:
      'Dispatch Trouble Ticket directly to CEN-CSC-TECH (Central Technical / IP Core Team). Mandatory: Record Game Name, Issue Start Time, and Measured Ping Latency in ms for route/peering tracing.',
    priority: 130,
    is_active: true,
  },

  // 13. PEO mobile / Timely pay offer / Kaspersky / Dual band router request -> CQMS_COMPLAINT
  {
    rule_code: 'RULE_CQMS_VAS_AND_PROMOS',
    rule_name: 'Customer Quality Management: VAS, Promotional Inquiries & Upgrades',
    description: 'Inquiries regarding PEO mobile, Timely pay promotional offers, Kaspersky security, or Dual band router upgrades.',
    asset_type: ASSET_TYPES.VAS,
    symptom_patterns: [
      'peo mobile',
      'timely pay offer',
      'kaspersky',
      'dual band router request',
      'router upgrade request',
      'promotional offer inquiry',
    ],
    action_type: ACTION_TYPES.CQMS_COMPLAINT,
    target_group: SUPPORT_GROUPS.NONE,
    validation_requirements: {
      required_fields: ['customer_context.slt_number'],
    },
    advice_instructions:
      'DO NOT create technical Trouble Ticket. Log customer request as CQMS_COMPLAINT for marketing, commercial promotions, and customer relations follow-up.',
    priority: 125,
    is_active: true,
  },
];

/**
 * Executes the database seeder
 */
async function seedRules(dbUri = MONGODB_URI, options = {}) {
  const isDryRun = options.dryRun || process.argv.includes('--dry-run');

  console.log('================================================================');
  console.log(' SLT TELECOM FAULT REPORTING SYSTEM - TRIAGE RULES SEEDER');
  console.log('================================================================');

  if (isDryRun) {
    console.log('[MODE] DRY-RUN MODE: Validating seed dataset structure without DB writes...');
    console.log(`Total rules ready to seed: ${FAULT_RULES_SEED_DATA.length}`);
    FAULT_RULES_SEED_DATA.forEach((r, idx) => {
      console.log(
        ` [${(idx + 1).toString().padStart(2, '0')}] ${r.rule_code.padEnd(35)} | ${r.asset_type.padEnd(8)} | ${r.action_type.padEnd(16)} | Target: ${r.target_group}`
      );
    });
    return { success: true, count: FAULT_RULES_SEED_DATA.length, isDryRun: true };
  }

  try {
    console.log(`[CONNECTING] Connecting to MongoDB: ${dbUri}`);
    await connectToDatabase(dbUri);
    console.log('[CONNECTED] Successfully connected to MongoDB.');

    let upsertedCount = 0;
    for (const rule of FAULT_RULES_SEED_DATA) {
      await FaultRule.findOneAndUpdate(
        { rule_code: rule.rule_code },
        { $set: rule },
        { upsert: true, new: true, runValidators: true }
      );
      upsertedCount++;
    }

    console.log(`[SUCCESS] Seeded/Upserted ${upsertedCount} master triage rules successfully.`);
    console.log('----------------------------------------------------------------');
    const allRules = await FaultRule.find({ is_active: true }).sort({ priority: -1 }).lean();
    console.table(
      allRules.map((r) => ({
        Code: r.rule_code,
        Asset: r.asset_type,
        Action: r.action_type,
        TargetGroup: r.target_group,
        HasConditions: (r.conditional_routing || []).length > 0 ? 'YES' : 'NO',
        Priority: r.priority,
      }))
    );
    console.log('================================================================');

    return { success: true, count: upsertedCount };
  } catch (err) {
    console.error('[ERROR] Failed to seed triage rules:', err);
    throw err;
  } finally {
    if (!options.keepOpen) {
      await disconnectDatabase();
      console.log('[DISCONNECTED] Closed database connection.');
    }
  }
}

// Allow direct CLI execution: node seedFaultRules.js [--dry-run]
if (require.main === module) {
  seedRules().catch((err) => {
    console.error('Fatal seeder error:', err.message);
    process.exit(1);
  });
}

module.exports = {
  seedRules,
  FAULT_RULES_SEED_DATA,
};
