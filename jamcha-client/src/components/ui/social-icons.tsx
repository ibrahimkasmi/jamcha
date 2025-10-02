import { type SocialMediaLink, SocialProvider } from '@/types/social.ts';
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
  FaYoutube,
} from 'react-icons/fa';
import { cn } from '@/lib/utils';

const socialIconMap = {
  [SocialProvider.FACEBOOK]: FaFacebook,
  [SocialProvider.INSTAGRAM]: FaInstagram,
  [SocialProvider.LINKEDIN]: FaLinkedin,
  [SocialProvider.X]: FaTwitter,
  [SocialProvider.YOUTUBE]: FaYoutube,
};

export const SocialIcons = ({ links, className }: { links: SocialMediaLink[], className?: string }) => (
  <div className="flex items-center space-x-2">
    {links.map((link) => {
      const Icon = socialIconMap[link.socialProvider];
      return Icon ? (
        <a
          key={link.id}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className={cn("text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary", className)}
        >
          <Icon className="h-4 w-4" />
        </a>
      ) : null;
    })}
  </div>
);
