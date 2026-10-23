

const ICONS = {
  new_order: 'solar:bag-4-bold',
  order_cancelled_by_customer: 'solar:bag-cross-bold',
  product_approved: 'solar:check-circle-bold',
  product_rejected: 'solar:close-circle-bold',
  seller_approved: 'solar:shield-check-bold',
  seller_rejected: 'solar:shield-cross-bold',
  seller_application: 'solar:user-plus-bold',
  product_review_needed: 'solar:clipboard-check-bold',
};

const note = ({ link, ...data }) => ({
  icon: ICONS[data.type],
  orderId: null,
  readAt: data.isRead ? data.createdAt : null,
  link: link ? { href: null, ...link } : null,
  ...data,
});

const ADMIN_NOTIFICATIONS = [
  note({
    _id: 'an-001',
    type: 'product_review_needed',
    title: 'Product waiting for review',
    body: 'Azalea Cloths submitted "Chiffon Hijab".',
    link: { type: 'product', id: 'prd-004' },
    isRead: false,
    createdAt: '2026-10-23T07:40:00.000Z',
  }),
  note({
    _id: 'an-002',
    type: 'seller_application',
    title: 'New seller application',
    body: 'Noor Atelier applied to sell on Taibah.',
    link: { type: 'seller', id: 'pending-001' },
    isRead: false,
    createdAt: '2026-10-22T16:05:00.000Z',
  }),
  note({
    _id: 'an-003',
    type: 'product_review_needed',
    title: 'Product waiting for review',
    body: 'Al-Qabas Company submitted "Kids Thobe".',
    link: { type: 'product', id: 'prd-006' },
    isRead: false,
    createdAt: '2026-10-21T10:12:00.000Z',
  }),
  note({
    _id: 'an-004',
    type: 'product_review_needed',
    title: 'Product waiting for review',
    body: 'Lume Studio submitted "Sella Rice".',
    link: { type: 'product', id: 'prd-010' },
    isRead: true,
    createdAt: '2026-10-19T12:30:00.000Z',
  }),
  note({
    _id: 'an-005',
    type: 'seller_application',
    title: 'New seller application',
    body: 'Al-Hikma Books applied to sell on Taibah.',
    link: { type: 'seller', id: 'pending-002' },
    isRead: true,
    createdAt: '2026-10-15T09:00:00.000Z',
  }),
];

// For the signed-in mock seller (Al-Qabas Company, usr-002).
const SELLER_NOTIFICATIONS = [
  note({
    _id: 'sn-001',
    type: 'new_order',
    title: 'New order',
    body: 'Order #NB-A04D6E57 is waiting for you to accept it.',
    link: { type: 'order', id: 'ord-003' },
    orderId: 'ord-003',
    isRead: false,
    createdAt: '2026-10-22T13:05:00.000Z',
  }),
  note({
    _id: 'sn-002',
    type: 'new_order',
    title: 'New order',
    body: 'Order #NB-0E7C4A3B includes Home Mihrab Decor.',
    link: { type: 'order', id: 'ord-009' },
    orderId: 'ord-009',
    isRead: false,
    createdAt: '2026-10-23T06:12:00.000Z',
  }),
  note({
    _id: 'sn-003',
    type: 'order_cancelled_by_customer',
    title: 'Order cancelled by the customer',
    body: 'Your part of #NB-1B8F3C92 was cancelled: "Ordered by mistake". The hold was released.',
    link: { type: 'order', id: 'ord-004' },
    orderId: 'ord-004',
    isRead: false,
    createdAt: '2026-10-20T10:02:00.000Z',
  }),
  note({
    _id: 'sn-004',
    type: 'product_rejected',
    title: 'Product rejected',
    body: '"Jersey Hijab" was rejected: Blurry photos.',
    link: { type: 'product', id: 'prd-005' },
    isRead: true,
    createdAt: '2026-10-12T09:00:00.000Z',
  }),
  note({
    _id: 'sn-005',
    type: 'product_approved',
    title: 'Product approved',
    body: '"Premium Basmati Rice" is live for customers.',
    link: { type: 'product', id: 'prd-009' },
    isRead: true,
    createdAt: '2026-09-09T10:00:00.000Z',
  }),
  note({
    _id: 'sn-006',
    type: 'seller_approved',
    title: 'Your store is approved',
    body: 'Welcome to Taibah. Add your first products to start selling.',
    link: { type: 'seller', id: 'usr-002' },
    isRead: true,
    createdAt: '2026-08-01T08:00:00.000Z',
  }),
];

const listFor = (role) => (role === 'seller' ? SELLER_NOTIFICATIONS : ADMIN_NOTIFICATIONS);

const countUnread = (role) => listFor(role).filter((row) => !row.isRead).length;

export function getMockNotifications(role, { status = 'all', page = 0, limit = 20 } = {}) {
  const all = [...listFor(role)].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const unread = all.filter((row) => !row.isRead).length;

  let rows = all;
  if (status === 'unread') rows = all.filter((row) => !row.isRead);
  if (status === 'read') rows = all.filter((row) => row.isRead);

  return {
    data: rows.slice(page * limit, page * limit + limit).map((row) => ({ ...row })),
    total_length: rows.length,
    meta: {
      totalRecords: rows.length,
      counts: { all: all.length, unread, read: all.length - unread },
      unreadCount: unread,
    },
  };
}

// PUT …/notifications/:id/read → { unreadCount }
export function markMockNotificationRead(role, id) {
  const row = listFor(role).find((item) => item._id === id);
  if (row && !row.isRead) Object.assign(row, { isRead: true, readAt: new Date().toISOString() });
  return { unreadCount: countUnread(role) };
}

// PUT …/notifications/read-all → { unreadCount }
export function markAllMockNotificationsRead(role) {
  const now = new Date().toISOString();
  listFor(role).forEach((row) => {
    if (!row.isRead) Object.assign(row, { isRead: true, readAt: now });
  });
  return { unreadCount: countUnread(role) };
}
