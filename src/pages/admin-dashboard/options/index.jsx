import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { OptionListView } from 'src/sections/_active/options-view';

// ----------------------------------------------------------------------

const metadata = { title: `Options | ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <OptionListView />
    </>
  );
}
