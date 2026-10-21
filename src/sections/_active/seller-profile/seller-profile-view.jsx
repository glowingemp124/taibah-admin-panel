import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { z as zod } from 'zod';

import LoadingButton from '@mui/lab/LoadingButton';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';

import { paths } from 'src/routes/paths';

import { useMockedUser } from 'src/auth/hooks';
import { useTabs } from 'src/hooks/use-tabs';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { Field, Form } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';

import { fData } from 'src/utils/format-number';

import { AccountChangePassword } from 'src/sections/account/account-change-password';
import { DOCUMENT_ACCEPT, ID_TYPE_OPTIONS, PROOF_OF_ADDRESS_HELP } from 'src/sections/auth/jwt/seller-signup/constants';
import { getDefaultSellerProfile, saveSellerProfile } from 'src/sections/auth/jwt/seller-signup/storage';
import { MOCK_COMPANIES, updateMockCompany } from 'src/sections/_active/products-view/mock';
import { setUser } from 'src/store/slices/userSlice';

const MAX_IMAGE_SIZE = 3145728;

const ProfileSchema = zod.object({
  photoURL: zod.any().nullable().optional(),
  firstName: zod.string().min(1, { message: 'First name is required!' }),
  lastName: zod.string().min(1, { message: 'Last name is required!' }),
  email: zod.string().email(),
  phone: zod.string().min(1, { message: 'Phone number is required!' }),
  dateOfBirth: zod.any().nullable(),
  placeOfBirth: zod.string().optional().or(zod.literal('')),
  residentialStreet: zod.string().optional().or(zod.literal('')),
  residentialCity: zod.string().optional().or(zod.literal('')),
  residentialState: zod.string().optional().or(zod.literal('')),
  residentialPostal: zod.string().optional().or(zod.literal('')),
  residentialCountry: zod.any().nullable(),
  idType: zod.string().optional().or(zod.literal('')),
  idNumber: zod.string().optional().or(zod.literal('')),
  idExpiry: zod.any().nullable(),
  identityDocument: zod.any().nullable(),
  proofOfAddress: zod.any().nullable(),
  storeImage: zod.any().nullable().optional(),
  storeName: zod.string().min(1, { message: 'Store name is required!' }),
  storeDescription: zod.string().optional().or(zod.literal('')),
});

const TABS = [
  { value: 'general', label: 'General', icon: <Iconify icon="solar:user-id-bold" width={24} /> },
  { value: 'store', label: 'Store', icon: <Iconify icon="solar:shop-bold" width={24} /> },
  { value: 'password', label: 'Change Password', icon: <Iconify icon="ic:round-vpn-key" width={24} /> },
];

const PROFILE_TAB_VALUES = TABS.map((tab) => tab.value);

function getProfileTab(searchParams) {
  const tab = searchParams.get('tab');
  return PROFILE_TAB_VALUES.includes(tab) ? tab : 'general';
}

