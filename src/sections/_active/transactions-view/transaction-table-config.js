import { createFilterField } from 'src/components/generic-table/table-filter-fields';
import { DATE_FORMAT_PRESETS } from 'src/utils/date-formatter';

// ----------------------------------------------------------------------

export const TABLE_OPTIONS = {
  dense: true,
  filterSize: 'small',
};

export const TABLE_HEAD = [
  { id: 'sr', label: 'Sr#', width: 64 },
  { id: 'transactionId', label: 'Txn ID', width: 200 },
  { id: 'orderId', label: 'Order ID', width: 140 },
  { id: 'customer', label: 'Customer', width: 200 },
  { id: 'vendor', label: 'Vendor', width: 200 },
  { id: 'paymentMethod', label: 'Payment', width: 160 },
  { id: 'amount', label: 'Amount', width: 110 },
  { id: 'status', label: 'Status', width: 120 },
  { id: 'createdAt', label: 'Date', width: 140 },
  { id: 'action', label: 'Action', width: 90 },
];

export const TRANSACTION_STATUS_OPTIONS = [
  { value: 'all', label: 'All', color: 'default' },
  { value: 'captured', label: 'Paid', color: 'success' },
  { value: 'authorized', label: 'Held', color: 'warning' },
  { value: 'released', label: 'Released', color: 'default' },
];

// Only card exists.
export const PAYMENT_OPTIONS = [{ value: 'card', label: 'Credit / Debit Card' }];

export const FILTER_FIELDS = [
  createFilterField.status({
    options: TRANSACTION_STATUS_OPTIONS,
    showCounts: true,
  }),

  createFilterField.search({
    placeholder: 'Search transaction ID, order ID, customer or vendor...',
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

export const getTransactionStatusColor = (value) => TRANSACTION_STATUS_OPTIONS.find((option) => option.value === value)?.color || 'default';

export const getTransactionStatusLabel = (value) => TRANSACTION_STATUS_OPTIONS.find((option) => option.value === value)?.label || value || 'N/A';

export const getPaymentLabel = (value) => PAYMENT_OPTIONS.find((option) => option.value === value)?.label || value || 'N/A';
