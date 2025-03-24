import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/',
    prepareHeaders: (headers, { getState }) => {
      const companyId = getState().company?.currentCompanyId;
      if (companyId) {
        headers.set('x-company-id', companyId);
      }
      return headers;
    },
  }),
  tagTypes: ['Bundle', 'Group'],
  endpoints: (builder) => ({
    // Groups endpoints
    getGroups: builder.query({
      query: () => 'api/groups',
      providesTags: ['Group'],
    }),
    getGroupDetails: builder.query({
      query: (groupId) => `api/groups/${groupId}`,
    }),

    // Products endpoints
    getGroupProducts: builder.query({
      query: (groupId) => `api/groups/${groupId}/products`,
    }),

    // Bundles endpoints
    getBundles: builder.query({
      query: () => 'api/bundles',
      providesTags: ['Bundle'],
    }),
    createBundle: builder.mutation({
      query: (bundle) => ({
        url: 'api/bundles',
        method: 'POST',
        body: bundle,
      }),
      invalidatesTags: ['Bundle'],
    }),
    updateBundle: builder.mutation({
      query: ({ id, ...bundle }) => ({
        url: `api/bundles/${id}`,
        method: 'PUT',
        body: bundle,
      }),
      invalidatesTags: ['Bundle'],
    }),
  }),
});

export const {
  useGetGroupsQuery,
  useGetGroupDetailsQuery,
  useGetGroupProductsQuery,
  useGetBundlesQuery,
  useCreateBundleMutation,
  useUpdateBundleMutation,
} = api;
