export interface Report {
  id: number;
  commentId: number;
  reason: string;
  details?: string;
  reportedAt: string;
  status: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface ReportedComment {
  id: number;
  content: string;
  authorName: string;
  provider: string;
  articleId: number;
  createdAt: string;
}
