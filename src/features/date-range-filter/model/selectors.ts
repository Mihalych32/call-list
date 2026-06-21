import type { DateRangeFilterState } from './slice';
import type { DateRangeFilterValue } from './types';

interface StateFragment {
  dateRangeFilter: DateRangeFilterState;
}

export const selectDateRangeFilter = (state: StateFragment): DateRangeFilterValue =>
  state.dateRangeFilter.value;
