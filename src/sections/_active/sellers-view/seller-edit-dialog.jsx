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
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { Field, Form } from 'src/components/hook-form';
import { toast } from 'src/components/snackbar';

import { CompactDocumentField } from './document-preview';

import { ID_TYPE_OPTIONS } from 'src/sections/auth/jwt/seller-signup/constants';
import { saveSellerProfile } from 'src/sections/auth/jwt/seller-signup/storage';
import { MOCK_COMPANIES, updateMockCompany } from 'src/sections/_active/products-view/mock';
import { updateMockUser } from 'src/sections/_active/users-view/mock';

const VERIFICATION_OPTIONS = [
  { value: 'pending', label: 'Pending review' },
  { value: 'verified', label: 'Verified' },
  { value: 'rejected', label: 'Rejected' },
];

const SellerEditSchema = zod.object({
  status: zod.enum(['active', 'inactive']),
  verificationStatus: zod.enum(['pending', 'verified', 'rejected']),
  firstName: zod.string().min(1, { message: 'First name is required!' }),
  lastName: zod.string().min(1, { message: 'Last name is required!' }),
  email: zod.string().email(),
  phone: zod.string().min(1, { message: 'Phone number is required!' }),
  storeName: zod.string().min(1, { message: 'Store name is required!' }),
  storeDescription: zod.string().optional().or(zod.literal('')),
  dateOfBirth: zod.any().nullable().optional(),
  placeOfBirth: zod.string().optional().or(zod.literal('')),
  residentialStreet: zod.string().optional().or(zod.literal('')),
  residentialCity: zod.string().optional().or(zod.literal('')),
  residentialState: zod.string().optional().or(zod.literal('')),
  residentialPostal: zod.string().optional().or(zod.literal('')),
  residentialCountry: zod.any().nullable().optional(),
  idType: zod.string().optional().or(zod.literal('')),
  idNumber: zod.string().optional().or(zod.literal('')),
  idExpiry: zod.any().nullable().optional(),
  identityDocument: zod.any().nullable().optional(),
  proofOfAddress: zod.any().nullable().optional(),
});

function FieldsGrid({ children }) {
  return (
    <Stack
      sx={{
        display: 'grid',
        gap: 2.5,
        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
      }}
    >
      {children}
    </Stack>
  );
}

function DocumentUploads() {
  return (
    <FieldsGrid>
      <CompactDocumentField name="identityDocument" label="Identity document" helperText="Passport or driver's license" />
      <CompactDocumentField name="proofOfAddress" label="Proof of address" helperText="Proof of address" />
    </FieldsGrid>
  );
}

export function SellerEditDialog({ user, profile, open, onClose, onSuccess }) {
  const defaultValues = useMemo(
    () => ({
      status: user?.status || 'active',
      verificationStatus: profile?.verificationStatus || 'pending',
      firstName: profile?.firstName || '',
      lastName: profile?.lastName || '',
      email: profile?.email || user?.email || '',
      phone: profile?.phone || user?.phone || '',
      storeName: profile?.storeName || '',
      storeDescription: profile?.storeDescription || '',
      dateOfBirth: profile?.dateOfBirth || null,
      placeOfBirth: profile?.placeOfBirth || '',
      residentialStreet: profile?.residentialStreet || '',
      residentialCity: profile?.residentialCity || '',
      residentialState: profile?.residentialState || '',
      residentialPostal: profile?.residentialPostal || '',
      residentialCountry: profile?.residentialCountry || null,
      idType: profile?.idType || '',
      idNumber: profile?.idNumber || '',
      idExpiry: profile?.idExpiry || null,
      identityDocument: profile?.identityDocument || null,
      proofOfAddress: profile?.proofOfAddress || null,
    }),
    [profile, user]
  );

  const methods = useForm({
    mode: 'onSubmit',
    resolver: zodResolver(SellerEditSchema),
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
    await new Promise((resolve) => setTimeout(resolve, 400));

    const nextProfile = saveSellerProfile({
      ...profile,
      ...data,
      userId: user._id,
      email: user.email,
    });

    updateMockUser(user._id, {
      name: `${data.firstName} ${data.lastName}`.trim(),
      phone: data.phone,
      status: data.status,
    });

    const company = MOCK_COMPANIES.find((row) => row.seller?._id === user._id);
    if (company) {
      updateMockCompany(company._id, {
        name: data.storeName,
        description: data.storeDescription || company.description,
      });
    }

    toast.success('Seller details updated!');
    onSuccess?.(nextProfile);
    onClose();
  });

  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={onClose} scroll="paper">
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogTitle>Edit seller details</DialogTitle>

        <DialogContent dividers sx={{ pt: 2.5 }}>
          <Stack spacing={3}>
            <Stack spacing={1.5}>
              <Typography variant="subtitle1">Account</Typography>
              <FieldsGrid>
                <Field.Select name="status" label="Account status">
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Field.Select>
                <Field.Select name="verificationStatus" label="Verification status">
                  {VERIFICATION_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Field.Select>
                <Field.Text name="firstName" label="First name" />
                <Field.Text name="lastName" label="Last name" />
                <Field.Text name="email" label="Email address" disabled />
                <Field.Phone name="phone" label="Phone number" />
              </FieldsGrid>
            </Stack>

            <Stack spacing={1.5}>
              <Typography variant="subtitle1">Store</Typography>
              <Field.Text name="storeName" label="Store name" />
              <Field.Text name="storeDescription" label="Store description" multiline rows={3} />
            </Stack>

            <Stack spacing={1.5}>
              <Typography variant="subtitle1">Identity verification</Typography>
              <FieldsGrid>
                <Field.DatePicker name="dateOfBirth" label="Date of birth" disableFuture />
                <Field.Text name="placeOfBirth" label="Place of birth" />
                <BoxFull>
                  <Field.Text name="residentialStreet" label="Residential address" />
                </BoxFull>
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
                <Field.DatePicker name="idExpiry" label="ID expiration date" disablePast />
              </FieldsGrid>
            </Stack>

            <Stack spacing={1.5}>
              <Typography variant="subtitle1">Documents</Typography>
              <DocumentUploads />
            </Stack>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" color="primary" onClick={onClose}>
            Cancel
          </Button>
          <LoadingButton type="submit" variant="contained" color="primary" loading={isSubmitting}>
            Save changes
          </LoadingButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
}

function BoxFull({ children }) {
  return <Stack sx={{ gridColumn: { sm: '1 / -1' } }}>{children}</Stack>;
}

BoxFull.propTypes = {
  children: PropTypes.node,
};

SellerEditDialog.propTypes = {
  user: PropTypes.object,
  profile: PropTypes.object,
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onSuccess: PropTypes.func,
};
