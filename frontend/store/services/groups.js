import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const groupsApi = createApi({
  reducerPath: 'groupsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/',
    prepareHeaders: (headers, { getState }) => {
      const companyId = getState().company?.currentCompanyId;
      headers.set('x-company-id', companyId);
      return headers;
    },
  }),
  tagTypes: ['Group'],
  endpoints: (builder) => ({
    getGroups: builder.query({
      query: () => 'api/groups',
      providesTags: ['Group'],
    }),
    getGroupProducts: builder.query({
      query: (groupId) => `api/groups/${groupId}/products`,
    }),
  }),
});

export const {
  useGetGroupsQuery,
  useGetGroupProductsQuery,
} = groupsApi;
