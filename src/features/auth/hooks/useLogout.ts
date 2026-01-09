import { toast } from "sonner";

/* ---------------------------------- */
/* LOGOUT                             */
/* ---------------------------------- */
export const useLogout = () => {
  return () => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    toast.success("Logged out successfully");
    window.location.href = "/doctor/login";
  };
};
