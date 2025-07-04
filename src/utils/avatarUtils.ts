
export const getAvatarSeed = (avatarId: string): string => {
  return avatarId;
};

export const generateAvatarUrl = (avatarId: string): string => {
  const seed = getAvatarSeed(avatarId);
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;
};
