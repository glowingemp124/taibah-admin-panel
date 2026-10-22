import { createFilterField } from 'src/components/generic-table/table-filter-fields';

import { MOCK_CATEGORIES } from 'src/sections/_active/categories-view/mock/categories';

// ----------------------------------------------------------------------

export const TABLE_OPTIONS = {
  dense: true,
  filterSize: 'small',
};

export const TABLE_HEAD = [
  { id: 'sr', label: 'Sr#', width: 72 },
  { id: 'image', label: 'Image', width: 88 },
  { id: 'title', label: 'Title', width: 220 },
  { id: 'category', label: 'Category', width: 130 },
  { id: 'company', label: 'Company', width: 160 },
  { id: 'price', label: 'Price', width: 160 },
  { id: 'stock', label: 'Stock', width: 120 },
  { id: 'variants', label: 'Variants', width: 110 },
  { id: 'reviews', label: 'Reviews', width: 130 },
  { id: 'favorite', label: 'Favorite', width: 90 },
  { id: 'status', label: 'Status', width: 100 },
  { id: 'review', label: 'Review', width: 110 },
  { id: 'action', label: 'Action', width: 140 },
];

export const getTableHead = ({ showCompany = true } = {}) => (showCompany ? TABLE_HEAD : TABLE_HEAD.filter((cell) => cell.id !== 'company'));

export const PRODUCT_STATUS_OPTIONS = [
  { value: 'all', label: 'All', color: 'default' },
  { value: 'active', label: 'Active', color: 'success' },
  { value: 'inactive', label: 'Inactive', color: 'error' },
];

export const PRODUCT_STATUS_EDIT_OPTIONS = PRODUCT_STATUS_OPTIONS.filter((option) => option.value !== 'all');

export const REVIEW_STATUS_OPTIONS = [
  { value: 'all', label: 'All', color: 'default' },
  { value: 'pending', label: 'Pending', color: 'warning' },
  { value: 'approved', label: 'Approved', color: 'success' },
  { value: 'rejected', label: 'Rejected', color: 'error' },
];

export const SALE_FILTER_OPTIONS = [
  { value: 'all', label: 'All Products' },
  { value: 'on-sale', label: 'On Sale' },
  { value: 'regular', label: 'No Sale' },
];

export const RATING_FILTER_OPTIONS = [
  { value: 'all', label: 'All Ratings' },
  { value: '5', label: '5 Stars' },
  { value: '4', label: '4 Stars' },
  { value: '3', label: '3 Stars' },
  { value: '2', label: '2 Stars' },
  { value: '1', label: '1 Star' },
];

export const FILTER_FIELDS = [
  createFilterField.status({
    options: PRODUCT_STATUS_OPTIONS,
    showCounts: true,
  }),

  createFilterField.search({
    placeholder: 'Search title, SKU or store...',
  }),

  createFilterField.select({
    key: 'reviewStatus',
    label: 'Review',
    placeholder: 'Review',
    defaultValue: 'all',
    options: REVIEW_STATUS_OPTIONS,
  }),

  createFilterField.select({
    key: 'category',
    label: 'Category',
    placeholder: 'Category',
    defaultValue: 'all',
    options: [{ value: 'all', label: 'All Categories' }, ...MOCK_CATEGORIES.map((category) => ({ value: category._id, label: category.title }))],
  }),

  createFilterField.select({
    key: 'sale',
    label: 'Sale',
    placeholder: 'Sale',
    defaultValue: 'all',
    options: SALE_FILTER_OPTIONS,
  }),

  createFilterField.select({
    key: 'rating',
    label: 'Rating',
    placeholder: 'Rating',
    defaultValue: 'all',
    options: RATING_FILTER_OPTIONS,
  }),
];

export const DEFAULT_FILTERS = FILTER_FIELDS.reduce((acc, field) => {
  acc[field.key] = field.defaultValue;
  return acc;
}, {});

export const STATUS_FILTER_FIELD = FILTER_FIELDS.find((field) => field.type === 'status');

export const TOOLBAR_FILTER_FIELDS = FILTER_FIELDS.filter((field) => field.type !== 'status');

export const getProductStatusLabel = (value) => PRODUCT_STATUS_OPTIONS.find((option) => option.value === value)?.label || value || 'N/A';

export const getReviewStatus = (value) => REVIEW_STATUS_OPTIONS.find((option) => option.value === value) || REVIEW_STATUS_OPTIONS[1];
