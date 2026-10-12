import { zodResolver } from '@hookform/resolvers/zod';
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

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

export function CategoryFormDialog({ currentCategory, open, onClose }) {
  const isEdit = !!currentCategory;

  const CategorySchema = useMemo(
    () =>
      zod.object({
        image: schemaHelper.file({ message: { required_error: 'Image is required!' } }),
        title: zod.string().min(1, { message: 'Title is required!' }),
        status: isEdit ? zod.enum(['active', 'inactive']) : zod.string().optional(),
      }),
    [isEdit]
  );

  const defaultValues = useMemo(
    () => ({
      image: currentCategory?.image || currentCategory?.icon || currentCategory?.coverUrl || null,
      title: currentCategory?.title || currentCategory?.name || '',
      status: currentCategory?.status || 'active',
    }),
    [currentCategory]
  );

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(CategorySchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (open) {
      reset(defaultValues);
    }
  }, [open, defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      toast.success(isEdit ? 'Category updated successfully!' : 'Category created successfully!');
      onClose();
      console.info('CATEGORY_DATA', data);
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
                  // borderRadius: 2,
                  '& > div': { borderRadius: 2 },
                  '& img': { borderRadius: '8px !important' },
                }}
              />
            </Stack>

            <Field.Text name="title" label="Title" />

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
