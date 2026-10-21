import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { CustomerListView } from 'src/sections/_active/customers-view';

const metadata = { title: `Customers | ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <CustomerListView />
    </>
  );
}
