import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { createSchedule } from "../api";
import type { SchedulePayload } from "../types";

export const useScheduleCreate = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation<void, Error, SchedulePayload>({
    mutationFn: async (scheduleData) => {
      await createSchedule(scheduleData);
    },
    onSuccess: () => {
      toast.success(t("schedules.create_dialog.create_success"));
      queryClient.invalidateQueries({ queryKey: ["schedules"], exact: false });
    },
    onError: () => {
      toast.error(t("schedules.create_dialog.create_failed"));
    },
  });
};
