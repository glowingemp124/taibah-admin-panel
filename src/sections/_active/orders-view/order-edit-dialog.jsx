import { zodResolver } from '@hookform/resolvers/zod';
import PropTypes from 'prop-types';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z as zod } from 'zod';

import LoadingButton from '@mui/lab/LoadingButton';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { Field, Form } from 'src/components/hook-form';
import { toast } from 'src/components/snackbar';

import { updateMockOrder } from './mock';
import { ORDER_STATUS_OPTIONS } from './order-table-config';

const STATUS_EDIT_OPTIONS = ORDER_STATUS_OPTIONS.filter((option) => option.value !== 'all');

const OrderSchema = zod.object({
  status: zod.string().min(1, { message: 'Status is required!' }),
  note: zod.string().optional(),
});

export function OrderEditDialog({ currentOrder, open, onClose, onSuccess }) {
  const defaultValues = useMemo(
    () => ({
      status: currentOrder?.status || 'placed',
      note: currentOrder?.note || '',
    }),
    [currentOrder]
  );

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(OrderSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (open) {
      reset(defaultValues);
    }
  }, [open, defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 400));
      updateMockOrder(currentOrder._id, { status: data.status, note: data.note || '' });
      toast.success('Order updated successfully!');
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error('Failed to update order');
    }
  });

  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose}>
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogTitle>Edit Order</DialogTitle>

        <DialogContent>
          <Stack spacing={2.5} sx={{ pt: 1 }}>
            {currentOrder?.orderId && (
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                #{currentOrder.orderId}
              </Typography>
            )}

            <Field.Select name="status" label="Order Status">
              {STATUS_EDIT_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Field.Select>

            <Field.Text name="note" label="Note" placeholder="Add an internal note..." multiline rows={3} />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" color="primary" onClick={onClose}>
            Cancel
          </Button>
          <LoadingButton type="submit" variant="contained" color="primary" loading={isSubmitting}>
            Save Changes
          </LoadingButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
}

OrderEditDialog.propTypes = {
  currentOrder: PropTypes.object,
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onSuccess: PropTypes.func,
};
