import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { verifyPasswordResetOTPAPI } from "../services/api";
import type { VerifyOTPPayload } from "../types";

/* ---------------------------------- */
/* VERIFY PASSWORD RESET OTP          */
/* ---------------------------------- */
export const useVerifyPasswordResetOTP = () => {
  const { t } = useTranslation();
  return useMutation<any, Error, VerifyOTPPayload>({
    mutationFn: async ({ email, otp }) => {
      try {
        const response = await verifyPasswordResetOTPAPI(email, otp);
        return response.data;
      } catch (error: any) {
        throw new Error(t("auth.otp.invalid_or_expired"));
      }
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });
};
