import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { Field } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';
import { CompactDocumentField } from 'src/sections/_active/sellers-view/document-preview';

import { ID_TYPE_OPTIONS, PROOF_OF_ADDRESS_HELP } from './constants';
import { formatCountry, formatFileName } from './storage';

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

export function StoreStep() {
  return (
    <Stack spacing={2.5}>
      <Typography variant="subtitle1">Set up your store</Typography>
      <FieldsGrid>
        <Span>
          <Field.Text name="storeName" label="Store name" helperText="This is the name customers will see." />
        </Span>
        <Span>
          <Field.Phone name="phone" label="Phone number" />
        </Span>
        <Span>
          <Field.Text
            name="storeDescription"
            label="Store description"
            multiline
            rows={3}
            helperText="Optional. Max 500 characters."
          />
        </Span>
      </FieldsGrid>
    </Stack>
  );
}

export function VerificationStep() {
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

export function DocumentsStep() {
  return (
    <Stack spacing={2.5}>
      <Typography variant="subtitle1">Upload verification documents</Typography>

      <FieldsGrid>
        <CompactDocumentField
          name="identityDocument"
          label="Identity document"
          helperText="Passport or driver's license. JPG, PNG, or PDF up to 5 MB."
        />
        <CompactDocumentField
          name="proofOfAddress"
          label="Proof of address"
          helperText="JPG, PNG, or PDF up to 5 MB."
        />
      </FieldsGrid>

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

export function ReviewStep({ account, values }) {
  const fullName = [account?.firstName || values.firstName, account?.lastName || values.lastName]
    .filter(Boolean)
    .join(' ');

  return (
    <Stack spacing={2.5}>
      <Typography variant="subtitle1">Review and submit</Typography>
      <Stack spacing={1.25}>
        <ReviewRow label="Store name" value={values.storeName} />
        <ReviewRow label="Legal name" value={fullName} />
        <ReviewRow label="Email" value={account?.email || values.email} />
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
