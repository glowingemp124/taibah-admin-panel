import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import { Logo } from 'src/components/logo';
import { ThemeToggleButton } from '../components/theme-toggle-button';

import souqBg from 'src/assets/images/auth-souq.jpg';

// ----------------------------------------------------------------------

const SOUQ_BG = souqBg;

function IllustrationPanel({ sx, ...other }) {
  return (
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
        bgcolor: '#F7F1E6',
        ...sx,
      }}
      {...other}
    >
      <Box
        component="img"
        alt="Taibah marketplace"
        src={SOUQ_BG}
        sx={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center 22%',
          transform: 'scale(1.06)',
        }}
      />
    </Box>
  );
}

// ----------------------------------------------------------------------

export function AuthBrandLayout({ children }) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        bgcolor: 'background.paper',
      }}
    >
      <IllustrationPanel
        sx={{
          display: { xs: 'none', md: 'block' },
          flex: 1.05,
          minHeight: '100vh',
        }}
      />

      <IllustrationPanel
        sx={{
          display: { xs: 'block', md: 'none' },
          height: 168,
          flexShrink: 0,
        }}
      />

      <Box
        sx={{
          position: 'relative',
          flex: 0.95,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: { xs: 3, sm: 8, md: 10 },
          py: { xs: 5, md: 8 },
          bgcolor: 'background.paper',
        }}
      >
        <ThemeToggleButton
          sx={{
            position: 'absolute',
            top: 20,
            right: 20,
            mr: 0,
            bgcolor: 'grey.200',
            '&:hover': { bgcolor: 'grey.300' },
          }}
        />

        <Box
          sx={{
            width: 1,
            maxWidth: 420,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              height: 56,
              alignItems: 'center',
            },
            '& .MuiOutlinedInput-input': {
              height: 54,
              boxSizing: 'border-box',
              paddingTop: '0 !important',
              paddingBottom: '0 !important',
              lineHeight: '54px',
            },
            '& .MuiInputAdornment-root': {
              height: 54,
              maxHeight: 'none',
              margin: 0,
            },
            '& .MuiInputLabel-outlined': {
              transform: 'translate(14px, 16px) scale(1)',
            },
            '& .MuiInputLabel-outlined.MuiInputLabel-shrink': {
              transform: 'translate(14px, -9px) scale(0.75)',
            },
          }}
        >
          <Stack alignItems="flex-start" sx={{ mb: 4 }}>
            <Logo href="/" width={56} height={56} />
          </Stack>

          {children}
        </Box>
      </Box>
    </Box>
  );
}
