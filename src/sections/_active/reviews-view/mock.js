import { getPrimaryImage, MOCK_PRODUCTS } from 'src/sections/_active/products-view/mock';

export function getSellerReviews(sellerId) {
  return MOCK_PRODUCTS.filter((product) => product.company?._id === sellerId).flatMap((product) =>
    (product.reviews || []).map((review) => ({
      ...review,
      productId: product._id,
      productTitle: product.title,
      productImage: getPrimaryImage(product),
    }))
  );
}
