import PropTypes from 'prop-types';

import Timeline from '@mui/lab/Timeline';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/label';
import { fCurrency } from 'src/utils/format-number';
import { fDateTime } from 'src/utils/format-time';
import { getStatusColor } from 'src/utils/table-utils';

import { getOrderStatusLabel, getPaymentLabel, getPaymentStatus } from './order-table-config';

// ----------------------------------------------------------------------

const ROLE_LABELS = { customer: 'Customer', seller: 'Seller', admin: 'Admin', system: 'System' };

function TotalsRows({ subtotal, discountTotal, total, cancelledTotal = 0, netTotal }) {
  return (
    <Stack spacing={0.5} sx={{ typography: 'body2' }}>
      <Stack direction="row" justifyContent="space-between">
        <Box component="span" sx={{ color: 'text.secondary' }}>
          Subtotal
        </Box>
        <span>{fCurrency(subtotal)}</span>
      </Stack>
      {discountTotal > 0 && (
        <Stack direction="row" justifyContent="space-between">
          <Box component="span" sx={{ color: 'text.secondary' }}>
            Discount
          </Box>
          <Box component="span" sx={{ color: 'error.main' }}>
            -{fCurrency(discountTotal)}
          </Box>
        </Stack>
      )}
      <Stack direction="row" justifyContent="space-between" sx={{ typography: 'subtitle1' }}>
        <span>Total</span>
        <span>{fCurrency(total)}</span>
      </Stack>
      {cancelledTotal > 0 && (
        <>
          <Stack direction="row" justifyContent="space-between">
            <Box component="span" sx={{ color: 'text.secondary' }}>
              Refunded (cancelled stores)
            </Box>
            <Box component="span" sx={{ color: 'error.main' }}>
              -{fCurrency(cancelledTotal)}
            </Box>
          </Stack>
          <Stack direction="row" justifyContent="space-between" sx={{ typography: 'subtitle1' }}>
            <span>Net</span>
            <span>{fCurrency(netTotal)}</span>
          </Stack>
        </>
      )}
    </Stack>
  );
}

TotalsRows.propTypes = {
  subtotal: PropTypes.number,
  discountTotal: PropTypes.number,
  total: PropTypes.number,
  cancelledTotal: PropTypes.number,
  netTotal: PropTypes.number,
};

