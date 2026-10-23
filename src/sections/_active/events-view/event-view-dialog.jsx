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

import { ExpandableText } from 'src/components/expandable-text';
import { Label } from 'src/components/label';
import { fNumber } from 'src/utils/format-number';
import { fDateTime } from 'src/utils/format-time';
import { getStatusColor } from 'src/utils/table-utils';

import { EventDiscountLabel, EventPriceText } from './event-shared';
import { getEventPlacementLabel, getEventStatusLabel, getEventTypeLabel } from './event-table-config';
import { getCtaSummary } from './mock';

const TOP_PRODUCTS = 5;

export function EventViewDialog({ event, open, onClose }) {
  if (!event) return null;

  const products = event.products || [];
  const perStore = Object.entries(
    products.reduce((acc, item) => {
      acc[item.storeName] = (acc[item.storeName] || 0) + 1;
      return acc;
    }, {})
  ).sort((a, b) => b[1] - a[1]);
  const topProducts = [...products].sort((a, b) => b.soldCount - a.soldCount).slice(0, TOP_PRODUCTS);

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <DialogTitle>Event Details</DialogTitle>

      <DialogContent>
        <Stack spacing={2.5} sx={{ pt: 1 }}>
          <Box
            component="img"
            src={event.coverUrl}
            alt={event.title}
            sx={{ width: 1, height: 180, objectFit: 'cover', borderRadius: 2 }}
          />

          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
            <Typography variant="h6">{event.title}</Typography>
            <Label variant="soft" color={getStatusColor(event.runtimeStatus)}>
              {getEventStatusLabel(event.runtimeStatus)}
            </Label>
          </Stack>

          {event.subtitle ? <ExpandableText content={event.subtitle} maxLength={80} title="Subtitle" /> : null}

          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Label variant="soft">{getEventTypeLabel(event.type)}</Label>
            <Label variant="soft" color="info">
              {getEventPlacementLabel(event.placement)}
            </Label>
          </Stack>

          {event.ctaLabel && (
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              CTA: {event.ctaLabel}
            </Typography>
          )}

          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {event.startAt ? fDateTime(event.startAt) : 'N/A'} – {event.endAt ? fDateTime(event.endAt) : 'N/A'}
          </Typography>

          {event.type === 'banner' && (
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Opens: {getCtaSummary(event.cta) || 'Nothing (no link)'}
            </Typography>
          )}

          <Stack spacing={1}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="subtitle2" sx={{ minWidth: 72 }}>
                Stores
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {event.storeScope === 'selected' ? (event.stores || []).map((store) => store.name).join(', ') || 'None' : 'All stores'}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="subtitle2" sx={{ minWidth: 72 }}>
                Discount
              </Typography>
              <EventDiscountLabel percent={event.discountPercent} suffix="event discount" />
            </Stack>
          </Stack>

          {event.type === 'product-collection' && (
            <>
              <Divider />
              <Typography variant="subtitle1">Products ({fNumber(products.length)})</Typography>

              {perStore.length > 0 && (
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {perStore.map(([storeName, count]) => (
                    <Label key={storeName} variant="soft">
                      {storeName} · {count}
                    </Label>
                  ))}
                </Stack>
              )}

              <Stack spacing={1.5}>
                {topProducts.length ? (
                  topProducts.map((product) => (
                    <Stack key={product._id} direction="row" spacing={1.5} alignItems="center" sx={{ ...(!product.available && { opacity: 0.48 }) }}>
                      <Avatar src={product.image} alt={product.title} variant="rounded" />
                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography variant="subtitle2" noWrap>
                          {product.title}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          {product.available ? product.storeName : `${product.storeName} · Hidden from customers`}
                        </Typography>
                      </Box>
                      <EventPriceText regularPrice={product.regularPrice} pricing={product.pricing} />
                    </Stack>
                  ))
                ) : (
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    No products yet. Sellers can opt in once the event is published.
                  </Typography>
                )}
                {products.length > TOP_PRODUCTS && (
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Showing top {TOP_PRODUCTS} by sales. Use Manage products to see all.
                  </Typography>
                )}
              </Stack>
            </>
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

EventViewDialog.propTypes = {
  event: PropTypes.object,
  open: PropTypes.bool,
  onClose: PropTypes.func,
};
