import PropTypes from 'prop-types';

import Avatar from '@mui/material/Avatar';
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

import { getPaymentLabel, getTransactionStatusLabel } from './transaction-table-config';

export function TransactionTableRow({ row, serialNumber, onViewRow }) {
  const actions = [
    {
      key: 'view',
      icon: 'solar:eye-bold',
      tooltip: 'View',
      onClick: onViewRow,
      hidden: !onViewRow,
    },
  ];

  return (
    <TableRow hover tabIndex={-1}>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>{serialNumber}</TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        <Typography variant="subtitle2">#{row.transactionId}</Typography>
      </TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        <Typography variant="body2">#{row.orderId || '—'}</Typography>
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
        {row.vendor ? (
          <Stack direction="row" spacing={1.25} alignItems="center">
            <Avatar src={row.vendor.logo} alt={row.vendor.name} variant="rounded" sx={{ width: 32, height: 32 }} />
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="body2" noWrap sx={{ maxWidth: 140 }}>
                {row.vendor.name}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }} noWrap>
                {row.vendor.seller?.name || 'N/A'}
              </Typography>
            </Box>
          </Stack>
        ) : (
          'N/A'
        )}
      </TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>{getPaymentLabel(row.paymentMethod)}</TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>{fCurrency(row.amount)}</TableCell>

      <TableCell>
        <Label variant="soft" color={getStatusColor(row.status)}>
          {getTransactionStatusLabel(row.status)}
        </Label>
      </TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        {row.createdAt ? fDate(row.createdAt, formatStr.paramCase.date) : 'N/A'}
      </TableCell>

      <TableCell>
        <GenericTableRowActions actions={actions} />
      </TableCell>
    </TableRow>
  );
}

TransactionTableRow.propTypes = {
  row: PropTypes.object.isRequired,
  serialNumber: PropTypes.number.isRequired,
  onViewRow: PropTypes.func,
};
