import * as thunks from './thunks';
import { createSlice } from '@reduxjs/toolkit';
import { User } from '../types';

type State = {
  user: User | null;
  pending: boolean;
  fetched: boolean;
  error: null | string;
}

const initialState: State = {
  user: null,
  pending: false,
  fetched: false,
  error: null,
};

export default createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
    },
  },
  extraReducers: builder => {
    builder.addCase(thunks.fetchUser.pending, (state) => {
      state.pending = true;
      state.error = null;
    });
    builder.addCase(thunks.fetchUser.rejected, (state, action) => {
      state.error = action.payload || null;
      state.pending = false;
      state.fetched = true;
    });
    builder.addCase(thunks.fetchUser.fulfilled, (state, action) => {
      state.user = action.payload;
      state.pending = false;
      state.fetched = true;
    });
  },
});
