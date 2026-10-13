import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { EmptyContent } from 'src/components/empty-content';
import { Iconify } from 'src/components/iconify';
import { useTabs } from 'src/hooks/use-tabs';
import { OrderListView } from 'src/sections/_active/orders-view';
import { ProductListView } from 'src/sections/_active/products-view';
import { TransactionListView } from 'src/sections/_active/transactions-view';

import { MOCK_USERS } from './mock';
import { UserProfileCard } from './user-profile-card';
import { UserStatusDialog } from './user-status-dialog';

export function UserDetailsView() {
  const { id } = useParams();

  const [user, setUser] = useState(() => MOCK_USERS.find((row) => row._id === id) || null);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);

  const isBuyer = (user?.roles || []).includes('buyer');
  const isSeller = (user?.roles || []).includes('seller');

  const roleTabs = useTabs(isBuyer ? 'buyer' : 'seller');
  const buyerTabs = useTabs('orders');
  const sellerTabs = useTabs('products');

  useEffect(() => {
    const nextUser = MOCK_USERS.find((row) => row._id === id) || null;
    setUser(nextUser);
    const nextIsBuyer = (nextUser?.roles || []).includes('buyer');
    roleTabs.setValue(nextIsBuyer ? 'buyer' : 'seller');
    buyerTabs.setValue('orders');
    sellerTabs.setValue('products');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleOpenStatus = useCallback(() => {
    setStatusDialogOpen(true);
  }, []);

  const handleCloseStatus = useCallback(() => {
    setStatusDialogOpen(false);
  }, []);

  const handleStatusSuccess = useCallback(() => {
    setUser(MOCK_USERS.find((row) => row._id === id) || null);
  }, [id]);

  const visibleRoleTabs = useMemo(() => {
    const tabs = [];
    if (isBuyer) tabs.push({ value: 'buyer', label: 'Buyer', icon: 'solar:bag-bold' });
    if (isSeller) tabs.push({ value: 'seller', label: 'Seller', icon: 'solar:shop-bold' });
    return tabs;
  }, [isBuyer, isSeller]);

  const showRoleTabs = visibleRoleTabs.length > 1;

  if (!user) {
    return (
      <Box sx={{ px: { xs: 2, md: 5 }, pb: 5, pt: 3 }}>
        <CustomBreadcrumbs
          heading="User details"
          links={[{ name: 'Dashboard', href: paths.adminDashboard.root }, { name: 'Users', href: paths.adminDashboard.users.root }, { name: 'Details' }]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        <EmptyContent
          filled
          title="User not found"
          description="This user does not exist or has been removed."
          action={
            <Button component={RouterLink} href={paths.adminDashboard.users.root} variant="contained" color="primary">
              Back to users
            </Button>
          }
          sx={{ py: 10 }}
        />
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ px: { xs: 2, md: 5 }, pb: 5, pt: 3 }}>
        <CustomBreadcrumbs
          heading={user.name}
          links={[{ name: 'Dashboard', href: paths.adminDashboard.root }, { name: 'Users', href: paths.adminDashboard.users.root }, { name: user.name }]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <UserProfileCard user={user} onEditStatus={handleOpenStatus} />

        {!!visibleRoleTabs.length && (
          <Card sx={{ mt: 3 }}>
            {showRoleTabs && (
              <Tabs value={roleTabs.value} onChange={roleTabs.onChange} sx={{ px: 2.5, pt: 1 }}>
                {visibleRoleTabs.map((tab) => (
                  <Tab key={tab.value} value={tab.value} label={tab.label} icon={<Iconify icon={tab.icon} width={20} />} iconPosition="start" />
                ))}
              </Tabs>
            )}

            {roleTabs.value === 'buyer' && isBuyer && (
              <Box sx={{ p: 2.5 }}>
                <Tabs value={buyerTabs.value} onChange={buyerTabs.onChange} sx={{ mb: 2.5 }}>
                  <Tab value="orders" label="Orders" />
                  <Tab value="transactions" label="Transactions" />
                </Tabs>

                {buyerTabs.value === 'orders' && <OrderListView embedded userId={user._id} orderScope="customer" />}
                {buyerTabs.value === 'transactions' && <TransactionListView embedded userId={user._id} />}
              </Box>
            )}

            {roleTabs.value === 'seller' && isSeller && (
              <Box sx={{ p: 2.5 }}>
                <Tabs value={sellerTabs.value} onChange={sellerTabs.onChange} sx={{ mb: 2.5 }}>
                  <Tab value="products" label="Products" />
                  <Tab value="orders" label="Orders" />
                </Tabs>

                {sellerTabs.value === 'products' && <ProductListView embedded sellerId={user._id} />}
                {sellerTabs.value === 'orders' && <OrderListView embedded userId={user._id} orderScope="vendor" />}
              </Box>
            )}
          </Card>
        )}
      </Box>

      <UserStatusDialog currentUser={user} open={statusDialogOpen} onClose={handleCloseStatus} onSuccess={handleStatusSuccess} />
    </>
  );
}
