import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { useAppRole } from 'src/hooks/use-app-role';
import { TransactionListView } from 'src/sections/_active/transactions-view';

const metadata = { title: `Transactions | ${CONFIG.site.name}` };

export default function Page() {
  const { sellerId } = useAppRole();

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <TransactionListView sellerMode sellerId={sellerId} />
    </>
  );
}
