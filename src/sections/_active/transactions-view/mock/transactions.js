import { MOCK_COMPANIES } from 'src/sections/_active/products-view/mock';
import { MOCK_ORDERS } from 'src/sections/_active/orders-view/mock';

// ----------------------------------------------------------------------
// Mirrors GET /admin/transactions (?sellerId, ?userId) and GET /seller/transactions.
// One transaction per store part, because each store captures its part when it accepts.
// status follows the part's paymentStatus: captured = income ("Paid"), authorized = held, not income yet,
// released = the hold was dropped (cancelled while pending).

const CARDS = ['7781', '1881', '5512', '3318', '0044', '6020', '8890', '9104'];

const vendorFor = (store) => {
  const company = MOCK_COMPANIES.find((row) => row.seller?._id === store.sellerId);
  return {
    _id: store.sellerId,
    name: store.name,
    logo: store.logo,
    rating: company?.rating,
    reviews: company?.reviews,
    seller: company?.seller ? { ...company.seller } : null,
  };
};

const transactionFromStore = (order, store, index) => {
  const short = store.code.replace('#NB-', '');

  return {
    _id: `txn-${store._id}`,
    transactionId: `TXN-${short}`,
    orderId: store.code,
    orderRef: order._id,
    orderCode: order.code,
    orderStatus: store.status,
    customer: order.customer,
    vendor: vendorFor(store),
    paymentMethod: 'card',
    amount: store.total,
    status: store.paymentStatus,
    createdAt: order.createdAt,
    paidAt: store.capturedAt || null,
    releasedAt: store.releasedAt || null,
    // Mock-only until Stripe is built; the API doesn't send these yet.
    reference: `REF-${short}`,
    cardLast4: CARDS[index % CARDS.length],
    note: store.paymentStatus === 'released' ? `Hold released: ${store.cancelReason || 'cancelled while pending'}` : '',
  };
};

export const getMockTransactions = () =>
  MOCK_ORDERS.flatMap((order, orderIndex) => order.stores.map((store) => transactionFromStore(order, store, orderIndex)));

const sumAmounts = (rows, status) => Math.round(rows.filter((row) => row.status === status).reduce((sum, row) => sum + (row.amount || 0), 0) * 100) / 100;

// The API's meta: counts = { captured, authorized, released }; totals = { income, held, released }.
// Only captured amounts are income; held amounts aren't income yet.
export const getTransactionsMeta = (rows) => ({
  counts: {
    captured: rows.filter((row) => row.status === 'captured').length,
    authorized: rows.filter((row) => row.status === 'authorized').length,
    released: rows.filter((row) => row.status === 'released').length,
  },
  totals: {
    income: sumAmounts(rows, 'captured'),
    held: sumAmounts(rows, 'authorized'),
    released: sumAmounts(rows, 'released'),
  },
});
