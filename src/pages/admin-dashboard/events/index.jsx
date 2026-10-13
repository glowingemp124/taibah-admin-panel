import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { EventListView } from 'src/sections/_active/events-view';

// ----------------------------------------------------------------------

const metadata = { title: `Events | ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <EventListView />
    </>
  );
}
