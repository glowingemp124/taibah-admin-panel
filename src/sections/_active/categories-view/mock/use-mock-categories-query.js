import { useMemo, useState } from 'react';

import { MOCK_CATEGORIES } from './categories';

// ----------------------------------------------------------------------

export function useGetMockCategoriesQuery(params = {}) {
  const { search = '', page = 0, status = '', limit = 10 } = params;
  const [revision, setRevision] = useState(0);

  return useMemo(() => {
    let rows = MOCK_CATEGORIES.map((row) => ({ ...row, attributes: [...(row.attributes || [])] }));

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
      refetch: () => setRevision((value) => value + 1),
    };
  }, [search, page, status, limit, revision]);
}
