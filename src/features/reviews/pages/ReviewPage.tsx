import React, { useState } from "react";
import Pagination from "@/shared/components/Pagination";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/shared/components/ui/dropdown-menu";
import { IconStar, IconDots, IconSend } from "@tabler/icons-react";
import {
  useCreatePatientReport,
  useCreateReviewComment,
  useReviews,
  useUpdateReviewComment,
} from "../hooks";
import type { Review, ReviewComment } from "../api";
import { toast } from "sonner";
import { Spinner } from "@/shared/components/ui/spinner";

// --- Shared Components ---

const getPatientIdFromReview = (review: Review): number | null => {
  const patientId = review.patient?.id;
  if (typeof patientId === "number") return patientId;

  const userId = review.patient?.user?.id;
  const parsedUserId = userId ? Number(userId) : NaN;
  return Number.isFinite(parsedUserId) ? parsedUserId : null;
};

const getCurrentUserId = (): string | null => {
  const raw = localStorage.getItem("user");
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    const id = parsed?.id ?? parsed?.user?.id;
    return id ? String(id) : null;
  } catch (error) {
    console.error("Failed to parse user from localStorage", error);
    return null;
  }
};

interface CommentFormProps {
  initialValue?: string;
  onSubmit: (content: string) => void | Promise<void>;
  onCancel?: () => void;
  placeholder?: string;
  buttonText?: string;
  isSubmitting?: boolean;
}

function CommentForm({
  initialValue = "",
  onSubmit,
  onCancel,
  placeholder,
  buttonText,
  isSubmitting = false,
}: CommentFormProps) {
  const { t } = useTranslation();
  const [content, setContent] = useState(initialValue);
  const resolvedPlaceholder = placeholder ?? t("reviews.comment_placeholder");
  const resolvedButtonText = buttonText || t("reviews.send");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    await onSubmit(content);
    if (!initialValue) setContent("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 mt-4">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={resolvedPlaceholder}
        className="min-h-[100px] resize-none focus-visible:ring-primary"
      />
      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="outline" size="sm" onClick={onCancel}>
            {t("reviews.cancel")}
          </Button>
        )}
        <Button size="sm" disabled={!content.trim() || isSubmitting}>
          {isSubmitting ? (
            <span className="inline-flex items-center gap-2">
              <IconSend size={16} className="animate-pulse" />
              {t("reviews.sending")}
            </span>
          ) : (
            <span className="inline-flex items-center gap-2">
              <IconSend size={16} />
              {resolvedButtonText}
            </span>
          )}
        </Button>
      </div>
    </form>
  );
}

