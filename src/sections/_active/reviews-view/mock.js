import { useMemo } from 'react';

import { _mock } from 'src/_mock';

import { getPrimaryImage, MOCK_PRODUCTS } from 'src/sections/_active/products-view/mock';
import { getVariantLabel } from 'src/sections/_active/products-view/product-utils';


const STORE_REVIEWS = [
  { _id: 'srev-001', sellerId: 'usr-002', name: 'Fatima Noor', stars: 5, comment: 'Lovely packaging and very quick to reply to my questions.', createdAt: '2026-10-12T09:30:00.000Z' },
  { _id: 'srev-002', sellerId: 'usr-002', name: 'Yusuf Rahman', stars: 4, comment: 'Good store, delivery took a day longer than promised.', createdAt: '2026-09-28T14:10:00.000Z' },
  { _id: 'srev-003', sellerId: 'usr-002', name: 'Maryam Saleh', stars: 3, comment: 'Products are nice but one item arrived with a creased box.', createdAt: '2026-09-02T11:45:00.000Z' },
  { _id: 'srev-004', sellerId: 'usr-011', name: 'Omar Khalid', stars: 5, comment: 'The attar samples they added were a beautiful touch.', createdAt: '2026-10-05T08:20:00.000Z' },
  { _id: 'srev-005', sellerId: 'usr-003', name: 'Sara Ahmed', stars: 2, comment: 'Sizing guide was unclear and the exchange took a while.', createdAt: '2026-10-01T16:00:00.000Z' },
];

const productReviews = (sellerId) =>
  MOCK_PRODUCTS.filter((product) => product.company?._id === sellerId).flatMap((product) =>
    (product.reviews || []).map((review, index) => {
      const variant = product.variants?.[index % (product.variants?.length || 1)];
      return {
        _id: `${product._id}-${review._id}`,
        type: 'product',
        name: review.name,
        avatarUrl: review.avatarUrl,
        stars: Math.round(review.rating || 0),
        comment: review.comment,
        variant: variant ? getVariantLabel(variant) : null,
        product: { _id: product._id, title: product.title, image: getPrimaryImage(product) },
        createdAt: review.createdAt,
      };
    })
  );

const storeReviews = (sellerId) =>
  STORE_REVIEWS.filter((review) => review.sellerId === sellerId).map((review, index) => ({
    _id: review._id,
    type: 'store',
    name: review.name,
    avatarUrl: _mock.image.avatar(10 + index),
    stars: review.stars,
    comment: review.comment,
    variant: null,
    product: null,
    createdAt: review.createdAt,
  }));

export const getSellerReviews = (sellerId) => [...productReviews(sellerId), ...storeReviews(sellerId)].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

export const summarizeReviews = (rows) => {
  const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  rows.forEach((row) => {
    breakdown[row.stars] = (breakdown[row.stars] || 0) + 1;
  });
  const total = rows.length;
  const average = total ? Math.round((rows.reduce((sum, row) => sum + row.stars, 0) / total) * 10) / 10 : 0;
  return { average, total, breakdown };
};

export function useGetMockReviewsQuery(params = {}) {
  const { sellerId, search = '', type = '', productId = '', stars = '', page = 0, limit = 10 } = params;

  return useMemo(() => {
    const all = sellerId ? getSellerReviews(sellerId) : [];
    let rows = all;

    if (type && type !== 'all') rows = rows.filter((row) => row.type === type);
    if (productId && productId !== 'all') rows = rows.filter((row) => row.product?._id === productId);
    if (stars && stars !== 'all') rows = rows.filter((row) => row.stars === Number(stars));

    if (search) {
      const query = search.toLowerCase();
      rows = rows.filter((row) => row.name?.toLowerCase().includes(query) || row.comment?.toLowerCase().includes(query) || row.product?.title?.toLowerCase().includes(query));
    }

    const start = page * limit;

    return {
      data: {
        data: rows.slice(start, start + limit),
        total_length: rows.length,
        meta: {
          totalRecords: rows.length,
          summary: summarizeReviews(all),
        },
      },
      isLoading: false,
      isFetching: false,
      error: undefined,
      refetch: () => {},
    };
  }, [sellerId, search, type, productId, stars, page, limit]);
}
