const STORAGE_KEY = 'taibah-signup-session';

export const SIGNUP_STAGE = {
  VERIFY: 'verify',
  ONBOARDING: 'onboarding',
};

export const MOCK_OTP_CODE = '123456';

const normalizeEmail = (email = '') => String(email).trim().toLowerCase();

export function getSignupSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveSignupSession(session) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  return session;
}

export function clearSignupSession() {
  localStorage.removeItem(STORAGE_KEY);
}

export function patchSignupSession(partial) {
  const current = getSignupSession();
  if (!current) return null;

  const next = {
    ...current,
    ...partial,
    onboarding: {
      ...(current.onboarding || {}),
      ...(partial.onboarding || {}),
    },
  };

  return saveSignupSession(next);
}

export function startEmailSignup({ firstName, lastName, email, password }) {
  return saveSignupSession({
    stage: SIGNUP_STAGE.VERIFY,
    provider: 'email',
    firstName: String(firstName).trim(),
    lastName: String(lastName).trim(),
    email: normalizeEmail(email),
    password,
    emailVerified: false,
    onboarding: {},
    createdAt: new Date().toISOString(),
  });
}

export function startGoogleSignup({ firstName, lastName, email }) {
  return saveSignupSession({
    stage: SIGNUP_STAGE.ONBOARDING,
    provider: 'google',
    firstName: String(firstName).trim(),
    lastName: String(lastName).trim(),
    email: normalizeEmail(email),
    password: null,
    emailVerified: true,
    onboarding: {},
    createdAt: new Date().toISOString(),
  });
}

export function verifySignupOtp(code) {
  const session = getSignupSession();

  if (!session) {
    throw new Error('Your signup session expired. Please sign up again.');
  }

  if (session.stage !== SIGNUP_STAGE.VERIFY) {
    return session;
  }

  return saveSignupSession({
    ...session,
    emailVerified: true,
    stage: SIGNUP_STAGE.ONBOARDING,
  });
}

export function findPendingSignup(email) {
  const session = getSignupSession();
  if (!session) return null;
  return session.email === normalizeEmail(email) ? session : null;
}
