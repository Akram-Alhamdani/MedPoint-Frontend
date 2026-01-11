import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { verifyEmailOTPAPI } from "../services/api";
import type { VerifyOTPPayload } from "../types";
import { useNavigate } from "react-router-dom";

/* ---------------------------------- */
/* VERIFY EMAIL                         */
/* ---------------------------------- */
export const useVerifyEmailOTP = () => {
  const navigate = useNavigate();
  return useMutation<string, Error, VerifyOTPPayload>({
    mutationFn: async ({ email, otp }) => {
      try {
        const response = await verifyEmailOTPAPI(email, otp);
        return response.data;
      } catch (error: any) {
        throw new Error("Invalid OTP or expired. Please request a new one.");
      }
    },
    onSuccess: () => {
      toast.success("Email verified successfully! You can now log in.");
      navigate("/doctor/login");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
