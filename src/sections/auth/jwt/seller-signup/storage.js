const STORAGE_KEY = 'taibah-seller-profiles';

const serializeFile = (file) => {
  if (!file) return null;
  if (typeof file === 'string') return { name: file, preview: file };
  if (file.name) {
    return {
      name: file.name,
      size: file.size,
      type: file.type,
      preview: file.preview || (file instanceof File ? URL.createObjectURL(file) : ''),
    };
  }
  return file;
};

export const serializeSellerProfile = (data) => {
  const { confirmPassword, ...rest } = data;

  return {
    ...rest,
    photoURL: serializeFile(data.photoURL) || data.photoURL,
    storeImage: serializeFile(data.storeImage) || data.storeImage,
    identityDocument: serializeFile(data.identityDocument),
    proofOfAddress: serializeFile(data.proofOfAddress),
    verificationStatus: data.verificationStatus || 'pending',
    updatedAt: new Date().toISOString(),
  };
};

export function getSellerProfiles() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function findSellerProfile(email) {
  if (!email) return null;
  return getSellerProfiles().find((row) => row.email?.toLowerCase() === email.toLowerCase()) || null;
}

export function saveSellerProfile(profile) {
  const serialized = serializeSellerProfile(profile);
  const list = getSellerProfiles().filter((row) => row.email?.toLowerCase() !== serialized.email?.toLowerCase());
  list.push(serialized);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  return serialized;
}

export function getDefaultSellerProfile() {
  return (
    findSellerProfile('user@taibah.com') || {
      applicantType: 'individual',
      firstName: 'Omar',
      lastName: 'Al-Farsi',
      email: 'user@taibah.com',
      phone: '+966 55 221 7788',
      storeName: 'Al-Qabas Company',
      storeDescription: 'A clean, elegant Islamic storefront with curated prayer and home pieces.',
      dateOfBirth: '1992-04-18',
      placeOfBirth: 'Madinah',
      residentialStreet: 'King Fahd Road',
      residentialCity: 'Madinah',
      residentialState: 'Al Madinah',
      residentialPostal: '42311',
      residentialCountry: 'Saudi Arabia',
      idType: 'passport',
      idNumber: 'P-8829104',
      idExpiry: '2029-08-12',
      identityDocument: { name: 'passport.pdf' },
      proofOfAddress: { name: 'utility-bill.pdf' },
      verificationStatus: 'verified',
      password: 'PassWord@2',
    }
  );
}

export function authenticateSeller({ email, password }) {
  const saved = findSellerProfile(email);

  if (saved) {
    if (saved.provider === 'google') {
      throw new Error('This account uses Google. Continue with Google to sign in.');
    }
    if (saved.password && saved.password !== password) {
      throw new Error('Invalid email or password');
    }
    return saved;
  }

  if (String(email).trim().toLowerCase() === 'user@taibah.com') {
    if (password !== 'PassWord@2') {
      throw new Error('Invalid email or password');
    }
    return getDefaultSellerProfile();
  }

  throw new Error('Invalid email or password');
}

export function formatCountry(value) {
  if (!value) return '—';
  if (typeof value === 'string') return value;
  return value.label || value.code || '—';
}

export function formatFileName(value) {
  if (!value) return 'Not uploaded';
  if (typeof value === 'string') return value;
  return value.name || 'Uploaded file';
}
