import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { EmptyContent } from 'src/components/empty-content';
import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/label';
import { useTabs } from 'src/hooks/use-tabs';
import { varAlpha } from 'src/theme/styles';
import { OrderListView } from 'src/sections/_active/orders-view';
import { toCustomerCard } from 'src/sections/_active/users-view/customer-card-fields';
import { MOCK_USERS } from 'src/sections/_active/users-view/mock';
import { UserStatusDialog } from 'src/sections/_active/users-view/user-status-dialog';
import { getStatusColor } from 'src/utils/table-utils';
import { fDate, formatStr } from 'src/utils/format-time';
import { fNumber } from 'src/utils/format-number';

const TABS = [
  { value: 'orders', label: 'Orders', icon: <Iconify icon="solar:bag-bold" width={24} /> },
  {
    value: 'transactions',
    label: 'Transactions',
    icon: <Iconify icon="solar:bill-list-bold" width={24} />,
  },
];

export function CustomerDetailsView() {
  const { id } = useParams();
  const tabs = useTabs('orders');
  const [statusOpen, setStatusOpen] = useState(false);
  const [user, setUser] = useState(() => MOCK_USERS.find((row) => row._id === id) || null);
  const card = toCustomerCard(user);

  const loadCustomer = useCallback(() => {
    setUser(MOCK_USERS.find((row) => row._id === id) || null);
  }, [id]);

  useEffect(() => {
    loadCustomer();
    tabs.setValue('orders');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const isBuyer = (user?.roles || []).includes('buyer');

  if (!user || !isBuyer) {
    return (
      <Box sx={{ px: { xs: 2, md: 5 }, pb: 5, pt: 3 }}>
        <CustomBreadcrumbs
          heading="Customer details"
          links={[
            { name: 'Dashboard', href: paths.adminDashboard.root },
            { name: 'Customers', href: paths.adminDashboard.customers.root },
            { name: 'Details' },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        <EmptyContent
          filled
          title="Customer not found"
          description="This customer does not exist or has been removed."
          action={
            <Button
              component={RouterLink}
              href={paths.adminDashboard.customers.root}
              variant="contained"
              color="primary"
            >
              Back to customers
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
          links={[
            { name: 'Dashboard', href: paths.adminDashboard.root },
            { name: 'Customers', href: paths.adminDashboard.customers.root },
            { name: user.name },
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
              alt={user.name}
              src={card.profileIcon}
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
              {user.name?.charAt(0).toUpperCase()}
            </Avatar>

            <Stack spacing={1} sx={{ flex: 1, minWidth: 0, alignItems: { xs: 'center', md: 'flex-start' } }}>
              <ListItemText
                primary={user.name}
                secondary={user.email}
                primaryTypographyProps={{ typography: 'h4', textAlign: { xs: 'center', md: 'left' } }}
                secondaryTypographyProps={{
                  component: 'span',
                  typography: 'body2',
                  sx: { mt: 0.5, color: 'text.secondary' },
                }}
                sx={{ my: 0 }}
              />

              {card.phoneNumber && (
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {card.phoneNumber}
                </Typography>
              )}

              <Stack direction="row" spacing={2} sx={{ color: 'text.secondary', typography: 'body2' }}>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <Iconify icon="solar:heart-bold" width={16} />
                  <span>{fNumber(card.favoriteCount)} favourite products</span>
                </Stack>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <Iconify icon="solar:shop-bold" width={16} />
                  <span>{fNumber(card.favoriteStoreCount)} favourite stores</span>
                </Stack>
                {card.joinedAt && <span>Joined {fDate(card.joinedAt, formatStr.paramCase.date)}</span>}
              </Stack>

              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap justifyContent={{ xs: 'center', md: 'flex-start' }}>
                <Label variant="soft" color={getStatusColor(user.status)}>
                  {user.status}
                </Label>
              </Stack>
            </Stack>

            <Button
              variant="contained"
              color="primary"
              startIcon={<Iconify icon="solar:pen-bold" />}
              onClick={() => setStatusOpen(true)}
            >
              Edit Status
            </Button>
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

        {tabs.value === 'orders' && <OrderListView embedded userId={user._id} />}

        {tabs.value === 'transactions' && (
          <EmptyContent filled title="Transactions are coming soon" description="Payments aren't connected yet, so there are no transactions to show." sx={{ py: 10 }} />
        )}
      </Box>

      <UserStatusDialog
        currentUser={user}
        open={statusOpen}
        onClose={() => setStatusOpen(false)}
        onSuccess={loadCustomer}
      />
    </>
  );
}
