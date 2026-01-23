import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { resetPasswordConfirmAPI } from "../services/api";
import type { ResetPasswordConfirmPayload } from "../types";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const useResetPasswordConfirm = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return useMutation<any, Error, ResetPasswordConfirmPayload>({
    mutationFn: async (payload) => {
      try {
        const response = await resetPasswordConfirmAPI(payload);
        return response.data;
      } catch (error: any) {
        throw new Error(error.response?.data?.detail || t("auth.reset.failed"));
      }
    },

    onSuccess: () => {
      toast.success(t("auth.reset.success"));
      navigate("/doctor/login");
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });
};
