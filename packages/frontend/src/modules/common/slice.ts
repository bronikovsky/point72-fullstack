import { createSlice } from '@reduxjs/toolkit';

export type CommonState = {
  pendingActions: string[];
}

export default createSlice({
  name: 'common',
  initialState: { pendingActions: [] } as CommonState,
  reducers: {
    addPendingAction: (state: CommonState, action: { payload: string }) => {
      state.pendingActions.push(action.payload);
    },
    removePendingAction: (state: CommonState, action: { payload: string }) => {
      const { payload } = action;

      state.pendingActions.splice(state.pendingActions.indexOf(payload), 1);
    },
  },
});
