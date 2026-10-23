import PropTypes from 'prop-types';
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

import { MOCK_COMPANIES } from 'src/sections/_active/products-view/mock';
import { SellerEditDialog } from 'src/sections/_active/sellers-view/seller-edit-dialog';
import { SellerProfileOverview } from 'src/sections/_active/sellers-view/seller-profile-overview';
import { resolveSellerProfile } from 'src/sections/_active/sellers-view/resolve-seller-profile';

import { MOCK_USERS } from './mock';
import { UserProfileCard } from './user-profile-card';
import { UserStatusDialog } from './user-status-dialog';

export function UserDetailsView({ variant = 'all' }) {
  const { id } = useParams();
  const isCustomerModule = variant === 'customer';
  const isSellerModule = variant === 'seller';

  const listPath = isCustomerModule
    ? paths.adminDashboard.customers.root
    : isSellerModule
      ? paths.adminDashboard.sellers.root
      : paths.adminDashboard.users.root;
  const listLabel = isCustomerModule ? 'Customers' : isSellerModule ? 'Sellers' : 'Users';
  const headingFallback = isCustomerModule ? 'Customer details' : isSellerModule ? 'Seller details' : 'User details';

  const [user, setUser] = useState(() => MOCK_USERS.find((row) => row._id === id) || null);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const company = MOCK_COMPANIES.find((row) => row.seller?._id === id);
  const [sellerProfile, setSellerProfile] = useState(() =>
    isSellerModule ? resolveSellerProfile(MOCK_USERS.find((row) => row._id === id), company) : null
  );

  const isBuyer = (user?.roles || []).includes('buyer');
  const isSeller = (user?.roles || []).includes('seller');
  const matchesModule = isCustomerModule ? isBuyer : isSellerModule ? isSeller : Boolean(user);

  const roleTabs = useTabs(isCustomerModule ? 'buyer' : isSellerModule ? 'seller' : isBuyer ? 'buyer' : 'seller');
  const buyerTabs = useTabs('orders');
  const sellerTabs = useTabs('products');

  useEffect(() => {
    const nextUser = MOCK_USERS.find((row) => row._id === id) || null;
    setUser(nextUser);
    if (isSellerModule) {
      const nextCompany = MOCK_COMPANIES.find((row) => row.seller?._id === id);
      setSellerProfile(resolveSellerProfile(nextUser, nextCompany));
    }
    const nextIsBuyer = (nextUser?.roles || []).includes('buyer');
    roleTabs.setValue(isCustomerModule ? 'buyer' : isSellerModule ? 'seller' : nextIsBuyer ? 'buyer' : 'seller');
    buyerTabs.setValue('orders');
    sellerTabs.setValue('products');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, variant]);

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
    if (!isSellerModule && isBuyer) tabs.push({ value: 'buyer', label: 'Buyer', icon: 'solar:bag-bold' });
    if (!isCustomerModule && isSeller) tabs.push({ value: 'seller', label: 'Seller', icon: 'solar:shop-bold' });
    return tabs;
  }, [isBuyer, isSeller, isCustomerModule, isSellerModule]);

  const showRoleTabs = visibleRoleTabs.length > 1;
  const showBuyerPanel = !isSellerModule && isBuyer && (isCustomerModule || roleTabs.value === 'buyer');
  const showSellerPanel = !isCustomerModule && isSeller && (isSellerModule || roleTabs.value === 'seller');

  if (!user || !matchesModule) {
    return (
      <Box sx={{ px: { xs: 2, md: 5 }, pb: 5, pt: 3 }}>
        <CustomBreadcrumbs
          heading={headingFallback}
          links={[{ name: 'Dashboard', href: paths.adminDashboard.root }, { name: listLabel, href: listPath }, { name: 'Details' }]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        <EmptyContent
          filled
          title={`${isCustomerModule ? 'Customer' : isSellerModule ? 'Seller' : 'User'} not found`}
          description={`This ${listLabel.slice(0, -1).toLowerCase()} does not exist or has been removed.`}
          action={
            <Button component={RouterLink} href={listPath} variant="contained" color="primary">
              Back to {listLabel.toLowerCase()}
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
          links={[{ name: 'Dashboard', href: paths.adminDashboard.root }, { name: listLabel, href: listPath }, { name: user.name }]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <UserProfileCard user={user} onEditStatus={isSellerModule ? undefined : handleOpenStatus} />

        {isSellerModule && (
          <Box sx={{ mt: 3 }}>
            <SellerProfileOverview profile={sellerProfile} onEdit={() => setEditDialogOpen(true)} />
          </Box>
        )}

        {(showBuyerPanel || showSellerPanel) && (
          <Card sx={{ mt: 3 }}>
            {showRoleTabs && (
              <Tabs value={roleTabs.value} onChange={roleTabs.onChange} sx={{ px: 2.5, pt: 1 }}>
                {visibleRoleTabs.map((tab) => (
                  <Tab key={tab.value} value={tab.value} label={tab.label} icon={<Iconify icon={tab.icon} width={20} />} iconPosition="start" />
                ))}
              </Tabs>
            )}

            {showBuyerPanel && (
              <Box sx={{ p: 2.5 }}>
                <Tabs value={buyerTabs.value} onChange={buyerTabs.onChange} sx={{ mb: 2.5 }}>
                  <Tab value="orders" label="Orders" />
                  <Tab value="transactions" label="Transactions" />
                </Tabs>

                {buyerTabs.value === 'orders' && <OrderListView embedded userId={user._id} />}
                {buyerTabs.value === 'transactions' && <TransactionListView embedded userId={user._id} />}
              </Box>
            )}

            {showSellerPanel && (
              <Box sx={{ p: 2.5 }}>
                <Tabs value={sellerTabs.value} onChange={sellerTabs.onChange} sx={{ mb: 2.5 }}>
                  <Tab value="products" label="Products" />
                  <Tab value="orders" label="Orders" />
                </Tabs>

                {sellerTabs.value === 'products' && <ProductListView embedded sellerId={user._id} />}
                {sellerTabs.value === 'orders' && <OrderListView embedded sellerId={user._id} />}
              </Box>
            )}
          </Card>
        )}
      </Box>

      {!isSellerModule && (
        <UserStatusDialog currentUser={user} open={statusDialogOpen} onClose={handleCloseStatus} onSuccess={handleStatusSuccess} />
      )}

      {isSellerModule && (
        <SellerEditDialog
          user={user}
          profile={sellerProfile}
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          onSuccess={(nextProfile) => {
            setUser(MOCK_USERS.find((row) => row._id === id) || null);
            setSellerProfile(nextProfile);
          }}
        />
      )}
    </>
  );
}

UserDetailsView.propTypes = {
  variant: PropTypes.oneOf(['all', 'customer', 'seller']),
};
