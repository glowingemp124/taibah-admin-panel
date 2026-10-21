import { lazy, Suspense } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { CONFIG } from 'src/config-global';
import { DashboardLayout } from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';

import ProtectedRoute from 'src/auth/guard/custom-auth-guard';

const IndexPage = lazy(() => import('src/pages/dashboard'));
const ProductsPage = lazy(() => import('src/pages/dashboard/products'));
const ProductCreatePage = lazy(() => import('src/pages/dashboard/products/new'));
const ProductEditPage = lazy(() => import('src/pages/dashboard/products/edit'));
const ProductDetailsPage = lazy(() => import('src/pages/dashboard/products/details'));
const OrdersPage = lazy(() => import('src/pages/dashboard/orders'));
const OrderDetailsPage = lazy(() => import('src/pages/dashboard/orders/details'));
const EventsPage = lazy(() => import('src/pages/dashboard/events'));
const TransactionsPage = lazy(() => import('src/pages/dashboard/transactions'));
const CustomersPage = lazy(() => import('src/pages/dashboard/customers'));
const ReviewsPage = lazy(() => import('src/pages/dashboard/reviews'));
const ProfilePage = lazy(() => import('src/pages/dashboard/profile'));
const TermsPage = lazy(() => import('src/pages/dashboard/active-routes/terms'));
const AboutUsPage = lazy(() => import('src/pages/dashboard/active-routes/about'));
const PolicyPage = lazy(() => import('src/pages/dashboard/active-routes/policy'));
const SupportPage = lazy(() => import('src/pages/dashboard/seller-support'));
const FaqsPage = lazy(() => import('src/pages/dashboard/active-routes/faqs'));
const HelpCenterPage = lazy(() => import('src/pages/dashboard/active-routes/help-center'));
const HelpCenterDetailsPage = lazy(() => import('src/pages/dashboard/active-routes/help-center-details'));

const layoutContent = (
  <DashboardLayout>
    <Suspense fallback={<LoadingScreen />}>
      <Outlet />
    </Suspense>
  </DashboardLayout>
);

export const dashboardRoutes = [
  {
    path: 'dashboard',
    element: CONFIG.auth.skip ? <>{layoutContent}</> : <ProtectedRoute requiredPermission={[2]}>{layoutContent}</ProtectedRoute>,
    children: [
      { element: <IndexPage />, index: true },
      {
        path: 'products',
        children: [
          { element: <ProductsPage />, index: true },
          { path: 'new', element: <ProductCreatePage /> },
          { path: ':id/edit', element: <ProductEditPage /> },
          { path: ':id', element: <ProductDetailsPage /> },
        ],
      },
      {
        path: 'orders',
        children: [
          { element: <OrdersPage />, index: true },
          { path: ':id', element: <OrderDetailsPage /> },
        ],
      },
      { path: 'events', element: <EventsPage /> },
      { path: 'transactions', element: <TransactionsPage /> },
      { path: 'customers', element: <CustomersPage /> },
      { path: 'reviews', element: <ReviewsPage /> },
      { path: 'store-settings', element: <Navigate to="/dashboard/profile?tab=store" replace /> },
      { path: 'profile', element: <ProfilePage /> },
      {
        path: 'settings',
        children: [
          { path: 'support', element: <SupportPage /> },
          { path: 'faqs', element: <FaqsPage /> },
          { path: 'help-center', element: <HelpCenterPage /> },
          { path: 'help-center/:id', element: <HelpCenterDetailsPage /> },
          { path: 'privacy', element: <PolicyPage /> },
          { path: 'terms', element: <TermsPage /> },
          { path: 'about', element: <AboutUsPage /> },
        ],
      },
    ],
  },
];
