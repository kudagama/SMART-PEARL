const mongoose = require('mongoose');
const { ACTION_TYPES, SUPPORT_GROUPS, ASSET_TYPES, PON_STATUS } = require('./enums');

/**
 * Conditional Routing Schema
 * Handles dynamic routing scenarios such as Fiber Voice routing based on PON LED state
 */
const ConditionalRoutingSchema = new mongoose.Schema(
  {
    condition_field: {
      type: String,
      required: [true, 'condition_field path is required (e.g., technical_context.pon_status)'],
      trim: true,
    },
    operator: {
      type: String,
      enum: ['eq', 'ne', 'in', 'nin', 'lt', 'lte', 'gt', 'gte'],
      default: 'eq',
    },
    value: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    action_type: {
      type: String,
      enum: Object.values(ACTION_TYPES),
    },
    target_group: {
      type: String,
      enum: Object.values(SUPPORT_GROUPS),
      required: true,
    },
    advice_instructions: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

/**
 * Validation Requirements Schema
 * Defines mandatory context fields, pre-checks (LDAP, GB Portal, etc.), and thresholds
 */
const ValidationRequirementsSchema = new mongoose.Schema(
  {
    required_fields: [
      {
        type: String,
        trim: true,
      },
    ],
    pre_checks: {
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
    thresholds: {
      max_speed_mbps: {
        type: Number,
        min: 0,
      },
      min_speed_mbps: {
        type: Number,
        min: 0,
      },
      max_device_age_months: {
        type: Number,
        min: 0,
      },
      min_device_age_months: {
        type: Number,
        min: 0,
      },
      allowed_channels: [
        {
          type: String,
          trim: true,
        },
      ],
    },
  },
  { _id: false }
);

/**
 * Master Fault Rule Schema
 */
const FaultRuleSchema = new mongoose.Schema(
  {
    rule_code: {
      type: String,
      required: [true, 'Unique rule_code is mandatory (e.g., RULE_LOS_RED)'],
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    rule_name: {
      type: String,
      required: [true, 'Rule name is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
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
    symptom_patterns: [
      {
        type: String,
        lowercase: true,
        trim: true,
      },
    ],
    action_type: {
      type: String,
      required: [true, 'Action type is mandatory'],
      enum: {
        values: Object.values(ACTION_TYPES),
        message: '{VALUE} is not a valid Action Type',
      },
    },
    target_group: {
      type: String,
      required: [true, 'Target support group is mandatory'],
      enum: {
        values: Object.values(SUPPORT_GROUPS),
        message: '{VALUE} is not a valid Support Group',
      },
    },
    conditional_routing: {
      type: [ConditionalRoutingSchema],
      default: [],
    },
    validation_requirements: {
      type: ValidationRequirementsSchema,
      default: () => ({}),
    },
    advice_instructions: {
      type: String,
      trim: true,
      default: '',
    },
    is_active: {
      type: Boolean,
      default: true,
      index: true,
    },
    priority: {
      type: Number,
      default: 100, // Higher numbers evaluated first
      index: true,
    },
  },
  {
    timestamps: true,
    collection: 'fault_rules',
  }
);

// Indexes for high performance rule resolution and text search
FaultRuleSchema.index({ asset_type: 1, is_active: 1, priority: -1 });
FaultRuleSchema.index(
  {
    rule_name: 'text',
    description: 'text',
    symptom_patterns: 'text',
  },
  {
    weights: {
      rule_name: 10,
      symptom_patterns: 5,
      description: 1,
    },
    name: 'fault_rule_text_idx',
  }
);

/**
 * Utility helper to safely get nested values by string path (e.g., 'technical_context.pon_status')
 */
function getNestedValue(obj, path) {
  if (!obj || !path) return undefined;
  return path.split('.').reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined), obj);
}

/**
 * Instance Method: Evaluate a ticket payload against this rule's conditions, pre-checks, and thresholds.
 *
 * @param {Object} payload - The ticket data to validate
 * @returns {Object} { isValid: boolean, action_type: string, assigned_group: string, advice_instructions: string, errors: string[], routing_reason: string }
 */
FaultRuleSchema.methods.evaluate = function (payload) {
  const errors = [];
  const reqs = this.validation_requirements || {};
  const preChecks = reqs.pre_checks || {};
  const thresholds = reqs.thresholds || {};

  // 1. Validate Mandatory Pre-check Flags
  if (preChecks.ldap_checked && !payload.pre_check_flags?.ldap_checked) {
    errors.push('Mandatory pre-check failed: LDAP verification is required before dispatching ticket.');
  }
  if (preChecks.gb_portal_checked && !payload.pre_check_flags?.gb_portal_checked) {
    errors.push('Mandatory pre-check failed: GB Portal optical/line verification is required.');
  }
  if (preChecks.peotv_admin_checked && !payload.pre_check_flags?.peotv_admin_checked) {
    errors.push('Mandatory pre-check failed: PEOTV Admin portal verification is required.');
  }
  if (preChecks.low_pay_bill_verified && !payload.pre_check_flags?.low_pay_bill_verified) {
    errors.push('Mandatory pre-check failed: Low pay bill / payment policy verification is required.');
  }

  // 2. Validate Required Dynamic Context Fields
  if (Array.isArray(reqs.required_fields)) {
    for (const fieldPath of reqs.required_fields) {
      const val = getNestedValue(payload, fieldPath);
      if (val === undefined || val === null || val === '') {
        errors.push(`Missing mandatory field: '${fieldPath}' is required for rule ${this.rule_code}.`);
      }
    }
  }

  // 3. Validate Speed Thresholds (e.g. Unlimited slowness < 40 Mbps)
  if (thresholds.max_speed_mbps !== undefined && thresholds.max_speed_mbps !== null) {
    const speed = payload.technical_context?.measured_speed_mbps;
    if (typeof speed !== 'number') {
      errors.push(`Measured speed must be provided as a number for rule ${this.rule_code}.`);
    } else if (speed >= thresholds.max_speed_mbps) {
      errors.push(
        `Measured speed (${speed} Mbps) is not below maximum threshold (${thresholds.max_speed_mbps} Mbps). Ticket dispatch to AREA-MTCE is not permitted.`
      );
    }
  }

  if (thresholds.min_speed_mbps !== undefined && thresholds.min_speed_mbps !== null) {
    const speed = payload.technical_context?.measured_speed_mbps;
    if (typeof speed === 'number' && speed < thresholds.min_speed_mbps) {
      errors.push(`Measured speed (${speed} Mbps) is below minimum threshold (${thresholds.min_speed_mbps} Mbps).`);
    }
  }

  // 4. Validate Device Age Thresholds (e.g. Remote warranty <= 6 Months or > 6 Months)
  if (thresholds.max_device_age_months !== undefined && thresholds.max_device_age_months !== null) {
    const age = payload.technical_context?.device_age_months;
    if (typeof age === 'number' && age > thresholds.max_device_age_months) {
      errors.push(
        `Device age (${age} months) exceeds warranty maximum threshold (${thresholds.max_device_age_months} months).`
      );
    }
  }

  if (thresholds.min_device_age_months !== undefined && thresholds.min_device_age_months !== null) {
    const age = payload.technical_context?.device_age_months;
    if (typeof age === 'number' && age <= thresholds.min_device_age_months) {
      errors.push(
        `Device age (${age} months) is within warranty period (<= ${Math.floor(thresholds.min_device_age_months)} months).`
      );
    }
  }

  // 5. Validate Allowed Channels (e.g. Reload channels)
  if (Array.isArray(thresholds.allowed_channels) && thresholds.allowed_channels.length > 0) {
    const channel = payload.billing_context?.channel_type;
    const isChannelMatched = thresholds.allowed_channels.some(
      (c) => channel && c.toLowerCase().trim() === channel.toLowerCase().trim()
    );
    if (!isChannelMatched) {
      errors.push(
        `Channel '${channel}' is not valid for rule ${this.rule_code}. Allowed channels: ${thresholds.allowed_channels.join(', ')}.`
      );
    }
  }

  // 6. Dynamic / Conditional Routing Resolution (e.g., Fiber Voice PON status)
  let resolvedAction = this.action_type;
  let resolvedTargetGroup = this.target_group;
  let resolvedAdvice = this.advice_instructions;
  let routingReason = `Standard rule routing via ${this.rule_code}`;

  if (Array.isArray(this.conditional_routing) && this.conditional_routing.length > 0) {
    let matchedCondition = null;

    for (const route of this.conditional_routing) {
      const actualVal = getNestedValue(payload, route.condition_field);

      if (route.operator === 'eq' && actualVal === route.value) {
        matchedCondition = route;
        break;
      } else if (
        route.operator === 'in' &&
        Array.isArray(route.value) &&
        route.value.includes(actualVal)
      ) {
        matchedCondition = route;
        break;
      } else if (route.operator === 'ne' && actualVal !== route.value) {
        matchedCondition = route;
        break;
      } else if (
        route.operator === 'nin' &&
        Array.isArray(route.value) &&
        !route.value.includes(actualVal)
      ) {
        matchedCondition = route;
        break;
      }
    }

    if (matchedCondition) {
      resolvedTargetGroup = matchedCondition.target_group;
      if (matchedCondition.action_type) {
        resolvedAction = matchedCondition.action_type;
      }
      if (matchedCondition.advice_instructions) {
        resolvedAdvice = matchedCondition.advice_instructions;
      }
      routingReason = `Conditional routing triggered on ${matchedCondition.condition_field} = '${getNestedValue(
        payload,
        matchedCondition.condition_field
      )}' -> Target Group: ${resolvedTargetGroup}`;
    }
  }

  return {
    isValid: errors.length === 0,
    action_type: resolvedAction,
    assigned_group: resolvedTargetGroup,
    advice_instructions: resolvedAdvice,
    errors,
    routing_reason: routingReason,
  };
};

/**
 * Static Method: Find the best matching rule for an incoming issue
 */
FaultRuleSchema.statics.findMatchingRule = async function (criteria) {
  const { asset_type, symptom, rule_code } = criteria;

  // Direct rule code lookup
  if (rule_code) {
    const directRule = await this.findOne({ rule_code: rule_code.toUpperCase(), is_active: true });
    if (directRule) return directRule;
  }

  const query = { is_active: true };
  if (asset_type) {
    query.asset_type = asset_type;
  }

  // Fetch active candidate rules ordered by priority descending
  const candidates = await this.find(query).sort({ priority: -1 });

  if (!symptom) {
    return candidates[0] || null;
  }

  const normalizedSymptom = symptom.toLowerCase().trim();

  // Pattern matching against symptom_patterns
  for (const candidate of candidates) {
    if (Array.isArray(candidate.symptom_patterns)) {
      for (const pattern of candidate.symptom_patterns) {
        if (
          normalizedSymptom.includes(pattern) ||
          pattern.includes(normalizedSymptom) ||
          new RegExp(`\\b${pattern}\\b`, 'i').test(normalizedSymptom)
        ) {
          return candidate;
        }
      }
    }
    // Also check rule name substring
    if (
      normalizedSymptom.includes(candidate.rule_name.toLowerCase()) ||
      candidate.rule_name.toLowerCase().includes(normalizedSymptom)
    ) {
      return candidate;
    }
  }

  // Fallback to highest priority rule for this asset type
  return candidates[0] || null;
};

const FaultRule = mongoose.models.FaultRule || mongoose.model('FaultRule', FaultRuleSchema);

module.exports = FaultRule;
