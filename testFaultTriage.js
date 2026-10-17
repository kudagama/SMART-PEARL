/**
 * Verification Test Suite for Telecom Fault Reporting System
 * Tests all 13 Triage Rules, Edge Cases, Thresholds, Pre-checks, and Mongoose Models.
 */

const mongoose = require('mongoose');
const FaultRule = require('./src/models/FaultRule');
const FaultReport = require('./src/models/FaultReport');
const {
  ACTION_TYPES,
  SUPPORT_GROUPS,
  ASSET_TYPES,
  PON_STATUS,
  TICKET_STATUS,
  RELOAD_CHANNELS,
} = require('./src/models/enums');
const { FAULT_RULES_SEED_DATA } = require('./src/scripts/seedFaultRules');

// Convert seed array into rule map of compiled Mongoose FaultRule documents
const ruleModelsMap = new Map();
FAULT_RULES_SEED_DATA.forEach((seed) => {
  const modelInstance = new FaultRule(seed);
  ruleModelsMap.set(seed.rule_code, modelInstance);
});

// Helper mocking rule search for offline evaluation
function findRuleForTest(assetType, symptom, ruleCode) {
  if (ruleCode && ruleModelsMap.has(ruleCode)) {
    return ruleModelsMap.get(ruleCode);
  }

  const normalized = symptom.toLowerCase().trim();
  for (const rule of ruleModelsMap.values()) {
    if (rule.asset_type === assetType) {
      for (const pattern of rule.symptom_patterns) {
        if (normalized.includes(pattern) || pattern.includes(normalized)) {
          return rule;
        }
      }
    }
  }
  return null;
}

let passedTests = 0;
let failedTests = 0;

function assert(condition, testName, details = '') {
  if (condition) {
    passedTests++;
    console.log(`  \x1b[32m✔ PASS\x1b[0m: ${testName}`);
  } else {
    failedTests++;
    console.error(`  \x1b[31m✖ FAIL\x1b[0m: ${testName} - ${details}`);
  }
}

