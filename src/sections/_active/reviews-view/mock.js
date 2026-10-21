import { MOCK_PRODUCTS } from 'src/sections/_active/products-view/mock';

export function getSellerReviews(sellerId) {
  return MOCK_PRODUCTS.filter((product) => product.company?.seller?._id === sellerId).flatMap((product) =>
    (product.reviews || []).map((review) => ({
      ...review,
      productId: product._id,
      productTitle: product.title,
      productImage: product.images?.[product.primaryIndex ?? 0] || product.images?.[0] || '',
    }))
  );
}
