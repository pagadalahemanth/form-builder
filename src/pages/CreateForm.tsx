import React, { useState } from 'react';
import { Box, Button, List, ListItem, IconButton, Typography, Divider, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import { v4 as uuidv4 } from 'uuid';
import FieldEditor from '../components/FieldEditor';
import type { FieldSchema, FormSchema } from '../types/formTypes';
import { saveFormToStorage } from '../utils/localStorage';
import { useDispatch } from 'react-redux';
import { addSavedForm, setCurrentForm } from '../redux/formSlice';
import dayjs from 'dayjs';

export default function CreateForm() {
  const [fields, setFields] = useState<FieldSchema[]>([]);
  const [editing, setEditing] = useState<FieldSchema | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [formName, setFormName] = useState('');
  const dispatch = useDispatch();

  const addField = () => {
    setEditing(null);
    setShowEditor(true);
  };

  const saveField = (f: FieldSchema) => {
    setFields(prev => {
      const idx = prev.findIndex(p => p.id === f.id);
      if (idx >= 0) {
        const copy = prev.slice();
        copy[idx] = f;
        return copy;
      }
      return [...prev, f];
    });
    setShowEditor(false);
  };

  const editField = (f: FieldSchema) => {
    setEditing(f);
    setShowEditor(true);
  };

  const deleteField = (id: string) => setFields(prev => prev.filter(p => p.id !== id));

  const saveForm = () => {
    if (!formName) {
      alert('Please provide a form name.');
      return;
    }
    const schema: FormSchema = {
      id: uuidv4(),
      name: formName,
      createdAt: dayjs().toISOString(),
      fields
    };
    saveFormToStorage(schema);
    // update redux state saved forms
    dispatch(addSavedForm(schema));
    // optionally set current form in redux so preview route can use it
    dispatch(setCurrentForm(schema));
    alert('Form saved!');
  };

  return (
    <Box sx={{ display:'grid', gap:2 }}>
      <Typography variant="h5">Create Form</Typography>

      <TextField label="Form name" value={formName} onChange={e => setFormName(e.target.value)} />

      <Box sx={{ display:'flex', gap:1 }}>
        <Button startIcon={<AddIcon />} onClick={addField}>Add field</Button>
        <Button disabled onClick={() => {}}>Reorder fields</Button>
      </Box>

      <Divider />

      <List>
        {fields.map(f => (
          <ListItem key={f.id} secondaryAction={
            <>
              <IconButton onClick={() => editField(f)}><EditIcon /></IconButton>
              <IconButton onClick={() => deleteField(f.id)}><DeleteIcon /></IconButton>
            </>
          }>
            <Typography>{f.label} — {f.type} {f.derived?.isDerived ? '(Derived)' : ''}</Typography>
          </ListItem>
        ))}
      </List>

      {showEditor && <FieldEditor initial={editing} onSave={saveField} onCancel={() => setShowEditor(false)} />}

      <Button variant="contained" startIcon={<SaveIcon />} onClick={saveForm}>Save Form</Button>
    </Box>
  );
}
