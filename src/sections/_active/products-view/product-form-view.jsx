import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import { useCallback, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z as zod } from 'zod';

import LoadingButton from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { EmptyContent } from 'src/components/empty-content';
import { Field, Form, schemaHelper } from 'src/components/hook-form';
import { toast } from 'src/components/snackbar';
import { useAppRole } from 'src/hooks/use-app-role';

import { findMockCategory, getActiveCategories } from 'src/sections/_active/categories-view/mock';

import { getApprovedCompanies, getProductStore, MOCK_COMPANIES, upsertMockProduct } from './mock';
import { PRODUCT_STATUS_EDIT_OPTIONS } from './product-table-config';
import { toImageKey, toImageUrl } from './product-utils';
import { blankVariant, MAX_VARIANT_IMAGES, ProductVariantsField } from './product-variants-field';
import { SellerApprovalBanner } from './seller-approval-banner';

// ----------------------------------------------------------------------

const MAX_PRODUCT_IMAGES = 10;

const SELLER_REVIEW_NOTICE =
  'Changes to title, description, images, category or variant options/images send the product back to review. Price, stock and discount changes go live immediately.';

const emptyToUndefined = (value) => (value === '' || value === null || value === undefined ? undefined : Number(value));

const VariantSchema = zod.object({
  _id: zod.string().nullable().optional(),
  options: zod.record(zod.string()).optional(),
  price: zod.preprocess(
    emptyToUndefined,
    zod
      .number({ required_error: 'Price is required!', invalid_type_error: 'Price must be a number!' })
      .positive({ message: 'Price must be greater than 0!' })
  ),
  stock: zod.preprocess(
    emptyToUndefined,
    zod
      .number({ required_error: 'Stock is required!', invalid_type_error: 'Stock must be a number!' })
      .int({ message: 'Stock must be a whole number!' })
      .min(0, { message: 'Stock cannot be negative!' })
  ),
  sku: zod.string().trim().max(64, { message: 'SKU must be at most 64 characters!' }).optional(),
  amount: zod.preprocess(
    emptyToUndefined,
    zod.number({ invalid_type_error: 'Amount must be a number!' }).positive({ message: 'Amount must be greater than 0!' }).optional()
  ),
  unit: zod.string().optional(),
  images: zod.array(zod.any()).max(MAX_VARIANT_IMAGES, { message: `Up to ${MAX_VARIANT_IMAGES} images per variant!` }),
});

const issue = (ctx, path, message) => ctx.addIssue({ code: zod.ZodIssueCode.custom, path, message });

function validateVariants(data, ctx) {
  const category = findMockCategory(data.categoryId);
  if (!category) return;

  const attributes = category.attributes || [];
  const { variants } = data;

  if (!variants.length) {
    issue(ctx, ['variants'], 'Add at least one variant!');
    return;
  }

  if (!attributes.length && variants.length !== 1) {
    issue(ctx, ['variants'], 'Products in this category have exactly one variant!');
  }

  const combos = new Map();
  const skus = new Map();

  variants.forEach((row, index) => {
    const missing = attributes.filter((attribute) => !row.options?.[attribute._id]);
    missing.forEach((attribute) => issue(ctx, ['variants', index, 'options', attribute._id], `Choose a ${attribute.name}`));

    if (attributes.length && !missing.length) {
      const key = attributes.map((attribute) => row.options[attribute._id]).join('|');
      if (combos.has(key)) {
        issue(ctx, ['variants', combos.get(key), 'combo'], 'Two variants have the same options');
        issue(ctx, ['variants', index, 'combo'], 'Two variants have the same options');
      } else {
        combos.set(key, index);
      }
    }

    const sku = row.sku?.trim().toLowerCase();
    if (sku) {
      if (skus.has(sku)) {
        issue(ctx, ['variants', index, 'sku'], 'SKU is already used by another variant!');
      } else {
        skus.set(sku, index);
      }
    }
  });
}

function validateDiscount(data, ctx) {
  if (Number(data.offPercent) > 0 && !data.discountEndsAt) {
    issue(ctx, ['discountEndsAt'], 'Discount end date is required!');
  }

  if (data.discountStartsAt && data.discountEndsAt && dayjs(data.discountEndsAt).isBefore(dayjs(data.discountStartsAt), 'day')) {
    issue(ctx, ['discountEndsAt'], 'End date must be on or after the start date!');
  }
}

