import PropTypes from 'prop-types';
import { useCallback, useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import LinearProgress from '@mui/material/LinearProgress';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { FlexibleTableFiltersResult } from 'src/components/generic-table/table-filters-result';
import { FlexibleTableToolbar } from 'src/components/generic-table/table-toolbar';
import { StatusTabsFilterWrapper } from 'src/components/generic-table/tabs-filter-wrapper';
import { Scrollbar } from 'src/components/scrollbar';
import { TableEmptyRows, TableHeadCustom, TableNoData, TablePaginationCustom } from 'src/components/table';
import { useDataTable } from 'src/hooks/use-data-table';
import { calculateSerialNumber } from 'src/utils/table-utils';

import { DEFAULT_FILTERS, FILTER_FIELDS, STATUS_FILTER_FIELD, TABLE_HEAD, TABLE_OPTIONS, TOOLBAR_FILTER_FIELDS } from './user-table-config';
import { UserStatusDialog } from './user-status-dialog';
import { UserTableRow } from './user-table-row';
import { useGetMockUsersQuery } from './mock';

export function UserListView({ sellerMode = false, userIds, heading = 'Users' }) {
  const router = useRouter();
  const appPaths = sellerMode ? paths.dashboard : paths.adminDashboard;
  const transformFilters = useCallback((params) => (userIds ? { ...params, userIds } : params), [userIds]);

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
    queryHook: useGetMockUsersQuery,
    defaultFilters: DEFAULT_FILTERS,
    filterFields: FILTER_FIELDS,
    defaultRowsPerPage: 10,
    debounceMs: 500,
    transformFilters,
  });

  const [currentUser, setCurrentUser] = useState(null);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);

  const handleOpenEdit = useCallback((row) => {
    setCurrentUser(row);
    setStatusDialogOpen(true);
  }, []);

  const handleCloseEdit = useCallback(() => {
    setStatusDialogOpen(false);
    setCurrentUser(null);
  }, []);

  const isBusy = isLoading || isFetching;
  const notFound = !isBusy && dataList.length === 0;
  const isDense = TABLE_OPTIONS.dense;
  const tableHead = sellerMode ? TABLE_HEAD.filter((column) => column.id !== 'userType' && column.id !== 'action') : TABLE_HEAD;
  const toolbarFields = sellerMode ? TOOLBAR_FILTER_FIELDS.filter((field) => field.key !== 'userType') : TOOLBAR_FILTER_FIELDS;

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
        <CustomBreadcrumbs heading={heading} links={[{ name: 'Dashboard', href: appPaths.root }, { name: heading }]} sx={{ mb: { xs: 3, md: 5 } }} />

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
              <Table size={isDense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <TableHeadCustom headLabel={tableHead} rowCount={dataList.length} />

                <TableBody>
                  {!isBusy &&
                    dataList.map((row, index) => (
                      <UserTableRow
                        key={row._id}
                        row={row}
                        serialNumber={calculateSerialNumber(currentPage, itemsPerPage, index)}
                        hideUserType={sellerMode}
                        hideActions={sellerMode}
                        onViewRow={sellerMode ? undefined : () => router.push(paths.adminDashboard.users.details(row._id))}
                        onEditRow={sellerMode ? undefined : () => handleOpenEdit(row)}
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

      {!sellerMode && <UserStatusDialog currentUser={currentUser} open={statusDialogOpen} onClose={handleCloseEdit} onSuccess={refetch} />}
    </>
  );
}

UserListView.propTypes = {
  sellerMode: PropTypes.bool,
  userIds: PropTypes.array,
  heading: PropTypes.string,
};
