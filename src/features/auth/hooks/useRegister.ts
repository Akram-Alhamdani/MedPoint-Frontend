import { useMutation } from "@tanstack/react-query";
import { registerAPI } from "../services/api";
import { toast } from "sonner";
import type { RegisterPayload } from "../types";

/* ---------------------------------- */
/* REGISTER                           */
/* ---------------------------------- */
export const useRegister = () => {
  return useMutation<any, Error, RegisterPayload>({
    mutationFn: async (payload) => {
      try {
        const response = await registerAPI(payload);
        return response.data;
      } catch (error: any) {
        const data = error.response?.data;

        if (data?.email) throw new Error(data?.email);
        else if (data?.password) throw new Error(data?.password);
        else if (data?.detail) throw new Error(data?.detail);
        else throw new Error("Registration failed. Please try again.");
      }
    },

    onSuccess: () => {
      toast.success("Registered successfully");
    },

    onError: (error: any) => {
      toast.error(error.message);
    },
  });
};
