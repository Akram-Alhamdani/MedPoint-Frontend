import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { forgotPasswordAPI } from "../services/api";

export const useForgotPassword = () => {
  return useMutation<string, Error, string>({
    mutationFn: async (email) => {
      try {
        const response = await forgotPasswordAPI(email);
        return response.data;
      } catch (error: any) {
        throw new Error(error.response?.data?.detail || "Request failed");
      }
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });
};
