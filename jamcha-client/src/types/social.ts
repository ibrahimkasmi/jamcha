export enum SocialProvider {
  FACEBOOK = "FACEBOOK",
  INSTAGRAM = "INSTAGRAM",
  LINKEDIN = "LINKEDIN",
  X = "X",
  YOUTUBE = "YOUTUBE",
}

export interface SocialMediaLink {
  id: number;
  socialProvider: SocialProvider;
  url: string;
}
