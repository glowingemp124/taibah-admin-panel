

export const OPTION_TYPES = ['select', 'color'];

export const MOCK_OPTIONS = [
  {
    _id: 'opt-size',
    name: 'Size',
    type: 'select',
    values: [
      { _id: 'optv-size-s', value: 'S', label: 'S' },
      { _id: 'optv-size-m', value: 'M', label: 'M' },
      { _id: 'optv-size-l', value: 'L', label: 'L' },
      { _id: 'optv-size-xl', value: 'XL', label: 'XL' },
    ],
    createdAt: '2026-01-05T09:00:00.000Z',
    updatedAt: '2026-01-05T09:00:00.000Z',
  },
  {
    _id: 'opt-color',
    name: 'Color',
    type: 'color',
    values: [
      { _id: 'optv-color-black', value: '#000000', label: 'Black' },
      { _id: 'optv-color-green', value: '#1B5E4B', label: 'Green' },
      { _id: 'optv-color-brown', value: '#8D6E3C', label: 'Brown' },
      { _id: 'optv-color-beige', value: '#C9A96E', label: 'Beige' },
      { _id: 'optv-color-white', value: '#FFFFFF', label: 'White' },
    ],
    createdAt: '2026-01-05T09:05:00.000Z',
    updatedAt: '2026-01-05T09:05:00.000Z',
  },
  {
    _id: 'opt-volume',
    name: 'Volume',
    type: 'select',
    values: [
      { _id: 'optv-volume-50', value: '50', label: '50' },
      { _id: 'optv-volume-100', value: '100', label: '100' },
    ],
    createdAt: '2026-01-06T10:00:00.000Z',
    updatedAt: '2026-01-06T10:00:00.000Z',
  },
  {
    _id: 'opt-material',
    name: 'Material',
    type: 'select',
    values: [
      { _id: 'optv-material-cotton', value: 'Cotton', label: 'Cotton' },
      { _id: 'optv-material-chiffon', value: 'Chiffon', label: 'Chiffon' },
      { _id: 'optv-material-jersey', value: 'Jersey', label: 'Jersey' },
    ],
    createdAt: '2026-02-10T12:00:00.000Z',
    updatedAt: '2026-02-10T12:00:00.000Z',
  },
];

export const findMockOption = (id) => MOCK_OPTIONS.find((row) => row._id === id) || null;

// Categories hold references to these same objects, so options are updated in place.
export function upsertMockOption(option) {
  const now = new Date().toISOString();
  const values = option.values.map((item, index) => ({
    _id: item._id || `optv-${Date.now()}-${index}`,
    value: item.value,
    label: item.label,
  }));

  const existing = option._id ? findMockOption(option._id) : null;

  if (existing) {
    Object.assign(existing, { name: option.name, type: option.type, values, updatedAt: now });
    return existing;
  }

  const created = { _id: `opt-${Date.now()}`, name: option.name, type: option.type, values, createdAt: now, updatedAt: now };
  MOCK_OPTIONS.unshift(created);
  return created;
}

export function deleteMockOption(id) {
  const index = MOCK_OPTIONS.findIndex((row) => row._id === id);
  if (index !== -1) {
    MOCK_OPTIONS.splice(index, 1);
  }
}
