import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect } from 'react';
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
import { Iconify } from 'src/components/iconify';
import { toast } from 'src/components/snackbar';
import { useCountdownSeconds } from 'src/hooks/use-countdown';

import { clearSignupSession, getSignupSession, verifySignupOtp } from './seller-signup/signup-session';

const VerifySchema = zod.object({
  code: zod
    .string()
    .min(1, { message: 'Code is required!' })
    .min(6, { message: 'Code must be 6 digits!' }),
});

export function JwtVerifyView() {
  const router = useRouter();
  const { countdown, counting, startCountdown } = useCountdownSeconds(60);
  const session = getSignupSession();

  const methods = useForm({
    resolver: zodResolver(VerifySchema),
    defaultValues: { code: '' },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    startCountdown();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = handleSubmit(async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    verifySignupOtp(data.code);
    toast.success('Email verified. Continue onboarding.');
    router.push(paths.auth.sellerOnboarding);
  });

  const handleResend = useCallback(() => {
    startCountdown();
    toast.success(`A new code was sent to ${session?.email}.`);
  }, [session?.email, startCountdown]);

  return (
    <>
      <Stack spacing={1} sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h4">Check your email</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', whiteSpace: 'pre-line' }}>
          {`We sent a 6-digit code to\n${session?.email || 'your email'}.`}
        </Typography>
      </Stack>

      <Form methods={methods} onSubmit={onSubmit}>
        <Stack spacing={3}>
          <Field.Code name="code" />

          <LoadingButton
            fullWidth
            color="primary"
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
            sx={{ height: 52, borderRadius: 999, fontWeight: 700 }}
          >
            Verify email
          </LoadingButton>

          <Typography variant="body2" sx={{ mx: 'auto' }}>
            Didn’t get a code?{' '}
            <Link
              variant="subtitle2"
              onClick={handleResend}
              sx={{
                cursor: 'pointer',
                ...(counting && { color: 'text.disabled', pointerEvents: 'none' }),
              }}
            >
              Resend code {counting && `(${countdown}s)`}
            </Link>
          </Typography>

          <Link
            component={RouterLink}
            href={paths.auth.sellerSignIn}
            color="inherit"
            variant="subtitle2"
            sx={{ gap: 0.5, alignSelf: 'center', alignItems: 'center', display: 'inline-flex' }}
          >
            <Iconify width={16} icon="eva:arrow-ios-back-fill" />
            Return to sign in
          </Link>

          <Link
            variant="body2"
            color="text.secondary"
            sx={{ alignSelf: 'center', cursor: 'pointer' }}
            onClick={() => {
              clearSignupSession();
              router.push(paths.auth.sellerSignUp);
            }}
          >
            Use a different email
          </Link>
        </Stack>
      </Form>
    </>
  );
}
