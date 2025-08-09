// src/utils/derived.ts
// Simple derived expression evaluator.
// We allow users to write an expression referencing parent keys as variables.
// E.g., if parents=['dob'] the formula might be: "getAge(new Date(dob))" or "2025 - new Date(dob).getFullYear()"
// We'll provide a helper set of functions and evaluate the formula in a Function() sandbox.
// **CAUTION**: Using `Function` runs JS from user input — ok for local assignment demos but not safe for untrusted public apps.

export const helpers = {
  // Example helper: calculates age from DOB string/Date
  getAge: (d: string | Date) => {
    const dob = new Date(d);
    if (Number.isNaN(dob.getTime())) return null;
    const diffMs = Date.now() - dob.getTime();
    const ageDt = new Date(diffMs);
    return Math.abs(ageDt.getUTCFullYear() - 1970);
  }
};

export const evalDerived = (formula: string, context: Record<string, any>): any => {
  // Build argument names and values from context
  const argNames = Object.keys(context);
  const argValues = Object.values(context);

  // Expose helpers variable
  // build function body. return expression result
  const body = `
    "use strict";
    const helpers = arguments[arguments.length-1];
    try {
      return (${formula});
    } catch (e) {
      return null;
    }
  `;

  try {
    // append helpers as last argument
    const fn = new Function(...argNames, 'helpers', body);
    return fn(...argValues, helpers);
  } catch (e) {
    console.error('Derived eval error', e);
    return null;
  }
};
