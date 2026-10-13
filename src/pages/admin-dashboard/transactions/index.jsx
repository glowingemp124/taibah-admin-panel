import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { TransactionListView } from 'src/sections/_active/transactions-view';

// ----------------------------------------------------------------------

const metadata = { title: `Transactions | ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <TransactionListView />
    </>
  );
}
