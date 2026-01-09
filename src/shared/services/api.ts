import axios, { type InternalAxiosRequestConfig } from "axios";
import { refreshAccessToken, isTokenValid } from "@/features/auth/services";

declare module "axios" {
  export interface AxiosRequestConfig {
    skipAuth?: boolean;
  }

  export interface InternalAxiosRequestConfig {
    skipAuth?: boolean;
  }
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  if (config.skipAuth) return config;

  let token = localStorage.getItem("accessToken");
  const refresh = localStorage.getItem("refreshToken");

  // Token expired? try refreshing
  if (!isTokenValid(token) && refresh) {
    try {
      token = await refreshAccessToken();
      localStorage.setItem("accessToken", token);
    } catch {
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      window.location.href = "/doctor/login";
    }
  }

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
