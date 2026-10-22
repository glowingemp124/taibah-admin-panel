import { useSelector } from 'react-redux';

import { paths } from 'src/routes/paths';
import { selectUser } from 'src/store/slices/userSlice';

export const PERMISSION_ADMIN = 1;
export const PERMISSION_SELLER = 2;

// Seller onboarding stores `verified`; the catalog screens speak in `approved`.
const SELLER_STATUS_MAP = { verified: 'approved', approved: 'approved', rejected: 'rejected' };

export function useAppRole() {
  const user = useSelector(selectUser);
  const isAdmin = user?.permission === PERMISSION_ADMIN;
  const isSeller = user?.permission === PERMISSION_SELLER;
  const appPaths = isSeller ? paths.dashboard : paths.adminDashboard;
  const verificationStatus = user?.sellerStatus || user?.sellerProfile?.verificationStatus;

  return {
    user,
    isAdmin,
    isSeller,
    sellerId: user?.sellerId || null,
    companyId: user?.companyId || null,
    sellerStatus: isSeller ? SELLER_STATUS_MAP[verificationStatus] || 'pending' : null,
    appPaths,
    loginPath: isAdmin ? paths.auth.adminSignIn : paths.auth.sellerSignIn,
  };
}
