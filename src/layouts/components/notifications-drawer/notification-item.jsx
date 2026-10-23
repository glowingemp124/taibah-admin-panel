import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';

import { fToNow } from 'src/utils/format-time';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

// Tone per type: good news green, problems red, things to act on amber.
const TYPE_COLORS = {
  new_order: 'info',
  order_cancelled_by_customer: 'error',
  product_approved: 'success',
  product_rejected: 'error',
  seller_approved: 'success',
  seller_rejected: 'error',
  seller_application: 'warning',
  product_review_needed: 'warning',
};

export function NotificationItem({ notification, onClick }) {
  const color = TYPE_COLORS[notification.type] || 'primary';

  return (
    <ListItemButton
      onClick={onClick}
      sx={{
        p: 2.5,
        alignItems: 'flex-start',
        borderBottom: (theme) => `dashed 1px ${theme.vars.palette.divider}`,
        ...(!notification.isRead && { bgcolor: 'action.hover' }),
      }}
    >
      {!notification.isRead && (
        <Box sx={{ top: 26, width: 8, height: 8, right: 20, borderRadius: '50%', bgcolor: 'info.main', position: 'absolute' }} />
      )}

      <ListItemAvatar>
        <Stack
          alignItems="center"
          justifyContent="center"
          sx={{ width: 40, height: 40, borderRadius: '50%', color: `${color}.main`, bgcolor: (theme) => theme.vars.palette[color].lighter }}
        >
          <Iconify icon={notification.icon || 'solar:bell-bold'} width={22} />
        </Stack>
      </ListItemAvatar>

      <ListItemText
        disableTypography
        sx={{ pr: 2 }}
        primary={
          <Typography variant="subtitle2" sx={{ mb: 0.25 }}>
            {notification.title}
          </Typography>
        }
        secondary={
          <Stack spacing={0.5}>
            {notification.body && (
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {notification.body}
              </Typography>
            )}
            <Typography variant="caption" sx={{ color: 'text.disabled' }}>
              {fToNow(notification.createdAt)}
            </Typography>
          </Stack>
        }
      />
    </ListItemButton>
  );
}

NotificationItem.propTypes = {
  notification: PropTypes.object.isRequired,
  onClick: PropTypes.func,
};
