// src/pages/AdvertisePage.tsx
import { AdvertiseDataProvider } from "@/features/advertise/contexts/AdvertiseDataProvider";
import { AdvertiseScreen } from "@/features/advertise/screens/AdvertiseScreen";

// No memo - top-level page component
export default function AdvertisePage() {
  return (
    <AdvertiseDataProvider>
      <AdvertiseScreen />
    </AdvertiseDataProvider>
  );
}
