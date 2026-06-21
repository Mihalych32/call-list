import { configureStore } from '@reduxjs/toolkit';
import { callTypeFilterReducer } from '@/features/call-type-filter';
import { dateRangeFilterReducer } from '@/features/date-range-filter';
import { paginationReducer } from '@/features/pagination';
import { callApi } from '@/entities/call';
import { paginationListenerMiddleware } from './pagination-listener';

export const store = configureStore({
  reducer: {
    callTypeFilter: callTypeFilterReducer,
    dateRangeFilter: dateRangeFilterReducer,
    pagination: paginationReducer,
    [callApi.reducerPath]: callApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(callApi.middleware)
      .concat(paginationListenerMiddleware.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
