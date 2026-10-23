import { useCallback, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';

import { DashboardContent } from 'src/layouts/dashboard';
import { paths } from 'src/routes/paths';
import { useBoolean } from 'src/hooks/use-boolean';
import { selectUser } from 'src/store/slices/userSlice';
import { AnalyticsWebsiteVisits } from 'src/sections/overview/analytics/analytics-website-visits';
import { fCurrency, fNumber } from 'src/utils/format-number';

import { getSellerApplications } from 'src/sections/_active/pending-sellers-view/mock';
import { getOrderItems, getOrderNetTotal, MOCK_ORDERS } from 'src/sections/_active/orders-view/mock';
import { OrderViewDialog } from 'src/sections/_active/orders-view/order-view-dialog';
import { getPrimaryImage, MOCK_COMPANIES, MOCK_PRODUCTS } from 'src/sections/_active/products-view/mock';
import { MOCK_TICKETS } from 'src/sections/_active/support-view/mock';
import { getMockTransactions, getTransactionsMeta } from 'src/sections/_active/transactions-view/mock';
import { MOCK_USERS } from 'src/sections/_active/users-view/mock';
import { SellerChartCard } from 'src/sections/_active/seller-overview/seller-chart-card';
import { SellerStatCard } from 'src/sections/_active/seller-overview/seller-stat-card';

import { AdminLatestOrders } from '../admin-latest-orders';
import { AdminLatestSellers } from '../admin-latest-sellers';
import { AdminTopProducts } from '../admin-top-products';
import { AdminTransactions } from '../admin-transactions';

const GRID_ITEM_SX = {
  display: 'flex',
  '& > *': { width: 1, minHeight: 1 },
};

const CARD_SX = { height: 1, width: 1 };

const LOW_STOCK_THRESHOLD = 10;

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const BAR_AXIS_OPTIONS = {
  grid: { padding: { left: 8, right: 8, bottom: 12 } },
  xaxis: {
    labels: {
      show: true,
      rotate: 0,
      hideOverlappingLabels: false,
      trim: false,
      style: { fontSize: '12px' },
    },
  },
};

export function AdminOverviewView() {
  const theme = useTheme();
  const user = useSelector(selectUser);
  const viewDialog = useBoolean();
  const [currentOrder, setCurrentOrder] = useState(null);

  const sellers = MOCK_USERS.filter((row) => (row.roles || []).includes('seller'));
  const activeProducts = MOCK_PRODUCTS.filter((row) => (row.status || 'active') === 'active');
  const lowStockItems = MOCK_PRODUCTS.filter((row) => (row.stock ?? 0) <= LOW_STOCK_THRESHOLD);
  const pendingOrders = MOCK_ORDERS.filter((row) => row.status === 'pending');
  const cancelledOrders = MOCK_ORDERS.filter((row) => row.status === 'cancelled');
  const paidOrders = MOCK_ORDERS.filter((row) => row.status !== 'cancelled');
  const sales = paidOrders.reduce((sum, row) => sum + getOrderNetTotal(row), 0);
  const averageOrderValue = paidOrders.length ? sales / paidOrders.length : 0;
  const pendingApprovals = getSellerApplications().filter((row) => (row.verificationStatus || 'pending') === 'pending');
  const openTickets = MOCK_TICKETS.filter((row) => row.status === 'open');
  // Only captured amounts are income; held amounts are shown separately.
  // From the API's meta.totals, not by adding up rows.
  // Same rows and rules as the Transactions list (no filters), built fresh so order changes show up.
  const transactions = useMemo(() => getMockTransactions(), []);
  const { totals: transactionTotals } = getTransactionsMeta(transactions);
  const incomeTotal = transactionTotals.income;
  const heldTotal = transactionTotals.held;

  const statusSeries = useMemo(() => {
    const counts = MOCK_ORDERS.reduce((acc, row) => {
      acc[row.status] = (acc[row.status] || 0) + 1;
      return acc;
    }, {});

    return [
      { label: 'Delivered', value: counts.delivered || 0, color: theme.palette.success.main },
      { label: 'Processing', value: (counts.processing || 0) + (counts['on-the-way'] || 0), color: theme.palette.warning.light },
      { label: 'Pending', value: counts.pending || 0, color: theme.palette.info.dark },
      { label: 'Cancelled', value: counts.cancelled || 0, color: theme.palette.error.main },
    ].filter((item) => item.value > 0);
  }, [theme]);

  const registrationTrend = useMemo(() => {
    const usedMonths = [...new Set(MOCK_USERS.map((row) => new Date(row.createdAt).getMonth()))].sort((a, b) => a - b);
    const months = usedMonths.length ? usedMonths : [0, 1, 2, 3, 4, 5];

    return {
      categories: months.map((index) => MONTHS[index]),
      users: months.map((month) => MOCK_USERS.filter((row) => (row.roles || []).includes('buyer') && new Date(row.createdAt).getMonth() === month).length),
      sellers: months.map((month) => MOCK_USERS.filter((row) => (row.roles || []).includes('seller') && new Date(row.createdAt).getMonth() === month).length),
    };
  }, []);

  const ordersByCategory = useMemo(() => {
    const counts = {};

    MOCK_ORDERS.forEach((order) => {
      getOrderItems(order).forEach((item) => {
        const product = MOCK_PRODUCTS.find((row) => row._id === item.productId);
        const category = product?.category?.title || 'Other';
        counts[category] = (counts[category] || 0) + (item.quantity || 1);
      });
    });

    let rows = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    if (!rows.length) {
      const byCategory = {};
      MOCK_PRODUCTS.forEach((product) => {
        const category = product.category?.title || 'Other';
        byCategory[category] = (byCategory[category] || 0) + (product.soldCount || 0);
      });
      rows = Object.entries(byCategory)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);
    }

    return rows;
  }, []);

  const sellerPerformance = useMemo(() => {
    const byVendor = new Map();

    // Per store order, so a store's delivered count follows its own status.
    MOCK_ORDERS.forEach((order) => {
      order.stores.forEach((store) => {
        const current = byVendor.get(store.sellerId) || { name: store.name, orders: 0, delivered: 0 };
        current.orders += 1;
        if (store.status === 'delivered') current.delivered += 1;
        byVendor.set(store.sellerId, current);
      });
    });

    let rows = [...byVendor.values()]
      .filter((row) => row.orders > 0)
      .sort((a, b) => b.orders - a.orders)
      .slice(0, 5);

    if (!rows.length) {
      rows = MOCK_COMPANIES.slice(0, 5).map((company) => ({
        name: company.name,
        orders: MOCK_PRODUCTS.filter((product) => product.company?._id === company.seller?._id).reduce((sum, product) => sum + (product.soldCount || 0), 0),
        delivered: MOCK_PRODUCTS.filter((product) => product.company?._id === company.seller?._id).length,
      }));
    }

    return rows;
  }, []);

  const latestSellers = useMemo(
    () =>
      [...sellers]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)
        .map((seller) => {
          const company = MOCK_COMPANIES.find((row) => row.seller?._id === seller._id);
          const pending = pendingApprovals.find((row) => row.email?.toLowerCase() === seller.email?.toLowerCase());

          return {
            _id: seller._id,
            name: seller.name,
            storeName: company?.name || pending?.storeName || seller.name,
            createdAt: seller.createdAt,
            productCount: MOCK_PRODUCTS.filter((row) => row.company?._id === seller._id).length,
            status: pending || seller.status !== 'active' ? 'Pending' : 'Approved',
            href: pending ? null : paths.adminDashboard.sellers.details(seller._id),
          };
        }),
    [sellers, pendingApprovals]
  );

  const latestOrders = useMemo(
    () =>
      [...MOCK_ORDERS]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)
        .map((order) => ({
          ...order,
          sellerName: order.stores.map((store) => store.name).join(', ') || '—',
        })),
    []
  );

  const topProducts = useMemo(
    () =>
      [...MOCK_PRODUCTS]
        .sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0))
        .slice(0, 5)
        .map((product, index) => ({
          _id: product._id,
          title: product.title,
          image: getPrimaryImage(product),
          category: product.category?.title,
          storeName: product.company?.name || '—',
          sales: (product.soldCount || 0) * (product.salePrice || product.price || 0),
          rank: `Top ${index + 1}`,
        })),
    []
  );

  const recentActivity = useMemo(
    () =>
      [...transactions]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)
        .map((row) => {
          const kind = { captured: ['Paid', 'success'], authorized: ['Held', 'info'], released: ['Released', 'warning'] }[row.status] || ['Sale', 'success'];
          return {
            id: row._id,
            title: `Order ${row.orderId}`,
            type: kind[0],
            amount: row.status === 'released' ? 0 : row.amount || 0,
            color: kind[1],
          };
        }),
    [transactions]
  );

  const handleOpenView = useCallback(
    (row) => {
      setCurrentOrder(row);
      viewDialog.onTrue();
    },
    [viewDialog]
  );

  return (
    <DashboardContent maxWidth="xl">
      <Stack spacing={0.5} sx={{ mb: { xs: 3, md: 3 } }}>
        <Typography variant="h4">Welcome, {user?.basicInfo?.name || 'Admin'}</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Marketplace overview
        </Typography>
      </Stack>

      <Grid container spacing={2.5} alignItems="stretch">
        <Grid xs={12} sm={6} md={3} sx={GRID_ITEM_SX}>
          <SellerStatCard title="Total Users" value={fNumber(MOCK_USERS.length)} icon="solar:users-group-rounded-bold" />
        </Grid>
        <Grid xs={12} sm={6} md={3} sx={GRID_ITEM_SX}>
          <SellerStatCard title="Total Sellers" value={fNumber(sellers.length)} icon="solar:shop-bold" color="info" />
        </Grid>
        <Grid xs={12} sm={6} md={3} sx={GRID_ITEM_SX}>
          <SellerStatCard title="Total Orders" value={fNumber(MOCK_ORDERS.length)} icon="solar:bag-bold" color="warning" />
        </Grid>
        <Grid xs={12} sm={6} md={3} sx={GRID_ITEM_SX}>
          <SellerStatCard title="Active Products" value={fNumber(activeProducts.length)} icon="solar:box-bold" color="secondary" />
        </Grid>
        <Grid xs={12} sm={6} md={3} sx={GRID_ITEM_SX}>
          <SellerStatCard
            title="Pending Seller Approvals"
            value={fNumber(pendingApprovals.length)}
            icon="solar:user-check-bold"
            color="success"
            hint="Needs review"
            hintColor="warning"
          />
        </Grid>
        <Grid xs={12} sm={6} md={3} sx={GRID_ITEM_SX}>
          <SellerStatCard
            title="Pending Orders"
            value={fNumber(pendingOrders.length)}
            icon="solar:clock-circle-bold"
            color="warning"
            hint="Awaiting processing"
            hintColor="warning"
          />
        </Grid>
        <Grid xs={12} sm={6} md={3} sx={GRID_ITEM_SX}>
          <SellerStatCard title="Open Return Requests" value={fNumber(cancelledOrders.length)} icon="solar:restart-bold" color="error" />
        </Grid>
        <Grid xs={12} sm={6} md={3} sx={GRID_ITEM_SX}>
          <SellerStatCard title="Open Support Tickets" value={fNumber(openTickets.length)} icon="solar:chat-round-dots-bold" color="info" />
        </Grid>
        <Grid xs={12} sm={6} md={3} sx={GRID_ITEM_SX}>
          <SellerStatCard title="Total Sales" value={fCurrency(sales)} icon="solar:wad-of-money-bold" color="success" />
        </Grid>
        <Grid xs={12} sm={6} md={3} sx={GRID_ITEM_SX}>
          <SellerStatCard title="Cancelled Orders" value={fNumber(cancelledOrders.length)} icon="solar:close-circle-bold" color="error" />
        </Grid>
        <Grid xs={12} sm={6} md={3} sx={GRID_ITEM_SX}>
          <SellerStatCard title="Average Order Value" value={fCurrency(averageOrderValue)} icon="solar:chart-2-bold" color="primary" />
        </Grid>
        <Grid xs={12} sm={6} md={3} sx={GRID_ITEM_SX}>
          <SellerStatCard
            title="Low Stock Products"
            value={fNumber(lowStockItems.length)}
            icon="solar:clipboard-list-bold"
            color="warning"
            hint="Needs restock"
            hintColor="warning"
          />
        </Grid>

        <Grid xs={12} md={6} lg={8} sx={GRID_ITEM_SX}>
          <SellerChartCard
            title="User vs Seller Registration Trend"
            subheader="Track new customer and seller registrations over time."
            type="line"
            sx={CARD_SX}
            chart={{
              colors: [theme.palette.info.main, theme.palette.success.main],
              categories: registrationTrend.categories,
              series: [
                { name: 'New Users', data: registrationTrend.users },
                { name: 'New Sellers', data: registrationTrend.sellers },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4} sx={GRID_ITEM_SX}>
          <SellerChartCard
            title="Orders by status"
            subheader="Current state of marketplace orders."
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
          <AnalyticsWebsiteVisits
            title="Orders by Category"
            subheader="Categories generating the most order activity, based on item counts."
            sx={CARD_SX}
            chart={{
              colors: [theme.palette.primary.main],
              categories: ordersByCategory.map(([label]) => label),
              series: [{ name: 'Orders', data: ordersByCategory.map(([, value]) => Number(value) || 0) }],
              options: {
                ...BAR_AXIS_OPTIONS,
                xaxis: { ...BAR_AXIS_OPTIONS.xaxis, categories: ordersByCategory.map(([label]) => label) },
                legend: { show: false },
                tooltip: { y: { formatter: (value) => `${value} orders` } },
              },
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4} sx={GRID_ITEM_SX}>
          <AdminTransactions
            title="Transactions"
            currentBalance={incomeTotal}
            rows={[
              { label: 'Paid (captured)', value: incomeTotal },
              { label: 'Held (not income yet)', value: heldTotal },
            ]}
            list={recentActivity}
            sx={CARD_SX}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8} sx={GRID_ITEM_SX}>
          <AnalyticsWebsiteVisits
            title="Seller Performance Comparison"
            subheader="Compare order volume and fulfilment quality for top sellers."
            sx={CARD_SX}
            chart={{
              colors: [theme.palette.primary.main, theme.palette.success.main],
              categories: sellerPerformance.map((row) => row.name),
              series: [
                { name: 'Orders', data: sellerPerformance.map((row) => Number(row.orders) || 0) },
                { name: 'Delivered Orders', data: sellerPerformance.map((row) => Number(row.delivered) || 0) },
              ],
              options: {
                ...BAR_AXIS_OPTIONS,
                xaxis: { ...BAR_AXIS_OPTIONS.xaxis, categories: sellerPerformance.map((row) => row.name) },
                tooltip: { y: { formatter: (value) => `${value} orders` } },
              },
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4} sx={GRID_ITEM_SX}>
          <AdminTopProducts title="Top selling products" tableData={topProducts} sx={CARD_SX} />
        </Grid>

        <Grid xs={12} sx={GRID_ITEM_SX}>
          <AdminLatestSellers title="Latest Registered Sellers" tableData={latestSellers} sx={CARD_SX} />
        </Grid>

        <Grid xs={12} sx={GRID_ITEM_SX}>
          <AdminLatestOrders title="Recent Orders Across Marketplace" tableData={latestOrders} onViewRow={handleOpenView} sx={CARD_SX} />
        </Grid>
      </Grid>

      <OrderViewDialog order={currentOrder} open={viewDialog.value} onClose={viewDialog.onFalse} />
    </DashboardContent>
  );
}
