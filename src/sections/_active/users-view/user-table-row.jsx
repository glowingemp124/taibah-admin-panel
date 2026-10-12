import PropTypes from 'prop-types';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

import { GenericTableRowActions } from 'src/components/generic-table/table-row-actions';
import { Label } from 'src/components/label';
import { fDate, formatStr } from 'src/utils/format-time';
import { getStatusColor } from 'src/utils/table-utils';

import { USER_TYPE_OPTIONS } from './user-table-config';

export function UserTableRow({ row, serialNumber, onViewRow, onEditRow }) {
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
      tooltip: 'Edit Status',
      onClick: onEditRow,
      hidden: !onEditRow,
    },
  ];

  return (
    <TableRow hover tabIndex={-1}>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>{serialNumber}</TableCell>

      <TableCell>
        <Avatar alt={row.name} src={row.avatarUrl} sx={{ width: 40, height: 40, fontSize: 18 }} />
      </TableCell>

      <TableCell>
        <Stack sx={{ typography: 'body2' }}>
          <Box component="span">{row.name || 'N/A'}</Box>
          <Box component="span" sx={{ color: 'text.disabled' }}>
            {row.email || 'N/A'}
          </Box>
        </Stack>
      </TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.phone || 'N/A'}</TableCell>

      <TableCell>
        <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
          {USER_TYPE_OPTIONS.filter((option) => (row.roles || []).includes(option.value)).map((option) => (
            <Label key={option.value} variant="soft" color={option.color}>
              {option.label}
            </Label>
          ))}
        </Stack>
      </TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        {row?.createdAt ? fDate(row.createdAt, formatStr.paramCase.date) : 'N/A'}
      </TableCell>

      <TableCell>
        <Label variant="soft" color={getStatusColor(row.status)}>
          {row.status || 'N/A'}
        </Label>
      </TableCell>

      <TableCell>
        <GenericTableRowActions actions={actions} />
      </TableCell>
    </TableRow>
  );
}

UserTableRow.propTypes = {
  row: PropTypes.object.isRequired,
  serialNumber: PropTypes.number.isRequired,
  onViewRow: PropTypes.func,
  onEditRow: PropTypes.func,
};
