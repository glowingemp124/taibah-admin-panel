import PropTypes from 'prop-types';

import Avatar from '@mui/material/Avatar';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

import { GenericTableRowActions } from 'src/components/generic-table/table-row-actions';
import { Label } from 'src/components/label';
import { fDate, formatStr } from 'src/utils/format-time';
import { getStatusColor } from 'src/utils/table-utils';

export function CategoryTableRow({ row, serialNumber, onEditRow, onDeleteRow }) {
  const title = row?.title || row?.name || 'N/A';
  const image = row?.image || row?.icon || row?.coverUrl || '';

  const actions = [
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
      color: 'error',
      onClick: onDeleteRow,
      hidden: !onDeleteRow,
    },
  ];

  return (
    <TableRow hover tabIndex={-1}>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>{serialNumber}</TableCell>

      <TableCell>
        <Avatar alt={title} src={image} variant="rounded" sx={{ width: 38, height: 38 }} />
      </TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>{title}</TableCell>

      <TableCell>
        <Label variant="soft" color={getStatusColor(row.status)}>
          {row.status || 'N/A'}
        </Label>
      </TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        {row?.createdAt ? fDate(row.createdAt, formatStr.paramCase.date) : 'N/A'}
      </TableCell>

      <TableCell>
        <GenericTableRowActions actions={actions} />
      </TableCell>
    </TableRow>
  );
}

CategoryTableRow.propTypes = {
  row: PropTypes.object.isRequired,
  serialNumber: PropTypes.number.isRequired,
  onEditRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};
