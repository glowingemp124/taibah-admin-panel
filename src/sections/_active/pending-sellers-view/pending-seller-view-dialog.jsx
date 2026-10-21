import PropTypes from 'prop-types';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/label';
import { varAlpha } from 'src/theme/styles';
import { fDate, formatStr } from 'src/utils/format-time';
import { ID_TYPE_OPTIONS } from 'src/sections/auth/jwt/seller-signup/constants';
import { formatCountry } from 'src/sections/auth/jwt/seller-signup/storage';
import { DocumentTile } from 'src/sections/_active/sellers-view/document-preview';

function verificationColor(status) {
  if (status === 'verified') return 'success';
  if (status === 'rejected') return 'error';
  return 'warning';
}

function idTypeLabel(value) {
  return ID_TYPE_OPTIONS.find((option) => option.value === value)?.label || value || '—';
}

function Detail({ label, value }) {
  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ mt: 0.5, fontWeight: 600, wordBreak: 'break-word' }}>
        {value || '—'}
      </Typography>
    </Box>
  );
}

function Section({ title, children }) {
  return (
    <Box>
      <Typography variant="subtitle2" sx={{ mb: 2 }}>
        {title}
      </Typography>
      {children}
    </Box>
  );
}

function DetailsGrid({ children }) {
  return (
    <Box
      sx={{
        display: 'grid',
        gap: 2,
        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
      }}
    >
      {children}
    </Box>
  );
}

export function PendingSellerViewDialog({ application, open, onClose, onApprove, onReject }) {
  if (!application) return null;

  const fullName = [application.firstName, application.lastName].filter(Boolean).join(' ') || application.email;
  const status = application.verificationStatus || 'pending';
  const canReview = status === 'pending';
  const address = [
    application.residentialStreet,
    application.residentialCity,
    application.residentialState,
    application.residentialPostal,
    formatCountry(application.residentialCountry),
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={onClose} scroll="paper">
      <Box
        sx={{
          px: 3,
          py: 2.5,
          display: 'flex',
          alignItems: 'flex-start',
          gap: 2,
          bgcolor: (theme) => varAlpha(theme.vars.palette.grey['500Channel'], 0.08),
        }}
      >
        <Avatar
          sx={{
            width: 56,
            height: 56,
            fontWeight: 700,
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
          }}
        >
          {fullName?.charAt(0).toUpperCase()}
        </Avatar>

        <Stack spacing={0.75} sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="h6" noWrap>
            {fullName}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {application.email}
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Label variant="soft" color="info">
              {application.storeName || 'No store name'}
            </Label>
            <Label variant="soft" color={verificationColor(status)}>
              {status}
            </Label>
            {application.provider === 'google' && (
              <Label variant="soft" color="default">
                Google
              </Label>
            )}
          </Stack>
        </Stack>

        <IconButton onClick={onClose}>
          <Iconify icon="mingcute:close-line" />
        </IconButton>
      </Box>

      <DialogContent sx={{ px: 3, py: 3 }}>
        <Stack spacing={3} divider={<Divider flexItem />}>
          <Section title="Account">
            <DetailsGrid>
              <Detail label="Legal name" value={fullName} />
              <Detail label="Email" value={application.email} />
              <Detail label="Phone" value={application.phone} />
              <Detail
                label="Submitted"
                value={application.createdAt ? fDate(application.createdAt, formatStr.paramCase.date) : '—'}
              />
            </DetailsGrid>
          </Section>

          <Section title="Store">
            <DetailsGrid>
              <Detail label="Store name" value={application.storeName} />
              <Box sx={{ gridColumn: { sm: '1 / -1' } }}>
                <Detail label="Store description" value={application.storeDescription} />
              </Box>
            </DetailsGrid>
          </Section>

          <Section title="Identity verification">
            <DetailsGrid>
              <Detail
                label="Date of birth"
                value={application.dateOfBirth ? fDate(application.dateOfBirth, formatStr.paramCase.date) : '—'}
              />
              <Detail label="Place of birth" value={application.placeOfBirth} />
              <Detail label="ID type" value={idTypeLabel(application.idType)} />
              <Detail label="ID number" value={application.idNumber} />
              <Detail
                label="ID expiration"
                value={application.idExpiry ? fDate(application.idExpiry, formatStr.paramCase.date) : '—'}
              />
              <Box sx={{ gridColumn: { sm: '1 / -1' } }}>
                <Detail label="Residential address" value={address} />
              </Box>
            </DetailsGrid>
          </Section>

          <Section title="Documents">
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              <DocumentTile label="Identity document" file={application.identityDocument} />
              <DocumentTile label="Proof of address" file={application.proofOfAddress} />
            </Stack>
          </Section>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button variant="outlined" color="primary" onClick={onClose}>
          Close
        </Button>
        {canReview && (
          <>
            <Button variant="outlined" color="primary" onClick={onReject}>
              Reject
            </Button>
            <Button variant="contained" color="primary" onClick={onApprove}>
              Approve
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}

PendingSellerViewDialog.propTypes = {
  application: PropTypes.object,
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onApprove: PropTypes.func,
  onReject: PropTypes.func,
};

Section.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
};

Detail.propTypes = {
  label: PropTypes.string,
  value: PropTypes.node,
};

DetailsGrid.propTypes = {
  children: PropTypes.node,
};