const buildSchema = (sellerMode) =>
  zod
    .object({
      images: schemaHelper
        .files({ minFiles: 1, message: { required_error: 'At least one image is required!' } })
        .refine((files) => files.length <= MAX_PRODUCT_IMAGES, { message: `Up to ${MAX_PRODUCT_IMAGES} images!` }),
      title: zod.string().trim().min(1, { message: 'Title is required!' }),
      description: zod.string().trim().min(1, { message: 'Description is required!' }),
      features: zod.string().optional(),
      categoryId: zod.string().min(1, { message: 'Category is required!' }),
      companyId: sellerMode ? zod.string().optional() : zod.string().min(1, { message: 'Company is required!' }),
      offPercent: zod.preprocess(
        (value) => (value === '' || value === null || value === undefined ? 0 : value),
        zod.coerce.number().min(0, { message: 'Discount cannot be negative!' }).max(100, { message: 'Discount cannot exceed 100%!' })
      ),
      discountStartsAt: zod.any().optional().nullable(),
      discountEndsAt: zod.any().optional().nullable(),
      variants: zod.array(VariantSchema),
      status: zod.enum(['active', 'inactive'], { required_error: 'Status is required!' }),
    })
    .superRefine((data, ctx) => {
      validateDiscount(data, ctx);
      validateVariants(data, ctx);
    });

// ----------------------------------------------------------------------

const toFormVariant = (variant) => ({
  _id: variant._id,
  options: Object.fromEntries((variant.options || []).map((option) => [option.attribute._id, option.value])),
  price: variant.price ?? '',
  stock: variant.stock ?? '',
  sku: variant.sku || '',
  amount: variant.amount ?? '',
  unit: variant.unit || 'piece',
  images: variant.images || [],
});

const toDateOnly = (value) => (value ? dayjs(value).format('YYYY-MM-DD') : null);

const imageUrls = (images = []) => JSON.stringify(images.map(toImageUrl));

const variantContent = (variant) => JSON.stringify({ options: (variant.options || []).map((option) => option.value), images: variant.images || [] });

// Seller edits to these fields send an approved product back to admin review.
function needsReview(previous, next) {
  if (previous.title !== next.title || previous.description !== next.description) return true;
  if (imageUrls(previous.images) !== imageUrls(next.images)) return true;
  if (previous.category?._id !== next.category._id) return true;

  const before = new Map((previous.variants || []).map((variant) => [variant._id, variantContent(variant)]));
  return next.variants.some((variant) => before.get(variant._id) !== variantContent(variant));
}

const companyRef = (company) => (company ? { _id: company.seller?._id, name: company.name, logo: company.logo } : null);

// ----------------------------------------------------------------------

