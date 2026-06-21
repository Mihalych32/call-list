import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { CallTypeFilterValue } from './types';

interface CallTypeFilterState {
  value: CallTypeFilterValue;
}

const initialState: CallTypeFilterState = {
  value: 'all',
};

const callTypeFilterSlice = createSlice({
  name: 'callTypeFilter',
  initialState,
  reducers: {
    setCallTypeFilter(state, action: PayloadAction<CallTypeFilterValue>) {
      state.value = action.payload;
    },
  },
});

export type { CallTypeFilterState };
export const { setCallTypeFilter } = callTypeFilterSlice.actions;
export const callTypeFilterReducer = callTypeFilterSlice.reducer;
