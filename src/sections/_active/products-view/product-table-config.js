import { createFilterField } from 'src/components/generic-table/table-filter-fields';

// ----------------------------------------------------------------------

export const TABLE_OPTIONS = {
  dense: true,
  filterSize: 'small',
};

export const TABLE_HEAD = [
  { id: 'sr', label: 'Sr#', width: 72 },
  { id: 'image', label: 'Image', width: 88 },
  { id: 'title', label: 'Title', width: 220 },
  { id: 'category', label: 'Category', width: 140 },
  { id: 'company', label: 'Company', width: 170 },
  { id: 'price', label: 'Price', width: 150 },
  { id: 'reviews', label: 'Reviews', width: 130 },
  { id: 'availability', label: 'Availability', width: 130 },
  { id: 'action', label: 'Action', width: 140 },
];

export const AVAILABILITY_OPTIONS = [
  { value: 'all', label: 'All', color: 'default' },
  { value: 'in-stock', label: 'In Stock', color: 'success' },
  { value: 'low-stock', label: 'Low Stock', color: 'warning' },
  { value: 'out-of-stock', label: 'Out of Stock', color: 'error' },
];

export const CATEGORY_OPTIONS = [
  { value: 'Modest Fashion', label: 'Modest Fashion' },
  { value: 'Accessories', label: 'Accessories' },
  { value: 'Hijab', label: 'Hijab' },
  { value: 'Prayer Items', label: 'Prayer Items' },
  { value: 'Islamic Gifts', label: 'Islamic Gifts' },
  { value: 'Fragrance', label: 'Fragrance' },
  { value: 'Home & Decor', label: 'Home & Decor' },
  { value: 'Eid Collection', label: 'Eid Collection' },
  { value: 'New Arrivals', label: 'New Arrivals' },
  { value: 'Islamic Wear', label: 'Islamic Wear' },
];

export const COLOR_OPTIONS = [
  { value: '#1B5E4B', label: 'Forest Green' },
  { value: '#000000', label: 'Black' },
  { value: '#8D6E3C', label: 'Brown' },
  { value: '#1565C0', label: 'Blue' },
  { value: '#26A69A', label: 'Teal' },
  { value: '#D4A017', label: 'Gold' },
  { value: '#C9A96E', label: 'Beige' },
  { value: '#6D4C41', label: 'Coffee' },
  { value: '#FFFFFF', label: 'White' },
];

export const FILTER_FIELDS = [
  createFilterField.status({
    key: 'availability',
    label: 'Availability',
    options: AVAILABILITY_OPTIONS,
    showCounts: true,
  }),

  createFilterField.search({
    placeholder: 'Search products...',
  }),

  createFilterField.select({
    key: 'category',
    label: 'Category',
    placeholder: 'Category',
    defaultValue: 'all',
    options: [{ value: 'all', label: 'All Categories' }, ...CATEGORY_OPTIONS],
  }),
];

export const DEFAULT_FILTERS = FILTER_FIELDS.reduce((acc, field) => {
  acc[field.key] = field.defaultValue;
  return acc;
}, {});

export const STATUS_FILTER_FIELD = FILTER_FIELDS.find((field) => field.type === 'status');

export const TOOLBAR_FILTER_FIELDS = FILTER_FIELDS.filter((field) => field.type !== 'status');

export const getAvailabilityLabel = (value) =>
  AVAILABILITY_OPTIONS.find((option) => option.value === value)?.label || value || 'N/A';

export const getColorLabel = (value) => COLOR_OPTIONS.find((option) => option.value === value)?.label || value;
