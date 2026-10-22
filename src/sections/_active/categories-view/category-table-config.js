import { createFilterField } from 'src/components/generic-table/table-filter-fields';

// ----------------------------------------------------------------------

export const TABLE_OPTIONS = {
  dense: true,
  filterSize: 'small',
};

export const TABLE_HEAD = [
  { id: 'sr', label: 'Sr#', width: 80 },
  { id: 'image', label: 'Image', width: 88 },
  { id: 'title', label: 'Title' },
  { id: 'unit', label: 'Unit', width: 100 },
  { id: 'options', label: 'Options', width: 240 },
  { id: 'status', label: 'Status', width: 140 },
  { id: 'createdAt', label: 'Created At', width: 180 },
  { id: 'action', label: 'Action', width: 100 },
];

export const STATUS_OPTIONS = [
  { value: 'all', label: 'All', color: 'default' },
  { value: 'active', label: 'Active', color: 'success' },
  { value: 'inactive', label: 'Inactive', color: 'error' },
];

export const FILTER_FIELDS = [
  createFilterField.status({
    options: STATUS_OPTIONS,
    showCounts: true,
  }),

  createFilterField.search({
    placeholder: 'Search categories...',
  }),
];

export const DEFAULT_FILTERS = FILTER_FIELDS.reduce((acc, field) => {
  acc[field.key] = field.defaultValue;
  return acc;
}, {});

export const STATUS_FILTER_FIELD = FILTER_FIELDS.find((field) => field.type === 'status');

export const TOOLBAR_FILTER_FIELDS = FILTER_FIELDS.filter((field) => field.type !== 'status');
