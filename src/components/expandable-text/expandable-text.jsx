import PropTypes from 'prop-types';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';

import { useBoolean } from 'src/hooks/use-boolean';

export function ExpandableText({ content = '', maxLength = 80, title = 'Details', emptyText = 'N/A', sx }) {
  const dialog = useBoolean();
  const text = String(content || '').trim();
  const isLong = text.length > maxLength;
  const preview = isLong ? `${text.slice(0, maxLength).trimEnd()}...` : text || emptyText;

  return (
    <>
      <Typography
        variant="body2"
        onClick={isLong ? dialog.onTrue : undefined}
        sx={{
          display: '-webkit-box',
          overflow: 'hidden',
          WebkitBoxOrient: 'vertical',
          WebkitLineClamp: 2,
          ...(isLong && {
            cursor: 'pointer',
            '&:hover': { textDecoration: 'underline' },
          }),
          ...sx,
        }}
      >
        {preview}
      </Typography>

      <Dialog fullWidth maxWidth="xs" open={dialog.value} onClose={dialog.onFalse}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', pt: 0.5 }}>
            {text}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="primary" onClick={dialog.onFalse}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

ExpandableText.propTypes = {
  content: PropTypes.string,
  maxLength: PropTypes.number,
  title: PropTypes.string,
  emptyText: PropTypes.string,
  sx: PropTypes.object,
};
