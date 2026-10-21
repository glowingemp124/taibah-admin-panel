import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { ProductDetailsView } from 'src/sections/_active/products-view';

const metadata = { title: `Product details | ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ProductDetailsView />
    </>
  );
}
