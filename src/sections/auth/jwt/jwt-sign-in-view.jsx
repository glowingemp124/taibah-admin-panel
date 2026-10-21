import { zodResolver } from '@hookform/resolvers/zod';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'src/components/snackbar';
import { z as zod } from 'zod';

import LoadingButton from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';
import { PERMISSION_ADMIN, PERMISSION_SELLER } from 'src/hooks/use-app-role';

import { Field, Form } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';

import { useDispatch } from 'react-redux';
import { setUser } from 'src/store/slices/userSlice';
import { handleApiError } from 'src/utils/errorHandler';
import { getDeviceType } from 'src/utils/getDeviceType';
import { MOCK_USERS } from 'src/sections/_active/users-view/mock';
import { MOCK_COMPANIES, updateMockCompany } from 'src/sections/_active/products-view/mock';
import { authenticateSeller, findSellerProfile } from 'src/sections/auth/jwt/seller-signup';
import { buildSellerAuthUser } from 'src/sections/auth/jwt/seller-signup/complete-session';
import {
  findPendingSignup,
  SIGNUP_STAGE,
  startGoogleSignup,
} from 'src/sections/auth/jwt/seller-signup/signup-session';
import { GoogleAuthButton } from 'src/sections/auth/jwt/google-auth-button';
import { mockGoogleAuth } from 'src/sections/auth/jwt/social-auth';

const SignInSchema = zod.object({
  email: zod.string().min(1, { message: 'Email is required!' }).email({ message: 'Email must be a valid email address!' }),
  password: zod.string().min(1, { message: 'Password is required!' }).min(6, { message: 'Password must be at least 6 characters!' }),
});

const SELLER_USER = MOCK_USERS.find((row) => row._id === 'usr-002');
const SELLER_COMPANY = MOCK_COMPANIES.find((row) => row.seller?._id === 'usr-002');

const mockLogin = async (payload) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const isAdmin = payload.userType === 'admin';
  const seller = SELLER_USER;
  const sellerProfile = isAdmin ? null : authenticateSeller({ email: payload.email, password: payload.password });
  const sellerName = sellerProfile
    ? `${sellerProfile.firstName || ''} ${sellerProfile.lastName || ''}`.trim()
    : seller?.name || 'Omar Al-Farsi';

  return {
    message: 'Login success',
    data: {
      basicInfo: {
        _id: isAdmin ? 'admin-001' : seller?._id || 'usr-002',
        profileIcon: isAdmin ? 'https://dummybucket.s3.us-east-1.amazonaws.com/noimage.png' : seller?.avatarUrl,
        name: isAdmin ? 'Admin User' : sellerName,
        email: payload.email,
        phoneNumber: isAdmin ? null : sellerProfile?.phone || seller?.phone,
        language: 'en',
      },
      sellerProfile,
      accountState: {
        userType: payload.userType,
        status: 'active',
        verificationStatus: {
          email: 'verified',
          phoneNumber: 'pending',
        },
      },
      metadata: {
        timezone: payload.timezone,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      token: 'mock-token',
    },
  };
};

