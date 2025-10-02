import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertTriangle,
  User,
  MessageSquare,
  XCircle,
  Ban,
  Eye,
  CheckCircle2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";
import { AnimatedDeleteButton } from "@/components/ui/animated-delete-button";

interface CommentReport {
  id: number;
  commentId: number;
  reason: string;
  details?: string;
  reportedAt: string;
  status: string;
  reviewedBy?: string;
  reviewedAt?: string;
  comment?: {
    id: number;
    content: string;
    authorName: string;
    provider: string;
    articleId: number;
    createdAt: string;
  };
}

import { useRequireAuth } from "@/hooks/authGuards";

export default function AdminReports() {
  const { t } = useTranslation();
  useRequireAuth();
  const { toast } = useToast();
  const [selectedReport, setSelectedReport] = useState<CommentReport | null>(
    null,
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<{
    id: number;
    content: string;
  } | null>(null);

  const {
    data: reports = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["/api/comment-reports"],
    queryFn: async () => {
      const response = await fetch("/api/comment-reports", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      if (!response.ok) throw new Error(t("failedToFetchReports"));
      return response.json();
    },
  });

  const updateReportMutation = useMutation({
    mutationFn: async ({
      reportId,
      action,
    }: {
      reportId: number;
      action: string;
    }) => {
      const response = await fetch(`/api/comment-reports/${reportId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jamcha_access_token")}`,
        },
        body: JSON.stringify({ action }),
      });
      if (!response.ok) throw new Error(t("failedToUpdateReport"));
      return response.json();
    },
    onSuccess: () => {
      toast({ title: t("updateSuccess") });
      refetch();
      setIsDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: t("failedToUpdateReport"),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId: number) => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("No authentication token found.");
      }
      const response = await fetch(`/api/comments/${commentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok && response.status !== 204) {
        const errorText = await response.text();
        throw new Error(
          `Failed to delete comment: ${response.status} ${errorText}`
        );
      }
      // No content to return on success
      return;
    },
    onSuccess: () => {
      toast({ title: t("commentDeletedSuccessfully") });
      refetch();
      setIsDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: t("failedToDeleteComment"),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const banUserMutation = useMutation({
    mutationFn: async (providerId: string) => {
      const response = await fetch("/api/admin/ban-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jamcha_access_token")}`,
        },
        body: JSON.stringify({ providerId }),
      });
      if (!response.ok) throw new Error(t("failedToBanUser"));
      return response.json();
    },
    onSuccess: () => {
      toast({ title: t("userBannedSuccessfully") });
      refetch();
      setIsDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: t("failedToBanUser"),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="text-orange-600 border-orange-300"
          >
            {t("pending")}
          </Badge>
        );
      case "reviewed":
        return (
          <Badge variant="outline" className="text-blue-600 border-blue-300">
            {t("reviewed")}
          </Badge>
        );
      case "resolved":
        return (
          <Badge variant="outline" className="text-green-600 border-green-300">
            {t("resolved")}
          </Badge>
        );
      default:
        return <Badge variant="outline">{t(status)}</Badge>;
    }
  };

  const getReasonBadge = (reason: string) => {
    const colors: Record<string, string> = {
      spam: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      harassment: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      hate: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      violence: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      misinformation:
        "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      inappropriate:
        "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
      copyright:
        "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      other: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
    };

    return (
      <Badge className={colors[reason] || colors.other}>
        {t(reason)}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleViewReport = (report: CommentReport) => {
    setSelectedReport(report);
    setIsDialogOpen(true);
  };

  const handleAnimatedDelete = (comment: { id: number; content: string }) => {
    setCommentToDelete(comment);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (commentToDelete) {
      deleteCommentMutation.mutate(commentToDelete.id);
    }
    setDeleteDialogOpen(false);
    setCommentToDelete(null);
  };

  const cancelDelete = () => {
    setDeleteDialogOpen(false);
    setCommentToDelete(null);
  };

  const pendingReports = reports.filter(
    (report: CommentReport) => report.status === "pending",
  );
  const reviewedReports = reports.filter(
    (report: CommentReport) => report.status !== "pending",
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t("reports")}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {t("reportsDescription")}
          </p>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">{t("reports")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reports.length}</div>
          </CardContent>
        </Card>
        <Card >
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              {t("pending")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {pendingReports.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">{t("reviewed")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {reviewedReports.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">{t("thisWeek")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                reports.filter(
                  (r: CommentReport) =>
                    new Date(r.reportedAt) >
                    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                ).length
              }
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Reports */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            <span>{t("pending")} : {pendingReports.length}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">{t("loading")}</div>
          ) : pendingReports.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle2 className="h-12 w-12 mx-auto text-green-500 mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                {t("noPendingReports")}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("reportedBy")}</TableHead>
                    <TableHead className="hidden md:table-cell">{t("reason")}</TableHead>
                    <TableHead className="hidden lg:table-cell">{t("reportedComment")}</TableHead>
                    <TableHead>{t("status")}</TableHead>
                    <TableHead className="hidden lg:table-cell">{t("reportedAt")}</TableHead>
                    <TableHead>{t("actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingReports.map((report: CommentReport) => (
                    <TableRow key={report.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2 gap-2">
                          <User className="h-4 w-4 text-gray-400 flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="font-medium truncate">
                              {report.comment?.authorName || t("unknown")}
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                              {report.comment?.provider || t("guest")}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {getReasonBadge(report.reason)}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="max-w-xs">
                          <p className="text-sm truncate">
                            {report.comment?.content}
                          </p>
                          <p className="text-xs text-gray-500">
                            {t("by")} {report.comment?.authorName}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(report.status)}</TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <span className="text-sm text-gray-500">
                          {formatDate(report.reportedAt)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedReport(report);
                              setIsDialogOpen(true);
                            }}
                            className="flex-shrink-0"
                          >
                            <Eye className="h-4 w-4" />
                            <span className="hidden sm:inline ml-1">{t("view")}</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* All Reports */}
      <Card>
        <CardHeader>
          <CardTitle>{t("allReports")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("id")}</TableHead>
                <TableHead>{t("status")}</TableHead>
                <TableHead>{t("reason")}</TableHead>
                <TableHead>{t("author")}</TableHead>
                <TableHead>{t("reported")}</TableHead>
                <TableHead>{t("reviewedBy")}</TableHead>
                <TableHead>{t("actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report: CommentReport) => (
                <TableRow key={report.id}>
                  <TableCell>#{report.id}</TableCell>
                  <TableCell>{getStatusBadge(report.status)}</TableCell>
                  <TableCell>{getReasonBadge(report.reason)}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>{report.comment?.authorName || t("unknown")}</span>
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(report.reportedAt)}</TableCell>
                  <TableCell>
                    {report.reviewedBy ? (
                      <span className="text-sm">{report.reviewedBy}</span>
                    ) : (
                      <span className="text-sm text-gray-400">{t("emptyValue")}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewReport(report)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      {t("view")}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Report Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2 gap-2 mr-2">
              <MessageSquare className="h-5 w-5" />
              <span>{t("reportDetails", { id: selectedReport?.id })}</span>
            </DialogTitle>
          </DialogHeader>

          {selectedReport && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium">{t("status")}</h4>
                  <div className="mt-1">
                    {getStatusBadge(selectedReport.status)}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium">{t("reason")}</h4>
                  <div className="mt-1">
                    {getReasonBadge(selectedReport.reason)}
                  </div>
                </div>
              </div>

              {selectedReport.details && (
                <div>
                  <h4 className="font-medium">{t("reportDetailsTitle")}</h4>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {selectedReport.details}
                  </p>
                </div>
              )}

              <div>
                <h4 className="font-medium">{t("reportedComment")}</h4>
                <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span className="font-medium">
                        {selectedReport.comment?.authorName}
                      </span>
                      <Badge variant="outline">
                        {selectedReport.comment?.provider}
                      </Badge>
                    </div>
                    <span className="text-sm text-gray-500">
                      {selectedReport.comment?.createdAt &&
                        formatDate(selectedReport.comment.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm">{selectedReport.comment?.content}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">{t("reported")}</span>{" "}
                  {formatDate(selectedReport.reportedAt)}
                </div>
                {selectedReport.reviewedBy && (
                  <div>
                    <span className="font-medium">{t("reviewedBy")}</span>{" "}
                    {selectedReport.reviewedBy}
                  </div>
                )}
              </div>

              {selectedReport.status === "pending" && (
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() =>
                      updateReportMutation.mutate({
                        reportId: selectedReport.id,
                        action: "dismiss",
                      })
                    }
                    disabled={updateReportMutation.isPending}
                    className="w-full sm:w-auto"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    {t("dismissReport")}
                  </Button>

                  {selectedReport.comment?.id && (
                    <AnimatedDeleteButton
                      onAnimatedClick={() =>
                        handleAnimatedDelete({
                          id: selectedReport.comment!.id,
                          content: selectedReport.comment!.content,
                        })
                      }
                      disabled={deleteCommentMutation.isPending}
                      className="text-red-600 hover:text-red-700 w-full sm:w-auto"
                    />
                  )}

                  <Button
                    variant="destructive"
                    onClick={() => {
                      if (
                        selectedReport.comment?.provider &&
                        confirm(
                          t("banUserConfirm")
                        )
                      ) {
                        banUserMutation.mutate(
                          `${selectedReport.comment.provider}_user_id`,
                        );
                      }
                    }}
                    disabled={banUserMutation.isPending}
                    className="w-full sm:w-auto"
                  >
                    <Ban className="h-4 w-4 mr-2" />
                    {t("banUser")}
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        title={t("deleteCommentTitle")}
        description={t("deleteCommentDescription", { content: `${commentToDelete?.content?.substring(0, 100)}${commentToDelete?.content && commentToDelete.content.length > 100 ? "..." : ""}` })}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        confirmText={t("deleteCommentConfirm")}
        cancelText={t("cancel")}
      />
    </div>
  );
}
