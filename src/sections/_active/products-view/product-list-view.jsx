import PropTypes from 'prop-types';
import { useCallback, useMemo, useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CircularProgress from '@mui/material/CircularProgress';
import LinearProgress from '@mui/material/LinearProgress';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { FlexibleTableFiltersResult } from 'src/components/generic-table/table-filters-result';
import { FlexibleTableToolbar } from 'src/components/generic-table/table-toolbar';
import { StatusTabsFilterWrapper } from 'src/components/generic-table/tabs-filter-wrapper';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { toast } from 'src/components/snackbar';
import { TableEmptyRows, TableHeadCustom, TableNoData, TablePaginationCustom } from 'src/components/table';
import { useAppRole } from 'src/hooks/use-app-role';
import { useBoolean } from 'src/hooks/use-boolean';
import { useDataTable } from 'src/hooks/use-data-table';
import { calculateSerialNumber } from 'src/utils/table-utils';

import { deleteMockProduct, useGetMockProductsQuery } from './mock';
import { ProductRejectDialog } from './product-reject-dialog';
import { DEFAULT_FILTERS, FILTER_FIELDS, getTableHead, STATUS_FILTER_FIELD, TABLE_OPTIONS, TOOLBAR_FILTER_FIELDS } from './product-table-config';
import { ProductTableRow } from './product-table-row';
import { SellerApprovalBanner } from './seller-approval-banner';
import { useProductReview } from './use-product-review';

export function ProductListView({ embedded = false, sellerId, sellerMode = false, pendingOnly = false }) {
  const router = useRouter();
  const { sellerStatus } = useAppRole();
  const appPaths = sellerMode ? paths.dashboard : paths.adminDashboard;
  const isAdmin = !sellerMode;
  const canManage = isAdmin || sellerStatus === 'approved';

  const transformFilters = useCallback(
    (params) => ({
      ...params,
      ...(sellerId && { sellerId }),
      ...(pendingOnly && { reviewStatus: 'pending' }),
    }),
    [sellerId, pendingOnly]
  );

  const {
    filters,
    currentPage,
    itemsPerPage,
    searchDisplayValue,
    dataList,
    totalRecords,
    meta,
    isLoading,
    isFetching,
    canReset,
    activeFilters,
    handleSearchChange,
    handleFilterChange,
    handlePageChange,
    handleRemoveFilter,
    handleResetFilters,
    refetch,
  } = useDataTable({
    queryHook: useGetMockProductsQuery,
    defaultFilters: DEFAULT_FILTERS,
    filterFields: FILTER_FIELDS,
    defaultRowsPerPage: 10,
    debounceMs: 500,
    transformFilters,
  });

  const confirm = useBoolean();
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const review = useProductReview(refetch);

  // The review select shows how many products sit in each state.
  const toolbarFields = useMemo(() => {
    const reviewCounts = meta?.reviewCounts || {};
    const total = Object.values(reviewCounts).reduce((sum, count) => sum + count, 0);

    return TOOLBAR_FILTER_FIELDS.filter((field) => !(pendingOnly && field.key === 'reviewStatus')).map((field) =>
      field.key === 'reviewStatus'
        ? {
            ...field,
            options: field.options.map((option) => ({
              ...option,
              label: `${option.label} (${option.value === 'all' ? total : reviewCounts[option.value] || 0})`,
            })),
          }
        : field
    );
  }, [meta, pendingOnly]);

  const handleOpenCreate = useCallback(() => {
    router.push(appPaths.products.new);
  }, [appPaths.products.new, router]);

  const handleOpenEdit = useCallback(
    (row) => {
      router.push(appPaths.products.edit(row._id));
    },
    [appPaths.products, router]
  );

  const handleOpenView = useCallback(
    (row) => {
      router.push(appPaths.products.details(row._id));
    },
    [appPaths.products, router]
  );

  const handleDeleteRow = useCallback(
    (row) => {
      setItemToDelete(row);
      confirm.onTrue();
    },
    [confirm]
  );

  const handleCancelDelete = useCallback(() => {
    if (!isDeleting) {
      confirm.onFalse();
      setItemToDelete(null);
    }
  }, [confirm, isDeleting]);

  const handleConfirmDelete = useCallback(async () => {
    setIsDeleting(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    deleteMockProduct(itemToDelete._id);
    toast.success('Product deleted successfully!');
    setIsDeleting(false);
    confirm.onFalse();
    setItemToDelete(null);
    refetch();
  }, [confirm, itemToDelete, refetch]);

  const isBusy = isLoading || isFetching;
  const notFound = !isBusy && dataList.length === 0;
  const isDense = TABLE_OPTIONS.dense;
  const tableHead = getTableHead({ showCompany: isAdmin });

  const getStatusCount = useCallback(
    (status) => {
      const statusCounts = meta?.counts || {};

      if (status === 'all') {
        return Object.values(statusCounts).reduce((sum, count) => sum + count, 0);
      }

      return statusCounts[status] || 0;
    },
    [meta]
  );

  const table = (
    <Card>
      <StatusTabsFilterWrapper filterField={STATUS_FILTER_FIELD} value={filters.state.status} onChange={handleFilterChange} getCount={getStatusCount} />

      <FlexibleTableToolbar
        filterFields={toolbarFields}
        filterValues={{
          ...filters.state,
          search: searchDisplayValue,
        }}
        onFilterChange={handleFilterChange}
        onSearchChange={handleSearchChange}
        size={TABLE_OPTIONS.filterSize}
      />

      {canReset && (
        <FlexibleTableFiltersResult
          activeFilters={activeFilters}
          totalResults={totalRecords}
          onResetFilters={handleResetFilters}
          onRemoveFilter={handleRemoveFilter}
          sx={{ p: 2.5, pt: 0 }}
        />
      )}

      <Box sx={{ position: 'relative' }}>
        {isFetching && (
          <LinearProgress
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              zIndex: 9,
            }}
          />
        )}

        <Scrollbar>
          <Table size={isDense ? 'small' : 'medium'} sx={{ minWidth: isAdmin ? 1480 : 1320 }}>
            <TableHeadCustom headLabel={tableHead} rowCount={dataList.length} />

            <TableBody>
              {!isBusy &&
                dataList.map((row, index) => (
                  <ProductTableRow
                    key={row._id}
                    row={row}
                    showCompany={isAdmin}
                    serialNumber={calculateSerialNumber(currentPage, itemsPerPage, index)}
                    onViewRow={() => handleOpenView(row)}
                    onEditRow={canManage ? () => handleOpenEdit(row) : undefined}
                    onDeleteRow={canManage ? () => handleDeleteRow(row) : undefined}
                    onApproveRow={isAdmin ? () => review.approve(row) : undefined}
                    onRejectRow={isAdmin ? () => review.openReject(row) : undefined}
                  />
                ))}

              {isBusy && <TableEmptyRows height={isDense ? 56 : 76} emptyRows={itemsPerPage} />}

              <TableNoData notFound={notFound} />
            </TableBody>
          </Table>
        </Scrollbar>
      </Box>

      <TablePaginationCustom page={currentPage} count={totalRecords} rowsPerPage={itemsPerPage} rowsPerPageOptions={[]} onPageChange={handlePageChange} />
    </Card>
  );

  const heading = pendingOnly ? 'Pending products' : 'Products';

  return (
    <>
      {embedded ? (
        table
      ) : (
        <Box sx={{ px: { xs: 2, md: 5 }, pb: 5, pt: 3, display: 'flex', flexDirection: 'column' }}>
          <CustomBreadcrumbs
            heading={heading}
            links={[
              { name: 'Dashboard', href: appPaths.root },
              ...(pendingOnly ? [{ name: 'Products', href: appPaths.products.root }] : []),
              { name: heading },
            ]}
            action={
              !pendingOnly && (
                <Button variant="contained" color="primary" startIcon={<Iconify icon="mingcute:add-line" />} onClick={handleOpenCreate} disabled={!canManage}>
                  New Product
                </Button>
              )
            }
            sx={{ mb: { xs: 3, md: 5 } }}
          />
          {sellerMode && <SellerApprovalBanner sellerStatus={sellerStatus} sx={{ mb: 3 }} />}
          {table}
        </Box>
      )}

      <ConfirmDialog
        open={confirm.value}
        onClose={handleCancelDelete}
        title="Delete"
        content={
          <>
            Are you sure you want to delete <strong>{itemToDelete?.title}</strong>? This action cannot be undone.
          </>
        }
        action={
          <Button variant="contained" color="primary" onClick={handleConfirmDelete} disabled={isDeleting} startIcon={isDeleting && <CircularProgress size={20} color="inherit" />}>
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        }
      />

      <ProductRejectDialog product={review.rejectTarget} open={!!review.rejectTarget} onClose={review.closeReject} onConfirm={review.confirmReject} />
    </>
  );
}

ProductListView.propTypes = {
  embedded: PropTypes.bool,
  sellerId: PropTypes.string,
  sellerMode: PropTypes.bool,
  pendingOnly: PropTypes.bool,
};
