import { MOCK_CATEGORIES } from 'src/sections/_active/categories-view/mock/categories';
import { MOCK_PRODUCTS } from 'src/sections/_active/products-view/mock/products';

// ----------------------------------------------------------------------
// Kept apart from options.js so categories/products can import options without a cycle.

const productOptionEntries = (optionId) =>
  MOCK_PRODUCTS.flatMap((product) => (product.variants || []).flatMap((variant) => variant.options || [])).filter((entry) => entry.attribute?._id === optionId);

export const getUsedOptionValues = (optionId) => new Set(productOptionEntries(optionId).map((entry) => entry.value));

export const isOptionInUse = (optionId) =>
  MOCK_CATEGORIES.some((category) => (category.attributes || []).some((attribute) => attribute._id === optionId)) || productOptionEntries(optionId).length > 0;

// Labels may change after products use a value; keep the copies on variants in sync.
export function syncOptionOnProducts(option) {
  const labels = new Map(option.values.map((item) => [item.value, item.label]));

  productOptionEntries(option._id).forEach((entry) => {
    entry.attribute = { _id: option._id, name: option.name, type: option.type };
    if (labels.has(entry.value)) {
      entry.label = labels.get(entry.value);
    }
  });
}
