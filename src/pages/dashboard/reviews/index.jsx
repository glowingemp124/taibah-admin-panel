import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { useAppRole } from 'src/hooks/use-app-role';
import { ReviewListView } from 'src/sections/_active/reviews-view';

const metadata = { title: `Reviews | ${CONFIG.site.name}` };

export default function Page() {
  const { sellerId } = useAppRole();

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ReviewListView sellerId={sellerId} />
    </>
  );
}
