import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { SocialMediaLink, SocialProvider } from '@/types/social-media-link';
import { Input } from './input';
import { Button } from './button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { X, Facebook, Instagram, Linkedin, Twitter, Youtube, Link2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SocialMediaLinksInputProps {
  value: SocialMediaLink[];
  onChange: (value: SocialMediaLink[]) => void;
}

const socialProviderIcons = {
  [SocialProvider.FACEBOOK]: <Facebook className="h-5 w-5" />,
  [SocialProvider.INSTAGRAM]: <Instagram className="h-5 w-5" />,
  [SocialProvider.LINKEDIN]: <Linkedin className="h-5 w-5" />,
  [SocialProvider.X]: <Twitter className="h-5 w-5" />,
  [SocialProvider.YOUTUBE]: <Youtube className="h-5 w-5" />,
};

export function SocialMediaLinksInput({ value, onChange }: SocialMediaLinksInputProps) {
  const { t } = useTranslation();
  const [links, setLinks] = useState(value || []);
  const { toast } = useToast();

  useEffect(() => {
    setLinks(value || []);
  }, [value]);

  const handleAddLink = () => {
    const newLinks = [...links, { socialProvider: SocialProvider.FACEBOOK, url: '' }];
    setLinks(newLinks);
    onChange(newLinks);
  };

  const handleRemoveLink = (index: number) => {
    const newLinks = links.filter((_, i) => i !== index);
    setLinks(newLinks);
    onChange(newLinks);
    toast({
      title: t("socialLinkRemoved"),
      description: t("socialLinkRemovedSuccess"),
    });
  };

  const handleLinkChange = (index: number, newLink: SocialMediaLink) => {
    const newLinks = links.map((link, i) => (i === index ? newLink : link));
    setLinks(newLinks);
    onChange(newLinks);
  };

  return (
    <div className="space-y-3">
      {links.map((link, index) => (
        <div key={index} className="flex items-center gap-2">
          <Select
            value={link.socialProvider}
            onValueChange={(socialProvider: SocialProvider) => handleLinkChange(index, { ...link, socialProvider })}
          >
            <SelectTrigger className="w-28">
              <SelectValue>
                <div className="flex items-center gap-2">
                  {socialProviderIcons[link.socialProvider]}
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {Object.values(SocialProvider).map((provider) => (
                <SelectItem key={provider} value={provider}>
                  <div className="flex items-center gap-2">
                    {socialProviderIcons[provider]}
                    <span>{provider}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="relative flex-grow">
            <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Enter URL"
              value={link.url}
              onChange={(e) => handleLinkChange(index, { ...link, url: e.target.value })}
              className="pl-10"
            />
          </div>
          <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveLink(index)}>
            <X className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" onClick={handleAddLink} className="w-full">
        Add Social Link
      </Button>
    </div>
  );
}
