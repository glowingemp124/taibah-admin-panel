import dayjs from 'dayjs';
import { isValidPhoneNumber } from 'react-phone-number-input/input';
import { z as zod } from 'zod';

const NAME_RE = /^[A-Za-z][A-Za-z\s'-]{0,49}$/;
const STORE_RE = /^[A-Za-z0-9][A-Za-z0-9\s&.,'-]{1,59}$/;
const PASSWORD_RE = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
const ID_NUMBER_RE = /^[A-Za-z0-9][A-Za-z0-9\s-]{4,29}$/;
const POSTAL_RE = /^[A-Za-z0-9][A-Za-z0-9\s-]{1,11}$/;
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf'];

const required = (message) => zod.string().min(1, { message });

const isFilled = (value) => {
  if (value instanceof File) return true;
  if (value && typeof value === 'object' && value.name) return true;
  if (value == null) return false;
  return String(value).trim().length > 0;
};

const asText = (value) => String(value || '').trim();

const isValidDate = (value) => {
  if (!value) return false;
  const date = dayjs(value);
  return date.isValid();
};

const validateFile = (value, emptyMessage) => {
  if (!isFilled(value)) return emptyMessage;
  if (!(value instanceof File)) return null;

  if (value.size > MAX_FILE_SIZE) return 'File must be 5 MB or smaller.';
  if (value.type && !ALLOWED_FILE_TYPES.includes(value.type) && !value.type.startsWith('image/')) {
    return 'Upload a JPG, PNG, WEBP, or PDF file.';
  }
  return null;
};

export const SellerSignUpSchema = zod
  .object({
    applicantType: zod.literal('individual'),
    firstName: required('First name is required!'),
    lastName: required('Last name is required!'),
    email: required('Email is required!').email({ message: 'Email must be a valid email address!' }),
    phone: required('Phone number is required!'),
    password: required('Password is required!'),
    confirmPassword: required('Please confirm your password!'),
    storeName: required('Store name is required!'),
    storeDescription: zod.string().optional().or(zod.literal('')),
    dateOfBirth: zod.any().nullable().optional(),
    placeOfBirth: zod.string().optional().or(zod.literal('')),
    residentialStreet: zod.string().optional().or(zod.literal('')),
    residentialCity: zod.string().optional().or(zod.literal('')),
    residentialState: zod.string().optional().or(zod.literal('')),
    residentialPostal: zod.string().optional().or(zod.literal('')),
    residentialCountry: zod.any().nullable().optional(),
    idType: zod.string().optional().or(zod.literal('')),
    idNumber: zod.string().optional().or(zod.literal('')),
    idExpiry: zod.any().nullable().optional(),
    identityDocument: zod.any().nullable().optional(),
    proofOfAddress: zod.any().nullable().optional(),
    termsAccepted: zod.boolean().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match!',
  });

const STEP_FIELDS = [
  ['firstName', 'lastName', 'email', 'phone', 'password', 'confirmPassword', 'storeName', 'storeDescription'],
  [
    'dateOfBirth',
    'placeOfBirth',
    'residentialStreet',
    'residentialCity',
    'residentialState',
    'residentialPostal',
    'residentialCountry',
    'idType',
    'idNumber',
    'idExpiry',
  ],
  ['identityDocument', 'proofOfAddress'],
  ['termsAccepted'],
];

const FIELD_VALIDATORS = {
  firstName: (value) => {
    const text = asText(value);
    if (!text) return 'First name is required!';
    if (text.length < 2) return 'First name must be at least 2 characters.';
    if (!NAME_RE.test(text)) return 'Enter a valid first name.';
    return null;
  },
  lastName: (value) => {
    const text = asText(value);
    if (!text) return 'Last name is required!';
    if (text.length < 2) return 'Last name must be at least 2 characters.';
    if (!NAME_RE.test(text)) return 'Enter a valid last name.';
    return null;
  },
  email: (value) => {
    const text = asText(value).toLowerCase();
    if (!text) return 'Email is required!';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)) return 'Enter a valid email address.';
    return null;
  },
  phone: (value) => {
    const text = asText(value);
    if (!text) return 'Phone number is required!';
    if (!isValidPhoneNumber(text)) return 'Enter a valid phone number.';
    return null;
  },
  password: (value) => {
    const text = asText(value);
    if (!text) return 'Password is required!';
    if (!PASSWORD_RE.test(text)) {
      return 'Use 8+ characters with a letter, a number, and a symbol.';
    }
    return null;
  },
  confirmPassword: (value, values) => {
    const text = asText(value);
    if (!text) return 'Please confirm your password!';
    if (text !== values.password) return 'Passwords do not match!';
    return null;
  },
  storeName: (value) => {
    const text = asText(value);
    if (!text) return 'Store name is required!';
    if (text.length < 2) return 'Store name must be at least 2 characters.';
    if (!STORE_RE.test(text)) return 'Enter a valid store name.';
    return null;
  },
  storeDescription: (value) => {
    const text = asText(value);
    if (text.length > 500) return 'Store description must be 500 characters or less.';
    return null;
  },
  dateOfBirth: (value) => {
    if (!isValidDate(value)) return 'Date of birth is required!';
    const dob = dayjs(value);
    if (dob.isAfter(dayjs(), 'day')) return 'Date of birth cannot be in the future.';
    if (dayjs().diff(dob, 'year') < 18) return 'You must be at least 18 years old.';
    if (dayjs().diff(dob, 'year') > 100) return 'Enter a valid date of birth.';
    return null;
  },
  placeOfBirth: (value) => {
    const text = asText(value);
    if (!text) return 'Place of birth is required!';
    if (text.length < 2) return 'Enter a valid place of birth.';
    return null;
  },
  residentialStreet: (value) => {
    const text = asText(value);
    if (!text) return 'Residential address is required!';
    if (text.length < 5) return 'Enter a complete street address.';
    return null;
  },
  residentialCity: (value) => {
    const text = asText(value);
    if (!text) return 'City is required!';
    if (text.length < 2) return 'Enter a valid city.';
    return null;
  },
  residentialState: (value) => {
    const text = asText(value);
    if (text && text.length < 2) return 'Enter a valid state or region.';
    return null;
  },
  residentialPostal: (value) => {
    const text = asText(value);
    if (!text) return 'Postal code is required!';
    if (!POSTAL_RE.test(text)) return 'Enter a valid postal code.';
    return null;
  },
  residentialCountry: (value) => {
    if (!isFilled(value)) return 'Country is required!';
    return null;
  },
  idType: (value) => {
    if (!isFilled(value)) return 'ID type is required!';
    return null;
  },
  idNumber: (value) => {
    const text = asText(value);
    if (!text) return 'ID number is required!';
    if (!ID_NUMBER_RE.test(text)) return 'Enter a valid ID number.';
    return null;
  },
  idExpiry: (value) => {
    if (!isValidDate(value)) return 'ID expiration date is required!';
    if (dayjs(value).isBefore(dayjs(), 'day')) return 'This ID has expired. Use a valid document.';
    return null;
  },
  identityDocument: (value) => validateFile(value, 'Identity document is required!'),
  proofOfAddress: (value) => validateFile(value, 'Proof of address is required!'),
  termsAccepted: (value) => (value === true ? null : 'You must agree to the terms!'),
};

export function getFieldError(field, values) {
  return FIELD_VALIDATORS[field]?.(values[field], values) || null;
}

export function getStepErrors(step, values) {
  return (STEP_FIELDS[step] || [])
    .map((field) => {
      const message = getFieldError(field, values);
      return message ? { field, message } : null;
    })
    .filter(Boolean);
}

export const SELLER_SIGNUP_DEFAULTS = {
  applicantType: 'individual',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  storeName: '',
  storeDescription: '',
  dateOfBirth: null,
  placeOfBirth: '',
  residentialStreet: '',
  residentialCity: '',
  residentialState: '',
  residentialPostal: '',
  residentialCountry: null,
  idType: '',
  idNumber: '',
  idExpiry: null,
  identityDocument: null,
  proofOfAddress: null,
  termsAccepted: false,
};
