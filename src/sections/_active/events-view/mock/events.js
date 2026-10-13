import { getPrimaryImage, MOCK_PRODUCTS } from 'src/sections/_active/products-view/mock';

import { getEventStatusLabel } from '../event-table-config';

// ----------------------------------------------------------------------

const coverFromProduct = (productId) => getPrimaryImage(MOCK_PRODUCTS.find((row) => row._id === productId));

export const getEventRuntimeStatus = (event, now = new Date()) => {
  if (event?.published === false || event?.status === 'draft') {
    return 'draft';
  }

  const start = event?.startAt ? new Date(event.startAt) : null;
  const end = event?.endAt ? new Date(event.endAt) : null;

  if (start && now < start) return 'scheduled';
  if (end && now > end) return 'ended';
  return 'active';
};

export const MOCK_EVENTS = [
  {
    _id: 'evt-001',
    title: "Today's Best Deals",
    subtitle: 'Limited Time Price',
    type: 'product-collection',
    placement: 'home-best-deals',
    coverUrl: coverFromProduct('prd-002'),
    ctaLabel: 'See All',
    productIds: ['prd-002', 'prd-003', 'prd-001'],
    published: true,
    startAt: '2026-10-01T00:00:00.000Z',
    endAt: '2026-10-31T23:59:00.000Z',
    createdAt: '2026-09-28T10:15:00.000Z',
  },
  {
    _id: 'evt-002',
    title: 'Gifts That Feel Deeply Personal',
    subtitle: 'هدية',
    type: 'banner',
    placement: 'home-gifts-banner',
    coverUrl: coverFromProduct('prd-008'),
    ctaLabel: 'Explore The Edit',
    productIds: [],
    published: true,
    startAt: '2026-10-05T00:00:00.000Z',
    endAt: '2026-11-15T23:59:00.000Z',
    createdAt: '2026-10-02T09:40:00.000Z',
  },
  {
    _id: 'evt-003',
    title: 'Picked For Your Story',
    subtitle: 'Discover More',
    type: 'product-collection',
    placement: 'home-discover-more',
    coverUrl: coverFromProduct('prd-001'),
    ctaLabel: 'See All',
    productIds: ['prd-001', 'prd-005', 'prd-010'],
    published: true,
    startAt: '2026-09-20T00:00:00.000Z',
    endAt: '2026-12-01T23:59:00.000Z',
    createdAt: '2026-09-18T14:05:00.000Z',
  },
  {
    _id: 'evt-004',
    title: 'Suggested For You',
    subtitle: 'Based on your taste',
    type: 'product-collection',
    placement: 'home-suggested',
    coverUrl: coverFromProduct('prd-004'),
    ctaLabel: 'See All',
    productIds: ['prd-004', 'prd-006', 'prd-007'],
    published: true,
    startAt: '2026-11-01T00:00:00.000Z',
    endAt: '2026-11-30T23:59:00.000Z',
    createdAt: '2026-10-10T11:20:00.000Z',
  },
  {
    _id: 'evt-005',
    title: 'Categories That Feel Deeply Personal',
    subtitle: 'الفئات',
    type: 'banner',
    placement: 'browse-banner',
    coverUrl: coverFromProduct('prd-010'),
    ctaLabel: 'Browse Categories',
    productIds: [],
    published: true,
    startAt: '2026-08-01T00:00:00.000Z',
    endAt: '2026-09-30T23:59:00.000Z',
    createdAt: '2026-07-22T16:10:00.000Z',
  },
  {
    _id: 'evt-006',
    title: 'Eid Gift Edit',
    subtitle: 'Little joys. Lasting barakah.',
    type: 'product-collection',
    placement: 'home-best-deals',
    coverUrl: coverFromProduct('prd-009'),
    ctaLabel: 'See All',
    productIds: ['prd-008', 'prd-009'],
    published: false,
    startAt: '2026-12-01T00:00:00.000Z',
    endAt: '2026-12-20T23:59:00.000Z',
    createdAt: '2026-10-12T08:45:00.000Z',
  },
];

export const hydrateEvent = (event) => {
  const products = (event.productIds || [])
    .map((id) => MOCK_PRODUCTS.find((row) => row._id === id))
    .filter(Boolean)
    .map((product) => ({
      _id: product._id,
      title: product.title,
      image: getPrimaryImage(product),
      price: product.price,
      salePrice: product.salePrice,
    }));

  const runtimeStatus = getEventRuntimeStatus(event);

  return {
    ...event,
    products,
    runtimeStatus,
    statusLabel: getEventStatusLabel(runtimeStatus),
  };
};

export function upsertMockEvent(event) {
  if (event._id) {
    const index = MOCK_EVENTS.findIndex((row) => row._id === event._id);
    if (index !== -1) {
      MOCK_EVENTS[index] = { ...MOCK_EVENTS[index], ...event };
      return MOCK_EVENTS[index];
    }
  }

  const created = {
    ...event,
    _id: `evt-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };

  MOCK_EVENTS.unshift(created);
  return created;
}

export function deleteMockEvent(id) {
  const index = MOCK_EVENTS.findIndex((row) => row._id === id);
  if (index !== -1) {
    MOCK_EVENTS.splice(index, 1);
  }
}
