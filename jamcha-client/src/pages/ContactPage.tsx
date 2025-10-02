// src/pages/ContactPage.tsx
import { ContactDataProvider } from "@/features/contact/contexts/ContactDataProvider";
import { ContactScreen } from "@/features/contact/screens/ContactScreen";

// No memo - top-level page component
export default function ContactPage() {
  return (
    <ContactDataProvider>
      <ContactScreen />
    </ContactDataProvider>
  );
}
