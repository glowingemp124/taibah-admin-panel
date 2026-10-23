import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { useAppRole } from 'src/hooks/use-app-role';
import { OrderListView } from 'src/sections/_active/orders-view';

const metadata = { title: `Orders | ${CONFIG.site.name}` };

export default function Page() {
  const { sellerId } = useAppRole();

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <OrderListView sellerMode sellerId={sellerId} />
    </>
  );
}
