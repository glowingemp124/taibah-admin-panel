import PropTypes from 'prop-types';
import { useState } from 'react';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormHelperText from '@mui/material/FormHelperText';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { ConfirmDialog } from 'src/components/custom-dialog';
import { Field } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';
import { Image } from 'src/components/image';
import { Scrollbar } from 'src/components/scrollbar';
import { toast } from 'src/components/snackbar';
import { UploadBox } from 'src/components/upload';
import { fCurrency, fNumber } from 'src/utils/format-number';

import { CATEGORY_UNITS } from 'src/sections/_active/categories-view/mock';
import { OptionValueLabel } from 'src/sections/_active/options-view';

import { applyDiscount, toImageUrl } from './product-utils';

// ----------------------------------------------------------------------

export const MAX_VARIANT_IMAGES = 5;

const NUMBER_INPUT = { inputMode: 'decimal', autoComplete: 'off' };
const INTEGER_INPUT = { inputMode: 'numeric', autoComplete: 'off' };

export const blankVariant = (category, options = {}) => ({
  _id: null,
  options: Object.fromEntries((category?.attributes || []).map((attribute) => [attribute._id, options[attribute._id] || ''])),
  price: '',
  stock: '',
  sku: '',
  amount: '',
  unit: category?.unit || 'piece',
  images: [],
});

// ----------------------------------------------------------------------

function VariantImagesField({ name }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const images = field.value || [];

        const handleDrop = (acceptedFiles) => {
          const room = MAX_VARIANT_IMAGES - images.length;
          if (acceptedFiles.length > room) {
            toast.error(`Up to ${MAX_VARIANT_IMAGES} images per variant`);
          }
          const files = acceptedFiles.slice(0, room).map((file) => Object.assign(file, { preview: URL.createObjectURL(file) }));
          field.onChange([...images, ...files]);
        };

        return (
          <Stack spacing={0.5}>
            <Stack direction="row" spacing={0.75} alignItems="center" flexWrap="wrap" useFlexGap>
              {images.map((image, index) => (
                <Box key={`${toImageUrl(image)}-${index}`} sx={{ position: 'relative', width: 40, height: 40 }}>
                  <Image alt={`Variant image ${index + 1}`} src={toImageUrl(image)} sx={{ width: 1, height: 1, borderRadius: 1 }} />
                  <IconButton
                    size="small"
                    onClick={() => field.onChange(images.filter((_, itemIndex) => itemIndex !== index))}
                    sx={{
                      p: 0.25,
                      top: -8,
                      right: -8,
                      position: 'absolute',
                      bgcolor: 'background.paper',
                      boxShadow: 1,
                      '&:hover': { bgcolor: 'background.paper' },
                    }}
                  >
                    <Iconify icon="mingcute:close-line" width={12} />
                  </IconButton>
                </Box>
              ))}

              {images.length < MAX_VARIANT_IMAGES && (
                <UploadBox
                  multiple
                  accept={{ 'image/*': [] }}
                  onDrop={handleDrop}
                  error={!!error}
                  placeholder={<Iconify icon="eva:cloud-upload-fill" width={18} />}
                  sx={{ width: 40, height: 40 }}
                />
              )}
            </Stack>
            {!!error && <FormHelperText error>{error.message}</FormHelperText>}
          </Stack>
        );
      }}
    />
  );
}

VariantImagesField.propTypes = {
  name: PropTypes.string.isRequired,
};

// ----------------------------------------------------------------------

