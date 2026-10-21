import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';

import LoadingButton from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

import { Form } from 'src/components/hook-form';
import { toast } from 'src/components/snackbar';

import { MOCK_COMPANIES, updateMockCompany } from 'src/sections/_active/products-view/mock';
import { setUser } from 'src/store/slices/userSlice';

import { buildSellerAuthUser } from './complete-session';
import { ONBOARDING_STEPS } from './constants';
import { getFieldError, getStepErrors, SELLER_SIGNUP_DEFAULTS, SellerSignUpSchema } from './schema';
import { clearSignupSession, getSignupSession, patchSignupSession } from './signup-session';
import { saveSellerProfile } from './storage';
import { SellerSignupStepper } from './stepper';
import { DocumentsStep, ReviewStep, StoreStep, VerificationStep } from './steps';

const SELLER_COMPANY = MOCK_COMPANIES.find((row) => row.seller?._id === 'usr-002');

export function SellerOnboardingView() {
  const router = useRouter();
  const dispatch = useDispatch();
  const session = getSignupSession();
  const [activeStep, setActiveStep] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');

  const defaultValues = useMemo(
    () => ({
      ...SELLER_SIGNUP_DEFAULTS,
      firstName: session?.firstName || '',
      lastName: session?.lastName || '',
      email: session?.email || '',
      password: session?.password || 'GoogleAuth@1',
      confirmPassword: session?.password || 'GoogleAuth@1',
      ...(session?.onboarding || {}),
    }),
    [session]
  );

  const methods = useForm({
    mode: 'onSubmit',
    resolver: zodResolver(SellerSignUpSchema),
    defaultValues,
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
      const fieldsToCheck = name ? [name] : [];

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

  const persistDraft = useCallback(() => {
    const current = getValues();
    patchSignupSession({
      onboarding: {
        phone: current.phone,
        storeName: current.storeName,
        storeDescription: current.storeDescription,
        dateOfBirth: current.dateOfBirth,
        placeOfBirth: current.placeOfBirth,
        residentialStreet: current.residentialStreet,
        residentialCity: current.residentialCity,
        residentialState: current.residentialState,
        residentialPostal: current.residentialPostal,
        residentialCountry: current.residentialCountry,
        idType: current.idType,
        idNumber: current.idNumber,
        idExpiry: current.idExpiry,
        termsAccepted: current.termsAccepted,
      },
    });
  }, [getValues]);

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
    persistDraft();
    setActiveStep((prev) => prev + 1);
  }, [activeStep, applyStepErrors, getValues, persistDraft]);

  const handleBack = useCallback(() => {
    persistDraft();
    setActiveStep((prev) => Math.max(prev - 1, 0));
  }, [persistDraft]);

  const handleStepClick = useCallback(
    (nextStep) => {
      if (nextStep === activeStep) return;

      if (nextStep < activeStep) {
        persistDraft();
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

      persistDraft();
      setActiveStep(nextStep);
    },
    [activeStep, applyStepErrors, getValues, persistDraft]
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
        firstName: session.firstName,
        lastName: session.lastName,
        email: session.email,
        password: session.provider === 'google' ? null : session.password,
        provider: session.provider,
        applicantType: 'individual',
        createdAt: session.createdAt || new Date().toISOString(),
        verificationStatus: 'pending',
        onboardingComplete: true,
      });

      if (SELLER_COMPANY?._id) {
        updateMockCompany(SELLER_COMPANY._id, {
          name: profile.storeName,
          description: profile.storeDescription || SELLER_COMPANY.description,
        });
      }

      clearSignupSession();
      dispatch(setUser(buildSellerAuthUser(profile)));
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
          Complete your store
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {session?.firstName ? `Welcome, ${session.firstName}. ` : ''}
          Finish these steps so customers can find your store.
        </Typography>
      </Stack>

      <SellerSignupStepper steps={ONBOARDING_STEPS} activeStep={activeStep} onStepClick={handleStepClick} />

      {!!errorMsg && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMsg}
        </Alert>
      )}

      <Form methods={methods} onSubmit={onSubmit}>
        <Box sx={{ mb: 3 }}>
          {activeStep === 0 && <StoreStep />}
          {activeStep === 1 && <VerificationStep />}
          {activeStep === 2 && <DocumentsStep />}
          {activeStep === 3 && <ReviewStep account={session} values={values} />}
        </Box>

        <Stack direction="row" spacing={1.5}>
          {activeStep > 0 && (
            <Button color="inherit" onClick={handleBack} sx={{ minWidth: 96 }}>
              Back
            </Button>
          )}

          {activeStep < ONBOARDING_STEPS.length - 1 ? (
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
