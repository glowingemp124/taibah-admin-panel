import PropTypes from 'prop-types';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { Label } from 'src/components/label';
import { ProductStoreCard } from 'src/sections/_active/products-view/product-store-card';
import { fCurrency } from 'src/utils/format-number';
import { fDateTime } from 'src/utils/format-time';
import { getStatusColor } from 'src/utils/table-utils';

import { getPaymentLabel, getTransactionStatusLabel } from './transaction-table-config';

export function TransactionViewDialog({ transaction, open, onClose, hideVendor = false }) {
  if (!transaction) return null;

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <DialogTitle>Transaction Details</DialogTitle>

      <DialogContent>
        <Stack spacing={2.5} sx={{ pt: 1 }}>
          <Box
            sx={{
              p: 2.5,
              borderRadius: 2,
              color: 'primary.contrastText',
              bgcolor: 'primary.main',
            }}
          >
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              Transaction ID #{transaction.transactionId}
            </Typography>
            <Typography variant="h6" sx={{ mt: 0.5 }}>
              {fCurrency(transaction.amount)}
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5, opacity: 0.9 }}>
              {getPaymentLabel(transaction.paymentMethod)}
              {transaction.cardLast4 ? ` · •••• ${transaction.cardLast4}` : ''}
            </Typography>
          </Box>

          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="subtitle2">Status</Typography>
            <Label variant="soft" color={getStatusColor(transaction.status)}>
              {getTransactionStatusLabel(transaction.status)}
            </Label>
          </Stack>

          <Stack spacing={0.5}>
            <Typography variant="subtitle2">Order</Typography>
            <Typography variant="body2">#{transaction.orderId || '—'}</Typography>
          </Stack>

          <Stack spacing={0.5}>
            <Typography variant="subtitle2">Reference</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {transaction.reference || 'N/A'}
            </Typography>
          </Stack>

          <Divider />

          <Box>
            <Typography variant="subtitle1" sx={{ mb: 1.5 }}>
              Customer
            </Typography>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Avatar src={transaction.customer?.avatarUrl} alt={transaction.customer?.name} />
              <Box>
                <Typography variant="subtitle2">{transaction.customer?.name || 'N/A'}</Typography>
                <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>
                  {transaction.customer?.email}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {transaction.customer?.phone}
                </Typography>
              </Box>
            </Stack>
          </Box>

          {!hideVendor && (
            <Box>
              <Typography variant="subtitle1" sx={{ mb: 1.5 }}>
                Vendor
              </Typography>
              {transaction.vendor ? (
                <ProductStoreCard company={transaction.vendor} />
              ) : (
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  No vendor details
                </Typography>
              )}
            </Box>
          )}

          {transaction.note ? (
            <Stack spacing={0.5}>
              <Typography variant="subtitle2">Note</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', whiteSpace: 'pre-wrap' }}>
                {transaction.note}
              </Typography>
            </Stack>
          ) : null}

          <Stack direction="row" justifyContent="space-between" flexWrap="wrap" useFlexGap>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Created {transaction.createdAt ? fDateTime(transaction.createdAt) : 'N/A'}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {transaction.paidAt ? `Paid ${fDateTime(transaction.paidAt)}` : 'Not paid yet'}
            </Typography>
          </Stack>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button variant="contained" color="primary" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

TransactionViewDialog.propTypes = {
  transaction: PropTypes.object,
  open: PropTypes.bool,
  onClose: PropTypes.func,
  hideVendor: PropTypes.bool,
};
