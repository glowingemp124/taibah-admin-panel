import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

import { paths } from 'src/routes/paths';

import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { createFilterField } from 'src/components/generic-table/table-filter-fields';
import { FlexibleTableToolbar } from 'src/components/generic-table/table-toolbar';
import { StatusTabsFilterWrapper } from 'src/components/generic-table/tabs-filter-wrapper';
import { GenericTableRowActions } from 'src/components/generic-table/table-row-actions';
import { Label } from 'src/components/label';
import { Scrollbar } from 'src/components/scrollbar';
import { toast } from 'src/components/snackbar';
import { TableHeadCustom, TableNoData, TablePaginationCustom } from 'src/components/table';
import { fDate, formatStr } from 'src/utils/format-time';

import { getSellerApplications, reviewSellerApplication } from './mock';
import { PendingSellerViewDialog } from './pending-seller-view-dialog';
import { isApprovedStatus } from 'src/utils/seller-status';

const TABLE_HEAD = [
  { id: 'sr', label: 'Sr#', width: 64 },
  { id: 'seller', label: 'Seller' },
  { id: 'store', label: 'Store', width: 200 },
  { id: 'phone', label: 'Phone', width: 160 },
  { id: 'submitted', label: 'Submitted', width: 140 },
  { id: 'status', label: 'Verification', width: 140 },
  { id: 'action', label: 'Action', width: 88 },
];

const STATUS_FILTER_FIELD = createFilterField.status({
  defaultValue: 'pending',
  options: [
    { value: 'pending', label: 'Pending', color: 'warning' },
    { value: 'rejected', label: 'Rejected', color: 'error' },
  ],
  showCounts: true,
});

const TOOLBAR_FILTER_FIELDS = [
  createFilterField.search({
    placeholder: 'Search name, email or store...',
  }),
];

function verificationColor(status) {
  if (isApprovedStatus(status)) return 'success';
  if (status === 'rejected') return 'error';
  return 'warning';
}

export function PendingSellerListView() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('pending');
  const [page, setPage] = useState(0);
  const [revision, setRevision] = useState(0);
  const [selected, setSelected] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const rowsPerPage = 10;

  const applications = useMemo(() => getSellerApplications(), [revision]);

  // ?review=<applicant user ID> (from a seller_application notification) opens that review, then clears the URL.
  const [searchParams, setSearchParams] = useSearchParams();
  const reviewId = searchParams.get('review');

  useEffect(() => {
    if (!reviewId) return;
    const application = applications.find((row) => row.userId === reviewId);
    if (application) {
      setStatus(application.verificationStatus || 'pending');
      setSelected(application);
    }

    const next = new URLSearchParams(searchParams);
    next.delete('review');
    setSearchParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reviewId]);

  const counts = useMemo(
    () =>
      applications.reduce((acc, row) => {
        const key = row.verificationStatus || 'pending';
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {}),
    [applications]
  );

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return applications.filter((row) => {
      const rowStatus = row.verificationStatus || 'pending';
      if (status && rowStatus !== status) return false;
      if (!query) return true;

      const haystack = [row.firstName, row.lastName, row.email, row.storeName, row.phone]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [applications, search, status]);

  const paged = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const notFound = filtered.length === 0;

  const handleReview = (nextStatus) => {
    if (!selected) return;
    reviewSellerApplication(selected, nextStatus);
    toast.success(nextStatus === 'verified' ? 'Seller approved.' : 'Seller rejected.');
    setConfirmAction(null);
    setSelected(null);
    setRevision((value) => value + 1);
  };

  return (
    <>
      <Box sx={{ px: { xs: 2, md: 5 }, pb: 5, pt: 3 }}>
        <CustomBreadcrumbs
          heading="Pending Sellers"
          links={[{ name: 'Dashboard', href: paths.adminDashboard.root }, { name: 'Pending Sellers' }]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card>
          <StatusTabsFilterWrapper
            filterField={STATUS_FILTER_FIELD}
            value={status}
            onChange={(key, nextStatus) => {
              setStatus(nextStatus || 'pending');
              setPage(0);
            }}
            getCount={(value) => counts[value] || 0}
          />

          <FlexibleTableToolbar
            filterFields={TOOLBAR_FILTER_FIELDS}
            filterValues={{ search }}
            onFilterChange={() => {}}
            onSearchChange={(event) => {
              setSearch(event.target.value);
              setPage(0);
            }}
          />

          <Box sx={{ position: 'relative' }}>
            <Scrollbar>
              <Table size="small" sx={{ minWidth: 880 }}>
                <TableHeadCustom headLabel={TABLE_HEAD} />
                <TableBody>
                  {paged.map((row, index) => {
                    const name = [row.firstName, row.lastName].filter(Boolean).join(' ') || 'N/A';
                    const rowStatus = row.verificationStatus || 'pending';

                    return (
                      <TableRow key={row.email || row.userId} hover>
                        <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                        <TableCell>
                          <Stack sx={{ typography: 'body2' }}>
                            <Box component="span">{name}</Box>
                            <Box component="span" sx={{ color: 'text.disabled' }}>
                              {row.email}
                            </Box>
                          </Stack>
                        </TableCell>
                        <TableCell>{row.storeName || '—'}</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.phone || '—'}</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>
                          {row.createdAt ? fDate(row.createdAt, formatStr.paramCase.date) : '—'}
                        </TableCell>
                        <TableCell>
                          <Label variant="soft" color={verificationColor(rowStatus)}>
                            {rowStatus}
                          </Label>
                        </TableCell>
                        <TableCell>
                          <GenericTableRowActions
                            actions={[
                              {
                                key: 'view',
                                icon: 'solar:eye-bold',
                                tooltip: 'View',
                                onClick: () => setSelected(row),
                              },
                            ]}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </Box>

          <TablePaginationCustom
            page={page}
            count={filtered.length}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[]}
            onPageChange={(_, nextPage) => setPage(nextPage)}
          />
        </Card>
      </Box>

      <PendingSellerViewDialog
        application={selected}
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        onApprove={() => setConfirmAction('verified')}
        onReject={() => setConfirmAction('rejected')}
      />

      <ConfirmDialog
        open={Boolean(confirmAction)}
        onClose={() => setConfirmAction(null)}
        title={confirmAction === 'verified' ? 'Approve seller' : 'Reject seller'}
        content={
          <>
            {confirmAction === 'verified' ? 'Approve' : 'Reject'}{' '}
            <strong>
              {[selected?.firstName, selected?.lastName].filter(Boolean).join(' ') || selected?.email}
            </strong>
            {confirmAction === 'verified' ? '? They will appear in Sellers.' : '? They will stay in the rejected list.'}
          </>
        }
        action={
          <Button variant="contained" color="primary" onClick={() => handleReview(confirmAction)}>
            {confirmAction === 'verified' ? 'Approve' : 'Reject'}
          </Button>
        }
      />
    </>
  );
}
