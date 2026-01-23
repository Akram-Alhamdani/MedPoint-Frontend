import { useMutation } from "@tanstack/react-query";
import { registerAPI } from "../services/api";
import { toast } from "sonner";
import type { RegisterPayload } from "../types";
import { useTranslation } from "react-i18next";

/* ---------------------------------- */
/* REGISTER                           */
/* ---------------------------------- */
export const useRegister = () => {
  const { t } = useTranslation();
  return useMutation<any, Error, RegisterPayload>({
    mutationFn: async (payload) => {
      try {
        const response = await registerAPI(payload);
        return response.data;
      } catch (error: any) {
        const data = error.response?.data;
        if (data?.email) throw new Error(data?.email);
        else if (data?.password) throw new Error(data?.password);
        else if (data?.message) {
          if (data?.message.startsWith("User")) {
            throw new Error(t("auth.signup.user_exists"));
          }
        } else throw new Error(t("auth.signup.failed"));
      }
    },

    onError: (error: any) => {
      toast.error(error.message);
    },
  });
};
