import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { deleteSchedule } from "../api";

export const useScheduleDelete = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation<void, Error, number[]>({
    mutationFn: async (scheduleIds) => {
      await deleteSchedule(scheduleIds);
    },
    onSuccess: () => {
      toast.success(t("schedules.delete_dialog.delete_success"));
      queryClient.invalidateQueries({ queryKey: ["schedules"], exact: false });
    },
    onError: () => {
      toast.error(t("schedules.delete_dialog.delete_failed"));
    },
  });
};
