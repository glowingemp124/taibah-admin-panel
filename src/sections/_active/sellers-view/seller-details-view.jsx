import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import FormControlLabel from '@mui/material/FormControlLabel';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Tooltip from '@mui/material/Tooltip';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { EmptyContent } from 'src/components/empty-content';
import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { useTabs } from 'src/hooks/use-tabs';
import { varAlpha } from 'src/theme/styles';
import { OrderListView } from 'src/sections/_active/orders-view';
import { ProductListView } from 'src/sections/_active/products-view';
import { MOCK_COMPANIES } from 'src/sections/_active/products-view/mock';
import { ReviewListView } from 'src/sections/_active/reviews-view';
import { TransactionListView } from 'src/sections/_active/transactions-view';
import { MOCK_USERS } from 'src/sections/_active/users-view/mock';

import { resolveSellerProfile } from './resolve-seller-profile';
import { isSellerApproved, updateSellerFeatured } from './seller-featured';
import { SellerEditDialog } from './seller-edit-dialog';
import { SellerProfileOverview } from './seller-profile-overview';
import { isApprovedStatus } from 'src/utils/seller-status';

const TABS = [
  { value: 'profile', label: 'Profile', icon: <Iconify icon="solar:user-id-bold" width={24} /> },
  { value: 'products', label: 'Products', icon: <Iconify icon="solar:box-bold" width={24} /> },
  { value: 'orders', label: 'Orders', icon: <Iconify icon="solar:bag-bold" width={24} /> },
  { value: 'reviews', label: 'Reviews', icon: <Iconify icon="solar:star-bold" width={24} /> },
  {
    value: 'transactions',
    label: 'Transactions',
    icon: <Iconify icon="solar:bill-list-bold" width={24} />,
  },
];

function verificationColor(status) {
  if (isApprovedStatus(status)) return 'success';
  if (status === 'rejected') return 'error';
  return 'warning';
}

