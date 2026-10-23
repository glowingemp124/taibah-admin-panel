
export const toCustomerCard = (user) => {
  if (!user) return null;

  const userType = user.userType ?? user.roles ?? [];

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    status: user.status,
    profileIcon: user.profileIcon ?? user.avatarUrl ?? null,
    phoneNumber: user.phoneNumber ?? user.phone ?? null,
    // The API sends one of buyer / seller; the mock keeps a roles array.
    userType: Array.isArray(userType) ? userType : [userType],
    joinedAt: user.joinedAt ?? user.createdAt ?? null,
    favoriteCount: user.favoriteCount ?? 0,
    favoriteStoreCount: user.favoriteStoreCount ?? 0,
  };
};
