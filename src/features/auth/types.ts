export interface User {
  id: string;
  role: string;
  email: string;
  image: string | null;
  full_name: string;
  gender: "M" | "F";
  dob: string | null;
  is_verified_doctor: boolean;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  full_name: string;
  email: string;
  password: string;
  password2: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface JWTToken {
  role: string;
  exp: number;
  user_id: string;
}

export interface ResetPasswordConfirmPayload {
  email: string;
  token: string;
  new_password: string;
}
export interface VerifyOTPPayload {
  email: string;
  otp: string;
}
