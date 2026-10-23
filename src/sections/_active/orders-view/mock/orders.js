import { getPrimaryImage, MOCK_COMPANIES, MOCK_PRODUCTS } from 'src/sections/_active/products-view/mock';
import { getVariantLabel } from 'src/sections/_active/products-view/product-utils';
import { MOCK_USERS } from 'src/sections/_active/users-view/mock';

import { getAllowedStatuses } from '../order-table-config';

// ----------------------------------------------------------------------
// One order is one checkout, split into store orders (`stores[]`), one per seller.
// Each store order moves through its own statuses; the order's status is the least advanced of them.

export const ORDER_STATUS_RANK = { pending: 0, processing: 1, 'on-the-way': 2, delivered: 3 };

// Cancelled store orders don't hold the order back; if every store cancelled, the order is cancelled.
export const getOrderStatusFromStores = (stores = []) => {
  const live = stores.filter((store) => store.status !== 'cancelled');
  if (!live.length) return 'cancelled';
  return live.reduce((least, store) => (ORDER_STATUS_RANK[store.status] < ORDER_STATUS_RANK[least] ? store.status : least), live[0].status);
};

// Payment (Stripe): checkout holds the amount (authorized); a store accepting (leaving pending)
// captures its part; cancelling while pending releases that part's hold.
const storePaymentStatus = (status) => {
  if (status === 'cancelled') return 'released';
  if (status === 'pending') return 'authorized';
  return 'captured';
};

// Whole order: captured once every live store has accepted, partially_captured while only some have,
// released if every store part was cancelled.
export const getOrderPaymentStatus = (stores = []) => {
  const live = stores.filter((store) => store.paymentStatus !== 'released');
  if (!live.length) return 'released';
  const captured = live.filter((store) => store.paymentStatus === 'captured').length;
  if (captured === live.length) return 'captured';
  return captured ? 'partially_captured' : 'authorized';
};

// Seed timestamps (the API sends these). capturedAt: the store accepted and its part was charged.
// releasedAt: it was cancelled and the hold dropped.
const seedCapturedAt = (history) => history.find((entry) => entry.status !== 'pending' && entry.status !== 'cancelled')?.at || null;
const seedReleasedAt = (history) => history.find((entry) => entry.status === 'cancelled')?.at || null;

const round = (value) => Math.round(value * 100) / 100;

const sumBy = (rows, key) => round(rows.reduce((sum, row) => sum + (Number(row[key]) || 0), 0));

const ADMIN = { _id: 'admin-001', name: 'Admin User' };

const person = (userId) => {
  const user = MOCK_USERS.find((row) => row._id === userId);
  return user ? { _id: user._id, name: user.name } : { _id: userId, name: 'Unknown' };
};

const customerFromUser = (id) => {
  const user = MOCK_USERS.find((row) => row._id === id);
  return user ? { _id: user._id, name: user.name, email: user.email } : null;
};

// One line: a product variant, priced as it was at checkout.
const item = (productId, quantity, variantIndex = 0) => {
  const product = MOCK_PRODUCTS.find((row) => row._id === productId);
  const variant = product?.variants?.[variantIndex] || product?.variants?.[0];
  const originalPrice = Number(variant?.price) || 0;
  const price = variant?.salePrice ?? originalPrice;

  return {
    _id: `${productId}-${variant?._id}`,
    productId,
    variantId: variant?._id || null,
    sku: variant?.sku || null,
    title: product?.title || 'Product',
    image: variant?.images?.[0] || getPrimaryImage(product),
    variant: variant ? getVariantLabel(variant) : '',
    quantity,
    price,
    originalPrice,
    discount: round((originalPrice - price) * quantity),
    total: round(price * quantity),
  };
};

// What the customer gets back for cancelled store orders, and what's left.
const withCancelTotals = (row, cancelledTotal) => Object.assign(row, { cancelledTotal, netTotal: round(row.total - cancelledTotal) });

