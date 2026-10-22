import { _mock } from 'src/_mock';

import { findMockCategory } from 'src/sections/_active/categories-view/mock/categories';
import { findMockOption } from 'src/sections/_active/options-view/mock/options';
import { MOCK_USERS } from 'src/sections/_active/users-view/mock';

import { summarizeProduct, toImageKey } from '../product-utils';

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

// Store directory (one store per seller). Products only keep `{ _id: sellerId, name, logo }`.
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

// ----------------------------------------------------------------------
// Builders that keep the mock rows in the exact shape the API will return.

const companyRef = (company) => ({ _id: company.seller?._id, name: company.name, logo: company.logo });

const categoryRef = (id) => {
  const category = findMockCategory(id);
  return { _id: category._id, title: category.title, unit: category.unit };
};

export const optionRef = (optionId, value) => {
  const option = findMockOption(optionId);
  const item = option?.values.find((row) => row.value === value);

  return {
    attribute: { _id: option?._id, name: option?.name, type: option?.type },
    value,
    label: item?.label || value,
  };
};

const variant = (_id, { sku = null, options = [], price, stock, amount = null, unit = 'piece', images = [] }) => ({
  _id,
  sku,
  options,
  price,
  salePrice: null,
  stock,
  amount,
  unit,
  images,
  imageKeys: images.map((image) => toImageKey(image)),
});

const product = (data) =>
  summarizeProduct({
    offPercent: 0,
    discountStartsAt: null,
    discountEndsAt: null,
    status: 'active',
    reviewStatus: 'approved',
    reviewReason: null,
    reviewedAt: data.reviewStatus === 'pending' ? null : data.updatedAt || data.createdAt,
    rating: 0,
    totalReviews: 0,
    favoriteCount: 0,
    soldCount: 0,
    reviews: [],
    updatedAt: data.createdAt,
    ...data,
    imageKeys: data.images.map((image) => toImageKey(image)),
  });

const color = (value) => optionRef('opt-color', value);
const size = (value) => optionRef('opt-size', value);
const volume = (value) => optionRef('opt-volume', value);

const clothingVariants = (prefix, sizes, colors, price, stockFor) =>
  sizes.flatMap((sizeValue) =>
    colors.map((colorValue) => {
      const colorLabel = findMockOption('opt-color').values.find((row) => row.value === colorValue)?.label || colorValue;
      return variant(`var-${prefix}-${sizeValue}-${colorLabel}`.toLowerCase(), {
        sku: `${prefix}-${sizeValue}-${colorLabel.slice(0, 3)}`.toUpperCase(),
        options: [size(sizeValue), color(colorValue)],
        price,
        stock: stockFor(sizeValue, colorValue),
      });
    })
  );

