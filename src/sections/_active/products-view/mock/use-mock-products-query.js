import { useMemo, useState } from 'react';

import { MOCK_PRODUCTS } from './products';

// ----------------------------------------------------------------------

export function useGetMockProductsQuery(params = {}) {
  const { search = '', page = 0, limit = 10, category = '', sale = '', rating = '', status = '', sellerId } = params;
  const [revision, setRevision] = useState(0);

  return useMemo(() => {
    let rows = MOCK_PRODUCTS.map((row) => ({
      ...row,
      images: [...(row.images || [])],
      colors: [...(row.colors || [])],
      features: [...(row.features || [])],
      company: row.company
        ? {
            ...row.company,
            seller: row.company.seller ? { ...row.company.seller } : null,
          }
        : null,
    }));

    if (sellerId) {
      rows = rows.filter((row) => row.company?.seller?._id === sellerId);
    }

    if (search) {
      const query = search.toLowerCase();
      rows = rows.filter(
        (row) =>
          row.title.toLowerCase().includes(query) ||
          row.description.toLowerCase().includes(query) ||
          row.category.toLowerCase().includes(query) ||
          row.company?.name?.toLowerCase().includes(query)
      );
    }

    if (category && category !== 'all') {
      rows = rows.filter((row) => row.category === category);
    }

    if (sale === 'on-sale') {
      rows = rows.filter((row) => Number(row.offPercent) > 0);
    }

    if (sale === 'regular') {
      rows = rows.filter((row) => !Number(row.offPercent));
    }

    if (rating && rating !== 'all') {
      rows = rows.filter((row) => Math.round(row.rating || 0) === Number(rating));
    }

    const counts = rows.reduce((acc, row) => {
      const key = row.status || 'active';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    if (status && status !== 'all') {
      rows = rows.filter((row) => (row.status || 'active') === status);
    }

    const start = page * limit;
    const pagedRows = rows.slice(start, start + limit);

    return {
      data: {
        data: pagedRows,
        total_length: rows.length,
        meta: {
          totalRecords: rows.length,
          counts,
        },
      },
      isLoading: false,
      isFetching: false,
      error: undefined,
      refetch: () => setRevision((value) => value + 1),
    };
  }, [search, page, limit, category, sale, rating, status, sellerId, revision]);
}
