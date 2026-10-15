import { _mock } from 'src/_mock';

import { MOCK_USERS } from 'src/sections/_active/users-view/mock';

// ----------------------------------------------------------------------

const img = (file) => `/assets/images/products/${file}`;

const sellerFromUser = (id) => {
  const user = MOCK_USERS.find((row) => row._id === id);
  if (!user) return null;

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl,
  };
};

export const MOCK_COMPANIES = [
  {
    _id: 'co-001',
    name: 'Al-Qabas Company',
    logo: _mock.image.company(0),
    description: 'A clean, elegant Islamic storefront with curated prayer and home pieces.',
    rating: 5,
    reviews: 921,
    seller: sellerFromUser('usr-002'),
  },
  {
    _id: 'co-002',
    name: 'Aurora Store',
    logo: _mock.image.company(1),
    description: 'Featured modest fashion and seasonal collections.',
    rating: 5,
    reviews: 412,
    seller: sellerFromUser('usr-003'),
  },
  {
    _id: 'co-003',
    name: 'Lume Studio',
    logo: _mock.image.company(2),
    description: 'Contemporary hijab and modest wear studio.',
    rating: 5,
    reviews: 286,
    seller: sellerFromUser('usr-005'),
  },
  {
    _id: 'co-004',
    name: 'Azalea Cloths',
    logo: _mock.image.company(3),
    description: 'Soft chiffon hijabs and everyday modest essentials.',
    rating: 4,
    reviews: 198,
    seller: sellerFromUser('usr-006'),
  },
  {
    _id: 'co-005',
    name: 'Kameela',
    logo: _mock.image.company(4),
    description: 'Gifts, fragrances, and pieces chosen with barakah.',
    rating: 5,
    reviews: 540,
    seller: sellerFromUser('usr-011'),
  },
];

const janamazReviews = [
  {
    _id: 'rev-001',
    name: 'Ayesha Khan',
    avatarUrl: _mock.image.avatar(1),
    rating: 5,
    comment: 'I absolutely love this Janamaz! The quality is beautiful and it feels so comfortable during prayer. The design is elegant and the delivery was super fast.',
    createdAt: '2026-08-12T10:00:00.000Z',
  },
  {
    _id: 'rev-002',
    name: 'Muhammad Ahmed',
    avatarUrl: _mock.image.avatar(2),
    rating: 5,
    comment: 'Amazing quality and exactly as shown in the pictures. The Janamaz is soft, beautiful, and perfect for daily prayers. Very happy with my purchase!',
    createdAt: '2026-08-12T11:00:00.000Z',
  },
  {
    _id: 'rev-003',
    name: 'Hassan Ali',
    avatarUrl: _mock.image.avatar(3),
    rating: 4,
    comment: "I'm really impressed with the quality. It's comfortable, lightweight, and the design is beautiful. A wonderful purchase from Taibah!",
    createdAt: '2026-08-12T12:00:00.000Z',
  },
];

