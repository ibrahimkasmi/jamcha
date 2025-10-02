// src/pages/CategoryPage.tsx
import { CategoryDataProvider } from "@/features/category/contexts/CategoryDataProvider";
import { CategoryScreen } from "@/features/category/screens/CategoryScreen";

// No memo - top-level page component
export default function CategoryPage() {
  return (
    <CategoryDataProvider>
      <CategoryScreen />
    </CategoryDataProvider>
  );
}
