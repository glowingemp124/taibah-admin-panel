import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { AdminOverviewView } from 'src/sections/_active/admin-overview/view';

// ----------------------------------------------------------------------

const metadata = { title: `Dashboard | ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <AdminOverviewView />
    </>
  );
}
