// src/utils/validation.ts
import type { ValidationRules } from '../types/formTypes';

export const validateValue = (value: any, rules?: ValidationRules) : string | null => {
  if (!rules) return null;

  if (rules.required) {
    const empty = value === null || value === undefined || value === '' || (Array.isArray(value) && value.length === 0);
    if (empty) return 'This field is required.';
  }

  if (typeof value === 'string') {
    if (rules.minLength !== undefined && value.length < rules.minLength) {
      return `Minimum length is ${rules.minLength}.`;
    }
    if (rules.maxLength !== undefined && value.length > rules.maxLength) {
      return `Maximum length is ${rules.maxLength}.`;
    }
    if (rules.email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!re.test(value)) return 'Enter a valid email.';
    }
    if (rules.passwordRule) {
      if (value.length < 8 || !/\d/.test(value)) return 'Password must be min 8 chars and contain a number.';
    }
  }

  if (typeof value === 'number') {
    if (rules.min !== undefined && value < rules.min) return `Minimum value is ${rules.min}.`;
    if (rules.max !== undefined && value > rules.max) return `Maximum value is ${rules.max}.`;
  }

  return null;
};
