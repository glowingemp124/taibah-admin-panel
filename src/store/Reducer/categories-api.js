import { createApi } from '@reduxjs/toolkit/query/react';
import { API_ROUTES } from '../apiRoutes';
import { createCustomFetchBaseQuery } from '../baseQuery';

export const categoriesApi = createApi({
  reducerPath: 'categoriesApi',
  baseQuery: createCustomFetchBaseQuery(),
  tagTypes: ['category'],

  endpoints: (builder) => ({
    getCategories: builder.query({
      query: ({ search = '', page = 0, status = '', date, limit = 10, startDate, endDate }) => {
        const params = {
          page: page + 1,
          limit,
        };

        if (search) params.keyword = search;
        if (status) params.status = status;
        if (date) params.date = date;
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;

        return {
          url: API_ROUTES.CATEGORIES,
          method: 'GET',
          params,
        };
      },
      transformResponse: (res) => ({
        data: res?.data || [],
        meta: res?.meta || {},
        total_length: res?.meta?.totalRecords || 0,
      }),
      providesTags: ['category'],
    }),

    addCategory: builder.mutation({
      query: (newCategory) => ({
        url: API_ROUTES.CATEGORIES,
        method: 'POST',
        body: newCategory,
      }),
      invalidatesTags: ['category'],
    }),

    updateCategory: builder.mutation({
      query: ({ id, ...updatedCategory }) => ({
        url: API_ROUTES.CATEGORIES_BY_ID(id),
        method: 'PUT',
        body: updatedCategory,
      }),
      invalidatesTags: ['category'],
    }),

    deleteCategory: builder.mutation({
      query: (id) => ({
        url: API_ROUTES.CATEGORIES_BY_ID(id),
        method: 'DELETE',
      }),
      invalidatesTags: ['category'],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useAddCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoriesApi;
