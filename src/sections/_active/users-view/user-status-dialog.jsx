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
import Typography from '@mui/material/Typography';

import { Field, Form } from 'src/components/hook-form';
import { toast } from 'src/components/snackbar';

import { updateMockUserStatus } from './mock';
import { USER_STATUS_OPTIONS } from './user-table-config';

const StatusSchema = zod.object({
  status: zod.enum(['active', 'inactive']),
});

export function UserStatusDialog({ currentUser, open, onClose, onSuccess }) {
  const defaultValues = useMemo(
    () => ({
      status: currentUser?.status || 'active',
    }),
    [currentUser]
  );

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(StatusSchema),
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
      updateMockUserStatus(currentUser._id, data.status);
      toast.success('User status updated successfully!');
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error('Failed to update user status');
    }
  });

  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose}>
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogTitle>Edit Status</DialogTitle>

        <DialogContent>
          {currentUser?.name && (
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2.5, pt: 0.5 }}>
              {currentUser.name}
            </Typography>
          )}

          <Field.Select name="status" label="Status">
            {USER_STATUS_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Field.Select>
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

UserStatusDialog.propTypes = {
  currentUser: PropTypes.object,
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onSuccess: PropTypes.func,
};
