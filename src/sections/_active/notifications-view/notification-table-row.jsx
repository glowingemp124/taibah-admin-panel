import PropTypes from 'prop-types';

import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

import { GenericTableRowActions } from 'src/components/generic-table/table-row-actions';
import { Label } from 'src/components/label';
import { fDate, formatStr } from 'src/utils/format-time';

import { isBroadcastEditable } from './mock';
import { CHANNEL_OPTIONS, getBroadcastStatus, getRecipientLabel, labelFrom, TYPE_OPTIONS } from './notification-table-config';

export function NotificationTableRow({ row, serialNumber, onViewRow, onSendRow, onEditRow, onDeleteRow }) {
  const status = getBroadcastStatus(row.status);
  // Sending and sent broadcasts can only be viewed.
  const editable = isBroadcastEditable(row);

  const actions = [
    { key: 'view', icon: 'solar:eye-bold', tooltip: 'View', onClick: onViewRow, hidden: !onViewRow },
    { key: 'send', icon: 'solar:plain-bold', tooltip: 'Send now', color: 'success', onClick: onSendRow, hidden: !onSendRow || !editable },
    { key: 'edit', icon: 'solar:pen-bold', tooltip: 'Edit', onClick: onEditRow, hidden: !onEditRow || !editable },
    { key: 'delete', icon: 'solar:trash-bin-trash-bold', tooltip: 'Delete', color: 'primary', onClick: onDeleteRow, hidden: !onDeleteRow || !editable },
  ].filter((action) => !action.hidden);

  return (
    <TableRow hover tabIndex={-1}>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>{serialNumber}</TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.title || 'N/A'}</TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>{labelFrom(TYPE_OPTIONS, row.type)}</TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>{getRecipientLabel(row)}</TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>{labelFrom(CHANNEL_OPTIONS, row.channel)}</TableCell>

      <TableCell>
        <Label variant="soft" color={status.color}>
          {status.label}
        </Label>
      </TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.createdAt ? fDate(row.createdAt, formatStr.paramCase.date) : 'N/A'}</TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.scheduledAt ? fDate(row.scheduledAt, formatStr.paramCase.date) : '—'}</TableCell>

      <TableCell>
        <GenericTableRowActions actions={actions} />
      </TableCell>
    </TableRow>
  );
}

NotificationTableRow.propTypes = {
  row: PropTypes.object.isRequired,
  serialNumber: PropTypes.number.isRequired,
  onViewRow: PropTypes.func,
  onSendRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};
