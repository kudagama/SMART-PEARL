/**
 * Interactive Demonstration Script for Telecom Fault Triage Engine
 * Demonstrates Service and Controller layers validating and dispatching tickets.
 *
 * Usage: node demoFaultTriageService.js
 */

const FaultTriageService = require('./src/services/faultTriageService');
const FaultReportController = require('./src/controllers/faultReportController');
const FaultRule = require('./src/models/FaultRule');
const { ASSET_TYPES, PON_STATUS, RELOAD_CHANNELS } = require('./src/models/enums');
const { FAULT_RULES_SEED_DATA } = require('./src/scripts/seedFaultRules');

// Load seed rules into Mongoose model cache for demo
const mockRulesCache = FAULT_RULES_SEED_DATA.map((seed) => new FaultRule(seed));
FaultRule.findMatchingRule = async function (criteria) {
  const { asset_type, symptom, rule_code } = criteria;
  if (rule_code) {
    return mockRulesCache.find((r) => r.rule_code === rule_code) || null;
  }
  const normalized = (symptom || '').toLowerCase();
  for (const r of mockRulesCache) {
    if (!asset_type || r.asset_type === asset_type) {
      if (
        r.symptom_patterns.some(
          (p) => normalized.includes(p) || p.includes(normalized)
        )
      ) {
        return r;
      }
    }
  }
  return mockRulesCache.find((r) => r.asset_type === asset_type) || null;
};

