const {
  evaluateRule,
  evaluateSchemeEligibility,
  OPERATORS,
  STATUSES,
} = require('../src/services/eligibilityEngine');

describe('LabhSetu Deterministic Eligibility Engine Tests', () => {
  describe('Operator Rule Evaluation', () => {
    test('EQUALS: passes when string values match case-insensitively', () => {
      const rule = { field: 'state', operator: OPERATORS.EQUALS, value: 'Uttar Pradesh' };
      const profile = { state: 'uttar pradesh' };
      const result = evaluateRule(rule, profile);
      expect(result.status).toBe('MATCHED');
    });

    test('EQUALS: fails when string values do not match', () => {
      const rule = { field: 'state', operator: OPERATORS.EQUALS, value: 'Uttar Pradesh' };
      const profile = { state: 'Bihar' };
      const result = evaluateRule(rule, profile);
      expect(result.status).toBe('FAILED');
    });

    test('GREATER_THAN_OR_EQUAL: passes when user value is equal or higher', () => {
      const rule = { field: 'age', operator: OPERATORS.GREATER_THAN_OR_EQUAL, value: 18 };
      const profile = { age: 18 };
      const result = evaluateRule(rule, profile);
      expect(result.status).toBe('MATCHED');
    });

    test('GREATER_THAN_OR_EQUAL: fails when user value is lower', () => {
      const rule = { field: 'age', operator: OPERATORS.GREATER_THAN_OR_EQUAL, value: 18 };
      const profile = { age: 17 };
      const result = evaluateRule(rule, profile);
      expect(result.status).toBe('FAILED');
    });

    test('LESS_THAN_OR_EQUAL: passes when income is within limit', () => {
      const rule = { field: 'annualIncome', operator: OPERATORS.LESS_THAN_OR_EQUAL, value: 250000 };
      const profile = { annualIncome: 180000 };
      const result = evaluateRule(rule, profile);
      expect(result.status).toBe('MATCHED');
    });

    test('BOOLEAN_TRUE: passes when boolean is true', () => {
      const rule = { field: 'isFarmer', operator: OPERATORS.BOOLEAN_TRUE };
      const profile = { isFarmer: true };
      const result = evaluateRule(rule, profile);
      expect(result.status).toBe('MATCHED');
    });

    test('Missing profile attribute yields MISSING status', () => {
      const rule = { field: 'occupation', operator: OPERATORS.EQUALS, value: 'farmer' };
      const profile = {}; // missing occupation
      const result = evaluateRule(rule, profile);
      expect(result.status).toBe('MISSING');
      expect(result.missingInfoPrompt).toBeDefined();
    });
  });

  describe('Comprehensive Scheme Evaluation', () => {
    const mockScheme = {
      _id: 'scheme_123',
      name: 'PM-KISAN Test',
      stateScope: 'All India',
      category: 'Agriculture',
      department: 'Agriculture Dept',
      eligibilityRules: [
        {
          _id: 'r1',
          field: 'isFarmer',
          operator: OPERATORS.BOOLEAN_TRUE,
          isMandatory: true,
          title: 'Must be farmer',
        },
        {
          _id: 'r2',
          field: 'annualIncome',
          operator: OPERATORS.LESS_THAN_OR_EQUAL,
          value: 300000,
          isMandatory: true,
          title: 'Income limit',
        },
      ],
    };

    test('Returns POTENTIALLY_ELIGIBLE when all mandatory rules match', () => {
      const citizenProfile = { isFarmer: true, annualIncome: 180000 };
      const evaluation = evaluateSchemeEligibility(mockScheme, citizenProfile);
      expect(evaluation.status).toBe(STATUSES.POTENTIALLY_ELIGIBLE);
      expect(evaluation.matchedConditions.length).toBe(2);
      expect(evaluation.failedConditions.length).toBe(0);
      expect(evaluation.matchScore).toBe(100);
    });

    test('Returns NOT_CURRENTLY_ELIGIBLE when any mandatory rule fails', () => {
      const citizenProfile = { isFarmer: false, annualIncome: 180000 };
      const evaluation = evaluateSchemeEligibility(mockScheme, citizenProfile);
      expect(evaluation.status).toBe(STATUSES.NOT_CURRENTLY_ELIGIBLE);
      expect(evaluation.failedConditions.length).toBe(1);
    });

    test('Returns INSUFFICIENT_DATA when mandatory fields are missing', () => {
      const citizenProfile = { isFarmer: true }; // missing annualIncome
      const evaluation = evaluateSchemeEligibility(mockScheme, citizenProfile);
      expect(evaluation.status).toBe(STATUSES.INSUFFICIENT_DATA);
      expect(evaluation.missingConditions.length).toBe(1);
    });
  });
});
