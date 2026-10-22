import { useMemo, useState } from 'react';

import { MOCK_OPTIONS } from './options';

// ----------------------------------------------------------------------

export function useGetMockOptionsQuery(params = {}) {
  const { search = '', page = 0, limit = 10, type = '' } = params;
  const [revision, setRevision] = useState(0);

  return useMemo(() => {
    let rows = MOCK_OPTIONS.map((row) => ({ ...row, values: row.values.map((item) => ({ ...item })) }));

    if (search) {
      const query = search.toLowerCase();
      rows = rows.filter((row) => row.name.toLowerCase().includes(query));
    }

    if (type && type !== 'all') {
      rows = rows.filter((row) => row.type === type);
    }

    const start = page * limit;
    const pagedRows = rows.slice(start, start + limit);

    return {
      data: {
        data: pagedRows,
        total_length: rows.length,
        meta: {
          totalRecords: rows.length,
        },
      },
      isLoading: false,
      isFetching: false,
      error: undefined,
      refetch: () => setRevision((value) => value + 1),
    };
  },[search, page, limit, type, revision]);
}
