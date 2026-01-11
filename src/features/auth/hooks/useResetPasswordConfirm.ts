import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { resetPasswordConfirmAPI } from "../services/api";
import type { ResetPasswordConfirmPayload } from "../types";
import { useNavigate } from "react-router-dom";

export const useResetPasswordConfirm = () => {
  const navigate = useNavigate();

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
      toast.success("Password was reset successfully!");
      navigate("/doctor/login");
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });
};
