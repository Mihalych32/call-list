import type { CallTypeFilterState } from './slice';
import type { CallTypeFilterValue } from './types';

interface StateFragment {
  callTypeFilter: CallTypeFilterState;
}

export const selectCallTypeFilter = (state: StateFragment): CallTypeFilterValue =>
  state.callTypeFilter.value;
