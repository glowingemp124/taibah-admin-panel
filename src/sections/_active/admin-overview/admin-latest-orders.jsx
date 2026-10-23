import PropTypes from 'prop-types';

import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';

import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/label';
import { Scrollbar } from 'src/components/scrollbar';
import { TableHeadCustom } from 'src/components/table';
import { getOrderStatusLabel } from 'src/sections/_active/orders-view/order-table-config';
import { getStatusColor } from 'src/utils/table-utils';

const TABLE_HEAD = [
  { id: 'orderId', label: 'Order ID' },
  { id: 'buyer', label: 'Buyer' },
  { id: 'seller', label: 'Seller' },
  { id: 'status', label: 'Status' },
  { id: 'action', label: 'Action', align: 'right' },
];

export function AdminLatestOrders({ title, tableData, onViewRow, ...other }) {
  return (
    <Card {...other}>
      <CardHeader
        title={title}
        action={
          <Button
            size="small"
            color="primary"
            component={RouterLink}
            href={paths.adminDashboard.orders.root}
            endIcon={<Iconify icon="eva:arrow-ios-forward-fill" width={16} sx={{ ml: -0.5 }} />}
          >
            View all
          </Button>
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
                  <Typography variant="subtitle2">{row.code}</Typography>
                </TableCell>
                <TableCell>{row.customer?.name || '—'}</TableCell>
                <TableCell>{row.sellerName || '—'}</TableCell>
                <TableCell>
                  <Label variant="soft" color={getStatusColor(row.status)}>
                    {getOrderStatusLabel(row.status)}
                  </Label>
                </TableCell>
                <TableCell align="right">
                  <Button size="small" color="primary" onClick={() => onViewRow?.(row)}>
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Scrollbar>
    </Card>
  );
}

AdminLatestOrders.propTypes = {
  title: PropTypes.string,
  tableData: PropTypes.array,
  onViewRow: PropTypes.func,
};
