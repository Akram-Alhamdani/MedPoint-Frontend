import { toast } from "sonner";
import { useTranslation } from "react-i18next";

/* ---------------------------------- */
/* LOGOUT                             */
/* ---------------------------------- */
export const useLogout = () => {
  const { t } = useTranslation();
  return () => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    toast.success(t("auth.logout.success"));
    window.location.href = "/doctor/login";
  };
};
