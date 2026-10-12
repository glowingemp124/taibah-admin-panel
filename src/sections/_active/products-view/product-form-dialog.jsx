import { zodResolver } from '@hookform/resolvers/zod';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z as zod } from 'zod';

import LoadingButton from '@mui/lab/LoadingButton';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { Field, Form, schemaHelper } from 'src/components/hook-form';
import { toast } from 'src/components/snackbar';

import { MOCK_COMPANIES, upsertMockProduct } from './mock';
import { AVAILABILITY_OPTIONS, CATEGORY_OPTIONS, COLOR_OPTIONS } from './product-table-config';

const AVAILABILITY_EDIT_OPTIONS = AVAILABILITY_OPTIONS.filter((option) => option.value !== 'all');

const ProductSchema = zod.object({
  images: schemaHelper.files({ minFiles: 1, message: { required_error: 'At least one image is required!' } }),
  title: zod.string().min(1, { message: 'Title is required!' }),
  description: zod.string().min(1, { message: 'Description is required!' }),
  features: zod.string().optional(),
  price: zod.coerce.number().positive({ message: 'Price is required!' }),
  salePrice: zod.any().optional(),
  offPercent: zod.any().optional(),
  category: zod.string().min(1, { message: 'Category is required!' }),
  companyId: zod.string().min(1, { message: 'Company is required!' }),
  colors: zod.array(zod.string()).min(1, { message: 'Select at least one color!' }),
  availability: zod.enum(['in-stock', 'low-stock', 'out-of-stock']),
});

export function ProductFormDialog({ currentProduct, open, onClose, onSuccess }) {
  const isEdit = !!currentProduct;

  const defaultValues = useMemo(
    () => ({
      images: currentProduct?.images || [],
      title: currentProduct?.title || '',
      description: currentProduct?.description || '',
      features: (currentProduct?.features || []).join('\n'),
      price: currentProduct?.price || '',
      salePrice: currentProduct?.salePrice || '',
      offPercent: currentProduct?.offPercent || '',
      category: currentProduct?.category || '',
      companyId: currentProduct?.company?._id || '',
      colors: currentProduct?.colors || [],
      availability: currentProduct?.availability || 'in-stock',
    }),
    [currentProduct]
  );

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(ProductSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (open) {
      reset(defaultValues);
    }
  }, [open, defaultValues, reset]);

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
      const salePrice = data.salePrice === '' ? null : Number(data.salePrice);
      const offPercent = data.offPercent === '' ? 0 : Number(data.offPercent);

      upsertMockProduct({
        ...(currentProduct || {}),
        images: data.images,
        primaryIndex: 0,
        title: data.title,
        description: data.description,
        features: (data.features || '')
          .split('\n')
          .map((item) => item.trim())
          .filter(Boolean),
        price: Number(data.price),
        salePrice,
        offPercent,
        category: data.category,
        company,
        colors: data.colors,
        availability: data.availability,
      });

      toast.success(isEdit ? 'Product updated successfully!' : 'Product created successfully!');
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error(isEdit ? 'Failed to update product' : 'Failed to create product');
    }
  });

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogTitle sx={{ pb: 1 }}>{isEdit ? 'Edit Product' : 'New Product'}</DialogTitle>

        <DialogContent>
          <Stack spacing={2.5} sx={{ pt: 1 }}>
            <Stack spacing={1}>
              <Typography variant="subtitle2">Images</Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                The first image is used as the primary image.
              </Typography>
              <Field.Upload multiple thumbnail name="images" maxSize={3145728} onRemove={handleRemoveFile} onRemoveAll={handleRemoveAllFiles} />
            </Stack>

            <Field.Text name="title" label="Title" />

            <Field.Text name="description" label="Description" multiline rows={3} />

            <Field.Text name="features" label="Features" placeholder="One feature per line" multiline rows={3} />

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Field.Text name="price" label="Price" type="number" />
              <Field.Text name="salePrice" label="Sale Price" type="number" />
              <Field.Text name="offPercent" label="Off %" type="number" />
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
            </Stack>

            <Field.Select name="availability" label="Availability">
              {AVAILABILITY_EDIT_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Field.Select>

            <Field.MultiCheckbox name="colors" label="Colors" options={COLOR_OPTIONS} sx={{ flexDirection: 'row', flexWrap: 'wrap' }} slotProps={{ formLabel: {} }} />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" color="primary" onClick={onClose}>
            Cancel
          </Button>
          <LoadingButton type="submit" variant="contained" color="primary" loading={isSubmitting}>
            {isEdit ? 'Save Changes' : 'Create Product'}
          </LoadingButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
}

ProductFormDialog.propTypes = {
  currentProduct: PropTypes.object,
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onSuccess: PropTypes.func,
};
