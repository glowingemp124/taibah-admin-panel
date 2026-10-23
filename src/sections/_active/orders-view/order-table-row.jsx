import PropTypes from 'prop-types';

import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import { GenericTableRowActions } from 'src/components/generic-table/table-row-actions';
import { Label } from 'src/components/label';
import { fCurrency } from 'src/utils/format-number';
import { fDate, formatStr } from 'src/utils/format-time';
import { getStatusColor } from 'src/utils/table-utils';

import { getOrderItems } from './mock';
import { getOrderStatusLabel, getPaymentLabel, getPaymentStatus } from './order-table-config';

export function OrderTableRow({ row, serialNumber, onViewRow, onEditRow, hideVendor = false }) {
  const items = getOrderItems(row);
  const quantity = items.reduce((sum, line) => sum + (line.quantity || 0), 0);
  const paymentStatus = getPaymentStatus(row.paymentStatus);

  const actions = [
    {
      key: 'view',
      icon: 'solar:eye-bold',
      tooltip: 'View',
      onClick: onViewRow,
      hidden: !onViewRow,
    },
    {
      key: 'edit',
      icon: 'solar:pen-bold',
      tooltip: 'Update status',
      onClick: onEditRow,
      hidden: !onEditRow,
    },
  ].filter((action) => !action.hidden);

  return (
    <TableRow hover tabIndex={-1}>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>{serialNumber}</TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        <Typography variant="subtitle2">{row.code}</Typography>
        {row.storeOrderCode && (
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Your part {row.storeOrderCode}
          </Typography>
        )}
      </TableCell>

      <TableCell>
        <Stack direction="row" spacing={1.25} alignItems="center">
          <AvatarGroup max={3} sx={{ '& .MuiAvatar-root': { width: 32, height: 32 } }}>
            {items.map((line) => (
              <Avatar key={line._id} alt={line.title} src={line.image} variant="rounded" />
            ))}
          </AvatarGroup>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="body2" noWrap sx={{ maxWidth: 140 }}>
              {items[0]?.title || 'N/A'}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {quantity} {quantity === 1 ? 'item' : 'items'}
            </Typography>
          </Box>
        </Stack>
      </TableCell>

      <TableCell>
        <Stack sx={{ typography: 'body2' }}>
          <Box component="span">{row.customer?.name || 'N/A'}</Box>
          <Box component="span" sx={{ color: 'text.disabled' }}>
            {row.customer?.email || 'N/A'}
          </Box>
        </Stack>
      </TableCell>

      {!hideVendor && (
        <TableCell>
          <Stack spacing={0.75}>
            {row.stores.map((store) => (
              <Stack key={store._id} direction="row" spacing={1} alignItems="center">
                <Avatar src={store.logo} alt={store.name} variant="rounded" sx={{ width: 24, height: 24 }} />
                <Typography variant="body2" noWrap sx={{ maxWidth: 120 }}>
                  {store.name}
                </Typography>
                <Label variant="soft" color={getStatusColor(store.status)}>
                  {getOrderStatusLabel(store.status)}
                </Label>
              </Stack>
            ))}
          </Stack>
        </TableCell>
      )}

      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        <Stack spacing={0.5} alignItems="flex-start">
          <Typography variant="body2">{getPaymentLabel(row.paymentMethod)}</Typography>
          <Label variant="soft" color={paymentStatus.color}>
            {paymentStatus.label}
          </Label>
        </Stack>
      </TableCell>

      <TableCell>
        <Label variant="soft" color={getStatusColor(row.status)}>
          {getOrderStatusLabel(row.status)}
        </Label>
      </TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.createdAt ? fDate(row.createdAt, formatStr.paramCase.date) : 'N/A'}</TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        <Typography variant="body2">{fCurrency(row.total)}</Typography>
        {row.cancelledTotal > 0 && (
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Net {fCurrency(row.netTotal)}
          </Typography>
        )}
      </TableCell>

      <TableCell>
        <GenericTableRowActions actions={actions} />
      </TableCell>
    </TableRow>
  );
}

OrderTableRow.propTypes = {
  row: PropTypes.object.isRequired,
  serialNumber: PropTypes.number.isRequired,
  onViewRow: PropTypes.func,
  onEditRow: PropTypes.func,
  hideVendor: PropTypes.bool,
};
