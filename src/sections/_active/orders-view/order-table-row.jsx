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

import { getOrderTotal, getOrderVendors } from './mock';
import { getOrderStatusLabel, getPaymentLabel } from './order-table-config';

export function OrderTableRow({ row, serialNumber, onViewRow, onEditRow }) {
  const items = row.items || [];
  const firstTitle = items[0]?.title || 'N/A';
  const extraCount = Math.max(items.length - 1, 0);
  const vendors = getOrderVendors(row);
  const primaryVendor = vendors[0];

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
      tooltip: 'Edit',
      onClick: onEditRow,
      hidden: !onEditRow,
    },
  ];

  return (
    <TableRow hover tabIndex={-1}>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>{serialNumber}</TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        <Typography variant="subtitle2">#{row.orderId}</Typography>
      </TableCell>

      <TableCell>
        <Stack direction="row" spacing={1.25} alignItems="center">
          <AvatarGroup max={3} sx={{ '& .MuiAvatar-root': { width: 32, height: 32 } }}>
            {items.map((item) => (
              <Avatar key={item.productId} alt={item.title} src={item.image} variant="rounded" />
            ))}
          </AvatarGroup>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="body2" noWrap sx={{ maxWidth: 140 }}>
              {firstTitle}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {items.length} {items.length === 1 ? 'item' : 'items'}
              {extraCount > 0 ? ` +${extraCount}` : ''}
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

      <TableCell>
        {primaryVendor ? (
          <Stack direction="row" spacing={1.25} alignItems="center">
            <Avatar src={primaryVendor.logo} alt={primaryVendor.name} variant="rounded" sx={{ width: 32, height: 32 }} />
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="body2" noWrap sx={{ maxWidth: 160 }}>
                {primaryVendor.name}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }} noWrap>
                {primaryVendor.seller?.name || 'N/A'}
                {vendors.length > 1 ? ` +${vendors.length - 1}` : ''}
              </Typography>
            </Box>
          </Stack>
        ) : (
          'N/A'
        )}
      </TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>{getPaymentLabel(row.paymentMethod)}</TableCell>

      <TableCell>
        <Label variant="soft" color={getStatusColor(row.status)}>
          {getOrderStatusLabel(row.status)}
        </Label>
      </TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        {row.createdAt ? fDate(row.createdAt, formatStr.paramCase.date) : 'N/A'}
      </TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>{fCurrency(getOrderTotal(row))}</TableCell>

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
};
