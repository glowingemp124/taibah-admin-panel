import PropTypes from 'prop-types';
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useFormContext } from 'react-hook-form';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';
import { varAlpha } from 'src/theme/styles';
import { DOCUMENT_ACCEPT } from 'src/sections/auth/jwt/seller-signup/constants';
import { formatFileName } from 'src/sections/auth/jwt/seller-signup/storage';

function isImagePath(value = '') {
  return /\.(png|jpe?g|gif|webp|svg|bmp)$/i.test(String(value).split('?')[0]);
}

export function getDocumentMeta(file) {
  if (!file) return null;

  if (typeof file === 'string') {
    return { name: file.split('/').pop() || file, preview: file, isImage: isImagePath(file) };
  }

  const name = file.name || 'Document';
  const preview =
    file.preview ||
    (typeof File !== 'undefined' && file instanceof Blob ? URL.createObjectURL(file) : '');
  const type = file.type || '';
  const isImage = type.startsWith('image/') || isImagePath(name) || isImagePath(preview);

  return { name, preview, isImage };
}

export function DocumentViewer({ open, onClose, file }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', pr: 1.5 }}>
        <Box component="span" sx={{ flex: 1, pr: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {file?.name || 'Document'}
        </Box>
        <IconButton onClick={onClose}>
          <Iconify icon="mingcute:close-line" />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ minHeight: 280 }}>
        {file?.isImage && file?.preview ? (
          <Box
            component="img"
            alt={file.name}
            src={file.preview}
            sx={{
              display: 'block',
              mx: 'auto',
              maxWidth: 1,
              maxHeight: '70vh',
              borderRadius: 1,
              objectFit: 'contain',
            }}
          />
        ) : file?.preview ? (
          <Box
            component="iframe"
            title={file.name}
            src={file.preview}
            sx={{ width: 1, height: '70vh', border: 0, borderRadius: 1, bgcolor: 'background.paper' }}
          />
        ) : (
          <Stack alignItems="center" justifyContent="center" spacing={1} sx={{ py: 8 }}>
            <Iconify icon="solar:file-text-bold" width={48} sx={{ color: 'text.disabled' }} />
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Preview is not available for this file.
            </Typography>
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function DocumentTile({ label, file }) {
  const [open, setOpen] = useState(false);
  const meta = getDocumentMeta(file);
  const fileName = formatFileName(file);

  return (
    <>
      <Box
        onClick={() => meta && setOpen(true)}
        sx={{
          p: 1.5,
          minWidth: 0,
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          borderRadius: 1.5,
          cursor: meta ? 'pointer' : 'default',
          color: 'text.primary',
          bgcolor: (theme) => varAlpha(theme.vars.palette.grey['500Channel'], 0.08),
          border: (theme) => `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.16)}`,
          '&:hover': meta
            ? { bgcolor: (theme) => varAlpha(theme.vars.palette.grey['500Channel'], 0.16) }
            : undefined,
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            borderRadius: 1,
            color: 'text.secondary',
            bgcolor: (theme) => varAlpha(theme.vars.palette.grey['500Channel'], 0.12),
          }}
        >
          {meta?.isImage && meta?.preview ? (
            <Box component="img" alt={fileName} src={meta.preview} sx={{ width: 1, height: 1, objectFit: 'cover' }} />
          ) : (
            <Iconify icon="solar:file-text-bold" width={22} />
          )}
        </Box>

        <Box sx={{ minWidth: 0 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
            {label}
          </Typography>
          <Typography variant="subtitle2" noWrap>
            {fileName}
          </Typography>
        </Box>
      </Box>

      <DocumentViewer open={open} onClose={() => setOpen(false)} file={meta} />
    </>
  );
}

DocumentViewer.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  file: PropTypes.object,
};

DocumentTile.propTypes = {
  label: PropTypes.string,
  file: PropTypes.any,
};

export function CompactDocumentField({ name, label, helperText, accept = DOCUMENT_ACCEPT }) {
  const { setValue, watch } = useFormContext();
  const file = watch(name);
  const meta = getDocumentMeta(file);
  const [viewerOpen, setViewerOpen] = useState(false);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: false,
    accept,
    onDrop: (acceptedFiles) => {
      const nextFile = acceptedFiles[0];
      if (nextFile) {
        setValue(name, nextFile, { shouldValidate: true });
      }
    },
  });

  return (
    <Stack spacing={1}>
      <Typography variant="subtitle2">{label}</Typography>

      <Stack direction="row" spacing={2} alignItems="center">
        {meta ? (
          <Box
            onClick={() => setViewerOpen(true)}
            sx={{
              width: 72,
              height: 72,
              flexShrink: 0,
              borderRadius: 1.5,
              overflow: 'hidden',
              cursor: 'pointer',
              border: (theme) => `solid 1px ${theme.vars.palette.divider}`,
              bgcolor: (theme) => varAlpha(theme.vars.palette.grey['500Channel'], 0.08),
            }}
          >
            {meta.isImage && meta.preview ? (
              <Box
                component="img"
                alt={meta.name}
                src={meta.preview}
                sx={{ width: 1, height: 1, objectFit: 'cover' }}
              />
            ) : (
              <Stack alignItems="center" justifyContent="center" sx={{ width: 1, height: 1 }}>
                <Iconify icon="solar:file-text-bold" width={28} sx={{ color: 'text.secondary' }} />
              </Stack>
            )}
          </Box>
        ) : (
          <Box
            {...getRootProps()}
            sx={{
              width: 72,
              height: 72,
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 1.5,
              cursor: 'pointer',
              color: 'text.disabled',
              bgcolor: (theme) => varAlpha(theme.vars.palette.grey['500Channel'], 0.08),
              border: (theme) => `dashed 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.24)}`,
              ...(isDragActive && { opacity: 0.72 }),
            }}
          >
            <input {...getInputProps()} />
            <Iconify icon="eva:cloud-upload-fill" width={26} />
          </Box>
        )}

        <Stack spacing={0.5} sx={{ minWidth: 0, flex: 1 }}>
          <Typography variant="body2" noWrap>
            {meta?.name || 'No file uploaded'}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {helperText}
          </Typography>
          <Stack direction="row" spacing={1} sx={{ pt: 0.5 }}>
            <Button size="small" variant="outlined" color="primary" {...getRootProps()}>
              <input {...getInputProps()} />
              {meta ? 'Replace' : 'Upload'}
            </Button>
            {meta && (
              <Button size="small" color="primary" onClick={() => setValue(name, null, { shouldValidate: true })}>
                Remove
              </Button>
            )}
          </Stack>
        </Stack>
      </Stack>

      <DocumentViewer open={viewerOpen} onClose={() => setViewerOpen(false)} file={meta} />
    </Stack>
  );
}

CompactDocumentField.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  helperText: PropTypes.string,
  accept: PropTypes.object,
};
