import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { EmptyContent } from 'src/components/empty-content';
import { Iconify } from 'src/components/iconify';
import { Image } from 'src/components/image';
import { Label } from 'src/components/label';
import { useAppRole } from 'src/hooks/use-app-role';
import { fDate, formatStr } from 'src/utils/format-time';
import { getStatusColor } from 'src/utils/table-utils';

import { SellerApprovalBanner } from 'src/sections/_active/products-view/seller-approval-banner';

import { getEventPlacementLabel, getEventStatusLabel } from './event-table-config';
import { useGetMockSellerEvents } from './mock';
import { SellerEventProductsDialog } from './seller-event-products-dialog';

// ----------------------------------------------------------------------

function useNow(intervalMs = 60000) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(timer);
  }, [intervalMs]);

  return now;
}

function formatCountdown(target, now) {
  const minutes = Math.max(0, Math.floor((new Date(target) - now) / 60000));
  const days = Math.floor(minutes / 1440);
  const hours = Math.floor((minutes % 1440) / 60);
  if (days > 0) return `${days}d ${hours}h`;
  return `${hours}h ${minutes % 60}m`;
}

function SellerEventCard({ event, sellerId, now, canChoose, onChoose }) {
  const isActive = event.runtimeStatus === 'active';
  const isCollection = event.type === 'product-collection';
  const joined = (event.products || []).filter((item) => item.sellerId === sellerId).length;

  return (
    <Card sx={{ display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ position: 'relative' }}>
        <Image alt={event.title} src={event.coverUrl} ratio="16/9" />
        <Stack direction="row" spacing={1} sx={{ position: 'absolute', top: 12, left: 12 }}>
          <Label variant="filled" color={getStatusColor(event.runtimeStatus)}>
            {getEventStatusLabel(event.runtimeStatus)}
          </Label>
          <Label variant="filled" color="default">
            {isActive ? 'Ends in' : 'Starts in'} {formatCountdown(isActive ? event.endAt : event.startAt, now)}
          </Label>
        </Stack>
      </Box>

      <Stack spacing={1.5} sx={{ p: 2.5, flexGrow: 1 }}>
        <Box>
          <Typography variant="h6">{event.title}</Typography>
          {event.subtitle && (
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {event.subtitle}
            </Typography>
          )}
        </Box>

        <Stack spacing={0.75} sx={{ typography: 'body2', color: 'text.secondary' }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Iconify icon="solar:calendar-date-bold" width={18} />
            <span>
              {fDate(event.startAt, formatStr.paramCase.date)} – {fDate(event.endAt, formatStr.paramCase.date)}
            </span>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <Iconify icon="solar:map-point-bold" width={18} />
            <span>{getEventPlacementLabel(event.placement)}</span>
          </Stack>
        </Stack>

        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {event.discountPercent ? (
            <Label variant="soft" color="warning">
              {event.discountPercent}% event discount
            </Label>
          ) : (
            <Label variant="soft">No event discount</Label>
          )}
          {isCollection && (
            <Label variant="soft" color={joined ? 'success' : 'default'}>
              {joined} of your products joined
            </Label>
          )}
        </Stack>

        <Box sx={{ flexGrow: 1 }} />

        {isCollection ? (
          <Button variant="contained" color="primary" startIcon={<Iconify icon="solar:box-bold" />} disabled={!canChoose} onClick={onChoose}>
            Choose products
          </Button>
        ) : (
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Banner event, so there are no products to choose.
          </Typography>
        )}
      </Stack>
    </Card>
  );
}

SellerEventCard.propTypes = {
  event: PropTypes.object.isRequired,
  sellerId: PropTypes.string,
  now: PropTypes.instanceOf(Date),
  canChoose: PropTypes.bool,
  onChoose: PropTypes.func,
};

// ----------------------------------------------------------------------

export function SellerEventListView() {
  const { sellerId, sellerStatus } = useAppRole();
  const { events, refetch } = useGetMockSellerEvents(sellerId);
  const [chooseEvent, setChooseEvent] = useState(null);
  const now = useNow();
  const canChoose = sellerStatus === 'approved';

  return (
    <Box sx={{ px: { xs: 2, md: 5 }, pb: 5, pt: 3 }}>
      <CustomBreadcrumbs heading="Events" links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'Events' }]} sx={{ mb: { xs: 3, md: 5 } }} />

      <SellerApprovalBanner sellerStatus={sellerStatus} sx={{ mb: 3 }} />

      {events.length ? (
        <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' } }}>
          {events.map((event) => (
            <SellerEventCard key={event._id} event={event} sellerId={sellerId} now={now} canChoose={canChoose} onChoose={() => setChooseEvent(event)} />
          ))}
        </Box>
      ) : (
        <EmptyContent filled title="No events open to your store right now." sx={{ py: 10 }} />
      )}

      <SellerEventProductsDialog event={chooseEvent} sellerId={sellerId} open={!!chooseEvent} onClose={() => setChooseEvent(null)} onSaved={refetch} />
    </Box>
  );
}
