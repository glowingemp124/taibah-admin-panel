import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
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
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';

import { Field, Form } from 'src/components/hook-form';
import { toast } from 'src/components/snackbar';
import { fNumber } from 'src/utils/format-number';

import { getRecipientsCount, saveMockBroadcast } from './mock';
import { CHANNEL_OPTIONS, RECIPIENT_OPTIONS, SCHEDULE_OPTIONS, TYPE_OPTIONS, USER_GROUP_OPTIONS } from './notification-table-config';

// ----------------------------------------------------------------------

const BroadcastSchema = zod
  .object({
    title: zod.string().trim().min(1, { message: 'Title is required!' }),
    message: zod.string().trim().min(1, { message: 'Message is required!' }),
    type: zod.string().min(1, { message: 'Type is required!' }),
    recipient: zod.string().min(1, { message: 'Recipient is required!' }),
    userQuery: zod.string().optional(),
    userGroup: zod.string().optional(),
    channel: zod.string().min(1, { message: 'Channel is required!' }),
    schedule: zod.string().min(1, { message: 'Schedule is required!' }),
    scheduledAt: zod.any().nullable().optional(),
  })
  .superRefine((data, ctx) => {
    const issue = (path, message) => ctx.addIssue({ code: zod.ZodIssueCode.custom, path: [path], message });

    if (data.recipient === 'user' && !data.userQuery?.trim()) issue('userQuery', 'User ID / Email is required!');
    if (data.recipient === 'group' && !data.userGroup) issue('userGroup', 'User group is required!');
    if (data.schedule === 'later' && !data.scheduledAt) issue('scheduledAt', 'Scheduled date is required!');
    if (data.schedule === 'later' && data.scheduledAt && !dayjs(data.scheduledAt).isAfter(dayjs())) issue('scheduledAt', 'Pick a time in the future!');
  });

export function NotificationFormDialog({ currentNotification, open, onClose, onSuccess }) {
  const isEdit = !!currentNotification;

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
    resolver: zodResolver(BroadcastSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    getValues,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const [recipient, userGroup, userQuery, schedule] = watch(['recipient', 'userGroup', 'userQuery', 'schedule']);

  // GET /admin/broadcasts/recipients-count, re-asked as recipient, group or user changes.
  const reach = useMemo(() => getRecipientsCount({ recipient, userGroup, userQuery }), [recipient, userGroup, userQuery]);
  const reachReady = recipient === 'all' || (recipient === 'group' && !!userGroup) || (recipient === 'user' && !!userQuery?.trim());

  useEffect(() => {
    if (open) {
      reset(defaultValues);
    }
  }, [open, defaultValues, reset]);

  useEffect(() => {
    if (schedule === 'later' && !getValues('scheduledAt')) {
      setValue('scheduledAt', dayjs().add(1, 'hour').startOf('hour').format());
    }
  }, [schedule, getValues, setValue]);

  const save = (draft) =>
    handleSubmit(async (data) => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 400));
        const saved = saveMockBroadcast(
          { ...data, _id: currentNotification?._id, scheduledAt: data.schedule === 'later' ? dayjs(data.scheduledAt).toISOString() : null },
          { draft }
        );

        const messages = { draft: 'Saved as draft', scheduled: 'Broadcast scheduled', sending: 'Sending broadcast…' };
        toast.success(messages[saved.status] || 'Broadcast saved');
        onSuccess?.(saved);
        onClose();
      } catch (error) {
        console.error(error);
        toast.error('Failed to save broadcast');
      }
    });

  const onSend = save(false);
  const onSaveDraft = save(true);

  let reachMessage = null;
  if (reachReady) {
    reachMessage = recipient === 'user' && reach === 0 ? 'No user matches this ID or email.' : `This will reach ${fNumber(reach)} ${reach === 1 ? 'user' : 'users'}.`;
  }

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <Form methods={methods} onSubmit={onSend}>
        <DialogTitle>{isEdit ? 'Edit Broadcast' : 'New Broadcast'}</DialogTitle>

        <DialogContent>
          <Stack spacing={2.5} sx={{ pt: 1 }}>
            <Field.Text name="title" label="Title" placeholder="e.g. Scheduled Maintenance" />

            <Field.Text name="message" label="Message" placeholder="Enter the message..." multiline rows={3} />

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Field.Select name="type" label="Type">
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

            {recipient === 'user' && <Field.Text name="userQuery" label="User ID / Email" placeholder="e.g. hina.malik@email.com" />}

            {recipient === 'group' && (
              <Field.Select name="userGroup" label="User Group" SelectProps={{ renderValue: (value) => USER_GROUP_OPTIONS.find((option) => option.value === value)?.label || '' }}>
                {USER_GROUP_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    <ListItemText primary={option.label} secondary={option.hint} primaryTypographyProps={{ typography: 'body2' }} />
                  </MenuItem>
                ))}
              </Field.Select>
            )}

            {reachMessage && (
              <Alert severity={recipient === 'user' && reach === 0 ? 'warning' : 'info'} icon={false} sx={{ py: 0.5 }}>
                {reachMessage}
              </Alert>
            )}

            <Field.RadioGroup name="channel" label="Channel" options={CHANNEL_OPTIONS} slotProps={{ formLabel: {} }} />

            <Divider />

            <Field.RadioGroup name="schedule" label="Delivery" options={SCHEDULE_OPTIONS} slotProps={{ formLabel: {} }} />

            {schedule === 'later' && <Field.MobileDateTimePicker name="scheduledAt" label="Send at" disablePast />}
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" color="inherit" onClick={onClose}>
            Cancel
          </Button>
          <LoadingButton variant="outlined" color="primary" loading={isSubmitting} onClick={onSaveDraft}>
            Save as draft
          </LoadingButton>
          <LoadingButton type="submit" variant="contained" color="primary" loading={isSubmitting}>
            {schedule === 'later' ? 'Schedule' : 'Send now'}
          </LoadingButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
}

NotificationFormDialog.propTypes = {
  currentNotification: PropTypes.object,
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onSuccess: PropTypes.func,
};
