import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { FormSchema } from '../types/formTypes';
import { loadFormsFromStorage } from '../utils/localStorage';

interface FormState {
  currentForm: FormSchema | null;
  savedForms: FormSchema[];
}

const initialState: FormState = {
  currentForm: null,
  savedForms: loadFormsFromStorage(),
};

const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    setCurrentForm(state, action: PayloadAction<FormSchema | null>) {
      state.currentForm = action.payload;
    },
    addSavedForm(state, action: PayloadAction<FormSchema>) {
      state.savedForms.unshift(action.payload);
    },
    setSavedForms(state, action: PayloadAction<FormSchema[]>) {
      state.savedForms = action.payload;
    }
  }
});

export const { setCurrentForm, addSavedForm, setSavedForms } = formSlice.actions;
export default formSlice.reducer;
