import { createFilterField } from 'src/components/generic-table/table-filter-fields';
import { DATE_FORMAT_PRESETS } from 'src/utils/date-formatter';

// ----------------------------------------------------------------------

export const TABLE_OPTIONS = {
  dense: true,
  filterSize: 'small',
};

export const TABLE_HEAD = [
  { id: 'sr', label: 'Sr#', width: 64 },
  { id: 'orderId', label: 'Order ID', width: 140 },
  { id: 'products', label: 'Products', width: 220 },
  { id: 'customer', label: 'Customer', width: 200 },
  { id: 'vendor', label: 'Vendor', width: 220 },
  { id: 'paymentMethod', label: 'Payment', width: 170 },
  { id: 'status', label: 'Status', width: 150 },
  { id: 'createdAt', label: 'Created At', width: 140 },
  { id: 'total', label: 'Total', width: 110 },
  { id: 'action', label: 'Action', width: 110 },
];

export const ORDER_STATUS_OPTIONS = [
  { value: 'all', label: 'All', color: 'default' },
  { value: 'pending', label: 'Pending', color: 'warning' },
  { value: 'processing', label: 'Processing', color: 'info' },
  { value: 'on-the-way', label: 'On the Way', color: 'primary' },
  { value: 'delivered', label: 'Delivered', color: 'success' },
];

export const ORDER_STATUS_FLOW = [
  { value: 'pending', label: 'Pending', icon: 'solar:clock-circle-bold' },
  { value: 'processing', label: 'Processing', icon: 'solar:box-bold' },
  { value: 'on-the-way', label: 'On the Way', icon: 'solar:delivery-bold' },
  { value: 'delivered', label: 'Delivered', icon: 'solar:clipboard-check-bold' },
];

export const PAYMENT_OPTIONS = [
  { value: 'cash-on-delivery', label: 'Cash On Delivery' },
  { value: 'card', label: 'Credit / Debit Card' },
];

export const FILTER_FIELDS = [
  createFilterField.status({
    options: ORDER_STATUS_OPTIONS,
    showCounts: true,
  }),

  createFilterField.search({
    placeholder: 'Search order ID, customer, vendor or product...',
  }),

  createFilterField.select({
    key: 'paymentMethod',
    label: 'Payment',
    placeholder: 'Payment',
    defaultValue: 'all',
    options: [{ value: 'all', label: 'All Payments' }, ...PAYMENT_OPTIONS],
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

export const getOrderStatusLabel = (value) =>
  ORDER_STATUS_OPTIONS.find((option) => option.value === value)?.label || value || 'N/A';

export const getPaymentLabel = (value) =>
  PAYMENT_OPTIONS.find((option) => option.value === value)?.label || value || 'N/A';
