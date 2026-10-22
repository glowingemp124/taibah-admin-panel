import { zodResolver } from '@hookform/resolvers/zod';
import PropTypes from 'prop-types';
import { useEffect, useMemo } from 'react';
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
import { fData } from 'src/utils/format-number';

import { MOCK_OPTIONS } from 'src/sections/_active/options-view/mock';
import { toImageKey, toImageUrl } from 'src/sections/_active/products-view/product-utils';

import { CATEGORY_UNITS, categoryHasProducts, syncCategoryOnProducts, upsertMockCategory } from './mock';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

const OPTIONS_LOCKED_MESSAGE = "This category has products, so its options can't change";

const sameIds = (a = [], b = []) => a.length === b.length && [...a].sort().join('|') === [...b].sort().join('|');

export function CategoryFormDialog({ currentCategory, open, onClose, onSuccess }) {
  const isEdit = !!currentCategory;

  const CategorySchema = useMemo(
    () =>
      zod.object({
        image: schemaHelper.file({ message: { required_error: 'Image is required!' } }),
        title: zod.string().min(1, { message: 'Title is required!' }),
        unit: zod.enum(CATEGORY_UNITS, { required_error: 'Unit is required!' }),
        attributeIds: zod.array(zod.string()),
        status: isEdit ? zod.enum(['active', 'inactive']) : zod.string().optional(),
      }),
    [isEdit]
  );

  const defaultValues = useMemo(
    () => ({
      image: currentCategory?.image || currentCategory?.icon || currentCategory?.coverUrl || null,
      title: currentCategory?.title || currentCategory?.name || '',
      unit: currentCategory?.unit || 'piece',
      attributeIds: (currentCategory?.attributes || []).map((attribute) => attribute._id),
      status: currentCategory?.status || 'active',
    }),
    [currentCategory]
  );

  const optionChoices = useMemo(() => (open ? MOCK_OPTIONS.map((option) => ({ value: option._id, label: option.name })) : []), [open]);

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(CategorySchema),
    defaultValues,
  });

  const {
    reset,
    setError,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (open) {
      reset(defaultValues);
    }
  }, [open, defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    if (isEdit && !sameIds(data.attributeIds, defaultValues.attributeIds) && categoryHasProducts(currentCategory._id)) {
      setError('attributeIds', { type: 'manual', message: OPTIONS_LOCKED_MESSAGE });
      toast.error(OPTIONS_LOCKED_MESSAGE);
      return;
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const saved = upsertMockCategory({
        _id: currentCategory?._id,
        title: data.title.trim(),
        image: toImageUrl(data.image),
        imageKey: data.image === currentCategory?.image ? currentCategory?.imageKey : toImageKey(data.image, 'categories'),
        unit: data.unit,
        attributeIds: data.attributeIds,
        status: isEdit ? data.status : 'active',
      });
      syncCategoryOnProducts(saved);

      toast.success(isEdit ? 'Category updated successfully!' : 'Category created successfully!');
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error(isEdit ? 'Failed to update category' : 'Failed to create category');
    }
  });

  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose}>
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogTitle>{isEdit ? 'Edit Category' : 'New Category'}</DialogTitle>

        <DialogContent>
          <Stack spacing={3} sx={{ pt: 1 }}>
            <Stack spacing={1} alignItems="center">
              <Field.UploadAvatar
                name="image"
                maxSize={3145728}
                helperText={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 1.5,
                      mx: 'auto',
                      display: 'block',
                      textAlign: 'center',
                      color: 'text.disabled',
                    }}
                  >
                    Allowed *.jpeg, *.jpg, *.png, *.gif
                    <br /> Max size of {fData(3145728)}
                  </Typography>
                }
                sx={{
                  width: 140,
                  height: 140,
                  '& > div': { borderRadius: 2 },
                  '& img': { borderRadius: '8px !important' },
                }}
              />
            </Stack>

            <Field.Text name="title" label="Title" />

            <Field.Select name="unit" label="Unit" SelectProps={{ MenuProps: { PaperProps: { sx: { maxHeight: 220 } } } }}>
              {CATEGORY_UNITS.map((unit) => (
                <MenuItem key={unit} value={unit} sx={{ textTransform: 'none' }}>
                  {unit}
                </MenuItem>
              ))}
            </Field.Select>

            <Field.MultiSelect
              chip
              checkbox
              fullWidth
              name="attributeIds"
              label="Options"
              options={optionChoices}
              helperText="Products in this category will choose a value for each option."
            />

            {isEdit && (
              <Field.Select name="status" label="Status">
                {STATUS_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Field.Select>
            )}
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" color="primary" onClick={onClose}>
            Cancel
          </Button>
          <LoadingButton type="submit" variant="contained" color="primary" loading={isSubmitting}>
            {isEdit ? 'Save Changes' : 'Create Category'}
          </LoadingButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
}

CategoryFormDialog.propTypes = {
  currentCategory: PropTypes.object,
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onSuccess: PropTypes.func,
};
