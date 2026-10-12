import { createFilterField } from 'src/components/generic-table/table-filter-fields';

// ----------------------------------------------------------------------

export const TABLE_OPTIONS = {
  dense: true,
  filterSize: 'small',
};

export const TABLE_HEAD = [
  { id: 'sr', label: 'Sr#', width: 72 },
  { id: 'image', label: 'Image', width: 88 },
  { id: 'name', label: 'Name' },
  { id: 'phone', label: 'Phone', width: 160 },
  { id: 'userType', label: 'User Type', width: 200 },
  { id: 'joinedAt', label: 'Joined Date', width: 140 },
  { id: 'status', label: 'Status', width: 120 },
  { id: 'action', label: 'Action', width: 120 },
];

export const STATUS_OPTIONS = [
  { value: 'all', label: 'All', color: 'default' },
  { value: 'active', label: 'Active', color: 'success' },
  { value: 'inactive', label: 'Inactive', color: 'error' },
];

export const USER_STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

export const USER_TYPE_OPTIONS = [
  { value: 'buyer', label: 'Buyer', color: 'info' },
  { value: 'seller', label: 'Seller', color: 'warning' },
];

export const USER_TYPE_FILTER_OPTIONS = [
  { value: 'all', label: 'All Types' },
  { value: 'buyer', label: 'Buyer' },
  { value: 'seller', label: 'Seller' },
  { value: 'both', label: 'Buyer & Seller' },
];

export const FILTER_FIELDS = [
  createFilterField.status({
    options: STATUS_OPTIONS,
    showCounts: true,
  }),

  createFilterField.search({
    placeholder: 'Search name, email or phone...',
  }),

  createFilterField.select({
    key: 'userType',
    label: 'User Type',
    placeholder: 'User Type',
    defaultValue: 'all',
    options: USER_TYPE_FILTER_OPTIONS,
  }),
];

export const DEFAULT_FILTERS = FILTER_FIELDS.reduce((acc, field) => {
  acc[field.key] = field.defaultValue;
  return acc;
}, {});

export const STATUS_FILTER_FIELD = FILTER_FIELDS.find((field) => field.type === 'status');

export const TOOLBAR_FILTER_FIELDS = FILTER_FIELDS.filter((field) => field.type !== 'status');