export const MOCK_PRODUCTS = [
  product({
    _id: 'prd-001',
    title: 'Premium Velvet Janamaz',
    description: 'Soft-touch premium velvet with a traditional mihrab motif, designed for comfort and focus in every prayer.',
    features: ['Premium Turkish Velvet', 'Comfortable Padded Base', 'Easy To Fold And Carry'],
    images: [img('janamaz-1.jpg'), img('janamaz-2.jpg'), img('rug-a.jpg')],
    category: categoryRef('cat-005'),
    company: companyRef(MOCK_COMPANIES[0]),
    offPercent: 20,
    discountStartsAt: '2026-10-01',
    discountEndsAt: '2026-10-31',
    variants: [
      variant('var-001-green', { sku: 'JNM-VLV-GRN', options: [color('#1B5E4B')], price: 300, stock: 40, images: [img('janamaz-1.jpg')] }),
      variant('var-001-black', { sku: 'JNM-VLV-BLK', options: [color('#000000')], price: 300, stock: 26, images: [img('janamaz-2.jpg')] }),
      variant('var-001-brown', { sku: 'JNM-VLV-BRN', options: [color('#8D6E3C')], price: 320, stock: 18, images: [img('rug-a.jpg')] }),
    ],
    soldCount: 1284,
    favoriteCount: 412,
    rating: 5,
    totalReviews: 1000,
    reviews: janamazReviews,
    reviewedAt: '2026-08-02T10:00:00.000Z',
    createdAt: '2026-08-01T09:15:00.000Z',
    updatedAt: '2026-10-01T08:00:00.000Z',
  }),
  product({
    _id: 'prd-002',
    title: 'Elegant Janamaz',
    description: 'An elegantly crafted janamaz with a refined mihrab design for daily salah.',
    features: ['Lightweight weave', 'Non-slip backing', 'Travel friendly'],
    images: [img('janamaz-2.jpg'), img('janamaz-4.jpg')],
    category: categoryRef('cat-005'),
    company: companyRef(MOCK_COMPANIES[0]),
    variants: [
      variant('var-002-green', { sku: 'JNM-ELG-GRN', options: [color('#1B5E4B')], price: 156, stock: 30 }),
      variant('var-002-black', { sku: 'JNM-ELG-BLK', options: [color('#000000')], price: 156, stock: 26 }),
    ],
    soldCount: 642,
    favoriteCount: 198,
    rating: 5,
    totalReviews: 420,
    reviews: janamazReviews,
    createdAt: '2026-08-10T11:40:00.000Z',
  }),
  product({
    _id: 'prd-003',
    title: 'Modest Abaya',
    description: 'A flowing everyday abaya in breathable fabric, cut for comfort from morning to evening.',
    features: ['Breathable', 'Machine wash', 'Relaxed fit'],
    images: [img('abaya-a.jpg'), img('hijab-a.jpg')],
    category: categoryRef('cat-001'),
    company: companyRef(MOCK_COMPANIES[1]),
    offPercent: 10,
    discountStartsAt: '2026-11-01',
    discountEndsAt: '2026-11-30',
    variants: clothingVariants('ABY', ['S', 'M', 'L'], ['#000000', '#1B5E4B'], 49.99, (sizeValue, colorValue) => {
      if (sizeValue === 'S' && colorValue === '#000000') return 5;
      if (sizeValue === 'L' && colorValue === '#1B5E4B') return 0;
      return 3;
    }),
    soldCount: 407,
    favoriteCount: 133,
    rating: 5,
    totalReviews: 210,
    reviews: janamazReviews.slice(0, 2),
    createdAt: '2026-09-20T13:45:00.000Z',
  }),
  product({
    _id: 'prd-004',
    title: 'Chiffon Hijab',
    description: 'A dreamy chiffon hijab with a light drape for everyday modest wear.',
    features: ['Chiffon finish', 'Breathable', 'One size'],
    images: [img('hijab-b.jpg'), img('hijab-e.jpg')],
    category: categoryRef('cat-004'),
    company: companyRef(MOCK_COMPANIES[3]),
    offPercent: 15,
    discountStartsAt: null,
    discountEndsAt: '2026-11-20',
    variants: [
      variant('var-004-beige', { sku: 'HJB-CHF-BEI', options: [color('#C9A96E')], price: 25, stock: 20, images: [img('hijab-b.jpg')] }),
      variant('var-004-black', { sku: 'HJB-CHF-BLK', options: [color('#000000')], price: 25, stock: 14 }),
      variant('var-004-white', { sku: 'HJB-CHF-WHT', options: [color('#FFFFFF')], price: 27, stock: 8, images: [img('hijab-e.jpg')] }),
    ],
    reviewStatus: 'pending',
    createdAt: '2026-10-15T08:30:00.000Z',
  }),
  product({
    _id: 'prd-005',
    title: 'Jersey Hijab',
    description: 'A soft stretch jersey hijab that stays in place all day.',
    features: ['Stretch jersey', 'Opaque', 'No pins needed'],
    images: [img('hijab-d.jpg')],
    category: categoryRef('cat-004'),
    company: companyRef(MOCK_COMPANIES[0]),
    variants: [
      variant('var-005-black', { sku: 'HJB-JRS-BLK', options: [color('#000000')], price: 18, stock: 30 }),
      variant('var-005-beige', { sku: null, options: [color('#C9A96E')], price: 18, stock: 12 }),
    ],
    status: 'inactive',
    reviewStatus: 'rejected',
    reviewReason: 'Blurry photos',
    reviewedAt: '2026-10-12T09:00:00.000Z',
    createdAt: '2026-10-10T16:20:00.000Z',
    updatedAt: '2026-10-12T09:00:00.000Z',
  }),
  product({
    _id: 'prd-006',
    title: 'Kids Thobe',
    description: 'A crisp cotton thobe for boys, made for Jumuah and Eid.',
    features: ['100% cotton', 'Easy iron', 'Button front'],
    images: [img('mosque-interior.jpg')],
    category: categoryRef('cat-001'),
    company: companyRef(MOCK_COMPANIES[0]),
    variants: clothingVariants('THB', ['S', 'M'], ['#FFFFFF'], 35, () => 10),
    reviewStatus: 'pending',
    createdAt: '2026-10-18T10:10:00.000Z',
  }),
  product({
    _id: 'prd-007',
    title: 'Oud Attar',
    description: 'A rich, long-lasting oud attar blended with rose and amber.',
    features: ['Alcohol free', 'Long lasting', 'Gift box'],
    images: [img('attar-a.jpg'), img('attar-b.jpg')],
    category: categoryRef('cat-002'),
    company: companyRef(MOCK_COMPANIES[4]),
    offPercent: 25,
    discountStartsAt: '2026-10-15',
    discountEndsAt: '2026-10-28',
    variants: [
      variant('var-007-50', { sku: 'ATR-OUD-50', options: [volume('50')], price: 80, stock: 22, unit: 'ml', images: [img('attar-a.jpg')] }),
      variant('var-007-100', { sku: 'ATR-OUD-100', options: [volume('100')], price: 140, stock: 9, unit: 'ml', images: [img('attar-b.jpg')] }),
    ],
    soldCount: 276,
    favoriteCount: 95,
    rating: 4,
    totalReviews: 132,
    reviews: janamazReviews.slice(2),
    createdAt: '2026-09-28T09:00:00.000Z',
  }),
  product({
    _id: 'prd-008',
    title: 'White Musk Perfume',
    description: 'A clean, soft white musk for everyday wear.',
    features: ['Soft scent', 'Travel size available'],
    images: [img('attar-b.jpg')],
    category: categoryRef('cat-002'),
    company: companyRef(MOCK_COMPANIES[4]),
    variants: [
      variant('var-008-50', { sku: 'PRF-MSK-50', options: [volume('50')], price: 45, stock: 0, unit: 'ml' }),
      variant('var-008-100', { sku: 'PRF-MSK-100', options: [volume('100')], price: 75, stock: 0, unit: 'ml' }),
    ],
    status: 'inactive',
    soldCount: 154,
    favoriteCount: 40,
    rating: 4,
    totalReviews: 61,
    createdAt: '2026-09-02T08:30:00.000Z',
  }),
  product({
    _id: 'prd-009',
    title: 'Premium Basmati Rice',
    description: 'Aged long-grain basmati rice with a delicate aroma, perfect for kabsa and biryani.',
    features: ['Aged 2 years', 'Extra long grain', 'Resealable bag'],
    images: [img('gift-1.jpg')],
    category: categoryRef('cat-003'),
    company: companyRef(MOCK_COMPANIES[0]),
    offPercent: 5,
    discountStartsAt: '2026-10-01',
    discountEndsAt: '2026-12-31',
    variants: [variant('var-009-5kg', { sku: 'RCE-BSM-5', price: 18.5, stock: 120, amount: 5, unit: 'kg' })],
    soldCount: 830,
    favoriteCount: 64,
    rating: 5,
    totalReviews: 96,
    createdAt: '2026-09-08T16:20:00.000Z',
  }),
  product({
    _id: 'prd-010',
    title: 'Sella Rice',
    description: 'Golden parboiled sella rice that stays fluffy and separate.',
    features: ['Parboiled', 'Non-sticky'],
    images: [img('lantern-b.jpg')],
    category: categoryRef('cat-003'),
    company: companyRef(MOCK_COMPANIES[2]),
    variants: [variant('var-010-10kg', { sku: null, price: 32, stock: 40, amount: 10, unit: 'kg' })],
    reviewStatus: 'pending',
    createdAt: '2026-10-19T12:25:00.000Z',
  }),
  product({
    _id: 'prd-011',
    title: 'Eid Gift Hamper',
    description: 'Islamic gifts chosen with heart for Eid gatherings.',
    features: ['Ready to gift', 'Mixed keepsakes', 'Premium wrap'],
    images: [img('lantern-a.jpg'), img('gift-1.jpg'), img('mosque-night.jpg')],
    category: categoryRef('cat-006'),
    company: companyRef(MOCK_COMPANIES[4]),
    variants: [variant('var-011-set', { sku: 'GFT-EID-01', price: 180, stock: 6, amount: 1, unit: 'set' })],
    status: 'inactive',
    reviewStatus: 'rejected',
    reviewReason: 'Description does not match the items shown in the photos',
    reviewedAt: '2026-10-05T14:00:00.000Z',
    createdAt: '2026-10-02T12:25:00.000Z',
    updatedAt: '2026-10-05T14:00:00.000Z',
  }),
  product({
    _id: 'prd-012',
    title: 'Home Mihrab Decor',
    description: 'A calm home accent inspired by traditional mihrab detailing.',
    features: ['Wall ready', 'Warm lighting', 'Statement piece'],
    images: [img('mihrab-a.jpg'), img('mosque-interior.jpg'), img('nabawi.jpg')],
    category: categoryRef('cat-007'),
    company: companyRef(MOCK_COMPANIES[0]),
    variants: [variant('var-012-one', { sku: 'DCR-MHR-01', price: 260, stock: 22, amount: null, unit: 'piece' })],
    soldCount: 54,
    favoriteCount: 18,
    rating: 5,
    totalReviews: 40,
    reviews: janamazReviews.slice(0, 1),
    createdAt: '2026-10-08T15:50:00.000Z',
  }),
];

