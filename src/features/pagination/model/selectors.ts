import type { PaginationState } from './types';

interface StateFragment {
  pagination: PaginationState;
}

export const selectCurrentPage = (state: StateFragment): number => state.pagination.currentPage;
export const selectPageSize = (state: StateFragment): number => state.pagination.pageSize;
