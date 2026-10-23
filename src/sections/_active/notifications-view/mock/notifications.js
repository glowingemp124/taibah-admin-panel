import { MOCK_ORDERS } from 'src/sections/_active/orders-view/mock';
import { MOCK_USERS } from 'src/sections/_active/users-view/mock';



const DAY = 24 * 3600 * 1000;

const isBuyer = (user) => (user.roles || []).includes('buyer');
const isSeller = (user) => (user.roles || []).includes('seller');

const lastOrderAt = (userId) =>
  MOCK_ORDERS.filter((order) => order.customer?._id === userId).reduce((latest, order) => Math.max(latest, new Date(order.createdAt).getTime()), 0);

// Who a broadcast goes to, as the API resolves it.
const recipientsFor = ({ recipient, userGroup, userQuery }, now = Date.now()) => {
  if (recipient === 'user') {
    const query = String(userQuery || '').trim().toLowerCase();
    return query ? MOCK_USERS.filter((user) => user._id.toLowerCase() === query || user.email?.toLowerCase() === query) : [];
  }

  if (recipient === 'group') {
    switch (userGroup) {
      case 'customers':
        return MOCK_USERS.filter(isBuyer);
      case 'sellers':
        return MOCK_USERS.filter(isSeller);
      // Ordered in the last 30 days.
      case 'active':
        return MOCK_USERS.filter((user) => isBuyer(user) && now - lastOrderAt(user._id) <= 30 * DAY);
      // No order in 90 days (including never).
      case 'inactive':
        return MOCK_USERS.filter((user) => isBuyer(user) && now - lastOrderAt(user._id) > 90 * DAY);
      default:
        return [];
    }
  }

  return MOCK_USERS;
};

// GET /admin/broadcasts/recipients-count
export const getRecipientsCount = (params) => recipientsFor(params).length;

// What a finished send reports. In-app also pushes to the devices that have the app installed.
const statsFor = (broadcast, { emailsFailed = 0 } = {}) => {
  const recipients = getRecipientsCount(broadcast);
  const inApp = broadcast.channel === 'in-app' ? recipients : 0;

  return {
    recipients,
    inApp,
    pushSent: broadcast.channel === 'in-app' ? Math.round(recipients * 0.75) : 0,
    emailsSent: broadcast.channel === 'email' ? recipients - emailsFailed : 0,
    emailsFailed: broadcast.channel === 'email' ? emailsFailed : 0,
  };
};

const EMPTY_STATS = { recipients: 0, inApp: 0, pushSent: 0, emailsSent: 0, emailsFailed: 0 };

const seedStats = (data, statsOptions) => {
  if (data.status === 'sent') return statsFor(data, statsOptions);
  if (data.status === 'failed') return { ...EMPTY_STATS, recipients: getRecipientsCount(data) };
  return EMPTY_STATS;
};

const broadcast = ({ statsOptions, ...data }) => ({
  userQuery: '',
  userGroup: '',
  scheduledAt: null,
  sentAt: null,
  error: null,
  draft: data.status === 'draft',
  ...data,
  stats: seedStats(data, statsOptions),
});

