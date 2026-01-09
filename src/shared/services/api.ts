import axios, { type InternalAxiosRequestConfig } from "axios";
import { jwtDecode } from "jwt-decode";

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

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const cfg = config;

  if (cfg.skipAuth) return cfg;

  const token = localStorage.getItem("accessToken");

  if (token && cfg.headers) {
    try {
      const decoded: { exp?: number } = jwtDecode(token);
      const now = Date.now() / 1000;

      if (decoded?.exp && decoded.exp > now) {
        cfg.headers.Authorization = `Bearer ${token}`;
      } else {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      }
    } catch {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }
  }

  return cfg;
});

export default api;
