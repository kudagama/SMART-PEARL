/**
 * Fault Report Controller
 * Handles HTTP API endpoints for ticket triage, dispatch, and rule querying.
 * Compatible with Express.js and Next.js Route Handlers.
 */

const FaultTriageService = require('../services/faultTriageService');
const FaultReport = require('../models/FaultReport');
const FaultRule = require('../models/FaultRule');

class FaultReportController {
  /**
   * Endpoint: POST /api/faults/triage
   * Validates incoming fault report against triage rules and creates ticket
   */
  static async createFaultReport(req, res) {
    try {
      const payload = req.body || {};
      const options = {
        persistToDb: req.query?.persist !== 'false',
        allowDraftOnFailure: req.body?.save_failed_audit === true,
      };

      const result = await FaultTriageService.triageAndCreateReport(payload, options);

      if (!result.success) {
        const statusCode = result.status === 'BAD_REQUEST' ? 400 : 422;
        return res.status(statusCode).json({
          success: false,
          status: result.status,
          message: result.message,
          matched_rule: result.matched_rule,
          validation_errors: result.errors,
          action_advice: result.advice,
        });
      }

      return res.status(201).json({
        success: true,
        status: result.status,
        message: result.message,
        ticket: {
          report_number: result.fault_report.report_number,
          asset_type: result.fault_report.asset_type,
          symptom: result.fault_report.symptom,
          action_type: result.fault_report.action_type,
          assigned_group: result.fault_report.assigned_group,
          ticket_status: result.fault_report.ticket_status,
          action_advice: result.fault_report.action_advice,
          triage_notes: result.fault_report.triage_notes,
          customer_context: result.fault_report.customer_context,
          technical_context: result.fault_report.technical_context,
          billing_context: result.fault_report.billing_context,
          pre_check_flags: result.fault_report.pre_check_flags,
          created_at: result.fault_report.createdAt,
        },
        matched_rule: result.matched_rule,
        evaluation: result.evaluation,
      });
    } catch (error) {
      console.error('[FaultReportController.createFaultReport] Error:', error);
      return res.status(500).json({
        success: false,
        status: 'INTERNAL_SERVER_ERROR',
        message: error.message || 'An unexpected error occurred during ticket triage.',
      });
    }
  }

  /**
   * Endpoint: GET /api/faults/:reportNumber
   * Fetch ticket details and full audit history
   */
  static async getFaultReport(req, res) {
    try {
      const { reportNumber } = req.params;
      const report = await FaultTriageService.getReportByNumber(reportNumber);

      if (!report) {
        return res.status(404).json({
          success: false,
          status: 'NOT_FOUND',
          message: `Ticket with Report Number '${reportNumber}' not found.`,
        });
      }

      return res.status(200).json({
        success: true,
        ticket: report,
      });
    } catch (error) {
      console.error('[FaultReportController.getFaultReport] Error:', error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * Endpoint: GET /api/faults
   * List tickets with filtering by group, status, slt_number, or asset_type
   */
  static async listFaultReports(req, res) {
    try {
      const { group, status, slt_number, asset_type, limit = 50, page = 1 } = req.query;

      const query = {};
      if (group) query.assigned_group = group;
      if (status) query.ticket_status = status;
      if (slt_number) query['customer_context.slt_number'] = slt_number;
      if (asset_type) query.asset_type = asset_type;

      const skip = (Math.max(1, parseInt(page, 10)) - 1) * parseInt(limit, 10);

      const [reports, total] = await Promise.all([
        FaultReport.find(query)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(parseInt(limit, 10))
          .populate('matched_rule_id', 'rule_code rule_name')
          .lean(),
        FaultReport.countDocuments(query),
      ]);

      return res.status(200).json({
        success: true,
        total,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        tickets: reports,
      });
    } catch (error) {
      console.error('[FaultReportController.listFaultReports] Error:', error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * Endpoint: GET /api/faults/rules
   * Query all active master triage rules
   */
  static async listTriageRules(req, res) {
    try {
      const { asset_type } = req.query;
      const rules = await FaultTriageService.searchTriageRules({ asset_type });

      return res.status(200).json({
        success: true,
        count: rules.length,
        rules,
      });
    } catch (error) {
      console.error('[FaultReportController.listTriageRules] Error:', error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = FaultReportController;
