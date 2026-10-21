import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import LoadingButton from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

import { Field, Form } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';
import { toast } from 'src/components/snackbar';
import { useBoolean } from 'src/hooks/use-boolean';

import { GoogleAuthButton } from './google-auth-button';
import { getFieldError, SellerAccountSchema } from './seller-signup/schema';
import { findSellerProfile } from './seller-signup/storage';
import {
  findPendingSignup,
  getSignupSession,
  SIGNUP_STAGE,
  startEmailSignup,
  startGoogleSignup,
} from './seller-signup/signup-session';
import { mockGoogleAuth } from './social-auth';

const defaultValues = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
};

function resumePath(session) {
  return session.stage === SIGNUP_STAGE.VERIFY ? paths.auth.sellerVerify : paths.auth.sellerOnboarding;
}

export function JwtSignUpView() {
  const router = useRouter();
  const passwordVisible = useBoolean();
  const [errorMsg, setErrorMsg] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);

  const methods = useForm({
    resolver: zodResolver(SellerAccountSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    const session = getSignupSession();
    if (session) {
      router.replace(resumePath(session));
    }
  }, [router]);

  const onSubmit = handleSubmit(async (data) => {
    setErrorMsg('');

    const email = data.email.trim().toLowerCase();
    const firstError =
      getFieldError('firstName', data) ||
      getFieldError('lastName', data) ||
      getFieldError('email', data) ||
      getFieldError('password', data);

    if (firstError) {
      setErrorMsg(firstError);
      return;
    }

    if (findSellerProfile(email) || email === 'user@taibah.com') {
      setErrorMsg('An account with this email already exists. Sign in instead.');
      return;
    }

    const pending = findPendingSignup(email);
    if (pending) {
      router.push(resumePath(pending));
      return;
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 400));
      startEmailSignup({
        firstName: data.firstName,
        lastName: data.lastName,
        email,
        password: data.password,
      });
      toast.success('We sent a 6-digit code to your email.');
      router.push(paths.auth.sellerVerify);
    } catch (error) {
      setErrorMsg(error instanceof Error ? error.message : 'Unable to create your account.');
    }
  });

  const handleGoogle = async () => {
    setErrorMsg('');
    setGoogleLoading(true);

    try {
      const googleProfile = await mockGoogleAuth();
      const existing = findSellerProfile(googleProfile.email);

      if (existing) {
        toast.error('This Google account already has a seller profile. Sign in instead.');
        router.push(paths.auth.sellerSignIn);
        return;
      }

      const pending = findPendingSignup(googleProfile.email);
      if (pending) {
        router.push(resumePath(pending));
        return;
      }

      startGoogleSignup(googleProfile);
      toast.success('Google account connected. Finish setting up your store.');
      router.push(paths.auth.sellerOnboarding);
    } catch (error) {
      setErrorMsg(error instanceof Error ? error.message : 'Google sign-up failed.');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <>
      <Stack spacing={0.75} sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ lineHeight: 1.15 }}>
          Create your account
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Already have an account?{' '}
          <Link component={RouterLink} href={paths.auth.sellerSignIn} underline="always" color="text.primary">
            Sign in
          </Link>
        </Typography>
      </Stack>

      {!!errorMsg && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMsg}
        </Alert>
      )}

      <Form methods={methods} onSubmit={onSubmit}>
        <Stack spacing={2.5}>
          <Box
            rowGap={2.5}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
          >
            <Field.Text name="firstName" label="First name" />
            <Field.Text name="lastName" label="Last name" />
          </Box>

          <Field.Text name="email" label="Email address" />

          <Field.Text
            name="password"
            label="Password"
            type={passwordVisible.value ? 'text' : 'password'}
            helperText="8+ characters with a letter, a number, and a symbol."
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={passwordVisible.onToggle} edge="end">
                    <Iconify icon={passwordVisible.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <LoadingButton
            fullWidth
            color="primary"
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
            sx={{ height: 52, borderRadius: 999, fontWeight: 700 }}
          >
            Create account
          </LoadingButton>
        </Stack>
      </Form>

      <GoogleAuthButton onClick={handleGoogle} loading={googleLoading} label="Sign up with Google" />
    </>
  );
}
