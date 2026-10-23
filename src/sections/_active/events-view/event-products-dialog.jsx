import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';

import LoadingButton from '@mui/lab/LoadingButton';
import Autocomplete from '@mui/material/Autocomplete';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { toast } from 'src/components/snackbar';
import { fCurrency } from 'src/utils/format-number';

import { AddedByLabel, EventOptionRow, EventPriceText } from './event-shared';
import { getEligibleEventProducts, hydrateEvent, setMockEventProducts } from './mock';

// ----------------------------------------------------------------------

const toEntry = (row) => ({ productId: row.productId, sellerId: row.sellerId, addedBy: row.addedBy, addedAt: row.addedAt });

function AddProductsDialog({ event, excludeIds, open, onClose, onAdd }) {
  const [selected, setSelected] = useState([]);

  const options = useMemo(
    () => (open ? getEligibleEventProducts({ storeScope: event.storeScope, storeIds: event.storeIds }).filter((item) => !excludeIds.has(item._id)) : []),
    [event, excludeIds, open]
  );

  useEffect(() => {
    if (open) setSelected([]);
  }, [open]);

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <DialogTitle>Add products</DialogTitle>

      <DialogContent>
        <Stack spacing={1.5} sx={{ pt: 1 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Approved, active products from the stores this event is open to.
          </Typography>
          <Autocomplete
            multiple
            disableCloseOnSelect
            options={options}
            value={selected}
            onChange={(_, value) => setSelected(value)}
            groupBy={(option) => option.storeName}
            getOptionLabel={(option) => option.title || ''}
            isOptionEqualToValue={(option, value) => option._id === value._id}
            noOptionsText="No more products to add"
            renderOption={(props, option) => (
              <li {...props} key={option._id}>
                <EventOptionRow image={option.image} title={option.title} caption={fCurrency(option.price)} />
              </li>
            )}
            renderTags={(value, getTagProps) => value.map((option, index) => <Chip {...getTagProps({ index })} key={option._id} size="small" variant="soft" label={option.title} />)}
            renderInput={(params) => <TextField {...params} label="Products" placeholder="Search products" />}
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" color="inherit" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" color="primary" disabled={!selected.length} onClick={() => onAdd(selected)}>
          Add {selected.length || ''}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

AddProductsDialog.propTypes = {
  event: PropTypes.object.isRequired,
  excludeIds: PropTypes.object.isRequired,
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onAdd: PropTypes.func,
};

// ----------------------------------------------------------------------

export function EventProductsDialog({ event, open, onClose, onSaved }) {
  const [entries, setEntries] = useState([]);
  const [search, setSearch] = useState('');
  const [store, setStore] = useState('all');
  const [addOpen, setAddOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open && event) {
      setEntries((event.products || []).map(toEntry));
      setSearch('');
      setStore('all');
    }
  }, [open, event]);

  const rows = useMemo(() => (event ? hydrateEvent({ ...event, products: entries }).products : []), [event, entries]);

  const storeChoices = useMemo(() => [...new Map(rows.map((row) => [row.sellerId, row.storeName])).entries()].sort((a, b) => a[1].localeCompare(b[1])), [rows]);

  // Grouped by store, then title.
  const visibleRows = useMemo(() => {
    const query = search.trim().toLowerCase();
    return rows
      .filter((row) => (store === 'all' || row.sellerId === store) && (!query || row.title.toLowerCase().includes(query) || row.storeName.toLowerCase().includes(query)))
      .sort((a, b) => a.storeName.localeCompare(b.storeName) || a.title.localeCompare(b.title));
  }, [rows, search, store]);

  const existingIds = useMemo(() => new Set(entries.map((item) => item.productId)), [entries]);

  if (!event) return null;

  const handleAdd = (products) => {
    const now = new Date().toISOString();
    setEntries((current) => [...current, ...products.map((item) => ({ productId: item._id, sellerId: item.sellerId, addedBy: 'admin', addedAt: now }))]);
    setAddOpen(false);
  };

  const handleSave = async () => {
    if (!entries.length && event.runtimeStatus === 'active') {
      toast.error('A published, active event needs at least one product.');
      return;
    }

    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    setMockEventProducts(event._id, entries);
    setSaving(false);
    toast.success('Event products updated!');
    onSaved?.();
    onClose();
  };

  let lastStore = null;

  return (
    <>
      <Dialog fullWidth maxWidth="md" open={open} onClose={saving ? undefined : onClose}>
        <DialogTitle>
          Manage products
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {event.title} · {entries.length} {entries.length === 1 ? 'product' : 'products'}
          </Typography>
        </DialogTitle>

        <DialogContent>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mb: 2, pt: 1 }}>
            <TextField
              size="small"
              fullWidth
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products or stores..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                  </InputAdornment>
                ),
              }}
            />
            <TextField select size="small" label="Store" value={store} onChange={(e) => setStore(e.target.value)} sx={{ minWidth: 200 }}>
              <MenuItem value="all">All stores</MenuItem>
              {storeChoices.map(([sellerId, name]) => (
                <MenuItem key={sellerId} value={sellerId}>
                  {name}
                </MenuItem>
              ))}
            </TextField>
            <Button variant="contained" color="primary" startIcon={<Iconify icon="mingcute:add-line" />} onClick={() => setAddOpen(true)} sx={{ flexShrink: 0 }}>
              Add products
            </Button>
          </Stack>

          <Scrollbar>
            <Table size="small" sx={{ minWidth: 560 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell width={180}>Event price</TableCell>
                  <TableCell width={110}>Added by</TableCell>
                  <TableCell width={56} />
                </TableRow>
              </TableHead>

              <TableBody>
                {visibleRows.map((row) => {
                  const showGroup = row.storeName !== lastStore;
                  lastStore = row.storeName;

                  return [
                    showGroup && (
                      <TableRow key={`group-${row.sellerId}`}>
                        <TableCell colSpan={4} sx={{ bgcolor: 'background.neutral', typography: 'subtitle2', py: 1 }}>
                          {row.storeName}
                        </TableCell>
                      </TableRow>
                    ),
                    <TableRow key={row._id} hover sx={{ ...(!row.available && { '& > td:not(:last-of-type)': { opacity: 0.48 } }) }}>
                      <TableCell>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Avatar src={row.image} alt={row.title} variant="rounded" sx={{ width: 36, height: 36 }} />
                          <Box sx={{ minWidth: 0 }}>
                            <Typography variant="body2" noWrap sx={{ maxWidth: 300 }}>
                              {row.title}
                            </Typography>
                            {!row.available && (
                              <Tooltip arrow title="The product was switched off, rejected or deleted, so shoppers don't see it in this event.">
                                <Typography variant="caption" sx={{ color: 'error.main', cursor: 'help' }}>
                                  Hidden from customers
                                </Typography>
                              </Tooltip>
                            )}
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <EventPriceText regularPrice={row.regularPrice} pricing={row.pricing} />
                      </TableCell>
                      <TableCell>
                        <AddedByLabel addedBy={row.addedBy} />
                      </TableCell>
                      <TableCell>
                        <Tooltip title="Remove from event">
                          <IconButton color="error" onClick={() => setEntries((current) => current.filter((item) => item.productId !== row._id))}>
                            <Iconify icon="solar:trash-bin-trash-bold" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>,
                  ];
                })}

                {!visibleRows.length && (
                  <TableRow>
                    <TableCell colSpan={4} sx={{ py: 4, textAlign: 'center', color: 'text.secondary' }}>
                      {rows.length ? 'No products match your search.' : 'No products in this event yet.'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Scrollbar>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" color="inherit" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <LoadingButton variant="contained" color="primary" loading={saving} onClick={handleSave}>
            Save changes
          </LoadingButton>
        </DialogActions>
      </Dialog>

      <AddProductsDialog event={event} excludeIds={existingIds} open={addOpen} onClose={() => setAddOpen(false)} onAdd={handleAdd} />
    </>
  );
}

EventProductsDialog.propTypes = {
  event: PropTypes.object,
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onSaved: PropTypes.func,
};
