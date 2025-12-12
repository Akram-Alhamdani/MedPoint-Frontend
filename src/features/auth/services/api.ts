import api from "@/shared/services/api";
import type {
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  ForgotPasswordPayload,
  ResetPasswordConfirmPayload,
} from "../types";

// Login API
export const loginAPI = (payload: LoginPayload) =>
  api.post<LoginResponse>("/auth/token/", payload);

// Register API
export const registerAPI = (payload: RegisterPayload) =>
  api.post("/auth/register/", { ...payload, role: "D" });

// Refresh token API
export const refreshTokenAPI = (refresh: string) =>
  api.post<LoginResponse>("/auth/token/refresh/", { refresh });

// Forgot Password API
export const forgotPasswordAPI = (payload: ForgotPasswordPayload) =>
  api.post("/auth/password/reset/", payload);

// Reset Password Confirm API
export const resetPasswordConfirmAPI = (payload: ResetPasswordConfirmPayload) =>
  api.post("/auth/password/reset/confirm/", payload);
