import { getPrimaryImage, MOCK_PRODUCTS } from 'src/sections/_active/products-view/mock';
import { MOCK_USERS } from 'src/sections/_active/users-view/mock';

import { ORDER_STATUS_FLOW } from '../order-table-config';

// ----------------------------------------------------------------------

const vendorFromProduct = (product) => {
  const company = product?.company;
  if (!company) return null;

  return {
    _id: company._id,
    name: company.name,
    logo: company.logo,
    rating: company.rating,
    reviews: company.reviews,
    seller: company.seller
      ? {
          _id: company.seller._id,
          name: company.seller.name,
          email: company.seller.email,
          avatarUrl: company.seller.avatarUrl,
        }
      : null,
  };
};

const productItem = (productId, quantity, color) => {
  const product = MOCK_PRODUCTS.find((row) => row._id === productId);
  const unitPrice = product?.salePrice || product?.price || 0;

  return {
    productId,
    title: product?.title || 'Product',
    image: getPrimaryImage(product),
    quantity,
    color,
    unitPrice,
    total: unitPrice * quantity,
    vendor: vendorFromProduct(product),
  };
};

export const getOrderVendors = (order) => {
  const vendors = new Map();

  (order?.items || []).forEach((item) => {
    if (item.vendor?._id && !vendors.has(item.vendor._id)) {
      vendors.set(item.vendor._id, item.vendor);
    }
  });

  return Array.from(vendors.values());
};

const customerFromUser = (id) => {
  const user = MOCK_USERS.find((row) => row._id === id);
  if (!user) return null;

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    avatarUrl: user.avatarUrl,
  };
};

const buildTimeline = (status, timestamps = {}) =>
  ORDER_STATUS_FLOW.map((step) => {
    const at = timestamps[step.value] || null;
    const completed = Boolean(at);

    return {
      status: step.value,
      label: step.label,
      at,
      completed: Boolean(at),
      expected: !completed && timestamps[`${step.value}Expected`] ? timestamps[`${step.value}Expected`] : null,
    };
  });

