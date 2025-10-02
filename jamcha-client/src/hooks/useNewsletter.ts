import { useMutation } from '@tanstack/react-query';
import { t } from '@/lib/i18n';

export function useNewsletter() {
  return useMutation({
    mutationFn: async (email) => {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || t('newsletter.error'));
      }

      return response.json();
    },
  });
}