export const MOCK_PRODUCTS = [
  {
    _id: 'prd-001',
    title: 'Premium Velvet Janamaz',
    description:
      'Soft-touch premium velvet with a traditional mihrab motif, designed for comfort and focus in every prayer.',
    features: ['Premium Turkish Velvet', 'Comfortable Padded Base', 'Easy To Fold And Carry'],
    images: [img('janamaz-1.jpg'), img('janamaz-2.jpg'), img('rug-a.jpg')],
    primaryIndex: 0,
    price: 300,
    salePrice: 100,
    offPercent: 67,
    discountEndsAt: '2026-10-31T23:59:00.000Z',
    category: 'Prayer Items',
    company: MOCK_COMPANIES[0],
    colors: ['#1B5E4B', '#000000', '#8D6E3C', '#1565C0', '#26A69A'],
    quantity: 84,
    soldCount: 1284,
    favoriteCount: 412,
    rating: 5,
    totalReviews: 1000,
    reviews: janamazReviews,
    createdAt: '2026-08-01T09:15:00.000Z',
  },
  {
    _id: 'prd-002',
    title: 'Elegant Janamaz',
    description: 'An elegantly crafted janamaz with a refined mihrab design for daily salah.',
    features: ['Lightweight weave', 'Non-slip backing', 'Travel friendly'],
    images: [img('janamaz-2.jpg'), img('janamaz-4.jpg')],
    primaryIndex: 0,
    price: 156,
    salePrice: 100,
    offPercent: 36,
    discountEndsAt: '2026-11-15T23:59:00.000Z',
    category: 'Prayer Items',
    company: MOCK_COMPANIES[0],
    colors: ['#1B5E4B', '#000000'],
    quantity: 56,
    soldCount: 642,
    favoriteCount: 198,
    rating: 5,
    totalReviews: 420,
    reviews: janamazReviews,
    createdAt: '2026-08-10T11:40:00.000Z',
  },
  {
    _id: 'prd-003',
    title: 'Janamaz',
    description: 'An elegantly crafted janamaz for everyday prayer at home or on the go.',
    features: ['Compact fold', 'Soft surface', 'Easy to pack'],
    images: [img('janamaz-3.jpg'), img('janamaz-1.jpg')],
    primaryIndex: 0,
    price: 129,
    salePrice: 90,
    offPercent: 30,
    discountEndsAt: '2026-11-08T21:00:00.000Z',
    category: 'Prayer Items',
    company: MOCK_COMPANIES[4],
    colors: ['#1B5E4B', '#C9A96E'],
    quantity: 8,
    soldCount: 318,
    favoriteCount: 87,
    rating: 5,
    totalReviews: 188,
    reviews: janamazReviews.slice(0, 2),
    createdAt: '2026-08-18T14:05:00.000Z',
  },
  {
    _id: 'prd-004',
    title: 'Fancy Hijab',
    description: 'A dreamy beige chiffon hijab with a light drape for everyday modest wear.',
    features: ['Chiffon finish', 'Breathable', 'One size'],
    images: [img('hijab-b.jpg'), img('hijab-e.jpg')],
    primaryIndex: 0,
    price: 500,
    salePrice: 320,
    offPercent: 36,
    discountEndsAt: '2026-11-20T23:59:00.000Z',
    category: 'Hijab',
    company: MOCK_COMPANIES[3],
    colors: ['#C9A96E', '#000000', '#FFFFFF'],
    quantity: 42,
    soldCount: 214,
    favoriteCount: 64,
    rating: 5,
    totalReviews: 96,
    reviews: janamazReviews.slice(0, 1),
    createdAt: '2026-09-02T08:30:00.000Z',
  },
  {
    _id: 'prd-005',
    title: 'New Look Hijab',
    description: 'A dreamy beige chiffon hijab with a fresh everyday silhouette.',
    features: ['Soft chiffon', 'Opaque drape', 'Machine washable'],
    images: [img('hijab-d.jpg'), img('hijab-e.jpg')],
    primaryIndex: 0,
    price: 234,
    salePrice: 150,
    offPercent: 36,
    discountEndsAt: '2026-11-12T18:30:00.000Z',
    category: 'Hijab',
    company: MOCK_COMPANIES[2],
    colors: ['#C9A96E', '#6D4C41'],
    quantity: 36,
    soldCount: 156,
    favoriteCount: 41,
    rating: 5,
    totalReviews: 64,
    reviews: janamazReviews.slice(1, 2),
    createdAt: '2026-09-08T16:20:00.000Z',
  },
  {
    _id: 'prd-006',
    title: 'Fancy Hijab — Olive',
    description: 'A dreamy chiffon hijab in a rich olive tone for gatherings and Eid.',
    features: ['Premium chiffon', 'Gentle sheen', 'Stays in place'],
    images: [img('hijab-a.jpg'), img('hijab-b.jpg')],
    primaryIndex: 0,
    price: 234,
    salePrice: 150,
    offPercent: 36,
    discountEndsAt: '2026-11-18T20:00:00.000Z',
    category: 'Hijab',
    company: MOCK_COMPANIES[1],
    colors: ['#1B5E4B', '#C9A96E'],
    quantity: 28,
    soldCount: 89,
    favoriteCount: 22,
    rating: 4,
    totalReviews: 51,
    reviews: [],
    createdAt: '2026-09-14T10:10:00.000Z',
  },
  {
    _id: 'prd-007',
    title: 'Modest Abaya Set',
    description: 'A modest fashion set chosen with care for comfort through the day.',
    features: ['Breathable fabric', 'Relaxed fit', 'Easy care'],
    images: [img('hijab-a.jpg'), img('abaya-a.jpg')],
    primaryIndex: 0,
    price: 220,
    salePrice: null,
    offPercent: 0,
    discountEndsAt: null,
    category: 'Modest Fashion',
    company: MOCK_COMPANIES[1],
    colors: ['#000000', '#6D4C41', '#1B5E4B'],
    quantity: 64,
    soldCount: 407,
    favoriteCount: 133,
    rating: 5,
    totalReviews: 210,
    reviews: janamazReviews.slice(0, 2),
    createdAt: '2026-09-20T13:45:00.000Z',
  },
  {
    _id: 'prd-008',
    title: 'Attar Gift Box',
    description: 'A curated fragrance gift set for family and celebrations.',
    features: ['Long lasting', 'Gift ready', 'Travel vials'],
    images: [img('attar-a.jpg'), img('attar-b.jpg')],
    primaryIndex: 0,
    price: 80,
    salePrice: 55,
    offPercent: 31,
    discountEndsAt: '2026-10-25T23:59:00.000Z',
    category: 'Fragrance',
    company: MOCK_COMPANIES[4],
    colors: ['#D4A017', '#1B5E4B'],
    quantity: 0,
    soldCount: 276,
    favoriteCount: 95,
    rating: 4,
    totalReviews: 132,
    reviews: janamazReviews.slice(2),
    createdAt: '2026-09-28T09:00:00.000Z',
  },
  {
    _id: 'prd-009',
    title: 'Eid Gift Hamper',
    description: 'Islamic gifts chosen with heart for Eid gatherings.',
    features: ['Ready to gift', 'Mixed keepsakes', 'Premium wrap'],
    images: [img('lantern-a.jpg'), img('gift-1.jpg'), img('mosque-night.jpg')],
    primaryIndex: 0,
    price: 180,
    salePrice: 120,
    offPercent: 33,
    discountEndsAt: '2026-10-28T22:00:00.000Z',
    category: 'Islamic Gifts',
    company: MOCK_COMPANIES[4],
    colors: ['#D4A017', '#C9A96E'],
    quantity: 6,
    soldCount: 98,
    favoriteCount: 31,
    rating: 5,
    totalReviews: 77,
    reviews: [],
    createdAt: '2026-10-02T12:25:00.000Z',
  },
  {
    _id: 'prd-010',
    title: 'Home Mihrab Decor',
    description: 'A calm home accent inspired by traditional mihrab detailing.',
    features: ['Wall ready', 'Warm lighting', 'Statement piece'],
    images: [img('mihrab-a.jpg'), img('mosque-interior.jpg'), img('nabawi.jpg')],
    primaryIndex: 0,
    price: 260,
    salePrice: null,
    offPercent: 0,
    discountEndsAt: null,
    category: 'Home & Decor',
    company: MOCK_COMPANIES[0],
    colors: ['#C9A96E', '#8D6E3C', '#1B5E4B'],
    quantity: 22,
    soldCount: 54,
    favoriteCount: 18,
    rating: 5,
    totalReviews: 40,
    reviews: janamazReviews.slice(0, 1),
    createdAt: '2026-10-08T15:50:00.000Z',
  },
];

export function upsertMockProduct(product) {
  if (product._id) {
    const index = MOCK_PRODUCTS.findIndex((row) => row._id === product._id);
    if (index !== -1) {
      MOCK_PRODUCTS[index] = { ...MOCK_PRODUCTS[index], ...product };
      return MOCK_PRODUCTS[index];
    }
  }

  const created = {
    ...product,
    _id: `prd-${Date.now()}`,
    rating: product.rating || 0,
    totalReviews: product.totalReviews || 0,
    soldCount: product.soldCount || 0,
    favoriteCount: product.favoriteCount || 0,
    reviews: product.reviews || [],
    createdAt: new Date().toISOString(),
  };

  MOCK_PRODUCTS.unshift(created);
  return created;
}

export function deleteMockProduct(id) {
  const index = MOCK_PRODUCTS.findIndex((row) => row._id === id);
  if (index !== -1) {
    MOCK_PRODUCTS.splice(index, 1);
  }
}

export const getPrimaryImage = (row) => {
  const images = row?.images || [];
  if (!images.length) return '';
  return images[row.primaryIndex ?? 0] || images[0];
};
