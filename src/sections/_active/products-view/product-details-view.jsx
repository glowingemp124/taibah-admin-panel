import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { EmptyContent } from 'src/components/empty-content';
import { Iconify } from 'src/components/iconify';
import { Image } from 'src/components/image';
import { Label } from 'src/components/label';
import { Scrollbar } from 'src/components/scrollbar';
import { fCurrency, fNumber, fShortenNumber } from 'src/utils/format-number';
import { fDate, formatStr } from 'src/utils/format-time';
import { getStatusColor } from 'src/utils/table-utils';

import { useAppRole } from 'src/hooks/use-app-role';

import { eventPrice, getProductEvents } from 'src/sections/_active/events-view/mock';
import { ColorSwatch, OptionValueLabel } from 'src/sections/_active/options-view';

import { findMockProduct, getProductStore } from './mock';
import { ProductRejectDialog } from './product-reject-dialog';
import { ProductReviewLabel } from './product-review-label';
import { ProductStoreCard } from './product-store-card';
import { getProductStatusLabel } from './product-table-config';
import { getVariantLabel, summarizeProduct } from './product-utils';
import { useProductReview } from './use-product-review';

// ----------------------------------------------------------------------

const toOptionMap = (variant) => Object.fromEntries((variant?.options || []).map((option) => [option.attribute._id, option.value]));

const fDay = (value) => (value ? fDate(value, formatStr.paramCase.date) : null);

// The options a product actually uses, in the order they appear on its variants.
function getProductAttributes(variants = []) {
  const attributes = new Map();

  variants.forEach((variant) => {
    (variant.options || []).forEach((option) => {
      const current = attributes.get(option.attribute._id) || { ...option.attribute, values: [] };
      if (!current.values.some((item) => item.value === option.value)) {
        current.values.push({ value: option.value, label: option.label });
      }
      attributes.set(option.attribute._id, current);
    });
  });

  return [...attributes.values()];
}

