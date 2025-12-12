export interface User {
  id: string;
  role: string;
  email: string;
  image: string | null;
  full_name: string;
  gender: "M" | "F";
  dob: string | null;
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

export interface ForgotPasswordPayload {
  email: string;
  domain: string;
}

export interface ResetPasswordConfirmPayload {
  uid: string;
  token: string;
  new_password: string;
}
