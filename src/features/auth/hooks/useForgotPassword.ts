import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { forgotPasswordAPI } from "../services/api";
import type { ForgotPasswordPayload } from "../types";

export const useForgotPassword = () => {
  return useMutation<string, Error, ForgotPasswordPayload>({
    mutationFn: async (payload) => {
      try {
        const response = await forgotPasswordAPI(payload);
        return response.data;
      } catch (error: any) {
        throw new Error(error.response?.data?.detail || "Request failed");
      }
    },

    onSuccess: () => {
      toast.success("Password reset email sent successfully");
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });
};
