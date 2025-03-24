import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const dynamicBundleApi = createApi({
  reducerPath: "dynamicBundleApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `/api/v1/dynamic-bundle`,
    prepareHeaders: (headers, { getState }) => {
      const companyId = getState().company?.currentCompanyId;
      if (companyId) {
        headers.set("x-company-id", companyId);
      }
      return headers;
    },
  }),
  tagTypes: ["Bundle", "Group", "Product"],
  endpoints: (builder) => ({
    // Groups endpoints
    getGroups: builder.query({
      query: ({ companyId, applicationId, params = {} }) => ({
        url: `/company/${companyId}/application/${applicationId}/groups`,
        params: {
          name: params.name || "",
          page_no: params.page_no || 1,
          page_size: params.page_size || 10,
        },
      }),
      providesTags: ["Group"],
      transformResponse: (response) => {
        // Transform the response to match the expected format in our components
        return response.items.map((group) => ({
          label: group.name,
          value: group._id,
          products: group.products || [],
        }));
      },
    }),

    getGroupById: builder.query({
      query: ({ companyId, applicationId, groupId }) =>
        `/company/${companyId}/application/${applicationId}/groups/${groupId}`,
      providesTags: (result, error, { groupId }) => [
        { type: "Group", id: groupId },
      ],
    }),

    createGroup: builder.mutation({
      query: ({ companyId, applicationId, data }) => ({
        url: `/company/${companyId}/application/${applicationId}/groups`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Group"],
    }),

    // Products endpoints
    getProducts: builder.query({
      query: ({ companyId, params = {} }) => ({
        url: `/company/${companyId}/products`,
        params: {
          name: params.name || "",
          page_no: params.page_no || 1,
          page_size: params.page_size || 10,
        },
      }),
      providesTags: ["Product"],
    }),

    getGroupProductsAddons: builder.mutation({
      query: ({ companyId, applicationId, groupId, itemUids }) => ({
        url: `/company/${companyId}/application/${applicationId}/groups/${groupId}/products/addons`,
        method: "POST",
        body: { item_uids: itemUids },
      }),
    }),

    // Bundles endpoints
    getBundles: builder.query({
      query: ({ companyId, applicationId, params = {} }) => ({
        url: `/company/${companyId}/application/${applicationId}/combos`,
        params: {
          name: params.name || "",
          page_no: params.page_no || 1,
          page_size: params.page_size || 10,
        },
      }),
      providesTags: ["Bundle"],
    }),

    getBundleById: builder.query({
      query: ({ companyId, applicationId, comboId }) =>
        `/company/${companyId}/application/${applicationId}/combos/${comboId}`,
      providesTags: (result, error, { comboId }) => [
        { type: "Bundle", id: comboId },
      ],
    }),

    createBundle: builder.mutation({
      query: ({ companyId, applicationId, data }) => ({
        url: `/company/${companyId}/application/${applicationId}/combos`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Bundle"],
    }),

    updateBundle: builder.mutation({
      query: ({ companyId, applicationId, comboId, data }) => ({
        url: `/company/${companyId}/application/${applicationId}/combos/${comboId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { comboId }) => [
        { type: "Bundle", id: comboId },
        "Bundle",
      ],
    }),

    deleteBundle: builder.mutation({
      query: ({ companyId, applicationId, comboId }) => ({
        url: `/company/${companyId}/application/${applicationId}/combos/${comboId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Bundle"],
    }),

    searchBundles: builder.mutation({
      query: ({ companyId, applicationId, ids, slugs }) => ({
        url: `/company/${companyId}/application/${applicationId}/combos/search`,
        method: "POST",
        body: {
          combo_ids: ids || [],
          slug_ids: slugs || [],
        },
      }),
    }),
  }),
});

export const {
  useGetGroupsQuery,
  useGetGroupByIdQuery,
  useCreateGroupMutation,
  useGetProductsQuery,
  useGetGroupProductsAddonsMutation,
  useGetBundlesQuery,
  useGetBundleByIdQuery,
  useCreateBundleMutation,
  useUpdateBundleMutation,
  useDeleteBundleMutation,
  useSearchBundlesMutation,
} = dynamicBundleApi;
