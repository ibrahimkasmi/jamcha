// src/pages/CommentsPage.tsx
import { CommentsDataProvider } from "@/features/comments/contexts/CommentsDataProvider";
import { CommentsScreen } from "@/features/comments/screens/CommentsScreen";

// No memo - top-level page component
export default function CommentsPage() {
  return (
    <CommentsDataProvider>
      <CommentsScreen />
    </CommentsDataProvider>
  );
}