export default function ReviewPage() {
  // --- Main Page Components ---

  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { data: reviews, isPending } = useReviews(page, pageSize);
  const hasNoReviews =
    !reviews || !reviews.results || reviews.results.length === 0;
  const totalPages = reviews?.total_pages || 1;

  if (isPending) {
    return (
      <Spinner className="absolute left-1/2 top-1/2 size-10 -translate-x-1/2 -translate-y-1/2" />
    );
  }
  return (
    <div className="w-full min-h-screen p-6 bg-slate-50/50">
      <div className="max-w-7xl mx-auto space-y-6">
        {hasNoReviews ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-400">
            <span className="text-xl font-semibold mt-6 mb-2 text-slate-500">
              {t("reviews.no_reviews")}
            </span>
            <span className="text-base text-slate-400">
              {t(
                "reviews.no_reviews_description",
                "There are currently no reviews to display. Once you receive reviews, they will appear here.",
              )}
            </span>
          </div>
        ) : (
          <>
            {reviews?.results.map((review: Review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
            <div className="flex justify-center pt-8">
              <Pagination
                pageNumber={page}
                pageSize={pageSize}
                totalPages={totalPages}
                onPageChange={setPage}
                onPageSizeChange={setPageSize}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  const { t } = useTranslation();
  const { mutate: createComment, isPending: isCreating } =
    useCreateReviewComment();
  const { mutate: createReport, isPending: isReporting } =
    useCreatePatientReport();
  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");

  const handleCreateComment = async (content: string) => {
    return createComment({ reviewId: review.id, content });
  };

  const patientId = getPatientIdFromReview(review);

  console.log("Patient ID for review:", patientId);
  const handleSubmitReport = () => {
    console.log("Submitting report for patient ID:", patientId);
    if (patientId == null || Number.isNaN(patientId)) {
      toast.error(t("reviews.patient_id_missing"));
      return;
    }
    if (!reportReason.trim()) return;

    return createReport(
      { patientId, reason: reportReason.trim() },
      {
        onSuccess: () => {
          setReportReason("");
          setReportOpen(false);
        },
      },
    );
  };

  return (
    <Card className="w-full shadow-sm border-none ring-1 ring-slate-200">
      <CardContent className="p-6 space-y-6">
        {/* Review Header & Content */}
        <div className="flex gap-4">
          <Avatar className="h-12 w-12 border">
            <AvatarImage src={review.patient.user.image} />
            <AvatarFallback>
              {review.patient.user.full_name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold text-slate-900">
                  {review.patient.user.full_name}
                </h4>
                <div className="flex gap-0.5 text-yellow-500 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <IconStar
                      key={i}
                      size={14}
                      fill={i < review.rating ? "currentColor" : "none"}
                      className={i < review.rating ? "" : "text-slate-300"}
                    />
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">
                  {new Date(review.created_at).toLocaleDateString()}
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-1.5 rounded-md hover:bg-slate-100 transition-colors">
                      <IconDots size={20} className="text-slate-500" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      {t("reviews.report_review")}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setReportOpen(true)}>
                      {t("reviews.report_patient")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-slate-700">
              {review.content}
            </p>
          </div>
        </div>

        <Dialog open={reportOpen} onOpenChange={setReportOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("reviews.report_patient")}</DialogTitle>
              <DialogDescription>
                {t("reviews.report_patient_description_review")}
              </DialogDescription>
            </DialogHeader>
            <Textarea
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              placeholder={t("reviews.report_reason_placeholder")}
              className="min-h-[120px]"
            />
            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setReportOpen(false)}
              >
                {t("reviews.cancel")}
              </Button>
              <Button
                onClick={handleSubmitReport}
                disabled={!reportReason.trim() || isReporting}
              >
                {isReporting
                  ? t("reviews.submitting")
                  : t("reviews.submit_report")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Existing Comments/Replies */}
        <div className="ml-16 space-y-4">
          {review.comments.length > 0 && (
            <div className="bg-slate-50/80 rounded-xl p-4 space-y-4 border border-slate-100">
              {review.comments.map((comment) => (
                <ReplySection
                  key={comment.id}
                  comment={comment}
                  patientId={patientId}
                />
              ))}
            </div>
          )}

          {/* New Comment Input */}
          <div className="pt-2">
            <h5 className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">
              {t("reviews.leave_reply")}
            </h5>
            <CommentForm
              onSubmit={handleCreateComment}
              placeholder={t("reviews.response_placeholder")}
              isSubmitting={isCreating}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ReplySection({
  comment,
  patientId,
}: {
  comment: ReviewComment;
  patientId: number | null;
}) {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const { mutate: updateComment, isPending: isUpdating } =
    useUpdateReviewComment();
  const { mutate: createReport, isPending: isReporting } =
    useCreatePatientReport();
  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const currentUserId = getCurrentUserId();
  const canEdit = currentUserId
    ? String(comment.user.id) === String(currentUserId)
    : false;
  const isAuthor = canEdit;
  const canReport = patientId && !isAuthor;

  const handleUpdateComment = async (content: string) => {
    return updateComment(
      { commentId: comment.id, content },
      {
        onSuccess: () => setIsEditing(false),
      },
    );
  };

  const handleSubmitReport = () => {
    if (patientId == null || Number.isNaN(patientId)) {
      toast.error(t("reviews.patient_id_missing"));
      return;
    }
    if (isAuthor) {
      toast.error(t("reviews.cannot_report_self"));
      return;
    }
    if (!reportReason.trim()) return;

    return createReport(
      { patientId, reason: reportReason.trim() },
      {
        onSuccess: () => {
          setReportReason("");
          setReportOpen(false);
        },
      },
    );
  };

  return (
    <div className="group relative">
      <div className="flex gap-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={comment.user.image} />
          <AvatarFallback className="text-[10px]">
            {comment.user.full_name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-900">
                {comment.user.full_name}
              </span>
              <span className="text-[10px] text-slate-400">
                {new Date(comment.created_at).toLocaleDateString()}
              </span>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-slate-200 transition-all">
                  <IconDots size={16} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {canEdit && (
                  <DropdownMenuItem onClick={() => setIsEditing(true)}>
                    {t("reviews.edit_comment")}
                  </DropdownMenuItem>
                )}
                {canReport ? (
                  <DropdownMenuItem onClick={() => setReportOpen(true)}>
                    {t("reviews.report_patient")}
                  </DropdownMenuItem>
                ) : null}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {isEditing ? (
            <CommentForm
              initialValue={comment.content}
              buttonText={t("reviews.update")}
              onSubmit={handleUpdateComment}
              onCancel={() => setIsEditing(false)}
              isSubmitting={isUpdating}
            />
          ) : (
            <p className="text-sm text-slate-600 leading-normal">
              {comment.content}
            </p>
          )}
        </div>
      </div>

      <Dialog open={reportOpen} onOpenChange={setReportOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report patient</DialogTitle>
            <DialogDescription>
              {t("reviews.report_patient_description_comment")}
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={reportReason}
            onChange={(e) => setReportReason(e.target.value)}
            placeholder={t("reviews.report_reason_placeholder")}
            className="min-h-[120px]"
          />
          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setReportOpen(false)}
            >
              {t("reviews.cancel")}
            </Button>
            <Button
              onClick={handleSubmitReport}
              disabled={!reportReason.trim() || isReporting}
            >
              {isReporting
                ? t("reviews.submitting")
                : t("reviews.submit_report")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
