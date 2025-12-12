import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { resetPasswordConfirmAPI } from "../services/api";
import type { ResetPasswordConfirmPayload } from "../types";

export const useResetPasswordConfirm = () => {
  return useMutation<any, Error, ResetPasswordConfirmPayload>({
    mutationFn: async (payload) => {
      try {
        const response = await resetPasswordConfirmAPI(payload);
        return response.data;
      } catch (error: any) {
        throw new Error(
          error.response?.data?.detail || "Password reset failed"
        );
      }
    },

    onSuccess: () => {
      toast.success("Password reset successfully! You can now log in.");
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });
};
