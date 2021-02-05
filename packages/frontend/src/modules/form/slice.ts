import { assocPath } from 'ramda';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type InputState = {
  value: string | boolean;
  error: string | null;
}

export type FormState = { [key: string]: InputState }

type InitialState = { [key: string]: FormState }
type WithCommonPayload<T> = PayloadAction<T & {
  formName: string;
  fieldName: string;
}>

const slice = createSlice({
  name: 'form',
  initialState: {} as InitialState,
  reducers: {
    register: (state: InitialState, action: WithCommonPayload<any>) => {
      const { formName, fieldName } = action.payload;

      return assocPath([formName, fieldName], { value: '', error: null }, state);
    },
    setValue: (
      state: InitialState,
      action: WithCommonPayload<{ value: string }>,
    ) => {
      const { formName, fieldName, value } = action.payload;

      return assocPath([formName, fieldName, 'value'], value, state);
    },
  },
});

export default slice;
