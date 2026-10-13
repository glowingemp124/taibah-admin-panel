import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { UserDetailsView } from 'src/sections/_active/users-view';

// ----------------------------------------------------------------------

const metadata = { title: `User details | ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <UserDetailsView />
    </>
  );
}
