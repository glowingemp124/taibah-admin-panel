import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z as zod } from 'zod';

import LoadingButton from '@mui/lab/LoadingButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import Link from '@mui/material/Link';

import { RouterLink } from 'src/routes/components';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

import { Field, Form } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export const OtpVerifySchema = zod.object({
  otp: zod.string().min(4, { message: 'OTP is required!' }).max(6, { message: 'OTP must be 4-6 digits!' }),
});

// ----------------------------------------------------------------------

export function JwtVerifyPasswordView() {
  const router = useRouter();

  const defaultValues = {
    otp: '',
  };

  const methods = useForm({
    resolver: zodResolver(OtpVerifySchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    // Navigate to reset password page after OTP verification
    router.push(paths.auth.jwt.resetPassword);
  });

  const renderHead = (
    <Stack spacing={0.75} sx={{ mb: 4 }}>
      <Typography variant="h3" sx={{ lineHeight: 1.15 }}>
        Verify OTP
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        Enter the one-time password sent to your email to continue.
      </Typography>
    </Stack>
  );

  const renderForm = (
    <Stack spacing={3}>
      <Field.Text
        name="otp"
        label="OTP Code"
        placeholder=" "
        InputLabelProps={{ shrink: true }}
        inputProps={{ maxLength: 6, inputMode: 'numeric', pattern: '[0-9]*' }}
      />

      <LoadingButton
        fullWidth
        color="primary"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        loadingIndicator="Verifying..."
        sx={{ height: 52, borderRadius: 999, fontWeight: 700 }}
      >
        Verify OTP
      </LoadingButton>

      <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center' }}>
        Already have an account?{' '}
        <Link component={RouterLink} href={paths.auth.jwt.signIn} underline="always" color="text.primary">
          Log in
        </Link>
      </Typography>
    </Stack>
  );

  return (
    <>
      {renderHead}

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm}
      </Form>
    </>
  );
}
