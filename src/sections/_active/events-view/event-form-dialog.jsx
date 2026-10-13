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
import { MOCK_PRODUCTS } from 'src/sections/_active/products-view/mock';
import { fData } from 'src/utils/format-number';

import { upsertMockEvent } from './mock';
import { EVENT_PLACEMENT_OPTIONS, EVENT_PUBLISH_OPTIONS, EVENT_TYPE_OPTIONS } from './event-table-config';

const EventSchema = zod
  .object({
    coverUrl: schemaHelper.file({ message: { required_error: 'Cover image is required!' } }),
    title: zod.string().min(1, { message: 'Title is required!' }),
    subtitle: zod.string().optional(),
    type: zod.string().min(1, { message: 'Type is required!' }),
    placement: zod.string().min(1, { message: 'Placement is required!' }),
    ctaLabel: zod.string().optional(),
    startAt: zod.any().refine((value) => Boolean(value), { message: 'Start date is required!' }),
    endAt: zod.any().refine((value) => Boolean(value), { message: 'End date is required!' }),
    publishState: zod.enum(['draft', 'publish']),
    products: zod.array(zod.any()).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.type === 'product-collection' && !(data.products || []).length) {
      ctx.addIssue({
        code: zod.ZodIssueCode.custom,
        path: ['products'],
        message: 'Select at least one product!',
      });
    }
  });

const toIso = (value) => {
  if (!value) return null;
  if (typeof value === 'string') return value;
  if (typeof value?.toISOString === 'function') return value.toISOString();
  if (typeof value?.format === 'function') return value.format();
  return new Date(value).toISOString();
};

export function EventFormDialog({ currentEvent, open, onClose, onSuccess }) {
  const isEdit = !!currentEvent;

  const defaultValues = useMemo(
    () => ({
      coverUrl: currentEvent?.coverUrl || null,
      title: currentEvent?.title || '',
      subtitle: currentEvent?.subtitle || '',
      type: currentEvent?.type || 'product-collection',
      placement: currentEvent?.placement || 'home-best-deals',
      ctaLabel: currentEvent?.ctaLabel || '',
      startAt: currentEvent?.startAt || null,
      endAt: currentEvent?.endAt || null,
      publishState: currentEvent?.published === false ? 'draft' : 'publish',
      products: currentEvent?.products || [],
    }),
    [currentEvent]
  );

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(EventSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const type = watch('type');

  useEffect(() => {
    if (open) {
      reset(defaultValues);
    }
  }, [open, defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 400));

      upsertMockEvent({
        ...(currentEvent || {}),
        coverUrl: typeof data.coverUrl === 'string' ? data.coverUrl : URL.createObjectURL(data.coverUrl),
        title: data.title,
        subtitle: data.subtitle || '',
        type: data.type,
        placement: data.placement,
        ctaLabel: data.ctaLabel || '',
        startAt: toIso(data.startAt),
        endAt: toIso(data.endAt),
        published: data.publishState === 'publish',
        productIds: data.type === 'product-collection' ? (data.products || []).map((item) => item._id) : [],
      });

      toast.success(isEdit ? 'Event updated successfully!' : 'Event created successfully!');
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error(isEdit ? 'Failed to update event' : 'Failed to create event');
    }
  });

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogTitle>{isEdit ? 'Edit Event' : 'New Event'}</DialogTitle>

        <DialogContent>
          <Stack spacing={2.5} sx={{ pt: 1 }}>
            <Stack spacing={1} alignItems="center">
              <Field.UploadAvatar
                name="coverUrl"
                maxSize={3145728}
                helperText={
                  <Typography variant="caption" sx={{ mt: 1.5, display: 'block', textAlign: 'center', color: 'text.disabled' }}>
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
            <Field.Text name="subtitle" label="Subtitle" placeholder="Optional Arabic or supporting line" />

            <Field.Select name="type" label="Type">
              {EVENT_TYPE_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Field.Select>

            <Field.Select name="placement" label="Placement">
              {EVENT_PLACEMENT_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Field.Select>

            {type === 'banner' && <Field.Text name="ctaLabel" label="CTA Label" placeholder="Explore The Edit" />}

            {type === 'product-collection' && (
              <>
                <Field.Text name="ctaLabel" label="CTA Label" placeholder="See All" />
                <Field.Autocomplete
                  name="products"
                  label="Products"
                  placeholder="Select products"
                  multiple
                  disableCloseOnSelect
                  options={MOCK_PRODUCTS}
                  getOptionLabel={(option) => option.title || ''}
                  isOptionEqualToValue={(option, value) => option._id === value._id}
                />
              </>
            )}

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Field.MobileDateTimePicker name="startAt" label="Start" />
              <Field.MobileDateTimePicker name="endAt" label="End" />
            </Stack>

            <Field.Select name="publishState" label="Visibility">
              {EVENT_PUBLISH_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Field.Select>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" color="primary" onClick={onClose}>
            Cancel
          </Button>
          <LoadingButton type="submit" variant="contained" color="primary" loading={isSubmitting}>
            {isEdit ? 'Save Changes' : 'Create Event'}
          </LoadingButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
}

EventFormDialog.propTypes = {
  currentEvent: PropTypes.object,
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onSuccess: PropTypes.func,
};
