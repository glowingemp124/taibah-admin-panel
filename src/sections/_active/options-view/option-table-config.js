import { createFilterField } from 'src/components/generic-table/table-filter-fields';

// ----------------------------------------------------------------------

export const TABLE_OPTIONS = {
  dense: true,
  filterSize: 'small',
};

export const TABLE_HEAD = [
  { id: 'sr', label: 'Sr#', width: 80 },
  { id: 'name', label: 'Name', width: 180 },
  { id: 'type', label: 'Type', width: 120 },
  { id: 'values', label: 'Values' },
  { id: 'action', label: 'Actions', width: 110 },
];

export const OPTION_TYPE_OPTIONS = [
  { value: 'select', label: 'Select', color: 'info' },
  { value: 'color', label: 'Color', color: 'secondary' },
];

export const FILTER_FIELDS = [
  createFilterField.search({
    placeholder: 'Search options...',
  }),
];

export const DEFAULT_FILTERS = FILTER_FIELDS.reduce((acc, field) => {
  acc[field.key] = field.defaultValue;
  return acc;
}, {});

export const getOptionType = (value) => OPTION_TYPE_OPTIONS.find((option) => option.value === value) || OPTION_TYPE_OPTIONS[0];
