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
import { TableEmptyRows, TableHeadCustom, TableNoData, TablePaginationCustom } from 'src/components/table';
import { useDataTable } from 'src/hooks/use-data-table';
import { useBoolean } from 'src/hooks/use-boolean';
import { useDeleteConfirmation } from 'src/hooks/use-delete-confirmation';
import { useDeleteCategoryMutation } from 'src/store/Reducer/categories-api';
import { calculateSerialNumber } from 'src/utils/table-utils';

import { CategoryFormDialog } from './category-form-dialog';
import { CategoryTableRow } from './category-table-row';
import { DEFAULT_FILTERS, FILTER_FIELDS, STATUS_FILTER_FIELD, TABLE_HEAD, TABLE_OPTIONS, TOOLBAR_FILTER_FIELDS } from './category-table-config';
import { useGetMockCategoriesQuery } from './mock';

export function CategoryListView() {
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
  } = useDataTable({
    queryHook: useGetMockCategoriesQuery,
    defaultFilters: DEFAULT_FILTERS,
    filterFields: FILTER_FIELDS,
    defaultRowsPerPage: 10,
    debounceMs: 500,
  });

  const formDialog = useBoolean();
  const [currentCategory, setCurrentCategory] = useState(null);

  const { confirm, itemToDelete, isDeleting, handleDeleteRow, handleConfirmDelete, handleCancelDelete } = useDeleteConfirmation(useDeleteCategoryMutation, {
    successMessage: 'Category deleted successfully!',
    errorMessage: 'Failed to delete category',
  });

  const handleOpenCreate = useCallback(() => {
    setCurrentCategory(null);
    formDialog.onTrue();
  }, [formDialog]);

  const handleOpenEdit = useCallback(
    (row) => {
      setCurrentCategory(row);
      formDialog.onTrue();
    },
    [formDialog]
  );

  const handleCloseForm = useCallback(() => {
    formDialog.onFalse();
    setCurrentCategory(null);
  }, [formDialog]);

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
          heading="Categories"
          links={[{ name: 'Dashboard', href: paths.adminDashboard.root }, { name: 'Categories' }]}
          action={
            <Button variant="contained" color="primary" startIcon={<Iconify icon="mingcute:add-line" />} onClick={handleOpenCreate}>
              New Category
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
              <Table size={isDense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
                <TableHeadCustom headLabel={TABLE_HEAD} rowCount={dataList.length} />

                <TableBody>
                  {!isBusy &&
                    dataList.map((row, index) => (
                      <CategoryTableRow
                        key={row._id}
                        row={row}
                        serialNumber={calculateSerialNumber(currentPage, itemsPerPage, index)}
                        onEditRow={() => handleOpenEdit(row)}
                        onDeleteRow={() => handleDeleteRow(row._id, row.title || row.name)}
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

      <CategoryFormDialog currentCategory={currentCategory} open={formDialog.value} onClose={handleCloseForm} />

      <ConfirmDialog
        open={confirm.value}
        onClose={handleCancelDelete}
        title="Delete"
        content={
          <>
            Are you sure you want to delete <strong>{itemToDelete?.name}</strong>? This action cannot be undone.
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
