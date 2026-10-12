import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { CategoryListView } from 'src/sections/_active/categories-view';

// ----------------------------------------------------------------------

const metadata = { title: `Categories | ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <CategoryListView />
    </>
  );
}
