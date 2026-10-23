import { MOCK_CATEGORIES } from 'src/sections/_active/categories-view/mock/categories';
import { getApprovedCompanies, getPrimaryImage, MOCK_COMPANIES, MOCK_PRODUCTS } from 'src/sections/_active/products-view/mock';
import { applyDiscount, isDiscountActive } from 'src/sections/_active/products-view/product-utils';

import { getEventStatusLabel, isPlacementForType } from '../event-table-config';

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

const entry = (productId, addedBy, addedAt) => ({
  productId,
  sellerId: MOCK_PRODUCTS.find((row) => row._id === productId)?.company?._id || null,
  addedBy,
  addedAt,
});

export const MOCK_EVENTS = [
  {
    _id: 'evt-001',
    title: 'Eid Sale',
    subtitle: 'عيد مبارك',
    type: 'product-collection',
    placement: 'home-best-deals',
    coverUrl: coverFromProduct('prd-011'),
    ctaLabel: 'Shop The Sale',
    startAt: '2026-11-10T00:00:00.000Z',
    endAt: '2026-11-20T23:59:00.000Z',
    published: true,
    storeScope: 'all',
    storeIds: [],
    discountPercent: 15,
    products: [
      entry('prd-001', 'seller', '2026-10-14T09:00:00.000Z'),
      entry('prd-002', 'admin', '2026-10-12T11:00:00.000Z'),
      entry('prd-007', 'seller', '2026-10-15T08:30:00.000Z'),
      entry('prd-003', 'admin', '2026-10-12T11:05:00.000Z'),
    ],
    createdAt: '2026-10-12T10:15:00.000Z',
    updatedAt: '2026-10-15T08:30:00.000Z',
  },
  {
    _id: 'evt-002',
    title: 'Modest Fashion Week',
    subtitle: 'Picked for your story',
    type: 'product-collection',
    placement: 'home-discover-more',
    coverUrl: coverFromProduct('prd-003'),
    ctaLabel: 'See All',
    startAt: '2026-10-15T00:00:00.000Z',
    endAt: '2026-11-05T23:59:00.000Z',
    published: true,
    storeScope: 'selected',
    storeIds: ['usr-002', 'usr-003'],
    discountPercent: null,
    products: [entry('prd-003', 'seller', '2026-10-15T10:00:00.000Z'), entry('prd-009', 'seller', '2026-10-16T12:00:00.000Z'), entry('prd-012', 'admin', '2026-10-14T09:30:00.000Z')],
    createdAt: '2026-10-10T14:05:00.000Z',
    updatedAt: '2026-10-16T12:00:00.000Z',
  },
  {
    _id: 'evt-003',
    title: "Today's Best Deals",
    subtitle: 'Limited Time Price',
    type: 'product-collection',
    placement: 'home-suggested',
    coverUrl: coverFromProduct('prd-002'),
    ctaLabel: 'See All',
    startAt: '2026-10-01T00:00:00.000Z',
    endAt: '2026-10-31T23:59:00.000Z',
    published: true,
    storeScope: 'all',
    storeIds: [],
    discountPercent: 10,
    products: [entry('prd-001', 'seller', '2026-10-01T09:00:00.000Z'), entry('prd-009', 'admin', '2026-10-02T10:00:00.000Z')],
    createdAt: '2026-09-28T10:15:00.000Z',
    updatedAt: '2026-10-02T10:00:00.000Z',
  },
  {
    _id: 'evt-004',
    title: 'Gifts That Feel Deeply Personal',
    subtitle: 'هدية',
    type: 'banner',
    placement: 'home-gifts-banner',
    coverUrl: coverFromProduct('prd-011'),
    ctaLabel: 'Explore The Edit',
    cta: { type: 'category', id: 'cat-006' },
    startAt: '2026-10-05T00:00:00.000Z',
    endAt: '2026-11-15T23:59:00.000Z',
    published: true,
    storeScope: 'all',
    storeIds: [],
    discountPercent: null,
    products: [],
    createdAt: '2026-10-02T09:40:00.000Z',
    updatedAt: '2026-10-02T09:40:00.000Z',
  },
  {
    _id: 'evt-005',
    title: 'White Friday',
    subtitle: 'Biggest prices of the year',
    type: 'product-collection',
    placement: 'home-best-deals',
    coverUrl: coverFromProduct('prd-007'),
    ctaLabel: 'See All',
    startAt: '2026-11-27T00:00:00.000Z',
    endAt: '2026-11-30T23:59:00.000Z',
    published: false,
    storeScope: 'selected',
    storeIds: ['usr-011'],
    discountPercent: 20,
    products: [],
    createdAt: '2026-10-18T08:45:00.000Z',
    updatedAt: '2026-10-18T08:45:00.000Z',
  },
  {
    _id: 'evt-006',
    title: 'Back to Madrasa',
    subtitle: 'Prayer essentials for the new term',
    type: 'product-collection',
    placement: 'home-suggested',
    coverUrl: coverFromProduct('prd-001'),
    ctaLabel: 'See All',
    startAt: '2026-08-15T00:00:00.000Z',
    endAt: '2026-09-15T23:59:00.000Z',
    published: true,
    storeScope: 'all',
    storeIds: [],
    discountPercent: 10,
    products: [entry('prd-001', 'seller', '2026-08-14T09:00:00.000Z'), entry('prd-002', 'seller', '2026-08-14T09:05:00.000Z')],
    createdAt: '2026-08-01T16:10:00.000Z',
    updatedAt: '2026-08-14T09:05:00.000Z',
  },
];

