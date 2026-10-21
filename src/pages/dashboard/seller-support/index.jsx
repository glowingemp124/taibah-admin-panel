import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { SupportCreateView } from 'src/sections/_active/support-view';

const metadata = { title: `Support | ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <SupportCreateView />
    </>
  );
}
