import PropTypes from 'prop-types';

import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';

import { SocialIcon } from 'src/components/iconify';

export function GoogleAuthButton({ onClick, loading, label = 'Continue with Google' }) {
  return (
    <Stack spacing={2.5} sx={{ mt: 3 }}>
      <Divider
        sx={{
          typography: 'overline',
          color: 'text.disabled',
          '&::before, &::after': { borderTopStyle: 'dashed' },
        }}
      >
        OR
      </Divider>

      <Button
        fullWidth
        color="inherit"
        variant="outlined"
        size="large"
        disabled={loading}
        onClick={onClick}
        startIcon={<SocialIcon icon="google" width={22} />}
        sx={{ height: 52, borderRadius: 999, fontWeight: 700 }}
      >
        {label}
      </Button>
    </Stack>
  );
}

GoogleAuthButton.propTypes = {
  onClick: PropTypes.func,
  loading: PropTypes.bool,
  label: PropTypes.string,
};
