import { lazy } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';

import { GuestGuard } from 'src/auth/guard';
import { AuthBrandLayout } from 'src/layouts/auth-brand';
import { adminDashboardRoutes } from './admin-dashboard';
import { authRoutes } from './auth';
import { authDemoRoutes } from './auth-demo';
import { componentsRoutes } from './components';
import { dashboardRoutes } from './dashboard';
import { mainRoutes } from './main';

const Jwt = {
  SignInPage: lazy(() => import('src/pages/auth/jwt/sign-in')),
  SignUpPage: lazy(() => import('src/pages/auth/jwt/sign-up')),
  AdminSignInPage: lazy(() => import('src/pages/auth/jwt/admin-sign-in')),
};

export function Router() {
  return useRoutes([
    {
      path: '/',
      element: (
        <GuestGuard>
          <AuthBrandLayout>
            <Jwt.SignInPage />
          </AuthBrandLayout>
        </GuestGuard>
      ),
    },
    {
      path: 'login',
      element: (
        <GuestGuard>
          <AuthBrandLayout>
            <Jwt.SignInPage />
          </AuthBrandLayout>
        </GuestGuard>
      ),
    },
    {
      path: 'sign-up',
      element: (
        <GuestGuard>
          <AuthBrandLayout wide contentMaxWidth={560} constrainInputs={false}>
            <Jwt.SignUpPage />
          </AuthBrandLayout>
        </GuestGuard>
      ),
    },
    {
      path: 'admin/login',
      element: (
        <GuestGuard>
          <AuthBrandLayout>
            <Jwt.AdminSignInPage />
          </AuthBrandLayout>
        </GuestGuard>
      ),
    },

    // Auth
    ...authRoutes,
    ...authDemoRoutes,

    // Dashboard
    ...dashboardRoutes,

    // Admin Dashboard
    ...adminDashboardRoutes,

    // Main
    ...mainRoutes,

    // Components
    ...componentsRoutes,

    // No match
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
