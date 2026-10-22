import dayjs from 'dayjs';

// ----------------------------------------------------------------------

export const applyDiscount = (price, offPercent) => {
  const off = Number(offPercent) || 0;
  const base = Number(price) || 0;
  if (off <= 0 || !base) return null;
  return Math.round(base * (1 - off / 100) * 100) / 100;
};

// A discount is live when it has a % and today falls inside its (optional) start and end dates.
export const isDiscountActive = (product, now = new Date()) => {
  if (!(Number(product?.offPercent) > 0)) return false;

  const today = dayjs(now);
  if (product.discountStartsAt && today.isBefore(dayjs(product.discountStartsAt).startOf('day'))) return false;
  if (product.discountEndsAt && today.isAfter(dayjs(product.discountEndsAt).endOf('day'))) return false;

  return true;
};

const minOf = (values) => (values.length ? Math.min(...values) : 0);

// Recomputes the derived fields (onSale, price, salePrice, stock and each variant's salePrice).
export function summarizeProduct(product) {
  const onSale = isDiscountActive(product);
  const variants = (product.variants || []).map((variant) => ({
    ...variant,
    salePrice: onSale ? applyDiscount(variant.price, product.offPercent) : null,
  }));

  return {
    ...product,
    variants,
    onSale,
    price: minOf(variants.map((variant) => Number(variant.price) || 0)),
    salePrice: onSale ? minOf(variants.map((variant) => variant.salePrice ?? variant.price)) : null,
    stock: variants.reduce((sum, variant) => sum + (Number(variant.stock) || 0), 0),
  };
}

export const getVariantKey = (options = []) =>
  [...options]
    .map((option) => `${option.attribute?._id}:${option.value}`)
    .sort()
    .join('|');

export const getVariantLabel = (variant) => {
  if (variant?.options?.length) {
    return variant.options.map((option) => option.label || option.value).join(' / ');
  }
  if (variant?.amount) {
    return `${variant.amount} ${variant.unit || ''}`.trim();
  }
  return 'Default';
};

export const getVariantCountLabel = (product) => {
  const count = product?.variants?.length || 0;
  return `${count} ${count === 1 ? 'variant' : 'variants'}`;
};

export const hasMultipleVariants = (product) => (product?.variants?.length || 0) > 1;

export const getDisplayPrice = (product) => (product?.onSale && product.salePrice != null ? product.salePrice : product?.price);

export const toImageUrl = (file) => {
  if (!file) return '';
  if (typeof file === 'string') return file;
  if (file.preview) return file.preview;
  return URL.createObjectURL(file);
};

export const toImageKey = (file, prefix = 'products') => {
  if (!file) return null;
  const name = typeof file === 'string' ? file.split('/').pop() : file.name;
  return `${prefix}/${name}`;
};