export function JwtSignInView({ variant = 'seller' }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const isAdmin = variant === 'admin';

  const [errorMsg, setErrorMsg] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);
  const password = useBoolean();

  const resumeSignup = (session) => {
    router.push(session.stage === SIGNUP_STAGE.VERIFY ? paths.auth.sellerVerify : paths.auth.sellerOnboarding);
  };

  const defaultValues = {
    email: isAdmin ? 'admin@taibah.com' : 'user@taibah.com',
    password: 'PassWord@2',
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
    const deviceType = getDeviceType();

    const payload = {
      email: data.email.trim().toLowerCase(),
      password: data.password,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      userType: isAdmin ? 'admin' : 'seller',
      deviceType,
      deviceId: '123',
    };

    try {
      if (!isAdmin) {
        const pending = findPendingSignup(payload.email);
        if (pending) {
          if (pending.provider === 'google') {
            throw new Error('This account uses Google. Continue with Google to sign in.');
          }
          if (pending.password !== payload.password) {
            throw new Error('Invalid email or password');
          }
          resumeSignup(pending);
          return;
        }
      }

      const response = await mockLogin(payload);

      if (response.error) {
        return toast.error(response.error.data?.message);
      }

      if (!response.data) {
        toast.error('Login failed: No user data received');
        return null;
      }

      const user = response.data;

      if (!user?.accountState?.status) {
        toast.error('Your account is inactive. Please contact support.');
        return null;
      }

      const UpdatedUserData = {
        ...user,
        permission: isAdmin ? PERMISSION_ADMIN : PERMISSION_SELLER,
        sellerId: isAdmin ? null : 'usr-002',
        companyId: isAdmin ? null : SELLER_COMPANY?._id || 'co-001',
        sellerProfile: isAdmin ? null : user.sellerProfile,
      };

      if (!isAdmin && UpdatedUserData.sellerProfile?.storeName && SELLER_COMPANY?._id) {
        updateMockCompany(SELLER_COMPANY._id, {
          name: UpdatedUserData.sellerProfile.storeName,
          description: UpdatedUserData.sellerProfile.storeDescription || SELLER_COMPANY.description,
        });
      }

      dispatch(setUser(UpdatedUserData));
      router.push(isAdmin ? paths.adminDashboard.root : paths.dashboard.root);
      reset();
    } catch (error) {
      setErrorMsg(typeof error === 'string' ? error : error.message);
      handleApiError(error);
    }
  });

  return (
    <>
      <Stack spacing={0.75} sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ lineHeight: 1.15 }}>
          Sign in
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {isAdmin ? (
            'Sign in to the Taibah admin dashboard'
          ) : (
            <>
              Sign in to manage your store.{' '}
              <Link component={RouterLink} href={paths.auth.sellerSignUp} underline="always" color="text.primary">
                Create a seller account
              </Link>
            </>
          )}
        </Typography>
      </Stack>

      {!!errorMsg && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMsg}
        </Alert>
      )}

      <Form methods={methods} onSubmit={onSubmit}>
        <Stack spacing={3}>
          <Field.Text name="email" label="Email address" placeholder=" " InputLabelProps={{ shrink: true }} />

          <Stack spacing={1.5}>
            <Field.Text
              name="password"
              label="Password"
              placeholder=" "
              type={password.value ? 'text' : 'password'}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={password.onToggle} edge="end">
                      <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Link component={RouterLink} href={paths.auth.jwt.forgetPassword} variant="body2" color="primary" underline="always" sx={{ alignSelf: 'flex-start', fontWeight: 600 }}>
              Forgot password?
            </Link>
          </Stack>

          <LoadingButton
            fullWidth
            color="primary"
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
            loadingIndicator="Sign in..."
            sx={{ mt: 1, height: 52, borderRadius: 999, fontWeight: 700 }}
          >
            Sign in
          </LoadingButton>
        </Stack>
      </Form>

      {!isAdmin && (
        <GoogleAuthButton
          loading={googleLoading}
          label="Sign in with Google"
          onClick={async () => {
            setErrorMsg('');
            setGoogleLoading(true);
            try {
              const googleProfile = await mockGoogleAuth();
              const saved = findSellerProfile(googleProfile.email);
              if (saved) {
                dispatch(setUser(buildSellerAuthUser(saved)));
                router.push(paths.dashboard.root);
                return;
              }

              const pending = findPendingSignup(googleProfile.email);
              if (pending) {
                resumeSignup(pending);
                return;
              }

              startGoogleSignup(googleProfile);
              toast.success('Google account connected. Finish setting up your store.');
              router.push(paths.auth.sellerOnboarding);
            } catch (error) {
              setErrorMsg(error instanceof Error ? error.message : 'Google sign-in failed.');
            } finally {
              setGoogleLoading(false);
            }
          }}
        />
      )}
    </>
  );
}

JwtSignInView.propTypes = {
  variant: PropTypes.oneOf(['admin', 'seller']),
};
