import { useCallback, useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CircularProgress from '@mui/material/CircularProgress';
import LinearProgress from '@mui/material/LinearProgress';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';

import { paths } from 'src/routes/paths';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { FlexibleTableFiltersResult } from 'src/components/generic-table/table-filters-result';
import { FlexibleTableToolbar } from 'src/components/generic-table/table-toolbar';
import { StatusTabsFilterWrapper } from 'src/components/generic-table/tabs-filter-wrapper';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { toast } from 'src/components/snackbar';
import { TableEmptyRows, TableHeadCustom, TableNoData, TablePaginationCustom } from 'src/components/table';
import { useBoolean } from 'src/hooks/use-boolean';
import { useDataTable } from 'src/hooks/use-data-table';
import { calculateSerialNumber } from 'src/utils/table-utils';

import { NotificationFormDialog } from './notification-form-dialog';
import { NotificationTableRow } from './notification-table-row';
import { NotificationViewDialog } from './notification-view-dialog';
import { DEFAULT_FILTERS, FILTER_FIELDS, STATUS_FILTER_FIELD, TABLE_HEAD, TABLE_OPTIONS, TOOLBAR_FILTER_FIELDS } from './notification-table-config';
import { deleteMockBroadcast, findMockBroadcast, isBroadcastEditable, sendMockBroadcast, useGetMockNotificationsQuery } from './mock';

export function NotificationListView() {
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
    queryHook: useGetMockNotificationsQuery,
    defaultFilters: DEFAULT_FILTERS,
    filterFields: FILTER_FIELDS,
    defaultRowsPerPage: 10,
    debounceMs: 500,
  });

  const formDialog = useBoolean();
  const confirm = useBoolean();
  const [currentNotification, setCurrentNotification] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleOpenCreate = useCallback(() => {
    setCurrentNotification(null);
    formDialog.onTrue();
  }, [formDialog]);

  const handleOpenEdit = useCallback(
    (row) => {
      setCurrentNotification(row);
      formDialog.onTrue();
    },
    [formDialog]
  );

  const handleCloseForm = useCallback(() => {
    formDialog.onFalse();
    setCurrentNotification(null);
  }, [formDialog]);

  // POST /admin/broadcasts/:id/send (drafts, scheduled and failed only).
  const handleSendRow = useCallback(
    (row) => {
      if (!sendMockBroadcast(row._id)) return;
      toast.success(`Sending "${row.title}"…`);
      setViewing((current) => (current?._id === row._id ? { ...findMockBroadcast(row._id) } : current));
      refetch();
    },
    [refetch]
  );

  // While anything is sending, check again until it finishes.
  const anySending = dataList.some((row) => row.status === 'sending');
  useEffect(() => {
    if (!anySending) return undefined;
    const timer = setTimeout(() => {
      refetch();
      setViewing((current) => (current ? { ...findMockBroadcast(current._id) } : current));
    }, 1000);
    return () => clearTimeout(timer);
  }, [anySending, dataList, refetch]);

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
    deleteMockBroadcast(itemToDelete._id);
    toast.success('Broadcast deleted successfully!');
    setIsDeleting(false);
    confirm.onFalse();
    setItemToDelete(null);
    refetch();
  }, [confirm, itemToDelete, refetch]);

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
          heading="Notifications"
          links={[{ name: 'Dashboard', href: paths.adminDashboard.root }, { name: 'Notifications' }]}
          action={
            <Button variant="contained" color="primary" startIcon={<Iconify icon="mingcute:add-line" />} onClick={handleOpenCreate}>
              New Broadcast
            </Button>
          }
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
              <Table size={isDense ? 'small' : 'medium'} sx={{ minWidth: 1180 }}>
                <TableHeadCustom headLabel={TABLE_HEAD} rowCount={dataList.length} />

                <TableBody>
                  {!isBusy &&
                    dataList.map((row, index) => (
                      <NotificationTableRow
                        key={row._id}
                        row={row}
                        serialNumber={calculateSerialNumber(currentPage, itemsPerPage, index)}
                        onViewRow={() => setViewing(row)}
                        onSendRow={() => handleSendRow(row)}
                        onEditRow={() => handleOpenEdit(row)}
                        onDeleteRow={() => handleDeleteRow(row)}
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

      <NotificationFormDialog currentNotification={currentNotification} open={formDialog.value} onClose={handleCloseForm} onSuccess={refetch} />

      <NotificationViewDialog
        notification={viewing}
        open={!!viewing}
        onClose={() => setViewing(null)}
        onSend={viewing && isBroadcastEditable(viewing) ? handleSendRow : undefined}
      />

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
    </>
  );
}
