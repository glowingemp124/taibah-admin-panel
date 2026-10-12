import PropTypes from 'prop-types';

import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

// import { ExpandableText } from 'src/components/expandable-text';
import { GenericTableRowActions } from 'src/components/generic-table/table-row-actions';
import { Label } from 'src/components/label';
import { fDate, formatStr } from 'src/utils/format-time';
import { getStatusColor } from 'src/utils/table-utils';

import { CHANNEL_OPTIONS, RECIPIENT_OPTIONS, TYPE_OPTIONS, USER_GROUP_OPTIONS } from './notification-table-config';

const labelFrom = (options, value) => options.find((option) => option.value === value)?.label || value || 'N/A';

export function NotificationTableRow({ row, serialNumber, onResendRow, onEditRow, onDeleteRow }) {
  const recipientLabel =
    row.recipient === 'group'
      ? labelFrom(USER_GROUP_OPTIONS, row.userGroup)
      : row.recipient === 'user'
        ? row.userQuery || 'Specific User'
        : labelFrom(RECIPIENT_OPTIONS, row.recipient);

  const actions = [
    {
      key: 'resend',
      icon: 'solar:restart-bold',
      tooltip: 'Resend',
      onClick: onResendRow,
      hidden: !onResendRow,
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

      <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.title || 'N/A'}</TableCell>

      {/* <TableCell sx={{ maxWidth: 280 }}>
        <ExpandableText content={row.message} maxLength={80} title={row.title || 'Message'} />
      </TableCell> */}

      <TableCell sx={{ whiteSpace: 'nowrap' }}>{labelFrom(TYPE_OPTIONS, row.type)}</TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>{recipientLabel}</TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>{labelFrom(CHANNEL_OPTIONS, row.channel)}</TableCell>

      <TableCell>
        <Label variant="soft" color={getStatusColor(row.status)}>
          {row.status || 'N/A'}
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
  onResendRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};
