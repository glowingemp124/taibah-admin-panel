import { createFilterField } from 'src/components/generic-table/table-filter-fields';
import { DATE_FORMAT_PRESETS } from 'src/utils/date-formatter';

// ----------------------------------------------------------------------

export const TABLE_OPTIONS = {
  dense: true,
  filterSize: 'small',
};

export const TABLE_HEAD = [
  { id: 'sr', label: 'Sr#', width: 72 },
  { id: 'title', label: 'Title', width: 180 },
  // { id: 'message', label: 'Message', width: 220 },
  { id: 'type', label: 'Type', width: 130 },
  { id: 'recipient', label: 'Recipient', width: 150 },
  { id: 'channel', label: 'Channel', width: 110 },
  { id: 'status', label: 'Status', width: 120 },
  { id: 'createdAt', label: 'Created At', width: 140 },
  { id: 'scheduledAt', label: 'Scheduled', width: 140 },
  { id: 'action', label: 'Action', width: 132 },
];

export const STATUS_OPTIONS = [
  { value: 'all', label: 'All', color: 'default' },
  { value: 'draft', label: 'Draft', color: 'default' },
  { value: 'scheduled', label: 'Scheduled', color: 'warning' },
  { value: 'sending', label: 'Sending', color: 'info' },
  { value: 'sent', label: 'Sent', color: 'success' },
  { value: 'failed', label: 'Failed', color: 'error' },
];

export const TYPE_OPTIONS = [
  { value: 'system', label: 'System' },
  { value: 'transaction', label: 'Transaction' },
  { value: 'security', label: 'Security' },
  { value: 'promotion', label: 'Promotion' },
];

export const RECIPIENT_OPTIONS = [
  { value: 'all', label: 'All Users' },
  { value: 'user', label: 'Specific User' },
  { value: 'group', label: 'User Group' },
];

export const USER_GROUP_OPTIONS = [
  { value: 'customers', label: 'Customers' },
  { value: 'sellers', label: 'Sellers' },
  { value: 'active', label: 'Active customers', hint: 'Ordered in the last 30 days' },
  { value: 'inactive', label: 'Inactive customers', hint: 'No order in 90 days' },
];

// In-App also sends a push to the devices that have the app.
export const CHANNEL_OPTIONS = [
  { value: 'in-app', label: 'In-App (also sends a push)' },
  { value: 'email', label: 'Email' },
];

export const getBroadcastStatus = (value) => STATUS_OPTIONS.find((option) => option.value === value) || { value, label: value || 'N/A', color: 'default' };

export const labelFrom = (options, value) => options.find((option) => option.value === value)?.label || value || 'N/A';

export const getRecipientLabel = (row) => {
  if (row.recipient === 'group') return labelFrom(USER_GROUP_OPTIONS, row.userGroup);
  if (row.recipient === 'user') return row.userQuery || 'Specific User';
  return labelFrom(RECIPIENT_OPTIONS, row.recipient);
};

export const SCHEDULE_OPTIONS = [
  { value: 'immediate', label: 'Send Immediately' },
  { value: 'later', label: 'Schedule for Later' },
];

export const FILTER_FIELDS = [
  createFilterField.status({
    options: STATUS_OPTIONS,
    showCounts: true,
  }),

  createFilterField.search({
    placeholder: 'Search notifications...',
  }),

  createFilterField.dateRange({
    key: 'dateRange',
    startLabel: 'Start Date',
    endLabel: 'End Date',
    displayFormat: DATE_FORMAT_PRESETS.UK,
    apiFormat: DATE_FORMAT_PRESETS.ISO,
    outputFormat: 'flat',
  }),
];

export const DEFAULT_FILTERS = FILTER_FIELDS.reduce((acc, field) => {
  acc[field.key] = field.defaultValue;
  return acc;
}, {});

export const STATUS_FILTER_FIELD = FILTER_FIELDS.find((field) => field.type === 'status');

export const TOOLBAR_FILTER_FIELDS = FILTER_FIELDS.filter((field) => field.type !== 'status');
