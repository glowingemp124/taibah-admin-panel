import { createFilterField } from 'src/components/generic-table/table-filter-fields';
import { DATE_FORMAT_PRESETS } from 'src/utils/date-formatter';

// ----------------------------------------------------------------------

export const TABLE_OPTIONS = {
  dense: true,
  filterSize: 'small',
};

export const TABLE_HEAD = [
  { id: 'sr', label: 'Sr#', width: 64 },
  { id: 'cover', label: 'Image', width: 88 },
  { id: 'title', label: 'Title', width: 220 },
  { id: 'type', label: 'Type', width: 150 },
  { id: 'placement', label: 'Placement', width: 170 },
  { id: 'discount', label: 'Discount', width: 100 },
  { id: 'products', label: 'Products', width: 90 },
  { id: 'dateRange', label: 'Date Range', width: 180 },
  { id: 'status', label: 'Status', width: 110 },
  { id: 'createdAt', label: 'Created At', width: 120 },
  { id: 'action', label: 'Action', width: 176 },
];

export const EVENT_STATUS_OPTIONS = [
  { value: 'all', label: 'All', color: 'default' },
  { value: 'draft', label: 'Draft', color: 'default' },
  { value: 'scheduled', label: 'Scheduled', color: 'warning' },
  { value: 'active', label: 'Active', color: 'success' },
  { value: 'ended', label: 'Ended', color: 'default' },
];

export const EVENT_TYPE_OPTIONS = [
  { value: 'banner', label: 'Banner' },
  { value: 'product-collection', label: 'Product Collection' },
];

// Each placement takes one event type; the API rejects any other pairing.
export const EVENT_PLACEMENT_OPTIONS = [
  { value: 'home-best-deals', label: "Today's Best Deals", type: 'product-collection' },
  { value: 'home-gifts-banner', label: 'Gifts Banner', type: 'banner' },
  { value: 'home-discover-more', label: 'Discover More', type: 'product-collection' },
  { value: 'home-suggested', label: 'Suggested For You', type: 'product-collection' },
  { value: 'browse-banner', label: 'Browse Banner', type: 'banner' },
];

export const getPlacementOptions = (type) => EVENT_PLACEMENT_OPTIONS.filter((option) => option.type === type);

export const isPlacementForType = (placement, type) => EVENT_PLACEMENT_OPTIONS.some((option) => option.value === placement && option.type === type);

export const EVENT_STORE_SCOPE_OPTIONS = [
  { value: 'all', label: 'All stores' },
  { value: 'selected', label: 'Selected stores' },
];

export const EVENT_PUBLISH_OPTIONS = [
  { value: 'draft', label: 'Draft' },
  { value: 'publish', label: 'Publish' },
];

export const FILTER_FIELDS = [
  createFilterField.status({
    options: EVENT_STATUS_OPTIONS,
    showCounts: true,
  }),

  createFilterField.search({
    placeholder: 'Search event title, placement...',
  }),

  createFilterField.select({
    key: 'type',
    label: 'Type',
    placeholder: 'Type',
    defaultValue: 'all',
    options: [{ value: 'all', label: 'All Types' }, ...EVENT_TYPE_OPTIONS],
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

export const getEventTypeLabel = (value) =>
  EVENT_TYPE_OPTIONS.find((option) => option.value === value)?.label || value || 'N/A';

export const getEventPlacementLabel = (value) =>
  EVENT_PLACEMENT_OPTIONS.find((option) => option.value === value)?.label || value || 'N/A';

export const getEventStatusLabel = (value) =>
  EVENT_STATUS_OPTIONS.find((option) => option.value === value)?.label || value || 'N/A';
