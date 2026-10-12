import { _mock } from 'src/_mock';

// ----------------------------------------------------------------------
// One account per person. `roles` can include buyer, seller, or both.

export const MOCK_USERS = [
  {
    _id: 'usr-001',
    name: 'Aisha Rahman',
    email: 'aisha.rahman@email.com',
    phone: '+966 50 112 3344',
    avatarUrl: _mock.image.avatar(1),
    roles: ['buyer'],
    status: 'active',
    createdAt: '2026-01-12T09:15:00.000Z',
  },
  {
    _id: 'usr-002',
    name: 'Omar Al-Farsi',
    email: 'omar.alfarsi@email.com',
    phone: '+966 55 221 7788',
    avatarUrl: _mock.image.avatar(2),
    roles: ['seller'],
    status: 'active',
    createdAt: '2026-02-03T11:40:00.000Z',
  },
  {
    _id: 'usr-003',
    name: 'Hina Malik',
    email: 'hina.malik@email.com',
    phone: '+966 53 409 2210',
    avatarUrl: _mock.image.avatar(3),
    roles: ['buyer', 'seller'],
    status: 'active',
    createdAt: '2026-02-18T14:05:00.000Z',
  },
  {
    _id: 'usr-004',
    name: 'Yusuf Hassan',
    email: 'yusuf.hassan@email.com',
    phone: '+966 54 880 1199',
    avatarUrl: _mock.image.avatar(4),
    roles: ['buyer'],
    status: 'inactive',
    createdAt: '2026-03-01T08:30:00.000Z',
  },
  {
    _id: 'usr-005',
    name: 'Fatima Noor',
    email: 'fatima.noor@email.com',
    phone: '+966 56 334 6701',
    avatarUrl: _mock.image.avatar(5),
    roles: ['seller'],
    status: 'active',
    createdAt: '2026-03-22T16:20:00.000Z',
  },
  {
    _id: 'usr-006',
    name: 'Ibrahim Qureshi',
    email: 'ibrahim.qureshi@email.com',
    phone: '+966 58 102 4455',
    avatarUrl: _mock.image.avatar(6),
    roles: ['buyer', 'seller'],
    status: 'active',
    createdAt: '2026-04-09T10:10:00.000Z',
  },
  {
    _id: 'usr-007',
    name: 'Zainab Siddiqui',
    email: 'zainab.siddiqui@email.com',
    phone: '+966 59 773 2088',
    avatarUrl: _mock.image.avatar(7),
    roles: ['buyer'],
    status: 'active',
    createdAt: '2026-05-14T13:45:00.000Z',
  },
  {
    _id: 'usr-008',
    name: 'Bilal Khan',
    email: 'bilal.khan@email.com',
    phone: '+966 50 667 9912',
    avatarUrl: _mock.image.avatar(8),
    roles: ['seller'],
    status: 'inactive',
    createdAt: '2026-06-02T09:00:00.000Z',
  },
  {
    _id: 'usr-009',
    name: 'Maryam Abbas',
    email: 'maryam.abbas@email.com',
    phone: '+966 55 448 3306',
    avatarUrl: _mock.image.avatar(9),
    roles: ['buyer', 'seller'],
    status: 'inactive',
    createdAt: '2026-07-19T12:25:00.000Z',
  },
  {
    _id: 'usr-010',
    name: 'Hamza Ali',
    email: 'hamza.ali@email.com',
    phone: '+966 53 910 7744',
    avatarUrl: _mock.image.avatar(10),
    roles: ['buyer'],
    status: 'active',
    createdAt: '2026-08-08T15:50:00.000Z',
  },
  {
    _id: 'usr-011',
    name: 'Layla Hussain',
    email: 'layla.hussain@email.com',
    phone: '+966 54 215 6083',
    avatarUrl: _mock.image.avatar(11),
    roles: ['seller'],
    status: 'active',
    createdAt: '2026-09-11T07:35:00.000Z',
  },
  {
    _id: 'usr-012',
    name: 'Ahmed Karim',
    email: 'ahmed.karim@email.com',
    phone: '+966 56 801 2290',
    avatarUrl: _mock.image.avatar(12),
    roles: ['buyer', 'seller'],
    status: 'active',
    createdAt: '2026-10-01T18:05:00.000Z',
  },
];

export function updateMockUserStatus(id, status) {
  const user = MOCK_USERS.find((row) => row._id === id);
  if (user) {
    user.status = status;
  }
}
