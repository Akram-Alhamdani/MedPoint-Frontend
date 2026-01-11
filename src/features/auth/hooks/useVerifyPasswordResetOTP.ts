import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { verifyPasswordResetOTPAPI } from "../services/api";
import type { VerifyOTPPayload } from "../types";

/* ---------------------------------- */
/* VERIFY PASSWORD RESET OTP          */
/* ---------------------------------- */
export const useVerifyPasswordResetOTP = () => {
  return useMutation<any, Error, VerifyOTPPayload>({
    mutationFn: async ({ email, otp }) => {
      try {
        const response = await verifyPasswordResetOTPAPI(email, otp);
        return response.data;
      } catch (error: any) {
        throw new Error("Invalid OTP or expired. Please request a new one.");
      }
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });
};
