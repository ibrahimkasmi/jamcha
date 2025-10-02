// src/features/contact/hooks/useContactData.ts
import { useContactContext } from "../contexts/ContactDataProvider";

export const useContactData = () => {
  const context = useContactContext();

  // Simple boolean operations - no useMemo needed
  const isLoading = context.contactMutation.isPending;
  const hasError = !!context.contactMutation.error;

  return {
    ...context,
    isLoading,
    hasError,
  };
};
