import { useMemo, useState } from 'react';

import { MOCK_TICKETS } from './tickets';

// ----------------------------------------------------------------------

export function useGetMockSupportQuery(params = {}) {
  const { search = '', page = 0, status = '', limit = 10, priority = '' } = params;
  const [revision, setRevision] = useState(0);

  return useMemo(() => {
    let rows = MOCK_TICKETS.map((row) => ({
      ...row,
      replies: (row.replies || []).map((reply) => ({ ...reply })),
    }));

    if (search) {
      const query = search.toLowerCase();
      rows = rows.filter(
        (row) =>
          row.name.toLowerCase().includes(query) ||
          row.email.toLowerCase().includes(query) ||
          row.subject.toLowerCase().includes(query) ||
          row.message.toLowerCase().includes(query) ||
          row.phone?.toLowerCase().includes(query)
      );
    }

    if (priority && priority !== 'all') {
      rows = rows.filter((row) => row.priority === priority);
    }

    const counts = rows.reduce((acc, row) => {
      acc[row.status] = (acc[row.status] || 0) + 1;
      return acc;
    }, {});

    if (status && status !== 'all') {
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
  }, [search, page, status, limit, priority, revision]);
}
