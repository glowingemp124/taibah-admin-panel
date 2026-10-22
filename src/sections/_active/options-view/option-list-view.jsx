import { useCallback, useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CircularProgress from '@mui/material/CircularProgress';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';

import { paths } from 'src/routes/paths';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { FlexibleTableFiltersResult } from 'src/components/generic-table/table-filters-result';
import { FlexibleTableToolbar } from 'src/components/generic-table/table-toolbar';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { toast } from 'src/components/snackbar';
import { TableEmptyRows, TableHeadCustom, TableNoData, TablePaginationCustom } from 'src/components/table';
import { useBoolean } from 'src/hooks/use-boolean';
import { useDataTable } from 'src/hooks/use-data-table';
import { calculateSerialNumber } from 'src/utils/table-utils';

import { deleteMockOption, isOptionInUse, useGetMockOptionsQuery } from './mock';
import { OptionFormDialog } from './option-form-dialog';
import { DEFAULT_FILTERS, FILTER_FIELDS, TABLE_HEAD, TABLE_OPTIONS } from './option-table-config';
import { OptionTableRow } from './option-table-row';

export function OptionListView() {
  const {
    filters,
    currentPage,
    itemsPerPage,
    searchDisplayValue,
    dataList,
    totalRecords,
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
    queryHook: useGetMockOptionsQuery,
    defaultFilters: DEFAULT_FILTERS,
    filterFields: FILTER_FIELDS,
    defaultRowsPerPage: 10,
    debounceMs: 500,
  });

  const formDialog = useBoolean();
  const confirm = useBoolean();
  const [currentOption, setCurrentOption] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleOpenCreate = useCallback(() => {
    setCurrentOption(null);
    formDialog.onTrue();
  }, [formDialog]);

  const handleOpenEdit = useCallback(
    (row) => {
      setCurrentOption(row);
      formDialog.onTrue();
    },
    [formDialog]
  );

  const handleCloseForm = useCallback(() => {
    formDialog.onFalse();
    setCurrentOption(null);
  }, [formDialog]);

  const handleDeleteRow = useCallback(
    (row) => {
      if (isOptionInUse(row._id)) {
        toast.error('This option is used by a category or product');
        return;
      }
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

    if (isOptionInUse(itemToDelete._id)) {
      toast.error('This option is used by a category or product');
    } else {
      deleteMockOption(itemToDelete._id);
      toast.success('Option deleted successfully!');
      refetch();
    }

    setIsDeleting(false);
    confirm.onFalse();
    setItemToDelete(null);
  }, [confirm, itemToDelete, refetch]);

  const isBusy = isLoading || isFetching;
  const notFound = !isBusy && dataList.length === 0;
  const isDense = TABLE_OPTIONS.dense;

  return (
    <>
      <Box sx={{ px: { xs: 2, md: 5 }, pb: 5, pt: 3, display: 'flex', flexDirection: 'column' }}>
        <CustomBreadcrumbs
          heading="Options"
          links={[{ name: 'Dashboard', href: paths.adminDashboard.root }, { name: 'Options' }]}
          action={
            <Button variant="contained" color="primary" startIcon={<Iconify icon="mingcute:add-line" />} onClick={handleOpenCreate}>
              New Option
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card>
          <FlexibleTableToolbar
            filterFields={FILTER_FIELDS}
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

          <Scrollbar>
            <Table size={isDense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
              <TableHeadCustom headLabel={TABLE_HEAD} rowCount={dataList.length} />

              <TableBody>
                {!isBusy &&
                  dataList.map((row, index) => (
                    <OptionTableRow
                      key={row._id}
                      row={row}
                      serialNumber={calculateSerialNumber(currentPage, itemsPerPage, index)}
                      onEditRow={() => handleOpenEdit(row)}
                      onDeleteRow={() => handleDeleteRow(row)}
                    />
                  ))}

                {isBusy && <TableEmptyRows height={isDense ? 56 : 76} emptyRows={itemsPerPage} />}

                <TableNoData notFound={notFound} />
              </TableBody>
            </Table>
          </Scrollbar>

          <TablePaginationCustom page={currentPage} count={totalRecords} rowsPerPage={itemsPerPage} rowsPerPageOptions={[]} onPageChange={handlePageChange} />
        </Card>
      </Box>

      <OptionFormDialog currentOption={currentOption} open={formDialog.value} onClose={handleCloseForm} onSuccess={refetch} />

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
