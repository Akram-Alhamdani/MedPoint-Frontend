import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { updateSchedule } from "../api";
import type { SchedulePayload } from "../types";

export const useScheduleUpdate = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation<void, Error, { id: number; data: SchedulePayload }>({
    mutationFn: async ({ id, data }) => {
      await updateSchedule(id, data);
    },
    onSuccess: () => {
      toast.success(t("schedules.update_dialog.update_success"));
      queryClient.invalidateQueries({ queryKey: ["schedules"], exact: false });
    },
    onError: (error) => {
      toast.error(error.message || t("schedules.update_dialog.update_failed"));
    },
  });
};
