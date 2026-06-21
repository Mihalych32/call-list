import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { ApiCallListResponse, GetCallListParams, GetRecordParams } from '../model/types';

export const callApi = createApi({
  reducerPath: 'callApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: (headers) => {
      headers.set('Authorization', `Bearer ${import.meta.env.VITE_API_TOKEN}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getCallList: builder.query<ApiCallListResponse, GetCallListParams>({
      query: (params) => ({
        url: '/getList',
        method: 'POST',
        params,
      }),
      keepUnusedDataFor: 180,
    }),
    getRecord: builder.query<string, GetRecordParams>({
      query: (params) => ({
        url: '/getRecord',
        method: 'POST',
        params,
        responseHandler: async (response) => {
          if (!response.ok) {
            const text = await response.text();
            throw new Error(text || `HTTP ${response.status}`);
          }
          const blob = await response.blob();
          return URL.createObjectURL(blob);
        },
      }),
      keepUnusedDataFor: 3600,
    }),
  }),
});

export const { useGetCallListQuery, useLazyGetRecordQuery } = callApi;
