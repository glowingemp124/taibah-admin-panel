import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { useAppRole } from 'src/hooks/use-app-role';
import { ProductFormView } from 'src/sections/_active/products-view';

const metadata = { title: `New product | ${CONFIG.site.name}` };

export default function Page() {
  const { companyId } = useAppRole();

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ProductFormView sellerMode sellerCompanyId={companyId} />
    </>
  );
}
