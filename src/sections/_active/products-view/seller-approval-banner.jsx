import PropTypes from 'prop-types';

import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

// ----------------------------------------------------------------------

export function SellerApprovalBanner({ sellerStatus, sx }) {
  if (!sellerStatus || sellerStatus === 'approved') return null;

  const rejected = sellerStatus === 'rejected';

  return (
    <Alert severity={rejected ? 'error' : 'warning'} sx={sx}>
      <AlertTitle>{rejected ? 'Seller account rejected' : 'Pending approval'}</AlertTitle>
      {rejected
        ? 'Your seller account was not approved, so you cannot add or change products. Contact support for details.'
        : 'Your seller account is waiting for admin approval. You can add, edit and delete products once it is approved.'}
    </Alert>
  );
}

SellerApprovalBanner.propTypes = {
  sellerStatus: PropTypes.string,
  sx: PropTypes.object,
};
