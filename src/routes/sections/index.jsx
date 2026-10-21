import { lazy } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';

import { GuestGuard, SignupFlowGuard } from 'src/auth/guard';
import { AuthBrandLayout } from 'src/layouts/auth-brand';
import { SIGNUP_STAGE } from 'src/sections/auth/jwt/seller-signup';
import { adminDashboardRoutes } from './admin-dashboard';
import { authRoutes } from './auth';
import { authDemoRoutes } from './auth-demo';
import { componentsRoutes } from './components';
import { dashboardRoutes } from './dashboard';
import { mainRoutes } from './main';

const Jwt = {
  SignInPage: lazy(() => import('src/pages/auth/jwt/sign-in')),
  SignUpPage: lazy(() => import('src/pages/auth/jwt/sign-up')),
  VerifyPage: lazy(() => import('src/pages/auth/jwt/verify')),
  OnboardingPage: lazy(() => import('src/pages/auth/jwt/onboarding')),
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
          <AuthBrandLayout>
            <Jwt.SignUpPage />
          </AuthBrandLayout>
        </GuestGuard>
      ),
    },
    {
      path: 'verify',
      element: (
        <SignupFlowGuard stage={SIGNUP_STAGE.VERIFY}>
          <AuthBrandLayout>
            <Jwt.VerifyPage />
          </AuthBrandLayout>
        </SignupFlowGuard>
      ),
    },
    {
      path: 'onboarding',
      element: (
        <SignupFlowGuard stage={SIGNUP_STAGE.ONBOARDING}>
          <AuthBrandLayout wide contentMaxWidth={560} constrainInputs={false}>
            <Jwt.OnboardingPage />
          </AuthBrandLayout>
        </SignupFlowGuard>
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
