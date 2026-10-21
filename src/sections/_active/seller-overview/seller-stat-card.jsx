import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/label';
import { varAlpha } from 'src/theme/styles';

export function SellerStatCard({ title, value, icon, color = 'primary', hint, hintColor = 'default', sx, ...other }) {
  const theme = useTheme();
  const palette = theme.vars.palette[color];

  return (
    <Card
      sx={{
        py: 2,
        pl: 2.25,
        pr: 1.75,
        height: 1,
        width: 1,
        position: 'relative',
        overflow: 'hidden',
        ...sx,
      }}
      {...other}
    >
      <Box sx={{ position: 'relative', zIndex: 1, pr: 7 }}>
        <Box sx={{ typography: 'h4' }}>{value}</Box>
        <Typography noWrap variant="body2" component="div" sx={{ mt: 0.25, color: 'text.secondary' }}>
          {title}
        </Typography>
        {hint && (
          <Label variant="soft" color={hintColor} sx={{ mt: 1 }}>
            {hint}
          </Label>
        )}
      </Box>

      <Box
        sx={{
          top: 14,
          right: 14,
          zIndex: 1,
          width: 32,
          height: 32,
          display: 'flex',
          borderRadius: 1.5,
          position: 'absolute',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'common.white',
          background: `linear-gradient(135deg, ${palette.main} 0%, ${palette.dark} 100%)`,
        }}
      >
        <Iconify icon={icon} width={18} />
      </Box>

      <Box
        sx={{
          top: -44,
          width: 160,
          zIndex: 0,
          height: 160,
          right: -104,
          opacity: 0.12,
          borderRadius: 3,
          position: 'absolute',
          transform: 'rotate(40deg)',
          background: `linear-gradient(to right, ${palette.main} 0%, ${varAlpha(palette.mainChannel, 0)} 100%)`,
        }}
      />
    </Card>
  );
}

SellerStatCard.propTypes = {
  title: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  icon: PropTypes.string,
  color: PropTypes.string,
  hint: PropTypes.string,
  hintColor: PropTypes.string,
  sx: PropTypes.object,
};
