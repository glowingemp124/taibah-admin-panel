import { useMemo, useState } from 'react';

import { MOCK_TRANSACTIONS } from './transactions';

// ----------------------------------------------------------------------

export function useGetMockTransactionsQuery(params = {}) {
  const { search = '', page = 0, status = '', limit = 10, paymentMethod = '', startDate, endDate, userId } = params;
  const [revision, setRevision] = useState(0);

  return useMemo(() => {
    let rows = MOCK_TRANSACTIONS.map((row) => ({
      ...row,
      customer: row.customer ? { ...row.customer } : null,
      vendor: row.vendor
        ? {
            ...row.vendor,
            seller: row.vendor.seller ? { ...row.vendor.seller } : null,
          }
        : null,
    }));

    if (userId) {
      rows = rows.filter((row) => row.customer?._id === userId);
    }

    if (search) {
      const query = search.toLowerCase();
      rows = rows.filter(
        (row) =>
          row.transactionId.toLowerCase().includes(query) ||
          row.orderId?.toLowerCase().includes(query) ||
          row.reference?.toLowerCase().includes(query) ||
          row.customer?.name?.toLowerCase().includes(query) ||
          row.customer?.email?.toLowerCase().includes(query) ||
          row.vendor?.name?.toLowerCase().includes(query) ||
          row.vendor?.seller?.name?.toLowerCase().includes(query)
      );
    }

    if (paymentMethod && paymentMethod !== 'all') {
      rows = rows.filter((row) => row.paymentMethod === paymentMethod);
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
  }, [search, page, status, limit, paymentMethod, startDate, endDate, userId, revision]);
}
