
// Avatar mapping for consistent avatar generation
const avatarSeedMap: Record<string, string> = {
  'avatar-1': 'josh',
  'avatar-2': 'sandy',
  'avatar-3': 'priya',
  'avatar-4': 'hauwa',
  'avatar-5': 'happy',
  'avatar-6': 'samuel',
};

export const getAvatarSeed = (avatarId: string): string => {
  return avatarSeedMap[avatarId] || 'priya'; // Default to 'priya' if avatarId is not found
};

export const generateAvatarUrl = (avatarId: string): string => {
  const seed = getAvatarSeed(avatarId);
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;
};
