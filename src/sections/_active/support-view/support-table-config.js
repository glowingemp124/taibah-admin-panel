import { createFilterField } from 'src/components/generic-table/table-filter-fields';

// ----------------------------------------------------------------------

export const TABLE_OPTIONS = {
  dense: true,
  filterSize: 'small',
};

export const TABLE_HEAD = [
  { id: 'sr', label: 'Sr#', width: 64 },
  { id: 'user', label: 'User', width: 220 },
  { id: 'phone', label: 'Phone', width: 160 },
  { id: 'subject', label: 'Subject', width: 240 },
  { id: 'message', label: 'Message', width: 220 },
  { id: 'priority', label: 'Priority', width: 110 },
  { id: 'createdAt', label: 'Received At', width: 140 },
  { id: 'status', label: 'Status', width: 110 },
  { id: 'action', label: 'Action', width: 110 },
];

export const SUPPORT_STATUS_OPTIONS = [
  { value: 'all', label: 'All', color: 'default' },
  { value: 'open', label: 'Open', color: 'success' },
  { value: 'closed', label: 'Closed', color: 'default' },
];

export const PRIORITY_OPTIONS = [
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

export const FILTER_FIELDS = [
  createFilterField.status({
    options: SUPPORT_STATUS_OPTIONS,
    showCounts: true,
  }),

  createFilterField.search({
    placeholder: 'Search name, email, subject or message...',
  }),

  createFilterField.select({
    key: 'priority',
    label: 'Priority',
    placeholder: 'Priority',
    defaultValue: 'all',
    options: [{ value: 'all', label: 'All Priorities' }, ...PRIORITY_OPTIONS],
  }),
];

export const DEFAULT_FILTERS = FILTER_FIELDS.reduce((acc, field) => {
  acc[field.key] = field.defaultValue;
  return acc;
}, {});

export const STATUS_FILTER_FIELD = FILTER_FIELDS.find((field) => field.type === 'status');

export const TOOLBAR_FILTER_FIELDS = FILTER_FIELDS.filter((field) => field.type !== 'status');

export const getSupportStatusLabel = (value) =>
  SUPPORT_STATUS_OPTIONS.find((option) => option.value === value)?.label || value || 'N/A';

export const getPriorityLabel = (value) =>
  PRIORITY_OPTIONS.find((option) => option.value === value)?.label || value || 'N/A';
