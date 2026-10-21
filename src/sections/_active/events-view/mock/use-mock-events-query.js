import { useMemo, useState } from 'react';

import { hydrateEvent, MOCK_EVENTS } from './events';

// ----------------------------------------------------------------------

export function useGetMockEventsQuery(params = {}) {
  const { search = '', page = 0, status = '', limit = 10, type = '', startDate, endDate, upcomingOnly = false } = params;
  const [revision, setRevision] = useState(0);

  return useMemo(() => {
    let rows = MOCK_EVENTS.map((row) => hydrateEvent({ ...row, productIds: [...(row.productIds || [])] }));

    if (search) {
      const query = search.toLowerCase();
      rows = rows.filter(
        (row) =>
          row.title.toLowerCase().includes(query) ||
          row.subtitle?.toLowerCase().includes(query) ||
          row.placement?.toLowerCase().includes(query) ||
          row.ctaLabel?.toLowerCase().includes(query)
      );
    }

    if (upcomingOnly) {
      rows = rows.filter((row) => row.runtimeStatus === 'scheduled' || row.runtimeStatus === 'active');
    }

    if (type && type !== 'all') {
      rows = rows.filter((row) => row.type === type);
    }

    if (startDate) {
      const from = new Date(startDate);
      rows = rows.filter((row) => new Date(row.startAt || row.createdAt) >= from);
    }

    if (endDate) {
      const to = new Date(endDate);
      to.setHours(23, 59, 59, 999);
      rows = rows.filter((row) => new Date(row.startAt || row.createdAt) <= to);
    }

    const counts = rows.reduce((acc, row) => {
      acc[row.runtimeStatus] = (acc[row.runtimeStatus] || 0) + 1;
      return acc;
    }, {});

    if (status && status !== 'all') {
      rows = rows.filter((row) => row.runtimeStatus === status);
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
  }, [search, page, status, limit, type, startDate, endDate, upcomingOnly, revision]);
}
