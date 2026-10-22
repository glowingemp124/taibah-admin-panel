import { _mock } from 'src/_mock';

import { findMockOption } from 'src/sections/_active/options-view/mock/options';

// ----------------------------------------------------------------------

export const CATEGORY_UNITS = ['piece', 'pair', 'set', 'ml', 'l', 'g', 'kg', 'cm', 'm'];

const img = (file) => `/assets/images/products/${file}`;

// `attributes` holds the option objects themselves, so option edits show up here too.
const attributes = (...ids) => ids.map(findMockOption).filter(Boolean);

export const MOCK_CATEGORIES = [
  {
    _id: 'cat-001',
    title: 'Clothing',
    image: img('abaya-a.jpg'),
    imageKey: 'categories/clothing.jpg',
    status: 'active',
    unit: 'piece',
    attributes: attributes('opt-size', 'opt-color'),
    createdAt: '2026-01-12T09:15:00.000Z',
    updatedAt: '2026-01-12T09:15:00.000Z',
  },
  {
    _id: 'cat-002',
    title: 'Perfume',
    image: img('attar-a.jpg'),
    imageKey: 'categories/perfume.jpg',
    status: 'active',
    unit: 'ml',
    attributes: attributes('opt-volume'),
    createdAt: '2026-01-18T11:40:00.000Z',
    updatedAt: '2026-01-18T11:40:00.000Z',
  },
  {
    _id: 'cat-003',
    title: 'Rice',
    image: _mock.image.product(2),
    imageKey: 'categories/rice.jpg',
    status: 'active',
    unit: 'kg',
    attributes: [],
    createdAt: '2026-02-03T14:05:00.000Z',
    updatedAt: '2026-02-03T14:05:00.000Z',
  },
  {
    _id: 'cat-004',
    title: 'Hijab',
    image: img('hijab-b.jpg'),
    imageKey: 'categories/hijab.jpg',
    status: 'active',
    unit: 'piece',
    attributes: attributes('opt-color'),
    createdAt: '2026-02-14T08:30:00.000Z',
    updatedAt: '2026-02-14T08:30:00.000Z',
  },
  {
    _id: 'cat-005',
    title: 'Prayer Items',
    image: img('janamaz-1.jpg'),
    imageKey: 'categories/prayer-items.jpg',
    status: 'active',
    unit: 'piece',
    attributes: attributes('opt-color'),
    createdAt: '2026-03-01T16:20:00.000Z',
    updatedAt: '2026-03-01T16:20:00.000Z',
  },
  {
    _id: 'cat-006',
    title: 'Islamic Gifts',
    image: img('gift-1.jpg'),
    imageKey: 'categories/islamic-gifts.jpg',
    status: 'active',
    unit: 'set',
    attributes: [],
    createdAt: '2026-03-09T10:10:00.000Z',
    updatedAt: '2026-03-09T10:10:00.000Z',
  },
  {
    _id: 'cat-007',
    title: 'Home & Decor',
    image: img('mihrab-a.jpg'),
    imageKey: 'categories/home-decor.jpg',
    status: 'active',
    unit: 'piece',
    attributes: [],
    createdAt: '2026-03-22T13:45:00.000Z',
    updatedAt: '2026-03-22T13:45:00.000Z',
  },
  {
    _id: 'cat-008',
    title: 'Dates',
    image: _mock.image.product(7),
    imageKey: 'categories/dates.jpg',
    status: 'inactive',
    unit: 'kg',
    attributes: [],
    createdAt: '2026-04-04T09:00:00.000Z',
    updatedAt: '2026-04-04T09:00:00.000Z',
  },
];

export const findMockCategory = (id) => MOCK_CATEGORIES.find((row) => row._id === id) || null;

export const getActiveCategories = () => MOCK_CATEGORIES.filter((row) => row.status === 'active');

export function upsertMockCategory(category) {
  const now = new Date().toISOString();
  const patch = {
    title: category.title,
    image: category.image,
    imageKey: category.imageKey || `categories/${String(category.title).toLowerCase().replace(/\s+/g, '-')}.jpg`,
    status: category.status || 'active',
    unit: category.unit || 'piece',
    attributes: (category.attributeIds || []).map(findMockOption).filter(Boolean),
    updatedAt: now,
  };

  const existing = category._id ? findMockCategory(category._id) : null;

  if (existing) {
    Object.assign(existing, patch);
    return existing;
  }

  const created = { _id: `cat-${Date.now()}`, ...patch, createdAt: now };
  MOCK_CATEGORIES.unshift(created);
  return created;
}

export function deleteMockCategory(id) {
  const index = MOCK_CATEGORIES.findIndex((row) => row._id === id);
  if (index !== -1) {
    MOCK_CATEGORIES.splice(index, 1);
  }
}
