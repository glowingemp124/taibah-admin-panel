import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';

import { Label } from 'src/components/label';

import { getReviewStatus } from './product-table-config';

// ----------------------------------------------------------------------

export function ProductReviewLabel({ reviewStatus, reviewReason, ...other }) {
  const status = getReviewStatus(reviewStatus);
  const label = (
    <Label variant="soft" color={status.color} {...other}>
      {status.label}
    </Label>
  );

  if (reviewStatus !== 'rejected' || !reviewReason) return label;

  return (
    <Tooltip title={`Reason: ${reviewReason}`} arrow>
      <Box component="span" sx={{ display: 'inline-flex', cursor: 'help' }}>
        {label}
      </Box>
    </Tooltip>
  );
}

ProductReviewLabel.propTypes = {
  reviewStatus: PropTypes.string,
  reviewReason: PropTypes.string,
};
