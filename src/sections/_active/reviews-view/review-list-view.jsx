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
import LinearProgress from '@mui/material/LinearProgress';
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

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { createFilterField } from 'src/components/generic-table/table-filter-fields';
import { FlexibleTableFiltersResult } from 'src/components/generic-table/table-filters-result';
import { FlexibleTableToolbar } from 'src/components/generic-table/table-toolbar';
import { Label } from 'src/components/label';
import { Scrollbar } from 'src/components/scrollbar';
import { TableHeadCustom, TableNoData, TablePaginationCustom } from 'src/components/table';
import { useDataTable } from 'src/hooks/use-data-table';
import { fNumber } from 'src/utils/format-number';
import { fDate, formatStr } from 'src/utils/format-time';
import { calculateSerialNumber } from 'src/utils/table-utils';

import { MOCK_PRODUCTS } from 'src/sections/_active/products-view/mock';

import { useGetMockReviewsQuery } from './mock';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'sr', label: 'Sr#', width: 64 },
  { id: 'product', label: 'Product', width: 240 },
  { id: 'reviewer', label: 'Reviewer', width: 180 },
  { id: 'stars', label: 'Stars', width: 130 },
  { id: 'variant', label: 'Variant', width: 120 },
  { id: 'comment', label: 'Comment' },
  { id: 'date', label: 'Date', width: 120 },
];

const TYPE_OPTIONS = [
  { value: 'all', label: 'All Reviews' },
  { value: 'product', label: 'Product' },
  { value: 'store', label: 'Store' },
];

const STARS_OPTIONS = [
  { value: 'all', label: 'All Stars' },
  ...[5, 4, 3, 2, 1].map((value) => ({ value: String(value), label: `${value} ${value === 1 ? 'Star' : 'Stars'}` })),
];

function ReviewSummaryCard({ summary }) {
  const { average = 0, total = 0, breakdown = {} } = summary || {};

  return (
    <Card sx={{ p: 3, mb: 3 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 5 }} alignItems={{ sm: 'center' }}>
        <Stack alignItems="center" spacing={0.5} sx={{ minWidth: 160 }}>
          <Typography variant="h2">{average.toFixed(1)}</Typography>
          <Rating value={average} precision={0.1} readOnly />
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {fNumber(total)} {total === 1 ? 'review' : 'reviews'}
          </Typography>
        </Stack>

        <Stack spacing={1} sx={{ flex: 1 }}>
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = breakdown[stars] || 0;
            return (
              <Stack key={stars} direction="row" spacing={1.5} alignItems="center">
                <Typography variant="subtitle2" sx={{ width: 52, whiteSpace: 'nowrap' }}>
                  {stars} star
                </Typography>
                <LinearProgress variant="determinate" value={total ? (count / total) * 100 : 0} color="warning" sx={{ flex: 1, height: 8, borderRadius: 1 }} />
                <Typography variant="body2" sx={{ width: 32, textAlign: 'right', color: 'text.secondary' }}>
                  {count}
                </Typography>
              </Stack>
            );
          })}
        </Stack>
      </Stack>
    </Card>
  );
}

ReviewSummaryCard.propTypes = {
  summary: PropTypes.object,
};

// ----------------------------------------------------------------------

