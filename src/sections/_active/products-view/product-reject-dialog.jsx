import { zodResolver } from '@hookform/resolvers/zod';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z as zod } from 'zod';

import LoadingButton from '@mui/lab/LoadingButton';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { Field, Form } from 'src/components/hook-form';

// ----------------------------------------------------------------------

const RejectSchema = zod.object({
  reason: zod.string().trim().min(1, { message: 'Reason is required!' }).max(500, { message: 'Reason must be at most 500 characters!' }),
});

export function ProductRejectDialog({ product, open, onClose, onConfirm }) {
  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(RejectSchema),
    defaultValues: { reason: '' },
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (open) {
      reset({ reason: '' });
    }
  }, [open, reset]);

  const onSubmit = handleSubmit(async (data) => {
    await onConfirm(data.reason.trim());
  });

  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={isSubmitting ? undefined : onClose}>
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogTitle>Reject product</DialogTitle>

        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Tell the seller why <strong>{product?.title}</strong> was rejected. They will see this reason on the product.
            </Typography>
            <Field.Text name="reason" label="Reason" placeholder="e.g. Blurry photos" multiline rows={3} autoFocus />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" color="inherit" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <LoadingButton type="submit" variant="contained" color="error" loading={isSubmitting}>
            Reject
          </LoadingButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
}

ProductRejectDialog.propTypes = {
  product: PropTypes.object,
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onConfirm: PropTypes.func,
};
