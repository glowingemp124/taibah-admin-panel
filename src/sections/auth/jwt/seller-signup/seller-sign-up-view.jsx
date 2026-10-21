import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useState } from 'react';
import { useForm, useFormContext } from 'react-hook-form';
import { useDispatch } from 'react-redux';

import LoadingButton from '@mui/lab/LoadingButton';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Link from '@mui/material/Link';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';
import { PERMISSION_SELLER } from 'src/hooks/use-app-role';

import { Field, Form } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';
import { toast } from 'src/components/snackbar';

import { setUser } from 'src/store/slices/userSlice';
import { MOCK_COMPANIES, updateMockCompany } from 'src/sections/_active/products-view/mock';

import { DOCUMENT_ACCEPT, ID_TYPE_OPTIONS, PROOF_OF_ADDRESS_HELP, SIGNUP_STEPS } from './constants';
import { getFieldError, getStepErrors, SELLER_SIGNUP_DEFAULTS, SellerSignUpSchema } from './schema';
import { formatCountry, formatFileName, saveSellerProfile } from './storage';
import { SellerSignupStepper } from './stepper';

const SELLER_COMPANY = MOCK_COMPANIES.find((row) => row.seller?._id === 'usr-002');

function FieldsGrid({ children }) {
  return (
    <Box
      rowGap={2.5}
      columnGap={2}
      display="grid"
      gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
    >
      {children}
    </Box>
  );
}

function Span({ children }) {
  return <Box sx={{ gridColumn: { sm: 'span 2' } }}>{children}</Box>;
}

function AccountStoreStep({ passwordVisible, confirmPasswordVisible }) {
  return (
    <Stack spacing={2.5}>
      <Typography variant="subtitle1">Create your account and store</Typography>
      <FieldsGrid>
        <Field.Text name="firstName" label="First name" />
        <Field.Text name="lastName" label="Last name" />
        <Span>
          <Field.Text name="email" label="Email address" />
        </Span>
        <Span>
          <Field.Phone name="phone" label="Phone number" />
        </Span>
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
        <Field.Text
          name="confirmPassword"
          label="Confirm password"
          type={confirmPasswordVisible.value ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={confirmPasswordVisible.onToggle} edge="end">
                  <Iconify icon={confirmPasswordVisible.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Span>
          <Field.Text name="storeName" label="Store name" helperText="This is the name customers will see." />
        </Span>
        <Span>
          <Field.Text name="storeDescription" label="Store description" multiline rows={3} helperText="Optional. Max 500 characters." />
        </Span>
      </FieldsGrid>
    </Stack>
  );
}

function VerificationStep() {
  return (
    <Stack spacing={2.5}>
      <Typography variant="subtitle1">Identity verification</Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        Provide the legal identity details required to verify you as a seller.
      </Typography>

      <FieldsGrid>
        <Field.DatePicker name="dateOfBirth" label="Date of birth" disableFuture />
        <Field.Text name="placeOfBirth" label="Place of birth" />
        <Span>
          <Field.Text name="residentialStreet" label="Residential address" />
        </Span>
        <Field.Text name="residentialCity" label="City" />
        <Field.Text name="residentialState" label="State / region" />
        <Field.Text name="residentialPostal" label="Postal code" />
        <Field.CountrySelect name="residentialCountry" label="Country" placeholder="Choose a country" />
        <Field.Select name="idType" label="ID type">
          {ID_TYPE_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Field.Select>
        <Field.Text name="idNumber" label="ID number" />
        <Span>
          <Field.DatePicker name="idExpiry" label="ID expiration date" disablePast />
        </Span>
      </FieldsGrid>
    </Stack>
  );
}

function DocumentsStep() {
  const { setValue } = useFormContext();

  return (
    <Stack spacing={2.5}>
      <Typography variant="subtitle1">Upload verification documents</Typography>

      <Field.Upload
        name="identityDocument"
        accept={DOCUMENT_ACCEPT}
        helperText="Government-issued driver's license or passport. JPG, PNG, or PDF up to 5 MB."
        onDelete={() => setValue('identityDocument', null, { shouldValidate: true })}
      />

      <Field.Upload
        name="proofOfAddress"
        accept={DOCUMENT_ACCEPT}
        helperText="Proof of address. JPG, PNG, or PDF up to 5 MB."
        onDelete={() => setValue('proofOfAddress', null, { shouldValidate: true })}
      />

      <Accordion
        disableGutters
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: '12px !important',
          '&:before': { display: 'none' },
        }}
      >
        <AccordionSummary expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}>
          <Typography variant="subtitle2">What types of proof of address are accepted?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {PROOF_OF_ADDRESS_HELP}
          </Typography>
        </AccordionDetails>
      </Accordion>
    </Stack>
  );
}

