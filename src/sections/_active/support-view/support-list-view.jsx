import { useCallback, useState } from 'react';

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
import { useBoolean } from 'src/hooks/use-boolean';
import { useDataTable } from 'src/hooks/use-data-table';
import { calculateSerialNumber } from 'src/utils/table-utils';

import { useGetMockSupportQuery } from './mock';
import { SupportReplyDialog } from './support-reply-dialog';
import { DEFAULT_FILTERS, FILTER_FIELDS, STATUS_FILTER_FIELD, TABLE_HEAD, TABLE_OPTIONS, TOOLBAR_FILTER_FIELDS } from './support-table-config';
import { SupportTableRow } from './support-table-row';
import { SupportViewDialog } from './support-view-dialog';

export function SupportListView() {
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
    queryHook: useGetMockSupportQuery,
    defaultFilters: DEFAULT_FILTERS,
    filterFields: FILTER_FIELDS,
    defaultRowsPerPage: 10,
    debounceMs: 500,
  });

  const viewDialog = useBoolean();
  const replyDialog = useBoolean();
  const [currentTicket, setCurrentTicket] = useState(null);

  const handleOpenView = useCallback(
    (row) => {
      setCurrentTicket(row);
      viewDialog.onTrue();
    },
    [viewDialog]
  );

  const handleOpenReply = useCallback(
    (row) => {
      setCurrentTicket(row);
      viewDialog.onFalse();
      replyDialog.onTrue();
    },
    [replyDialog, viewDialog]
  );

  const handleCloseView = useCallback(() => {
    viewDialog.onFalse();
    if (!replyDialog.value) {
      setCurrentTicket(null);
    }
  }, [viewDialog, replyDialog]);

  const handleCloseReply = useCallback(() => {
    replyDialog.onFalse();
    if (!viewDialog.value) {
      setCurrentTicket(null);
    }
  }, [replyDialog, viewDialog]);

  const isBusy = isLoading || isFetching;
  const notFound = !isBusy && dataList.length === 0;
  const isDense = TABLE_OPTIONS.dense;

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

  return (
    <>
      <Box sx={{ px: { xs: 2, md: 5 }, pb: 5, pt: 3, display: 'flex', flexDirection: 'column' }}>
        <CustomBreadcrumbs
          heading="Support"
          links={[{ name: 'Dashboard', href: paths.adminDashboard.root }, { name: 'Settings' }, { name: 'Support' }]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />

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
              <Table size={isDense ? 'small' : 'medium'} sx={{ minWidth: 1260 }}>
                <TableHeadCustom headLabel={TABLE_HEAD} rowCount={dataList.length} />

                <TableBody>
                  {!isBusy &&
                    dataList.map((row, index) => (
                      <SupportTableRow
                        key={row._id}
                        row={row}
                        serialNumber={calculateSerialNumber(currentPage, itemsPerPage, index)}
                        onViewRow={() => handleOpenView(row)}
                        onReplyRow={() => handleOpenReply(row)}
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
      </Box>

      <SupportViewDialog
        ticket={currentTicket}
        open={viewDialog.value}
        onClose={handleCloseView}
        onReply={() => handleOpenReply(currentTicket)}
      />

      <SupportReplyDialog ticket={replyDialog.value ? currentTicket : null} open={replyDialog.value} onClose={handleCloseReply} onSuccess={refetch} />
    </>
  );
}