export function ProductVariantsField({ category, offPercent, isEdit }) {
  const {
    control,
    watch,
    formState: { errors },
  } = useFormContext();

  const { fields, append, remove } = useFieldArray({ control, name: 'variants' });
  const [removeIndex, setRemoveIndex] = useState(null);

  const attributes = category?.attributes || [];
  const hasOptions = attributes.length > 0;
  const variants = watch('variants') || [];
  const hasDiscount = Number(offPercent) > 0;
  const variantsError = errors.variants?.message || errors.variants?.root?.message;

  const prices = variants.map((row) => Number(row.price)).filter((price) => price > 0);
  const lowestPrice = prices.length ? Math.min(...prices) : null;
  const totalStock = variants.reduce((sum, row) => sum + (Number.isFinite(Number(row.stock)) ? Number(row.stock) : 0), 0);

  const handleRemove = (index) => {
    if (variants[index]?._id) {
      setRemoveIndex(index);
      return;
    }
    remove(index);
  };

  const handleConfirmRemove = () => {
    remove(removeIndex);
    setRemoveIndex(null);
    toast.info('Variant removed. It will be hidden from customers once you save.');
  };

  const priceHelper = (index) => {
    const sale = hasDiscount ? applyDiscount(variants[index]?.price, offPercent) : null;
    return sale != null ? `After discount: ${fCurrency(sale)}` : undefined;
  };

  return (
    <Stack spacing={2}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent="space-between" alignItems={{ sm: 'center' }}>
        <Stack spacing={0.5}>
          <Typography variant="subtitle2">Variants</Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {hasOptions
              ? `Each variant picks one ${attributes.map((attribute) => attribute.name).join(' and ')} and has its own price and stock.`
              : `This category has no options, so the product has a single variant sold by ${category.unit}.`}
          </Typography>
        </Stack>

        {hasOptions && (
          <Button size="small" variant="contained" color="primary" startIcon={<Iconify icon="mingcute:add-line" />} onClick={() => append(blankVariant(category))}>
            Add variant
          </Button>
        )}
      </Stack>

      {isEdit && hasOptions && (
        <Alert severity="info" variant="outlined">
          Removing a variant hides it from customers.
        </Alert>
      )}

      {hasOptions ? (
        <Box sx={{ border: (theme) => `1px solid ${theme.vars.palette.divider}`, borderRadius: 1 }}>
          <Scrollbar>
            <Table size="small" sx={{ minWidth: 640 + attributes.length * 150 }}>
              <TableHead>
                <TableRow>
                  {attributes.map((attribute) => (
                    <TableCell key={attribute._id} sx={{ minWidth: 150 }}>
                      {attribute.name}
                    </TableCell>
                  ))}
                  <TableCell sx={{ minWidth: 140 }}>Price</TableCell>
                  <TableCell sx={{ minWidth: 110 }}>Stock</TableCell>
                  <TableCell sx={{ minWidth: 150 }}>SKU</TableCell>
                  <TableCell sx={{ minWidth: 150 }}>Images</TableCell>
                  <TableCell width={56} />
                </TableRow>
              </TableHead>

              <TableBody>
                {fields.map((field, index) => {
                  const comboError = errors.variants?.[index]?.combo?.message;

                  return (
                    <TableRow key={field.id} sx={{ verticalAlign: 'top', ...(comboError && { bgcolor: 'error.lighter' }) }}>
                      {attributes.map((attribute) => (
                        <TableCell key={attribute._id}>
                          <Field.Select size="small" name={`variants.${index}.options.${attribute._id}`} label={attribute.name}>
                            {attribute.values.map((item) => (
                              <MenuItem key={item._id} value={item.value}>
                                <OptionValueLabel type={attribute.type} value={item.value} label={item.label} />
                              </MenuItem>
                            ))}
                          </Field.Select>
                        </TableCell>
                      ))}

                      <TableCell>
                        <Field.Text size="small" name={`variants.${index}.price`} label="Price" inputProps={NUMBER_INPUT} helperText={priceHelper(index)} />
                      </TableCell>

                      <TableCell>
                        <Field.Text size="small" name={`variants.${index}.stock`} label="Stock" inputProps={INTEGER_INPUT} />
                      </TableCell>

                      <TableCell>
                        <Field.Text size="small" name={`variants.${index}.sku`} label="SKU" placeholder="Optional" inputProps={{ maxLength: 64, autoComplete: 'off' }} />
                        {comboError && (
                          <FormHelperText error sx={{ whiteSpace: 'nowrap' }}>
                            {comboError}
                          </FormHelperText>
                        )}
                      </TableCell>

                      <TableCell>
                        <VariantImagesField name={`variants.${index}.images`} />
                      </TableCell>

                      <TableCell>
                        <Tooltip title="Remove variant">
                          <IconButton color="error" onClick={() => handleRemove(index)}>
                            <Iconify icon="solar:trash-bin-trash-bold" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })}

                {!fields.length && (
                  <TableRow>
                    <TableCell colSpan={attributes.length + 5} sx={{ py: 3, textAlign: 'center', color: 'text.secondary' }}>
                      No variants yet. Click Add variant to create one.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Scrollbar>
        </Box>
      ) : (
        fields.slice(0, 1).map((field, index) => (
          <Stack key={field.id} spacing={2}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Field.Text name={`variants.${index}.price`} label="Price" inputProps={NUMBER_INPUT} helperText={priceHelper(index)} />
              <Field.Text name={`variants.${index}.stock`} label="Stock" inputProps={INTEGER_INPUT} />
              <Field.Text name={`variants.${index}.sku`} label="SKU" placeholder="Optional" inputProps={{ maxLength: 64, autoComplete: 'off' }} />
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'flex-start' }}>
              <Field.Text name={`variants.${index}.amount`} label="Amount" placeholder="e.g. 5" inputProps={NUMBER_INPUT} helperText="How much one item contains, e.g. 5 kg" />
              <Field.Select name={`variants.${index}.unit`} label="Unit" SelectProps={{ MenuProps: { PaperProps: { sx: { maxHeight: 220 } } } }}>
                {CATEGORY_UNITS.map((unit) => (
                  <MenuItem key={unit} value={unit}>
                    {unit}
                  </MenuItem>
                ))}
              </Field.Select>
              <Stack spacing={0.5} sx={{ minWidth: 220 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Images (optional, up to {MAX_VARIANT_IMAGES})
                </Typography>
                <VariantImagesField name={`variants.${index}.images`} />
              </Stack>
            </Stack>
          </Stack>
        ))
      )}

      {variantsError && <FormHelperText error>{variantsError}</FormHelperText>}

      <Stack direction="row" spacing={3} sx={{ typography: 'body2', color: 'text.secondary' }}>
        <span>
          From{' '}
          <Box component="span" sx={{ color: 'text.primary', fontWeight: 600 }}>
            {lowestPrice != null ? fCurrency(lowestPrice) : '—'}
          </Box>
          {hasDiscount && lowestPrice != null && (
            <>
              {' '}
              · after discount{' '}
              <Box component="span" sx={{ color: 'primary.main', fontWeight: 600 }}>
                {fCurrency(applyDiscount(lowestPrice, offPercent))}
              </Box>
            </>
          )}
        </span>
        <span>
          Total stock{' '}
          <Box component="span" sx={{ color: 'text.primary', fontWeight: 600 }}>
            {fNumber(totalStock)}
          </Box>
        </span>
      </Stack>

      <ConfirmDialog
        open={removeIndex !== null}
        onClose={() => setRemoveIndex(null)}
        title="Remove variant"
        content="Removing a variant hides it from customers. Existing orders keep their details."
        action={
          <Button variant="contained" color="error" onClick={handleConfirmRemove}>
            Remove
          </Button>
        }
      />
    </Stack>
  );
}

ProductVariantsField.propTypes = {
  category: PropTypes.object,
  offPercent: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  isEdit: PropTypes.bool,
};