export function SellerDetailsView() {
  const { id } = useParams();
  const tabs = useTabs('profile');
  const [editOpen, setEditOpen] = useState(false);

  const [user, setUser] = useState(() => MOCK_USERS.find((row) => row._id === id) || null);
  const company = MOCK_COMPANIES.find((row) => row.seller?._id === id);
  const [profile, setProfile] = useState(() =>
    resolveSellerProfile(
      MOCK_USERS.find((row) => row._id === id),
      MOCK_COMPANIES.find((row) => row.seller?._id === id)
    )
  );

  const [savingFeatured, setSavingFeatured] = useState(false);

  const loadSeller = useCallback(() => {
    const nextUser = MOCK_USERS.find((row) => row._id === id) || null;
    const nextCompany = MOCK_COMPANIES.find((row) => row.seller?._id === id);
    setUser(nextUser);
    setProfile(resolveSellerProfile(nextUser, nextCompany));
  }, [id]);

  const featured = !!profile?.featured;
  const canFeature = isSellerApproved(profile);

  const handleFeaturedChange = async (event) => {
    const next = event.target.checked;
    setSavingFeatured(true);
    try {
      await updateSellerFeatured(id, profile, next);
      setProfile((current) => ({ ...current, featured: next }));
      toast.success(next ? 'Store is now featured' : 'Store is no longer featured');
    } catch (error) {
      toast.error(error.status === 409 ? 'Approve the seller first' : 'Failed to update featured');
    } finally {
      setSavingFeatured(false);
    }
  };

  useEffect(() => {
    loadSeller();
    tabs.setValue('profile');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const isSeller = (user?.roles || []).includes('seller');

  if (!user || !isSeller) {
    return (
      <Box sx={{ px: { xs: 2, md: 5 }, pb: 5, pt: 3 }}>
        <CustomBreadcrumbs
          heading="Seller details"
          links={[
            { name: 'Dashboard', href: paths.adminDashboard.root },
            { name: 'Sellers', href: paths.adminDashboard.sellers.root },
            { name: 'Details' },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        <EmptyContent
          filled
          title="Seller not found"
          description="This seller does not exist or has been removed."
          action={
            <Button component={RouterLink} href={paths.adminDashboard.sellers.root} variant="contained" color="primary">
              Back to sellers
            </Button>
          }
          sx={{ py: 10 }}
        />
      </Box>
    );
  }

  const displayName = [profile?.firstName, profile?.lastName].filter(Boolean).join(' ') || user.name;
  const storeName = profile?.storeName || company?.name || 'Seller';

  return (
    <>
      <Box sx={{ px: { xs: 2, md: 5 }, pb: 5, pt: 3 }}>
        <CustomBreadcrumbs
          heading={displayName}
          links={[
            { name: 'Dashboard', href: paths.adminDashboard.root },
            { name: 'Sellers', href: paths.adminDashboard.sellers.root },
            { name: displayName },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card
          sx={{
            mb: 3,
            overflow: 'hidden',
            boxShadow: (theme) => theme.customShadows.z8,
          }}
        >
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={{ xs: 2, md: 3 }}
            alignItems={{ xs: 'center', md: 'center' }}
            sx={{
              px: { xs: 2, md: 3 },
              pt: { xs: 3, md: 3 },
              pb: 2.5,
              bgcolor: (theme) => varAlpha(theme.vars.palette.grey['500Channel'], 0.06),
            }}
          >
            <Avatar
              alt={displayName}
              src={user.avatarUrl}
              sx={{
                width: { xs: 80, md: 112 },
                height: { xs: 80, md: 112 },
                fontSize: 36,
                fontWeight: 700,
                color: 'primary.contrastText',
                bgcolor: 'primary.main',
                border: (theme) => `4px solid ${theme.vars.palette.background.paper}`,
                boxShadow: (theme) => theme.customShadows.z8,
              }}
            >
              {displayName?.charAt(0).toUpperCase()}
            </Avatar>

            <Stack spacing={1} sx={{ flex: 1, minWidth: 0, alignItems: { xs: 'center', md: 'flex-start' } }}>
              <ListItemText
                primary={displayName}
                secondary={storeName}
                primaryTypographyProps={{ typography: 'h4', textAlign: { xs: 'center', md: 'left' } }}
                secondaryTypographyProps={{
                  component: 'span',
                  typography: 'body2',
                  sx: { mt: 0.5, color: 'text.secondary' },
                }}
                sx={{ my: 0 }}
              />

              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap justifyContent={{ xs: 'center', md: 'flex-start' }}>
                <Label variant="soft" color={user.status === 'active' ? 'success' : 'error'}>
                  {user.status}
                </Label>
                <Label variant="soft" color={verificationColor(profile?.verificationStatus)}>
                  {profile?.verificationStatus || 'pending'}
                </Label>
                {featured && (
                  <Label variant="soft" color="warning" startIcon={<Iconify icon="solar:star-bold" width={14} />}>
                    Featured
                  </Label>
                )}
              </Stack>
            </Stack>

            <Stack direction="row" spacing={2} alignItems="center">
              <Tooltip title={canFeature ? '' : 'Approve the seller first'}>
                <span>
                  <FormControlLabel
                    label="Featured"
                    disabled={!canFeature || savingFeatured}
                    control={<Switch checked={featured} onChange={handleFeaturedChange} />}
                    sx={{ mr: 0 }}
                  />
                </span>
              </Tooltip>
              <Button
                variant="contained"
                color="primary"
                startIcon={<Iconify icon="solar:pen-bold" />}
                onClick={() => setEditOpen(true)}
              >
                Edit details
              </Button>
            </Stack>
          </Stack>

          <Box
            display="flex"
            justifyContent={{ xs: 'center', md: 'flex-end' }}
            sx={{
              px: { md: 3 },
              bgcolor: 'background.paper',
              borderTop: (theme) => `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.12)}`,
            }}
          >
            <Tabs value={tabs.value} onChange={tabs.onChange} variant="scrollable" allowScrollButtonsMobile>
              {TABS.map((tab) => (
                <Tab key={tab.value} value={tab.value} icon={tab.icon} label={tab.label} iconPosition="start" />
              ))}
            </Tabs>
          </Box>
        </Card>

        {tabs.value === 'profile' && <SellerProfileOverview profile={profile} hideEdit />}

        {tabs.value === 'products' && <ProductListView embedded sellerId={user._id} />}

        {tabs.value === 'orders' && <OrderListView embedded sellerId={user._id} />}

        {tabs.value === 'reviews' && <ReviewListView embedded sellerId={user._id} sellerMode={false} />}

        {tabs.value === 'transactions' && <TransactionListView embedded sellerId={user._id} />}
      </Box>

      <SellerEditDialog
        user={user}
        profile={profile}
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSuccess={(nextProfile) => {
          loadSeller();
          setProfile(nextProfile);
        }}
      />
    </>
  );
}