function StoreOrderSection({ store, onEdit }) {
  const history = store.history || [];

  return (
    <Card variant="outlined" sx={{ p: 2.5 }}>
      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
        <Avatar src={store.logo} alt={store.name} variant="rounded" sx={{ width: 40, height: 40 }} />
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="subtitle1" noWrap>
            {store.name}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {store.code}
          </Typography>
        </Box>
        <Label variant="soft" color={getStatusColor(store.status)}>
          {getOrderStatusLabel(store.status)}
        </Label>
        <Label variant="soft" color={getPaymentStatus(store.paymentStatus).color}>
          {getPaymentStatus(store.paymentStatus).label}
        </Label>
        {onEdit && (
          <Button size="small" variant="outlined" color="primary" startIcon={<Iconify icon="solar:pen-bold" />} onClick={() => onEdit(store)}>
            Edit
          </Button>
        )}
      </Stack>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
        <Stack spacing={2} sx={{ flex: 1, minWidth: 0 }}>
          <Stack spacing={1.5}>
            {store.items.map((line) => (
              <Stack key={line._id} direction="row" spacing={1.5} alignItems="center">
                <Avatar src={line.image} alt={line.title} variant="rounded" sx={{ width: 44, height: 44 }} />
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography variant="subtitle2" noWrap>
                    {line.title}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {[line.variant, `Qty ${line.quantity}`, line.sku].filter(Boolean).join(' · ')}
                  </Typography>
                </Box>
                <Stack alignItems="flex-end">
                  <Typography variant="subtitle2">{fCurrency(line.total)}</Typography>
                  {line.discount > 0 && (
                    <Typography variant="caption" sx={{ color: 'text.disabled', textDecoration: 'line-through' }}>
                      {fCurrency(line.originalPrice * line.quantity)}
                    </Typography>
                  )}
                </Stack>
              </Stack>
            ))}
          </Stack>

          <Divider sx={{ borderStyle: 'dashed' }} />

          <TotalsRows subtotal={store.subtotal} discountTotal={store.discountTotal} total={store.total} cancelledTotal={store.cancelledTotal} netTotal={store.netTotal} />

          {store.status === 'cancelled' && store.cancelReason && (
            <Alert severity="error" variant="outlined">
              Cancelled: {store.cancelReason}
            </Alert>
          )}

          <Box>
            <Typography variant="caption" sx={{ color: 'text.disabled' }}>
              Internal note
            </Typography>
            <Typography variant="body2" sx={{ color: store.note ? 'text.primary' : 'text.secondary', whiteSpace: 'pre-wrap' }}>
              {store.note?.trim() || 'No note'}
            </Typography>
          </Box>
        </Stack>

        <Box sx={{ flex: 0.9, minWidth: 0 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Timeline
          </Typography>
          <Timeline sx={{ p: 0, m: 0, [`& .${timelineItemClasses.root}:before`]: { flex: 0, padding: 0 } }}>
            {history.map((entry, index) => (
              <TimelineItem key={`${entry.status}-${entry.at}`}>
                <TimelineSeparator>
                  <TimelineDot color={entry.status === 'cancelled' ? 'error' : index === history.length - 1 ? 'primary' : 'grey'} />
                  {index === history.length - 1 ? null : <TimelineConnector />}
                </TimelineSeparator>
                <TimelineContent sx={{ py: 0.75 }}>
                  <Typography variant="subtitle2">{getOrderStatusLabel(entry.status)}</Typography>
                  <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>
                    {fDateTime(entry.at)}
                    {entry.role ? ` · ${entry.by?.name ? `${entry.by.name} (${ROLE_LABELS[entry.role] || entry.role})` : ROLE_LABELS[entry.role] || entry.role}` : ''}
                  </Typography>
                  {entry.reason && (
                    <Typography variant="caption" sx={{ color: 'error.main' }}>
                      {entry.reason}
                    </Typography>
                  )}
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        </Box>
      </Stack>
    </Card>
  );
}

StoreOrderSection.propTypes = {
  store: PropTypes.object.isRequired,
  onEdit: PropTypes.func,
};

// ----------------------------------------------------------------------

/** One section per store order. Sellers only ever receive their own store in `order.stores`. */
export function OrderViewDialog({ order, open, onClose, onEditStore, sellerMode = false }) {
  if (!order) return null;

  const paymentStatus = getPaymentStatus(order.paymentStatus);
  const details = order.addressDetails;

  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={onClose}>
      <DialogTitle>Order Details</DialogTitle>

      <DialogContent>
        <Stack spacing={3} sx={{ pt: 1 }}>
          <Box sx={{ p: 2.5, borderRadius: 2, color: 'primary.contrastText', bgcolor: order.status === 'cancelled' ? 'error.main' : 'primary.main' }}>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              Order {order.code}
              {sellerMode && order.storeOrderCode ? ` · Your part ${order.storeOrderCode}` : ''}
            </Typography>
            <Typography variant="h6" sx={{ mt: 0.5 }}>
              {getOrderStatusLabel(order.status)}
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5, opacity: 0.9 }}>
              Placed {fDateTime(order.createdAt)}
              {!sellerMode && order.stores.length > 1 ? ` · ${order.stores.length} stores` : ''}
            </Typography>
          </Box>

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
            <Stack spacing={1} sx={{ flex: 1 }}>
              <Typography variant="subtitle2">Customer</Typography>
              <Typography variant="body2">{order.customer?.name || 'N/A'}</Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {order.customer?.email}
              </Typography>
            </Stack>

            <Stack spacing={1} sx={{ flex: 1 }}>
              <Typography variant="subtitle2">Delivery address</Typography>
              <Typography variant="body2">
                {details?.label ? `${details.label} · ` : ''}
                {order.address || 'N/A'}
              </Typography>
              {details?.country && (
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {details.country}
                </Typography>
              )}
            </Stack>

            <Stack spacing={1} sx={{ flex: 1 }}>
              <Typography variant="subtitle2">Payment</Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="body2">{getPaymentLabel(order.paymentMethod)}</Typography>
                <Label variant="soft" color={paymentStatus.color}>
                  {paymentStatus.label}
                </Label>
              </Stack>
            </Stack>
          </Stack>

          {order.stores.map((store) => (
            <StoreOrderSection key={store._id} store={store} onEdit={onEditStore} />
          ))}

          {!sellerMode && order.stores.length > 1 && (
            <Box sx={{ alignSelf: 'flex-end', width: { xs: 1, sm: 320 } }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Order total
              </Typography>
              <TotalsRows subtotal={order.subtotal} discountTotal={order.discountTotal} total={order.total} cancelledTotal={order.cancelledTotal} netTotal={order.netTotal} />
            </Box>
          )}
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

OrderViewDialog.propTypes = {
  order: PropTypes.object,
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onEditStore: PropTypes.func,
  sellerMode: PropTypes.bool,
};
