import { zodResolver } from '@hookform/resolvers/zod';
import PropTypes from 'prop-types';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z as zod } from 'zod';

import LoadingButton from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert';
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

import { updateMockStoreOrder } from './mock';
import { getAllowedStatuses, getOrderStatusLabel } from './order-table-config';

// ----------------------------------------------------------------------

const StoreOrderSchema = zod
  .object({
    status: zod.string().min(1, { message: 'Status is required!' }),
    reason: zod.string().trim().max(500, { message: 'Reason must be at most 500 characters!' }).optional(),
    note: zod.string().max(1000, { message: 'Note must be at most 1000 characters!' }).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.status === 'cancelled' && !data.reason?.trim()) {
      ctx.addIssue({ code: zod.ZodIssueCode.custom, path: ['reason'], message: 'Reason is required when cancelling!' });
    }
  });

/**
 * Edits one store order (not the whole order): its status and internal note.
 * Sellers and admins follow the same moves; `role` only records who made the change.
 */
export function OrderEditDialog({ order, storeOrder, role = 'admin', actor, open, onClose, onSuccess }) {
  const current = storeOrder?.status || 'pending';
  const allowed = useMemo(() => getAllowedStatuses(current), [current]);
  const locked = !allowed.length;

  const defaultValues = useMemo(() => ({ status: current, reason: '', note: storeOrder?.note || '' }), [current, storeOrder]);

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(StoreOrderSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const status = watch('status');

  useEffect(() => {
    if (open) {
      reset(defaultValues);
    }
  }, [open, defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 400));
      updateMockStoreOrder(order._id, storeOrder._id, { status: data.status, reason: data.reason?.trim() || null, note: data.note?.trim() || '' }, { role, by: actor || null });
      toast.success(data.status === current ? 'Note saved!' : `Store order ${getOrderStatusLabel(data.status).toLowerCase()}!`);
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error(error.status === 409 ? error.message : 'Failed to update store order');
    }
  });

  if (!order || !storeOrder) return null;

  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose}>
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogTitle>
          Update store order
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {storeOrder.code} · {storeOrder.name}
          </Typography>
        </DialogTitle>

        <DialogContent>
          <Stack spacing={2.5} sx={{ pt: 1 }}>
            {locked && (
              <Alert severity="info">This store order is {getOrderStatusLabel(current).toLowerCase()}, so its status can&apos;t change. You can still edit the note.</Alert>
            )}

            <Field.Select name="status" label="Status" disabled={locked}>
              {[current, ...allowed].map((value) => (
                <MenuItem key={value} value={value}>
                  {value === current ? `${getOrderStatusLabel(value)} (current)` : getOrderStatusLabel(value)}
                </MenuItem>
              ))}
            </Field.Select>

            {status === 'cancelled' && status !== current && (
              <Field.Text name="reason" label="Cancel reason" placeholder="e.g. out of stock" helperText="Shown to the customer." multiline rows={2} />
            )}

            <Field.Text name="note" label="Internal note" placeholder="Only admins and this store see it" multiline rows={3} />
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
  order: PropTypes.object,
  storeOrder: PropTypes.object,
  role: PropTypes.oneOf(['admin', 'seller']),
  actor: PropTypes.object,
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onSuccess: PropTypes.func,
};
