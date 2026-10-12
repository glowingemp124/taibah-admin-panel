import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { ProductListView } from 'src/sections/_active/products-view';

// ----------------------------------------------------------------------

const metadata = { title: `Products | ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ProductListView />
    </>
  );
}
