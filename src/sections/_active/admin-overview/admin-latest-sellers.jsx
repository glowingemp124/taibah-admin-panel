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
import { fDate, formatStr } from 'src/utils/format-time';

const TABLE_HEAD = [
  { id: 'seller', label: 'Seller' },
  { id: 'joined', label: 'Joined' },
  { id: 'products', label: 'Products', align: 'right' },
  { id: 'status', label: 'Status' },
  { id: 'action', label: 'Action', align: 'right' },
];

function formatJoined(value) {
  if (!value) return '—';
  const date = new Date(value);
  const today = new Date();
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const startOfValue = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diffDays = Math.round((startOfToday - startOfValue) / 86400000);

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  return fDate(value, formatStr.paramCase.date);
}

export function AdminLatestSellers({ title, tableData, ...other }) {
  return (
    <Card {...other}>
      <CardHeader
        title={title}
        action={
          <Button
            size="small"
            color="primary"
            component={RouterLink}
            href={paths.adminDashboard.sellers.root}
            endIcon={<Iconify icon="eva:arrow-ios-forward-fill" width={16} sx={{ ml: -0.5 }} />}
          >
            View all
          </Button>
        }
        sx={{ mb: 1.5 }}
      />

      <Scrollbar>
        <Table sx={{ minWidth: 640 }}>
          <TableHeadCustom headLabel={TABLE_HEAD} />
          <TableBody>
            {tableData.map((row) => (
              <TableRow key={row._id} hover>
                <TableCell>
                  <Typography variant="subtitle2">{row.storeName}</Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {row.name}
                  </Typography>
                </TableCell>
                <TableCell>{formatJoined(row.createdAt)}</TableCell>
                <TableCell align="right">{row.productCount}</TableCell>
                <TableCell>
                  <Label variant="soft" color={row.status === 'Approved' ? 'success' : 'warning'}>
                    {row.status}
                  </Label>
                </TableCell>
                <TableCell align="right">
                  {row.href ? (
                    <Button size="small" color="primary" component={RouterLink} href={row.href}>
                      View
                    </Button>
                  ) : (
                    <Button size="small" color="primary" component={RouterLink} href={paths.adminDashboard.pendingSellers}>
                      Review
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Scrollbar>
    </Card>
  );
}

AdminLatestSellers.propTypes = {
  title: PropTypes.string,
  tableData: PropTypes.array,
};
