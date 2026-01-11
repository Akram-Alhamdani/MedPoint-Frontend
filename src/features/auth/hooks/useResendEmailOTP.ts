import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { resendEmailOTPAPI } from "../services/api";

/* ---------------------------------- */
/* RESEND EMAIL OTP                   */
/* ---------------------------------- */
export const useResendEmailOTP = () => {
  return useMutation<string, Error, string>({
    mutationFn: async (email) => {
      try {
        const response = await resendEmailOTPAPI(email);
        return response.data;
      } catch (error: any) {
        throw new Error(
          "Failed to resend verification code. Please try again."
        );
      }
    },
    onSuccess: () => {
      toast.success("Verification code resent successfully.");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
