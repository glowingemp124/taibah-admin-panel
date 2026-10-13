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
import { fCurrency } from 'src/utils/format-number';
import { fDateTime } from 'src/utils/format-time';
import { getStatusColor } from 'src/utils/table-utils';

import { getEventPlacementLabel, getEventStatusLabel, getEventTypeLabel } from './event-table-config';

export function EventViewDialog({ event, open, onClose }) {
  if (!event) return null;

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

          {event.type === 'product-collection' && (
            <>
              <Divider />
              <Typography variant="subtitle1">Products</Typography>
              <Stack spacing={1.5}>
                {(event.products || []).length ? (
                  event.products.map((product) => (
                    <Stack key={product._id} direction="row" spacing={1.5} alignItems="center">
                      <Avatar src={product.image} alt={product.title} variant="rounded" />
                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography variant="subtitle2" noWrap>
                          {product.title}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          {product.salePrice ? `${fCurrency(product.salePrice)} · ${fCurrency(product.price)}` : fCurrency(product.price)}
                        </Typography>
                      </Box>
                    </Stack>
                  ))
                ) : (
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    No products linked
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
