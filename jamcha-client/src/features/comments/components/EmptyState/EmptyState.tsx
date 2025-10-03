// src/features/comments/components/EmptyState/EmptyState.tsx

import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import { t } from "@/lib/i18n";

interface EmptyStateProps {
  searchTerm: string;
}

// No memo - simple component
export const EmptyState = ({ searchTerm }: EmptyStateProps) => (
  <Card>
    <CardContent className="text-center py-12">
      <MessageSquare className="h-16 w-16 mx-auto text-gray-400 mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {t("commentsPage.noCommentsFound")}
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        {searchTerm
          ? t("commentsPage.noCommentsFoundDescription")
          : t("commentsPage.beFirstToComment")}
      </p>
    </CardContent>
  </Card>
);