async function runTestSuite() {
  console.log('\n================================================================');
  console.log(' TELECOM FAULT REPORTING SYSTEM - AUTOMATED VERIFICATION SUITE');
  console.log('================================================================\n');

  // -------------------------------------------------------------
  // Test 1: "LOS red" -> DIRECT_TT -> AREA-MTCE (Pre-check: LDAP & GB portal)
  // -------------------------------------------------------------
  console.log('Scenario 1: LOS Red Light Optical Alarm');
  const ruleLos = findRuleForTest(ASSET_TYPES.DATA, 'los red', 'RULE_LOS_RED');
  assert(ruleLos !== null, 'Found matching rule for LOS red');

  // Test 1A: Missing Pre-checks should fail validation
  const evalLosFail = ruleLos.evaluate({
    asset_type: ASSET_TYPES.DATA,
    symptom: 'LOS red indicator on router',
    customer_context: { slt_number: '0112345678' },
    pre_check_flags: { ldap_checked: false, gb_portal_checked: false },
  });
  assert(
    !evalLosFail.isValid && evalLosFail.errors.length >= 2,
    'Rejects when LDAP and GB Portal pre-checks are missing',
    JSON.stringify(evalLosFail.errors)
  );

  // Test 1B: Valid Pre-checks should route to AREA-MTCE with DIRECT_TT
  const evalLosPass = ruleLos.evaluate({
    asset_type: ASSET_TYPES.DATA,
    symptom: 'LOS red indicator on router',
    customer_context: { slt_number: '0112345678' },
    pre_check_flags: { ldap_checked: true, gb_portal_checked: true },
  });
  assert(
    evalLosPass.isValid &&
      evalLosPass.action_type === ACTION_TYPES.DIRECT_TT &&
      evalLosPass.assigned_group === SUPPORT_GROUPS.AREA_MTCE,
    'Approves DIRECT_TT to AREA-MTCE after LDAP & GB portal verified'
  );

  // -------------------------------------------------------------
  // Test 2: "STB faulty/ONT router" -> DIRECT_TT -> AREA-MTCE
  // -------------------------------------------------------------
  console.log('\nScenario 2: STB Faulty / ONT Router Hardware Defect');
  const ruleStb = findRuleForTest(ASSET_TYPES.ROUTER, 'stb faulty', 'RULE_STB_ONT_ROUTER_FAULTY');
  const evalStb = ruleStb.evaluate({
    asset_type: ASSET_TYPES.ROUTER,
    symptom: 'STB faulty and ONT router power failure',
    customer_context: { slt_number: '0112765432' },
  });
  assert(
    evalStb.isValid &&
      evalStb.action_type === ACTION_TYPES.DIRECT_TT &&
      evalStb.assigned_group === SUPPORT_GROUPS.AREA_MTCE,
    'Routes STB faulty/ONT router to AREA-MTCE via DIRECT_TT'
  );

  // -------------------------------------------------------------
  // Test 3: "ADSL router faulty (double play BB only)" -> DONT_REPORT_TT -> Bring to nearest RTO
  // -------------------------------------------------------------
  console.log('\nScenario 3: ADSL Router Fault (Double Play Only)');
  const ruleAdsl = findRuleForTest(
    ASSET_TYPES.ROUTER,
    'adsl router faulty',
    'RULE_ADSL_ROUTER_FAULTY'
  );
  const evalAdsl = ruleAdsl.evaluate({
    asset_type: ASSET_TYPES.ROUTER,
    symptom: 'ADSL router faulty double play broadband only',
    customer_context: { slt_number: '0342234567' },
  });
  assert(
    evalAdsl.isValid &&
      evalAdsl.action_type === ACTION_TYPES.DONT_REPORT_TT &&
      evalAdsl.assigned_group === SUPPORT_GROUPS.NONE &&
      evalAdsl.advice_instructions.includes('nearest Regional Telecom Office (RTO)'),
    'Applies DONT_REPORT_TT and advises customer to bring to nearest RTO'
  );

  // -------------------------------------------------------------
  // Test 4: "Unlimited slowness" -> DIRECT_TT -> AREA-MTCE (Condition: speed < 40Mbps, check low pay bill)
  // -------------------------------------------------------------
  console.log('\nScenario 4: Unlimited Package Slowness');
  const ruleSlow = findRuleForTest(
    ASSET_TYPES.DATA,
    'unlimited slowness',
    'RULE_UNLIMITED_SLOWNESS'
  );

  // Test 4A: Reject if speed is >= 40 Mbps
  const evalSlowHigh = ruleSlow.evaluate({
    asset_type: ASSET_TYPES.DATA,
    symptom: 'Unlimited slowness reported',
    customer_context: { slt_number: '0112987654' },
    technical_context: { measured_speed_mbps: 45 },
    pre_check_flags: { low_pay_bill_verified: true },
  });
  assert(
    !evalSlowHigh.isValid && evalSlowHigh.errors.some((e) => e.includes('not below maximum threshold')),
    'Rejects ticket dispatch when speed is 45 Mbps (>= 40 Mbps threshold)'
  );

  // Test 4B: Reject if low pay bill not verified
  const evalSlowNoBillCheck = ruleSlow.evaluate({
    asset_type: ASSET_TYPES.DATA,
    symptom: 'Unlimited slowness reported',
    customer_context: { slt_number: '0112987654' },
    technical_context: { measured_speed_mbps: 15 },
    pre_check_flags: { low_pay_bill_verified: false },
  });
  assert(
    !evalSlowNoBillCheck.isValid &&
      evalSlowNoBillCheck.errors.some((e) => e.toLowerCase().includes('low pay bill')),
    'Rejects ticket dispatch when low pay bill policy has not been verified'
  );

  // Test 4C: Passes when speed < 40 Mbps and low pay bill verified
  const evalSlowPass = ruleSlow.evaluate({
    asset_type: ASSET_TYPES.DATA,
    symptom: 'Unlimited slowness reported',
    customer_context: { slt_number: '0112987654' },
    technical_context: { measured_speed_mbps: 22 },
    pre_check_flags: { low_pay_bill_verified: true },
  });
  assert(
    evalSlowPass.isValid &&
      evalSlowPass.action_type === ACTION_TYPES.DIRECT_TT &&
      evalSlowPass.assigned_group === SUPPORT_GROUPS.AREA_MTCE,
    'Dispatches DIRECT_TT to AREA-MTCE when speed is 22 Mbps (< 40 Mbps) and bill verified'
  );

  // -------------------------------------------------------------
  // Test 5: "Remote faulty (<= 6 Months)" -> DONT_REPORT_TT -> Bring to nearest SLT
  // -------------------------------------------------------------
  console.log('\nScenario 5: PEOTV Remote Faulty (Within Warranty <= 6 Months)');
  const ruleRemoteIn = findRuleForTest(
    ASSET_TYPES.PEOTV,
    'remote faulty',
    'RULE_PEOTV_REMOTE_UNDER_WARRANTY'
  );
  const evalRemoteIn = ruleRemoteIn.evaluate({
    asset_type: ASSET_TYPES.PEOTV,
    symptom: 'PEOTV remote faulty buttons stuck',
    customer_context: { slt_number: '0812345678' },
    technical_context: { device_age_months: 4 },
  });
  assert(
    evalRemoteIn.isValid &&
      evalRemoteIn.action_type === ACTION_TYPES.DONT_REPORT_TT &&
      evalRemoteIn.advice_instructions.includes('Physical damage and water ingress are strictly not covered'),
    'Applies DONT_REPORT_TT and advises Teleshop warranty replacement (physical damage not covered)'
  );

  // -------------------------------------------------------------
  // Test 6: "Remote faulty (> 6 Months)" -> DONT_REPORT_TT -> Customer must purchase
  // -------------------------------------------------------------
  console.log('\nScenario 6: PEOTV Remote Faulty (Out of Warranty > 6 Months)');
  const ruleRemoteOut = findRuleForTest(
    ASSET_TYPES.PEOTV,
    'remote faulty old',
    'RULE_PEOTV_REMOTE_OUT_OF_WARRANTY'
  );
  const evalRemoteOut = ruleRemoteOut.evaluate({
    asset_type: ASSET_TYPES.PEOTV,
    symptom: 'remote faulty out of warranty',
    customer_context: { slt_number: '0812345678' },
    technical_context: { device_age_months: 11 },
  });
  assert(
    evalRemoteOut.isValid &&
      evalRemoteOut.action_type === ACTION_TYPES.DONT_REPORT_TT &&
      evalRemoteOut.advice_instructions.includes('Customer must purchase a replacement remote'),
    'Applies DONT_REPORT_TT and advises customer purchase for devices older than 6 months'
  );

  // -------------------------------------------------------------
  // Test 7: "Addon adding/cancelling error" -> DIRECT_TT -> INT-NW-SYS-ADMIN
  // -------------------------------------------------------------
  console.log('\nScenario 7: Addon Adding / Cancelling Error');
  const ruleAddonErr = findRuleForTest(
    ASSET_TYPES.VAS,
    'addon adding error',
    'RULE_ADDON_PROVISIONING_ERROR'
  );

  // Test 7A: Missing required error details
  const evalAddonMissing = ruleAddonErr.evaluate({
    asset_type: ASSET_TYPES.VAS,
    symptom: 'addon adding error',
    customer_context: { slt_number: '0112111222' },
    technical_context: { addon_name: 'Netflix 50GB Bundle' }, // missing error_message
  });
  assert(
    !evalAddonMissing.isValid && evalAddonMissing.errors.some((e) => e.includes('error_message')),
    'Rejects when error_message is not supplied'
  );

  // Test 7B: Valid with addon name and error
  const evalAddonPass = ruleAddonErr.evaluate({
    asset_type: ASSET_TYPES.VAS,
    symptom: 'addon adding error',
    customer_context: { slt_number: '0112111222' },
    technical_context: {
      addon_name: 'Netflix 50GB Bundle',
      error_message: 'PROV_ERR_409: Subscription state active in HSS but pending in PCRF',
    },
  });
  assert(
    evalAddonPass.isValid &&
      evalAddonPass.action_type === ACTION_TYPES.DIRECT_TT &&
      evalAddonPass.assigned_group === SUPPORT_GROUPS.INT_NW_SYS_ADMIN,
    'Routes addon provisioning errors to INT-NW-SYS-ADMIN with addon and error message'
  );

  // -------------------------------------------------------------
  // Test 8: "Data consumption not deducted from addon" -> DIRECT_TT -> CEN-CSC-UI
  // -------------------------------------------------------------
  console.log('\nScenario 8: Data Consumption Not Deducted From Addon');
  const ruleDataAddon = findRuleForTest(
    ASSET_TYPES.DATA,
    'data consumption not deducted from addon',
    'RULE_DATA_CONSUMPTION_ADDON_MISMATCH'
  );
  const evalDataAddon = ruleDataAddon.evaluate({
    asset_type: ASSET_TYPES.DATA,
    symptom: 'data consumption not deducted from addon',
    customer_context: { slt_number: '0112333444' },
    technical_context: {
      addon_name: 'YouTube Unlimited HD',
      error_message: 'Traffic routed to default IP bucket rather than DPI YouTube policy',
    },
  });
  assert(
    evalDataAddon.isValid &&
      evalDataAddon.action_type === ACTION_TYPES.DIRECT_TT &&
      evalDataAddon.assigned_group === SUPPORT_GROUPS.CEN_CSC_UI,
    'Routes data deduction rating discrepancy to CEN-CSC-UI'
  );

  // -------------------------------------------------------------
  // Test 9: "4G Prepaid reload via Mobitel dealers/My SLT/mCash" -> DIRECT_TT -> BSS-OPR-OCR
  // -------------------------------------------------------------
  console.log('\nScenario 9: 4G Prepaid Reload Failure via Direct Channels');
  const rule4gDirect = findRuleForTest(
    ASSET_TYPES.BILLING,
    '4g prepaid reload mobitel dealer',
    'RULE_4G_RELOAD_DIRECT_CHANNELS'
  );
  const eval4gDirect = rule4gDirect.evaluate({
    asset_type: ASSET_TYPES.BILLING,
    symptom: '4G prepaid reload via My SLT app failed to credit balance',
    customer_context: { slt_number: '0712345678' },
    billing_context: {
      channel_type: RELOAD_CHANNELS.MY_SLT,
      amount: 1450,
      transaction_date: new Date('2026-10-15T14:30:00Z'),
    },
  });
  assert(
    eval4gDirect.isValid &&
      eval4gDirect.action_type === ACTION_TYPES.DIRECT_TT &&
      eval4gDirect.assigned_group === SUPPORT_GROUPS.BSS_OPR_OCR,
    'Routes direct reload failures (My SLT, Mobitel dealer, mCash) to BSS-OPR-OCR'
  );

  // -------------------------------------------------------------
  // Test 10: "4G Prepaid reload via Banks/Third-party (Food City, Singer, Abans)" -> BILL_SR_ONLY
  // -------------------------------------------------------------
  console.log('\nScenario 10: 4G Prepaid Reload via Third-Party / Commercial Retailers');
  const rule4gThird = findRuleForTest(
    ASSET_TYPES.BILLING,
    'reload food city',
    'RULE_4G_RELOAD_THIRD_PARTY_CHANNELS'
  );
  const eval4gThird = rule4gThird.evaluate({
    asset_type: ASSET_TYPES.BILLING,
    symptom: '4G prepaid reload at Food City counter failed',
    customer_context: { slt_number: '0719876543' },
    billing_context: {
      channel_type: RELOAD_CHANNELS.FOOD_CITY,
      amount: 2000,
      transaction_date: new Date('2026-10-16T10:00:00Z'),
    },
  });
  assert(
    eval4gThird.isValid &&
      eval4gThird.action_type === ACTION_TYPES.BILL_SR_ONLY &&
      eval4gThird.assigned_group === SUPPORT_GROUPS.NONE &&
      eval4gThird.advice_instructions.includes('Advise customer to contact their respective Bank or Merchant'),
    'Applies BILL_SR_ONLY for Food City reload and advises merchant refund'
  );

  // -------------------------------------------------------------
  // Test 11: "Fiber Voice line faulty" -> Dynamic PON Routing (ON: MDF, OFF/Blinking: AREA-MTCE)
  // -------------------------------------------------------------
  console.log('\nScenario 11: Fiber Voice Line Faulty - Dynamic PON Routing');
  const ruleFiberVoice = findRuleForTest(
    ASSET_TYPES.VOICE,
    'fiber voice line faulty',
    'RULE_FIBER_VOICE_LINE_FAULT'
  );

  // Test 11A: PON is ON -> Dispatches to MDF
  const evalPonOn = ruleFiberVoice.evaluate({
    asset_type: ASSET_TYPES.VOICE,
    symptom: 'fiber voice line faulty no dial tone',
    customer_context: { slt_number: '0112445566' },
    technical_context: { pon_status: PON_STATUS.ON },
  });
  assert(
    evalPonOn.isValid &&
      evalPonOn.action_type === ACTION_TYPES.DIRECT_TT &&
      evalPonOn.assigned_group === SUPPORT_GROUPS.MDF,
    'Routes Fiber Voice to MDF when PON status is ON (Optical signal healthy)'
  );

  // Test 11B: PON is OFF -> Dispatches to AREA-MTCE
  const evalPonOff = ruleFiberVoice.evaluate({
    asset_type: ASSET_TYPES.VOICE,
    symptom: 'fiber telephone dead',
    customer_context: { slt_number: '0112445566' },
    technical_context: { pon_status: PON_STATUS.OFF },
  });
  assert(
    evalPonOff.isValid &&
      evalPonOff.action_type === ACTION_TYPES.DIRECT_TT &&
      evalPonOff.assigned_group === SUPPORT_GROUPS.AREA_MTCE,
    'Routes Fiber Voice to AREA-MTCE when PON status is OFF'
  );

  // Test 11C: PON is BLINKING -> Dispatches to AREA-MTCE
  const evalPonBlink = ruleFiberVoice.evaluate({
    asset_type: ASSET_TYPES.VOICE,
    symptom: 'fiber telephone dead',
    customer_context: { slt_number: '0112445566' },
    technical_context: { pon_status: PON_STATUS.BLINKING },
  });
  assert(
    evalPonBlink.isValid &&
      evalPonBlink.action_type === ACTION_TYPES.DIRECT_TT &&
      evalPonBlink.assigned_group === SUPPORT_GROUPS.AREA_MTCE,
    'Routes Fiber Voice to AREA-MTCE when PON status is BLINKING'
  );

  // -------------------------------------------------------------
  // Test 12: "PING is high" -> DIRECT_TT -> CEN-CSC-TECH
  // -------------------------------------------------------------
  console.log('\nScenario 12: PING is High (Gaming / Peering Latency)');
  const rulePing = findRuleForTest(
    ASSET_TYPES.DATA,
    'ping is high',
    'RULE_HIGH_PING_GAMING'
  );

  // Test 12A: Missing game details
  const evalPingMissing = rulePing.evaluate({
    asset_type: ASSET_TYPES.DATA,
    symptom: 'ping is high in games',
    customer_context: { slt_number: '0112555666' },
    technical_context: { ping_delay_ms: 180 }, // missing game_name
  });
  assert(
    !evalPingMissing.isValid && evalPingMissing.errors.some((e) => e.includes('game_name')),
    'Rejects ticket dispatch when game_name is missing'
  );

  // Test 12B: Complete gaming context
  const evalPingPass = rulePing.evaluate({
    asset_type: ASSET_TYPES.DATA,
    symptom: 'high ping latency during competitive match',
    customer_context: { slt_number: '0112555666' },
    technical_context: {
      game_name: 'Valorant (Singapore 1 Server)',
      ping_delay_ms: 185,
    },
  });
  assert(
    evalPingPass.isValid &&
      evalPingPass.action_type === ACTION_TYPES.DIRECT_TT &&
      evalPingPass.assigned_group === SUPPORT_GROUPS.CEN_CSC_TECH,
    'Routes high ping report with game name and ping latency to CEN-CSC-TECH'
  );

  // -------------------------------------------------------------
  // Test 13: "PEO mobile / Timely pay offer / Kaspersky / Dual band router request" -> CQMS_COMPLAINT
  // -------------------------------------------------------------
  console.log('\nScenario 13: Commercial Offers, VAS & Router Requests (CQMS)');
  const ruleCqms = findRuleForTest(
    ASSET_TYPES.VAS,
    'timely pay offer',
    'RULE_CQMS_VAS_AND_PROMOS'
  );
  const evalCqms = ruleCqms.evaluate({
    asset_type: ASSET_TYPES.VAS,
    symptom: 'Customer asking for timely pay offer and dual band router request',
    customer_context: { slt_number: '0112666777' },
  });
  assert(
    evalCqms.isValid &&
      evalCqms.action_type === ACTION_TYPES.CQMS_COMPLAINT &&
      evalCqms.assigned_group === SUPPORT_GROUPS.NONE,
    'Classifies promotional inquiry / dual band router request as CQMS_COMPLAINT'
  );

  // -------------------------------------------------------------
  // Test 14: FaultReport Mongoose Model Pre-validate and Lifecycle Hooks
  // -------------------------------------------------------------
  console.log('\nScenario 14: FaultReport Mongoose Model Validation Hooks');

  // Test 14A: Auto report_number generation and prefixes
  const reportDirectTT = new FaultReport({
    asset_type: ASSET_TYPES.DATA,
    symptom: 'LOS red alarm',
    action_type: ACTION_TYPES.DIRECT_TT,
    assigned_group: SUPPORT_GROUPS.AREA_MTCE,
    customer_context: { slt_number: '0112999888' },
    pre_check_flags: { ldap_checked: true, gb_portal_checked: true },
  });
  await reportDirectTT.validate();
  assert(
    reportDirectTT.report_number && reportDirectTT.report_number.startsWith('TT-'),
    `DIRECT_TT generated prefix TT- (${reportDirectTT.report_number})`
  );

  const reportBillSR = new FaultReport({
    asset_type: ASSET_TYPES.BILLING,
    symptom: 'Food city recharge error',
    action_type: ACTION_TYPES.BILL_SR_ONLY,
    assigned_group: SUPPORT_GROUPS.NONE,
    customer_context: { slt_number: '0712345678' },
  });
  await reportBillSR.validate();
  assert(
    reportBillSR.report_number && reportBillSR.report_number.startsWith('SR-'),
    `BILL_SR_ONLY generated prefix SR- (${reportBillSR.report_number})`
  );

  const reportCQMS = new FaultReport({
    asset_type: ASSET_TYPES.VAS,
    symptom: 'Kaspersky antivirus license renewal inquiry',
    action_type: ACTION_TYPES.CQMS_COMPLAINT,
    assigned_group: SUPPORT_GROUPS.NONE,
    customer_context: { slt_number: '0112777888' },
  });
  await reportCQMS.validate();
  assert(
    reportCQMS.report_number && reportCQMS.report_number.startsWith('CQ-'),
    `CQMS_COMPLAINT generated prefix CQ- (${reportCQMS.report_number})`
  );

  // Test 14B: DIRECT_TT with assigned_group NONE should be rejected by pre-validate hook
  const invalidDirectTT = new FaultReport({
    asset_type: ASSET_TYPES.DATA,
    symptom: 'LOS red',
    action_type: ACTION_TYPES.DIRECT_TT,
    assigned_group: SUPPORT_GROUPS.NONE, // Forbidden for DIRECT_TT
    customer_context: { slt_number: '0112888999' },
  });
  let capturedError = null;
  try {
    await invalidDirectTT.validate();
  } catch (err) {
    capturedError = err;
  }
  assert(
    capturedError && capturedError.errors && capturedError.errors['assigned_group'],
    'Pre-validate hook forbids DIRECT_TT with assigned_group = NONE'
  );

  // -------------------------------------------------------------
  // Test Summary
  // -------------------------------------------------------------
  console.log('\n================================================================');
  console.log(` TEST SUMMARY: ${passedTests} PASSED, ${failedTests} FAILED`);
  console.log('================================================================\n');

  if (failedTests > 0) {
    process.exit(1);
  }
}

runTestSuite().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