// The API returns `coverImage` (the upload key) next to `coverUrl`; the key goes back when the cover is unchanged.
MOCK_EVENTS.forEach((event) => {
  event.coverImage = event.coverImage || `events/${event._id}.jpg`;
  if (event.type === 'banner' && event.cta === undefined) event.cta = null;
});

// ----------------------------------------------------------------------
// Stores & products

export const findMockEvent = (id) => MOCK_EVENTS.find((row) => row._id === id) || null;

// Stores are referenced by seller id, same as `product.company._id`.
export const getEventStoreOptions = () =>
  getApprovedCompanies().map((company) => ({ _id: company.seller?._id, name: company.name, logo: company.logo }));

export const getStoreName = (sellerId) => MOCK_COMPANIES.find((company) => company.seller?._id === sellerId)?.name || 'Unknown store';

export const isEventOpenToStore = (event, sellerId) => event?.storeScope !== 'selected' || (event.storeIds || []).includes(sellerId);

// Only approved + active products can join an event.
export const isEventEligibleProduct = (product) => product?.reviewStatus === 'approved' && product?.status === 'active';

export const getEligibleEventProducts = ({ storeScope, storeIds = [] } = {}) =>
  MOCK_PRODUCTS.filter((product) => isEventEligibleProduct(product) && isEventOpenToStore({ storeScope, storeIds }, product.company?._id))
    .map((product) => ({
      _id: product._id,
      title: product.title,
      image: getPrimaryImage(product),
      sellerId: product.company?._id,
      storeName: product.company?.name || getStoreName(product.company?._id),
      price: product.price,
    }))
    .sort((a, b) => a.storeName.localeCompare(b.storeName) || a.title.localeCompare(b.title));

// ----------------------------------------------------------------------
// Pricing: customers get the better of the event discount and the product's own active discount, never both.

export function eventPrice(product, event) {
  const ownPercent = isDiscountActive(product) ? Number(product.offPercent) || 0 : 0;
  const eventPercent = Number(event?.discountPercent) || 0;
  const percent = Math.max(ownPercent, eventPercent);
  const base = Number(product?.price) || 0;

  let source = null;
  if (percent > 0) source = eventPercent > ownPercent ? 'event' : 'product';

  return {
    percent,
    price: percent > 0 ? applyDiscount(base, percent) : base,
    source,
    ownPercent,
    eventPercent,
  };
}

