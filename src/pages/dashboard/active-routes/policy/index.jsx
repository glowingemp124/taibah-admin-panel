import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { useAppRole } from 'src/hooks/use-app-role';
import LegalView from 'src/sections/active-sections/legal-view/legal-view';
import { FaqsHero } from 'src/sections/faqs/faqs-hero';

const metadata = { title: `Policy | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const { isSeller } = useAppRole();

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      {!isSeller && <FaqsHero data="Privacy Policy" />}
      <LegalView type="policy" />
    </>
  );
}
