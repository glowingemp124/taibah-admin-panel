import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';

import LoadingButton from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { Label } from 'src/components/label';
import { Scrollbar } from 'src/components/scrollbar';
import { toast } from 'src/components/snackbar';
import { fCurrency } from 'src/utils/format-number';

import { getPrimaryImage, MOCK_PRODUCTS } from 'src/sections/_active/products-view/mock';

import { EventPriceText } from './event-shared';
import { eventPrice, isEventEligibleProduct, setSellerEventProducts } from './mock';

// ----------------------------------------------------------------------

export function SellerEventProductsDialog({ event, sellerId, open, onClose, onSaved }) {
  const [selected, setSelected] = useState(new Set());
  const [saving, setSaving] = useState(false);

  const adminIds = useMemo(
    () => new Set((event?.products || []).filter((item) => item.sellerId === sellerId && item.addedBy === 'admin').map((item) => item.productId)),
    [event, sellerId]
  );

  const rows = useMemo(() => {
    if (!event) return [];
    return MOCK_PRODUCTS.filter((product) => product.company?._id === sellerId && isEventEligibleProduct(product)).map((product) => ({
      product,
      pricing: eventPrice(product, event),
    }));
  }, [event, sellerId]);

  useEffect(() => {
    if (open && event) {
      setSelected(new Set((event.products || []).filter((item) => item.sellerId === sellerId).map((item) => item.productId)));
    }
  }, [open, event, sellerId]);

  if (!event) return null;

  const isActive = event.runtimeStatus === 'active';

  const toggle = (productId) => {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(productId)) next.delete(productId);
      else next.add(productId);
      return next;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    setSellerEventProducts(event._id, sellerId, [...selected]);
    setSaving(false);
    toast.success(isActive ? 'Your event products were updated and are live now.' : 'Your event products were saved.');
    onSaved?.();
    onClose();
  };

  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={saving ? undefined : onClose}>
      <DialogTitle>
        Choose products
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {event.title}
          {event.discountPercent ? ` · ${event.discountPercent}% event discount` : ''}
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          {isActive && <Alert severity="warning">Changes apply immediately.</Alert>}

          {rows.length ? (
            <Scrollbar>
              <Table size="small" sx={{ minWidth: 560 }}>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox" />
                    <TableCell>Product</TableCell>
                    <TableCell width={140}>Regular price</TableCell>
                    <TableCell width={180}>Price during event</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map(({ product, pricing }) => {
                    const addedByAdmin = adminIds.has(product._id);
                    const checked = selected.has(product._id);

                    return (
                      <TableRow key={product._id} hover selected={checked}>
                        <TableCell padding="checkbox">
                          <Checkbox checked={checked} onChange={() => toggle(product._id)} />
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={1.5} alignItems="center">
                            <Avatar src={getPrimaryImage(product)} alt={product.title} variant="rounded" sx={{ width: 36, height: 36 }} />
                            <Typography variant="body2" noWrap sx={{ maxWidth: 240 }}>
                              {product.title}
                            </Typography>
                            {addedByAdmin && (
                              <Tooltip arrow title="Taibah suggested this product for the event. You can remove it.">
                                <Box component="span" sx={{ display: 'inline-flex', flexShrink: 0 }}>
                                  <Label variant="soft" color="info">
                                    Added by Taibah
                                  </Label>
                                </Box>
                              </Tooltip>
                            )}
                          </Stack>
                        </TableCell>
                        <TableCell>{fCurrency(product.price)}</TableCell>
                        <TableCell>
                          <EventPriceText regularPrice={product.price} pricing={pricing} />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Scrollbar>
          ) : (
            <Box sx={{ py: 4, textAlign: 'center', color: 'text.secondary', typography: 'body2' }}>
              You have no approved, active products to add yet.
            </Box>
          )}

        </Stack>
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" color="inherit" onClick={onClose} disabled={saving}>
          Cancel
        </Button>
        <LoadingButton variant="contained" color="primary" loading={saving} onClick={handleSave} disabled={!rows.length}>
          Save
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}

SellerEventProductsDialog.propTypes = {
  event: PropTypes.object,
  sellerId: PropTypes.string,
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onSaved: PropTypes.func,
};
