import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Link from '@mui/material/Link';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { useRouter } from 'src/routes/hooks';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { createFilterField } from 'src/components/generic-table/table-filter-fields';
import { FlexibleTableToolbar } from 'src/components/generic-table/table-toolbar';
import { Scrollbar } from 'src/components/scrollbar';
import { TableHeadCustom, TableNoData, TablePaginationCustom } from 'src/components/table';
import { fDate, formatStr } from 'src/utils/format-time';

import { getSellerReviews } from './mock';

const TABLE_HEAD = [
  { id: 'sr', label: 'Sr#', width: 64 },
  { id: 'product', label: 'Product' },
  { id: 'reviewer', label: 'Reviewer', width: 200 },
  { id: 'rating', label: 'Rating', width: 160 },
  { id: 'comment', label: 'Comment' },
  { id: 'date', label: 'Date', width: 140 },
];

const TOOLBAR_FILTER_FIELDS = [
  createFilterField.search({
    placeholder: 'Search product, reviewer or comment...',
  }),
];

export function ReviewListView({ sellerId }) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [selectedComment, setSelectedComment] = useState(null);
  const rowsPerPage = 10;

  const reviews = useMemo(() => getSellerReviews(sellerId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)), [sellerId]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return reviews;

    return reviews.filter((row) => row.productTitle?.toLowerCase().includes(query) || row.name?.toLowerCase().includes(query) || row.comment?.toLowerCase().includes(query));
  }, [reviews, search]);

  const paged = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const notFound = filtered.length === 0;

  return (
    <Box sx={{ px: { xs: 2, md: 5 }, pb: 5, pt: 3 }}>
      <CustomBreadcrumbs heading="Reviews" links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'Reviews' }]} sx={{ mb: { xs: 3, md: 5 } }} />

      <Card>
        <FlexibleTableToolbar
          filterFields={TOOLBAR_FILTER_FIELDS}
          filterValues={{ search }}
          onFilterChange={() => {}}
          onSearchChange={(event) => {
            setSearch(event.target.value);
            setPage(0);
          }}
          size="small"
        />

        <Scrollbar>
          <Table sx={{ minWidth: 880 }} size="small">
            <TableHeadCustom headLabel={TABLE_HEAD} />

            <TableBody>
              {paged.map((row, index) => (
                <TableRow key={`${row.productId}-${row._id}`} hover>
                  <TableCell>{page * rowsPerPage + index + 1}</TableCell>

                  <TableCell>
                    <Stack
                      direction="row"
                      spacing={1.5}
                      alignItems="center"
                      onClick={() => router.push(paths.dashboard.products.details(row.productId))}
                      sx={{ cursor: 'pointer', minWidth: 0 }}
                    >
                      <Avatar src={row.productImage} alt={row.productTitle} variant="rounded" sx={{ width: 40, height: 40 }} />
                      <Link component={RouterLink} href={paths.dashboard.products.details(row.productId)} color="inherit" underline="hover" variant="subtitle2" noWrap>
                        {row.productTitle}
                      </Link>
                    </Stack>
                  </TableCell>

                  <TableCell>
                    <Stack direction="row" spacing={1.25} alignItems="center">
                      <Avatar src={row.avatarUrl} alt={row.name} sx={{ width: 32, height: 32, fontSize: 16 }} />
                      <Typography variant="body2">{row.name}</Typography>
                    </Stack>
                  </TableCell>

                  <TableCell>
                    <Rating size="small" value={Math.round(row.rating || 0)} readOnly />
                  </TableCell>

                  <TableCell>
                    <Typography
                      variant="body2"
                      onClick={() => setSelectedComment(row)}
                      sx={{
                        color: 'text.secondary',
                        cursor: 'pointer',
                        display: '-webkit-box',
                        overflow: 'hidden',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: 2,
                        '&:hover': { color: 'primary.main', textDecoration: 'underline' },
                      }}
                    >
                      {row.comment}
                    </Typography>
                  </TableCell>

                  <TableCell>{row.createdAt ? fDate(row.createdAt, formatStr.paramCase.date) : 'N/A'}</TableCell>
                </TableRow>
              ))}

              <TableNoData notFound={notFound} />
            </TableBody>
          </Table>
        </Scrollbar>

        <TablePaginationCustom page={page} count={filtered.length} rowsPerPage={rowsPerPage} rowsPerPageOptions={[]} onPageChange={(_, nextPage) => setPage(nextPage)} />
      </Card>

      <Dialog fullWidth maxWidth="sm" open={Boolean(selectedComment)} onClose={() => setSelectedComment(null)}>
        <DialogTitle>Review</DialogTitle>
        <DialogContent>
          {selectedComment && (
            <Stack spacing={1.5} sx={{ pt: 0.5 }}>
              <Typography variant="subtitle2">{selectedComment.productTitle}</Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <Avatar src={selectedComment.avatarUrl} alt={selectedComment.name} sx={{ width: 28, height: 28 }} />
                <Typography variant="body2">{selectedComment.name}</Typography>
                <Rating size="small" value={Math.round(selectedComment.rating || 0)} readOnly />
              </Stack>
              <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                {selectedComment.comment}
              </Typography>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="primary" onClick={() => setSelectedComment(null)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

ReviewListView.propTypes = {
  sellerId: PropTypes.string,
};
