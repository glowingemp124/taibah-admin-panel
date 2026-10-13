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
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { Field, Form } from 'src/components/hook-form';
import { toast } from 'src/components/snackbar';

import { closeMockTicket, replyMockTicket } from './mock';

const ReplySchema = zod.object({
  message: zod.string().min(1, { message: 'Message is required!' }),
  closeTicket: zod.boolean().optional(),
});

export function SupportReplyDialog({ ticket, open, onClose, onSuccess }) {
  const defaultValues = useMemo(
    () => ({
      message: '',
      closeTicket: false,
    }),
    []
  );

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(ReplySchema),
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
      replyMockTicket(ticket._id, data.message);
      if (data.closeTicket) {
        closeMockTicket(ticket._id);
      }
      toast.success('Reply sent successfully!');
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error('Failed to send reply');
    }
  });

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogTitle>Reply</DialogTitle>

        <DialogContent>
          <Stack spacing={2.5} sx={{ pt: 1 }}>
            {ticket?.subject && (
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {ticket.name} · {ticket.subject}
              </Typography>
            )}

            <Field.Text name="message" label="Message" multiline rows={4} />
            <Field.Checkbox name="closeTicket" label="Mark ticket as closed" />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" color="primary" onClick={onClose}>
            Cancel
          </Button>
          <LoadingButton type="submit" variant="contained" color="primary" loading={isSubmitting}>
            Send
          </LoadingButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
}

SupportReplyDialog.propTypes = {
  ticket: PropTypes.object,
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onSuccess: PropTypes.func,
};
