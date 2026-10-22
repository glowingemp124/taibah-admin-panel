import { useCallback, useMemo, useState } from 'react';

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { ChartSelect } from 'src/components/chart';
import { useBoolean } from 'src/hooks/use-boolean';
import { useAppRole } from 'src/hooks/use-app-role';
import { DashboardContent } from 'src/layouts/dashboard';
import { AnalyticsConversionRates } from 'src/sections/overview/analytics/analytics-conversion-rates';
import { AnalyticsWebsiteVisits } from 'src/sections/overview/analytics/analytics-website-visits';
import { OrderEditDialog } from 'src/sections/_active/orders-view/order-edit-dialog';
import { getOrderTotal, MOCK_ORDERS } from 'src/sections/_active/orders-view/mock';
import { OrderViewDialog } from 'src/sections/_active/orders-view/order-view-dialog';
import { MOCK_COMPANIES, MOCK_PRODUCTS } from 'src/sections/_active/products-view/mock';
import { MOCK_USERS } from 'src/sections/_active/users-view/mock';
import { fCurrency, fNumber, fShortenNumber } from 'src/utils/format-number';

import { SellerChartCard } from './seller-chart-card';
import { SellerLatestOrders } from './seller-latest-orders';
import { SellerLatestReviews } from './seller-latest-reviews';
import { SellerStatCard } from './seller-stat-card';

const GRID_ITEM_SX = {
  display: 'flex',
  '& > *': { width: 1, minHeight: 1 },
};

const CARD_SX = { height: 1, width: 1 };

const LOW_STOCK_THRESHOLD = 10;

const ORDER_TREND_OPTIONS = ['Last 7 days', 'Monthly', 'Yearly'];

const ORDER_TREND = {
  'Last 7 days': {
    categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    data: [8, 12, 6, 15, 18, 21, 14],
  },
  Monthly: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    data: [18, 24, 31, 28, 36, 42, 38, 45, 41, 48, 44, 52],
  },
  Yearly: {
    categories: ['2022', '2023', '2024', '2025', '2026'],
    data: [186, 248, 312, 368, 412],
  },
};

const isStoreClient = (userId) => {
  const roles = MOCK_USERS.find((row) => row._id === userId)?.roles || [];
  return roles.includes('buyer') && !roles.includes('seller');
};

