import { useMemo } from 'react';

import { MOCK_NOTIFICATIONS } from './notifications';

// ----------------------------------------------------------------------

export function useGetMockNotificationsQuery(params = {}) {
  const { search = '', page = 0, status = '', limit = 10, startDate, endDate } = params;

  return useMemo(() => {
    let rows = [...MOCK_NOTIFICATIONS];

    if (search) {
      const query = search.toLowerCase();
      rows = rows.filter(
        (row) => row.title.toLowerCase().includes(query) || row.message.toLowerCase().includes(query)
      );
    }

    if (startDate) {
      const from = new Date(startDate);
      rows = rows.filter((row) => new Date(row.createdAt) >= from);
    }

    if (endDate) {
      const to = new Date(endDate);
      to.setHours(23, 59, 59, 999);
      rows = rows.filter((row) => new Date(row.createdAt) <= to);
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
  }, [search, page, status, limit, startDate, endDate]);
}
