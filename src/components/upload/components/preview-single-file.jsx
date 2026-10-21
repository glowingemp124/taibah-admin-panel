import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';

import { varAlpha } from 'src/theme/styles';

import { Iconify } from '../../iconify';

// ----------------------------------------------------------------------

export function SingleFilePreview({ file }) {
  if (!file) return null;

  const fileName = typeof file === 'string' ? file : file.name || 'Document';
  const previewUrl =
    typeof file === 'string'
      ? file
      : file.preview || (typeof File !== 'undefined' && file instanceof Blob ? URL.createObjectURL(file) : '');

  return (
    <Box
      sx={{
        p: 1,
        top: 0,
        left: 0,
        width: 1,
        height: 1,
        position: 'absolute',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {previewUrl ? (
        <Box
          component="img"
          alt={fileName}
          src={previewUrl}
          sx={{
            width: 1,
            height: 1,
            borderRadius: 1,
            objectFit: 'cover',
          }}
        />
      ) : (
        <Box
          sx={{
            px: 2,
            py: 1,
            maxWidth: 1,
            borderRadius: 1,
            bgcolor: 'background.paper',
            typography: 'caption',
            fontWeight: 600,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {fileName}
        </Box>
      )}
    </Box>
  );
}

// ----------------------------------------------------------------------

export function DeleteButton({ sx, ...other }) {
  return (
    <IconButton
      size="small"
      sx={{
        top: 16,
        right: 16,
        zIndex: 9,
        position: 'absolute',
        color: (theme) => varAlpha(theme.vars.palette.common.whiteChannel, 0.8),
        bgcolor: (theme) => varAlpha(theme.vars.palette.grey['900Channel'], 0.72),
        '&:hover': { bgcolor: (theme) => varAlpha(theme.vars.palette.grey['900Channel'], 0.48) },
        ...sx,
      }}
      {...other}
    >
      <Iconify icon="mingcute:close-line" width={18} />
    </IconButton>
  );
}