export function SellerOverviewView() {
  const theme = useTheme();
  const { user, sellerId } = useAppRole();
  const company = MOCK_COMPANIES.find((row) => row.seller?._id === sellerId);
  const [revision, setRevision] = useState(0);
  const [orderTrendPeriod, setOrderTrendPeriod] = useState('Monthly');
  const viewDialog = useBoolean();
  const editDialog = useBoolean();
  const [currentOrder, setCurrentOrder] = useState(null);
  const orderTrend = ORDER_TREND[orderTrendPeriod];

  const products = MOCK_PRODUCTS.filter((row) => row.company?._id === sellerId);
  const orders = useMemo(
    () => MOCK_ORDERS.filter((row) => (row.items || []).some((item) => item.vendor?.seller?._id === sellerId)),
    [revision, sellerId]
  );

  const sales = orders.filter((row) => row.status !== 'cancelled').reduce((sum, row) => sum + getOrderTotal(row), 0);
  const customers = new Set(orders.map((row) => row.customer?._id).filter(isStoreClient));
  const activeProducts = products.filter((row) => (row.status || 'active') === 'active');
  const lowStockItems = products.filter((row) => (row.stock ?? 0) <= LOW_STOCK_THRESHOLD);
  const pendingShipments = orders.filter((row) => row.status === 'pending' || row.status === 'processing');
  const cancelledOrders = orders.filter((row) => row.status === 'cancelled');
  const returnRequests = cancelledOrders.length;
  const averageRating = products.length
    ? Math.round((products.reduce((sum, row) => sum + (Number(row.rating) || 0), 0) / products.length) * 10) / 10
    : 0;

  const statusSeries = useMemo(() => {
    const counts = orders.reduce((acc, row) => {
      acc[row.status] = (acc[row.status] || 0) + 1;
      return acc;
    }, {});

    const grouped = {
      delivered: counts.delivered || 0,
      processing: (counts.processing || 0) + (counts['on-the-way'] || 0),
      pending: counts.pending || 0,
      cancelled: counts.cancelled || 0,
    };

    return [
      { label: 'Delivered', value: grouped.delivered, color: theme.palette.success.main },
      { label: 'Processing', value: grouped.processing, color: theme.palette.warning.light },
      { label: 'Pending', value: grouped.pending, color: theme.palette.info.dark },
      { label: 'Cancelled', value: grouped.cancelled, color: theme.palette.error.main },
    ].filter((item) => item.value > 0);
  }, [orders, theme]);

  const topSelling = useMemo(
    () =>
      [...products]
        .sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0))
        .slice(0, 5),
    [products]
  );

  const latestOrders = useMemo(
    () => [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5),
    [orders]
  );

  const latestReviews = useMemo(
    () =>
      products
        .flatMap((product) =>
          (product.reviews || []).map((review) => ({
            ...review,
            productId: product._id,
            productTitle: product.title,
          }))
        )
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 4),
    [products]
  );

  const handleOpenView = useCallback(
    (row) => {
      setCurrentOrder(row);
      viewDialog.onTrue();
    },
    [viewDialog]
  );

  const handleOpenEdit = useCallback(
    (row) => {
      setCurrentOrder(row);
      editDialog.onTrue();
    },
    [editDialog]
  );

  const handleCloseView = useCallback(() => {
    viewDialog.onFalse();
    if (!editDialog.value) setCurrentOrder(null);
  }, [viewDialog, editDialog]);

  const handleCloseEdit = useCallback(() => {
    editDialog.onFalse();
    if (!viewDialog.value) setCurrentOrder(null);
  }, [editDialog, viewDialog]);

  return (
    <DashboardContent maxWidth="xl">
      <Stack spacing={0.5} sx={{ mb: { xs: 3, md: 3 } }}>
        <Typography variant="h4">Welcome, {user?.basicInfo?.name || 'Seller'}</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {company?.name || 'Your store'} overview
        </Typography>
      </Stack>

      <Grid container spacing={2.5} alignItems="stretch">
        <Grid xs={12} sm={6} md={3} sx={GRID_ITEM_SX}>
          <SellerStatCard
            title="Total Orders"
            value={fNumber(orders.length)}
            icon="solar:cart-large-2-bold"
            hint="+12% this week"
            hintColor="success"
          />
        </Grid>

        <Grid xs={12} sm={6} md={3} sx={GRID_ITEM_SX}>
          <SellerStatCard
            title="Active Products"
            value={fNumber(activeProducts.length)}
            icon="solar:box-bold"
            color="warning"
            hint="+8 this week"
            hintColor="success"
          />
        </Grid>

        <Grid xs={12} sm={6} md={3} sx={GRID_ITEM_SX}>
          <SellerStatCard
            title="Low Stock Items"
            value={fNumber(lowStockItems.length)}
            icon="solar:clipboard-list-bold"
            color="error"
            hint="Needs restock"
            hintColor="warning"
          />
        </Grid>

        <Grid xs={12} sm={6} md={3} sx={GRID_ITEM_SX}>
          <SellerStatCard
            title="New Customers"
            value={fNumber(customers.size)}
            icon="solar:users-group-rounded-bold"
            color="info"
            hint="+24% this month"
            hintColor="success"
          />
        </Grid>

        <Grid xs={12} sm={6} md={3} sx={GRID_ITEM_SX}>
          <SellerStatCard
            title="Pending Shipments"
            value={fNumber(pendingShipments.length)}
            icon="solar:delivery-bold"
            color="info"
            hint="Awaiting dispatch"
            hintColor="info"
          />
        </Grid>

        <Grid xs={12} sm={6} md={3} sx={GRID_ITEM_SX}>
          <SellerStatCard
            title="Cancelled Orders"
            value={fNumber(cancelledOrders.length)}
            icon="solar:close-circle-bold"
            color="error"
            hint="-3 vs last week"
            hintColor="error"
          />
        </Grid>

        <Grid xs={12} sm={6} md={3} sx={GRID_ITEM_SX}>
          <SellerStatCard
            title="Return Requests"
            value={fNumber(returnRequests)}
            icon="solar:restart-bold"
            color="warning"
            hint="Needs review"
            hintColor="warning"
          />
        </Grid>

        <Grid xs={12} sm={6} md={3} sx={GRID_ITEM_SX}>
          <SellerStatCard
            title="Average Rating"
            value={averageRating.toFixed(1)}
            icon="solar:star-bold"
            color="warning"
            hint="+0.2"
            hintColor="success"
          />
        </Grid>

        <Grid xs={12} md={6} lg={8} sx={GRID_ITEM_SX}>
          <SellerChartCard
            title="Orders Trend"
            subheader="Shows how orders are changing over time."
            type="line"
            sx={CARD_SX}
            action={<ChartSelect options={ORDER_TREND_OPTIONS} value={orderTrendPeriod} onChange={setOrderTrendPeriod} />}
            chart={{
              colors: [theme.palette.primary.main],
              categories: orderTrend.categories,
              series: [{ name: 'Orders', data: orderTrend.data }],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4} sx={GRID_ITEM_SX}>
          <SellerChartCard
            title="Orders by status"
            subheader="Shows the current state of all orders."
            type="pie"
            sx={CARD_SX}
            chart={{
              colors: statusSeries.map((item) => item.color),
              labels: statusSeries.map((item) => item.label),
              series: statusSeries.length ? statusSeries.map((item) => item.value) : [1],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8} sx={GRID_ITEM_SX}>
          <AnalyticsConversionRates
            title="Top Selling Products"
            subheader="Based on quantity sold, not revenue."
            sx={CARD_SX}
            chart={{
              colors: [theme.palette.primary.main],
              categories: topSelling.length ? topSelling.map((item) => item.title) : ['No products yet'],
              series: [
                {
                  name: 'Sold',
                  data: topSelling.length ? topSelling.map((item) => Number(item.soldCount) || 0) : [0],
                },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4} sx={GRID_ITEM_SX}>
          <SellerChartCard
            title="Customer Growth"
            subheader="Tracks newly acquired customers."
            type="line"
            sx={CARD_SX}
            chart={{
              colors: [theme.palette.primary.main],
              categories: ['W1', 'W2', 'W3', 'W4', 'W5'],
              series: [{ name: 'Customers', data: [1, 2, 3, 2, 4] }],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8} sx={GRID_ITEM_SX}>
          <AnalyticsWebsiteVisits
            title="Returns Trend"
            subheader="Shows how return requests change over time."
            sx={CARD_SX}
            chart={{
              colors: [theme.palette.primary.main],
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
              series: [{ name: 'Returns', data: [12, 18, 15, 21, 16, 14] }],
              options: {
                tooltip: {
                  y: { formatter: (value) => `${value} returns` },
                },
                legend: { show: false },
              },
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4} sx={GRID_ITEM_SX}>
          <Card sx={{ p: 2.5, height: 1, width: 1, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6">Store</Typography>

            <Stack spacing={2} sx={{ flex: 1, mt: 2 }}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Avatar src={company?.logo} alt={company?.name} variant="rounded" sx={{ width: 56, height: 56 }} />
                <Stack spacing={0.25} sx={{ minWidth: 0 }}>
                  <Typography variant="subtitle1" noWrap>
                    {company?.name || 'N/A'}
                  </Typography>
                  <Stack direction="row" spacing={0.75} alignItems="center">
                    <Rating size="small" value={Math.round(company?.rating || 0)} readOnly />
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {Math.round(company?.rating || 0)}/5 · {fShortenNumber(company?.reviews || 0)} reviews
                    </Typography>
                  </Stack>
                </Stack>
              </Stack>

              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {company?.description || ''}
              </Typography>

              <Stack direction="row" spacing={2} sx={{ mt: 'auto' }}>
                <Stack>
                  <Typography variant="h6">{fNumber(products.length)}</Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Products
                  </Typography>
                </Stack>
                <Stack>
                  <Typography variant="h6">{fCurrency(sales)}</Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Sales
                  </Typography>
                </Stack>
                <Stack>
                  <Typography variant="h6">{averageRating.toFixed(1)}</Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Rating
                  </Typography>
                </Stack>
              </Stack>

              <Button
                component={RouterLink}
                href={paths.dashboard.storeSettings}
                variant="outlined"
                color="primary"
                fullWidth
              >
                Store settings
              </Button>
            </Stack>
          </Card>
        </Grid>

        <Grid xs={12} sx={GRID_ITEM_SX}>
          <SellerLatestOrders
            title="Recent Orders"
            tableData={latestOrders}
            viewAllHref={paths.dashboard.orders.root}
            onViewRow={handleOpenView}
            onEditRow={handleOpenEdit}
            sx={CARD_SX}
          />
        </Grid>

        <Grid xs={12} sx={GRID_ITEM_SX}>
          <SellerLatestReviews
            title="Latest Reviews"
            tableData={latestReviews}
            viewAllHref={paths.dashboard.reviews}
            sx={CARD_SX}
          />
        </Grid>
      </Grid>

      <OrderViewDialog order={currentOrder} open={viewDialog.value} onClose={handleCloseView} hideVendor />

      <OrderEditDialog currentOrder={editDialog.value ? currentOrder : null} open={editDialog.value} onClose={handleCloseEdit} onSuccess={() => setRevision((value) => value + 1)} />
    </DashboardContent>
  );
}
