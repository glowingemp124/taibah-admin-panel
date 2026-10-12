import { useMemo } from 'react';

import { MOCK_CATEGORIES } from './categories';

// ----------------------------------------------------------------------

export function useGetMockCategoriesQuery(params = {}) {
  const { search = '', page = 0, status = '', limit = 10 } = params;

  return useMemo(() => {
    let rows = [...MOCK_CATEGORIES];

    if (search) {
      const query = search.toLowerCase();
      rows = rows.filter((row) => row.title.toLowerCase().includes(query));
    }

    const counts = rows.reduce((acc, row) => {
      acc[row.status] = (acc[row.status] || 0) + 1;
      return acc;
    }, {});

    if (status) {
      rows = rows.filter((row) => row.status === status);
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
      refetch: () => {},
    };
  }, [search, page, status, limit]);
}
