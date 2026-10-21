import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { CustomerDetailsView } from 'src/sections/_active/customers-view';

const metadata = { title: `Customer details | ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <CustomerDetailsView />
    </>
  );
}
