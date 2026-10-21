import PropTypes from 'prop-types';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { Label } from 'src/components/label';
import { Scrollbar } from 'src/components/scrollbar';
import { fCurrency } from 'src/utils/format-number';

const RANK_COLOR = {
  'Top 1': 'primary',
  'Top 2': 'secondary',
  'Top 3': 'info',
  'Top 4': 'warning',
};

export function AdminTopProducts({ title, tableData, sx, ...other }) {
  return (
    <Card sx={{ height: 1, width: 1, display: 'flex', flexDirection: 'column', ...sx }} {...other}>
      <CardHeader title={title} sx={{ pb: 1 }} />

      <Box
        sx={{
          px: 3,
          py: 1,
          display: 'grid',
          gridTemplateColumns: '1.4fr 0.8fr auto auto',
          gap: 1.5,
          color: 'text.secondary',
          typography: 'caption',
          fontWeight: 600,
        }}
      >
        <Box>Product</Box>
        <Box>Category</Box>
        <Box sx={{ textAlign: 'right' }}>Sales</Box>
        <Box sx={{ textAlign: 'right' }}>Rank</Box>
      </Box>

      <Divider />

      <Scrollbar sx={{ flex: 1, minHeight: 0 }}>
        <Stack divider={<Divider />} sx={{ px: 3 }}>
          {tableData.map((row) => (
            <Box
              key={row._id}
              sx={{
                py: 1.5,
                display: 'grid',
                gridTemplateColumns: '1.4fr 0.8fr auto auto',
                gap: 1.5,
                alignItems: 'center',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
                <Avatar alt={row.title} src={row.image} />
                <Typography variant="subtitle2" noWrap>
                  {row.title}
                </Typography>
              </Box>

              <Typography variant="body2" color="text.secondary" noWrap>
                {row.category}
              </Typography>

              <Typography variant="subtitle2" sx={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                {fCurrency(row.sales)}
              </Typography>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Label variant="soft" color={RANK_COLOR[row.rank] || 'error'}>
                  {row.rank}
                </Label>
              </Box>
            </Box>
          ))}
        </Stack>
      </Scrollbar>
    </Card>
  );
}

AdminTopProducts.propTypes = {
  title: PropTypes.string,
  tableData: PropTypes.array,
  sx: PropTypes.object,
};
