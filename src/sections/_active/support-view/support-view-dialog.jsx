import PropTypes from 'prop-types';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { Label } from 'src/components/label';
import { fDateTime } from 'src/utils/format-time';
import { getStatusColor } from 'src/utils/table-utils';

import { getPriorityLabel, getSupportStatusLabel } from './support-table-config';

export function SupportViewDialog({ ticket, open, onClose, onReply }) {
  if (!ticket) return null;

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <DialogTitle>Support Ticket</DialogTitle>

      <DialogContent>
        <Stack spacing={2.5} sx={{ pt: 1 }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Avatar alt={ticket.name} src={ticket.avatarUrl} />
            <Box>
              <Typography variant="subtitle2">{ticket.name}</Typography>
              <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>
                {ticket.email}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {ticket.phone}
              </Typography>
            </Box>
          </Stack>

          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Label variant="soft" color={getStatusColor(ticket.status)}>
              {getSupportStatusLabel(ticket.status)}
            </Label>
            <Label variant="soft">{getPriorityLabel(ticket.priority)} priority</Label>
          </Stack>

          <Box>
            <Typography variant="subtitle2">{ticket.subject}</Typography>
            <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary', whiteSpace: 'pre-wrap' }}>
              {ticket.message}
            </Typography>
          </Box>

          <Typography variant="caption" sx={{ color: 'text.disabled' }}>
            Received {ticket.createdAt ? fDateTime(ticket.createdAt) : 'N/A'}
          </Typography>

          {!!ticket.replies?.length && (
            <>
              <Divider />
              <Typography variant="subtitle2">Replies</Typography>
              <Stack spacing={1.5}>
                {ticket.replies.map((reply) => (
                  <Box key={reply._id} sx={{ p: 1.5, borderRadius: 1, bgcolor: 'background.neutral' }}>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                      {reply.message}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                      {reply.createdAt ? fDateTime(reply.createdAt) : ''}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </>
          )}
        </Stack>
      </DialogContent>

      <DialogActions>
        {ticket.status === 'open' && onReply && (
          <Button variant="outlined" color="primary" onClick={onReply}>
            Reply
          </Button>
        )}
        <Button variant="contained" color="primary" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

SupportViewDialog.propTypes = {
  ticket: PropTypes.object,
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onReply: PropTypes.func,
};
