import { useSelector } from 'react-redux';

import { paths } from 'src/routes/paths';
import { selectUser } from 'src/store/slices/userSlice';

export const PERMISSION_ADMIN = 1;
export const PERMISSION_SELLER = 2;

export function useAppRole() {
  const user = useSelector(selectUser);
  const isAdmin = user?.permission === PERMISSION_ADMIN;
  const isSeller = user?.permission === PERMISSION_SELLER;
  const appPaths = isSeller ? paths.dashboard : paths.adminDashboard;

  return {
    user,
    isAdmin,
    isSeller,
    sellerId: user?.sellerId || null,
    companyId: user?.companyId || null,
    appPaths,
    loginPath: isAdmin ? paths.auth.adminSignIn : paths.auth.sellerSignIn,
  };
}
