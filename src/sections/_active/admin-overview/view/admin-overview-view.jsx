import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';

import { _analyticOrderTimeline, _bookingReview, _ecommerceBestSalesman, _ecommerceLatestProducts } from 'src/_mock';
import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';

import { AdminLatestReviews } from 'src/sections/_active/admin-overview/admin-latest-reviews';
import { AdminTransactions } from 'src/sections/_active/admin-overview/admin-transactions';
import { AnalyticsCurrentVisits } from 'src/sections/overview/analytics/analytics-current-visits';
import { AnalyticsOrderTimeline } from 'src/sections/overview/analytics/analytics-order-timeline';
import { AnalyticsWebsiteVisits } from 'src/sections/overview/analytics/analytics-website-visits';
import { AnalyticsWidgetSummary } from 'src/sections/overview/analytics/analytics-widget-summary';
import { EcommerceBestSalesman } from 'src/sections/overview/e-commerce/ecommerce-best-salesman';
import { EcommerceLatestProducts } from 'src/sections/overview/e-commerce/ecommerce-latest-products';
import { EcommerceYearlySales } from 'src/sections/overview/e-commerce/ecommerce-yearly-sales';

// ----------------------------------------------------------------------

const GRID_ITEM_SX = {
  display: 'flex',
  '& > *': { width: 1, minHeight: 1 },
};

const CARD_SX = { height: 1, width: 1 };

// ----------------------------------------------------------------------

export function AdminOverviewView() {
  const theme = useTheme();

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 3 } }}>
        Dashboard
      </Typography>

      <Grid container spacing={3} alignItems="stretch">
        <Grid xs={12} sm={6} md={3} sx={GRID_ITEM_SX}>
          <AnalyticsWidgetSummary
            title="Total sales"
            percent={12.6}
            total={187650}
            sx={CARD_SX}
            icon={<img alt="sales" src={`${CONFIG.site.basePath}/assets/icons/glass/ic-glass-bag.svg`} />}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [22, 28, 35, 50, 82, 84, 77, 91],
            }}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3} sx={GRID_ITEM_SX}>
          <AnalyticsWidgetSummary
            title="Orders"
            percent={8.2}
            total={2840}
            color="warning"
            sx={CARD_SX}
            icon={<img alt="orders" src={`${CONFIG.site.basePath}/assets/icons/glass/ic-glass-buy.svg`} />}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [40, 48, 50, 62, 70, 75, 80, 88],
            }}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3} sx={GRID_ITEM_SX}>
          <AnalyticsWidgetSummary
            title="Customers"
            percent={3.4}
            total={12480}
            color="secondary"
            sx={CARD_SX}
            icon={<img alt="customers" src={`${CONFIG.site.basePath}/assets/icons/glass/ic-glass-users.svg`} />}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [56, 47, 54, 62, 73, 80, 86, 94],
            }}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3} sx={GRID_ITEM_SX}>
          <AnalyticsWidgetSummary
            title="Products"
            percent={-1.2}
            total={1264}
            color="error"
            sx={CARD_SX}
            icon={<img alt="products" src={`${CONFIG.site.basePath}/assets/icons/glass/ic-glass-message.svg`} />}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [120, 132, 128, 140, 136, 142, 138, 130],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8} sx={GRID_ITEM_SX}>
          <EcommerceYearlySales
            title="Yearly sales"
            subheader="(+18.4%) than last year"
            sx={CARD_SX}
            chart={{
              colors: [theme.vars.palette.primary.main, theme.vars.palette.warning.main],
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
              series: [
                {
                  name: '2024',
                  data: [
                    { name: 'Revenue', data: [18, 28, 32, 41, 49, 62, 69, 91, 78, 65, 72, 88] },
                    { name: 'Orders', data: [10, 16, 18, 24, 31, 38, 42, 51, 44, 39, 41, 48] },
                  ],
                },
                {
                  name: '2025',
                  data: [
                    { name: 'Revenue', data: [24, 35, 41, 52, 61, 74, 82, 98, 90, 84, 88, 104] },
                    { name: 'Orders', data: [14, 20, 26, 32, 38, 46, 52, 61, 55, 50, 54, 63] },
                  ],
                },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4} sx={GRID_ITEM_SX}>
          <AnalyticsCurrentVisits
            title="Orders by status"
            sx={CARD_SX}
            chart={{
              series: [
                { label: 'Delivered', value: 1480 },
                { label: 'Processing', value: 620 },
                { label: 'Pending', value: 410 },
                { label: 'Cancelled', value: 180 },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8} sx={GRID_ITEM_SX}>
          <AnalyticsWebsiteVisits
            title="Sales vs new customers"
            subheader="(+12.3%) than last year"
            sx={CARD_SX}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
              series: [
                { name: 'Sales', data: [43, 53, 62, 71, 84, 91, 88, 96, 104] },
                { name: 'New customers', data: [18, 22, 27, 31, 36, 42, 39, 48, 52] },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4} sx={GRID_ITEM_SX}>
          <AdminTransactions
            title="Transactions"
            refunded={2350}
            orderTotal={187650}
            currentBalance={96420}
            sx={CARD_SX}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4} sx={GRID_ITEM_SX}>
          <AdminLatestReviews title="Latest reviews" list={_bookingReview} sx={CARD_SX} />
        </Grid>

        <Grid xs={12} md={6} lg={8} sx={GRID_ITEM_SX}>
          <EcommerceBestSalesman
            title="Top selling products"
            tableData={_ecommerceBestSalesman}
            sx={CARD_SX}
            headLabel={[
              { id: 'name', label: 'Product' },
              { id: 'category', label: 'Category' },
              { id: 'country', label: 'Region', align: 'center' },
              { id: 'totalAmount', label: 'Sales', align: 'right' },
              { id: 'rank', label: 'Rank', align: 'right' },
            ]}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4} sx={GRID_ITEM_SX}>
          <EcommerceLatestProducts title="Latest products" list={_ecommerceLatestProducts} sx={CARD_SX} />
        </Grid>

        <Grid xs={12} md={6} lg={8} sx={GRID_ITEM_SX}>
          <AnalyticsOrderTimeline title="Recent orders" list={_analyticOrderTimeline} sx={CARD_SX} />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
