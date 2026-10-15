import PropTypes from 'prop-types';

import Timeline from '@mui/lab/Timeline';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
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
import { fCurrency } from 'src/utils/format-number';
import { fDate, fDateTime, formatStr } from 'src/utils/format-time';
import { getStatusColor } from 'src/utils/table-utils';

import { ProductStoreCard } from 'src/sections/_active/products-view/product-store-card';

import { getOrderTotal, getOrderVendors } from './mock';
import { getOrderStatusLabel, getPaymentLabel } from './order-table-config';

function formatStepTime(step) {
  if (step.at) return fDateTime(step.at);
  if (step.expected) return `Expected ${fDate(step.expected, formatStr.paramCase.date)}`;
  return 'Pending';
}

export function OrderViewDialog({ order, open, onClose }) {
  if (!order) return null;

  const total = getOrderTotal(order);
  const vendors = getOrderVendors(order);

  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={onClose}>
      <DialogTitle>Order Details</DialogTitle>

      <DialogContent>
        <Stack spacing={3} sx={{ pt: 1 }}>
          <Box
            sx={{
              p: 2.5,
              borderRadius: 2,
              color: 'primary.contrastText',
              bgcolor: 'primary.main',
            }}
          >
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              Order ID #{order.orderId}
            </Typography>
            <Typography variant="h6" sx={{ mt: 0.5 }}>
              {order.status === 'on-the-way' ? 'Your Order Is On The Way' : getOrderStatusLabel(order.status)}
            </Typography>
            {order.estimatedDelivery && (
              <Typography variant="body2" sx={{ mt: 0.5, opacity: 0.9 }}>
                Estimated Delivery: {order.estimatedDelivery}
              </Typography>
            )}
          </Box>

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
            <Box sx={{ flex: 1.1 }}>
              <Typography variant="subtitle1" sx={{ mb: 1.5 }}>
                Tracking
              </Typography>
              <Timeline sx={{ p: 0, m: 0, [`& .${timelineItemClasses.root}:before`]: { flex: 0, padding: 0 } }}>
                {(order.timeline || []).map((step, index) => {
                  const last = index === (order.timeline || []).length - 1;
                  const isCurrent = step.status === order.status;

                  return (
                    <TimelineItem key={step.status}>
                      <TimelineSeparator>
                        <TimelineDot color={step.completed || isCurrent ? 'primary' : 'grey'} />
                        {last ? null : <TimelineConnector />}
                      </TimelineSeparator>
                      <TimelineContent sx={{ py: 0.75 }}>
                        <Typography variant="subtitle2">{step.label}</Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          {formatStepTime(step)}
                        </Typography>
                      </TimelineContent>
                    </TimelineItem>
                  );
                })}
              </Timeline>
            </Box>

            <Stack spacing={2.5} sx={{ flex: 1, minWidth: 0 }}>
              <Box>
                <Typography variant="subtitle1" sx={{ mb: 1.5 }}>
                  Products
                </Typography>
                <Stack spacing={1.5}>
                  {(order.items || []).map((item) => (
                    <Stack key={item.productId} direction="row" spacing={1.5} alignItems="center">
                      <Avatar src={item.image} alt={item.title} variant="rounded" sx={{ width: 48, height: 48 }} />
                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography variant="subtitle2" noWrap>
                          {item.title}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          Qty {item.quantity}
                          {item.color ? ` · ${item.color}` : ''}
                        </Typography>
                      </Box>
                      <Typography variant="subtitle2">{fCurrency(item.total)}</Typography>
                    </Stack>
                  ))}
                </Stack>
              </Box>

              <Divider />

              <Box>
                <Typography variant="subtitle1" sx={{ mb: 1.5 }}>
                  Customer
                </Typography>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Avatar src={order.customer?.avatarUrl} alt={order.customer?.name} />
                  <Box>
                    <Typography variant="subtitle2">{order.customer?.name || 'N/A'}</Typography>
                    <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>
                      {order.customer?.email}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {order.customer?.phone}
                    </Typography>
                  </Box>
                </Stack>
              </Box>

              <Stack spacing={1}>
                <Typography variant="subtitle2">Delivery Address</Typography>
                <Typography variant="body2">
                  {order.address?.type ? `${order.address.type} · ` : ''}
                  {order.address?.line || 'N/A'}
                  {order.address?.city ? `, ${order.address.city}` : ''}
                </Typography>
              </Stack>

              <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                <Typography variant="subtitle2">Payment</Typography>
                <Label variant="soft" color="default">
                  {getPaymentLabel(order.paymentMethod)}
                </Label>
              </Stack>

              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="subtitle2">Status</Typography>
                <Label variant="soft" color={getStatusColor(order.status)}>
                  {getOrderStatusLabel(order.status)}
                </Label>
              </Stack>

              <Stack spacing={0.5}>
                <Typography variant="subtitle2">Note</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', whiteSpace: 'pre-wrap' }}>
                  {order.note?.trim() || 'No note'}
                </Typography>
              </Stack>

              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Created {order.createdAt ? fDateTime(order.createdAt) : 'N/A'}
                </Typography>
                <Typography variant="h6">{fCurrency(total)}</Typography>
              </Stack>
            </Stack>
          </Stack>

          <Box>
            <Typography variant="subtitle1" sx={{ mb: 1.5 }}>
              Vendor
            </Typography>
            <Stack spacing={1.5}>
              {vendors.length ? (
                vendors.map((vendor) => <ProductStoreCard key={vendor._id} company={vendor} />)
              ) : (
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  No vendor details
                </Typography>
              )}
            </Stack>
          </Box>
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
};
