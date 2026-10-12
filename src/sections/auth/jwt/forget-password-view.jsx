import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z as zod } from 'zod';

import LoadingButton from '@mui/lab/LoadingButton';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

import { Field, Form } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export const SignInSchema = zod.object({
  email: zod.string().min(1, { message: 'Email is required!' }).email({ message: 'Email must be a valid email address!' }),
});

// ----------------------------------------------------------------------

export function JwtForgetPasswordView() {
  const router = useRouter();

  const defaultValues = {
    email: '',
  };

  const methods = useForm({
    resolver: zodResolver(SignInSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    // Navigate to reset password page after submission
    router.push(paths.auth.jwt.verifyPassword);
  });

  const renderHead = (
    <Stack spacing={0.75} sx={{ mb: 4 }}>
      <Typography variant="h3" sx={{ lineHeight: 1.15 }}>
        Forgot password?
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        Enter your email and we will send you a verification code.
      </Typography>
    </Stack>
  );

  const renderForm = (
    <Stack spacing={3}>
      <Field.Text name="email" label="Email address" placeholder=" " InputLabelProps={{ shrink: true }} />

      <LoadingButton
        fullWidth
        color="primary"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        loadingIndicator="Sending..."
        sx={{ height: 52, borderRadius: 999, fontWeight: 700 }}
      >
        Continue
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
