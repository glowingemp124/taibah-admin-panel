import { MOCK_USERS } from 'src/sections/_active/users-view/mock';

// ----------------------------------------------------------------------

const userTicket = (userId, extra) => {
  const user = MOCK_USERS.find((row) => row._id === userId);

  return {
    userId,
    name: user?.name || 'User',
    email: user?.email || '',
    phone: user?.phone || '',
    avatarUrl: user?.avatarUrl || '',
    replies: [],
    ...extra,
  };
};

export const MOCK_TICKETS = [
  userTicket('usr-001', {
    _id: 'tkt-001',
    subject: 'Order not delivered',
    message: 'My janamaz order #NB-102401 has not arrived. The estimated window already passed.',
    priority: 'high',
    status: 'open',
    createdAt: '2026-10-08T11:32:00.000Z',
  }),
  userTicket('usr-003', {
    _id: 'tkt-002',
    subject: 'Payment not reflecting',
    message: 'I paid by card for order #NB-102328 but the transaction still shows pending on my side.',
    priority: 'medium',
    status: 'open',
    createdAt: '2026-10-09T09:10:00.000Z',
  }),
  userTicket('usr-002', {
    _id: 'tkt-003',
    subject: 'Unable to update product photos',
    message: 'Seller dashboard rejects my hijab images as an invalid file format even though they are JPG.',
    priority: 'low',
    status: 'open',
    createdAt: '2026-10-09T14:20:00.000Z',
  }),
  userTicket('usr-007', {
    _id: 'tkt-004',
    subject: 'Refund request',
    message: 'The abaya arrived damaged. Please advise how to start a refund for order #NB-102512.',
    priority: 'high',
    status: 'closed',
    replies: [
      {
        _id: 'rpl-001',
        message: 'Refund approved. It should appear on your original payment method in 3–5 days.',
        createdAt: '2026-10-10T08:15:00.000Z',
      },
    ],
    createdAt: '2026-10-07T11:15:00.000Z',
  }),
  userTicket('usr-004', {
    _id: 'tkt-005',
    subject: 'Account login issue',
    message: 'I keep seeing incorrect password even though I just reset it from the email link.',
    priority: 'medium',
    status: 'closed',
    replies: [
      {
        _id: 'rpl-002',
        message: 'Please sign out on all devices and use the newest reset link. Let us know if it still fails.',
        createdAt: '2026-10-08T16:40:00.000Z',
      },
    ],
    createdAt: '2026-10-06T12:05:00.000Z',
  }),
  userTicket('usr-010', {
    _id: 'tkt-006',
    subject: 'Attar gift box stock',
    message: 'Is the Attar Gift Box restocking before Eid? I need two boxes for family gifts.',
    priority: 'low',
    status: 'open',
    createdAt: '2026-10-11T08:22:00.000Z',
  }),
];

export function replyMockTicket(id, message) {
  const ticket = MOCK_TICKETS.find((row) => row._id === id);
  if (!ticket) return;

  ticket.replies = [
    ...(ticket.replies || []),
    {
      _id: `rpl-${Date.now()}`,
      message,
      createdAt: new Date().toISOString(),
    },
  ];
  ticket.updatedAt = new Date().toISOString();
}

export function closeMockTicket(id) {
  const ticket = MOCK_TICKETS.find((row) => row._id === id);
  if (ticket) {
    ticket.status = 'closed';
    ticket.updatedAt = new Date().toISOString();
  }
}