// ----------------------------------------------------------------------

export const findMockProduct = (id) => MOCK_PRODUCTS.find((row) => row._id === id) || null;

// Full store record (rating, seller contact) for a product's `company: { _id: sellerId }`.
export const getProductStore = (row) => MOCK_COMPANIES.find((company) => company.seller?._id === row?.company?._id) || null;

export const getApprovedCompanies = () =>
  MOCK_COMPANIES.filter((company) => MOCK_USERS.find((user) => user._id === company.seller?._id)?.status === 'active');

export function updateMockCompany(id, patch) {
  const company = MOCK_COMPANIES.find((row) => row._id === id);
  if (!company) return null;
  Object.assign(company, patch);

  MOCK_PRODUCTS.forEach((row) => {
    if (row.company?._id === company.seller?._id) {
      row.company = companyRef(company);
    }
  });

  return company;
}

export function upsertMockProduct(data) {
  const now = new Date().toISOString();

  if (data._id) {
    const index = MOCK_PRODUCTS.findIndex((row) => row._id === data._id);
    if (index !== -1) {
      MOCK_PRODUCTS[index] = summarizeProduct({ ...MOCK_PRODUCTS[index], ...data, updatedAt: now });
      return MOCK_PRODUCTS[index];
    }
  }

  const created = summarizeProduct({
    rating: 0,
    totalReviews: 0,
    favoriteCount: 0,
    soldCount: 0,
    reviews: [],
    status: 'active',
    reviewStatus: 'pending',
    reviewReason: null,
    reviewedAt: null,
    ...data,
    _id: `prd-${Date.now()}`,
    createdAt: now,
    updatedAt: now,
  });

  MOCK_PRODUCTS.unshift(created);
  return created;
}

export function reviewMockProduct(id, reviewStatus, reviewReason = null) {
  const row = findMockProduct(id);
  if (!row) return null;

  const now = new Date().toISOString();
  Object.assign(row, {
    reviewStatus,
    reviewReason: reviewStatus === 'rejected' ? reviewReason : null,
    reviewedAt: now,
    updatedAt: now,
  });

  return row;
}

export function deleteMockProduct(id) {
  const index = MOCK_PRODUCTS.findIndex((row) => row._id === id);
  if (index !== -1) {
    MOCK_PRODUCTS.splice(index, 1);
  }
}

export const getPrimaryImage = (row) => row?.images?.[0] || '';
