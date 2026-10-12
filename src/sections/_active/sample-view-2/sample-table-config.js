import { createFilterField } from 'src/components/generic-table/table-filter-fields';
import { DATE_FORMAT_PRESETS } from 'src/utils/date-formatter';

// ----------------------------------------------------------------------
// Copy this file first when creating a new list. These are the only table
// settings a new module usually needs to change.

export const TABLE_OPTIONS = {
  dense: true, // false = normal row height
  filterSize: 'small', // 'small' | 'medium'
};

export const TABLE_HEAD = [
  { id: 'sr', label: 'Sr#', width: 80 },
  { id: 'name', label: 'Name' },
  { id: 'balance', label: 'Balance' },
  { id: 'createdAt', label: 'Created At' },
  { id: 'status', label: 'Status' },
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
    placeholder: 'Search samples...',
  }),

  createFilterField.dateRange({
    key: 'dateRange',
    startLabel: 'Start Date',
    endLabel: 'End Date',
    displayFormat: DATE_FORMAT_PRESETS.UK,
    apiFormat: DATE_FORMAT_PRESETS.ISO,
    outputFormat: 'flat',
  }),

  // Optional extras — uncomment if the module needs them:
  // createFilterField.select({
  //   key: 'timePeriod',
  //   label: 'Time Period',
  //   options: [
  //     { value: 'all', label: 'All Time' },
  //     { value: 'today', label: 'Today' },
  //     { value: 'week', label: 'This Week' },
  //     { value: 'month', label: 'This Month' },
  //   ],
  // }),
  // createFilterField.date({
  //   key: 'date',
  //   label: 'Created Date',
  //   placeholder: 'Select date',
  //   displayFormat: DATE_FORMAT_PRESETS.UK,
  //   apiFormat: DATE_FORMAT_PRESETS.ISO,
  // }),
];

export const DEFAULT_FILTERS = FILTER_FIELDS.reduce((acc, field) => {
  acc[field.key] = field.defaultValue;
  return acc;
}, {});

export const STATUS_FILTER_FIELD = FILTER_FIELDS.find((field) => field.type === 'status');

export const TOOLBAR_FILTER_FIELDS = FILTER_FIELDS.filter((field) => field.type !== 'status');
