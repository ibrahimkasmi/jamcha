export const SocialProvider = {
  FACEBOOK: "facebook",
  INSTAGRAM: "instagram",
  LINKEDIN: "linkedin",
  X: "x",
  YOUTUBE: "youtube",
} as const;

export type SocialProvider = (typeof SocialProvider)[keyof typeof SocialProvider];

export interface SocialMediaLink {
  id: number;
  socialProvider: SocialProvider;
  url: string;
}
