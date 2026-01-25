import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createReviewComment } from "../api";

interface CreateCommentPayload {
    reviewId: number;
    content: string;
}

export const useCreateReviewComment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ reviewId, content }: CreateCommentPayload) => {
            const { data, status } = await createReviewComment(reviewId, content);
            if (status !== 201) throw new Error("Failed to create comment");
            return data;
        },
        onSuccess: () => {
            toast.success("Comment posted");
            queryClient.invalidateQueries({ queryKey: ["reviews"], exact: false });
        },
        onError: (error) => {
            toast.error(error.message || "Could not post comment");
        },
    });
};
