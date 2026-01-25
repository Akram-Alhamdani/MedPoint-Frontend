import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateReviewComment } from "../api";

interface UpdateCommentPayload {
    commentId: number;
    content: string;
}

export const useUpdateReviewComment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ commentId, content }: UpdateCommentPayload) => {
            const { data, status } = await updateReviewComment(commentId, content);
            if (status !== 200) throw new Error("Failed to update comment");
            return data;
        },
        onSuccess: () => {
            toast.success("Comment updated");
            queryClient.invalidateQueries({ queryKey: ["reviews"], exact: false });
        },
        onError: (error) => {
            toast.error(error.message || "Could not update comment");
        },
    });
};
