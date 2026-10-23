import { useMemo, useState } from 'react';

import { hydrateEvent, isEventOpenToStore, MOCK_EVENTS } from './events';

// ----------------------------------------------------------------------

export function useGetMockEventsQuery(params = {}) {
  const { search = '', page = 0, status = '', limit = 10, type = '', startDate, endDate } = params;
  const [revision, setRevision] = useState(0);

  return useMemo(() => {
    let rows = MOCK_EVENTS.map((row) => hydrateEvent(row));

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
  }, [search, page, status, limit, type, startDate, endDate, revision]);
}

// Seller page: published events open to the seller's store that haven't ended.
export function useGetMockSellerEvents(sellerId) {
  const [revision, setRevision] = useState(0);

  const events = useMemo(
    () =>
      MOCK_EVENTS.map((row) => hydrateEvent(row))
        .filter((row) => isEventOpenToStore(row, sellerId) && (row.runtimeStatus === 'active' || row.runtimeStatus === 'scheduled'))
        .sort((a, b) => new Date(a.startAt) - new Date(b.startAt)),
    [sellerId, revision]
  );

  return { events, refetch: () => setRevision((value) => value + 1) };
}
