import React from 'react';
import { List, ListItem, Typography, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import dayjs from 'dayjs';
import { loadFormsFromStorage } from '../utils/localStorage';

export default function MyFormsList() {
  const forms = loadFormsFromStorage();

  return (
    <>
      <Typography variant="h5">My Forms</Typography>
      <List>
        {forms.map(f => (
          <ListItem key={f.id} sx={{ display:'flex', justifyContent:'space-between' }}>
            <div>
              <Typography>{f.name}</Typography>
              <Typography variant="caption">{dayjs(f.createdAt).format('YYYY-MM-DD HH:mm')}</Typography>
            </div>
            <Button component={RouterLink} to={`/preview/${f.id}`}>Open</Button>
          </ListItem>
        ))}
      </List>
    </>
  );
}
