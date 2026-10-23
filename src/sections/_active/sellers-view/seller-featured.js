import { isApprovedStatus } from 'src/utils/seller-status';

import { MOCK_COMPANIES, setSellerFeatured } from 'src/sections/_active/products-view/mock';



export const isSellerApproved = (profile) => isApprovedStatus(profile?.verificationStatus);

export async function updateSellerFeatured(sellerId, profile, featured) {
  await new Promise((resolve) => setTimeout(resolve, 300));

  if (featured && !isSellerApproved(profile)) {
    const error = new Error('Only approved sellers can be featured');
    error.status = 409;
    throw error;
  }

  setSellerFeatured(sellerId, featured);
  return { featured };
}


export function unfeatureUnlessApproved({ sellerId, email }, verificationStatus) {
  if (isApprovedStatus(verificationStatus)) return;

  const company = MOCK_COMPANIES.find(
    (row) => (sellerId && row.seller?._id === sellerId) || (email && row.seller?.email?.toLowerCase() === String(email).toLowerCase())
  );

  if (company?.seller?._id) {
    setSellerFeatured(company.seller._id, false);
  }
}
