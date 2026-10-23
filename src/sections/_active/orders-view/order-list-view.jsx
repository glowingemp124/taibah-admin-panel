import PropTypes from 'prop-types';
import { useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import LinearProgress from '@mui/material/LinearProgress';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';

import { paths } from 'src/routes/paths';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { FlexibleTableFiltersResult } from 'src/components/generic-table/table-filters-result';
import { FlexibleTableToolbar } from 'src/components/generic-table/table-toolbar';
import { StatusTabsFilterWrapper } from 'src/components/generic-table/tabs-filter-wrapper';
import { Scrollbar } from 'src/components/scrollbar';
import { TableEmptyRows, TableHeadCustom, TableNoData, TablePaginationCustom } from 'src/components/table';
import { useDataTable } from 'src/hooks/use-data-table';
import { calculateSerialNumber } from 'src/utils/table-utils';

import { useOrderActions } from './use-order-actions';
import { findMockOrder, toSellerOrder, useGetMockOrdersQuery } from './mock';
import { OrderEditDialog } from './order-edit-dialog';
import { DEFAULT_FILTERS, FILTER_FIELDS, STATUS_FILTER_FIELD, TABLE_HEAD, TABLE_OPTIONS, TOOLBAR_FILTER_FIELDS } from './order-table-config';
import { OrderTableRow } from './order-table-row';
import { OrderViewDialog } from './order-view-dialog';


export function OrderListView({ embedded = false, userId, sellerId, sellerMode = false }) {
  const appPaths = sellerMode ? paths.dashboard : paths.adminDashboard;
  const transformFilters = useCallback(
    (params) => ({
      ...params,
      ...(userId && { userId }),
      ...(sellerId && { sellerId }),
    }),
    [userId, sellerId]
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
    queryHook: useGetMockOrdersQuery,
    defaultFilters: DEFAULT_FILTERS,
    filterFields: FILTER_FIELDS,
    defaultRowsPerPage: 10,
    debounceMs: 500,
    transformFilters,
  });

  const actions = useOrderActions({ sellerId, sellerMode, onChanged: refetch });

  // ?view=<orderId> (e.g. from a notification) opens that order's view, then leaves the URL clean.
  const [searchParams, setSearchParams] = useSearchParams();
  const viewId = embedded ? null : searchParams.get('view');

  useEffect(() => {
    if (!viewId) return;
    const found = findMockOrder(viewId);
    const order = found && (sellerId ? toSellerOrder(found, sellerId) : found);
    if (order) actions.openView(order);

    const next = new URLSearchParams(searchParams);
    next.delete('view');
    setSearchParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewId]);

  const isBusy = isLoading || isFetching;
  const notFound = !isBusy && dataList.length === 0;
  const isDense = TABLE_OPTIONS.dense;
  // One store per row when scoped to a seller, so the vendor column adds nothing.
  const hideVendor = sellerMode || !!sellerId;
  const tableHead = hideVendor ? TABLE_HEAD.filter((column) => column.id !== 'vendor') : TABLE_HEAD;

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
        filterFields={TOOLBAR_FILTER_FIELDS}
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
          <Table size={isDense ? 'small' : 'medium'} sx={{ minWidth: hideVendor ? 1000 : 1260 }}>
            <TableHeadCustom headLabel={tableHead} rowCount={dataList.length} />

            <TableBody>
              {!isBusy &&
                dataList.map((row, index) => (
                  <OrderTableRow
                    key={row._id}
                    row={row}
                    serialNumber={calculateSerialNumber(currentPage, itemsPerPage, index)}
                    hideVendor={hideVendor}
                    onViewRow={() => actions.openView(row)}
                    onEditRow={sellerMode ? () => actions.openEdit(row, row.stores[0]) : undefined}
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

  return (
    <>
      {embedded ? (
        table
      ) : (
        <Box sx={{ px: { xs: 2, md: 5 }, pb: 5, pt: 3, display: 'flex', flexDirection: 'column' }}>
          <CustomBreadcrumbs heading="Orders" links={[{ name: 'Dashboard', href: appPaths.root }, { name: 'Orders' }]} sx={{ mb: { xs: 3, md: 5 } }} />
          {table}
        </Box>
      )}

      <OrderViewDialog
        order={actions.viewOrder}
        open={!!actions.viewOrder}
        onClose={actions.closeView}
        sellerMode={sellerMode}
        onEditStore={(store) => actions.openEdit(actions.viewOrder, store)}
      />

      <OrderEditDialog
        order={actions.editTarget?.order}
        storeOrder={actions.editTarget?.store}
        role={actions.role}
        actor={actions.actor}
        open={!!actions.editTarget}
        onClose={actions.closeEdit}
        onSuccess={actions.handleEdited}
      />
    </>
  );
}

OrderListView.propTypes = {
  embedded: PropTypes.bool,
  userId: PropTypes.string,
  sellerId: PropTypes.string,
  sellerMode: PropTypes.bool,
};
