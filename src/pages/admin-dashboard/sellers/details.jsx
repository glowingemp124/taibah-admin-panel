import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { SellerDetailsView } from 'src/sections/_active/sellers-view';

const metadata = { title: `Seller details | ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <SellerDetailsView />
    </>
  );
}
