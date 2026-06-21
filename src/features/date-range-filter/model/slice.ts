import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { DateRangeFilterValue } from './types';

interface DateRangeFilterState {
  value: DateRangeFilterValue;
}

const initialState: DateRangeFilterState = {
  value: {
    preset: '3days',
    from: null,
    to: null,
  },
};

const dateRangeFilterSlice = createSlice({
  name: 'dateRangeFilter',
  initialState,
  reducers: {
    setDateRangeFilter(state, action: PayloadAction<DateRangeFilterValue>) {
      state.value = action.payload;
    },
  },
});

export type { DateRangeFilterState };
export const { setDateRangeFilter } = dateRangeFilterSlice.actions;
export const dateRangeFilterReducer = dateRangeFilterSlice.reducer;
