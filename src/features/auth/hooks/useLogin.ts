import { useAppDispatch } from "@/store/hooks";
import { useMutation } from "@tanstack/react-query";
import { setAuth } from "../slice";
import { toast } from "sonner";
import { loginAPI } from "../services/api";
import type { LoginPayload, LoginResponse } from "../types";

/* ---------------------------------- */
/* LOGIN                              */
/* ---------------------------------- */
export const useLogin = () => {
  const dispatch = useAppDispatch();

  return useMutation<LoginResponse, Error, LoginPayload>({
    mutationFn: async ({ email, password }) => {
      try {
        const response = await loginAPI({ email, password });

        const { access, refresh, user } = response.data;

        if (user.role !== "D") {
          throw new Error("Only doctors are allowed");
        }

        return { access, refresh, user };
      } catch (error: any) {
        throw new Error(error.response?.data?.detail || "Login failed");
      }
    },

    onSuccess: ({ access, refresh, user }) => {
      dispatch(
        setAuth({
          accessToken: access,
          refreshToken: refresh,
          user,
        })
      );

      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);

      toast.success("Logged in successfully");
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });
};
