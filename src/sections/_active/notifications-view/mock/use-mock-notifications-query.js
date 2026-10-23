import { useMemo, useState } from 'react';

import { MOCK_NOTIFICATIONS } from './notifications';

// ----------------------------------------------------------------------

const STATUSES = ['draft', 'scheduled', 'sending', 'sent', 'failed'];

export function useGetMockNotificationsQuery(params = {}) {
  const { search = '', page = 0, status = '', limit = 10, startDate, endDate } = params;
  const [revision, setRevision] = useState(0);

  return useMemo(() => {
    let rows = MOCK_NOTIFICATIONS.map((row) => ({ ...row, stats: { ...row.stats } })).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    if (search) {
      const query = search.toLowerCase();
      rows = rows.filter((row) => row.title.toLowerCase().includes(query) || row.message.toLowerCase().includes(query));
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

    // meta.counts has every status, so the tabs don't jump when one is empty.
    const counts = STATUSES.reduce((acc, key) => ({ ...acc, [key]: rows.filter((row) => row.status === key).length }), {});

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
  }, [search, page, status, limit, startDate, endDate, revision]);
}
