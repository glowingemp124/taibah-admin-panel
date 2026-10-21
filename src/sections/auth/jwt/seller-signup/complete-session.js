import { PERMISSION_SELLER } from 'src/hooks/use-app-role';
import { MOCK_COMPANIES } from 'src/sections/_active/products-view/mock';

const SELLER_COMPANY = MOCK_COMPANIES.find((row) => row.seller?._id === 'usr-002');

export function buildSellerAuthUser(profile) {
  return {
    basicInfo: {
      _id: profile.userId || 'usr-002',
      profileIcon: 'https://dummybucket.s3.us-east-1.amazonaws.com/noimage.png',
      name: `${profile.firstName || ''} ${profile.lastName || ''}`.trim(),
      email: profile.email,
      phoneNumber: profile.phone,
      language: 'en',
    },
    accountState: {
      userType: 'seller',
      status: 'active',
      verificationStatus: {
        email: 'verified',
        phoneNumber: 'pending',
      },
    },
    metadata: {
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      createdAt: profile.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    token: 'mock-token',
    permission: PERMISSION_SELLER,
    sellerId: profile.userId || 'usr-002',
    companyId: SELLER_COMPANY?._id || 'co-001',
    sellerProfile: profile,
  };
}
