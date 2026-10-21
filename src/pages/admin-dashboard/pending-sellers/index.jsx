import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { PendingSellerListView } from 'src/sections/_active/pending-sellers-view';

const metadata = { title: `Pending Sellers | ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <PendingSellerListView />
    </>
  );
}
