import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/useToast";
import { useNewsletter } from "@/hooks/useNewsletter";
import { t } from "@/lib/i18n";

export function NewsletterForm() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const subscribeMutation = useNewsletter();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      subscribeMutation.mutate(email, {
        onSuccess: () => {
          toast({
            title: t("newsletter.success"),
            duration: 3000,
          });
          setEmail("");
        },
        onError: (error) => {
          toast({
            title: error.message || t("newsletter.error"),
            variant: "destructive",
            duration: 3000,
          });
        },
      });
    }
  };

  return (
    <div className="bg-gradient-to-br from-red-600 to-red-800 text-white p-6 rounded-xl shadow-lg">
      <h3 className="text-xl font-bold mb-2">{t("newsletter.title")}</h3>
      <p className="text-red-100 mb-4">{t("newsletter.description")}</p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          type="email"
          placeholder={t("newsletter.placeholder")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-white/90 text-gray-900 placeholder:text-gray-500 border-0 focus:ring-2 focus:ring-white/50"
          required
        />
        <Button
          type="submit"
          disabled={subscribeMutation.isPending}
          className="w-full bg-white text-red-600 hover:bg-gray-100 hover:text-red-700 font-semibold"
        >
          {subscribeMutation.isPending
            ? t("common.loading")
            : t("common.subscribe")}
        </Button>
      </form>
    </div>
  );
}
