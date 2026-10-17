/**
 * Enums and Domain Constants for Telecom Fault Reporting System
 * Compliant with SLT Trouble Ticket (TT) & Service Request (SR) Triage Specifications.
 */

const ACTION_TYPES = Object.freeze({
  DIRECT_TT: 'DIRECT_TT',
  DONT_REPORT_TT: 'DONT_REPORT_TT',
  BILL_SR_ONLY: 'BILL_SR_ONLY',
  INFORM_SUPERVISOR: 'INFORM_SUPERVISOR',
  CQMS_COMPLAINT: 'CQMS_COMPLAINT',
  CUSTOMER_SELF_CARE: 'CUSTOMER_SELF_CARE',
});

const SUPPORT_GROUPS = Object.freeze({
  AREA_MTCE: 'AREA-MTCE',
  INT_NW_SYS_ADMIN: 'INT-NW-SYS-ADMIN',
  CEN_CSC_UI: 'CEN-CSC-UI',
  BSS_OPR_OCR: 'BSS-OPR-OCR',
  CEN_CSC_TECH: 'CEN-CSC-TECH',
  CEN_CSC_DATA: 'CEN-CSC-DATA',
  SF_VOICE_NET: 'SF-VOICE-NET',
  MDF: 'MDF',
  NONE: 'NONE',
});

const ASSET_TYPES = Object.freeze({
  VOICE: 'VOICE',
  DATA: 'DATA',
  PEOTV: 'PEOTV',
  VAS: 'VAS',
  ROUTER: 'ROUTER',
  BILLING: 'BILLING',
});

const PON_STATUS = Object.freeze({
  ON: 'ON',
  OFF: 'OFF',
  BLINKING: 'BLINKING',
  NOT_APPLICABLE: 'NOT_APPLICABLE',
});

const TICKET_STATUS = Object.freeze({
  NEW: 'NEW',
  TRIAGED: 'TRIAGED',
  DISPATCHED: 'DISPATCHED',
  REJECTED: 'REJECTED',
  RESOLVED: 'RESOLVED',
  CLOSED: 'CLOSED',
});

const RELOAD_CHANNELS = Object.freeze({
  // Direct / Official SLT-Mobitel Channels
  MOBITEL_DEALERS: 'Mobitel dealers',
  MY_SLT: 'My SLT',
  MCASH: 'mCash',
  // Third-Party Channels
  BANKS: 'Banks',
  FOOD_CITY: 'Food City',
  SINGER: 'Singer',
  ABANS: 'Abans',
  THIRD_PARTY: 'Third-party',
});

module.exports = {
  ACTION_TYPES,
  SUPPORT_GROUPS,
  ASSET_TYPES,
  PON_STATUS,
  TICKET_STATUS,
  RELOAD_CHANNELS,
};
