import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { resendEmailOTPAPI } from "../services/api";

/* ---------------------------------- */
/* RESEND EMAIL OTP                   */
/* ---------------------------------- */
export const useResendEmailOTP = () => {
  const { t } = useTranslation();
  return useMutation<string, Error, string>({
    mutationFn: async (email) => {
      try {
        const response = await resendEmailOTPAPI(email);
        return response.data;
      } catch (error: any) {
        throw new Error(t("auth.otp.resend_failed"));
      }
    },
    onSuccess: () => {
      toast.success(t("auth.otp.resent_success"));
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
