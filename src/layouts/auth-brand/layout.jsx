import Box from '@mui/material/Box';
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles';

import { CONFIG } from 'src/config-global';
import { useTranslate } from 'src/locales';

import { Logo } from 'src/components/logo';
import { defaultSettings } from 'src/components/settings';

import { createTheme } from 'src/theme/create-theme';

// ----------------------------------------------------------------------

const AUTH_IMAGE = `${CONFIG.site.basePath}/assets/auth/auth-image.jpg`;

function IllustrationPanel({ sx, ...other }) {
  return (
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
        ...sx,
      }}
      {...other}
    >
      <Box
        component="img"
        alt="Taibah"
        src={AUTH_IMAGE}
        sx={{
          position: 'absolute',
          inset: 0,
          width: 1,
          height: 1,
          objectFit: 'cover',
          objectPosition: 'center',
        }}
      />
    </Box>
  );
}

export function AuthBrandLayout({ children }) {
  const { currentLang } = useTranslate();

  const lightTheme = createTheme(currentLang?.systemValue, {
    ...defaultSettings,
    colorScheme: 'light',
  });

  return (
    <CssVarsProvider theme={lightTheme} defaultMode="light" modeStorageKey="auth-forced-light">
      <Box
        data-mui-color-scheme="light"
        sx={{
          minHeight: '100vh',
          display: 'flex',
          p: { xs: 1.5, md: 2.5 },
          bgcolor: '#D8D8D4',
          color: 'text.primary',
        }}
      >
        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            display: 'flex',
            overflow: 'hidden',
            flexDirection: { xs: 'column', lg: 'row' },
            borderRadius: { xs: 3, md: 5 },
            bgcolor: { xs: '#F6F2E8', lg: 'transparent' },
            boxShadow: '0 24px 48px rgba(28, 37, 46, 0.12)',
          }}
        >
          <IllustrationPanel
            sx={{
              display: { xs: 'none', lg: 'block' },
              flex: 1,
              alignSelf: 'stretch',
            }}
          />

          <Box
            sx={{
              position: 'relative',
              flex: { xs: '1 1 auto', lg: '0 0 44%' },
              display: 'flex',
              flexDirection: 'column',
              px: { xs: 3, sm: 6, md: 8 },
              py: { xs: 3.5, md: 5 },
              background: 'linear-gradient(165deg, #F8F5ED 0%, #F3EDDC 48%, #EDE3C4 100%)',
            }}
          >
            <Box
              sx={{
                width: 1,
                maxWidth: 420,
                mx: 'auto',
                my: 'auto',
                py: { xs: 4, md: 6 },
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
              <Box sx={{ mb: 5 }}>
                <Logo href="/" width={64} height={64} />
              </Box>

              {children}
            </Box>
          </Box>
        </Box>
      </Box>
    </CssVarsProvider>
  );
}
