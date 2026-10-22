import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { useAppRole } from 'src/hooks/use-app-role';
import { useParams } from 'src/routes/hooks';
import { ProductFormView } from 'src/sections/_active/products-view';
import { MOCK_PRODUCTS } from 'src/sections/_active/products-view/mock';

const metadata = { title: `Edit product | ${CONFIG.site.name}` };

export default function Page() {
  const { id = '' } = useParams();
  const { companyId, sellerId } = useAppRole();
  const product = MOCK_PRODUCTS.find((row) => row._id === id && row.company?._id === sellerId);

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ProductFormView currentProduct={product} missing={!product} sellerMode sellerCompanyId={companyId} />
    </>
  );
}
