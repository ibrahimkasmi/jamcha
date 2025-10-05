// src/features/contact/contexts/ContactDataProvider.tsx
import React, {
  createContext,
  useContext,
  useCallback,
} from "react";
import type { ReactNode } from "react";
import { useMutation } from "@tanstack/react-query";
import type { UseMutationResult } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import type { UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/useToast";
import { t } from "@/lib/i18n";

const contactSchema = z.object({
  name: z.string().min(2, t("contact.validation.name")),
  email: z.string().email(t("contact.validation.email")),
  subject: z.string().min(5, t("contact.validation.subject")),
  message: z.string().min(10, t("contact.validation.message")),
});

type ContactFormData = z.infer<typeof contactSchema>;

interface ContactContextType {
  form: UseFormReturn<ContactFormData>;
  isSubmitted: boolean;
  setIsSubmitted: (value: boolean) => void;
  contactMutation: UseMutationResult<ContactFormData, Error, ContactFormData, unknown>;
  onSubmit: (data: ContactFormData) => void;
}

const ContactContext = createContext<ContactContextType | undefined>(undefined);

export const ContactDataProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const contactMutation = useMutation({
    mutationFn: async (data: ContactFormData) => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return data;
    },
    onSuccess: () => {
      setIsSubmitted(true);
      toast({
        title: t("contact.toast.successTitle"),
        description: t("contact.toast.successDescription"),
      });
      form.reset();
    },
    onError: () => {
      toast({
        title: t("contact.toast.errorTitle"),
        description: t("contact.toast.errorDescription"),
        variant: "destructive",
      });
    },
  });

  // ✅ useCallback ONLY for function passed to form
  const onSubmit = useCallback(
    (data: ContactFormData) => {
      contactMutation.mutate(data);
    },
    [contactMutation]
  );

  // Simple object creation - no useMemo needed
  const contextValue: ContactContextType = {
    form,
    isSubmitted,
    setIsSubmitted,
    contactMutation,
    onSubmit,
  };

  return (
    <ContactContext.Provider value={contextValue}>
      {children}
    </ContactContext.Provider>
  );
};

export const useContactContext = (): ContactContextType => {
  const context = useContext(ContactContext);
  if (!context) {
    throw new Error(
      "useContactContext must be used within ContactDataProvider"
    );
  }
  return context;
};
