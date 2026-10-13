import PropTypes from 'prop-types';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import { GenericTableRowActions } from 'src/components/generic-table/table-row-actions';
import { Label } from 'src/components/label';
import { fDate, formatStr } from 'src/utils/format-time';
import { getStatusColor } from 'src/utils/table-utils';

import { getEventPlacementLabel, getEventStatusLabel, getEventTypeLabel } from './event-table-config';

export function EventTableRow({ row, serialNumber, onViewRow, onEditRow, onDeleteRow }) {
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
      onClick: onDeleteRow,
      hidden: !onDeleteRow,
    },
  ];

  return (
    <TableRow hover tabIndex={-1}>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>{serialNumber}</TableCell>

      <TableCell>
        <Avatar alt={row.title} src={row.coverUrl} variant="rounded" sx={{ width: 40, height: 40 }} />
      </TableCell>

      <TableCell>
        <Stack sx={{ typography: 'body2' }}>
          <Box component="span">{row.title || 'N/A'}</Box>
          <Typography variant="caption" sx={{ color: 'text.disabled' }} noWrap>
            {row.subtitle || '—'}
          </Typography>
        </Stack>
      </TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>{getEventTypeLabel(row.type)}</TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>{getEventPlacementLabel(row.placement)}</TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        {row.startAt ? fDate(row.startAt, formatStr.paramCase.date) : 'N/A'}
        {' – '}
        {row.endAt ? fDate(row.endAt, formatStr.paramCase.date) : 'N/A'}
      </TableCell>

      <TableCell>
        <Label variant="soft" color={getStatusColor(row.runtimeStatus)}>
          {getEventStatusLabel(row.runtimeStatus)}
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

EventTableRow.propTypes = {
  row: PropTypes.object.isRequired,
  serialNumber: PropTypes.number.isRequired,
  onViewRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};
