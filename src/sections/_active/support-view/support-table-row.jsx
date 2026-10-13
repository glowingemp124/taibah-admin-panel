import PropTypes from 'prop-types';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

import { ExpandableText } from 'src/components/expandable-text';
import { GenericTableRowActions } from 'src/components/generic-table/table-row-actions';
import { Label } from 'src/components/label';
import { fDate, formatStr } from 'src/utils/format-time';
import { getStatusColor } from 'src/utils/table-utils';

import { getPriorityLabel, getSupportStatusLabel } from './support-table-config';

export function SupportTableRow({ row, serialNumber, onViewRow, onReplyRow }) {
  const actions = [
    {
      key: 'view',
      icon: 'solar:eye-bold',
      tooltip: 'View',
      onClick: onViewRow,
      hidden: !onViewRow,
    },
    {
      key: 'reply',
      icon: 'solar:chat-round-dots-bold',
      tooltip: 'Reply',
      onClick: onReplyRow,
      hidden: !onReplyRow || row.status !== 'open',
    },
  ];

  return (
    <TableRow hover tabIndex={-1}>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>{serialNumber}</TableCell>

      <TableCell>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Avatar alt={row.name} src={row.avatarUrl} />
          <Stack sx={{ typography: 'body2' }}>
            <Box component="span">{row.name || 'N/A'}</Box>
            <Box component="span" sx={{ color: 'text.disabled' }}>
              {row.email || 'N/A'}
            </Box>
          </Stack>
        </Stack>
      </TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.phone || 'N/A'}</TableCell>

      <TableCell sx={{ maxWidth: 240, minWidth: 180 }}>
        <ExpandableText content={row.subject} maxLength={70} title="Subject" />
      </TableCell>

      <TableCell sx={{ maxWidth: 240, minWidth: 180 }}>
        <ExpandableText content={row.message} maxLength={50} title="Message" />
      </TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>{getPriorityLabel(row.priority)}</TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        {row.createdAt ? fDate(row.createdAt, formatStr.paramCase.date) : 'N/A'}
      </TableCell>

      <TableCell>
        <Label variant="soft" color={getStatusColor(row.status)}>
          {getSupportStatusLabel(row.status)}
        </Label>
      </TableCell>

      <TableCell>
        <GenericTableRowActions actions={actions} />
      </TableCell>
    </TableRow>
  );
}

SupportTableRow.propTypes = {
  row: PropTypes.object.isRequired,
  serialNumber: PropTypes.number.isRequired,
  onViewRow: PropTypes.func,
  onReplyRow: PropTypes.func,
};
