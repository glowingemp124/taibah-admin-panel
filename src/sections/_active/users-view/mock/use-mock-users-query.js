import { useMemo, useState } from 'react';

import { MOCK_USERS } from './users';

// ----------------------------------------------------------------------

const matchesUserType = (roles = [], userType) => {
  const hasBuyer = roles.includes('buyer');
  const hasSeller = roles.includes('seller');

  if (userType === 'both') return hasBuyer && hasSeller;
  if (userType === 'buyer') return hasBuyer;
  if (userType === 'seller') return hasSeller;

  return true;
};

export function useGetMockUsersQuery(params = {}) {
  const { search = '', page = 0, status = '', limit = 10, userType = '' } = params;
  const [revision, setRevision] = useState(0);

  return useMemo(() => {
    let rows = MOCK_USERS.map((row) => ({ ...row, roles: [...(row.roles || [])] }));

    if (search) {
      const query = search.toLowerCase();
      rows = rows.filter(
        (row) =>
          row.name.toLowerCase().includes(query) ||
          row.email.toLowerCase().includes(query) ||
          row.phone.toLowerCase().includes(query)
      );
    }

    if (userType && userType !== 'all') {
      rows = rows.filter((row) => matchesUserType(row.roles, userType));
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
  }, [search, page, status, limit, userType, revision]);
}
