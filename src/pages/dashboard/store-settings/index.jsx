import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { StoreSettingsView } from 'src/sections/_active/store-settings-view/store-settings-view';

const metadata = { title: `Store Settings | ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <StoreSettingsView />
    </>
  );
}
