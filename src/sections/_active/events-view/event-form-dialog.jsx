import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z as zod } from 'zod';

import LoadingButton from '@mui/lab/LoadingButton';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { ConfirmDialog } from 'src/components/custom-dialog';
import { Field, Form, schemaHelper } from 'src/components/hook-form';
import { toast } from 'src/components/snackbar';
import { fData } from 'src/utils/format-number';

import { toImageKey } from 'src/sections/_active/products-view/product-utils';

import { EventOptionRow } from './event-shared';
import { EVENT_PUBLISH_OPTIONS, EVENT_STORE_SCOPE_OPTIONS, EVENT_TYPE_OPTIONS, getPlacementOptions, isPlacementForType } from './event-table-config';
import { CTA_TYPE_OPTIONS, EventFieldError, getCtaTargets, getCtaTypeLabel, getEventStoreOptions, isEventOpenToStore, upsertMockEvent } from './mock';

// ----------------------------------------------------------------------

const issue = (ctx, path, message) => ctx.addIssue({ code: zod.ZodIssueCode.custom, path, message });

const EventSchema = zod
  .object({
    coverUrl: schemaHelper.file({ message: { required_error: 'Cover image is required!' } }),
    title: zod.string().min(1, { message: 'Title is required!' }),
    subtitle: zod.string().optional(),
    type: zod.string().min(1, { message: 'Type is required!' }),
    placement: zod.string().min(1, { message: 'Placement is required!' }),
    ctaLabel: zod.string().optional(),
    ctaType: zod.enum(['none', 'category', 'store', 'product', 'event']),
    ctaTarget: zod.any().nullable(),
    startAt: zod.any().refine((value) => Boolean(value), { message: 'Start date is required!' }),
    endAt: zod.any().refine((value) => Boolean(value), { message: 'End date is required!' }),
    publishState: zod.enum(['draft', 'publish']),
    storeScope: zod.enum(['all', 'selected']),
    storeIds: zod.array(zod.any()),
    discountPercent: zod.preprocess(
      (value) => (value === '' || value === null || value === undefined || value === 0 ? null : value),
      zod.coerce
        .number({ invalid_type_error: 'Discount must be a number!' })
        .int({ message: 'Use a whole number!' })
        .min(1, { message: 'Discount must be at least 1%!' })
        .max(90, { message: 'Discount cannot exceed 90%!' })
        .nullable()
    ),
  })
  .superRefine((data, ctx) => {
    if (data.placement && !isPlacementForType(data.placement, data.type)) {
      issue(ctx, ['placement'], data.type === 'banner' ? 'This placement is for product collections.' : 'This placement is for banners.');
    }

    if (data.type === 'banner' && data.ctaType !== 'none' && !data.ctaTarget) {
      issue(ctx, ['ctaTarget'], `Choose a ${getCtaTypeLabel(data.ctaType).toLowerCase()}!`);
    }

    if (data.startAt && data.endAt && !dayjs(data.endAt).isAfter(dayjs(data.startAt))) {
      issue(ctx, ['endAt'], 'End date must be after the start date!');
    }

    if (data.storeScope === 'selected' && !data.storeIds.length) {
      issue(ctx, ['storeIds'], 'Choose at least one store!');
    }
  });

const toIso = (value) => {
  if (!value) return null;
  if (typeof value === 'string') return value;
  if (typeof value?.toISOString === 'function') return value.toISOString();
  if (typeof value?.format === 'function') return value.format();
  return new Date(value).toISOString();
};

const toScope = (data) => ({ storeScope: data.storeScope, storeIds: data.storeScope === 'selected' ? data.storeIds.map((store) => store._id) : [] });

const isRunning = (data) => {
  const now = dayjs();
  return data.publishState === 'publish' && !now.isBefore(dayjs(data.startAt)) && !now.isAfter(dayjs(data.endAt));
};

