import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { verifyEmailOTPAPI } from "../services/api";
import type { VerifyOTPPayload } from "../types";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

/* ---------------------------------- */
/* VERIFY EMAIL                         */
/* ---------------------------------- */
export const useVerifyEmailOTP = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return useMutation<string, Error, VerifyOTPPayload>({
    mutationFn: async ({ email, otp }) => {
      try {
        const response = await verifyEmailOTPAPI(email, otp);
        return response.data;
      } catch (error: any) {
        throw new Error(t("auth.otp.invalid_or_expired"));
      }
    },
    onSuccess: () => {
      toast.success(t("auth.otp.verified"));
      navigate("/doctor/login");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
