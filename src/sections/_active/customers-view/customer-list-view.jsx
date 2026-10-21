import { paths } from 'src/routes/paths';

import { UserListView } from 'src/sections/_active/users-view';

export function CustomerListView() {
  return (
    <UserListView
      heading="Customers"
      role="buyer"
      hideUserType
      detailsHref={(id) => paths.adminDashboard.customers.details(id)}
    />
  );
}