export function EventFormDialog({ currentEvent, open, onClose, onSuccess }) {
  const isEdit = !!currentEvent;
  const [pendingSave, setPendingSave] = useState(null);
  const [confirming, setConfirming] = useState(false);

  const storeOptions = useMemo(() => (open ? getEventStoreOptions() : []), [open]);
  const currentProducts = useMemo(() => currentEvent?.products || [], [currentEvent]);

  const defaultValues = useMemo(
    () => ({
      coverUrl: currentEvent?.coverUrl || currentEvent?.coverImage || null,
      title: currentEvent?.title || '',
      subtitle: currentEvent?.subtitle || '',
      type: currentEvent?.type || 'product-collection',
      placement: currentEvent?.placement || 'home-best-deals',
      ctaLabel: currentEvent?.ctaLabel || '',
      ctaType: currentEvent?.cta?.type || 'none',
      ctaTarget: currentEvent?.cta ? getCtaTargets(currentEvent.cta.type).find((row) => row._id === currentEvent.cta.id) || null : null,
      startAt: currentEvent?.startAt || null,
      endAt: currentEvent?.endAt || null,
      publishState: currentEvent?.published === false ? 'draft' : 'publish',
      storeScope: currentEvent?.storeScope || 'all',
      storeIds: (currentEvent?.storeIds || []).map((id) => storeOptions.find((store) => store._id === id)).filter(Boolean),
      discountPercent: currentEvent?.discountPercent ?? '',
    }),
    [currentEvent, storeOptions]
  );

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(EventSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    setError,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const type = watch('type');
  const placement = watch('placement');
  const placementOptions = getPlacementOptions(type);

  // Switching type moves the placement to one that type allows.
  useEffect(() => {
    if (open && placement && !isPlacementForType(placement, type)) {
      setValue('placement', getPlacementOptions(type)[0]?.value || '', { shouldValidate: true });
    }
  }, [open, placement, type, setValue]);
  const storeScope = watch('storeScope');
  const storeIds = watch('storeIds');
  const ctaType = watch('ctaType');
  const ctaTargets = useMemo(() => getCtaTargets(ctaType, { excludeEventId: currentEvent?._id }), [ctaType, currentEvent]);

  useEffect(() => {
    if (open) {
      reset(defaultValues);
      setPendingSave(null);
    }
  }, [open, defaultValues, reset]);

  const handleScopeChange = (event) => {
    setValue('storeScope', event.target.value, { shouldValidate: true });

    // Start "Selected" from the stores already in the event.
    if (event.target.value === 'selected' && !storeIds.length) {
      const sellerIds = new Set(currentProducts.map((item) => item.sellerId));
      setValue(
        'storeIds',
        storeOptions.filter((store) => sellerIds.has(store._id)),
        { shouldValidate: true }
      );
    }
  };

  // Returns false when the API-style check failed, after showing it under the field.
  const save = async (data, products) => {
    await new Promise((resolve) => setTimeout(resolve, 400));

    const coverChanged = typeof data.coverUrl !== 'string';
    let saved;

    try {
      saved = upsertMockEvent({
        _id: currentEvent?._id,
        // Unchanged cover: send back the stored key. New upload: its key (the URL is mock-only).
        coverUrl: coverChanged ? URL.createObjectURL(data.coverUrl) : data.coverUrl,
        coverImage: coverChanged ? toImageKey(data.coverUrl, 'events') : currentEvent?.coverImage || null,
        title: data.title,
        subtitle: data.subtitle || '',
        type: data.type,
        placement: data.placement,
        ctaLabel: data.ctaLabel || '',
        cta: data.type === 'banner' && data.ctaType !== 'none' && data.ctaTarget ? { type: data.ctaType, id: data.ctaTarget._id } : null,
        startAt: toIso(data.startAt),
        endAt: toIso(data.endAt),
        published: data.publishState === 'publish',
        ...toScope(data),
        discountPercent: data.discountPercent ?? null,
        products: products.map(({ productId, sellerId, addedBy, addedAt }) => ({ productId, sellerId, addedBy, addedAt })),
      });
    } catch (error) {
      if (error instanceof EventFieldError) {
        setError(error.field, { type: 'server', message: error.message });
        return false;
      }
      throw error;
    }

    toast.success(isEdit ? 'Event updated successfully!' : 'Event created successfully!');
    onSuccess?.(saved, { created: !isEdit });
    onClose();
    return true;
  };

  const onSubmit = handleSubmit(async (data) => {
    // Products are managed in their own dialog; here we only drop the ones the new stores exclude.
    const scope = toScope(data);
    const kept = data.type === 'product-collection' ? currentProducts.filter((item) => isEventOpenToStore(scope, item.sellerId)) : [];
    const removedCount = data.type === 'product-collection' ? currentProducts.length - kept.length : 0;

    if (data.type === 'product-collection' && isEdit && isRunning(data) && !kept.length) {
      setError('publishState', { type: 'manual', message: 'A published, active event needs at least one product. Save as draft or add products first.' });
      return;
    }

    if (removedCount) {
      setPendingSave({ data, kept, removedCount });
      return;
    }

    try {
      await save(data, kept);
    } catch (error) {
      console.error(error);
      toast.error(isEdit ? 'Failed to update event' : 'Failed to create event');
    }
  });

  const handleConfirmSave = async () => {
    setConfirming(true);
    try {
      await save(pendingSave.data, pendingSave.kept);
    } finally {
      setConfirming(false);
      setPendingSave(null);
    }
  };

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

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Field.Select
                name="type"
                label="Type"
                helperText={type === 'banner' ? 'Promotional image with a button. No products.' : 'A shopping campaign with products.'}
                disabled={isEdit}
              >
                {EVENT_TYPE_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Field.Select>

              <Field.Select name="placement" label="Placement">
                {placementOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Field.Select>
            </Stack>

            {type === 'banner' ? (
              <>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Field.Text name="ctaLabel" label="CTA Label" placeholder="Explore The Edit" />
                  <Field.Select
                    name="ctaType"
                    label="Link to"
                    onChange={(event) => {
                      setValue('ctaType', event.target.value, { shouldValidate: true });
                      setValue('ctaTarget', null, { shouldValidate: true });
                    }}
                    sx={{ maxWidth: { sm: 180 } }}
                  >
                    {CTA_TYPE_OPTIONS.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Field.Select>
                </Stack>

                {ctaType !== 'none' && (
                  <Field.Autocomplete
                    name="ctaTarget"
                    label={getCtaTypeLabel(ctaType)}
                    placeholder={`Search ${getCtaTypeLabel(ctaType).toLowerCase()}s`}
                    options={ctaTargets}
                    getOptionLabel={(option) => option.label || ''}
                    isOptionEqualToValue={(option, value) => option._id === value._id}
                    renderOption={(props, option) => (
                      <li {...props} key={option._id}>
                        <EventOptionRow image={option.image} title={option.label} caption={option.caption} />
                      </li>
                    )}
                  />
                )}
              </>
            ) : (
              <Field.Text name="ctaLabel" label="CTA Label" placeholder="See All" helperText="Opens the event's product list." />
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

            {type === 'product-collection' && (
              <>
                <Divider sx={{ borderStyle: 'dashed' }} />

                <Field.RadioGroup row name="storeScope" label="Open to" options={EVENT_STORE_SCOPE_OPTIONS} onChange={handleScopeChange} />

                {storeScope === 'selected' && (
                  <Field.Autocomplete
                    name="storeIds"
                    label="Stores"
                    placeholder="Choose stores"
                    multiple
                    disableCloseOnSelect
                    options={storeOptions}
                    getOptionLabel={(option) => option.name || ''}
                    isOptionEqualToValue={(option, value) => option._id === value._id}
                    renderOption={(props, option) => (
                      <li {...props} key={option._id}>
                        <EventOptionRow image={option.logo} title={option.name} />
                      </li>
                    )}
                    renderTags={(selected, getTagProps) =>
                      selected.map((option, index) => <Chip {...getTagProps({ index })} key={option._id} size="small" variant="soft" label={option.name} />)
                    }
                  />
                )}

                <Field.Text
                  name="discountPercent"
                  label="Event discount (%)"
                  type="number"
                  placeholder="Optional, 1–90"
                  helperText="Customers get the better of this and the product's own discount."
                />
              </>
            )}
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

      <ConfirmDialog
        open={!!pendingSave}
        onClose={() => !confirming && setPendingSave(null)}
        title="Change stores?"
        content={`${pendingSave?.removedCount} ${pendingSave?.removedCount === 1 ? 'product' : 'products'} from removed stores will be taken out of this event.`}
        action={
          <LoadingButton variant="contained" color="primary" loading={confirming} onClick={handleConfirmSave}>
            Continue
          </LoadingButton>
        }
      />
    </Dialog>
  );
}

EventFormDialog.propTypes = {
  currentEvent: PropTypes.object,
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onSuccess: PropTypes.func,
};
