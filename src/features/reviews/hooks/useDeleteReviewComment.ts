import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { deleteReviewComment } from "../api";

export const useDeleteReviewComment = () => {
    const queryClient = useQueryClient();
    const { t } = useTranslation();

    return useMutation({
        mutationFn: async (commentId: number) => {
            const { status } = await deleteReviewComment(commentId);
            if (status !== 204 && status !== 200) {
                throw new Error(t("reviews.delete_comment_error", "Could not delete comment"));
            }
            return commentId;
        },
        onSuccess: () => {
            toast.success(t("reviews.delete_comment_success", "Comment deleted"));
            queryClient.invalidateQueries({ queryKey: ["reviews"], exact: false });
        },
        onError: (error) => {
            const message = error instanceof Error ? error.message : undefined;
            toast.error(message || t("reviews.delete_comment_error", "Could not delete comment"));
        },
    });
};
