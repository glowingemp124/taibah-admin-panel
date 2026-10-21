import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { SellerOverviewView } from 'src/sections/_active/seller-overview';

const metadata = { title: `Dashboard | ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <SellerOverviewView />
    </>
  );
}
