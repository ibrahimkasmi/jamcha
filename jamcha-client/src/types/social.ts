export const SocialProvider = {
  FACEBOOK: 'FACEBOOK',
  INSTAGRAM: 'INSTAGRAM',
  LINKEDIN: 'LINKEDIN',
  X: 'X',
  YOUTUBE: 'YOUTUBE',
} as const;

export type SocialProvider = typeof SocialProvider[keyof typeof SocialProvider];

export interface SocialMediaLink {
  id: number;
  socialProvider: SocialProvider;
  url: string;
}
