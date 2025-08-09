import React, { useMemo, useState, useEffect } from 'react';
import { Box, TextField, Button, MenuItem, Checkbox, FormControlLabel, RadioGroup, Radio, FormGroup, Typography } from '@mui/material';
import type { FormSchema, FieldSchema } from '../types/formTypes';
import { validateValue } from '../utils/validation';
import { evalDerived } from '../utils/derived';

interface Props {
  schema: FormSchema;
  readOnly?: boolean; // if true, derived fields still update but don't allow manual write
}

export default function FormRenderer({ schema, readOnly = false }: Props) {
  const initialState = useMemo(() => {
    const s: Record<string, any> = {};
    schema.fields.forEach(f => {
      s[f.key] = f.defaultValue ?? (f.type === 'checkbox' ? [] : '');
    });
    return s;
  }, [schema.fields]);

  const [values, setValues] = useState<Record<string, any>>(initialState);
  const [errors, setErrors] = useState<Record<string,string | null>>({});

  useEffect(() => {
    // whenever values change, re-evaluate derived fields
    const derivedFields = schema.fields.filter(f => f.derived?.isDerived);
    if (derivedFields.length === 0) return;

    setValues(prev => {
      const copy = { ...prev };
      derivedFields.forEach(f => {
        // build context
        const context: Record<string, any> = {};
        f.derived!.parents.forEach(k => { context[k] = prev[k]; });
        // Evaluate
        const result = evalDerived(f.derived!.formula, context);
        copy[f.key] = result;
      });
      return copy;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values, schema.fields]);

  const onChange = (key: string, val: any, field: FieldSchema) => {
    const newValue = val;
    setValues(v => ({ ...v, [key]: newValue }));
    
    // Validate on change for better UX
    const error = validateValue(newValue, field.validations);
    setErrors(e => ({ ...e, [key]: error }));
  };

  const validateAll = (): boolean => {
    const newErrs: Record<string,string | null> = {};
    let ok = true;
    schema.fields.forEach(f => {
      const err = validateValue(values[f.key], f.validations);
      newErrs[f.key] = err;
      if (err) ok = false;
    });
    setErrors(newErrs);
    return ok;
  };

  const submit = () => {
    if (!validateAll()) return;
    alert('Form is valid! (Submission is not saved per requirements)');
  };

  const renderField = (f: FieldSchema) => {
    const value = values[f.key];
    const error = errors[f.key];

    switch (f.type) {
      case 'text':
      case 'number':
      case 'date':
      case 'textarea': {
        return (
          <TextField
            fullWidth
            type={f.type === 'number' ? 'number' : f.type === 'date' ? 'date' : 'text'}
            label={f.label}
            value={value ?? ''}
            onChange={(e) => onChange(f.key, f.type === 'number' ? Number(e.target.value) : e.target.value, f)}
            inputProps={{
              min: f.type === 'number' && f.validations?.min,
              max: f.type === 'number' && f.validations?.max,
              pattern: f.validations?.pattern
            }}
            error={!!errors[f.key]}
            multiline={f.type === 'textarea'}
            helperText={error ?? (f.derived?.isDerived ? 'Derived field' : '')}
            InputProps={{ readOnly: f.derived?.isDerived || readOnly }}
          />
        );
      }

      case 'select':
        return (
          <TextField select label={f.label} value={value ?? ''} onChange={e => onChange(f.key, e.target.value, f)} helperText={error}>
            {(f.options || []).map(o => <MenuItem key={o.id} value={o.value}>{o.label}</MenuItem>)}
          </TextField>
        );

      case 'radio':
        return (
          <Box>
            <Typography variant="subtitle1">{f.label}</Typography>
            <RadioGroup value={value ?? ''} onChange={e => onChange(f.key, e.target.value, f)}>
              {(f.options || []).map(o => <FormControlLabel key={o.id} value={o.value} control={<Radio />} label={o.label} />)}
            </RadioGroup>
            {error && <Typography color="error">{error}</Typography>}
          </Box>
        );

      case 'checkbox':
        return (
          <Box>
            <Typography variant="subtitle1">{f.label}</Typography>
            <FormGroup>
              {(f.options || []).map(o => (
                <FormControlLabel
                  key={o.id}
                  control={<Checkbox checked={(value || []).includes(o.value)} onChange={(e) => {
                    const cur = value || [];
                    const next = e.target.checked ? [...cur, o.value] : cur.filter((v: any) => v !== o.value);
                    onChange(f.key, next, f);
                  }} />}
                  label={o.label}
                />
              ))}
            </FormGroup>
            {error && <Typography color="error">{error}</Typography>}
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ display:'grid', gap:2 }}>
      {schema.fields.map(f => (
        <Box key={f.id} sx={{ padding:1, border:'1px solid #eee', borderRadius:1 }}>
          {renderField(f)}
        </Box>
      ))}

      <Button variant="contained" onClick={submit}>Submit</Button>
    </Box>
  );
}
