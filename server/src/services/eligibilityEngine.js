/**
 * LabhSetu Deterministic Rule Evaluator Engine
 * Strictly rule-based screening engine.
 * Never overrides deterministic rules with probabilistic LLM guesses.
 */

// Supported operators
const OPERATORS = {
  EQUALS: 'EQUALS',
  NOT_EQUALS: 'NOT_EQUALS',
  GREATER_THAN: 'GREATER_THAN',
  GREATER_THAN_OR_EQUAL: 'GREATER_THAN_OR_EQUAL',
  LESS_THAN: 'LESS_THAN',
  LESS_THAN_OR_EQUAL: 'LESS_THAN_OR_EQUAL',
  IN: 'IN',
  NOT_IN: 'NOT_IN',
  CONTAINS: 'CONTAINS',
  BOOLEAN_TRUE: 'BOOLEAN_TRUE',
  BOOLEAN_FALSE: 'BOOLEAN_FALSE',
  DATE_BEFORE: 'DATE_BEFORE',
  DATE_AFTER: 'DATE_AFTER',
};

// Possible evaluation statuses
const STATUSES = {
  POTENTIALLY_ELIGIBLE: 'POTENTIALLY_ELIGIBLE',
  NOT_CURRENTLY_ELIGIBLE: 'NOT_CURRENTLY_ELIGIBLE',
  NEEDS_VERIFICATION: 'NEEDS_VERIFICATION',
  INSUFFICIENT_DATA: 'INSUFFICIENT_DATA',
};

/**
 * Safely resolves nested property values or direct property values from user profile
 */
const getFieldValue = (profile, field) => {
  if (!profile || !field) return undefined;
  
  // Handle direct field
  if (profile[field] !== undefined) return profile[field];

  // Handle nested paths (e.g. "familyDetails.length")
  const parts = field.split('.');
  let current = profile;
  for (const part of parts) {
    if (current === undefined || current === null) return undefined;
    current = current[part];
  }
  return current;
};

/**
 * Evaluates a single rule against a citizen's profile
 */
const evaluateRule = (rule, profile) => {
  const userValue = getFieldValue(profile, rule.field);
  const targetValue = rule.value;

  // Check if information is missing
  if (userValue === undefined || userValue === null || userValue === '') {
    return {
      ruleId: rule._id,
      field: rule.field,
      operator: rule.operator,
      title: rule.title,
      description: rule.description,
      descriptionHi: rule.descriptionHi,
      missingInfoPrompt: rule.missingInfoPrompt || `Please provide your ${rule.field} to confirm eligibility.`,
      missingInfoPromptHi: rule.missingInfoPromptHi || `पात्रता की पुष्टि के लिए कृपया अपना ${rule.field} दर्ज करें।`,
      isMandatory: rule.isMandatory !== false,
      status: 'MISSING',
      reason: `Field '${rule.field}' is missing in profile`,
    };
  }

  let passed = false;

  switch (rule.operator) {
    case OPERATORS.EQUALS:
      if (typeof userValue === 'string' && typeof targetValue === 'string') {
        passed = userValue.trim().toLowerCase() === targetValue.trim().toLowerCase();
      } else {
        passed = userValue == targetValue;
      }
      break;

    case OPERATORS.NOT_EQUALS:
      if (typeof userValue === 'string' && typeof targetValue === 'string') {
        passed = userValue.trim().toLowerCase() !== targetValue.trim().toLowerCase();
      } else {
        passed = userValue != targetValue;
      }
      break;

    case OPERATORS.GREATER_THAN:
      passed = Number(userValue) > Number(targetValue);
      break;

    case OPERATORS.GREATER_THAN_OR_EQUAL:
      passed = Number(userValue) >= Number(targetValue);
      break;

    case OPERATORS.LESS_THAN:
      passed = Number(userValue) < Number(targetValue);
      break;

    case OPERATORS.LESS_THAN_OR_EQUAL:
      passed = Number(userValue) <= Number(targetValue);
      break;

    case OPERATORS.IN:
      if (Array.isArray(targetValue)) {
        const valStr = String(userValue).toLowerCase().trim();
        passed = targetValue.map(v => String(v).toLowerCase().trim()).includes(valStr);
      } else if (typeof targetValue === 'string') {
        const list = targetValue.split(',').map(s => s.trim().toLowerCase());
        passed = list.includes(String(userValue).trim().toLowerCase());
      }
      break;

    case OPERATORS.NOT_IN:
      if (Array.isArray(targetValue)) {
        const valStr = String(userValue).toLowerCase().trim();
        passed = !targetValue.map(v => String(v).toLowerCase().trim()).includes(valStr);
      } else if (typeof targetValue === 'string') {
        const list = targetValue.split(',').map(s => s.trim().toLowerCase());
        passed = !list.includes(String(userValue).trim().toLowerCase());
      }
      break;

    case OPERATORS.CONTAINS:
      if (typeof userValue === 'string') {
        passed = userValue.toLowerCase().includes(String(targetValue).toLowerCase());
      } else if (Array.isArray(userValue)) {
        passed = userValue.includes(targetValue);
      }
      break;

    case OPERATORS.BOOLEAN_TRUE:
      passed = userValue === true || userValue === 'true' || userValue === 1 || userValue === 'yes';
      break;

    case OPERATORS.BOOLEAN_FALSE:
      passed = userValue === false || userValue === 'false' || userValue === 0 || userValue === 'no';
      break;

    case OPERATORS.DATE_BEFORE:
      passed = new Date(userValue).getTime() < new Date(targetValue).getTime();
      break;

    case OPERATORS.DATE_AFTER:
      passed = new Date(userValue).getTime() > new Date(targetValue).getTime();
      break;

    default:
      passed = false;
  }

  return {
    ruleId: rule._id,
    field: rule.field,
    operator: rule.operator,
    title: rule.title,
    description: rule.description,
    descriptionHi: rule.descriptionHi,
    targetValue,
    userValue,
    isMandatory: rule.isMandatory !== false,
    status: passed ? 'MATCHED' : 'FAILED',
    reason: passed
      ? `Condition met: ${rule.title || rule.field}`
      : `Condition not met: Requires ${rule.field} to satisfy ${rule.operator} ${targetValue}`,
  };
};

