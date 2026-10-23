import { createFilterField } from 'src/components/generic-table/table-filter-fields';
import { DATE_FORMAT_PRESETS } from 'src/utils/date-formatter';

// ----------------------------------------------------------------------

export const TABLE_OPTIONS = {
  dense: true,
  filterSize: 'small',
};

export const TABLE_HEAD = [
  { id: 'sr', label: 'Sr#', width: 64 },
  { id: 'code', label: 'Order', width: 150 },
  { id: 'products', label: 'Products', width: 220 },
  { id: 'customer', label: 'Customer', width: 200 },
  { id: 'vendor', label: 'Vendor', width: 260 },
  { id: 'payment', label: 'Payment', width: 130 },
  { id: 'status', label: 'Status', width: 130 },
  { id: 'createdAt', label: 'Created At', width: 130 },
  { id: 'total', label: 'Total', width: 110 },
  { id: 'action', label: 'Action', width: 110 },
];

export const ORDER_STATUS_OPTIONS = [
  { value: 'all', label: 'All', color: 'default' },
  { value: 'pending', label: 'Pending', color: 'warning' },
  { value: 'processing', label: 'Processing', color: 'info' },
  { value: 'on-the-way', label: 'On the Way', color: 'primary' },
  { value: 'delivered', label: 'Delivered', color: 'success' },
  { value: 'cancelled', label: 'Cancelled', color: 'error' },
];

export const ORDER_STATUS_FLOW = [
  { value: 'pending', label: 'Pending', icon: 'solar:clock-circle-bold' },
  { value: 'processing', label: 'Processing', icon: 'solar:box-bold' },
  { value: 'on-the-way', label: 'On the Way', icon: 'solar:delivery-bold' },
  { value: 'delivered', label: 'Delivered', icon: 'solar:clipboard-check-bold' },
];

/**
 * Statuses a store order may move to, for sellers and admins alike: forward only (steps can be
 * skipped), Cancelled only while pending, and nothing once delivered or cancelled.
 */
export function getAllowedStatuses(current) {
  const index = ORDER_STATUS_FLOW.findIndex((step) => step.value === current);
  if (index === -1 || current === 'delivered') return [];

  const forward = ORDER_STATUS_FLOW.slice(index + 1).map((step) => step.value);
  return current === 'pending' ? [...forward, 'cancelled'] : forward;
}

// Only card exists.
export const PAYMENT_METHOD_OPTIONS = [{ value: 'card', label: 'Card' }];

// Stripe holds at checkout and captures per store when it accepts. A placed order is never "pending payment".
// partially_captured only appears at order level in the admin view.
export const PAYMENT_STATUS_OPTIONS = [
  { value: 'authorized', label: 'Held', color: 'warning' },
  { value: 'captured', label: 'Paid', color: 'success' },
  { value: 'partially_captured', label: 'Partly paid', color: 'info' },
  { value: 'released', label: 'Released', color: 'default' },
];

export const FILTER_FIELDS = [
  createFilterField.status({
    options: ORDER_STATUS_OPTIONS,
    showCounts: true,
  }),

  createFilterField.search({
    placeholder: 'Search order code (#NB-…), customer, product or store...',
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

export const getOrderStatusLabel = (value) => ORDER_STATUS_OPTIONS.find((option) => option.value === value)?.label || value || 'N/A';

export const getPaymentLabel = (value) => PAYMENT_METHOD_OPTIONS.find((option) => option.value === value)?.label || value || 'N/A';

export const getPaymentStatus = (value) => PAYMENT_STATUS_OPTIONS.find((option) => option.value === value) || PAYMENT_STATUS_OPTIONS[0];
