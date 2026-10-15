import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { useParams } from 'src/routes/hooks';
import { ProductFormView } from 'src/sections/_active/products-view';
import { MOCK_PRODUCTS } from 'src/sections/_active/products-view/mock';

// ----------------------------------------------------------------------

const metadata = { title: `Edit product | ${CONFIG.site.name}` };

export default function Page() {
  const { id = '' } = useParams();
  const product = MOCK_PRODUCTS.find((row) => row._id === id);

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ProductFormView currentProduct={product} missing={!product} />
    </>
  );
}
