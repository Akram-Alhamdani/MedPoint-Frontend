import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { loginAPI } from "../services/api";
import type { LoginPayload, LoginResponse } from "../types";
import { useTranslation } from "react-i18next";

/* ---------------------------------- */
/* LOGIN                              */
/* ---------------------------------- */
export const useLogin = () => {
  const { t } = useTranslation();
  return useMutation<LoginResponse, Error, LoginPayload>({
    mutationFn: async ({ email, password }) => {
      try {
        const response = await loginAPI({ email, password });

        const { access, refresh, user } = response.data;
        console.log(user);

        if (user.role !== "D") {
          throw new Error(t("auth.login.only_doctors"));
        }

        return { access, refresh, user };
      } catch (error: any) {
        if (error.response?.data?.detail) {
          throw new Error(t("auth.login.no_active_account_found"));
        } else throw new Error(t("auth.login.unverified_email"));
      }
    },

    onSuccess: ({ access, refresh, user }) => {
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);

      toast.success(t("auth.login.success"));
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });
};
