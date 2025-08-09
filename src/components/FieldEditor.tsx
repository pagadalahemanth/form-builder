import React, { useState, useEffect } from 'react';
import { Box, TextField, Select, MenuItem, Switch, Button, FormControlLabel } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import type { FieldSchema, FieldType } from '../types/formTypes';

interface Props {
  initial?: FieldSchema | null;
  onSave: (field: FieldSchema) => void;
  onCancel?: () => void;
}

const FIELD_TYPES: FieldType[] = ['text','number','textarea','select','radio','checkbox','date'];

export default function FieldEditor({ initial = null, onSave, onCancel }: Props) {
  const [field, setField] = useState<FieldSchema>(() => initial ?? {
    id: uuidv4(),
    type: 'text',
    label: '',
    key: `field_${Math.random().toString(36).slice(2,8)}`,
    placeholder: '',
    defaultValue: '',
    options: [],
    validations: { required: false },
    derived: null
  });

  useEffect(() => { if (initial) setField(initial); }, [initial]);

  const update = (patch: Partial<FieldSchema>) => setField(f => ({ ...f, ...patch }));

  const save = () => {
    if (!field.label) {
      alert('Label required');
      return;
    }
    onSave(field);
  };

  return (
    <Box sx={{ display: 'grid', gap: 1 }}>
      <Select value={field.type} onChange={(e) => update({ type: e.target.value as FieldType })}>
        {FIELD_TYPES.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
      </Select>

      <TextField label="Label" value={field.label} onChange={e => update({ label: e.target.value })} />
      <TextField label="Key (unique)" value={field.key} onChange={e => update({ key: e.target.value })} />

      <TextField label="Placeholder" value={field.placeholder} onChange={e => update({ placeholder: e.target.value })} />

      <FormControlLabel
        control={<Switch checked={!!field.validations?.required} onChange={e => update({ validations: { ...field.validations, required: e.target.checked } })} />}
        label="Required"
      />

      {/* min/max length */}
      <TextField label="Min length" type="number" value={field.validations?.minLength ?? ''} onChange={e => update({ validations: { ...field.validations, minLength: e.target.value ? Number(e.target.value) : undefined } })} />
      <TextField label="Max length" type="number" value={field.validations?.maxLength ?? ''} onChange={e => update({ validations: { ...field.validations, maxLength: e.target.value ? Number(e.target.value) : undefined } })} />

      {/* special toggles */}
      <FormControlLabel control={<Switch checked={!!field.validations?.email} onChange={e => update({ validations: { ...field.validations, email: e.target.checked } })} />} label="Email format" />
      <FormControlLabel control={<Switch checked={!!field.validations?.passwordRule} onChange={e => update({ validations: { ...field.validations, passwordRule: e.target.checked } })} />} label="Custom password rule" />

      {/* options for select/radio/checkbox */}
      {(field.type === 'select' || field.type === 'radio' || field.type === 'checkbox') && (
        <Box>
          <h4>Options</h4>
          {(field.options ?? []).map((o, idx) => (
            <Box key={o.id} sx={{ display:'flex', gap:1, alignItems:'center' }}>
              <TextField value={o.label} onChange={e => {
                const options = (field.options ?? []).slice();
                options[idx] = { ...options[idx], label: e.target.value, value: e.target.value };
                update({ options });
              }} />
              <Button onClick={() => {
                const options = (field.options ?? []).filter((_, i) => i !== idx);
                update({ options });
              }}>Delete</Button>
            </Box>
          ))}

          <Button onClick={() => {
            const options = [...(field.options ?? []), { id: uuidv4(), label: 'Option', value: `opt_${Math.random().toString(36).slice(2,5)}` }];
            update({ options });
          }}>Add option</Button>
        </Box>
      )}

      {/* Derived field toggle / formula */}
      <FormControlLabel control={<Switch checked={!!field.derived?.isDerived} onChange={e => {
        if (e.target.checked) update({ derived: { isDerived: true, parents: [], formula: '' } });
        else update({ derived: null });
      }} />} label="Derived field" />

      {field.derived?.isDerived && (
        <Box>
          <TextField label="Parent keys (comma separated)" value={field.derived.parents.join(',')} onChange={e => update({ derived: { ...field.derived!, parents: e.target.value.split(',').map(s => s.trim()).filter(Boolean), formula: field.derived!.formula } })} />
          <TextField label="Formula (JS, use parent keys as variables; helpers.getAge(date) available)" value={field.derived.formula} onChange={e => update({ derived: { ...field.derived!, formula: e.target.value } })} />
          <div style={{fontSize:12,color:'#666'}}>Example formula: helpers.getAge(dob) OR (Number(year) - Number(birthYear))</div>
        </Box>
      )}

      <Box sx={{ display:'flex', gap:1 }}>
        <Button variant="contained" onClick={save}>Save Field</Button>
        <Button onClick={onCancel}>Cancel</Button>
      </Box>
    </Box>
  );
}
