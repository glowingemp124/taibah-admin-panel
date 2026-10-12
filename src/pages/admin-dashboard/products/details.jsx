import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { BlankView } from 'src/sections/blank/view';

// ----------------------------------------------------------------------

const metadata = { title: `Product details | ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <BlankView />
    </>
  );
}
