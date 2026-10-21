import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { SellerOnboardingView } from 'src/sections/auth/jwt/seller-signup';

const metadata = { title: `Onboarding | ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <SellerOnboardingView />
    </>
  );
}
