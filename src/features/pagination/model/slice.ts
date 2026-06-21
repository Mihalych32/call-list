import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { PaginationState } from './types';

const DEFAULT_PAGE_SIZE = 20;

function readUrlParams(): PaginationState {
  const params = new URLSearchParams(window.location.search);
  const page = parseInt(params.get('page') ?? '1', 10);
  const limit = parseInt(params.get('limit') ?? String(DEFAULT_PAGE_SIZE), 10);
  return {
    currentPage: Number.isFinite(page) && page > 0 ? page : 1,
    pageSize: Number.isFinite(limit) && limit > 0 ? limit : DEFAULT_PAGE_SIZE,
  };
}

const paginationSlice = createSlice({
  name: 'pagination',
  initialState: readUrlParams,
  reducers: {
    setPage(state, action: PayloadAction<number>) {
      state.currentPage = action.payload;
    },
    setPageSize(state, action: PayloadAction<number>) {
      state.pageSize = action.payload;
      state.currentPage = 1;
    },
    resetPage(state) {
      state.currentPage = 1;
    },
  },
});

export const { setPage, setPageSize, resetPage } = paginationSlice.actions;
export const paginationReducer = paginationSlice.reducer;
