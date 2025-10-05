// src/features/advertise/contexts/AdvertiseDataProvider.tsx
import React, {
  createContext,
  useContext,
  useCallback,
  useMemo,
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

const advertiseSchema = z.object({
  company: z.string().min(2, t("advertise.validation.company")),
  name: z.string().min(2, t("advertise.validation.name")),
  email: z.string().email(t("advertise.validation.email")),
  phone: z.string().min(8, t("advertise.validation.phone")),
  adType: z.string().min(1, t("advertise.validation.adType")),
  budget: z.string().min(1, t("advertise.validation.budget")),
  message: z.string().min(10, t("advertise.validation.message")),
});

type AdvertiseFormData = z.infer<typeof advertiseSchema>;

interface AdvertiseContextType {
  form: UseFormReturn<AdvertiseFormData>;
  isSubmitted: boolean;
  setIsSubmitted: (value: boolean) => void;
  advertiseMutation: UseMutationResult<AdvertiseFormData, Error, AdvertiseFormData, unknown>;
  onSubmit: (data: AdvertiseFormData) => void;
  adTypes: Array<{ value: string; label: string }>;
  budgetRanges: Array<{ value: string; label: string }>;
}

const AdvertiseContext = createContext<AdvertiseContextType | undefined>(
  undefined
);

export const AdvertiseDataProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const form = useForm<AdvertiseFormData>({
    resolver: zodResolver(advertiseSchema),
    defaultValues: {
      company: "",
      name: "",
      email: "",
      phone: "",
      adType: "",
      budget: "",
      message: "",
    },
  });

  const advertiseMutation = useMutation({
    mutationFn: async (data: AdvertiseFormData) => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return data;
    },
    onSuccess: () => {
      setIsSubmitted(true);
      toast({
        title: t("advertise.toast.successTitle"),
        description: t("advertise.toast.successDescription"),
      });
      form.reset();
    },
    onError: () => {
      toast({
        title: t("advertise.toast.errorTitle"),
        description: t("advertise.toast.errorDescription"),
        variant: "destructive",
      });
    },
  });

  // ✅ useCallback ONLY for function passed to form
  const onSubmit = useCallback(
    (data: AdvertiseFormData) => {
      advertiseMutation.mutate(data);
    },
    [advertiseMutation]
  );

  // ✅ useMemo for dropdown options - prevents recreation on every render
  const adTypes = useMemo(
    () => [
      { value: "banner", label: t("advertise.option1.title") },
      { value: "article", label: t("advertise.option2.title") },
      { value: "video", label: t("advertise.option3.title") },
      { value: "social", label: t("advertise.option4.title") },
    ],
    []
  );

  const budgetRanges = useMemo(
    () => [
      { value: "1000-5000", label: t("advertise.budget.range1") },
      { value: "5000-10000", label: t("advertise.budget.range2") },
      { value: "10000-25000", label: t("advertise.budget.range3") },
      { value: "25000+", label: t("advertise.budget.range4") },
    ],
    []
  );

  // Simple object creation - no useMemo needed
  const contextValue: AdvertiseContextType = {
    form,
    isSubmitted,
    setIsSubmitted,
    advertiseMutation: advertiseMutation as UseMutationResult<AdvertiseFormData, Error, AdvertiseFormData, unknown>,
    onSubmit,
    adTypes,
    budgetRanges,
  };

  return (
    <AdvertiseContext.Provider value={contextValue}>
      {children}
    </AdvertiseContext.Provider>
  );
};

export const useAdvertiseContext = (): AdvertiseContextType => {
  const context = useContext(AdvertiseContext);
  if (!context) {
    throw new Error(
      "useAdvertiseContext must be used within AdvertiseDataProvider"
    );
  }
  return context;
};
