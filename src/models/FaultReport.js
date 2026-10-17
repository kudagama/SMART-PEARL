const mongoose = require('mongoose');
const {
  ACTION_TYPES,
  SUPPORT_GROUPS,
  ASSET_TYPES,
  PON_STATUS,
  TICKET_STATUS,
} = require('./enums');

/**
 * Customer Context Subschema
 */
const CustomerContextSchema = new mongoose.Schema(
  {
    slt_number: {
      type: String,
      required: [true, 'SLT Account or Identification number is mandatory'],
      trim: true,
      index: true,
      validate: {
        validator: function (v) {
          // Validates SLT voice/broadband numbers or subscriber account strings
          return /^[0-9A-Za-z-]{7,20}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid SLT account or telephone number format`,
      },
    },
    contact_email: {
      type: String,
      trim: true,
      lowercase: true,
      validate: {
        validator: function (v) {
          return !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: (props) => `${props.value} is not a valid email address`,
      },
    },
    contact_phone: {
      type: String,
      trim: true,
      validate: {
        validator: function (v) {
          return !v || /^[0-9+]{9,15}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid contact phone number`,
      },
    },
    service_type: {
      type: String,
      enum: ['FTTH', 'ADSL', '4G_LTE_PREPAID', '4G_LTE_POSTPAID', 'PEOTV', 'COPPER_VOICE', 'VAS', 'OTHER'],
      default: 'FTTH',
    },
    customer_name: {
      type: String,
      trim: true,
    },
    installation_address: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

/**
 * Technical Context Subschema
 * Captures live network, modem, speed, and latency diagnostics
 */
const TechnicalContextSchema = new mongoose.Schema(
  {
    pon_status: {
      type: String,
      enum: {
        values: Object.values(PON_STATUS),
        message: '{VALUE} is not a valid PON status',
      },
      default: PON_STATUS.NOT_APPLICABLE,
    },
    measured_speed_mbps: {
      type: Number,
      min: [0, 'Measured speed cannot be negative'],
    },
    game_name: {
      type: String,
      trim: true,
    },
    ping_delay_ms: {
      type: Number,
      min: [0, 'Ping latency cannot be negative'],
    },
    addon_name: {
      type: String,
      trim: true,
    },
    error_message: {
      type: String,
      trim: true,
    },
    device_age_months: {
      type: Number,
      min: [0, 'Device age cannot be negative'],
    },
    device_serial_number: {
      type: String,
      trim: true,
    },
    optical_rx_power_dbm: {
      type: Number,
    },
  },
  { _id: false }
);

/**
 * Billing & Reload Context Subschema
 * Stores recharge details, channels, and transaction identifiers
 */
const BillingContextSchema = new mongoose.Schema(
  {
    channel_type: {
      type: String,
      trim: true,
    },
    amount: {
      type: Number,
      min: [0, 'Amount cannot be negative'],
    },
    transaction_date: {
      type: Date,
    },
    reference_id: {
      type: String,
      trim: true,
    },
    payment_mode: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

/**
 * Operational Pre-Check Verification Flags Subschema
 */
const PreCheckFlagsSchema = new mongoose.Schema(
  {
    ldap_checked: {
      type: Boolean,
      default: false,
    },
    gb_portal_checked: {
      type: Boolean,
      default: false,
    },
    peotv_admin_checked: {
      type: Boolean,
      default: false,
    },
    low_pay_bill_verified: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

/**
 * Audit Trail History Entry
 */
const AuditHistorySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: Object.values(TICKET_STATUS),
      required: true,
    },
    action_type: {
      type: String,
      enum: Object.values(ACTION_TYPES),
      required: true,
    },
    assigned_group: {
      type: String,
      enum: Object.values(SUPPORT_GROUPS),
      required: true,
    },
    remarks: {
      type: String,
      trim: true,
    },
    updated_by: {
      type: String,
      default: 'SYSTEM',
    },
    updated_at: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

/**
 * Main Fault Report Schema
 */
const FaultReportSchema = new mongoose.Schema(
  {
    report_number: {
      type: String,
      unique: true,
      index: true,
      trim: true,
      default: function () {
        const today = new Date();
        const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
        const randomHex = Math.floor(1000 + Math.random() * 9000);

        let prefix = 'FR';
        switch (this.action_type) {
          case ACTION_TYPES.DIRECT_TT:
            prefix = 'TT';
            break;
          case ACTION_TYPES.BILL_SR_ONLY:
            prefix = 'SR';
            break;
          case ACTION_TYPES.CQMS_COMPLAINT:
            prefix = 'CQ';
            break;
          case ACTION_TYPES.DONT_REPORT_TT:
            prefix = 'NTR';
            break;
          case ACTION_TYPES.INFORM_SUPERVISOR:
            prefix = 'ESC';
            break;
          case ACTION_TYPES.CUSTOMER_SELF_CARE:
            prefix = 'SC';
            break;
        }

        return `${prefix}-${dateStr}-${randomHex}`;
      },
    },
    asset_type: {
      type: String,
      required: [true, 'Asset type is mandatory'],
      enum: {
        values: Object.values(ASSET_TYPES),
        message: '{VALUE} is not a valid Asset Type',
      },
      index: true,
    },
    symptom: {
      type: String,
      required: [true, 'Customer symptom / issue description is mandatory'],
      trim: true,
    },
    customer_context: {
      type: CustomerContextSchema,
      required: true,
    },
    technical_context: {
      type: TechnicalContextSchema,
      default: () => ({}),
    },
    billing_context: {
      type: BillingContextSchema,
      default: () => ({}),
    },
    pre_check_flags: {
      type: PreCheckFlagsSchema,
      default: () => ({}),
    },
    matched_rule_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FaultRule',
      index: true,
    },
    action_type: {
      type: String,
      required: [true, 'Action type is mandatory'],
      enum: {
        values: Object.values(ACTION_TYPES),
        message: '{VALUE} is not a valid Action Type',
      },
      index: true,
    },
    assigned_group: {
      type: String,
      required: [true, 'Assigned support group is mandatory'],
      enum: {
        values: Object.values(SUPPORT_GROUPS),
        message: '{VALUE} is not a valid Support Group',
      },
      index: true,
    },
    ticket_status: {
      type: String,
      required: true,
      enum: {
        values: Object.values(TICKET_STATUS),
        message: '{VALUE} is not a valid Ticket Status',
      },
      default: TICKET_STATUS.NEW,
      index: true,
    },
    action_advice: {
      type: String,
      trim: true,
      default: '',
    },
    triage_notes: {
      type: String,
      trim: true,
      default: '',
    },
    validation_errors: [
      {
        type: String,
      },
    ],
    history: {
      type: [AuditHistorySchema],
      default: [],
    },
    created_by: {
      type: String,
      default: 'AGENT',
      trim: true,
    },
    closed_at: {
      type: Date,
    },
  },
  {
    timestamps: true,
    collection: 'fault_reports',
  }
);

// High performance compound indexes for telecom operations
FaultReportSchema.index({ 'customer_context.slt_number': 1, createdAt: -1 });
FaultReportSchema.index({ assigned_group: 1, ticket_status: 1 });
FaultReportSchema.index({ action_type: 1, ticket_status: 1 });
FaultReportSchema.index({ createdAt: -1 });

/**
 * Pre-validate Hook: Cross-field business rule integrity
 */
FaultReportSchema.pre('validate', function () {
  // 1. Direct Trouble Tickets must be dispatched to an operational group (not NONE)
  if (this.action_type === ACTION_TYPES.DIRECT_TT && this.assigned_group === SUPPORT_GROUPS.NONE) {
    this.invalidate(
      'assigned_group',
      `Action type '${ACTION_TYPES.DIRECT_TT}' requires a valid operational group; '${SUPPORT_GROUPS.NONE}' is not permitted.`
    );
  }

  // 2. DONT_REPORT_TT should typically target NONE
  if (this.action_type === ACTION_TYPES.DONT_REPORT_TT && this.assigned_group !== SUPPORT_GROUPS.NONE) {
    this.assigned_group = SUPPORT_GROUPS.NONE;
  }

  // 3. Auto-generate report_number if not already set
  if (!this.report_number) {
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
    const randomHex = Math.floor(1000 + Math.random() * 9000);

    let prefix = 'FR';
    switch (this.action_type) {
      case ACTION_TYPES.DIRECT_TT:
        prefix = 'TT';
        break;
      case ACTION_TYPES.BILL_SR_ONLY:
        prefix = 'SR';
        break;
      case ACTION_TYPES.CQMS_COMPLAINT:
        prefix = 'CQ';
        break;
      case ACTION_TYPES.DONT_REPORT_TT:
        prefix = 'NTR';
        break;
      case ACTION_TYPES.INFORM_SUPERVISOR:
        prefix = 'ESC';
        break;
      case ACTION_TYPES.CUSTOMER_SELF_CARE:
        prefix = 'SC';
        break;
    }

    this.report_number = `${prefix}-${dateStr}-${randomHex}`;
  }
});

/**
 * Pre-save Hook: Maintain audit trail
 */
FaultReportSchema.pre('save', function () {
  if (this.isNew || this.isModified('ticket_status') || this.isModified('assigned_group')) {
    this.history.push({
      status: this.ticket_status,
      action_type: this.action_type,
      assigned_group: this.assigned_group,
      remarks: this.isNew
        ? `Ticket created with action: ${this.action_type}`
        : `Ticket state transition to ${this.ticket_status}`,
      updated_by: this.created_by || 'SYSTEM',
      updated_at: new Date(),
    });
  }
});

const FaultReport = mongoose.models.FaultReport || mongoose.model('FaultReport', FaultReportSchema);

module.exports = FaultReport;
