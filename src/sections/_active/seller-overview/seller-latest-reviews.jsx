import PropTypes from 'prop-types';

import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Rating from '@mui/material/Rating';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { TableHeadCustom } from 'src/components/table';

const TABLE_HEAD = [
  { id: 'product', label: 'Product' },
  { id: 'rating', label: 'Rating' },
  { id: 'comment', label: 'Comment' },
];

export function SellerLatestReviews({ title, subheader, tableData, viewAllHref, ...other }) {
  const router = useRouter();

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
        <Table sx={{ minWidth: 560 }}>
          <TableHeadCustom headLabel={TABLE_HEAD} />

          <TableBody>
            {tableData.map((row) => (
              <TableRow
                key={`${row.productId}-${row._id}`}
                hover
                sx={{ cursor: row.productId ? 'pointer' : 'default' }}
                onClick={() => row.productId && router.push(paths.dashboard.products.details(row.productId))}
              >
                <TableCell>
                  <Typography variant="subtitle2">{row.productTitle}</Typography>
                </TableCell>

                <TableCell>
                  <Rating size="small" value={Math.round(row.rating || 0)} readOnly />
                </TableCell>

                <TableCell>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {row.comment}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Scrollbar>
    </Card>
  );
}

SellerLatestReviews.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  tableData: PropTypes.array,
  viewAllHref: PropTypes.string,
};
