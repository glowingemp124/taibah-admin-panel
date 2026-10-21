export const MOCK_GOOGLE_PROFILE = {
  email: 'amina.hassan@gmail.com',
  firstName: 'Amina',
  lastName: 'Hassan',
};

export async function mockGoogleAuth() {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return MOCK_GOOGLE_PROFILE;
}
