import { useCallback, useState } from 'react';

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

import { EventFormDialog } from './event-form-dialog';
import { EventProductsDialog } from './event-products-dialog';
import { EventTableRow } from './event-table-row';
import { EventViewDialog } from './event-view-dialog';
import { DEFAULT_FILTERS, FILTER_FIELDS, STATUS_FILTER_FIELD, TABLE_HEAD, TABLE_OPTIONS, TOOLBAR_FILTER_FIELDS } from './event-table-config';
import { deleteMockEvent, hydrateEvent, useGetMockEventsQuery } from './mock';

export function EventListView() {

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
    queryHook: useGetMockEventsQuery,
    defaultFilters: DEFAULT_FILTERS,
    filterFields: FILTER_FIELDS,
    defaultRowsPerPage: 10,
    debounceMs: 500,
  });

  const formDialog = useBoolean();
  const viewDialog = useBoolean();
  const confirm = useBoolean();
  const [currentEvent, setCurrentEvent] = useState(null);
  const [productsEvent, setProductsEvent] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleOpenCreate = useCallback(() => {
    setCurrentEvent(null);
    formDialog.onTrue();
  }, [formDialog]);

  const handleOpenEdit = useCallback(
    (row) => {
      setCurrentEvent(row);
      formDialog.onTrue();
    },
    [formDialog]
  );

  const handleOpenView = useCallback(
    (row) => {
      setCurrentEvent(row);
      viewDialog.onTrue();
    },
    [viewDialog]
  );

  const handleCloseForm = useCallback(() => {
    formDialog.onFalse();
    if (!viewDialog.value) {
      setCurrentEvent(null);
    }
  }, [formDialog, viewDialog]);

  const handleCloseView = useCallback(() => {
    viewDialog.onFalse();
    if (!formDialog.value) {
      setCurrentEvent(null);
    }
  }, [formDialog, viewDialog]);

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
    deleteMockEvent(itemToDelete._id);
    toast.success('Event deleted successfully!');
    setIsDeleting(false);
    confirm.onFalse();
    setItemToDelete(null);
    refetch();
  }, [confirm, itemToDelete, refetch]);

  // New product collections go straight to adding products.
  const handleFormSuccess = useCallback(
    (saved, { created } = {}) => {
      refetch();
      if (created && saved?.type === 'product-collection') {
        setProductsEvent(hydrateEvent(saved));
      }
    },
    [refetch]
  );

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
          heading="Events"
          links={[{ name: 'Dashboard', href: paths.adminDashboard.root }, { name: 'Events' }]}
          action={
            <Button variant="contained" color="primary" startIcon={<Iconify icon="mingcute:add-line" />} onClick={handleOpenCreate}>
              New Event
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
              <Table size={isDense ? 'small' : 'medium'} sx={{ minWidth: 1380 }}>
                <TableHeadCustom headLabel={TABLE_HEAD} rowCount={dataList.length} />

                <TableBody>
                  {!isBusy &&
                    dataList.map((row, index) => (
                      <EventTableRow
                        key={row._id}
                        row={row}
                        serialNumber={calculateSerialNumber(currentPage, itemsPerPage, index)}
                        onViewRow={() => handleOpenView(row)}
                        onEditRow={() => handleOpenEdit(row)}
                        onManageProducts={() => setProductsEvent(row)}
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

      <EventViewDialog event={currentEvent} open={viewDialog.value} onClose={handleCloseView} />

      <EventFormDialog currentEvent={formDialog.value ? currentEvent : null} open={formDialog.value} onClose={handleCloseForm} onSuccess={handleFormSuccess} />

      <EventProductsDialog event={productsEvent} open={!!productsEvent} onClose={() => setProductsEvent(null)} onSaved={refetch} />

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
