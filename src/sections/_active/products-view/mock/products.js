import { _mock } from 'src/_mock';

// ----------------------------------------------------------------------

export const MOCK_COMPANIES = [
  {
    _id: 'co-001',
    name: 'Al-Qabas Company',
    logo: _mock.image.company(0),
    description: 'A clean, elegant Islamic storefront with curated prayer and home pieces.',
    rating: 4.9,
    reviews: 921,
  },
  {
    _id: 'co-002',
    name: 'Aurora Store',
    logo: _mock.image.company(1),
    description: 'Featured modest fashion and seasonal collections.',
    rating: 4.7,
    reviews: 412,
  },
  {
    _id: 'co-003',
    name: 'Lume Studio',
    logo: _mock.image.company(2),
    description: 'Contemporary hijab and modest wear studio.',
    rating: 4.8,
    reviews: 286,
  },
  {
    _id: 'co-004',
    name: 'Azalea Cloths',
    logo: _mock.image.company(3),
    description: 'Soft chiffon hijabs and everyday modest essentials.',
    rating: 4.6,
    reviews: 198,
  },
  {
    _id: 'co-005',
    name: 'Kameela',
    logo: _mock.image.company(4),
    description: 'Gifts, fragrances, and pieces chosen with barakah.',
    rating: 4.9,
    reviews: 540,
  },
];

