import { findSellerProfile, getDefaultSellerProfile, getSellerProfiles } from 'src/sections/auth/jwt/seller-signup/storage';

export function resolveSellerProfile(user, company) {
  if (!user) return null;

  const savedByEmail = user.email ? findSellerProfile(user.email) : null;
  const savedById = getSellerProfiles().find((row) => row.userId === user._id);
  const defaultProfile = user._id === 'usr-002' ? getDefaultSellerProfile() : null;
  const base = savedByEmail || savedById || defaultProfile || {};
  const [firstName, ...rest] = String(user.name || '').split(' ');

  return {
    userId: user._id,
    applicantType: 'individual',
    firstName: base.firstName || firstName || '',
    lastName: base.lastName || rest.join(' ') || '',
    email: user.email || base.email || '',
    phone: base.phone || user.phone || '',
    photoURL: base.photoURL || user.avatarUrl || null,
    storeName: base.storeName || company?.name || '',
    storeDescription: base.storeDescription || company?.description || '',
    storeImage: base.storeImage || company?.logo || null,
    dateOfBirth: base.dateOfBirth || null,
    placeOfBirth: base.placeOfBirth || '',
    residentialStreet: base.residentialStreet || '',
    residentialCity: base.residentialCity || '',
    residentialState: base.residentialState || '',
    residentialPostal: base.residentialPostal || '',
    residentialCountry: base.residentialCountry || null,
    idType: base.idType || '',
    idNumber: base.idNumber || '',
    idExpiry: base.idExpiry || null,
    identityDocument: base.identityDocument || null,
    proofOfAddress: base.proofOfAddress || null,
    verificationStatus: base.verificationStatus || (user.status === 'active' ? 'verified' : 'pending'),
    featured: !!company?.featured,
    status: user.status || 'active',
    favoriteCount: user.favoriteCount ?? 0,
  };
}
