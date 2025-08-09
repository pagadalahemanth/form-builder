// src/types/formTypes.ts
export type FieldType = 'text' | 'number' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'date';

export interface ValidationRules {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number | string; // number for numeric, string for date
  max?: number | string; // number for numeric, string for date
  email?: boolean;
  passwordRule?: boolean;
  pattern?: string; // for custom regex validation
  customError?: string; // custom error message
}

export interface Option {
  id: string;
  label: string;
  value: string;
}

export interface FieldSchema {
  id: string; // uuid
  type: FieldType;
  label: string;
  key: string; // unique key (slug)
  placeholder?: string;
  defaultValue?: any;
  options?: Option[]; // for select/radio/checkbox
  validations?: ValidationRules;
  derived?: {
    isDerived: boolean;
    parents: string[]; // parent field keys
    formula: string; // expression using parent keys, e.g., "calculateAge(dob)"
  } | null;
}

export interface FormSchema {
  id: string;
  name: string;
  createdAt: string; // ISO date string
  fields: FieldSchema[];
}
