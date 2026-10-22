import { zodResolver } from '@hookform/resolvers/zod';
import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { z as zod } from 'zod';

import LoadingButton from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormHelperText from '@mui/material/FormHelperText';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { Field, Form } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';
import { toast } from 'src/components/snackbar';

import { getUsedOptionValues, isOptionInUse, syncOptionOnProducts, upsertMockOption } from './mock';
import { OPTION_TYPE_OPTIONS } from './option-table-config';

// ----------------------------------------------------------------------

const HEX_COLOR = /^#[0-9A-Fa-f]{6}$/;

const OptionSchema = zod
  .object({
    name: zod.string().trim().min(1, { message: 'Name is required!' }).max(50, { message: 'Name must be at most 50 characters!' }),
    type: zod.enum(['select', 'color']),
    values: zod
      .array(
        zod.object({
          _id: zod.string().nullable().optional(),
          value: zod.string(),
          label: zod.string(),
        })
      )
      .min(1, { message: 'Add at least one value!' }),
  })
  .superRefine((data, ctx) => {
    const seen = new Set();

    data.values.forEach((item, index) => {
      const value = item.value.trim();

      if (data.type === 'color') {
        if (!HEX_COLOR.test(value)) {
          ctx.addIssue({ code: zod.ZodIssueCode.custom, path: ['values', index, 'value'], message: 'Use a hex color like #1B5E4B' });
        }
        if (!item.label.trim()) {
          ctx.addIssue({ code: zod.ZodIssueCode.custom, path: ['values', index, 'label'], message: 'Label is required!' });
        }
      } else if (!value) {
        ctx.addIssue({ code: zod.ZodIssueCode.custom, path: ['values', index, 'value'], message: 'Value is required!' });
      }

      const key = value.toLowerCase();
      if (value && seen.has(key)) {
        ctx.addIssue({ code: zod.ZodIssueCode.custom, path: ['values', index, 'value'], message: 'Values must be unique!' });
      }
      seen.add(key);
    });
  });

// ----------------------------------------------------------------------

