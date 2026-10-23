import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';

import { fCurrency } from 'src/utils/format-number';
import { Label } from 'src/components/label';
import { Scrollbar } from 'src/components/scrollbar';

// ----------------------------------------------------------------------

const RECENT_TRANSACTIONS = [
  { id: '1', title: 'Order #XF-2356', type: 'Sale', amount: 128.5, color: 'success' },
  { id: '2', title: 'Order #XF-2346', type: 'Sale', amount: 86.2, color: 'success' },
  { id: '3', title: 'Refund #RF-1021', type: 'Refund', amount: -24.0, color: 'warning' },
  { id: '4', title: 'Order #XF-2331', type: 'Sale', amount: 64.9, color: 'success' },
  { id: '5', title: 'Payout to vendor', type: 'Payout', amount: -320.0, color: 'info' },
];

export function AdminTransactions({
  title,
  currentBalance,
  rows = [],
  list = RECENT_TRANSACTIONS,
  sx,
  ...other
}) {
  return (
    <Card sx={{ height: 1, width: 1, display: 'flex', flexDirection: 'column', ...sx }} {...other}>
      <CardHeader title={title} />

      <Box sx={{ px: 3, pb: 2 }}>
        <Typography variant="h3">{fCurrency(currentBalance)}</Typography>

        <Stack spacing={1} sx={{ mt: 2 }}>
          {rows.map((row) => (
            <Row key={row.label} label={row.label} value={row.value} />
          ))}
        </Stack>
      </Box>

      <Divider sx={{ borderStyle: 'dashed' }} />

      <Typography variant="subtitle2" sx={{ px: 3, pt: 2, pb: 1 }}>
        Recent activity
      </Typography>

      <Scrollbar sx={{ flex: 1, minHeight: 0 }}>
        <Stack spacing={1.5} sx={{ px: 3, pb: 3 }}>
          {list.map((item) => (
            <Box
              key={item.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
              }}
            >
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography variant="subtitle2" noWrap>
                  {item.title}
                </Typography>
              </Box>

              <Label variant="soft" color={item.color}>
                {item.type}
              </Label>

              <Typography
                variant="subtitle2"
                sx={{ color: item.amount < 0 ? 'error.main' : 'success.main', whiteSpace: 'nowrap' }}
              >
                {item.amount > 0 ? '+' : ''}
                {fCurrency(item.amount)}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Scrollbar>
    </Card>
  );
}

function Row({ label, value }) {
  return (
    <Box sx={{ display: 'flex', typography: 'body2', justifyContent: 'space-between' }}>
      <Box component="span" sx={{ color: 'text.secondary' }}>
        {label}
      </Box>
      <Box component="span">{fCurrency(value)}</Box>
    </Box>
  );
}
