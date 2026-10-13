import PropTypes from 'prop-types';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { fShortenNumber } from 'src/utils/format-number';

export function ProductStoreCard({ company }) {
  if (!company) return null;

  const storeRating = Math.round(company.rating || 0);
  const seller = company.seller;

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        border: (theme) => `1px solid ${theme.vars.palette.divider}`,
        bgcolor: 'background.neutral',
        containerType: 'inline-size',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          '@container (min-width: 440px)': {
            flexDirection: 'row',
            alignItems: 'flex-start',
          },
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="flex-start" sx={{ flex: 1, minWidth: 0 }}>
          <Avatar src={company.logo} alt={company.name} variant="rounded" sx={{ width: 48, height: 48, flexShrink: 0 }} />
          <Stack spacing={0.5} sx={{ minWidth: 0 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, letterSpacing: 0.4 }}>
              STORE
            </Typography>
            <Typography variant="subtitle2">{company.name}</Typography>
            <Stack direction="row" spacing={0.75} alignItems="center" flexWrap="wrap" useFlexGap>
              <Rating size="small" value={storeRating} readOnly />
              <Typography variant="caption" sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}>
                {storeRating}/5 · {fShortenNumber(company.reviews || 0)} reviews
              </Typography>
            </Stack>
          </Stack>
        </Stack>

        {seller && (
          <Stack
            direction="row"
            spacing={1.5}
            alignItems="flex-start"
            sx={{
              flex: 1,
              minWidth: 0,
              pt: 1.5,
              borderTop: (theme) => `1px solid ${theme.vars.palette.divider}`,
              '@container (min-width: 440px)': {
                pt: 0,
                pl: 2,
                borderTop: 'none',
                borderLeft: (theme) => `1px solid ${theme.vars.palette.divider}`,
              },
            }}
          >
            <Avatar src={seller.avatarUrl} alt={seller.name} sx={{ width: 48, height: 48, flexShrink: 0 }} />
            <Stack spacing={0.5} sx={{ minWidth: 0 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, letterSpacing: 0.4 }}>
                SELLER
              </Typography>
              <Typography variant="subtitle2">{seller.name}</Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', wordBreak: 'break-word' }}>
                {seller.email}
              </Typography>
            </Stack>
          </Stack>
        )}
      </Box>
    </Box>
  );
}

ProductStoreCard.propTypes = {
  company: PropTypes.object,
};
