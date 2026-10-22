import PropTypes from 'prop-types';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { GenericTableRowActions } from 'src/components/generic-table/table-row-actions';
import { Label } from 'src/components/label';
import { fCurrency, fNumber, fShortenNumber } from 'src/utils/format-number';
import { getStatusColor } from 'src/utils/table-utils';

import { getPrimaryImage } from './mock';
import { ProductReviewLabel } from './product-review-label';
import { getProductStatusLabel } from './product-table-config';
import { getDisplayPrice, getVariantCountLabel, getVariantLabel, hasMultipleVariants } from './product-utils';

export function ProductTableRow({ row, serialNumber, showCompany = true, onViewRow, onEditRow, onDeleteRow, onApproveRow, onRejectRow }) {
  const variants = row.variants || [];
  const isPending = row.reviewStatus === 'pending';

  const actions = [
    {
      key: 'view',
      icon: 'solar:eye-bold',
      tooltip: 'View',
      onClick: onViewRow,
      hidden: !onViewRow,
    },
    {
      key: 'approve',
      icon: 'solar:check-circle-bold',
      tooltip: 'Approve',
      color: 'success',
      onClick: onApproveRow,
      hidden: !onApproveRow || !isPending,
    },
    {
      key: 'reject',
      icon: 'solar:close-circle-bold',
      tooltip: 'Reject',
      color: 'error',
      onClick: onRejectRow,
      hidden: !onRejectRow || !isPending,
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
  ].filter((action) => !action.hidden);

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

      <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.category?.title || 'N/A'}</TableCell>

      {showCompany && <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.company?.name || 'N/A'}</TableCell>}

      <TableCell>
        <Stack spacing={0.25}>
          <Stack direction="row" spacing={0.75} alignItems="center" sx={{ whiteSpace: 'nowrap' }}>
            <Typography variant="subtitle2">
              {hasMultipleVariants(row) && (
                <Box component="span" sx={{ color: 'text.secondary', fontWeight: 400 }}>
                  From{' '}
                </Box>
              )}
              {fCurrency(getDisplayPrice(row))}
            </Typography>
            {row.onSale && (
              <Typography variant="body2" sx={{ color: 'text.disabled', textDecoration: 'line-through' }}>
                {fCurrency(row.price)}
              </Typography>
            )}
          </Stack>
          {row.onSale && (
            <Box>
              <Label variant="soft" color="warning">
                {row.offPercent}% Off
              </Label>
            </Box>
          )}
        </Stack>
      </TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        {row.stock > 0 ? (
          fNumber(row.stock)
        ) : (
          <Label variant="soft" color="error">
            Out of stock
          </Label>
        )}
      </TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        <Tooltip
          arrow
          title={
            <Stack spacing={0.25}>
              {variants.map((variant) => (
                <span key={variant._id}>
                  {getVariantLabel(variant)} · {fNumber(variant.stock)} in stock
                </span>
              ))}
            </Stack>
          }
        >
          <Typography variant="body2" sx={{ cursor: 'help', textDecoration: 'underline dotted' }}>
            {getVariantCountLabel(row)}
          </Typography>
        </Tooltip>
      </TableCell>

      <TableCell>
        <Stack spacing={0.25}>
          <Rating size="small" value={Math.round(row.rating || 0)} readOnly />
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {Math.round(row.rating || 0)}/5 ({fShortenNumber(row.totalReviews || 0)} reviews)
          </Typography>
        </Stack>
      </TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>{fNumber(row.favoriteCount ?? 0)}</TableCell>

      <TableCell>
        <Label variant="soft" color={getStatusColor(row.status)}>
          {getProductStatusLabel(row.status)}
        </Label>
      </TableCell>

      <TableCell>
        <ProductReviewLabel reviewStatus={row.reviewStatus} reviewReason={row.reviewReason} />
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
  showCompany: PropTypes.bool,
  onViewRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onApproveRow: PropTypes.func,
  onRejectRow: PropTypes.func,
};
