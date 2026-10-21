import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';

import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/label';
import { Scrollbar } from 'src/components/scrollbar';
import { TableHeadCustom } from 'src/components/table';
import { fDate, formatStr } from 'src/utils/format-time';
import { getStatusColor } from 'src/utils/table-utils';

import { getOrderStatusLabel } from 'src/sections/_active/orders-view/order-table-config';

const TABLE_HEAD = [
  { id: 'orderId', label: 'Order ID' },
  { id: 'customer', label: 'Customer' },
  { id: 'items', label: 'Items' },
  { id: 'status', label: 'Status' },
  { id: 'date', label: 'Date' },
  { id: 'action', label: 'Actions', align: 'right' },
];

function formatRelativeDate(value) {
  if (!value) return 'N/A';

  const date = new Date(value);
  const today = new Date();
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const startOfValue = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diffDays = Math.round((startOfToday - startOfValue) / 86400000);

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays > 1 && diffDays < 7) return `${diffDays} days ago`;

  return fDate(value, formatStr.paramCase.date);
}

export function SellerLatestOrders({ title, subheader, tableData, viewAllHref, onViewRow, onEditRow, ...other }) {
  return (
    <Card {...other}>
      <CardHeader
        title={title}
        subheader={subheader}
        action={
          viewAllHref ? (
            <Button
              size="small"
              color="primary"
              component={RouterLink}
              href={viewAllHref}
              endIcon={<Iconify icon="eva:arrow-ios-forward-fill" width={16} sx={{ ml: -0.5 }} />}
            >
              View all
            </Button>
          ) : null
        }
        sx={{ mb: 1.5 }}
      />

      <Scrollbar>
        <Table sx={{ minWidth: 720 }}>
          <TableHeadCustom headLabel={TABLE_HEAD} />

          <TableBody>
            {tableData.map((row) => (
              <TableRow key={row._id} hover>
                <TableCell>
                  <Typography variant="subtitle2">#{row.orderId}</Typography>
                </TableCell>

                <TableCell>{row.customer?.name || 'N/A'}</TableCell>

                <TableCell>{(row.items || []).reduce((sum, item) => sum + (item.quantity || 0), 0)}</TableCell>

                <TableCell>
                  <Label variant="soft" color={getStatusColor(row.status)}>
                    {getOrderStatusLabel(row.status)}
                  </Label>
                </TableCell>

                <TableCell>{formatRelativeDate(row.createdAt)}</TableCell>

                <TableCell align="right">
                  <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                    <Button size="small" color="primary" onClick={() => onViewRow?.(row)}>
                      View
                    </Button>
                    <Box component="span" sx={{ color: 'text.disabled', px: 0.25 }}>
                      ·
                    </Box>
                    <Button size="small" color="primary" onClick={() => onEditRow?.(row)}>
                      Update Status
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Scrollbar>
    </Card>
  );
}

SellerLatestOrders.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  tableData: PropTypes.array,
  viewAllHref: PropTypes.string,
  onViewRow: PropTypes.func,
  onEditRow: PropTypes.func,
};
