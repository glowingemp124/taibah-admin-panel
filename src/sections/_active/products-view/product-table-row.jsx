import PropTypes from 'prop-types';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import { GenericTableRowActions } from 'src/components/generic-table/table-row-actions';
import { Label } from 'src/components/label';
import { fCurrency, fShortenNumber } from 'src/utils/format-number';
import { getStatusColor } from 'src/utils/table-utils';

import { getPrimaryImage } from './mock';
import { getAvailabilityLabel } from './product-table-config';

export function ProductTableRow({ row, serialNumber, onViewRow, onEditRow, onDeleteRow }) {
  const salePrice = row.salePrice || row.price;
  const hasDiscount = row.salePrice && row.salePrice < row.price;

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
    {
      key: 'delete',
      icon: 'solar:trash-bin-trash-bold',
      tooltip: 'Delete',
      color: 'primary',
      onClick: onDeleteRow,
      hidden: !onDeleteRow,
    },
  ];

  return (
    <TableRow hover tabIndex={-1}>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>{serialNumber}</TableCell>

      <TableCell>
        <Avatar alt={row.title} src={getPrimaryImage(row)} sx={{ width: 40, height: 40, fontSize: 18 }} />
      </TableCell>

      <TableCell>
        <Typography variant="body2" noWrap sx={{ maxWidth: 220 }}>
          {row.title || 'N/A'}
        </Typography>
      </TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.category || 'N/A'}</TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.company?.name || 'N/A'}</TableCell>

      <TableCell>
        <Stack spacing={0.25}>
          <Stack direction="row" spacing={0.75} alignItems="center">
            <Typography variant="subtitle2">{fCurrency(salePrice)}</Typography>
            {hasDiscount && (
              <Typography variant="body2" sx={{ color: 'text.disabled', textDecoration: 'line-through' }}>
                {fCurrency(row.price)}
              </Typography>
            )}
          </Stack>
          {!!row.offPercent && (
            <Box>
              <Label variant="soft" color="warning">
                {row.offPercent}% Off
              </Label>
            </Box>
          )}
        </Stack>
      </TableCell>

      <TableCell>
        <Stack spacing={0.25}>
          <Rating size="small" value={row.rating || 0} precision={0.1} readOnly />
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {row.rating || 0} ({fShortenNumber(row.totalReviews || 0)} reviews)
          </Typography>
        </Stack>
      </TableCell>

      <TableCell>
        <Label variant="soft" color={getStatusColor(row.availability)}>
          {getAvailabilityLabel(row.availability)}
        </Label>
      </TableCell>

      <TableCell>
        <GenericTableRowActions actions={actions} />
      </TableCell>
    </TableRow>
  );
}

ProductTableRow.propTypes = {
  row: PropTypes.object.isRequired,
  serialNumber: PropTypes.number.isRequired,
  onViewRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};