async function runDemo() {
  console.log('\n========================================================================');
  console.log('   TELECOM FAULT REPORTING SYSTEM - SERVICE & CONTROLLER DEMO');
  console.log('========================================================================\n');

  // -------------------------------------------------------------
  // Demo 1: Happy Path - Fiber Voice Fault with PON ON -> Dispatches to MDF
  // -------------------------------------------------------------
  console.log('--- [DEMO 1] FTTH Fiber Voice Line Outage (PON LED is ON) ---');
  const result1 = await FaultTriageService.triageAndCreateReport(
    {
      asset_type: ASSET_TYPES.VOICE,
      symptom: 'fiber voice line faulty no dial tone',
      customer_context: {
        slt_number: '0112445566',
        contact_phone: '+94712345678',
        customer_name: 'Nimal Perera',
      },
      technical_context: {
        pon_status: PON_STATUS.ON,
      },
    },
    { persistToDb: false }
  );

  console.log(` Status:           ${result1.status}`);
  console.log(` Matched Rule:     ${result1.matched_rule.name} (${result1.matched_rule.code})`);
  console.log(` Action:           ${result1.evaluation.action_type}`);
  console.log(` Assigned Group:   ${result1.evaluation.assigned_group}`);
  console.log(` Generated Report: ${result1.fault_report.report_number}`);
  console.log(` Routing Reason:   ${result1.evaluation.routing_reason}`);
  console.log(` Advice:           ${result1.evaluation.advice_instructions}\n`);

  // -------------------------------------------------------------
  // Demo 2: Happy Path - Fiber Voice Fault with PON OFF -> Dispatches to AREA-MTCE
  // -------------------------------------------------------------
  console.log('--- [DEMO 2] FTTH Fiber Voice Line Outage (PON LED is OFF) ---');
  const result2 = await FaultTriageService.triageAndCreateReport(
    {
      asset_type: ASSET_TYPES.VOICE,
      symptom: 'fiber voice line faulty',
      customer_context: {
        slt_number: '0112445566',
      },
      technical_context: {
        pon_status: PON_STATUS.OFF,
      },
    },
    { persistToDb: false }
  );

  console.log(` Action:           ${result2.evaluation.action_type}`);
  console.log(` Assigned Group:   ${result2.evaluation.assigned_group}`);
  console.log(` Routing Reason:   ${result2.evaluation.routing_reason}`);
  console.log(` Advice:           ${result2.evaluation.advice_instructions}\n`);

  // -------------------------------------------------------------
  // Demo 3: Rejection Case - Unlimited Slowness with Speed >= 40 Mbps
  // -------------------------------------------------------------
  console.log('--- [DEMO 3] Unlimited Slowness (Speed = 48 Mbps, above 40 Mbps threshold) ---');
  const result3 = await FaultTriageService.triageAndCreateReport(
    {
      asset_type: ASSET_TYPES.DATA,
      symptom: 'unlimited slowness',
      customer_context: {
        slt_number: '0112888123',
      },
      technical_context: {
        measured_speed_mbps: 48,
      },
      pre_check_flags: {
        low_pay_bill_verified: true,
      },
    },
    { persistToDb: false }
  );

  console.log(` Validation Status: ${result3.status}`);
  console.log(` Errors:            ${result3.errors.join(' | ')}`);
  console.log(` Advice:            ${result3.advice}\n`);

  // -------------------------------------------------------------
  // Demo 4: Rejection Case - Missing Mandatory LDAP Pre-Check on LOS Red
  // -------------------------------------------------------------
  console.log('--- [DEMO 4] Optical LOS Red Light Alarm (Missing LDAP Pre-check) ---');
  const result4 = await FaultTriageService.triageAndCreateReport(
    {
      asset_type: ASSET_TYPES.DATA,
      symptom: 'LOS red light on fiber router',
      customer_context: {
        slt_number: '0112777333',
      },
      pre_check_flags: {
        ldap_checked: false, // Omitted
        gb_portal_checked: true,
      },
    },
    { persistToDb: false }
  );

  console.log(` Validation Status: ${result4.status}`);
  console.log(` Errors:            ${result4.errors.join(' | ')}`);
  console.log(` Advice:            ${result4.advice}\n`);

  // -------------------------------------------------------------
  // Demo 5: Controller HTTP Request Simulation (Third-Party Reload -> BILL_SR_ONLY)
  // -------------------------------------------------------------
  console.log('--- [DEMO 5A] Controller Simulation: HTTP POST /api/faults/triage (Food City Reload -> BILL_SR_ONLY) ---');
  const mockReqSuccess = {
    body: {
      asset_type: ASSET_TYPES.BILLING,
      symptom: 'Food city reload failed to top up prepaid account',
      customer_context: {
        slt_number: '0719998877',
        contact_phone: '0719998877',
      },
      billing_context: {
        channel_type: RELOAD_CHANNELS.FOOD_CITY,
        amount: 2500,
        transaction_date: new Date(),
      },
    },
    query: { persist: 'false' },
  };

  const mockResSuccess = {
    statusCode: 200,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      console.log(` HTTP Status Code: ${this.statusCode}`);
      console.log(` Action:           ${payload.ticket?.action_type}`);
      console.log(` Assigned Group:   ${payload.ticket?.assigned_group}`);
      console.log(` Generated Report: ${payload.ticket?.report_number}`);
      console.log(` Advice:           ${payload.ticket?.action_advice}\n`);
    },
  };

  await FaultReportController.createFaultReport(mockReqSuccess, mockResSuccess);

  console.log('--- [DEMO 5B] Controller Simulation: Direct Channel Mismatch Rejection ---');
  const mockReqReject = {
    body: {
      rule_code: 'RULE_4G_RELOAD_DIRECT_CHANNELS',
      asset_type: ASSET_TYPES.BILLING,
      symptom: '4G prepaid reload not credited',
      customer_context: {
        slt_number: '0719998877',
      },
      billing_context: {
        channel_type: 'Unknown Kiosk Merchant',
        amount: 1000,
        transaction_date: new Date(),
      },
    },
    query: { persist: 'false' },
  };

  const mockResReject = {
    statusCode: 200,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      console.log(` HTTP Status Code: ${this.statusCode}`);
      console.log(` Validation Status: ${payload.status}`);
      console.log(` Errors:            ${payload.validation_errors?.join('; ')}`);
    },
  };

  await FaultReportController.createFaultReport(mockReqReject, mockResReject);

  console.log('\n========================================================================');
  console.log(' DEMO COMPLETED SUCCESSFULLY');
  console.log('========================================================================\n');
}

runDemo().catch(console.error);
