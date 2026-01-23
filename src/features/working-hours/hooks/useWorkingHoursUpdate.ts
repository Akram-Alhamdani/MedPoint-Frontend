import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { updateWorkingHour } from "../api";
import type { WorkingHourPayload } from "../types";
import { useTranslation } from "react-i18next";

export const useWorkingHoursUpdate = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation<void, Error, { id: number; data: WorkingHourPayload }>({
    mutationFn: async ({ id, data }) => {
      await updateWorkingHour(id, data);
    },
    onSuccess: () => {
      toast.success(t("working_hours.update_success"));
      queryClient.invalidateQueries({
        queryKey: ["working-hours"],
        exact: false,
      });
    },
    onError: () => {
      toast.error(t("working_hours.update_failed"));
    },
  });
};
