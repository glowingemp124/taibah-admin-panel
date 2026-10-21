import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';

import { ColorPreview } from 'src/components/color-utils';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { EmptyContent } from 'src/components/empty-content';
import { Iconify } from 'src/components/iconify';
import { Image } from 'src/components/image';
import { Label } from 'src/components/label';
import { fCurrency, fNumber, fShortenNumber } from 'src/utils/format-number';
import { fDate, formatStr } from 'src/utils/format-time';
import { getStatusColor } from 'src/utils/table-utils';

import { useAppRole } from 'src/hooks/use-app-role';

import { getPrimaryImage, MOCK_PRODUCTS } from './mock';
import { ProductStoreCard } from './product-store-card';
import { getDiscountedPrice, getProductStatusLabel } from './product-table-config';

function Gallery({ product }) {
  const images = product.images || [];
  const [activeImage, setActiveImage] = useState(getPrimaryImage(product));

  useEffect(() => {
    setActiveImage(getPrimaryImage(product));
  }, [product]);

  return (
    <Stack spacing={1.5}>
      <Image alt={product.title} src={activeImage} ratio="1/1" sx={{ borderRadius: 2 }} />

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
                  width: 72,
                  height: 72,
                  cursor: 'pointer',
                  borderRadius: 1,
                  overflow: 'hidden',
                  border: (theme) => `2px solid ${selected ? theme.vars.palette.primary.main : theme.vars.palette.divider}`,
                  position: 'relative',
                }}
              >
                <Image alt={`${product.title} ${index + 1}`} src={image} sx={{ width: 1, height: 1 }} />
                {isPrimary && (
                  <Label color="primary" sx={{ position: 'absolute', left: 4, bottom: 4, height: 18, fontSize: 10, px: 0.5 }}>
                    Primary
                  </Label>
                )}
              </Box>
            );
          })}
        </Stack>
      )}
    </Stack>
  );
}

export function ProductDetailsView() {
  const { id } = useParams();
  const { appPaths } = useAppRole();
  const [product, setProduct] = useState(() => MOCK_PRODUCTS.find((row) => row._id === id) || null);

  useEffect(() => {
    setProduct(MOCK_PRODUCTS.find((row) => row._id === id) || null);
  }, [id]);

  const salePrice = getDiscountedPrice(product?.price, product?.offPercent) || product?.price;
  const hasDiscount = Number(product?.offPercent) > 0;
  const productRating = Math.round(product?.rating || 0);

  const specRows = useMemo(() => {
    if (!product) return [];

    return [
      { label: 'Category', value: product.category || 'N/A' },
      { label: 'Status', value: getProductStatusLabel(product.status) },
      { label: 'Quantity', value: fNumber(product.quantity ?? 0) },
      { label: 'Sold', value: fNumber(product.soldCount || 0) },
      { label: 'Created', value: product.createdAt ? fDate(product.createdAt, formatStr.paramCase.date) : 'N/A' },
      {
        label: 'Discount ends',
        value: Number(product.offPercent) > 0 && product.discountEndsAt ? fDate(product.discountEndsAt, formatStr.paramCase.date) : 'N/A',
      },
      { label: 'Product ID', value: product._id },
    ];
  }, [product]);

  if (!product) {
    return (
      <Box sx={{ px: { xs: 2, md: 5 }, pb: 5, pt: 3 }}>
        <CustomBreadcrumbs
          heading="Product details"
          links={[{ name: 'Dashboard', href: appPaths.root }, { name: 'Products', href: appPaths.products.root }, { name: 'Details' }]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        <EmptyContent
          filled
          title="Product not found"
          description="This product does not exist or has been removed."
          action={
            <Button component={RouterLink} href={appPaths.products.root} variant="contained" color="primary">
              Back to products
            </Button>
          }
          sx={{ py: 10 }}
        />
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ px: { xs: 2, md: 5 }, pb: 5, pt: 3 }}>
        <CustomBreadcrumbs
          heading={product.title}
          links={[
            { name: 'Dashboard', href: appPaths.root },
            { name: 'Products', href: appPaths.products.root },
            { name: product.title },
          ]}
          action={
            <Stack direction="row" spacing={1.5}>
              <Button component={RouterLink} href={appPaths.products.root} variant="outlined" color="primary" startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}>
                Back
              </Button>
              <Button component={RouterLink} href={appPaths.products.edit(product._id)} variant="contained" color="primary" startIcon={<Iconify icon="solar:pen-bold" />}>
                Edit
              </Button>
            </Stack>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card sx={{ p: { xs: 2.5, md: 3 } }}>
          <Box
            sx={{
              display: 'grid',
              gap: 4,
              gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 420px) minmax(0, 1fr)' },
            }}
          >
            <Gallery product={product} />

            <Stack spacing={2.5}>
              <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 600 }}>
                {product.category}
              </Typography>

              <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                <Typography variant="h4">{product.title}</Typography>
                <Label variant="soft" color={getStatusColor(product.status)}>
                  {getProductStatusLabel(product.status)}
                </Label>
              </Stack>

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
                {hasDiscount && product.discountEndsAt && (
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Until {fDate(product.discountEndsAt, formatStr.paramCase.date)}
                  </Typography>
                )}
              </Stack>

              <Typography variant="body1" sx={{ color: 'text.secondary', whiteSpace: 'pre-wrap' }}>
                {product.description}
              </Typography>

              {!!product.features?.length && (
                <Stack spacing={0.75}>
                  <Typography variant="subtitle2">Features</Typography>
                  {product.features.map((feature) => (
                    <Stack key={feature} direction="row" spacing={1} alignItems="flex-start">
                      <Iconify icon="eva:checkmark-fill" width={18} sx={{ mt: 0.25, color: 'primary.main' }} />
                      <Typography variant="body2">{feature}</Typography>
                    </Stack>
                  ))}
                </Stack>
              )}

              <Stack spacing={0.75}>
                <Typography variant="subtitle2">Colors</Typography>
                <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                  <ColorPreview colors={product.colors || []} limit={8} sx={{ justifyContent: 'flex-start' }} />
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {(product.colors || []).join(', ') || 'N/A'}
                  </Typography>
                </Stack>
              </Stack>

              <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" useFlexGap>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Quantity: {fNumber(product.quantity ?? 0)}
                </Typography>
                <Stack direction="row" spacing={0.75} alignItems="center" sx={{ color: 'text.secondary' }}>
                  <Iconify icon="solar:bag-check-bold" width={18} />
                  <Typography variant="body2">{fNumber(product.soldCount || 0)} sold</Typography>
                </Stack>
              </Stack>

              <Divider sx={{ borderStyle: 'dashed' }} />

              <Box
                sx={{
                  display: 'grid',
                  gap: 1.5,
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                }}
              >
                {specRows.map((row) => (
                  <Stack key={row.label} spacing={0.25}>
                    <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                      {row.label}
                    </Typography>
                    <Typography variant="subtitle2">{row.value}</Typography>
                  </Stack>
                ))}
              </Box>

              <ProductStoreCard company={product.company} />
            </Stack>
          </Box>
        </Card>

        <Card sx={{ mt: 3, p: { xs: 2.5, md: 3 } }}>
          <Typography variant="h6" sx={{ mb: 2.5 }}>
            Reviews ({product.reviews?.length || 0})
          </Typography>

          {product.reviews?.length ? (
            <Stack spacing={2.5} divider={<Divider sx={{ borderStyle: 'dashed' }} />}>
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
          ) : (
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              No reviews yet for this product.
            </Typography>
          )}
        </Card>
      </Box>
    </>
  );
}
