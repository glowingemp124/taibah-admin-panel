import PropTypes from 'prop-types';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { Label } from 'src/components/label';
import { fCurrency } from 'src/utils/format-number';

import { getBetterDiscountNote } from './mock';

// ----------------------------------------------------------------------

export function EventDiscountLabel({ percent, suffix = 'off' }) {
  if (!percent) return '—';

  return (
    <Label variant="soft" color="warning">
      {percent}% {suffix}
    </Label>
  );
}

EventDiscountLabel.propTypes = {
  percent: PropTypes.number,
  suffix: PropTypes.string,
};

const pricingDetails = (regularPrice, pricing) => {
  const lines = [`Regular price: ${fCurrency(regularPrice)}`];

  if (!pricing.percent) {
    lines.push('No discount during this event.');
    return lines;
  }

  lines.push(getBetterDiscountNote(pricing) || (pricing.source === 'event' ? 'Event discount applies.' : "Product's own discount applies."));
  lines.push('Customers get the better discount, never both.');
  return lines;
};

// Final event price + "% off"; how it was worked out lives in the tooltip.
export function EventPriceText({ regularPrice, pricing }) {
  return (
    <Tooltip
      arrow
      title={
        <Stack spacing={0.25}>
          {pricingDetails(regularPrice, pricing).map((line) => (
            <span key={line}>{line}</span>
          ))}
        </Stack>
      }
    >
      <Stack direction="row" spacing={0.75} alignItems="center" sx={{ whiteSpace: 'nowrap', cursor: 'help', width: 'fit-content' }}>
        <Typography variant="subtitle2">{fCurrency(pricing.price)}</Typography>
        {pricing.percent > 0 && (
          <Label variant="soft" color="warning">
            {pricing.percent}% off
          </Label>
        )}
      </Stack>
    </Tooltip>
  );
}

EventPriceText.propTypes = {
  regularPrice: PropTypes.number,
  pricing: PropTypes.object.isRequired,
};

export function AddedByLabel({ addedBy }) {
  return (
    <Label variant="soft" color={addedBy === 'admin' ? 'info' : 'default'}>
      {addedBy === 'admin' ? 'Admin' : 'Seller'}
    </Label>
  );
}

AddedByLabel.propTypes = {
  addedBy: PropTypes.string,
};

// Autocomplete option row: thumbnail + title (+ caption) for products, logo + name for stores.
export function EventOptionRow({ image, title, caption, rounded = true }) {
  return (
    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ minWidth: 0 }}>
      <Avatar src={image} alt={title} variant={rounded ? 'rounded' : 'circular'} sx={{ width: 32, height: 32 }} />
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="body2" noWrap>
          {title}
        </Typography>
        {caption && (
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {caption}
          </Typography>
        )}
      </Box>
    </Stack>
  );
}

EventOptionRow.propTypes = {
  image: PropTypes.string,
  title: PropTypes.string,
  caption: PropTypes.node,
  rounded: PropTypes.bool,
};
