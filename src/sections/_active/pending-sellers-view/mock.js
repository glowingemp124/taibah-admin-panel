import { getSellerProfiles, saveSellerProfile } from 'src/sections/auth/jwt/seller-signup/storage';

export const MOCK_PENDING_SELLERS = [
  {
    userId: 'pending-001',
    applicantType: 'individual',
    firstName: 'Layla',
    lastName: 'Kareem',
    email: 'layla.kareem@email.com',
    phone: '+966 55 610 4488',
    storeName: 'Noor Atelier',
    storeDescription: 'Handmade prayer mats and modest home textiles.',
    dateOfBirth: '1994-06-21',
    placeOfBirth: 'Jeddah',
    residentialStreet: 'Prince Sultan Street',
    residentialCity: 'Jeddah',
    residentialState: 'Makkah',
    residentialPostal: '23432',
    residentialCountry: 'Saudi Arabia',
    idType: 'passport',
    idNumber: 'P-4419022',
    idExpiry: '2028-11-04',
    identityDocument: { name: 'layla-passport.pdf' },
    proofOfAddress: { name: 'layla-utility.pdf' },
    verificationStatus: 'pending',
    status: 'inactive',
    provider: 'email',
    createdAt: '2026-10-12T09:20:00.000Z',
    updatedAt: '2026-10-12T09:20:00.000Z',
  },
  {
    userId: 'pending-002',
    applicantType: 'individual',
    firstName: 'Hassan',
    lastName: 'Nadim',
    email: 'hassan.nadim@email.com',
    phone: '+966 54 772 1090',
    storeName: 'Al-Hikma Books',
    storeDescription: 'Islamic books, Qurans, and study accessories.',
    dateOfBirth: '1988-01-09',
    placeOfBirth: 'Riyadh',
    residentialStreet: 'Olaya Road',
    residentialCity: 'Riyadh',
    residentialState: 'Riyadh',
    residentialPostal: '12211',
    residentialCountry: 'Saudi Arabia',
    idType: 'drivers_license',
    idNumber: 'DL-883120',
    idExpiry: '2027-03-18',
    identityDocument: { name: 'hassan-license.jpg' },
    proofOfAddress: { name: 'hassan-bank-letter.pdf' },
    verificationStatus: 'pending',
    status: 'inactive',
    provider: 'google',
    createdAt: '2026-10-16T14:40:00.000Z',
    updatedAt: '2026-10-16T14:40:00.000Z',
  },
  {
    userId: 'pending-003',
    applicantType: 'individual',
    firstName: 'Maryam',
    lastName: 'Zahra',
    email: 'maryam.zahra@email.com',
    phone: '+966 56 901 3344',
    storeName: 'Zahra Scents',
    storeDescription: 'Bakhoor, attar, and gift sets for the home.',
    dateOfBirth: '1996-09-02',
    placeOfBirth: 'Madinah',
    residentialStreet: 'Quba Road',
    residentialCity: 'Madinah',
    residentialState: 'Al Madinah',
    residentialPostal: '42317',
    residentialCountry: 'Saudi Arabia',
    idType: 'passport',
    idNumber: 'P-2291884',
    idExpiry: '2030-01-22',
    identityDocument: { name: 'maryam-passport.pdf' },
    proofOfAddress: { name: 'maryam-address.pdf' },
    verificationStatus: 'rejected',
    status: 'inactive',
    provider: 'email',
    createdAt: '2026-09-28T11:05:00.000Z',
    updatedAt: '2026-10-02T08:15:00.000Z',
  },
];

function normalizeEmail(email = '') {
  return String(email).trim().toLowerCase();
}

export function getSellerApplications() {
  const saved = getSellerProfiles();
  const byEmail = new Map();

  MOCK_PENDING_SELLERS.forEach((row) => {
    byEmail.set(normalizeEmail(row.email), row);
  });

  saved.forEach((row) => {
    if (row?.email) {
      byEmail.set(normalizeEmail(row.email), row);
    }
  });

  return Array.from(byEmail.values())
    .filter((row) => {
      const status = row.verificationStatus || 'pending';
      return status === 'pending' || status === 'rejected';
    })
    .sort((a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0));
}

export function reviewSellerApplication(application, verificationStatus) {
  return saveSellerProfile({
    ...application,
    verificationStatus,
    status: verificationStatus === 'verified' ? 'active' : 'inactive',
    updatedAt: new Date().toISOString(),
  });
}