export function ProductFormView({ currentProduct, missing = false, sellerMode = false, sellerCompanyId = '' }) {
  const router = useRouter();
  const { sellerStatus } = useAppRole();
  const isEdit = !!currentProduct;
  const appPaths = sellerMode ? paths.dashboard : paths.adminDashboard;
  const sellerLocked = sellerMode && sellerStatus !== 'approved';
  const [pendingCategoryId, setPendingCategoryId] = useState(null);

  const companies = useMemo(() => getApprovedCompanies(), []);
  const categories = useMemo(() => {
    const active = getActiveCategories();
    const current = currentProduct?.category?._id ? findMockCategory(currentProduct.category._id) : null;
    return current && !active.includes(current) ? [current, ...active] : active;
  }, [currentProduct]);

  const ProductSchema = useMemo(() => buildSchema(sellerMode), [sellerMode]);

  const defaultValues = useMemo(
    () => ({
      images: currentProduct?.images || [],
      title: currentProduct?.title || '',
      description: currentProduct?.description || '',
      features: (currentProduct?.features || []).join('\n'),
      categoryId: currentProduct?.category?._id || '',
      companyId: currentProduct?.company?._id || '',
      offPercent: currentProduct?.offPercent || '',
      discountStartsAt: currentProduct?.discountStartsAt || null,
      discountEndsAt: currentProduct?.discountEndsAt || null,
      variants: (currentProduct?.variants || []).map(toFormVariant),
      status: currentProduct?.status || 'active',
    }),
    [currentProduct]
  );

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(ProductSchema),
    defaultValues,
  });

  const {
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const images = watch('images');
  const categoryId = watch('categoryId');
  const offPercent = watch('offPercent');
  const hasDiscount = Number(offPercent) > 0;
  const category = categoryId ? findMockCategory(categoryId) : null;

  const handleRemoveFile = useCallback(
    (inputFile) => {
      setValue(
        'images',
        images?.filter((file) => file !== inputFile),
        { shouldValidate: true }
      );
    },
    [setValue, images]
  );

  const handleRemoveAllFiles = useCallback(() => {
    setValue('images', [], { shouldValidate: true });
  }, [setValue]);

  const applyCategory = useCallback(
    (nextId) => {
      setValue('categoryId', nextId, { shouldValidate: true });
      setValue('variants', [blankVariant(findMockCategory(nextId))], { shouldValidate: false });
    },
    [setValue]
  );

  // Options come from the category, so switching category starts the variants over.
  const handleCategoryChange = (event) => {
    const nextId = event.target.value;
    if (nextId === categoryId) return;

    if (categoryId) {
      setPendingCategoryId(nextId);
      return;
    }
    applyCategory(nextId);
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 400));

      const selectedCategory = findMockCategory(data.categoryId);
      const attributes = selectedCategory.attributes || [];
      const store = sellerMode
        ? MOCK_COMPANIES.find((item) => item._id === sellerCompanyId) || getProductStore(currentProduct)
        : companies.find((item) => item.seller?._id === data.companyId);
      const offPercentValue = Number(data.offPercent) || 0;
      const stamp = Date.now();

      const next = {
        ...(currentProduct || {}),
        title: data.title.trim(),
        description: data.description.trim(),
        features: (data.features || '')
          .split('\n')
          .map((item) => item.trim())
          .filter(Boolean),
        images: data.images.map(toImageUrl),
        imageKeys: data.images.map((file) => toImageKey(file)),
        category: { _id: selectedCategory._id, title: selectedCategory.title, unit: selectedCategory.unit },
        company: companyRef(store),
        offPercent: offPercentValue,
        discountStartsAt: offPercentValue > 0 ? toDateOnly(data.discountStartsAt) : null,
        discountEndsAt: offPercentValue > 0 ? toDateOnly(data.discountEndsAt) : null,
        variants: data.variants.map((row, index) => ({
          // New variants have no _id until the API creates them; the mock store needs one.
          _id: row._id || `var-${stamp}-${index}`,
          sku: row.sku?.trim() || null,
          options: attributes.map((attribute) => {
            const item = attribute.values.find((value) => value.value === row.options?.[attribute._id]);
            return {
              attribute: { _id: attribute._id, name: attribute.name, type: attribute.type },
              value: row.options?.[attribute._id],
              label: item?.label || row.options?.[attribute._id],
            };
          }),
          price: Number(row.price),
          stock: Number(row.stock),
          amount: attributes.length || row.amount === undefined ? null : Number(row.amount),
          unit: row.unit || selectedCategory.unit,
          images: (row.images || []).map(toImageUrl),
          imageKeys: (row.images || []).map((file) => toImageKey(file)),
        })),
        status: data.status,
      };

      let sentToReview = false;

      if (!isEdit) {
        next.reviewStatus = sellerMode ? 'pending' : 'approved';
        next.reviewedAt = sellerMode ? null : new Date().toISOString();
        sentToReview = sellerMode;
      } else if (sellerMode && (currentProduct.reviewStatus === 'rejected' || (currentProduct.reviewStatus === 'approved' && needsReview(currentProduct, next)))) {
        Object.assign(next, { reviewStatus: 'pending', reviewReason: null, reviewedAt: null });
        sentToReview = true;
      }

      const saved = upsertMockProduct(next);

      if (sentToReview) {
        toast.success(isEdit ? 'Product updated and sent for review' : 'Product created and sent for review');
      } else {
        toast.success(isEdit ? 'Product updated successfully!' : 'Product created successfully!');
      }
      router.push(appPaths.products.details(saved._id));
    } catch (error) {
      console.error(error);
      toast.error(isEdit ? 'Failed to update product' : 'Failed to create product');
    }
  });

  const cancelHref = isEdit ? appPaths.products.details(currentProduct._id) : appPaths.products.root;

  if (missing) {
    return (
      <Box sx={{ px: { xs: 2, md: 5 }, pb: 5, pt: 3 }}>
        <CustomBreadcrumbs
          heading="Edit product"
          links={[{ name: 'Dashboard', href: appPaths.root }, { name: 'Products', href: appPaths.products.root }, { name: 'Edit' }]}
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
    <Box sx={{ px: { xs: 2, md: 5 }, pb: 5, pt: 3 }}>
      <CustomBreadcrumbs
        heading={isEdit ? 'Edit product' : 'New product'}
        links={[
          { name: 'Dashboard', href: appPaths.root },
          { name: 'Products', href: appPaths.products.root },
          { name: isEdit ? currentProduct.title : 'New product' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {sellerMode && <SellerApprovalBanner sellerStatus={sellerStatus} sx={{ mb: 3 }} />}

      {sellerMode && isEdit && currentProduct.reviewStatus === 'approved' && (
        <Alert severity="info" sx={{ mb: 3 }}>
          {SELLER_REVIEW_NOTICE}
        </Alert>
      )}

      {sellerMode && isEdit && currentProduct.reviewStatus === 'rejected' && (
        <Alert severity="error" sx={{ mb: 3 }}>
          This product was rejected{currentProduct.reviewReason ? `: ${currentProduct.reviewReason}` : '.'} Saving your changes sends it back to review.
        </Alert>
      )}

      <Form methods={methods} onSubmit={onSubmit}>
        <Card sx={{ p: { xs: 2.5, md: 3 } }}>
          <Stack spacing={3}>
            <Stack spacing={1}>
              <Typography variant="subtitle2">Images</Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Up to {MAX_PRODUCT_IMAGES} images. The first image is used as the primary image.
              </Typography>
              <Field.Upload multiple thumbnail name="images" maxSize={3145728} onRemove={handleRemoveFile} onRemoveAll={handleRemoveAllFiles} />
            </Stack>

            <Field.Text name="title" label="Title" />

            <Field.Text name="description" label="Description" multiline rows={4} />

            <Field.Text name="features" label="Features" placeholder="One feature per line" multiline rows={4} />

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Field.Select name="categoryId" label="Category" onChange={handleCategoryChange}>
                {categories.map((option) => (
                  <MenuItem key={option._id} value={option._id}>
                    {option.title}
                  </MenuItem>
                ))}
              </Field.Select>

              {!sellerMode && (
                <Field.Select name="companyId" label="Company">
                  {companies.map((company) => (
                    <MenuItem key={company._id} value={company.seller?._id}>
                      {company.name}
                    </MenuItem>
                  ))}
                </Field.Select>
              )}

              <Field.Select name="status" label="Status">
                {PRODUCT_STATUS_EDIT_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Field.Select>
            </Stack>

            <Stack spacing={1}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Field.Text name="offPercent" label="Discount (%) Off" type="number" />
                <Field.DatePicker name="discountStartsAt" label="Discount start date" disabled={!hasDiscount} />
                <Field.DatePicker name="discountEndsAt" label="Discount end date" disabled={!hasDiscount} />
              </Stack>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                The start date is optional. Without one, the discount applies right away until the end date.
              </Typography>
            </Stack>

            <Divider sx={{ borderStyle: 'dashed' }} />

            {category ? (
              <ProductVariantsField category={category} offPercent={offPercent} isEdit={isEdit} />
            ) : (
              <Alert severity="info" variant="outlined">
                Pick a category to add variants. The category decides which options (e.g. Size, Color) each variant has.
              </Alert>
            )}

            <Stack direction="row" spacing={1.5} justifyContent="flex-end">
              <Button component={RouterLink} href={cancelHref} variant="outlined" color="primary">
                Cancel
              </Button>
              <LoadingButton type="submit" variant="contained" color="primary" loading={isSubmitting} disabled={sellerLocked}>
                {isEdit ? 'Save Changes' : 'Create Product'}
              </LoadingButton>
            </Stack>
          </Stack>
        </Card>
      </Form>

      <ConfirmDialog
        open={!!pendingCategoryId}
        onClose={() => setPendingCategoryId(null)}
        title="Change category?"
        content="The new category has its own options, so the current variants will be cleared."
        action={
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              applyCategory(pendingCategoryId);
              setPendingCategoryId(null);
            }}
          >
            Change category
          </Button>
        }
      />
    </Box>
  );
}

ProductFormView.propTypes = {
  currentProduct: PropTypes.object,
  missing: PropTypes.bool,
  sellerMode: PropTypes.bool,
  sellerCompanyId: PropTypes.string,
};
