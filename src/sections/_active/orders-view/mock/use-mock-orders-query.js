import { useMemo, useState } from 'react';

import { MOCK_ORDERS, toSellerOrder } from './orders';

// ----------------------------------------------------------------------

const ORDER_STATUSES = ['pending', 'processing', 'on-the-way', 'delivered', 'cancelled'];


export function useGetMockOrdersQuery(params = {}) {
  const { search = '', page = 0, status = '', limit = 10, startDate, endDate, userId, sellerId } = params;
  const [revision, setRevision] = useState(0);

  return useMemo(() => {
    let rows = sellerId ? MOCK_ORDERS.map((row) => toSellerOrder(row, sellerId)).filter(Boolean) : [...MOCK_ORDERS];

    if (userId) {
      rows = rows.filter((row) => row.customer?._id === userId);
    }

    if (search) {
      const query = search.toLowerCase();
      rows = rows.filter(
        (row) =>
          row.code.toLowerCase().includes(query) ||
          row.customer?.name?.toLowerCase().includes(query) ||
          row.customer?.email?.toLowerCase().includes(query) ||
          row.stores.some(
            (store) =>
              store.code.toLowerCase().includes(query) ||
              store.name.toLowerCase().includes(query) ||
              store.items.some((line) => line.title.toLowerCase().includes(query) || line.sku?.toLowerCase().includes(query))
          )
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

    const counts = ORDER_STATUSES.reduce((acc, key) => ({ ...acc, [key]: rows.filter((row) => row.status === key).length }), {});

    if (status && status !== 'all') {
      rows = rows.filter((row) => row.status === status);
    }

    rows.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

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
  }, [search, page, status, limit, startDate, endDate, userId, sellerId, revision]);
}
