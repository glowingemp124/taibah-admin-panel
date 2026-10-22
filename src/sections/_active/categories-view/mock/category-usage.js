import { MOCK_PRODUCTS } from 'src/sections/_active/products-view/mock/products';

// ----------------------------------------------------------------------

export const categoryHasProducts = (categoryId) => MOCK_PRODUCTS.some((product) => product.category?._id === categoryId);

export const countCategoryProducts = (categoryId) => MOCK_PRODUCTS.filter((product) => product.category?._id === categoryId).length;

export function syncCategoryOnProducts(category) {
  MOCK_PRODUCTS.forEach((product) => {
    if (product.category?._id === category._id) {
      product.category = { _id: category._id, title: category.title, unit: category.unit };
    }
  });
}
