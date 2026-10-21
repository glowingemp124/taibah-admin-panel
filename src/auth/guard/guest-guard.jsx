import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

import { SplashScreen } from 'src/components/loading-screen';
import { PERMISSION_ADMIN } from 'src/hooks/use-app-role';
import { selectUser } from 'src/store/slices/userSlice';

import { useAuthContext } from '../hooks';

export function GuestGuard({ children }) {
  const router = useRouter();
  const reduxUser = useSelector(selectUser);
  const { loading } = useAuthContext();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (loading) {
      return;
    }

    if (reduxUser) {
      router.replace(reduxUser.permission === PERMISSION_ADMIN ? paths.adminDashboard.root : paths.dashboard.root);
      return;
    }

    setIsChecking(false);
  }, [loading, reduxUser, router]);

  if (isChecking) {
    return <SplashScreen />;
  }

  return <>{children}</>;
}
