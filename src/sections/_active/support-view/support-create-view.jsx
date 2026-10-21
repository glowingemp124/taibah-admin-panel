import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z as zod } from 'zod';

import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { Field, Form } from 'src/components/hook-form';
import { toast } from 'src/components/snackbar';
import { useAppRole } from 'src/hooks/use-app-role';

import { createMockTicket } from './mock';

const SupportSchema = zod.object({
  subject: zod.string().min(1, { message: 'Subject is required!' }),
  message: zod.string().min(1, { message: 'Message is required!' }),
  priority: zod.enum(['low', 'medium', 'high']),
});

export function SupportCreateView() {
  const { sellerId } = useAppRole();

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(SupportSchema),
    defaultValues: {
      subject: '',
      message: '',
      priority: 'medium',
    },
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    createMockTicket({
      userId: sellerId || 'usr-002',
      subject: data.subject,
      message: data.message,
      priority: data.priority,
    });
    toast.success('Support query sent!');
    reset();
  });

  return (
    <Box sx={{ px: { xs: 2, md: 5 }, pb: 5, pt: 3 }}>
      <CustomBreadcrumbs
        heading="Support"
        links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'Settings' }, { name: 'Support' }]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Form methods={methods} onSubmit={onSubmit}>
        <Card sx={{ p: { xs: 2.5, md: 3 }, maxWidth: 720 }}>
          <Stack spacing={3}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Send a query to the Taibah support team. An admin will reply from the admin inbox.
            </Typography>
            <Field.Text name="subject" label="Subject" />
            <Field.Select name="priority" label="Priority">
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
            </Field.Select>
            <Field.Text name="message" label="Message" multiline rows={6} />
            <Stack direction="row" justifyContent="flex-end">
              <LoadingButton type="submit" variant="contained" color="primary" loading={isSubmitting}>
                Send query
              </LoadingButton>
            </Stack>
          </Stack>
        </Card>
      </Form>
    </Box>
  );
}
