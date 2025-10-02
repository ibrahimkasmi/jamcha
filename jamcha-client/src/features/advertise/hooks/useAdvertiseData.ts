// src/features/advertise/hooks/useAdvertiseData.ts
import { useAdvertiseContext } from "../contexts/AdvertiseDataProvider";

export const useAdvertiseData = () => {
  const context = useAdvertiseContext();

  // Simple boolean operations - no useMemo needed
  const isLoading = context.advertiseMutation.isPending;
  const hasError = !!context.advertiseMutation.error;

  return {
    ...context,
    isLoading,
    hasError,
  };
};
