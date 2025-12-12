import { refreshTokenAPI } from "./api";
import { jwtDecode } from "jwt-decode";

/* ---------------------------------- */
/* REFRESH TOKEN                      */
/* ---------------------------------- */
export const refreshAccessToken = async (): Promise<string> => {
  const storedRefresh = localStorage.getItem("refreshToken");
  if (!storedRefresh) throw new Error("No refresh token");

  const response = await refreshTokenAPI(storedRefresh);
  const { access } = response.data;

  localStorage.setItem("accessToken", access);

  return access;
};

/* ---------------------------------- */
/* VALIDATE TOKEN              */
/* ---------------------------------- */
export const isTokenValid = (token: string | null) => {
  if (!token) return false;

  try {
    const decoded: { exp: number } = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime;
  } catch {
    return false;
  }
};
