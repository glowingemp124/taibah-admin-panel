import { useMemo, useState } from 'react';

import { MOCK_PRODUCTS } from './products';

// ----------------------------------------------------------------------

export function useGetMockProductsQuery(params = {}) {
  const { search = '', page = 0, availability = '', limit = 10, category = '' } = params;
  const [revision, setRevision] = useState(0);

  return useMemo(() => {
    let rows = MOCK_PRODUCTS.map((row) => ({
      ...row,
      images: [...(row.images || [])],
      colors: [...(row.colors || [])],
      features: [...(row.features || [])],
      company: row.company ? { ...row.company } : null,
    }));

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

    const counts = rows.reduce((acc, row) => {
      acc[row.availability] = (acc[row.availability] || 0) + 1;
      return acc;
    }, {});

    if (availability) {
      rows = rows.filter((row) => row.availability === availability);
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
  }, [search, page, availability, limit, category, revision]);
}