// history: [status, at, role, byUserId?, reason?]
const storeOrder = (orderId, orderCode, index, sellerId, items, history, { note = '' } = {}) => {
  const company = MOCK_COMPANIES.find((row) => row.seller?._id === sellerId);
  const entries = history.map(([status, at, role, by, reason]) => ({
    status,
    at,
    role,
    by: by === 'admin' ? ADMIN : by ? person(by) : null,
    reason: reason || null,
  }));
  const status = entries[entries.length - 1].status;
  const subtotal = round(items.reduce((sum, line) => sum + line.originalPrice * line.quantity, 0));
  const discountTotal = sumBy(items, 'discount');

  const total = round(subtotal - discountTotal);

  return withCancelTotals(
    {
      _id: `so-${orderId.replace('ord-', '')}-${index + 1}`,
      code: `${orderCode}-${index + 1}`,
      sellerId,
      name: company?.name || 'Unknown store',
      logo: company?.logo || null,
      status,
      history: entries,
      cancelReason: status === 'cancelled' ? entries[entries.length - 1].reason : null,
      paymentStatus: storePaymentStatus(status),
      capturedAt: seedCapturedAt(entries),
      releasedAt: seedReleasedAt(entries),
      note,
      subtotal,
      discountTotal,
      // As charged at checkout; never reduced by a cancel.
      total,
      items,
    },
    status === 'cancelled' ? total : 0
  );
};

const ADDRESSES = {
  'usr-001': { label: 'Home', line: '21 Al Nakheel District', city: 'Riyadh', country: 'Saudi Arabia' },
  'usr-003': { label: 'Home', line: '102 Main Road, Downtown', city: 'Riyadh', country: 'Saudi Arabia' },
  'usr-004': { label: 'Home', line: '90 Prince Sultan Street', city: 'Jeddah', country: 'Saudi Arabia' },
  'usr-007': { label: 'Home', line: '44 Al Olaya Street', city: 'Riyadh', country: 'Saudi Arabia' },
  'usr-010': { label: 'Home', line: '8 King Fahd Road', city: 'Dammam', country: 'Saudi Arabia' },
  'usr-012': { label: 'Office', line: '12 Corniche Road', city: 'Jeddah', country: 'Saudi Arabia' },
};

const order = ({ _id, code, customerId, createdAt, stores }) => {
  const storeOrders = stores.map(([sellerId, items, history, extras], index) => storeOrder(_id, code, index, sellerId, items, history, extras));
  const addressDetails = ADDRESSES[customerId];

  return withCancelTotals(
    {
      _id,
      code,
      status: getOrderStatusFromStores(storeOrders),
      customer: customerFromUser(customerId),
      address: `${addressDetails.line}, ${addressDetails.city}`,
      addressDetails,
      paymentMethod: 'card',
      paymentStatus: getOrderPaymentStatus(storeOrders),
      subtotal: sumBy(storeOrders, 'subtotal'),
      discountTotal: sumBy(storeOrders, 'discountTotal'),
      total: sumBy(storeOrders, 'total'),
      stores: storeOrders,
      createdAt,
    },
    sumBy(storeOrders, 'cancelledTotal')
  );
};

