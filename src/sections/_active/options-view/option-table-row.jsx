import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

import { GenericTableRowActions } from 'src/components/generic-table/table-row-actions';
import { Label } from 'src/components/label';

import { getOptionType } from './option-table-config';
import { OptionValueChip } from './option-value-chip';

export function OptionTableRow({ row, serialNumber, onEditRow, onDeleteRow }) {
  const type = getOptionType(row.type);

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

      <TableCell sx={{ whiteSpace: 'nowrap', fontWeight: 600 }}>{row.name}</TableCell>

      <TableCell>
        <Label variant="soft" color={type.color}>
          {type.label}
        </Label>
      </TableCell>

      <TableCell>
        <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
          {row.values.map((item) => (
            <OptionValueChip key={item._id} type={row.type} value={item.value} label={item.label} />
          ))}
        </Stack>
      </TableCell>

      <TableCell>
        <GenericTableRowActions actions={actions} />
      </TableCell>
    </TableRow>
  );
}

OptionTableRow.propTypes = {
  row: PropTypes.object.isRequired,
  serialNumber: PropTypes.number.isRequired,
  onEditRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};
