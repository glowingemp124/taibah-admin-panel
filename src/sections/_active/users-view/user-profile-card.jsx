import PropTypes from 'prop-types';

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/label';
import { fNumber } from 'src/utils/format-number';
import { fDate, formatStr } from 'src/utils/format-time';
import { getStatusColor } from 'src/utils/table-utils';

import { USER_TYPE_OPTIONS } from './user-table-config';

export function UserProfileCard({ user, onEditStatus }) {
  if (!user) return null;

  const isSeller = (user.roles || []).includes('seller');

  return (
    <Card sx={{ p: 3 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems={{ sm: 'center' }}>
        <Avatar alt={user.name} src={user.avatarUrl} sx={{ width: 80, height: 80, fontSize: 28 }} />

        <Stack spacing={1} sx={{ flex: 1, minWidth: 0 }}>
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
            <Typography variant="h6">{user.name || 'N/A'}</Typography>
            <Label variant="soft" color={getStatusColor(user.status)}>
              {user.status || 'N/A'}
            </Label>
          </Stack>

          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {user.email || 'N/A'}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {user.phone || 'N/A'}
          </Typography>

          <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
            {USER_TYPE_OPTIONS.filter((option) => (user.roles || []).includes(option.value)).map((option) => (
              <Label key={option.value} variant="soft" color={option.color}>
                {option.label}
              </Label>
            ))}
          </Stack>

          {isSeller && (
            <Stack direction="row" spacing={0.75} alignItems="center" sx={{ color: 'text.secondary' }}>
              <Iconify icon="solar:heart-bold" width={18} />
              <Typography variant="body2">{fNumber(user.favoriteCount ?? 0)} favorites</Typography>
            </Stack>
          )}

          <Typography variant="caption" sx={{ color: 'text.disabled' }}>
            Joined {user.createdAt ? fDate(user.createdAt, formatStr.paramCase.date) : 'N/A'}
          </Typography>
        </Stack>

        {onEditStatus && (
          <Button variant="contained" color="primary" startIcon={<Iconify icon="solar:pen-bold" />} onClick={onEditStatus}>
            Edit Status
          </Button>
        )}
      </Stack>
    </Card>
  );
}

UserProfileCard.propTypes = {
  user: PropTypes.object,
  onEditStatus: PropTypes.func,
};
