import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { forgotPasswordAPI } from "../services/api";

export const useForgotPassword = () => {
  const { t } = useTranslation();
  return useMutation<string, Error, string>({
    mutationFn: async (email) => {
      try {
        const response = await forgotPasswordAPI(email);
        return response.data;
      } catch (error: any) {
        throw new Error(
          error.response?.data?.detail || t("auth.forgot_password.failed"),
        );
      }
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });
};
