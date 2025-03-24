import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
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
  tagTypes: ['Bundle', 'Group', 'Product'],
  endpoints: (builder) => ({
    // Groups endpoints
    getGroups: builder.query({
      query: () => 'api/groups',
      providesTags: ['Group'],
    }),
    getGroupDetails: builder.query({
      query: (groupId) => `api/groups/${groupId}`,
      providesTags: (result, error, groupId) => [{ type: 'Group', id: groupId }],
    }),

    // Products endpoints
    getGroupProducts: builder.query({
      query: (groupId) => `api/groups/${groupId}/products`,
      providesTags: (result, error, groupId) => [
        { type: 'Product', id: groupId },
        'Product',
      ],
    }),

    // Bundles endpoints
    getBundles: builder.query({
      query: (params) => ({
        url: 'api/bundles',
        params,
      }),
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
