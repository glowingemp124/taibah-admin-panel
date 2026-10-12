import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z as zod } from 'zod';

import LoadingButton from '@mui/lab/LoadingButton';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { Field, Form } from 'src/components/hook-form';
import { toast } from 'src/components/snackbar';

import { CHANNEL_OPTIONS, RECIPIENT_OPTIONS, SCHEDULE_OPTIONS, TYPE_OPTIONS, USER_GROUP_OPTIONS } from './notification-table-config';

// ----------------------------------------------------------------------

export function NotificationFormDialog({ currentNotification, open, onClose }) {
  const isEdit = !!currentNotification;

  const NotificationSchema = useMemo(
    () =>
      zod
        .object({
          title: zod.string().min(1, { message: 'Title is required!' }),
          message: zod.string().min(1, { message: 'Message is required!' }),
          type: zod.string().min(1, { message: 'Type is required!' }),
          recipient: zod.string().min(1, { message: 'Recipient is required!' }),
          userQuery: zod.string().optional(),
          userGroup: zod.string().optional(),
          channel: zod.string().min(1, { message: 'Channel is required!' }),
          schedule: zod.string().min(1, { message: 'Schedule is required!' }),
          scheduledAt: zod.any().nullable().optional(),
        })
        .superRefine((data, ctx) => {
          if (data.recipient === 'user' && !data.userQuery?.trim()) {
            ctx.addIssue({
              code: zod.ZodIssueCode.custom,
              path: ['userQuery'],
              message: 'User ID / Email is required!',
            });
          }

          if (data.recipient === 'group' && !data.userGroup) {
            ctx.addIssue({
              code: zod.ZodIssueCode.custom,
              path: ['userGroup'],
              message: 'User group is required!',
            });
          }

          if (data.schedule === 'later' && !data.scheduledAt) {
            ctx.addIssue({
              code: zod.ZodIssueCode.custom,
              path: ['scheduledAt'],
              message: 'Scheduled date is required!',
            });
          }
        }),
    []
  );

  const defaultValues = useMemo(
    () => ({
      title: currentNotification?.title || '',
      message: currentNotification?.message || '',
      type: currentNotification?.type || 'system',
      recipient: currentNotification?.recipient || 'all',
      userQuery: currentNotification?.userQuery || '',
      userGroup: currentNotification?.userGroup || '',
      channel: currentNotification?.channel || 'in-app',
      schedule: currentNotification?.scheduledAt ? 'later' : 'immediate',
      scheduledAt: currentNotification?.scheduledAt || null,
    }),
    [currentNotification]
  );

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(NotificationSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const recipient = watch('recipient');
  const schedule = watch('schedule');

  useEffect(() => {
    if (open) {
      reset(defaultValues);
    }
  }, [open, defaultValues, reset]);

  useEffect(() => {
    if (schedule === 'later' && !methods.getValues('scheduledAt')) {
      setValue('scheduledAt', dayjs().format());
    }
  }, [schedule, methods, setValue]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      toast.success(isEdit ? 'Notification updated successfully!' : 'Notification created successfully!');
      onClose();
      console.info('NOTIFICATION_DATA', data);
    } catch (error) {
      console.error(error);
      toast.error(isEdit ? 'Failed to update notification' : 'Failed to create notification');
    }
  });

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogTitle>{isEdit ? 'Edit Notification' : 'New Notification'}</DialogTitle>

        <DialogContent>
          <Stack spacing={2.5} sx={{ pt: 1 }}>
            <Field.Text name="title" label="Notification Title" placeholder="e.g. Scheduled Maintenance" />

            <Field.Text name="message" label="Notification Message" placeholder="Enter notification message..." multiline rows={3} />

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Field.Select name="type" label="Notification Type">
                {TYPE_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Field.Select>

              <Field.Select name="recipient" label="Recipient">
                {RECIPIENT_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Field.Select>
            </Stack>

            {recipient === 'user' && (
              <Field.Text name="userQuery" label="User ID / Email" placeholder="Search user by email or ID" />
            )}

            {recipient === 'group' && (
              <Field.Select name="userGroup" label="User Group">
                {USER_GROUP_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Field.Select>
            )}

            <Field.RadioGroup name="channel" label="Delivery Channel" options={CHANNEL_OPTIONS} slotProps={{ formLabel: {} }} />

            <Divider />

            <Field.RadioGroup name="schedule" label="Delivery Schedule" options={SCHEDULE_OPTIONS} slotProps={{ formLabel: {} }} />

            {schedule === 'later' && (
              <Field.DatePicker name="scheduledAt" label="Select scheduled date" disablePast />
            )}
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" color="primary" onClick={onClose}>
            Cancel
          </Button>
          <LoadingButton type="submit" variant="contained" color="primary" loading={isSubmitting}>
            {isEdit ? 'Save Changes' : 'Create Notification'}
          </LoadingButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