export const MOCK_ORDERS = [
  order({
    _id: 'ord-001',
    code: '#NB-3F9A21C0',
    customerId: 'usr-001',
    createdAt: '2026-10-18T10:24:00.000Z',
    stores: [
      [
        'usr-002',
        [item('prd-001', 1)],
        [
          ['pending', '2026-10-18T10:24:00.000Z', 'customer', 'usr-001'],
          ['processing', '2026-10-18T15:02:00.000Z', 'seller', 'usr-002'],
          ['on-the-way', '2026-10-19T09:40:00.000Z', 'seller', 'usr-002'],
        ],
        { note: 'Packed with extra padding.' },
      ],
      [
        'usr-011',
        [item('prd-007', 1, 1)],
        [
          ['pending', '2026-10-18T10:24:00.000Z', 'customer', 'usr-001'],
          ['processing', '2026-10-19T11:10:00.000Z', 'seller', 'usr-011'],
        ],
      ],
    ],
  }),
  order({
    _id: 'ord-002',
    code: '#NB-7C2E9B14',
    customerId: 'usr-007',
    createdAt: '2026-10-02T09:12:00.000Z',
    stores: [
      [
        'usr-003',
        [item('prd-003', 2, 0), item('prd-003', 1, 3)],
        [
          ['pending', '2026-10-02T09:12:00.000Z', 'customer', 'usr-007'],
          ['processing', '2026-10-02T14:10:00.000Z', 'seller', 'usr-003'],
          ['on-the-way', '2026-10-03T08:20:00.000Z', 'seller', 'usr-003'],
          ['delivered', '2026-10-04T15:48:00.000Z', 'seller', 'usr-003'],
        ],
      ],
    ],
  }),
  order({
    _id: 'ord-003',
    code: '#NB-A04D6E57',
    customerId: 'usr-010',
    createdAt: '2026-10-22T13:05:00.000Z',
    stores: [['usr-002', [item('prd-009', 2)], [['pending', '2026-10-22T13:05:00.000Z', 'customer', 'usr-010']], { note: 'Customer asked for delivery after 5pm.' }]],
  }),
  order({
    _id: 'ord-004',
    code: '#NB-1B8F3C92',
    customerId: 'usr-004',
    createdAt: '2026-10-20T08:44:00.000Z',
    stores: [
      [
        'usr-002',
        [item('prd-012', 1)],
        [
          ['pending', '2026-10-20T08:44:00.000Z', 'customer', 'usr-004'],
          ['cancelled', '2026-10-20T10:02:00.000Z', 'customer', 'usr-004', 'Ordered by mistake'],
        ],
      ],
      [
        'usr-003',
        [item('prd-003', 1, 2)],
        [
          ['pending', '2026-10-20T08:44:00.000Z', 'customer', 'usr-004'],
          ['processing', '2026-10-21T09:30:00.000Z', 'seller', 'usr-003'],
        ],
      ],
    ],
  }),
  order({
    _id: 'ord-005',
    code: '#NB-E5D17A08',
    customerId: 'usr-012',
    createdAt: '2026-09-20T16:18:00.000Z',
    stores: [
      [
        'usr-011',
        [item('prd-007', 1, 0)],
        [
          ['pending', '2026-09-20T16:18:00.000Z', 'customer', 'usr-012'],
          ['processing', '2026-09-21T11:05:00.000Z', 'seller', 'usr-011'],
          ['on-the-way', '2026-09-21T19:22:00.000Z', 'seller', 'usr-011'],
          ['delivered', '2026-09-23T12:00:00.000Z', 'seller', 'usr-011'],
        ],
      ],
      [
        'usr-002',
        [item('prd-002', 1, 1)],
        [
          ['pending', '2026-09-20T16:18:00.000Z', 'customer', 'usr-012'],
          ['processing', '2026-09-21T10:00:00.000Z', 'seller', 'usr-002'],
          ['on-the-way', '2026-09-22T08:15:00.000Z', 'seller', 'usr-002'],
          ['delivered', '2026-09-24T14:30:00.000Z', 'admin', 'admin'],
        ],
      ],
    ],
  }),
  order({
    _id: 'ord-006',
    code: '#NB-49C0B2F6',
    customerId: 'usr-001',
    createdAt: '2026-10-20T11:27:00.000Z',
    stores: [
      [
        'usr-002',
        [item('prd-001', 2, 2)],
        [
          ['pending', '2026-10-20T11:27:00.000Z', 'customer', 'usr-001'],
          ['processing', '2026-10-20T11:55:00.000Z', 'seller', 'usr-002'],
        ],
      ],
    ],
  }),
  order({
    _id: 'ord-007',
    code: '#NB-D3A86E1F',
    customerId: 'usr-003',
    createdAt: '2026-10-10T07:50:00.000Z',
    stores: [
      [
        'usr-011',
        [item('prd-007', 2, 1)],
        [
          ['pending', '2026-10-10T07:50:00.000Z', 'customer', 'usr-003'],
          ['cancelled', '2026-10-10T12:20:00.000Z', 'seller', 'usr-011', 'Out of stock for the 100 ml size'],
        ],
      ],
    ],
  }),
  order({
    _id: 'ord-008',
    code: '#NB-6F2B95C4',
    customerId: 'usr-007',
    createdAt: '2026-10-19T12:08:00.000Z',
    stores: [
      [
        'usr-002',
        [item('prd-002', 1, 0), item('prd-009', 1)],
        [
          ['pending', '2026-10-19T12:08:00.000Z', 'customer', 'usr-007'],
          ['processing', '2026-10-19T16:40:00.000Z', 'seller', 'usr-002'],
          ['on-the-way', '2026-10-21T08:05:00.000Z', 'seller', 'usr-002'],
        ],
      ],
    ],
  }),
  order({
    _id: 'ord-009',
    code: '#NB-0E7C4A3B',
    customerId: 'usr-010',
    createdAt: '2026-10-23T06:12:00.000Z',
    stores: [
      [
        'usr-003',
        [item('prd-003', 1, 4)],
        [
          ['pending', '2026-10-23T06:12:00.000Z', 'customer', 'usr-010'],
          ['processing', '2026-10-23T08:40:00.000Z', 'seller', 'usr-003'],
        ],
      ],
      ['usr-011', [item('prd-007', 1, 0)], [['pending', '2026-10-23T06:12:00.000Z', 'customer', 'usr-010']]],
      ['usr-002', [item('prd-012', 1)], [['pending', '2026-10-23T06:12:00.000Z', 'customer', 'usr-010']]],
    ],
  }),
  order({
    _id: 'ord-010',
    code: '#NB-B91F6D27',
    customerId: 'usr-004',
    createdAt: '2026-09-28T09:30:00.000Z',
    stores: [
      [
        'usr-002',
        [item('prd-001', 1, 1)],
        [
          ['pending', '2026-09-28T09:30:00.000Z', 'customer', 'usr-004'],
          ['processing', '2026-09-28T14:05:00.000Z', 'seller', 'usr-002'],
          // Local hand delivery: on-the-way was skipped.
          ['delivered', '2026-09-29T17:20:00.000Z', 'seller', 'usr-002'],
        ],
      ],
    ],
  }),
  order({
    _id: 'ord-011',
    code: '#NB-58E3C0A9',
    customerId: 'usr-012',
    createdAt: '2026-10-16T15:40:00.000Z',
    stores: [
      [
        'usr-003',
        [item('prd-003', 1, 5)],
        [
          ['pending', '2026-10-16T15:40:00.000Z', 'customer', 'usr-012'],
          ['processing', '2026-10-17T09:00:00.000Z', 'seller', 'usr-003'],
          ['on-the-way', '2026-10-18T10:30:00.000Z', 'seller', 'usr-003'],
        ],
      ],
    ],
  }),
  order({
    _id: 'ord-012',
    code: '#NB-C67A1E45',
    customerId: 'usr-001',
    createdAt: '2026-09-12T08:18:00.000Z',
    stores: [
      [
        'usr-002',
        [item('prd-009', 3)],
        [
          ['pending', '2026-09-12T08:18:00.000Z', 'customer', 'usr-001'],
          ['processing', '2026-09-12T12:00:00.000Z', 'seller', 'usr-002'],
          ['on-the-way', '2026-09-13T09:10:00.000Z', 'seller', 'usr-002'],
          ['delivered', '2026-09-14T16:45:00.000Z', 'seller', 'usr-002'],
        ],
      ],
      [
        'usr-003',
        [item('prd-003', 1, 0)],
        [
          ['pending', '2026-09-12T08:18:00.000Z', 'customer', 'usr-001'],
          ['cancelled', '2026-09-12T13:30:00.000Z', 'admin', 'admin', 'Customer asked support to remove this item'],
        ],
        { note: 'Refund to be handled once payments are connected.' },
      ],
    ],
  }),
];

