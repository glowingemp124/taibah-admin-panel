import { lazy, Suspense } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { CONFIG } from 'src/config-global';
import { DashboardLayout } from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';

import ProtectedRoute from 'src/auth/guard/custom-auth-guard';

// ----------------------------------------------------------------------

const IndexPage = lazy(() => import('src/pages/admin-dashboard'));
const CategoriesPage = lazy(() => import('src/pages/admin-dashboard/categories'));
const EventsPage = lazy(() => import('src/pages/admin-dashboard/events'));
const ProductsPage = lazy(() => import('src/pages/admin-dashboard/products'));
const ProductCreatePage = lazy(() => import('src/pages/admin-dashboard/products/new'));
const ProductEditPage = lazy(() => import('src/pages/admin-dashboard/products/edit'));
const ProductDetailsPage = lazy(() => import('src/pages/admin-dashboard/products/details'));
const OrdersPage = lazy(() => import('src/pages/admin-dashboard/orders'));
const OrderDetailsPage = lazy(() => import('src/pages/admin-dashboard/orders/details'));
const TransactionsPage = lazy(() => import('src/pages/admin-dashboard/transactions'));
const ChatAiStatsPage = lazy(() => import('src/pages/admin-dashboard/chat-ai-stats'));
const CustomersPage = lazy(() => import('src/pages/admin-dashboard/customers'));
const CustomerDetailsPage = lazy(() => import('src/pages/admin-dashboard/customers/details'));
const SellersPage = lazy(() => import('src/pages/admin-dashboard/sellers'));
const SellerDetailsPage = lazy(() => import('src/pages/admin-dashboard/sellers/details'));
const PendingSellersPage = lazy(() => import('src/pages/admin-dashboard/pending-sellers'));
const ReviewsPage = lazy(() => import('src/pages/admin-dashboard/reviews'));
const NotificationsPage = lazy(() => import('src/pages/admin-dashboard/notifications'));
const ProfilePage = lazy(() => import('src/pages/admin-dashboard/profile'));
const TermsPage = lazy(() => import('src/pages/dashboard/active-routes/terms'));
const AboutUsPage = lazy(() => import('src/pages/dashboard/active-routes/about'));
const PolicyPage = lazy(() => import('src/pages/dashboard/active-routes/policy'));
const SupportPage = lazy(() => import('src/pages/dashboard/active-routes/support'));
const FaqsPage = lazy(() => import('src/pages/dashboard/active-routes/faqs'));
const HelpCenterPage = lazy(() => import('src/pages/dashboard/active-routes/help-center'));
const HelpCenterDetailsPage = lazy(() => import('src/pages/dashboard/active-routes/help-center-details'));

// ----------------------------------------------------------------------

const layoutContent = (
  <DashboardLayout>
    <Suspense fallback={<LoadingScreen />}>
      <Outlet />
    </Suspense>
  </DashboardLayout>
);

export const adminDashboardRoutes = [
  {
    path: 'admin-dashboard',
    element: CONFIG.auth.skip ? <>{layoutContent}</> : <ProtectedRoute requiredPermission={[1]}>{layoutContent}</ProtectedRoute>,
    children: [
      { element: <IndexPage />, index: true },
      { path: 'categories', element: <CategoriesPage /> },
      { path: 'events', element: <EventsPage /> },
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
      { path: 'transactions', element: <TransactionsPage /> },
      { path: 'chat-ai-stats', element: <ChatAiStatsPage /> },
      {
        path: 'users',
        children: [
          { element: <Navigate to="/admin-dashboard/customers" replace />, index: true },
          { path: ':id', element: <Navigate to="/admin-dashboard/customers" replace /> },
        ],
      },
      {
        path: 'customers',
        children: [
          { element: <CustomersPage />, index: true },
          { path: ':id', element: <CustomerDetailsPage /> },
        ],
      },
      {
        path: 'sellers',
        children: [
          { element: <SellersPage />, index: true },
          { path: ':id', element: <SellerDetailsPage /> },
        ],
      },
      { path: 'pending-sellers', element: <PendingSellersPage /> },
      { path: 'reviews', element: <ReviewsPage /> },
      { path: 'notifications', element: <NotificationsPage /> },
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