function Gallery({ title, images }) {
  const [activeImage, setActiveImage] = useState(images[0] || '');

  useEffect(() => {
    setActiveImage(images[0] || '');
  }, [images]);

  return (
    <Stack spacing={1.5}>
      <Image alt={title} src={activeImage} ratio="1/1" sx={{ borderRadius: 2 }} />

      {images.length > 1 && (
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {images.map((image, index) => {
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
                <Image alt={`${title} ${index + 1}`} src={image} sx={{ width: 1, height: 1 }} />
                {index === 0 && (
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

Gallery.propTypes = {
  title: PropTypes.string,
  images: PropTypes.array,
};

function VariantOptionsCell({ variant }) {
  if (!variant.options?.length) return getVariantLabel(variant);

  return (
    <Stack direction="row" spacing={1} alignItems="center" divider={<Box component="span" sx={{ color: 'text.disabled' }}>/</Box>}>
      {variant.options.map((option) => (
        <OptionValueLabel key={option.attribute._id} type={option.attribute.type} value={option.value} label={option.label} />
      ))}
    </Stack>
  );
}

VariantOptionsCell.propTypes = {
  variant: PropTypes.object.isRequired,
};

// ----------------------------------------------------------------------

export function ProductDetailsView() {
  const { id } = useParams();
  const { appPaths, isSeller, sellerStatus } = useAppRole();

  const loadProduct = useCallback(() => {
    const row = findMockProduct(id);
    return row ? summarizeProduct(row) : null;
  }, [id]);

  const [product, setProduct] = useState(loadProduct);
  const [selected, setSelected] = useState(() => toOptionMap(product?.variants?.[0]));

  useEffect(() => {
    const next = loadProduct();
    setProduct(next);
    setSelected(toOptionMap(next?.variants?.[0]));
  }, [loadProduct]);

  const reload = useCallback(() => setProduct(loadProduct()), [loadProduct]);
  const review = useProductReview(reload);

  const variants = useMemo(() => product?.variants || [], [product]);
  const attributes = useMemo(
    () => (Array.isArray(product?.optionGroups) ? product.optionGroups.map((group) => ({ ...group.attribute, values: group.values })) : getProductAttributes(variants)),
    [product, variants]
  );

  const selectedVariant = useMemo(
    () => variants.find((variant) => attributes.every((attribute) => toOptionMap(variant)[attribute._id] === selected[attribute._id])) || variants[0] || null,
    [variants, attributes, selected]
  );

  const galleryImages = useMemo(() => (selectedVariant?.images?.length ? selectedVariant.images : product?.images || []), [selectedVariant, product]);

  // Pick the exact combination when it exists, otherwise jump to the first variant with that value.
  const handlePick = (attributeId, value) => {
    const next = { ...selected, [attributeId]: value };
    const exact = variants.some((variant) => attributes.every((attribute) => toOptionMap(variant)[attribute._id] === next[attribute._id]));

    if (exact) {
      setSelected(next);
      return;
    }

    const fallback = variants.find((variant) => toOptionMap(variant)[attributeId] === value);
    setSelected(toOptionMap(fallback));
  };

  const isAvailable = (attributeId, value) => {
    const next = { ...selected, [attributeId]: value };
    return variants.some((variant) => attributes.every((attribute) => toOptionMap(variant)[attribute._id] === next[attribute._id]));
  };

  const infoRows = useMemo(() => {
    if (!product) return [];

    const discountDates = [fDay(product.discountStartsAt), fDay(product.discountEndsAt)];
    const discount =
      Number(product.offPercent) > 0
        ? `${product.offPercent}% · ${discountDates[0] || 'Now'} – ${discountDates[1] || 'No end'}${product.onSale ? '' : ' (not active today)'}`
        : 'None';

    return [
      { label: 'Category', value: product.category?.title || 'N/A' },
      { label: 'Unit', value: product.category?.unit || 'N/A' },
      { label: 'Discount', value: discount },
      { label: 'Status', value: getProductStatusLabel(product.status) },
      { label: 'Created', value: fDay(product.createdAt) || 'N/A' },
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

  const productRating = Math.round(product.rating || 0);
  const canReview = !isSeller && (product.reviewStatus === 'pending' || product.reviewStatus === 'rejected');
  const productEvents = getProductEvents(product._id);
  const variantOnSale = product.onSale && selectedVariant?.salePrice != null;

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
            <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
              <Button component={RouterLink} href={appPaths.products.root} variant="outlined" color="primary" startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}>
                Back
              </Button>
              {canReview && (
                <>
                  <Button variant="contained" color="success" startIcon={<Iconify icon="solar:check-circle-bold" />} onClick={() => review.approve(product)}>
                    Approve
                  </Button>
                  <Button variant="outlined" color="error" startIcon={<Iconify icon="solar:close-circle-bold" />} onClick={() => review.openReject(product)}>
                    Reject
                  </Button>
                </>
              )}
              <Button
                component={RouterLink}
                href={appPaths.products.edit(product._id)}
                variant="contained"
                color="primary"
                startIcon={<Iconify icon="solar:pen-bold" />}
                disabled={isSeller && sellerStatus !== 'approved'}
              >
                Edit
              </Button>
            </Stack>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        {product.reviewStatus === 'rejected' && (
          <Alert severity="error" sx={{ mb: 3 }}>
            <AlertTitle>Rejected{product.reviewedAt ? ` on ${fDay(product.reviewedAt)}` : ''}</AlertTitle>
            {product.reviewReason || 'No reason was given.'}
            {isSeller && ' Edit the product and save it to send it back to review.'}
          </Alert>
        )}

        {product.reviewStatus === 'pending' && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            {isSeller ? 'This product is waiting for admin review and is not visible to customers yet.' : 'This product is waiting for your review.'}
          </Alert>
        )}

        <Card sx={{ p: { xs: 2.5, md: 3 } }}>
          <Box
            sx={{
              display: 'grid',
              gap: 4,
              gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 420px) minmax(0, 1fr)' },
            }}
          >
            <Gallery title={product.title} images={galleryImages} />

            <Stack spacing={2.5}>
              <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 600 }}>
                {product.category?.title}
              </Typography>

              <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                <Typography variant="h4">{product.title}</Typography>
                <Label variant="soft" color={getStatusColor(product.status)}>
                  {getProductStatusLabel(product.status)}
                </Label>
                <ProductReviewLabel reviewStatus={product.reviewStatus} reviewReason={product.reviewReason} />
              </Stack>

              <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                <Rating size="small" value={productRating} readOnly />
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {productRating}/5 ({fShortenNumber(product.totalReviews || 0)} reviews)
                </Typography>
              </Stack>

              {attributes.map((attribute) => (
                <Stack key={attribute._id} spacing={1}>
                  <Typography variant="subtitle2">
                    {attribute.name}
                    <Box component="span" sx={{ color: 'text.secondary', fontWeight: 400 }}>
                      {' '}
                      · {attribute.values.find((item) => item.value === selected[attribute._id])?.label || '—'}
                    </Box>
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {attribute.values.map((item) => {
                      const active = selected[attribute._id] === item.value;
                      return (
                        <Chip
                          key={item.value}
                          label={item.label}
                          clickable
                          color={active ? 'primary' : 'default'}
                          variant={active ? 'filled' : 'outlined'}
                          icon={attribute.type === 'color' ? <ColorSwatch color={item.value} size={16} sx={{ ml: '8px !important' }} /> : undefined}
                          onClick={() => handlePick(attribute._id, item.value)}
                          sx={{ ...(!active && !isAvailable(attribute._id, item.value) && { opacity: 0.48 }) }}
                        />
                      );
                    })}
                  </Stack>
                </Stack>
              ))}

              {selectedVariant && (
                <Stack spacing={1}>
                  <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                    <Typography variant="h4" sx={{ color: 'primary.main' }}>
                      {fCurrency(variantOnSale ? selectedVariant.salePrice : selectedVariant.price)}
                    </Typography>
                    {variantOnSale && (
                      <Typography variant="h6" sx={{ color: 'text.disabled', textDecoration: 'line-through' }}>
                        {fCurrency(selectedVariant.price)}
                      </Typography>
                    )}
                    {product.onSale && (
                      <Label variant="soft" color="warning">
                        {product.offPercent}% Off
                      </Label>
                    )}
                    {product.onSale && product.discountEndsAt && (
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        Until {fDay(product.discountEndsAt)}
                      </Typography>
                    )}
                  </Stack>

                  <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" useFlexGap sx={{ color: 'text.secondary' }}>
                    {selectedVariant.stock > 0 ? (
                      <Typography variant="body2">Stock: {fNumber(selectedVariant.stock)}</Typography>
                    ) : (
                      <Label variant="soft" color="error">
                        Out of stock
                      </Label>
                    )}
                    <Typography variant="body2">SKU: {selectedVariant.sku || '—'}</Typography>
                    {selectedVariant.amount && <Typography variant="body2">Size: {getVariantLabel(selectedVariant)}</Typography>}
                    <Stack direction="row" spacing={0.75} alignItems="center">
                      <Iconify icon="solar:bag-check-bold" width={18} />
                      <Typography variant="body2">{fNumber(product.soldCount || 0)} sold</Typography>
                    </Stack>
                  </Stack>
                </Stack>
              )}

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

              <Divider sx={{ borderStyle: 'dashed' }} />

              <Box
                sx={{
                  display: 'grid',
                  gap: 1.5,
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                }}
              >
                {infoRows.map((row) => (
                  <Stack key={row.label} spacing={0.25}>
                    <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                      {row.label}
                    </Typography>
                    <Typography variant="subtitle2">{row.value}</Typography>
                  </Stack>
                ))}

                <Stack spacing={0.25}>
                  <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                    Review status
                  </Typography>
                  <Box>
                    <ProductReviewLabel reviewStatus={product.reviewStatus} reviewReason={product.reviewReason} />
                  </Box>
                  {product.reviewStatus === 'rejected' && product.reviewReason && (
                    <Typography variant="caption" sx={{ color: 'error.main' }}>
                      {product.reviewReason}
                    </Typography>
                  )}
                </Stack>

                <Stack spacing={0.25} sx={{ gridColumn: '1 / -1' }}>
                  <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                    Events
                  </Typography>
                  {productEvents.length ? (
                    productEvents.map(({ event, runtimeStatus }) => {
                      const pricing = eventPrice(product, event);
                      return (
                        <Stack key={event._id} direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                          <Typography variant="subtitle2">{event.title}</Typography>
                          <Label variant="soft" color={getStatusColor(runtimeStatus)}>
                            {runtimeStatus === 'active' ? 'Active' : 'Upcoming'}
                          </Label>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {fDay(event.startAt)} – {fDay(event.endAt)} · {fCurrency(pricing.price)}
                            {pricing.percent > 0 && ` (${pricing.percent}% ${pricing.source === 'event' ? 'event' : 'own'} discount)`}
                          </Typography>
                        </Stack>
                      );
                    })
                  ) : (
                    <Typography variant="subtitle2">Not in any current or upcoming event</Typography>
                  )}
                </Stack>
              </Box>

              <ProductStoreCard company={getProductStore(product) || product.company} />
            </Stack>
          </Box>
        </Card>

        <Card sx={{ mt: 3 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: { xs: 2.5, md: 3 }, pb: 2 }}>
            <Typography variant="h6">Variants ({variants.length})</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Total stock {fNumber(product.stock)}
            </Typography>
          </Stack>

          <Scrollbar>
            <Table size="small" sx={{ minWidth: 640 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Variant</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Sale price</TableCell>
                  <TableCell>Stock</TableCell>
                  <TableCell>SKU</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {variants.map((variant) => (
                  <TableRow
                    key={variant._id}
                    hover
                    selected={variant._id === selectedVariant?._id}
                    onClick={() => variant.options?.length && setSelected(toOptionMap(variant))}
                    sx={{ cursor: variant.options?.length ? 'pointer' : 'default' }}
                  >
                    <TableCell>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        {!!variant.images?.length && <Avatar src={variant.images[0]} variant="rounded" sx={{ width: 32, height: 32 }} />}
                        <VariantOptionsCell variant={variant} />
                      </Stack>
                    </TableCell>
                    <TableCell>{fCurrency(variant.price)}</TableCell>
                    <TableCell>{variant.salePrice != null ? fCurrency(variant.salePrice) : '—'}</TableCell>
                    <TableCell>
                      {variant.stock > 0 ? (
                        fNumber(variant.stock)
                      ) : (
                        <Label variant="soft" color="error">
                          Out of stock
                        </Label>
                      )}
                    </TableCell>
                    <TableCell>{variant.sku || '—'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Scrollbar>
        </Card>

        <Card sx={{ mt: 3, p: { xs: 2.5, md: 3 } }}>
          <Typography variant="h6" sx={{ mb: 2.5 }}>
            Reviews ({product.reviews?.length || 0})
          </Typography>

          {product.reviews?.length ? (
            <Stack spacing={2.5} divider={<Divider sx={{ borderStyle: 'dashed' }} />}>
              {product.reviews.map((item) => (
                <Stack key={item._id} direction="row" spacing={1.5} alignItems="flex-start">
                  <Avatar src={item.avatarUrl} alt={item.name} />
                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between" flexWrap="wrap" useFlexGap>
                      <Typography variant="subtitle2">{item.name}</Typography>
                      <Rating size="small" value={Math.round(item.rating || 0)} readOnly />
                    </Stack>
                    <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                      {fDay(item.createdAt) || ''}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.75 }}>
                      {item.comment}
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

      <ProductRejectDialog product={review.rejectTarget} open={!!review.rejectTarget} onClose={review.closeReject} onConfirm={review.confirmReject} />
    </>
  );
}