// ----------------------------------------------------------------------

export const findMockOrder = (id) => MOCK_ORDERS.find((row) => row._id === id) || null;

export const getOrderItems = (row) => (row?.stores || []).flatMap((store) => store.items || []);

// As charged at checkout.
export const getOrderTotal = (row) => Number(row?.total) || 0;

// After cancelled store orders are refunded; what sales figures should count.
export const getOrderNetTotal = (row) => Number(row?.netTotal ?? row?.total) || 0;

// Store records for screens that show vendor cards (overview, transactions).
export const getOrderVendors = (row) =>
  (row?.stores || []).map((store) => {
    const company = MOCK_COMPANIES.find((item) => item.seller?._id === store.sellerId);
    return {
      _id: store.sellerId,
      name: store.name,
      logo: store.logo,
      rating: company?.rating,
      reviews: company?.reviews,
      seller: company?.seller ? { ...company.seller } : null,
    };
  });

// What a seller gets: the order with only their store order, and status/totals from their part.
export const toSellerOrder = (row, sellerId) => {
  const mine = (row.stores || []).find((store) => store.sellerId === sellerId);
  if (!mine) return null;

  return {
    ...row,
    stores: [mine],
    storeOrderCode: mine.code,
    status: mine.status,
    // The seller's card shows their own part: Held until they accept, then Paid.
    paymentStatus: mine.paymentStatus,
    subtotal: mine.subtotal,
    discountTotal: mine.discountTotal,
    total: mine.total,
    cancelledTotal: mine.cancelledTotal,
    netTotal: mine.netTotal,
  };
};

