// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Container, AppBar, Toolbar, Button } from '@mui/material';
import CreateForm from './pages/CreateForm';
import PreviewForm from './pages/PreviewForm';
import MyFormsList from './pages/MyFormsList';

export default function App(){
  return (
    <BrowserRouter>
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" component={Link} to="/create">Create</Button>
          <Button color="inherit" component={Link} to="/preview">Preview</Button>
          <Button color="inherit" component={Link} to="/myforms">My Forms</Button>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt:4 }}>
        <Routes>
          <Route path="/" element={<CreateForm />} />
          <Route path="/create" element={<CreateForm />} />
          <Route path="/preview" element={<PreviewForm />} />
          <Route path="/preview/:id" element={<PreviewForm />} />
          <Route path="/myforms" element={<MyFormsList />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}
