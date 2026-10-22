import { useMemo, useState } from 'react';

import { summarizeProduct } from '../product-utils';
import { MOCK_PRODUCTS } from './products';

// ----------------------------------------------------------------------

const countBy = (rows, key, fallback) =>
  rows.reduce((acc, row) => {
    const value = row[key] || fallback;
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});

export function useGetMockProductsQuery(params = {}) {
  const { search = '', page = 0, limit = 10, category = '', sale = '', rating = '', status = '', reviewStatus = '', sellerId } = params;
  const [revision, setRevision] = useState(0);

  return useMemo(() => {
    // Re-summarize so `onSale` reflects today's date even for rows created earlier.
    let rows = MOCK_PRODUCTS.map((row) => summarizeProduct(row));

    if (sellerId) {
      rows = rows.filter((row) => row.company?._id === sellerId);
    }

    if (search) {
      const query = search.toLowerCase();
      rows = rows.filter(
        (row) =>
          row.title.toLowerCase().includes(query) ||
          row.description.toLowerCase().includes(query) ||
          row.company?.name?.toLowerCase().includes(query) ||
          (row.variants || []).some((variant) => variant.sku?.toLowerCase().includes(query))
      );
    }

    if (category && category !== 'all') {
      rows = rows.filter((row) => row.category?._id === category);
    }

    if (sale === 'on-sale') {
      rows = rows.filter((row) => row.onSale);
    }

    if (sale === 'regular') {
      rows = rows.filter((row) => !row.onSale);
    }

    if (rating && rating !== 'all') {
      rows = rows.filter((row) => Math.round(row.rating || 0) === Number(rating));
    }

    const byStatus = status && status !== 'all' ? rows.filter((row) => (row.status || 'active') === status) : rows;
    const byReview = reviewStatus && reviewStatus !== 'all' ? rows.filter((row) => row.reviewStatus === reviewStatus) : rows;

    // Each count respects the other filter, so tab and select numbers match what clicking them shows.
    const counts = countBy(byReview, 'status', 'active');
    const reviewCounts = countBy(byStatus, 'reviewStatus', 'pending');

    rows = byStatus.filter((row) => !reviewStatus || reviewStatus === 'all' || row.reviewStatus === reviewStatus);

    const start = page * limit;
    const pagedRows = rows.slice(start, start + limit);

    return {
      data: {
        data: pagedRows,
        total_length: rows.length,
        meta: {
          totalRecords: rows.length,
          counts,
          reviewCounts,
        },
      },
      isLoading: false,
      isFetching: false,
      error: undefined,
      refetch: () => setRevision((value) => value + 1),
    };
  }, [search, page, limit, category, sale, rating, status, reviewStatus, sellerId, revision]);
}