export const getSellerOrders = (sellerId) => MOCK_ORDERS.map((row) => toSellerOrder(row, sellerId)).filter(Boolean);

// One store order changes; the order's status and totals follow from its stores.
// actor: { role: 'admin' | 'seller', by: { _id, name } }
// Like the API, a move outside getAllowedStatuses or a cancel without a reason is rejected (409).
export function updateMockStoreOrder(orderId, storeOrderId, { status, reason, note }, actor) {
  const row = findMockOrder(orderId);
  const store = row?.stores.find((item) => item._id === storeOrderId);
  if (!store) return null;

  if (status && status !== store.status) {
    const reject = (message) => Object.assign(new Error(message), { status: 409 });
    if (!getAllowedStatuses(store.status).includes(status)) {
      throw reject(`Can't move this store order from ${store.status} to ${status}`);
    }
    if (status === 'cancelled' && !reason?.trim()) {
      throw reject('A reason is required to cancel');
    }

    const at = new Date().toISOString();
    const leavingPending = store.status === 'pending';

    store.history = [...store.history, { status, at, role: actor.role, by: actor.by, reason: status === 'cancelled' ? reason : null }];
    store.status = status;
    store.cancelReason = status === 'cancelled' ? reason : null;
    store.paymentStatus = storePaymentStatus(status);
    // Only a move out of pending charges or releases; later moves keep the original time.
    if (leavingPending && status === 'cancelled') store.releasedAt = at;
    if (leavingPending && status !== 'cancelled') store.capturedAt = at;
  }

  if (note !== undefined) store.note = note;

  withCancelTotals(store, store.status === 'cancelled' ? store.total : 0);
  withCancelTotals(row, sumBy(row.stores, 'cancelledTotal'));
  row.status = getOrderStatusFromStores(row.stores);
  row.paymentStatus = getOrderPaymentStatus(row.stores);
  return row;
}
