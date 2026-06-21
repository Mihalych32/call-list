import { createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit';
import { setPage, setPageSize, resetPage } from '@/features/pagination';
import { setCallTypeFilter } from '@/features/call-type-filter';
import { setDateRangeFilter } from '@/features/date-range-filter';

interface PaginationStateSlice {
  pagination: { currentPage: number; pageSize: number };
}

export const paginationListenerMiddleware = createListenerMiddleware();

paginationListenerMiddleware.startListening({
  matcher: isAnyOf(setPage, setPageSize, resetPage),
  effect: (_action, api) => {
    const { currentPage, pageSize } = (api.getState() as PaginationStateSlice).pagination;
    const params = new URLSearchParams(window.location.search);
    params.set('page', String(currentPage));
    params.set('limit', String(pageSize));
    window.history.replaceState(null, '', `?${params.toString()}`);
  },
});

paginationListenerMiddleware.startListening({
  matcher: isAnyOf(setCallTypeFilter, setDateRangeFilter),
  effect: (_action, api) => {
    api.dispatch(resetPage());
  },
});
