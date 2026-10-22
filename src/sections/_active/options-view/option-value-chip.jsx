import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

// ----------------------------------------------------------------------

export function ColorSwatch({ color, size = 14, sx }) {
  return (
    <Box
      component="span"
      sx={{
        width: size,
        height: size,
        flexShrink: 0,
        borderRadius: '50%',
        display: 'inline-block',
        bgcolor: color,
        border: (theme) => `1px solid ${theme.vars.palette.divider}`,
        ...sx,
      }}
    />
  );
}

ColorSwatch.propTypes = {
  color: PropTypes.string,
  size: PropTypes.number,
  sx: PropTypes.object,
};

// Inline swatch + label, for menus and plain text cells.
export function OptionValueLabel({ type, value, label }) {
  if (type !== 'color') return label || value;

  return (
    <Stack component="span" direction="row" spacing={1} alignItems="center" sx={{ display: 'inline-flex' }}>
      <ColorSwatch color={value} />
      <span>{label || value}</span>
    </Stack>
  );
}

OptionValueLabel.propTypes = {
  type: PropTypes.string,
  value: PropTypes.string,
  label: PropTypes.string,
};

export function OptionValueChip({ type, value, label, ...other }) {
  return (
    <Chip
      size="small"
      variant="soft"
      label={label || value}
      icon={type === 'color' ? <ColorSwatch color={value} sx={{ ml: '6px !important' }} /> : undefined}
      {...other}
    />
  );
}

OptionValueChip.propTypes = {
  type: PropTypes.string,
  value: PropTypes.string,
  label: PropTypes.string,
};