/**
 * Evaluates an entire scheme against a citizen profile
 */
const evaluateSchemeEligibility = (scheme, profile) => {
  const rules = scheme.eligibilityRules || [];

  const matchedConditions = [];
  const failedConditions = [];
  const missingConditions = [];

  // State scope preliminary check
  if (scheme.stateScope && scheme.stateScope !== 'All India' && profile.state) {
    if (profile.state.toLowerCase() !== scheme.stateScope.toLowerCase()) {
      failedConditions.push({
        field: 'state',
        title: `State Specific to ${scheme.stateScope}`,
        titleHi: `केवल ${scheme.stateScope} राज्य के लिए`,
        status: 'FAILED',
        reason: `Scheme is limited to residents of ${scheme.stateScope}`,
        isMandatory: true,
      });
    } else {
      matchedConditions.push({
        field: 'state',
        title: `Resident of ${scheme.stateScope}`,
        titleHi: `${scheme.stateScope} के निवासी`,
        status: 'MATCHED',
        reason: `Resident matches required state (${scheme.stateScope})`,
        isMandatory: true,
      });
    }
  } else if (scheme.stateScope && scheme.stateScope !== 'All India' && !profile.state) {
    missingConditions.push({
      field: 'state',
      title: `State Scope (${scheme.stateScope})`,
      missingInfoPrompt: `Is your residence located in ${scheme.stateScope}?`,
      status: 'MISSING',
      isMandatory: true,
    });
  }

  // Evaluate each rule
  for (const rule of rules) {
    const evalResult = evaluateRule(rule, profile);
    if (evalResult.status === 'MATCHED') {
      matchedConditions.push(evalResult);
    } else if (evalResult.status === 'FAILED') {
      failedConditions.push(evalResult);
    } else if (evalResult.status === 'MISSING') {
      missingConditions.push(evalResult);
    }
  }

  // Determine overall status
  let overallStatus = STATUSES.POTENTIALLY_ELIGIBLE;
  let summaryText = '';
  let summaryTextHi = '';

  const hasMandatoryFailure = failedConditions.some(c => c.isMandatory);
  const hasMandatoryMissing = missingConditions.some(c => c.isMandatory);

  if (hasMandatoryFailure) {
    overallStatus = STATUSES.NOT_CURRENTLY_ELIGIBLE;
    summaryText = 'Based on the provided details, one or more mandatory eligibility conditions are currently not satisfied.';
    summaryTextHi = 'उपलब्ध विवरण के आधार पर, एक या अधिक अनिवार्य पात्रता शर्तें वर्तमान में पूरी नहीं होती हैं।';
  } else if (hasMandatoryMissing && rules.length > 0) {
    overallStatus = STATUSES.INSUFFICIENT_DATA;
    summaryText = 'Additional profile information is required to establish preliminary eligibility.';
    summaryTextHi = 'प्रारंभिक पात्रता निर्धारित करने के लिए अतिरिक्त प्रोफाइल जानकारी आवश्यक है।';
  } else if (failedConditions.length > 0) {
    overallStatus = STATUSES.NEEDS_VERIFICATION;
    summaryText = 'Certain non-mandatory conditions may require special review or alternative documentation.';
    summaryTextHi = 'कुछ गैर-अनिवार्य शर्तों के लिए विशेष सत्यापन या अतिरिक्त दस्तावेजों की आवश्यकता हो सकती है।';
  } else {
    overallStatus = STATUSES.POTENTIALLY_ELIGIBLE;
    summaryText = 'Based on the information provided, you appear to meet the preliminary listed criteria.';
    summaryTextHi = 'आपके द्वारा दी गई जानकारी के आधार पर आप इस योजना के प्रारंभिक मानदंडों को पूरा करते प्रतीत होते हैं।';
  }

  // Calculate matching percentage for ranking
  const totalRules = rules.length + (scheme.stateScope !== 'All India' ? 1 : 0);
  const matchScore = totalRules > 0 ? Math.round((matchedConditions.length / totalRules) * 100) : 100;

  return {
    schemeId: scheme._id,
    schemeName: scheme.name,
    schemeNameHi: scheme.nameHi,
    department: scheme.department,
    category: scheme.category,
    status: overallStatus,
    matchScore,
    matchedConditions,
    failedConditions,
    missingConditions,
    summary: summaryText,
    summaryHi: summaryTextHi,
    disclaimer: 'Preliminary screening for guidance only. Final eligibility and benefit disbursement rest strictly with the concerned government authority.',
    disclaimerHi: 'यह केवल मार्गदर्शन के लिए प्रारंभिक स्क्रीनिंग है। अंतिम पात्रता और लाभ स्वीकृति संबंधित सरकारी प्राधिकारी के अधीन है।',
  };
};

module.exports = {
  OPERATORS,
  STATUSES,
  evaluateRule,
  evaluateSchemeEligibility,
};
