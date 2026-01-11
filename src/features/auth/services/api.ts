import api from "@/shared/services/api";
import type {
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  ResetPasswordConfirmPayload,
} from "../types";

// Login API
export const loginAPI = (payload: LoginPayload) =>
  api.post<LoginResponse>("/auth/token/", payload, { skipAuth: true });

// Register API
export const registerAPI = (payload: RegisterPayload) =>
  api.post("/auth/register/", { ...payload, role: "D" }, { skipAuth: true });

// Refresh token API
export const refreshTokenAPI = (refresh: string) =>
  api.post<LoginResponse>(
    "/auth/token/refresh/",
    { refresh },
    { skipAuth: true }
  );

// Forgot Password API
export const forgotPasswordAPI = (email: string) =>
  api.post("/auth/password/reset/", { email }, { skipAuth: true });

// Reset Password Confirm API
export const resetPasswordConfirmAPI = (payload: ResetPasswordConfirmPayload) =>
  api.post("/auth/password/reset/confirm/", payload, { skipAuth: true });

// Verify Email Verification OTP API
export const verifyEmailOTPAPI = (email: string, otp: string) =>
  api.post("/auth/verify-email/", { email, otp }, { skipAuth: true });

// Resend Email Verification OTP API
export const resendEmailOTPAPI = (email: string) =>
  api.post("/auth/verify-email/resend/", { email }, { skipAuth: true });

// Verify Password Reset OTP API
export const verifyPasswordResetOTPAPI = (email: string, otp: string) =>
  api.post("/auth/password/reset/verify/", { email, otp }, { skipAuth: true });
