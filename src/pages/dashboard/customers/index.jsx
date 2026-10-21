import { Helmet } from 'react-helmet-async';
import { useMemo } from 'react';

import { CONFIG } from 'src/config-global';
import { useAppRole } from 'src/hooks/use-app-role';
import { MOCK_ORDERS } from 'src/sections/_active/orders-view/mock';
import { MOCK_USERS } from 'src/sections/_active/users-view/mock';
import { UserListView } from 'src/sections/_active/users-view';

const metadata = { title: `Customers | ${CONFIG.site.name}` };

const isStoreClient = (userId) => {
  const roles = MOCK_USERS.find((row) => row._id === userId)?.roles || [];
  return roles.includes('buyer') && !roles.includes('seller');
};

export default function Page() {
  const { sellerId } = useAppRole();

  const userIds = useMemo(() => {
    const ids = MOCK_ORDERS.filter((row) => (row.items || []).some((item) => item.vendor?.seller?._id === sellerId))
      .map((row) => row.customer?._id)
      .filter(isStoreClient);
    return [...new Set(ids)];
  }, [sellerId]);

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <UserListView sellerMode heading="Customers" userIds={userIds} />
    </>
  );
}