const janamazReviews = [
  {
    _id: 'rev-001',
    name: 'Ayesha Khan',
    avatarUrl: _mock.image.avatar(1),
    comment: 'I absolutely love this Janamaz! The quality is beautiful and it feels so comfortable during prayer. The design is elegant and the delivery was super fast.',
    createdAt: '2026-08-12T10:00:00.000Z',
  },
  {
    _id: 'rev-002',
    name: 'Muhammad Ahmed',
    avatarUrl: _mock.image.avatar(2),
    comment: 'Amazing quality and exactly as shown in the pictures. The Janamaz is soft, beautiful, and perfect for daily prayers. Very happy with my purchase!',
    createdAt: '2026-08-12T11:00:00.000Z',
  },
  {
    _id: 'rev-003',
    name: 'Hassan Ali',
    avatarUrl: _mock.image.avatar(3),
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
    images: [_mock.image.product(0), _mock.image.product(1), _mock.image.product(2)],
    primaryIndex: 0,
    price: 300,
    salePrice: 100,
    offPercent: 67,
    category: 'Prayer Items',
    company: MOCK_COMPANIES[0],
    colors: ['#1B5E4B', '#000000', '#8D6E3C', '#1565C0', '#26A69A'],
    availability: 'in-stock',
    rating: 4.9,
    totalReviews: 1000,
    reviews: janamazReviews,
    createdAt: '2026-08-01T09:15:00.000Z',
  },
  {
    _id: 'prd-002',
    title: 'Elegant Janamaz',
    description: 'An elegantly crafted janamaz with a refined mihrab design for daily salah.',
    features: ['Lightweight weave', 'Non-slip backing', 'Travel friendly'],
    images: [_mock.image.product(3), _mock.image.product(4)],
    primaryIndex: 0,
    price: 156,
    salePrice: 100,
    offPercent: 36,
    category: 'Prayer Items',
    company: MOCK_COMPANIES[0],
    colors: ['#1B5E4B', '#000000'],
    availability: 'in-stock',
    rating: 4.8,
    totalReviews: 420,
    reviews: janamazReviews,
    createdAt: '2026-08-10T11:40:00.000Z',
  },
  {
    _id: 'prd-003',
    title: 'Janamaz',
    description: 'An elegantly crafted janamaz for everyday prayer at home or on the go.',
    features: ['Compact fold', 'Soft surface', 'Easy to pack'],
    images: [_mock.image.product(5), _mock.image.product(6)],
    primaryIndex: 0,
    price: 129,
    salePrice: 90,
    offPercent: 30,
    category: 'Prayer Items',
    company: MOCK_COMPANIES[4],
    colors: ['#1B5E4B', '#C9A96E'],
    availability: 'low-stock',
    rating: 4.7,
    totalReviews: 188,
    reviews: janamazReviews.slice(0, 2),
    createdAt: '2026-08-18T14:05:00.000Z',
  },
  {
    _id: 'prd-004',
    title: 'Fancy Hijab',
    description: 'A dreamy beige chiffon hijab with a light drape for everyday modest wear.',
    features: ['Chiffon finish', 'Breathable', 'One size'],
    images: [_mock.image.product(7), _mock.image.product(8)],
    primaryIndex: 0,
    price: 500,
    salePrice: 320,
    offPercent: 36,
    category: 'Hijab',
    company: MOCK_COMPANIES[3],
    colors: ['#C9A96E', '#000000', '#FFFFFF'],
    availability: 'in-stock',
    rating: 4.6,
    totalReviews: 96,
    reviews: janamazReviews.slice(0, 1),
    createdAt: '2026-09-02T08:30:00.000Z',
  },
  {
    _id: 'prd-005',
    title: 'New Look Hijab',
    description: 'A dreamy beige chiffon hijab with a fresh everyday silhouette.',
    features: ['Soft chiffon', 'Opaque drape', 'Machine washable'],
    images: [_mock.image.product(9), _mock.image.product(10)],
    primaryIndex: 0,
    price: 234,
    salePrice: 150,
    offPercent: 36,
    category: 'Hijab',
    company: MOCK_COMPANIES[2],
    colors: ['#C9A96E', '#6D4C41'],
    availability: 'in-stock',
    rating: 4.5,
    totalReviews: 64,
    reviews: janamazReviews.slice(1, 2),
    createdAt: '2026-09-08T16:20:00.000Z',
  },
  {
    _id: 'prd-006',
    title: 'Fancy Hijab — Olive',
    description: 'A dreamy chiffon hijab in a rich olive tone for gatherings and Eid.',
    features: ['Premium chiffon', 'Gentle sheen', 'Stays in place'],
    images: [_mock.image.product(11), _mock.image.product(12)],
    primaryIndex: 0,
    price: 234,
    salePrice: 150,
    offPercent: 36,
    category: 'Hijab',
    company: MOCK_COMPANIES[1],
    colors: ['#1B5E4B', '#C9A96E'],
    availability: 'in-stock',
    rating: 4.4,
    totalReviews: 51,
    reviews: [],
    createdAt: '2026-09-14T10:10:00.000Z',
  },
  {
    _id: 'prd-007',
    title: 'Modest Abaya Set',
    description: 'A modest fashion set chosen with care for comfort through the day.',
    features: ['Breathable fabric', 'Relaxed fit', 'Easy care'],
    images: [_mock.image.product(13), _mock.image.product(14)],
    primaryIndex: 0,
    price: 220,
    salePrice: null,
    offPercent: 0,
    category: 'Modest Fashion',
    company: MOCK_COMPANIES[1],
    colors: ['#000000', '#6D4C41', '#1B5E4B'],
    availability: 'in-stock',
    rating: 4.8,
    totalReviews: 210,
    reviews: janamazReviews.slice(0, 2),
    createdAt: '2026-09-20T13:45:00.000Z',
  },
  {
    _id: 'prd-008',
    title: 'Attar Gift Box',
    description: 'A curated fragrance gift set for family and celebrations.',
    features: ['Long lasting', 'Gift ready', 'Travel vials'],
    images: [_mock.image.product(15), _mock.image.product(16)],
    primaryIndex: 0,
    price: 80,
    salePrice: 55,
    offPercent: 31,
    category: 'Fragrance',
    company: MOCK_COMPANIES[4],
    colors: ['#D4A017', '#1B5E4B'],
    availability: 'out-of-stock',
    rating: 4.9,
    totalReviews: 132,
    reviews: janamazReviews.slice(2),
    createdAt: '2026-09-28T09:00:00.000Z',
  },
  {
    _id: 'prd-009',
    title: 'Eid Gift Hamper',
    description: 'Islamic gifts chosen with heart for Eid gatherings.',
    features: ['Ready to gift', 'Mixed keepsakes', 'Premium wrap'],
    images: [_mock.image.product(17), _mock.image.product(18)],
    primaryIndex: 0,
    price: 180,
    salePrice: 120,
    offPercent: 33,
    category: 'Islamic Gifts',
    company: MOCK_COMPANIES[4],
    colors: ['#D4A017', '#C9A96E'],
    availability: 'low-stock',
    rating: 4.7,
    totalReviews: 77,
    reviews: [],
    createdAt: '2026-10-02T12:25:00.000Z',
  },
  {
    _id: 'prd-010',
    title: 'Home Mihrab Decor',
    description: 'A calm home accent inspired by traditional mihrab detailing.',
    features: ['Wall ready', 'Warm lighting', 'Statement piece'],
    images: [_mock.image.product(19), _mock.image.product(0)],
    primaryIndex: 0,
    price: 260,
    salePrice: null,
    offPercent: 0,
    category: 'Home & Decor',
    company: MOCK_COMPANIES[0],
    colors: ['#C9A96E', '#8D6E3C', '#1B5E4B'],
    availability: 'in-stock',
    rating: 4.6,
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
