// src/utils/localStorage.ts
import type { FormSchema } from '../types/formTypes';

const STORAGE_KEY = 'form_builder_forms_v1';

export const saveFormToStorage = (form: FormSchema) => {
  const existing = loadFormsFromStorage();
  existing.unshift(form); // newest first
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
};

export const loadFormsFromStorage = (): FormSchema[] => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as FormSchema[];
  } catch {
    return [];
  }
};

export const getFormById = (id: string): FormSchema | null => {
  const all = loadFormsFromStorage();
  return all.find(f => f.id === id) ?? null;
};
