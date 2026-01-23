import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

import { createWorkingHour } from "../api";
import type { WorkingHourPayload } from "../types";

export const useWorkingHoursCreate = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation<void, Error, WorkingHourPayload>({
    mutationFn: async (payload) => {
      await createWorkingHour(payload);
    },
    onSuccess: () => {
      toast.success(t("working_hours.create_success"));
      queryClient.invalidateQueries({
        queryKey: ["working-hours"],
        exact: false,
      });
    },
    onError: () => {
      toast.error(t("working_hours.create_failed"));
    },
  });
};