function ReviewRow({ label, value }) {
  return (
    <Stack direction="row" spacing={2} justifyContent="space-between">
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        {label}
      </Typography>
      <Typography variant="subtitle2" sx={{ textAlign: 'right' }}>
        {value || '—'}
      </Typography>
    </Stack>
  );
}

function ReviewStep({ values }) {
  const fullName = [values.firstName, values.lastName].filter(Boolean).join(' ');

  return (
    <Stack spacing={2.5}>
      <Typography variant="subtitle1">Review and submit</Typography>
      <Stack spacing={1.25}>
        <ReviewRow label="Store name" value={values.storeName} />
        <ReviewRow label="Legal name" value={fullName} />
        <ReviewRow label="Email" value={values.email} />
        <ReviewRow label="Phone" value={values.phone} />
        <ReviewRow
          label="Residential address"
          value={[values.residentialStreet, values.residentialCity, formatCountry(values.residentialCountry)]
            .filter(Boolean)
            .join(', ')}
        />
        <ReviewRow label="ID document" value={formatFileName(values.identityDocument)} />
        <ReviewRow label="Proof of address" value={formatFileName(values.proofOfAddress)} />
      </Stack>

      <Field.Checkbox
        name="termsAccepted"
        label={<Typography variant="body2">I agree to the Terms of Service and Privacy Policy.</Typography>}
      />
    </Stack>
  );
}

