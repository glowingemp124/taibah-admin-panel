import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { ColorPreview } from 'src/components/color-utils';
import { Iconify } from 'src/components/iconify';
import { Image } from 'src/components/image';
import { Label } from 'src/components/label';
import { fCurrency, fNumber, fShortenNumber } from 'src/utils/format-number';
import { fDate, formatStr } from 'src/utils/format-time';
import { getStatusColor } from 'src/utils/table-utils';

import { getPrimaryImage } from './mock';
import { ProductStoreCard } from './product-store-card';
import { getAvailabilityLabel, getColorLabel } from './product-table-config';

export function ProductViewDialog({ product, open, onClose }) {
  const images = product?.images || [];
  const [activeImage, setActiveImage] = useState('');

  useEffect(() => {
    if (open && product) {
      setActiveImage(getPrimaryImage(product));
    }
  }, [open, product]);

  if (!product) return null;

  const salePrice = product.salePrice || product.price;
  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const productRating = Math.round(product.rating || 0);

  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={onClose}>
      <DialogTitle>Product Details</DialogTitle>

      <DialogContent>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ pt: 1 }}>
          <Stack spacing={1.5} sx={{ width: { xs: 1, md: 320 }, flexShrink: 0 }}>
            <Image alt={product.title} src={activeImage} ratio="1/1" sx={{ borderRadius: 1.5 }} />

            {images.length > 1 && (
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {images.map((image, index) => {
                  const isPrimary = (product.primaryIndex ?? 0) === index;
                  const selected = activeImage === image;

                  return (
                    <Box
                      key={image + index}
                      onClick={() => setActiveImage(image)}
                      sx={{
                        width: 56,
                        height: 56,
                        cursor: 'pointer',
                        borderRadius: 1,
                        overflow: 'hidden',
                        border: (theme) => `2px solid ${selected ? theme.vars.palette.primary.main : theme.vars.palette.divider}`,
                        position: 'relative',
                      }}
                    >
                      <Image alt={`${product.title} ${index + 1}`} src={image} sx={{ width: 1, height: 1 }} />
                      {isPrimary && (
                        <Label
                          color="primary"
                          sx={{
                            position: 'absolute',
                            left: 2,
                            bottom: 2,
                            height: 16,
                            fontSize: 9,
                            px: 0.5,
                          }}
                        >
                          Primary
                        </Label>
                      )}
                    </Box>
                  );
                })}
              </Stack>
            )}
          </Stack>

          <Stack spacing={1.75} sx={{ minWidth: 0, flex: 1 }}>
            <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 600 }}>
              {product.category}
            </Typography>

            <Typography variant="h5">{product.title}</Typography>

            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
              <Rating size="small" value={productRating} readOnly />
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {productRating}/5 ({fShortenNumber(product.totalReviews || 0)} reviews)
              </Typography>
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
              <Typography variant="h4" sx={{ color: 'primary.main' }}>
                {fCurrency(salePrice)}
              </Typography>
              {hasDiscount && (
                <Typography variant="h6" sx={{ color: 'text.disabled', textDecoration: 'line-through' }}>
                  {fCurrency(product.price)}
                </Typography>
              )}
              {!!product.offPercent && (
                <Label variant="soft" color="warning">
                  {product.offPercent}% Off
                </Label>
              )}
            </Stack>

            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {product.description}
            </Typography>

            {!!product.features?.length && (
              <Stack spacing={0.5}>
                {product.features.map((feature) => (
                  <Typography key={feature} variant="body2">
                    • {feature}
                  </Typography>
                ))}
              </Stack>
            )}

            <Stack spacing={0.75}>
              <Typography variant="subtitle2">Colors</Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <ColorPreview colors={product.colors || []} limit={8} sx={{ justifyContent: 'flex-start' }} />
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {(product.colors || []).map(getColorLabel).join(', ') || 'N/A'}
                </Typography>
              </Stack>
            </Stack>

            <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" useFlexGap>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="subtitle2">Availability</Typography>
                <Label variant="soft" color={getStatusColor(product.availability)}>
                  {getAvailabilityLabel(product.availability)}
                </Label>
              </Stack>

              <Stack direction="row" spacing={0.75} alignItems="center" sx={{ color: 'text.secondary' }}>
                <Iconify icon="solar:bag-check-bold" width={18} />
                <Typography variant="body2">
                  {fNumber(product.soldCount || 0)} sold
                </Typography>
              </Stack>
            </Stack>

            <ProductStoreCard company={product.company} />
          </Stack>
        </Stack>

        {!!product.reviews?.length && (
          <>
            <Divider sx={{ my: 3 }} />
            <Typography variant="h6" sx={{ mb: 2 }}>
              Reviews
            </Typography>
            <Stack spacing={2}>
              {product.reviews.map((review) => (
                <Stack key={review._id} direction="row" spacing={1.5} alignItems="flex-start">
                  <Avatar src={review.avatarUrl} alt={review.name} />
                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between" flexWrap="wrap" useFlexGap>
                      <Typography variant="subtitle2">{review.name}</Typography>
                      <Rating size="small" value={Math.round(review.rating || 0)} readOnly />
                    </Stack>
                    <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                      {review.createdAt ? fDate(review.createdAt, formatStr.paramCase.date) : ''}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.75 }}>
                      {review.comment}
                    </Typography>
                  </Box>
                </Stack>
              ))}
            </Stack>
          </>
        )}
      </DialogContent>

      <DialogActions>
        <Button variant="contained" color="primary" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

ProductViewDialog.propTypes = {
  product: PropTypes.object,
  open: PropTypes.bool,
  onClose: PropTypes.func,
};
