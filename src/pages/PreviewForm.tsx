// src/pages/PreviewForm.tsx
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../redux/store';
import { useParams } from 'react-router-dom';
import { getFormById } from '../utils/localStorage';
import { setCurrentForm } from '../redux/formSlice';
import FormRenderer from '../components/FormRenderer';
import { Box, Typography } from '@mui/material';

export default function PreviewForm() {
  const { id } = useParams<{ id?: string }>();
  const current = useSelector((s: RootState) => s.form.currentForm);
  const dispatch = useDispatch();

  useEffect(() => {
    if (id) {
      const fromStorage = getFormById(id);
      if (fromStorage) {
        dispatch(setCurrentForm(fromStorage));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const form = id ? getFormById(id) ?? current : current;

  if (!form) return <Box><Typography>No form selected. Create or select one from My Forms.</Typography></Box>;

  return (
    <Box>
      <Typography variant="h5">{form.name}</Typography>
      <FormRenderer schema={form} />
    </Box>
  );
}
