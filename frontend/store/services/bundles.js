import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query";

export const bundlesApi = createApi({
  reducerPath: 'bundlesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/',
    prepareHeaders: (headers, { getState }) => {
      const companyId = getState().company?.currentCompanyId;
      headers.set('x-company-id', companyId);
      return headers;
    },
  }),
  tagTypes: ['Bundle'],
  endpoints: (builder) => ({
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
  useGetBundlesQuery,
  useCreateBundleMutation,
  useUpdateBundleMutation,
} = bundlesApi;