export function SellerSignUpView() {
  const router = useRouter();
  const dispatch = useDispatch();
  const passwordVisible = useBoolean();
  const confirmPasswordVisible = useBoolean();
  const [activeStep, setActiveStep] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');

  const methods = useForm({
    mode: 'onSubmit',
    resolver: zodResolver(SellerSignUpSchema),
    defaultValues: SELLER_SIGNUP_DEFAULTS,
  });

  const {
    watch,
    setError,
    getValues,
    clearErrors,
    getFieldState,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    const subscription = watch((formValues, { name }) => {
      const fieldsToCheck = name === 'password' ? ['password', 'confirmPassword'] : name ? [name] : [];

      fieldsToCheck.forEach((field) => {
        if (!getFieldState(field).error) return;

        const message = getFieldError(field, formValues);
        if (!message) {
          clearErrors(field);
          return;
        }

        setError(field, { type: 'manual', message });
      });
    });

    return () => subscription.unsubscribe();
  }, [watch, getFieldState, clearErrors, setError]);

  const applyStepErrors = useCallback(
    (errors) => {
      errors.forEach(({ field, message }, index) => {
        setError(field, { type: 'manual', message }, { shouldFocus: index === 0 });
      });
    },
    [setError]
  );

  const handleNext = useCallback(() => {
    const errors = getStepErrors(activeStep, getValues());

    if (errors.length) {
      applyStepErrors(errors);
      return;
    }

    setActiveStep((prev) => prev + 1);
  }, [activeStep, applyStepErrors, getValues]);

  const handleBack = useCallback(() => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  }, []);

  const handleStepClick = useCallback(
    (nextStep) => {
      if (nextStep === activeStep) return;

      if (nextStep < activeStep) {
        setActiveStep(nextStep);
        return;
      }

      const currentValues = getValues();

      for (let step = activeStep; step < nextStep; step += 1) {
        const errors = getStepErrors(step, currentValues);
        if (errors.length) {
          applyStepErrors(errors);
          if (step !== activeStep) setActiveStep(step);
          return;
        }
      }

      setActiveStep(nextStep);
    },
    [activeStep, applyStepErrors, getValues]
  );

  const onSubmit = handleSubmit(async (data) => {
    const errors = [0, 1, 2, 3].flatMap((step) => getStepErrors(step, data));
    if (errors.length) {
      applyStepErrors(errors);
      const firstInvalidStep = [0, 1, 2, 3].find((step) => getStepErrors(step, data).length);
      if (firstInvalidStep != null) setActiveStep(firstInvalidStep);
      return;
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 700));

      const profile = saveSellerProfile({
        ...data,
        applicantType: 'individual',
        createdAt: new Date().toISOString(),
        verificationStatus: 'pending',
      });

      if (SELLER_COMPANY?._id) {
        updateMockCompany(SELLER_COMPANY._id, {
          name: profile.storeName,
          description: profile.storeDescription || SELLER_COMPANY.description,
        });
      }

      dispatch(
        setUser({
          basicInfo: {
            _id: 'usr-002',
            profileIcon: 'https://dummybucket.s3.us-east-1.amazonaws.com/noimage.png',
            name: `${profile.firstName} ${profile.lastName}`.trim(),
            email: profile.email,
            phoneNumber: profile.phone,
            language: 'en',
          },
          accountState: {
            userType: 'seller',
            status: 'active',
            verificationStatus: {
              email: 'verified',
              phoneNumber: 'pending',
            },
          },
          metadata: {
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          token: 'mock-token',
          permission: PERMISSION_SELLER,
          sellerId: 'usr-002',
          companyId: SELLER_COMPANY?._id || 'co-001',
          sellerProfile: profile,
        })
      );

      toast.success('Seller application submitted. Your documents are pending review.');
      router.push(paths.dashboard.root);
    } catch (error) {
      console.error(error);
      setErrorMsg(error instanceof Error ? error.message : error);
    }
  });

  return (
    <>
      <Stack spacing={0.75} sx={{ mb: 3 }}>
        <Typography variant="h3" sx={{ lineHeight: 1.15 }}>
          Become a seller
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Already have an account?{' '}
          <Link component={RouterLink} href={paths.auth.sellerSignIn} underline="always" color="text.primary">
            Sign in
          </Link>
        </Typography>
      </Stack>

      <SellerSignupStepper steps={SIGNUP_STEPS} activeStep={activeStep} onStepClick={handleStepClick} />

      {!!errorMsg && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMsg}
        </Alert>
      )}

      <Form methods={methods} onSubmit={onSubmit}>
        <Box sx={{ mb: 3 }}>
          {activeStep === 0 && (
            <AccountStoreStep passwordVisible={passwordVisible} confirmPasswordVisible={confirmPasswordVisible} />
          )}
          {activeStep === 1 && <VerificationStep />}
          {activeStep === 2 && <DocumentsStep />}
          {activeStep === 3 && <ReviewStep values={values} />}
        </Box>

        <Stack direction="row" spacing={1.5}>
          {activeStep > 0 && (
            <Button color="inherit" onClick={handleBack} sx={{ minWidth: 96 }}>
              Back
            </Button>
          )}

          {activeStep < SIGNUP_STEPS.length - 1 ? (
            <Button fullWidth variant="contained" color="primary" size="large" onClick={handleNext} sx={{ height: 48, borderRadius: 999 }}>
              Continue
            </Button>
          ) : (
            <LoadingButton
              fullWidth
              type="submit"
              color="primary"
              size="large"
              variant="contained"
              loading={isSubmitting}
              sx={{ height: 48, borderRadius: 999 }}
            >
              Submit application
            </LoadingButton>
          )}
        </Stack>
      </Form>
    </>
  );
}
