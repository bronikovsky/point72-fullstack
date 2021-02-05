import * as ls from 'local-storage';
import { createSlice } from '@reduxjs/toolkit';
import { Theme } from './types';

function detectUserPreference(): Theme {
  const savedPreference = ls.get<Theme | undefined>('theme');
  const prefersDarkTheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

  return savedPreference || (prefersDarkTheme ? 'dark' : 'light');
}

const slice = createSlice({
  name: 'theme',
  initialState: detectUserPreference(),
  reducers: {
    setTheme: (state, action) => {
      ls.set<Theme>('theme', action.payload);

      return action.payload;
    },
  },
});

export default slice;
