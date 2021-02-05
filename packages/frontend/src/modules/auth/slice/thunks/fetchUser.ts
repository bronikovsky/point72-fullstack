import { createAsyncThunk } from '@reduxjs/toolkit';
import { request, UNAUTHORIZED, Unauthorized, UNKNOWN_ERROR } from '../../../apiv2';
import { User } from '../../types';

export default createAsyncThunk<User | null, void, { rejectValue: string }>(
  'auth/fetchUser',
  async () => {
    try {
      const response = await request('/user/current', { method: 'get', credentials: 'include' });

      return await response.json();
    } catch (e) {
      if (e instanceof Unauthorized) {
        throw new Error(UNAUTHORIZED);
      }

      throw new Error(UNKNOWN_ERROR);
    }
  },
);
