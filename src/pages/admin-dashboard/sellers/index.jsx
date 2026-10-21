import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { SellerListView } from 'src/sections/_active/sellers-view';

const metadata = { title: `Sellers | ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <SellerListView />
    </>
  );
}
