/**
 * Fault Triage & Validation Service
 * Core business engine enforcing official Telecom TT & SR triage rules.
 */

const FaultRule = require('../models/FaultRule');
const FaultReport = require('../models/FaultReport');
const { ACTION_TYPES, SUPPORT_GROUPS, TICKET_STATUS } = require('../models/enums');

class FaultTriageService {
  /**
   * Evaluates an incoming customer issue against the master rules repository,
   * performs strict validation, and creates an official FaultReport document.
   *
   * @param {Object} ticketData - The payload containing issue details, contexts, and pre-checks
   * @param {Object} [options] - Optional execution flags (e.g. persistToDb, allowDraftOnFailure)
   * @returns {Promise<Object>} Triage outcome with created report or validation failure details
   */
  static async triageAndCreateReport(ticketData, options = {}) {
    const { persistToDb = true, allowDraftOnFailure = false } = options;

    const {
      asset_type,
      symptom,
      rule_code,
      customer_context,
      technical_context = {},
      billing_context = {},
      pre_check_flags = {},
      created_by = 'SYSTEM_TRIAGE',
    } = ticketData;

    // 1. Basic structural validation
    if (!asset_type) {
      return {
        success: false,
        status: 'BAD_REQUEST',
        message: 'Missing mandatory field: asset_type (VOICE, DATA, PEOTV, VAS, ROUTER, BILLING).',
      };
    }
    if (!symptom) {
      return {
        success: false,
        status: 'BAD_REQUEST',
        message: 'Missing mandatory field: symptom description.',
      };
    }
    if (!customer_context || !customer_context.slt_number) {
      return {
        success: false,
        status: 'BAD_REQUEST',
        message: 'Missing mandatory customer context: slt_number is required.',
      };
    }

    // 2. Query Master Rules Repository
    let matchedRule = await FaultRule.findMatchingRule({ asset_type, symptom, rule_code });

    // Fallback if rule not found in database
    if (!matchedRule) {
      return {
        success: false,
        status: 'NO_MATCHING_RULE',
        message: `No active triage rule found for Asset Type: '${asset_type}' and Symptom: '${symptom}'. Escalate to supervisor.`,
        recommended_action: ACTION_TYPES.INFORM_SUPERVISOR,
        target_group: SUPPORT_GROUPS.NONE,
      };
    }

    // 3. Evaluate Rule Pre-conditions, Thresholds, Pre-checks, and Dynamic Routing
    const evaluation = matchedRule.evaluate({
      asset_type,
      symptom,
      customer_context,
      technical_context,
      billing_context,
      pre_check_flags,
    });

    // 4. Handle Validation Failures (Pre-check failed, threshold unmet, or missing required field)
    if (!evaluation.isValid) {
      let rejectedReport = null;

      if (persistToDb && allowDraftOnFailure) {
        // Save as REJECTED record for telecom compliance audit trail
        rejectedReport = new FaultReport({
          asset_type,
          symptom,
          customer_context,
          technical_context,
          billing_context,
          pre_check_flags,
          matched_rule_id: matchedRule._id,
          action_type: evaluation.action_type || matchedRule.action_type,
          assigned_group: SUPPORT_GROUPS.NONE,
          ticket_status: TICKET_STATUS.REJECTED,
          action_advice: evaluation.advice_instructions || matchedRule.advice_instructions,
          triage_notes: `Validation failed against ${matchedRule.rule_code}: ${evaluation.errors.join('; ')}`,
          validation_errors: evaluation.errors,
          created_by,
        });

        try {
          await rejectedReport.save();
        } catch (saveErr) {
          console.error('[FaultTriageService] Failed to record rejected audit report:', saveErr.message);
        }
      }

      return {
        success: false,
        status: 'VALIDATION_FAILED',
        message: `Ticket validation failed against rule: ${matchedRule.rule_name} (${matchedRule.rule_code})`,
        matched_rule: {
          id: matchedRule._id,
          code: matchedRule.rule_code,
          name: matchedRule.rule_name,
        },
        errors: evaluation.errors,
        advice: evaluation.advice_instructions || matchedRule.advice_instructions,
        rejected_report_id: rejectedReport ? rejectedReport._id : null,
      };
    }

    // 5. Build Validated FaultReport Document
    const initialStatus =
      evaluation.action_type === ACTION_TYPES.DIRECT_TT
        ? TICKET_STATUS.DISPATCHED
        : TICKET_STATUS.TRIAGED;

    const reportDoc = new FaultReport({
      asset_type,
      symptom,
      customer_context,
      technical_context,
      billing_context,
      pre_check_flags,
      matched_rule_id: matchedRule._id,
      action_type: evaluation.action_type,
      assigned_group: evaluation.assigned_group,
      ticket_status: initialStatus,
      action_advice: evaluation.advice_instructions,
      triage_notes: evaluation.routing_reason,
      created_by,
    });

    // 6. Persist to Database if requested
    if (persistToDb) {
      await reportDoc.save();
    }

    return {
      success: true,
      status: 'TRIAGED_SUCCESSFULLY',
      message: `Ticket successfully triaged: [${evaluation.action_type}] assigned to [${evaluation.assigned_group}].`,
      matched_rule: {
        id: matchedRule._id,
        code: matchedRule.rule_code,
        name: matchedRule.rule_name,
      },
      evaluation: {
        action_type: evaluation.action_type,
        assigned_group: evaluation.assigned_group,
        routing_reason: evaluation.routing_reason,
        advice_instructions: evaluation.advice_instructions,
      },
      fault_report: reportDoc,
    };
  }

  /**
   * Lookup ticket details by report number
   */
  static async getReportByNumber(reportNumber) {
    return FaultReport.findOne({ report_number: reportNumber })
      .populate('matched_rule_id', 'rule_code rule_name description')
      .lean();
  }

  /**
   * Get operational dispatch queue for a support group
   */
  static async getQueueBySupportGroup(groupName, status = TICKET_STATUS.DISPATCHED) {
    const query = { assigned_group: groupName };
    if (status) query.ticket_status = status;
    return FaultReport.find(query).sort({ createdAt: 1 }).lean();
  }

  /**
   * Search active rules repository
   */
  static async searchTriageRules(query = {}) {
    const filter = { is_active: true };
    if (query.asset_type) filter.asset_type = query.asset_type;
    return FaultRule.find(filter).sort({ priority: -1 }).lean();
  }
}

module.exports = FaultTriageService;
