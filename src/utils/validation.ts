import type { ValidationRules } from '../types/formTypes';

// Helper function to validate form fields based on defined rules

export const validateValue = (value: any, rules?: ValidationRules) : string | null => {
  if (!rules) return null;

  // Empty check for required fields
  if (rules.required) {
    const empty = value === null || value === undefined || value === '' || 
                 (Array.isArray(value) && value.length === 0);
    if (empty) return rules.customError ?? 'This field is required.';
  }

  // Skip other validations if empty and not required
  if (!rules.required && (value === null || value === undefined || value === '')) {
    return null;
  }

  // String validations
  if (typeof value === 'string') {
    if (rules.minLength !== undefined && value.length < rules.minLength) {
      return rules.customError ?? `Minimum length is ${rules.minLength}.`;
    }
    if (rules.maxLength !== undefined && value.length > rules.maxLength) {
      return rules.customError ?? `Maximum length is ${rules.maxLength}.`;
    }
    if (rules.email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!re.test(value)) return rules.customError ?? 'Enter a valid email address.';
    }
    if (rules.passwordRule) {
      if (value.length < 8 || !/\d/.test(value)) {
        return rules.customError ?? 'Password must be at least 8 characters and contain a number.';
      }
    }
    if (rules.pattern) {
      try {
        const re = new RegExp(rules.pattern);
        if (!re.test(value)) {
          return rules.customError ?? 'Invalid format.';
        }
      } catch (e) {
        console.error('Invalid regex pattern:', e);
      }
    }
  }

  if (rules.min !== undefined || rules.max !== undefined) {
    const numValue = Number(value);
    if (isNaN(numValue)) {
      return 'Please enter a valid number.';
    }
    if (rules.min !== undefined && numValue < rules.min) {
      return `Minimum value is ${rules.min}.`;
    }
    if (rules.max !== undefined && numValue > rules.max) {
      return `Maximum value is ${rules.max}.`;
    }
  }

  return null;
};
