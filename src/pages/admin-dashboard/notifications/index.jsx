import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { NotificationListView } from 'src/sections/_active/notifications-view';

// ----------------------------------------------------------------------

const metadata = { title: `Notifications | ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <NotificationListView />
    </>
  );
}
