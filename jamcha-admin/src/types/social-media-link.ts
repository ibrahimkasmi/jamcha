export enum SocialProvider {
  FACEBOOK = "FACEBOOK",
  INSTAGRAM = "INSTAGRAM",
  LINKEDIN = "LINKEDIN",
  X = "X",
  YOUTUBE = "YOUTUBE",
}

export interface SocialMediaLink {
  socialProvider: SocialProvider;
  url: string;
}
