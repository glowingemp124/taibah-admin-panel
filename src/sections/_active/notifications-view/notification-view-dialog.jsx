import PropTypes from 'prop-types';

import Alert from '@mui/material/Alert';
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
import { fNumber } from 'src/utils/format-number';
import { fDateTime } from 'src/utils/format-time';

import { CHANNEL_OPTIONS, getBroadcastStatus, getRecipientLabel, labelFrom, TYPE_OPTIONS } from './notification-table-config';

// ----------------------------------------------------------------------

const STAT_ITEMS = [
  { key: 'recipients', label: 'Recipients' },
  { key: 'inApp', label: 'In-app' },
  { key: 'pushSent', label: 'Push sent' },
  { key: 'emailsSent', label: 'Emails sent' },
  { key: 'emailsFailed', label: 'Emails failed', color: 'error.main' },
];

export function NotificationViewDialog({ notification, open, onClose, onSend }) {
  if (!notification) return null;

  const status = getBroadcastStatus(notification.status);
  const stats = notification.stats || {};
  const showStats = ['sending', 'sent', 'failed'].includes(notification.status);

  const meta = [
    { label: 'Type', value: labelFrom(TYPE_OPTIONS, notification.type) },
    { label: 'Recipient', value: getRecipientLabel(notification) },
    { label: 'Channel', value: labelFrom(CHANNEL_OPTIONS, notification.channel) },
    { label: 'Created', value: fDateTime(notification.createdAt) },
    { label: notification.status === 'scheduled' ? 'Scheduled for' : 'Sent', value: notification.scheduledAt ? fDateTime(notification.scheduledAt) : notification.sentAt ? fDateTime(notification.sentAt) : '—' },
  ];

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <DialogTitle>
        <Stack direction="row" spacing={1} alignItems="center">
          <span>{notification.title}</span>
          <Label variant="soft" color={status.color}>
            {status.label}
          </Label>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2.5} sx={{ pt: 0.5 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary', whiteSpace: 'pre-wrap' }}>
            {notification.message}
          </Typography>

          <Box sx={{ display: 'grid', gap: 1.5, gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' } }}>
            {meta.map((item) => (
              <Stack key={item.label} spacing={0.25}>
                <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                  {item.label}
                </Typography>
                <Typography variant="subtitle2">{item.value}</Typography>
              </Stack>
            ))}
          </Box>

          {notification.error && (
            <Alert severity="error">
              <strong>Send failed:</strong> {notification.error}
            </Alert>
          )}

          {showStats && (
            <>
              <Divider sx={{ borderStyle: 'dashed' }} />
              <Typography variant="subtitle1">Delivery</Typography>
              {notification.status === 'sending' ? (
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Sending now. The numbers appear when it finishes.
                </Typography>
              ) : (
                <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(5, 1fr)' } }}>
                  {STAT_ITEMS.map((item) => (
                    <Stack key={item.key} spacing={0.25}>
                      <Typography variant="h5" sx={{ color: item.color && stats[item.key] ? item.color : 'text.primary' }}>
                        {fNumber(stats[item.key] || 0)}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {item.label}
                      </Typography>
                    </Stack>
                  ))}
                </Box>
              )}
            </>
          )}
        </Stack>
      </DialogContent>

      <DialogActions>
        {onSend && (
          <Button variant="contained" color="success" onClick={() => onSend(notification)}>
            Send now
          </Button>
        )}
        <Button variant="outlined" color="inherit" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

NotificationViewDialog.propTypes = {
  notification: PropTypes.object,
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onSend: PropTypes.func,
};