export function getBetterDiscountNote(pricing) {
  if (!pricing?.ownPercent || !pricing?.eventPercent) return null;
  if (pricing.source === 'product') return `Product's ${pricing.ownPercent}% beats event ${pricing.eventPercent}%`;
  return `Event ${pricing.eventPercent}% beats product's ${pricing.ownPercent}%`;
}

// ----------------------------------------------------------------------

// Product rows in the API's shape. `available: false` = switched off, rejected or deleted (hidden from customers).
const toProductRow = (item, event) => {
  const product = MOCK_PRODUCTS.find((row) => row._id === item.productId);

  return {
    _id: item.productId,
    productId: item.productId,
    title: product?.title || 'Deleted product',
    image: product ? getPrimaryImage(product) : '',
    sellerId: item.sellerId,
    storeName: product?.company?.name || getStoreName(item.sellerId),
    addedBy: item.addedBy,
    addedAt: item.addedAt,
    available: isEventEligibleProduct(product),
    regularPrice: product?.price ?? 0,
    soldCount: product?.soldCount || 0,
    pricing: product ? eventPrice(product, event) : { percent: 0, price: 0, source: null, ownPercent: 0, eventPercent: Number(event.discountPercent) || 0 },
  };
};

export const hydrateEvent = (event) => {
  const runtimeStatus = getEventRuntimeStatus(event);
  const stores =
    event.storeScope === 'selected'
      ? (event.storeIds || []).map((id) => {
          const company = MOCK_COMPANIES.find((row) => row.seller?._id === id);
          return { _id: id, name: company?.name || 'Unknown store', logo: company?.logo || null };
        })
      : [];

  return {
    ...event,
    coverUrl: event.coverUrl ?? null,
    coverImage: event.coverImage ?? null,
    products: (event.products || []).map((item) => toProductRow(item, event)),
    stores,
    runtimeStatus,
    statusLabel: getEventStatusLabel(runtimeStatus),
  };
};

// ----------------------------------------------------------------------
// Banner link: cta = { type: 'category' | 'store' | 'product' | 'event', id } or null.

export const CTA_TYPE_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'category', label: 'Category' },
  { value: 'store', label: 'Store' },
  { value: 'product', label: 'Product' },
  { value: 'event', label: 'Event' },
];

export const getCtaTypeLabel = (type) => CTA_TYPE_OPTIONS.find((option) => option.value === type)?.label || type;

// What a banner can link to, as `{ _id, label, image, caption }` for the picker.
export function getCtaTargets(type, { excludeEventId } = {}) {
  switch (type) {
    case 'category':
      return MOCK_CATEGORIES.filter((row) => row.status === 'active').map((row) => ({ _id: row._id, label: row.title, image: row.image }));
    case 'store':
      return getEventStoreOptions().map((row) => ({ _id: row._id, label: row.name, image: row.logo }));
    case 'product':
      return MOCK_PRODUCTS.filter(isEventEligibleProduct).map((row) => ({ _id: row._id, label: row.title, image: getPrimaryImage(row), caption: row.company?.name }));
    case 'event':
      return MOCK_EVENTS.filter((row) => row._id !== excludeEventId && getEventRuntimeStatus(row) !== 'ended').map((row) => ({
        _id: row._id,
        label: row.title,
        image: row.coverUrl,
        caption: getEventStatusLabel(getEventRuntimeStatus(row)),
      }));
    default:
      return [];
  }
}

export const findCtaTarget = (cta) => (cta?.type && cta?.id ? getCtaTargets(cta.type).find((row) => row._id === cta.id) || null : null);

// "Category · Islamic Gifts"
export const getCtaSummary = (cta) => (cta ? `${getCtaTypeLabel(cta.type)} · ${findCtaTarget(cta)?.label || 'Missing target'}` : null);

