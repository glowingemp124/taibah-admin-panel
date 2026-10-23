import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';

import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/label';
import { varAlpha } from 'src/theme/styles';
import { fDate, formatStr } from 'src/utils/format-time';
import { ID_TYPE_OPTIONS } from 'src/sections/auth/jwt/seller-signup/constants';
import { formatCountry } from 'src/sections/auth/jwt/seller-signup/storage';

import { DocumentTile } from './document-preview';
import { isApprovedStatus } from 'src/utils/seller-status';

function InfoItem({ label, value }) {
  return (
    <Box
      sx={{
        p: 1.75,
        height: 1,
        minHeight: 76,
        borderRadius: 1.5,
        bgcolor: (theme) => varAlpha(theme.vars.palette.grey['500Channel'], 0.08),
      }}
    >
      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
        {label}
      </Typography>
      <Typography variant="subtitle2" sx={{ mt: 0.5, wordBreak: 'break-word' }}>
        {value || '—'}
      </Typography>
    </Box>
  );
}

function Section({ title, action, children }) {
  return (
    <Card
      sx={{
        p: { xs: 2.5, md: 3 },
        boxShadow: (theme) => theme.customShadows.z8,
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2.5 }}>
        <Stack direction="row" spacing={1.25} alignItems="center">
          <Box
            sx={{
              width: 8,
              height: 24,
              borderRadius: 0.75,
              bgcolor: 'primary.main',
            }}
          />
          <Typography variant="h6">{title}</Typography>
        </Stack>
        {action}
      </Stack>
      {children}
    </Card>
  );
}

function idTypeLabel(value) {
  return ID_TYPE_OPTIONS.find((option) => option.value === value)?.label || value || '—';
}

function verificationColor(status) {
  if (isApprovedStatus(status)) return 'success';
  if (status === 'rejected') return 'error';
  return 'warning';
}

export function SellerProfileOverview({ profile, onEdit, hideEdit = false }) {
  if (!profile) return null;

  const fullName = [profile.firstName, profile.lastName].filter(Boolean).join(' ');
  const address = [profile.residentialStreet, profile.residentialCity, profile.residentialState, profile.residentialPostal, formatCountry(profile.residentialCountry)]
    .filter(Boolean)
    .join(', ');

  return (
    <Stack spacing={3}>
      <Section
        title="Seller overview"
        action={
          !hideEdit && onEdit ? (
            <Button variant="contained" color="primary" startIcon={<Iconify icon="solar:pen-bold" />} onClick={onEdit}>
              Edit details
            </Button>
          ) : null
        }
      >
        <Grid container spacing={2.5}>
          <Grid xs={12} sm={6} md={3}>
            <InfoItem label="Legal name" value={fullName} />
          </Grid>
          <Grid xs={12} sm={6} md={3}>
            <InfoItem label="Email" value={profile.email} />
          </Grid>
          <Grid xs={12} sm={6} md={3}>
            <InfoItem label="Phone" value={profile.phone} />
          </Grid>
          <Grid xs={12} sm={6} md={3}>
            <Box
              sx={{
                p: 1.75,
                height: 1,
                minHeight: 76,
                borderRadius: 1.5,
                bgcolor: (theme) => varAlpha(theme.vars.palette.grey['500Channel'], 0.08),
              }}
            >
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                Account / verification
              </Typography>
              <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap sx={{ mt: 0.75 }}>
                <Label variant="soft" color={profile.status === 'active' ? 'success' : 'error'}>
                  {profile.status || '—'}
                </Label>
                <Label variant="soft" color={verificationColor(profile.verificationStatus)}>
                  {profile.verificationStatus || 'pending'}
                </Label>
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </Section>

      <Section title="Store">
        <Grid container spacing={2.5}>
          <Grid xs={12} md={4}>
            <InfoItem label="Store name" value={profile.storeName} />
          </Grid>
          <Grid xs={12} md={8}>
            <InfoItem label="Store description" value={profile.storeDescription} />
          </Grid>
        </Grid>
      </Section>

      <Section title="Identity verification">
        <Grid container spacing={2.5}>
          <Grid xs={12} sm={6} md={3}>
            <InfoItem label="Date of birth" value={profile.dateOfBirth ? fDate(profile.dateOfBirth, formatStr.paramCase.date) : '—'} />
          </Grid>
          <Grid xs={12} sm={6} md={3}>
            <InfoItem label="Place of birth" value={profile.placeOfBirth} />
          </Grid>
          <Grid xs={12} sm={6} md={3}>
            <InfoItem label="ID type" value={idTypeLabel(profile.idType)} />
          </Grid>
          <Grid xs={12} sm={6} md={3}>
            <InfoItem label="ID number" value={profile.idNumber} />
          </Grid>
          <Grid xs={12} sm={6} md={3}>
            <InfoItem label="ID expiration" value={profile.idExpiry ? fDate(profile.idExpiry, formatStr.paramCase.date) : '—'} />
          </Grid>
          <Grid xs={12} md={9}>
            <InfoItem label="Residential address" value={address} />
          </Grid>
        </Grid>

        <Divider sx={{ my: 2.5 }} />

        <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
          Documents
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
          <DocumentTile label="Identity document" file={profile.identityDocument} />
          <DocumentTile label="Proof of address" file={profile.proofOfAddress} />
        </Stack>
      </Section>
    </Stack>
  );
}

SellerProfileOverview.propTypes = {
  profile: PropTypes.object,
  onEdit: PropTypes.func,
  hideEdit: PropTypes.bool,
};

InfoItem.propTypes = {
  label: PropTypes.string,
  value: PropTypes.node,
};

Section.propTypes = {
  title: PropTypes.string,
  action: PropTypes.node,
  children: PropTypes.node,
};