/** Seller dashboard Reviews page, or (embedded) the Reviews tab on admin seller details. */
export function ReviewListView({ sellerId, embedded = false, sellerMode = true }) {
  const [selected, setSelected] = useState(null);
  const productPaths = sellerMode ? paths.dashboard.products : paths.adminDashboard.products;

  const filterFields = useMemo(
    () => [
      createFilterField.search({ placeholder: 'Search reviewer, comment or product...' }),
      createFilterField.select({ key: 'type', label: 'Type', placeholder: 'Type', defaultValue: 'all', options: TYPE_OPTIONS }),
      createFilterField.select({
        key: 'productId',
        label: 'Product',
        placeholder: 'Product',
        defaultValue: 'all',
        options: [
          { value: 'all', label: 'All Products' },
          ...MOCK_PRODUCTS.filter((product) => product.company?._id === sellerId).map((product) => ({ value: product._id, label: product.title })),
        ],
      }),
      createFilterField.select({ key: 'stars', label: 'Stars', placeholder: 'Stars', defaultValue: 'all', options: STARS_OPTIONS }),
    ],
    [sellerId]
  );

  const defaultFilters = useMemo(() => filterFields.reduce((acc, field) => ({ ...acc, [field.key]: field.defaultValue }), {}), [filterFields]);

  const transformFilters = useMemo(() => (params) => ({ ...params, sellerId }), [sellerId]);

  const {
    filters,
    currentPage,
    itemsPerPage,
    searchDisplayValue,
    dataList,
    totalRecords,
    meta,
    canReset,
    activeFilters,
    handleSearchChange,
    handleFilterChange,
    handlePageChange,
    handleRemoveFilter,
    handleResetFilters,
  } = useDataTable({
    queryHook: useGetMockReviewsQuery,
    defaultFilters,
    filterFields,
    defaultRowsPerPage: 10,
    debounceMs: 300,
    transformFilters,
  });

  const content = (
    <>
      <ReviewSummaryCard summary={meta?.summary} />

      <Card>
        <FlexibleTableToolbar
          filterFields={filterFields}
          filterValues={{ ...filters.state, search: searchDisplayValue }}
          onFilterChange={handleFilterChange}
          onSearchChange={handleSearchChange}
          size="small"
        />

        {canReset && (
          <FlexibleTableFiltersResult activeFilters={activeFilters} totalResults={totalRecords} onResetFilters={handleResetFilters} onRemoveFilter={handleRemoveFilter} sx={{ p: 2.5, pt: 0 }} />
        )}

        <Scrollbar>
          <Table sx={{ minWidth: 960 }} size="small">
            <TableHeadCustom headLabel={TABLE_HEAD} />

            <TableBody>
              {dataList.map((row, index) => (
                <TableRow key={row._id} hover>
                  <TableCell>{calculateSerialNumber(currentPage, itemsPerPage, index)}</TableCell>

                  <TableCell>
                    {row.product ? (
                      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ minWidth: 0 }}>
                        <Avatar src={row.product.image} alt={row.product.title} variant="rounded" sx={{ width: 40, height: 40 }} />
                        <Link component={RouterLink} href={productPaths.details(row.product._id)} color="inherit" underline="hover" variant="subtitle2" noWrap>
                          {row.product.title}
                        </Link>
                      </Stack>
                    ) : (
                      <Label variant="soft" color="info">
                        Store review
                      </Label>
                    )}
                  </TableCell>

                  <TableCell>
                    <Stack direction="row" spacing={1.25} alignItems="center">
                      <Avatar src={row.avatarUrl} alt={row.name} sx={{ width: 32, height: 32, fontSize: 16 }} />
                      <Typography variant="body2">{row.name}</Typography>
                    </Stack>
                  </TableCell>

                  <TableCell>
                    <Rating size="small" value={row.stars} readOnly />
                  </TableCell>

                  <TableCell sx={{ whiteSpace: 'nowrap', color: row.variant ? 'text.primary' : 'text.disabled' }}>{row.variant || '—'}</TableCell>

                  <TableCell>
                    <Typography
                      variant="body2"
                      onClick={() => setSelected(row)}
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

                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.createdAt ? fDate(row.createdAt, formatStr.paramCase.date) : 'N/A'}</TableCell>
                </TableRow>
              ))}

              <TableNoData notFound={!dataList.length} />
            </TableBody>
          </Table>
        </Scrollbar>

        <TablePaginationCustom page={currentPage} count={totalRecords} rowsPerPage={itemsPerPage} rowsPerPageOptions={[]} onPageChange={handlePageChange} />
      </Card>

      <Dialog fullWidth maxWidth="sm" open={Boolean(selected)} onClose={() => setSelected(null)}>
        <DialogTitle>Review</DialogTitle>
        <DialogContent>
          {selected && (
            <Stack spacing={1.5} sx={{ pt: 0.5 }}>
              <Typography variant="subtitle2">
                {selected.product ? selected.product.title : 'Store review'}
                {selected.variant ? ` · ${selected.variant}` : ''}
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <Avatar src={selected.avatarUrl} alt={selected.name} sx={{ width: 28, height: 28 }} />
                <Typography variant="body2">{selected.name}</Typography>
                <Rating size="small" value={selected.stars} readOnly />
              </Stack>
              <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                {selected.comment}
              </Typography>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="primary" onClick={() => setSelected(null)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );

  if (embedded) return content;

  return (
    <Box sx={{ px: { xs: 2, md: 5 }, pb: 5, pt: 3 }}>
      <CustomBreadcrumbs heading="Reviews" links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'Reviews' }]} sx={{ mb: { xs: 3, md: 5 } }} />
      {content}
    </Box>
  );
}

ReviewListView.propTypes = {
  sellerId: PropTypes.string,
  embedded: PropTypes.bool,
  sellerMode: PropTypes.bool,
};