export const MOCK_ORDERS = [
  {
    _id: 'ord-001',
    orderId: 'NB-102328',
    status: 'on-the-way',
    customer: customerFromUser('usr-003'),
    items: [productItem('prd-001', 1, 'Forest Green')],
    note: 'Please leave the parcel with the building concierge if I am not home.',
    paymentMethod: 'cash-on-delivery',
    address: {
      type: 'Home',
      line: '102 Main Road, Downtown',
      city: 'Riyadh',
    },
    estimatedDelivery: '18 Mar - 20 Mar',
    createdAt: '2026-03-15T10:24:00.000Z',
    timeline: buildTimeline('on-the-way', {
      pending: '2026-03-15T10:24:00.000Z',
      processing: '2026-03-16T18:20:00.000Z',
      'on-the-way': '2026-03-16T18:32:00.000Z',
      deliveredExpected: '2026-03-19T18:00:00.000Z',
    }),
  },
  {
    _id: 'ord-002',
    orderId: 'NB-102401',
    status: 'delivered',
    customer: customerFromUser('usr-001'),
    items: [productItem('prd-004', 2, 'Beige'), productItem('prd-005', 1, 'Beige')],
    note: '',
    paymentMethod: 'card',
    address: {
      type: 'Office',
      line: 'Taibah Tower, Downtown',
      city: 'Jeddah',
    },
    estimatedDelivery: '12 Mar - 14 Mar',
    createdAt: '2026-03-10T09:12:00.000Z',
    timeline: buildTimeline('delivered', {
      pending: '2026-03-10T09:12:00.000Z',
      processing: '2026-03-11T14:10:00.000Z',
      'on-the-way': '2026-03-12T08:20:00.000Z',
      delivered: '2026-03-12T15:48:00.000Z',
    }),
  },
  {
    _id: 'ord-003',
    orderId: 'NB-102512',
    status: 'processing',
    customer: customerFromUser('usr-007'),
    items: [productItem('prd-007', 1, 'Black')],
    note: 'Gift wrap if possible.',
    paymentMethod: 'card',
    address: {
      type: 'Home',
      line: '44 Al Olaya Street',
      city: 'Riyadh',
    },
    estimatedDelivery: '22 Mar - 24 Mar',
    createdAt: '2026-03-18T13:05:00.000Z',
    timeline: buildTimeline('processing', {
      pending: '2026-03-18T13:05:00.000Z',
      processing: '2026-03-19T10:15:00.000Z',
    }),
  },
  {
    _id: 'ord-004',
    orderId: 'NB-102588',
    status: 'pending',
    customer: customerFromUser('usr-010'),
    items: [productItem('prd-008', 1, 'Gold')],
    note: 'Need this before Eid, please confirm stock.',
    paymentMethod: 'cash-on-delivery',
    address: {
      type: 'Home',
      line: '8 King Fahd Road',
      city: 'Dammam',
    },
    estimatedDelivery: '25 Mar - 27 Mar',
    createdAt: '2026-03-20T08:44:00.000Z',
    timeline: buildTimeline('pending', {
      pending: '2026-03-20T08:44:00.000Z',
    }),
  },
  {
    _id: 'ord-005',
    orderId: 'NB-102610',
    status: 'on-the-way',
    customer: customerFromUser('usr-006'),
    items: [productItem('prd-002', 1, 'Forest Green'), productItem('prd-010', 1, 'Beige')],
    note: '',
    paymentMethod: 'card',
    address: {
      type: 'Office',
      line: 'Business Gate, Exit 6',
      city: 'Riyadh',
    },
    estimatedDelivery: '21 Mar - 23 Mar',
    createdAt: '2026-03-17T16:18:00.000Z',
    timeline: buildTimeline('on-the-way', {
      pending: '2026-03-17T16:18:00.000Z',
      processing: '2026-03-18T11:05:00.000Z',
      'on-the-way': '2026-03-18T19:22:00.000Z',
    }),
  },
  {
    _id: 'ord-006',
    orderId: 'NB-102677',
    status: 'processing',
    customer: customerFromUser('usr-012'),
    items: [productItem('prd-009', 1, 'Gold')],
    note: 'Call before delivery.',
    paymentMethod: 'cash-on-delivery',
    address: {
      type: 'Home',
      line: '12 Corniche Road',
      city: 'Jeddah',
    },
    estimatedDelivery: '24 Mar - 26 Mar',
    createdAt: '2026-03-19T11:27:00.000Z',
    timeline: buildTimeline('processing', {
      pending: '2026-03-19T11:27:00.000Z',
      processing: '2026-03-19T11:55:00.000Z',
    }),
  },
  {
    _id: 'ord-007',
    orderId: 'NB-102701',
    status: 'pending',
    customer: customerFromUser('usr-004'),
    items: [productItem('prd-006', 1, 'Forest Green')],
    note: 'Customer requested cancellation before packing.',
    paymentMethod: 'card',
    address: {
      type: 'Home',
      line: '90 Prince Sultan Street',
      city: 'Jeddah',
    },
    estimatedDelivery: '',
    createdAt: '2026-03-14T07:50:00.000Z',
    timeline: buildTimeline('pending', {
      pending: '2026-03-14T07:50:00.000Z',
    }),
  },
  {
    _id: 'ord-008',
    orderId: 'NB-102744',
    status: 'delivered',
    customer: customerFromUser('usr-003'),
    items: [productItem('prd-003', 1, 'Beige')],
    note: '',
    paymentMethod: 'cash-on-delivery',
    address: {
      type: 'Home',
      line: '102 Main Road, Downtown',
      city: 'Riyadh',
    },
    estimatedDelivery: '08 Mar - 10 Mar',
    createdAt: '2026-03-06T12:08:00.000Z',
    timeline: buildTimeline('delivered', {
      pending: '2026-03-06T12:08:00.000Z',
      processing: '2026-03-07T09:40:00.000Z',
      'on-the-way': '2026-03-08T08:05:00.000Z',
      delivered: '2026-03-08T13:20:00.000Z',
    }),
  },
];

export const getOrderTotal = (order) => (order?.items || []).reduce((sum, item) => sum + (item.total || 0), 0);

export function updateMockOrder(id, patch) {
  const order = MOCK_ORDERS.find((row) => row._id === id);
  if (!order) return;

  Object.assign(order, patch);

  if (patch.status) {
    const currentIndex = ORDER_STATUS_FLOW.findIndex((step) => step.value === patch.status);
    order.timeline = ORDER_STATUS_FLOW.map((step, index) => {
      const existing = (order.timeline || []).find((item) => item.status === step.value);
      const shouldComplete = index <= currentIndex;

      return {
        status: step.value,
        label: step.label,
        at: shouldComplete ? existing?.at || new Date().toISOString() : existing?.at || null,
        completed: shouldComplete,
        expected: existing?.expected || null,
      };
    });
  }
}