function FieldsGrid({ children }) {
  return (
    <Box
      rowGap={3}
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

function toImageValue(value, fallback = null) {
  if (!value) return fallback;
  if (typeof value === 'string') return value;
  if (value instanceof File) return value;
  return value.preview || fallback;
}

function toImageSrc(value, fallback) {
  if (!value) return fallback;
  if (typeof value === 'string') return value;
  if (value instanceof File) return URL.createObjectURL(value);
  return value.preview || fallback;
}

export function SellerProfileView() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabs = useTabs(getProfileTab(searchParams));
  const { user } = useMockedUser();
  const dispatch = useDispatch();

  const storedProfile = user?.sellerProfile || getDefaultSellerProfile();
  const company = MOCK_COMPANIES.find((row) => row._id === user?.companyId) || MOCK_COMPANIES[0];

  const defaultValues = useMemo(
    () => ({
      photoURL: toImageValue(storedProfile.photoURL, user?.basicInfo?.profileIcon || null),
      firstName: storedProfile.firstName || user?.basicInfo?.name?.split(' ')[0] || '',
      lastName: storedProfile.lastName || user?.basicInfo?.name?.split(' ').slice(1).join(' ') || '',
      email: storedProfile.email || user?.basicInfo?.email || '',
      phone: storedProfile.phone || user?.basicInfo?.phoneNumber || '',
      dateOfBirth: storedProfile.dateOfBirth || null,
      placeOfBirth: storedProfile.placeOfBirth || '',
      residentialStreet: storedProfile.residentialStreet || '',
      residentialCity: storedProfile.residentialCity || '',
      residentialState: storedProfile.residentialState || '',
      residentialPostal: storedProfile.residentialPostal || '',
      residentialCountry: storedProfile.residentialCountry || null,
      idType: storedProfile.idType || '',
      idNumber: storedProfile.idNumber || '',
      idExpiry: storedProfile.idExpiry || null,
      identityDocument: storedProfile.identityDocument || null,
      proofOfAddress: storedProfile.proofOfAddress || null,
      storeImage: toImageValue(storedProfile.storeImage, company?.logo || null),
      storeName: storedProfile.storeName || company?.name || '',
      storeDescription: storedProfile.storeDescription || company?.description || '',
    }),
    [storedProfile, user, company]
  );

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(ProfileSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const verificationStatus = storedProfile.verificationStatus || 'pending';
  const tabFromUrl = searchParams.get('tab');

  useEffect(() => {
    const nextTab = getProfileTab(searchParams);
    if (tabs.value !== nextTab) {
      tabs.setValue(nextTab);
    }
  }, [tabFromUrl, searchParams, tabs]);

  const handleTabChange = (event, newValue) => {
    tabs.setValue(newValue);
    setSearchParams(newValue === 'general' ? {} : { tab: newValue }, { replace: true });
  };

  const onSubmit = handleSubmit(async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 400));

    const profile = saveSellerProfile({
      ...storedProfile,
      ...data,
    });

    if (company) {
      updateMockCompany(company._id, {
        name: profile.storeName,
        description: profile.storeDescription || company.description,
        logo: toImageSrc(profile.storeImage, company.logo),
      });
    }

    dispatch(
      setUser({
        ...user,
        basicInfo: {
          ...user?.basicInfo,
          name: `${profile.firstName} ${profile.lastName}`.trim(),
          email: profile.email,
          phoneNumber: profile.phone,
          profileIcon: toImageSrc(profile.photoURL, user?.basicInfo?.profileIcon),
        },
        sellerProfile: profile,
      })
    );

    toast.success('Profile updated!');
  });

  const imageHelper = (
    <Typography
      variant="caption"
      sx={{
        mt: 3,
        mx: 'auto',
        display: 'block',
        textAlign: 'center',
        color: 'text.disabled',
      }}
    >
      Allowed *.jpeg, *.jpg, *.png, *.gif
      <br /> max size of {fData(MAX_IMAGE_SIZE)}
    </Typography>
  );

  return (
    <Box sx={{ px: { xs: 2, md: 5 }, pb: 5, pt: 3 }}>
      <CustomBreadcrumbs
        heading="Profile"
        links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'Profile' }]}
        sx={{ mb: { xs: 3, md: 5 } }}
        action={
          <Label color={verificationStatus === 'verified' ? 'success' : 'warning'} variant="filled">
            {verificationStatus === 'verified' ? 'Verified' : 'Pending review'}
          </Label>
        }
      />

      <Tabs value={tabs.value} onChange={handleTabChange} sx={{ mb: { xs: 3, md: 5 } }}>
        {TABS.map((tab) => (
          <Tab key={tab.value} label={tab.label} icon={tab.icon} value={tab.value} />
        ))}
      </Tabs>

      {tabs.value === 'password' && <AccountChangePassword />}

      {tabs.value !== 'password' && (
        <Form methods={methods} onSubmit={onSubmit}>
          {tabs.value === 'general' && (
            <Stack spacing={3}>
              <Grid container spacing={3}>
                <Grid xs={12} md={4}>
                  <Card sx={{ pt: 5, pb: 5, px: 3, textAlign: 'center' }}>
                    <Field.UploadAvatar name="photoURL" maxSize={MAX_IMAGE_SIZE} helperText={imageHelper} />
                  </Card>
                </Grid>

                <Grid xs={12} md={8}>
                  <Card sx={{ p: { xs: 2.5, md: 3 } }}>
                    <Stack spacing={3}>
                      <Typography variant="h6">Personal details</Typography>
                      <FieldsGrid>
                        <Field.Text name="firstName" label="First name" />
                        <Field.Text name="lastName" label="Last name" />
                        <Field.Text name="email" label="Email address" disabled />
                        <Field.Phone name="phone" label="Phone number" />
                      </FieldsGrid>
                    </Stack>
                  </Card>
                </Grid>
              </Grid>

              <Card sx={{ p: { xs: 2.5, md: 3 } }}>
                <Stack spacing={3}>
                  <Typography variant="h6">Identity verification</Typography>

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

                  <Divider />

                  <Typography variant="h6">Documents</Typography>
                  <Grid container spacing={2}>
                    <Grid xs={12} md={6}>
                      <Field.Upload name="identityDocument" accept={DOCUMENT_ACCEPT} helperText="Passport or driver's license" />
                    </Grid>
                    <Grid xs={12} md={6}>
                      <Field.Upload name="proofOfAddress" accept={DOCUMENT_ACCEPT} helperText="Proof of address" />
                    </Grid>
                  </Grid>

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
              </Card>

              <Stack direction="row" justifyContent="flex-end">
                <LoadingButton type="submit" variant="contained" color="primary" loading={isSubmitting}>
                  Save changes
                </LoadingButton>
              </Stack>
            </Stack>
          )}

          {tabs.value === 'store' && (
            <Grid container spacing={3}>
              <Grid xs={12} md={4}>
                <Card sx={{ pt: 5, pb: 5, px: 3, textAlign: 'center' }}>
                  <Field.UploadAvatar name="storeImage" maxSize={MAX_IMAGE_SIZE} helperText={imageHelper} />
                  <Typography variant="subtitle2" sx={{ mt: 2 }}>
                    Store image
                  </Typography>
                </Card>
              </Grid>

              <Grid xs={12} md={8}>
                <Card sx={{ p: { xs: 2.5, md: 3 } }}>
                  <Stack spacing={3}>
                    <Typography variant="h6">Store details</Typography>
                    <Field.Text name="storeName" label="Store name" />
                    <Field.Text name="storeDescription" label="Store description" multiline rows={4} />
                    <Stack direction="row" justifyContent="flex-end">
                      <LoadingButton type="submit" variant="contained" color="primary" loading={isSubmitting}>
                        Save changes
                      </LoadingButton>
                    </Stack>
                  </Stack>
                </Card>
              </Grid>
            </Grid>
          )}
        </Form>
      )}
    </Box>
  );
}
