// Abstract avatar system - 8 unique avatars
// Each user ID will consistently map to the same avatar

// Avatar definitions (paths to avatar images)
export const AVATARS = [
  '/avatars/avatar-1-pink-face.png',    // 粉色方脸
  '/avatars/avatar-2-green-round.png',  // 绿色圆脸
  '/avatars/avatar-3-orange-blob.png',  // 橙色斜脸
  '/avatars/avatar-4-blue-worm.png',    // 蓝色虫子
  '/avatars/avatar-5-blue-spiky.png',   // 蓝色尖头
  '/avatars/avatar-6-coral-star.png',   // 珊瑚色星星
  '/avatars/avatar-7-pink-flower.png',  // 粉色花朵
  '/avatars/avatar-8-yellow-pear.png',  // 黄色梨形
] as const;

// Simple hash function to convert string to number
const hashString = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
};

/**
 * Get a consistent avatar for a user ID
 * The same userId will always return the same avatar
 */
export const getAvatarForUser = (userId: string): string => {
  const index = hashString(userId) % AVATARS.length;
  return AVATARS[index];
};

/**
 * Get avatar by index (0-7)
 */
export const getAvatarByIndex = (index: number): string => {
  return AVATARS[index % AVATARS.length];
};

/**
 * Get all available avatars (for avatar picker UI)
 */
export const getAllAvatars = (): readonly string[] => {
  return AVATARS;
};
