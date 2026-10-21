import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { paths } from 'src/routes/paths';
import { PERMISSION_ADMIN } from 'src/hooks/use-app-role';

const ProtectedRoute = ({ children, requiredPermission }) => {
  const { user } = useSelector((state) => state.user);
  const location = useLocation();

  if (!user) {
    const adminArea = location.pathname.startsWith('/admin-dashboard') || location.pathname.startsWith('/admin/');
    return <Navigate to={adminArea ? paths.auth.adminSignIn : paths.auth.sellerSignIn} replace />;
  }

  const hasPermission = Array.isArray(requiredPermission)
    ? requiredPermission.includes(user?.permission)
    : user?.permission === requiredPermission;

  if (!hasPermission) {
    return <Navigate to={user?.permission === PERMISSION_ADMIN ? paths.adminDashboard.root : paths.dashboard.root} replace />;
  }

  return children || <Outlet />;
};

export default ProtectedRoute;
