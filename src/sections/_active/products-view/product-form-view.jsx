import { zodResolver } from '@hookform/resolvers/zod';
import PropTypes from 'prop-types';
import { useCallback, useMemo, useState } from 'react';
import { useForm, useFormContext } from 'react-hook-form';
import { z as zod } from 'zod';

import LoadingButton from '@mui/lab/LoadingButton';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { EmptyContent } from 'src/components/empty-content';
import { Field, Form, schemaHelper } from 'src/components/hook-form';
import { toast } from 'src/components/snackbar';

import { fCurrency } from 'src/utils/format-number';

import { MOCK_COMPANIES, upsertMockProduct } from './mock';
import { CATEGORY_OPTIONS, getDiscountedPrice } from './product-table-config';

const HEX_COLOR = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;

function normalizeHex(value) {
  if (!value) return null;
  let hex = String(value).trim();
  if (!hex.startsWith('#')) hex = `#${hex}`;
  if (!HEX_COLOR.test(hex)) return null;
  if (hex.length === 4) {
    hex = `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
  }
  return hex.toUpperCase();
}

const ProductSchema = zod
  .object({
    images: schemaHelper.files({ minFiles: 1, message: { required_error: 'At least one image is required!' } }),
    title: zod.string().min(1, { message: 'Title is required!' }),
    description: zod.string().min(1, { message: 'Description is required!' }),
    features: zod.string().optional(),
    price: zod.coerce.number().positive({ message: 'Price is required!' }),
    offPercent: zod.preprocess(
      (value) => (value === '' || value === null || value === undefined ? 0 : value),
      zod.coerce.number().min(0, { message: 'Discount cannot be negative!' }).max(100, { message: 'Discount cannot exceed 100%!' })
    ),
    discountEndsAt: zod.any().optional().nullable(),
    category: zod.string().min(1, { message: 'Category is required!' }),
    companyId: zod.string().min(1, { message: 'Company is required!' }),
    colors: zod.array(zod.string()).min(1, { message: 'Add at least one color code!' }),
    quantity: zod.coerce.number().int({ message: 'Quantity must be a whole number!' }).min(0, { message: 'Quantity cannot be negative!' }),
  })
  .superRefine((data, ctx) => {
    if (Number(data.offPercent) > 0 && !data.discountEndsAt) {
      ctx.addIssue({
        code: zod.ZodIssueCode.custom,
        path: ['discountEndsAt'],
        message: 'Discount end date is required!',
      });
    }
  });

function ColorCodesField() {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();
  const colors = watch('colors') || [];
  const [input, setInput] = useState('#');
  const errorMessage = errors.colors?.message;

  const handleAdd = () => {
    const hex = normalizeHex(input);
    if (!hex) {
      toast.error('Enter a valid hex color, e.g. #1B5E4B');
      return;
    }
    if (colors.includes(hex)) {
      toast.error('This color is already added');
      return;
    }
    setValue('colors', [...colors, hex], { shouldValidate: true });
    setInput('#');
  };

  const handleRemove = (hex) => {
    setValue(
      'colors',
      colors.filter((color) => color !== hex),
      { shouldValidate: true }
    );
  };

  return (
    <Stack spacing={1.5}>
      <Typography variant="subtitle2">Colors</Typography>
      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
        Add any hex color code. Use the picker or type a value such as #1B5E4B.
      </Typography>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ sm: 'flex-start' }}>
        <TextField
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              handleAdd();
            }
          }}
          label="Color code"
          placeholder="#1B5E4B"
          error={!!errorMessage}
          helperText={errorMessage}
          sx={{ flexGrow: 1 }}
        />
        <Box
          component="input"
          type="color"
          value={normalizeHex(input) || '#000000'}
          onChange={(event) => setInput(event.target.value.toUpperCase())}
          aria-label="Pick color"
          sx={{
            width: 56,
            height: 56,
            p: 0.5,
            border: (theme) => `1px solid ${theme.vars.palette.divider}`,
            borderRadius: 1,
            bgcolor: 'background.paper',
            cursor: 'pointer',
          }}
        />
        <Button variant="contained" color="primary" onClick={handleAdd} sx={{ height: 56 }}>
          Add
        </Button>
      </Stack>

      {!!colors.length && (
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {colors.map((hex) => (
            <Chip key={hex} label={hex} onDelete={() => handleRemove(hex)} avatar={<Avatar sx={{ bgcolor: hex, width: 24, height: 24 }}>&nbsp;</Avatar>} />
          ))}
        </Stack>
      )}
    </Stack>
  );
}

export function ProductFormView({ currentProduct, missing = false }) {
  const router = useRouter();
  const isEdit = !!currentProduct;

  const defaultValues = useMemo(
    () => ({
      images: currentProduct?.images || [],
      title: currentProduct?.title || '',
      description: currentProduct?.description || '',
      features: (currentProduct?.features || []).join('\n'),
      price: currentProduct?.price || '',
      offPercent: currentProduct?.offPercent || '',
      discountEndsAt: currentProduct?.discountEndsAt || null,
      category: currentProduct?.category || '',
      companyId: currentProduct?.company?._id || '',
      colors: currentProduct?.colors || [],
      quantity: currentProduct?.quantity ?? '',
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

  const values = watch();
  const hasDiscount = Number(values.offPercent) > 0;
  const discountedPrice = getDiscountedPrice(values.price, values.offPercent);

  const handleRemoveFile = useCallback(
    (inputFile) => {
      const filtered = values.images?.filter((file) => file !== inputFile);
      setValue('images', filtered, { shouldValidate: true });
    },
    [setValue, values.images]
  );

  const handleRemoveAllFiles = useCallback(() => {
    setValue('images', [], { shouldValidate: true });
  }, [setValue]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 400));

      const company = MOCK_COMPANIES.find((item) => item._id === data.companyId);
      const offPercent = Number(data.offPercent) || 0;
      const price = Number(data.price);
      const salePrice = getDiscountedPrice(price, offPercent);

      const saved = upsertMockProduct({
        ...(currentProduct || {}),
        images: data.images,
        primaryIndex: 0,
        title: data.title,
        description: data.description,
        features: (data.features || '')
          .split('\n')
          .map((item) => item.trim())
          .filter(Boolean),
        price,
        salePrice,
        offPercent,
        discountEndsAt: offPercent > 0 ? data.discountEndsAt : null,
        category: data.category,
        company,
        colors: data.colors,
        quantity: Number(data.quantity),
      });

      toast.success(isEdit ? 'Product updated successfully!' : 'Product created successfully!');
      router.push(paths.adminDashboard.products.details(saved._id));
    } catch (error) {
      console.error(error);
      toast.error(isEdit ? 'Failed to update product' : 'Failed to create product');
    }
  });

  const cancelHref = isEdit ? paths.adminDashboard.products.details(currentProduct._id) : paths.adminDashboard.products.root;

  if (missing) {
    return (
      <Box sx={{ px: { xs: 2, md: 5 }, pb: 5, pt: 3 }}>
        <CustomBreadcrumbs
          heading="Edit product"
          links={[{ name: 'Dashboard', href: paths.adminDashboard.root }, { name: 'Products', href: paths.adminDashboard.products.root }, { name: 'Edit' }]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        <EmptyContent
          filled
          title="Product not found"
          description="This product does not exist or has been removed."
          action={
            <Button component={RouterLink} href={paths.adminDashboard.products.root} variant="contained" color="primary">
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
          { name: 'Dashboard', href: paths.adminDashboard.root },
          { name: 'Products', href: paths.adminDashboard.products.root },
          { name: isEdit ? currentProduct.title : 'New product' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Form methods={methods} onSubmit={onSubmit}>
        <Card sx={{ p: { xs: 2.5, md: 3 } }}>
          <Stack spacing={3}>
            <Stack spacing={1}>
              <Typography variant="subtitle2">Images</Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                The first image is used as the primary image.
              </Typography>
              <Field.Upload multiple thumbnail name="images" maxSize={3145728} onRemove={handleRemoveFile} onRemoveAll={handleRemoveAllFiles} />
            </Stack>

            <Field.Text name="title" label="Title" />

            <Field.Text name="description" label="Description" multiline rows={4} />

            <Field.Text name="features" label="Features" placeholder="One feature per line" multiline rows={4} />

            <Stack spacing={1}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Field.Text name="price" label="Price" type="number" />
                <Field.Text name="offPercent" label="Discount (%) Off" type="number" />
                <Field.DatePicker name="discountEndsAt" label="Discount end date" disabled={!hasDiscount} />
              </Stack>
              {hasDiscount && discountedPrice != null && (
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Price after discount:{' '}
                  <Box component="span" sx={{ color: 'primary.main', fontWeight: 600 }}>
                    {fCurrency(discountedPrice)}
                  </Box>
                </Typography>
              )}
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Field.Select name="category" label="Category">
                {CATEGORY_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Field.Select>

              <Field.Select name="companyId" label="Company">
                {MOCK_COMPANIES.map((company) => (
                  <MenuItem key={company._id} value={company._id}>
                    {company.name}
                  </MenuItem>
                ))}
              </Field.Select>

              <Field.Text name="quantity" label="Quantity" type="number" />
            </Stack>

            <ColorCodesField />

            <Stack direction="row" spacing={1.5} justifyContent="flex-end">
              <Button component={RouterLink} href={cancelHref} variant="outlined" color="primary">
                Cancel
              </Button>
              <LoadingButton type="submit" variant="contained" color="primary" loading={isSubmitting}>
                {isEdit ? 'Save Changes' : 'Create Product'}
              </LoadingButton>
            </Stack>
          </Stack>
        </Card>
      </Form>
    </Box>
  );
}

ProductFormView.propTypes = {
  currentProduct: PropTypes.object,
  missing: PropTypes.bool,
};