export const MOCK_NOTIFICATIONS = [
  broadcast({
    _id: 'ntf-001',
    title: 'Scheduled Maintenance',
    message:
      'Taibah Market will be down for maintenance from 1:00 AM to 3:00 AM so that we can improve checkout speed, payment reliability, and search quality. During this window you will not be able to place new orders or update your profile. We appreciate your patience.',
    type: 'system',
    recipient: 'all',
    channel: 'in-app',
    status: 'scheduled',
    createdAt: '2026-10-21T09:15:00.000Z',
    scheduledAt: '2026-10-30T01:00:00.000Z',
  }),
  broadcast({
    _id: 'ntf-002',
    title: 'New seller dashboard features',
    message: 'You can now manage variants, join store campaigns and see Held / Paid status per order.',
    type: 'system',
    recipient: 'group',
    userGroup: 'sellers',
    channel: 'email',
    status: 'sent',
    statsOptions: { emailsFailed: 1 },
    createdAt: '2026-10-18T11:40:00.000Z',
    sentAt: '2026-10-18T11:41:30.000Z',
  }),
  broadcast({
    _id: 'ntf-003',
    title: 'Security reminder',
    message: 'Never share your one-time code. Taibah staff will never ask for it.',
    type: 'security',
    recipient: 'user',
    userQuery: 'admin@taibah.com',
    channel: 'email',
    status: 'failed',
    error: 'No user found for admin@taibah.com',
    createdAt: '2026-10-12T14:05:00.000Z',
  }),
  broadcast({
    _id: 'ntf-004',
    title: 'Eid Collection Launch',
    message:
      'Explore the new Eid Collection with modest fashion, prayer items, fragrances, and gifts chosen with care for your family. Shop early for the best sizes.',
    type: 'promotion',
    recipient: 'group',
    userGroup: 'active',
    channel: 'in-app',
    status: 'sent',
    createdAt: '2026-10-08T08:30:00.000Z',
    sentAt: '2026-10-08T08:30:40.000Z',
  }),
  broadcast({
    _id: 'ntf-005',
    title: 'Welcome to Taibah',
    message: 'Thank you for joining Taibah Market. Start browsing categories today.',
    type: 'system',
    recipient: 'group',
    userGroup: 'customers',
    channel: 'in-app',
    status: 'draft',
    createdAt: '2026-10-20T16:20:00.000Z',
  }),
  broadcast({
    _id: 'ntf-006',
    title: 'We miss you',
    message: 'It has been a while. Enjoy a welcome-back offer on modest wear this week.',
    type: 'promotion',
    recipient: 'group',
    userGroup: 'inactive',
    channel: 'email',
    status: 'failed',
    error: 'Email provider rejected the batch: daily sending limit reached. No emails were sent.',
    createdAt: '2026-10-15T10:10:00.000Z',
  }),
  broadcast({
    _id: 'ntf-007',
    title: 'Friday Reminder',
    message: 'Jummah Mubarak. Discover new prayer items in store this week.',
    type: 'promotion',
    recipient: 'all',
    channel: 'in-app',
    status: 'scheduled',
    createdAt: '2026-10-22T13:45:00.000Z',
    scheduledAt: '2026-10-30T07:00:00.000Z',
  }),
  broadcast({
    _id: 'ntf-008',
    title: 'Holiday shipping times',
    message: 'Orders placed after the 20th may take a few extra days to arrive.',
    type: 'system',
    recipient: 'all',
    channel: 'email',
    status: 'sending',
    createdAt: '2026-10-23T07:55:00.000Z',
  }),
];

// ----------------------------------------------------------------------

export const findMockBroadcast = (id) => MOCK_NOTIFICATIONS.find((row) => row._id === id) || null;

// Only these can still be changed, sent or deleted.
export const isBroadcastEditable = (row) => ['draft', 'scheduled', 'failed'].includes(row?.status);

const SEND_DURATION_MS = 2500;

// The mock "sends" in the background: sending now, sent (with stats) a moment later.
const finishSending = (row) => {
  Object.assign(row, { status: 'sent', sentAt: new Date().toISOString(), stats: statsFor(row) });
};

const startSending = (row) => {
  Object.assign(row, { status: 'sending', draft: false, error: null, stats: EMPTY_STATS });
  setTimeout(() => finishSending(row), SEND_DURATION_MS);
};

MOCK_NOTIFICATIONS.filter((row) => row.status === 'sending').forEach((row) => setTimeout(() => finishSending(row), SEND_DURATION_MS * 2));

// POST /admin/broadcasts (and PUT /:id). draft: true saves without sending; otherwise it's scheduled
// when scheduledAt is in the future, or sent now.
export function saveMockBroadcast(data, { draft = false } = {}) {
  const now = new Date();
  const existing = data._id ? findMockBroadcast(data._id) : null;
  const row = existing || { _id: `ntf-${Date.now()}`, createdAt: now.toISOString(), sentAt: null, stats: EMPTY_STATS };

  Object.assign(row, {
    title: data.title,
    message: data.message,
    type: data.type,
    recipient: data.recipient,
    userGroup: data.recipient === 'group' ? data.userGroup : '',
    userQuery: data.recipient === 'user' ? data.userQuery : '',
    channel: data.channel,
    scheduledAt: data.scheduledAt || null,
    error: null,
    draft,
  });

  if (!existing) MOCK_NOTIFICATIONS.unshift(row);

  if (draft) {
    row.status = 'draft';
  } else if (row.scheduledAt && new Date(row.scheduledAt) > now) {
    row.status = 'scheduled';
  } else {
    startSending(row);
  }

  return row;
}

// POST /admin/broadcasts/:id/send — drafts, scheduled and failed only.
export function sendMockBroadcast(id) {
  const row = findMockBroadcast(id);
  if (!isBroadcastEditable(row)) return null;
  row.scheduledAt = null;
  startSending(row);
  return row;
}

export function deleteMockBroadcast(id) {
  const index = MOCK_NOTIFICATIONS.findIndex((row) => row._id === id);
  if (index !== -1 && isBroadcastEditable(MOCK_NOTIFICATIONS[index])) MOCK_NOTIFICATIONS.splice(index, 1);
}

export { SEND_DURATION_MS };
