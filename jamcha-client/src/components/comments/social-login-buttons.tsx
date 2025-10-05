import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/useToast';
import { t } from '@/lib/i18n';

interface UserData {
  id: string;
  name: string;
  email: string | null;
  avatar: string | null;
  provider: string;
}

interface SocialLoginButtonsProps {
  onLogin: (userData: UserData) => void;
}

export function SocialLoginButtons({ onLogin }: SocialLoginButtonsProps) {
  const { toast } = useToast();
  const [showGuestForm, setShowGuestForm] = useState(false);
  const [guestData, setGuestData] = useState({ name: '', email: '' });

  // Mock social login handlers (in real app, these would use OAuth)
  const handleGoogleLogin = () => {
    // Simulate Google OAuth response
    const userData = {
      id: 'google_' + Math.random().toString(36).substr(2, 9),
      name: 'John Smith',
      email: 'john@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
      provider: 'google'
    };
    onLogin(userData);
  };

  const handleFacebookLogin = () => {
    // Simulate Facebook OAuth response
    const userData = {
      id: 'facebook_' + Math.random().toString(36).substr(2, 9),
      name: 'Sarah Johnson',
      email: 'sarah@facebook.com',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b77c?w=40&h=40&fit=crop&crop=face',
      provider: 'facebook'
    };
    onLogin(userData);
  };

  const handleTwitterLogin = () => {
    // Simulate X/Twitter OAuth response
    const userData = {
      id: 'twitter_' + Math.random().toString(36).substr(2, 9),
      name: 'Mike Chen',
      email: 'mike@twitter.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
      provider: 'twitter'
    };
    onLogin(userData);
  };

  const handleLinkedInLogin = () => {
    // Simulate LinkedIn OAuth response
    const userData = {
      id: 'linkedin_' + Math.random().toString(36).substr(2, 9),
      name: 'Emily Davis',
      email: 'emily@linkedin.com',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
      provider: 'linkedin'
    };
    onLogin(userData);
  };

  const handleGuestLogin = () => {
    if (!guestData.name.trim()) {
      toast({ title: t('socialLogin.toast.nameRequired'), variant: 'destructive' });
      return;
    }

    // Validate email if provided
    if (guestData.email && guestData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(guestData.email.trim())) {
        toast({ title: t('socialLogin.toast.validEmail'), variant: 'destructive' });
        return;
      }
    }

    const userData = {
      id: 'guest_' + Math.random().toString(36).substr(2, 9),
      name: guestData.name.trim(),
      email: guestData.email.trim() || null,
      avatar: null,
      provider: 'guest'
    };
    onLogin(userData);
    setShowGuestForm(false);
    setGuestData({ name: '', email: '' });
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <Button 
          variant="outline" 
          onClick={handleGoogleLogin}
          className="flex items-center space-x-2"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <span>{t('socialLogin.google')}</span>
        </Button>

        <Button 
          variant="outline" 
          onClick={handleFacebookLogin}
          className="flex items-center space-x-2"
        >
          <svg className="w-4 h-4" fill="#1877F2" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          <span>{t('socialLogin.facebook')}</span>
        </Button>

        <Button 
          variant="outline" 
          onClick={handleTwitterLogin}
          className="flex items-center space-x-2"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
          <span>{t('socialLogin.twitter')}</span>
        </Button>

        <Button 
          variant="outline" 
          onClick={handleLinkedInLogin}
          className="flex items-center space-x-2"
        >
          <svg className="w-4 h-4" fill="#0A66C2" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
          <span>{t('socialLogin.linkedin')}</span>
        </Button>
      </div>

      <div className="text-center">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">{t('socialLogin.or')}</span>
          </div>
        </div>
      </div>

      <Dialog open={showGuestForm} onOpenChange={setShowGuestForm}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full">
            {t('socialLogin.continueAsGuest')}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('socialLogin.guestComment')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="guestName">{t('socialLogin.nameLabel')}</Label>
              <Input
                id="guestName"
                value={guestData.name}
                onChange={(e) => setGuestData({ ...guestData, name: e.target.value })}
                placeholder={t('socialLogin.namePlaceholder')}
                required
              />
            </div>
            <div>
              <Label htmlFor="guestEmail">{t('socialLogin.emailLabel')}</Label>
              <Input
                id="guestEmail"
                type="email"
                value={guestData.email}
                onChange={(e) => setGuestData({ ...guestData, email: e.target.value })}
                placeholder={t('socialLogin.emailPlaceholder')}
                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
              />
              {guestData.email && guestData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestData.email.trim()) && (
                <p className="text-sm text-red-500 mt-1">{t('socialLogin.toast.validEmail')}</p>
              )}
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleGuestLogin} className="flex-1">
                {t('socialLogin.continueButton')}
              </Button>
              <Button variant="outline" onClick={() => setShowGuestForm(false)}>
                {t('socialLogin.cancelButton')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <p className="text-xs text-center text-gray-500">
        {t('socialLogin.terms')}
      </p>
    </div>
  );
}