// Current or upcoming published events a product is in, for the product pages.
export const getProductEvents = (productId) =>
  MOCK_EVENTS.filter((event) => (event.products || []).some((item) => item.productId === productId))
    .map((event) => ({ event, runtimeStatus: getEventRuntimeStatus(event) }))
    .filter(({ runtimeStatus }) => runtimeStatus === 'active' || runtimeStatus === 'scheduled')
    .sort((a, b) => new Date(a.event.startAt) - new Date(b.event.startAt));

export const getActiveProductEvents = (productId) => getProductEvents(productId).filter(({ runtimeStatus }) => runtimeStatus === 'active');

// ----------------------------------------------------------------------

// Mirrors the API's field errors, so the form can show them under the right field.
export class EventFieldError extends Error {
  constructor(field, message) {
    super(message);
    this.field = field;
  }
}

const overlaps = (a, b) => new Date(a.startAt) < new Date(b.endAt) && new Date(b.startAt) < new Date(a.endAt);

// Two published events can't share a placement at overlapping times.
export const findPlacementClash = (event) =>
  event.published ? MOCK_EVENTS.find((other) => other._id !== event._id && other.published && other.placement === event.placement && overlaps(other, event)) || null : null;

export function upsertMockEvent(input) {
  const now = new Date().toISOString();
  const { publishState, ...event } = input;

  // The API also accepts `publishState` instead of `published`.
  if (event.published === undefined && publishState !== undefined) {
    event.published = publishState === 'publish';
  }

  if (!isPlacementForType(event.placement, event.type)) {
    throw new EventFieldError('placement', event.type === 'banner' ? 'This placement is for product collections.' : 'This placement is for banners.');
  }

  const clash = findPlacementClash(event);
  if (clash) {
    throw new EventFieldError('placement', `Another published event (${clash.title}) uses this placement at the same time`);
  }

  if (event.type === 'banner' && event.cta && !findCtaTarget(event.cta)) {
    throw new EventFieldError('ctaTarget', `That ${getCtaTypeLabel(event.cta.type).toLowerCase()} no longer exists.`);
  }

  if (event._id) {
    const index = MOCK_EVENTS.findIndex((row) => row._id === event._id);
    if (index !== -1) {
      MOCK_EVENTS[index] = { ...MOCK_EVENTS[index], ...event, updatedAt: now };
      return MOCK_EVENTS[index];
    }
  }

  const created = {
    storeScope: 'all',
    storeIds: [],
    discountPercent: null,
    products: [],
    ...event,
    _id: `evt-${Date.now()}`,
    createdAt: now,
    updatedAt: now,
  };

  MOCK_EVENTS.unshift(created);
  return created;
}

// Admin: replace the whole product list.
export function setMockEventProducts(eventId, products) {
  const event = findMockEvent(eventId);
  if (!event) return null;

  Object.assign(event, { products, updatedAt: new Date().toISOString() });
  return event;
}

// Seller: decides which of their own products are in, including ones the admin suggested.
// Kept entries keep their original `addedBy`; other stores' entries are untouched.
export function setSellerEventProducts(eventId, sellerId, productIds) {
  const event = findMockEvent(eventId);
  if (!event) return null;

  const now = new Date().toISOString();
  const current = event.products || [];
  const otherStores = current.filter((item) => item.sellerId !== sellerId);

  const sellerEntries = productIds.map(
    (productId) => current.find((item) => item.productId === productId && item.sellerId === sellerId) || { productId, sellerId, addedBy: 'seller', addedAt: now }
  );

  Object.assign(event, { products: [...otherStores, ...sellerEntries], updatedAt: now });
  return event;
}

export function deleteMockEvent(id) {
  const index = MOCK_EVENTS.findIndex((row) => row._id === id);
  if (index !== -1) {
    MOCK_EVENTS.splice(index, 1);
  }
}