export function OptionFormDialog({ currentOption, open, onClose, onSuccess }) {
  const isEdit = !!currentOption;
  const [newValue, setNewValue] = useState('');

  // Values already picked by product variants are locked; labels and new values are still allowed.
  const usedValues = useMemo(() => (open && currentOption ? getUsedOptionValues(currentOption._id) : new Set()), [currentOption, open]);
  const inUse = useMemo(() => (open && currentOption ? isOptionInUse(currentOption._id) : false), [currentOption, open]);

  const defaultValues = useMemo(
    () => ({
      name: currentOption?.name || '',
      type: currentOption?.type || 'select',
      values: (currentOption?.values || []).map((item) => ({ _id: item._id, value: item.value, label: item.label })),
    }),
    [currentOption]
  );

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(OptionSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  const { fields, append, remove, replace } = useFieldArray({ control: methods.control, name: 'values' });

  const type = watch('type');
  const values = watch('values');
  const valuesError = errors.values?.message || errors.values?.root?.message;

  useEffect(() => {
    if (open) {
      reset(defaultValues);
      setNewValue('');
    }
  }, [open, defaultValues, reset]);

  const handleTypeChange = (event) => {
    setValue('type', event.target.value, { shouldValidate: true });
    replace([]);
  };

  const handleAddSelectValue = () => {
    const value = newValue.trim();
    if (!value) return;

    if (values.some((item) => item.value.trim().toLowerCase() === value.toLowerCase())) {
      toast.error(`"${value}" is already added`);
      return;
    }

    append({ _id: null, value, label: value });
    setNewValue('');
  };

  const handleAddColor = () => {
    append({ _id: null, value: '#000000', label: '' });
  };

  const onSubmit = handleSubmit(async (data) => {
    const blocked = [...usedValues].filter((usedValue) => {
      const original = currentOption.values.find((item) => item.value === usedValue);
      const current = data.values.find((item) => item._id && item._id === original?._id);
      return !current || current.value.trim() !== usedValue;
    });

    if (blocked.length) {
      const message = `Values used by products can't be removed or renamed: ${blocked.join(', ')}`;
      setError('values', { type: 'manual', message });
      toast.error(message);
      return;
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 400));

      const saved = upsertMockOption({
        _id: currentOption?._id,
        name: data.name.trim(),
        type: data.type,
        values: data.values.map((item) => {
          const value = data.type === 'color' ? item.value.trim().toUpperCase() : item.value.trim();
          return { _id: item._id, value, label: data.type === 'color' ? item.label.trim() : value };
        }),
      });
      syncOptionOnProducts(saved);

      toast.success(isEdit ? 'Option updated successfully!' : 'Option created successfully!');
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error(isEdit ? 'Failed to update option' : 'Failed to create option');
    }
  });

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogTitle>{isEdit ? 'Edit Option' : 'New Option'}</DialogTitle>

        <DialogContent>
          <Stack spacing={3} sx={{ pt: 1 }}>
            {isEdit && usedValues.size > 0 && (
              <Alert severity="info">
                Values used by products can&apos;t be removed or renamed: {[...usedValues].join(', ')}. Labels can still be edited, and new values can be added.
              </Alert>
            )}

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Field.Text name="name" label="Name" placeholder="e.g. Size" inputProps={{ maxLength: 50 }} />

              <Field.Select
                name="type"
                label="Type"
                onChange={handleTypeChange}
                disabled={inUse}
                helperText={inUse ? "Type can't change while the option is in use" : undefined}
                sx={{ maxWidth: { sm: 200 } }}
              >
                {OPTION_TYPE_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Field.Select>
            </Stack>

            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Values</Typography>

              {type === 'select' && (
                <>
                  <Stack direction="row" spacing={1.5} alignItems="flex-start">
                    <TextField
                      size="small"
                      fullWidth
                      value={newValue}
                      label="New value"
                      placeholder="e.g. S, M, L or 50, 100"
                      onChange={(event) => setNewValue(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                          event.preventDefault();
                          handleAddSelectValue();
                        }
                      }}
                    />
                    <Button variant="contained" color="primary" onClick={handleAddSelectValue} sx={{ height: 40, flexShrink: 0 }}>
                      Add
                    </Button>
                  </Stack>

                  {!!fields.length && (
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      {fields.map((field, index) => {
                        const locked = !!field._id && usedValues.has(field.value);
                        const chip = (
                          <Chip
                            key={field.id}
                            label={values[index]?.value}
                            color={errors.values?.[index] ? 'error' : 'default'}
                            onDelete={locked ? undefined : () => remove(index)}
                            icon={locked ? <Iconify icon="solar:lock-keyhole-minimalistic-bold" width={16} /> : undefined}
                          />
                        );

                        return locked ? (
                          <Tooltip key={field.id} title="Used by products">
                            {chip}
                          </Tooltip>
                        ) : (
                          chip
                        );
                      })}
                    </Stack>
                  )}
                </>
              )}

              {type === 'color' && (
                <>
                  {fields.map((field, index) => {
                    const locked = !!field._id && usedValues.has(field.value);
                    const hex = values[index]?.value || '';

                    return (
                      <Stack key={field.id} direction="row" spacing={1.5} alignItems="flex-start">
                        <Box
                          component="input"
                          type="color"
                          value={HEX_COLOR.test(hex) ? hex : '#000000'}
                          disabled={locked}
                          onChange={(event) => setValue(`values.${index}.value`, event.target.value.toUpperCase(), { shouldValidate: true })}
                          aria-label="Pick color"
                          sx={{
                            width: 40,
                            height: 40,
                            p: 0.5,
                            flexShrink: 0,
                            border: (theme) => `1px solid ${theme.vars.palette.divider}`,
                            borderRadius: 1,
                            bgcolor: 'background.paper',
                            cursor: locked ? 'not-allowed' : 'pointer',
                          }}
                        />
                        <Field.Text size="small" name={`values.${index}.value`} label="Hex" placeholder="#RRGGBB" disabled={locked} sx={{ maxWidth: 140 }} />
                        <Field.Text size="small" name={`values.${index}.label`} label="Label" placeholder="e.g. Black" />
                        <Tooltip title={locked ? 'Used by products' : 'Remove'}>
                          <span>
                            <IconButton color="error" disabled={locked} onClick={() => remove(index)}>
                              <Iconify icon={locked ? 'solar:lock-keyhole-minimalistic-bold' : 'solar:trash-bin-trash-bold'} />
                            </IconButton>
                          </span>
                        </Tooltip>
                      </Stack>
                    );
                  })}

                  <Box>
                    <Button size="small" variant="outlined" color="primary" startIcon={<Iconify icon="mingcute:add-line" />} onClick={handleAddColor}>
                      Add color
                    </Button>
                  </Box>
                </>
              )}

              {type === 'select' &&
                fields.map((field, index) =>
                  errors.values?.[index]?.value?.message ? (
                    <FormHelperText key={field.id} error>
                      {values[index]?.value}: {errors.values[index].value.message}
                    </FormHelperText>
                  ) : null
                )}

              {valuesError && <FormHelperText error>{valuesError}</FormHelperText>}
            </Stack>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" color="primary" onClick={onClose}>
            Cancel
          </Button>
          <LoadingButton type="submit" variant="contained" color="primary" loading={isSubmitting}>
            {isEdit ? 'Save Changes' : 'Create Option'}
          </LoadingButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
}

OptionFormDialog.propTypes = {
  currentOption: PropTypes.object,
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onSuccess: PropTypes.func,
};
