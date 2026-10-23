import { paths } from 'src/routes/paths';

import { UserListView } from 'src/sections/_active/users-view';

export function SellerListView() {
  return (
    <UserListView
      heading="Sellers"
      role="seller"
      hideUserType
      showFeatured
      detailsHref={(id) => paths.adminDashboard.sellers.details(id)}
    />
  );
}
