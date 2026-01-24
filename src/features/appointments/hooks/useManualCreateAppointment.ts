import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { manualCreateAppointment } from "../api";
import { useTranslation } from "react-i18next";

export const useManualCreateAppointment = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation<
    any,
    Error,
    { full_name: string; email: string; working_hours: number }
  >({
    mutationFn: async ({ full_name, email, working_hours }) => {
      const { data, status } = await manualCreateAppointment({
        full_name,
        email,
        working_hours: working_hours,
      });
      if (status !== 201)
        throw new Error(t("appointments.create_dialog.create_failed"));
      return data;
    },
    onSuccess: () => {
      toast.success(t("appointments.create_dialog.create_success"));
      queryClient.invalidateQueries({
        queryKey: ["appointments"],
        exact: false,
      });
      queryClient.invalidateQueries({ queryKey: ["dashboard"], exact: false });
    },
    onError: (error) => {
      toast.error(
        error.message || t("appointments.create_dialog.create_failed"),
      );
    },
  });
};
