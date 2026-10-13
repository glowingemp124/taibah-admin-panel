import { getOrderTotal, getOrderVendors, MOCK_ORDERS } from 'src/sections/_active/orders-view/mock';

// ----------------------------------------------------------------------

const statusFromOrder = (order) => {
  if (order.status === 'cancelled') {
    return order.paymentMethod === 'card' ? 'refunded' : 'cancelled';
  }

  if (order.paymentMethod === 'cash-on-delivery') {
    return order.status === 'delivered' ? 'paid' : 'pending';
  }

  return 'paid';
};

const vendorFromOrder = (order) => getOrderVendors(order)[0] || null;

const transactionFromOrder = (order, extras = {}) => ({
  _id: `txn-${order._id}`,
  transactionId: `TXN-${order.orderId.replace('NB-', '')}`,
  orderId: order.orderId,
  orderRef: order._id,
  customer: order.customer,
  vendor: vendorFromOrder(order),
  paymentMethod: order.paymentMethod,
  amount: getOrderTotal(order),
  status: statusFromOrder(order),
  createdAt: order.createdAt,
  paidAt: extras.paidAt ?? (statusFromOrder(order) === 'paid' ? order.createdAt : null),
  reference: extras.reference || `REF-${order.orderId.replace('NB-', '9')}`,
  cardLast4: order.paymentMethod === 'card' ? extras.cardLast4 || '4242' : null,
  note: extras.note || '',
});

export const MOCK_TRANSACTIONS = [
  transactionFromOrder(MOCK_ORDERS[0], { note: 'COD — collect on delivery.' }),
  transactionFromOrder(MOCK_ORDERS[1], { paidAt: '2026-03-10T09:13:12.000Z', cardLast4: '1881' }),
  transactionFromOrder(MOCK_ORDERS[2], { paidAt: '2026-03-18T13:06:40.000Z', cardLast4: '5512' }),
  transactionFromOrder(MOCK_ORDERS[3], { note: 'Awaiting cash collection.' }),
  transactionFromOrder(MOCK_ORDERS[4], { paidAt: '2026-03-17T16:19:08.000Z', cardLast4: '0044' }),
  transactionFromOrder(MOCK_ORDERS[5], { note: 'COD — confirmed, not collected yet.' }),
  transactionFromOrder(MOCK_ORDERS[6], {
    paidAt: '2026-03-14T07:51:20.000Z',
    cardLast4: '8890',
    note: 'Card charge reversed after cancellation.',
  }),
  transactionFromOrder(MOCK_ORDERS[7], { paidAt: '2026-03-08T13:22:00.000Z', note: 'COD collected on delivery.' }),
  {
    _id: 'txn-failed-001',
    transactionId: 'TXN-102890',
    orderId: 'NB-102890',
    orderRef: null,
    customer: MOCK_ORDERS[1].customer,
    vendor: vendorFromOrder(MOCK_ORDERS[1]),
    paymentMethod: 'card',
    amount: 220,
    status: 'failed',
    createdAt: '2026-03-21T09:04:00.000Z',
    paidAt: null,
    reference: 'REF-102890',
    cardLast4: '4242',
    note: 'Card declined — insufficient funds.',
  },
];
